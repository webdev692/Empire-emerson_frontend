import assert from 'node:assert/strict';
import test from 'node:test';
import { createLearningClient, parseDashboard, parseProgram } from './learningClient.ts';
import { PortalRequestError } from './client.ts';

const ids = { program: '10000000-0000-4000-8000-000000000001', other: '10000000-0000-4000-8000-000000000002',
  enrollment: '20000000-0000-4000-8000-000000000001', first: '30000000-0000-4000-8000-000000000001',
  second: '30000000-0000-4000-8000-000000000002', assignment: '30000000-0000-4000-8000-000000000003' };
const at = '2026-10-24T12:00:00.000Z';
const program = () => ({ id: ids.program, enrollment_id: ids.enrollment, title: 'Synthetic learning', summary: 'Practice curriculum.',
  status: 'active', starts_at: at, ends_at: '2026-11-24T12:00:00.000Z', completed_items: 1, total_items: 2, progress_percent: 50, next_item_id: ids.second });
const dashboard = () => ({ success: true, environment: 'synthetic-local', learner_id: 2, generated_at: at,
  summary: { active_programs: 1, completed_items: 1, total_items: 2, progress_percent: 50 }, programs: [program()],
  upcoming: [{ id: ids.second, program_id: ids.program, program_title: 'Synthetic learning', title: 'Next lesson', kind: 'lesson', due_at: at, status: 'not_started' }],
  feedback: [{ id: ids.first, program_id: ids.program, program_title: 'Synthetic learning', title: 'Practice feedback', comment: 'Try another draft.', mentor_label: 'SYNTHETIC mentor', created_at: at }],
  resources: [{ id: ids.first, program_id: ids.program, title: 'Practice guide', description: 'A local resource.', body: 'Read and reflect.' }] });
const detail = () => ({ success: true, environment: 'synthetic-local', learner_id: 2, program: { ...program(), items: [
  { id: ids.first, title: 'First lesson', kind: 'lesson', description: 'Practice one.', content: 'Read this first.', due_at: at, status: 'completed', completed_at: at },
  { id: ids.second, title: 'Second lesson', kind: 'lesson', description: 'Practice two.', content: 'Read this next.', due_at: at, status: 'not_started', completed_at: null },
  { id: ids.assignment, title: 'Assignment', kind: 'assignment', description: 'Preview work.', content: 'No submission.', due_at: at, status: 'not_started', completed_at: null },
] } });

test('dashboard preserves only the documented own-learner fields and accepts a real empty result', () => {
  const data = dashboard(); data.extra_private_record = 'not retained'; data.programs[0].roster = 'not retained';
  const parsed = parseDashboard(data, 2);
  assert.equal('extra_private_record' in parsed, false); assert.equal('roster' in parsed.programs[0], false);
  const empty = dashboard(); empty.programs = []; empty.upcoming = []; empty.feedback = []; empty.resources = [];
  empty.summary = { active_programs: 0, completed_items: 0, total_items: 0, progress_percent: 0 };
  assert.equal(parseDashboard(empty, 2).programs.length, 0);
});

test('wrong learner, mode, scope references and contradictory progress are rejected', () => {
  for (const alter of [v => { v.learner_id = 3; }, v => { v.environment = 'production'; },
    v => { v.upcoming[0].program_id = ids.other; }, v => { v.resources[0].program_id = ids.other; },
    v => { v.feedback[0].program_title = 'Another program'; }, v => { v.summary.completed_items = 2; },
    v => { v.programs[0].progress_percent = 99; }, v => { v.programs.push(v.programs[0]); }]) {
    const invalid = dashboard(); alter(invalid); assert.throws(() => parseDashboard(invalid, 2), PortalRequestError);
  }
});

test('program details validate requested ID and count only completed lessons', () => {
  const parsed = parseProgram(detail(), 2, ids.program);
  assert.equal(parsed.program.items.length, 3); assert.equal(parsed.program.total_items, 2); assert.equal(parsed.program.progress_percent, 50);
  assert.throws(() => parseProgram(detail(), 2, ids.other), PortalRequestError);
  for (const alter of [p => { p.total_items = 3; p.progress_percent = 33; }, p => { p.next_item_id = ids.first; },
    p => { p.items[1].completed_at = at; }, p => { p.items.push(p.items[0]); }]) {
    const invalid = detail(); alter(invalid.program); assert.throws(() => parseProgram(invalid, 2, ids.program), PortalRequestError);
  }
});

test('learning transport is cookie-backed, selector-free and CSRF-protected for lesson completion', async () => {
  const calls = [];
  const csrf = 'c'.repeat(43);
  const client = createLearningClient(async (url, options) => {
    calls.push({ url, options });
    return Response.json(url.endsWith('/complete') ? { success: true, item_id: ids.second, completed_at: at, already_completed: false } : url.endsWith('/dashboard') ? dashboard() : detail());
  });
  await client.loadDashboard(2); await client.loadProgram(ids.program, 2); await client.completeItem(ids.second, csrf);
  assert.deepEqual(calls.map(c => c.url), ['http://127.0.0.1:58000/api/learner/dashboard', `http://127.0.0.1:58000/api/learner/programs/${ids.program}`, `http://127.0.0.1:58000/api/learner/items/${ids.second}/complete`]);
  for (const { options } of calls) { assert.equal(options.credentials, 'include'); assert.equal(options.cache, 'no-store'); assert.equal(options.referrerPolicy, 'no-referrer'); assert.equal(options.headers.Authorization, undefined); }
  assert.equal(calls[2].options.method, 'POST'); assert.equal(calls[2].options.headers['X-CSRF-Token'], csrf);
  assert.equal(calls[2].options.headers['X-EPDG-Request'], 'portal'); assert.equal(calls[2].options.body, '{}');
});

test('invalid identifiers/CSRF never send requests; a response cannot complete another item', async () => {
  let requests = 0;
  const client = createLearningClient(async () => { requests++; return Response.json({ success: true, item_id: ids.first, completed_at: at, already_completed: true }); });
  await assert.rejects(client.loadProgram('../other', 2), e => e.status === 404);
  await assert.rejects(client.completeItem(ids.second, 'forged'), e => e.status === 403);
  assert.equal(requests, 0);
  await assert.rejects(client.completeItem(ids.second, 'c'.repeat(43)), e => e.status === 502);
});

test('authentication and unavailable errors retain status without reflecting private API messages', async () => {
  for (const status of [401, 403, 404, 500, 503]) {
    const client = createLearningClient(async () => Response.json({ message: 'private backend detail' }, { status }));
    await assert.rejects(client.loadDashboard(2), e => e.status === status && !e.message.includes('private backend detail'));
  }
  const offline = createLearningClient(async () => { throw new Error('private connection detail'); });
  await assert.rejects(offline.loadDashboard(2), e => e.status === 0 && !e.message.includes('private connection detail'));
});

test('assignment draft/submitted states do not change lesson progress and submitted work cannot remain upcoming', () => {
  for (const state of ['draft', 'submitted']) {
    const data = detail(); data.program.items[2].status = state;
    assert.equal(parseProgram(data, 2, ids.program).program.progress_percent, 50);
  }
  const data = dashboard(); data.upcoming[0].kind = 'assignment'; data.upcoming[0].status = 'draft';
  assert.equal(parseDashboard(data, 2).upcoming[0].status, 'draft');
  data.upcoming[0].status = 'submitted'; assert.throws(() => parseDashboard(data, 2));
  const invalid = detail(); invalid.program.items[0].status = 'submitted'; assert.throws(() => parseProgram(invalid, 2, ids.program));
});
