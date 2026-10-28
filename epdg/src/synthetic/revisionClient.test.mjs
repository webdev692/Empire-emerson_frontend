import assert from 'node:assert/strict';
import test from 'node:test';
import { createRevisionClient, parseAssignmentAttempts } from './revisionClient.ts';

const item = '30000000-0000-4000-8000-000000000007';
const program = '10000000-0000-4000-8000-000000000002';
const first = '40000000-0000-4000-8000-000000000001';
const second = '40000000-0000-4000-8000-000000000002';
const at = '2026-10-24T17:00:00.000Z';
const history = () => ({ success: true, environment: 'synthetic-local', learner_id: 2, item_id: item, program_id: program,
  attempts: [{ receipt_id: first, attempt_number: 1, answer: 'SYNTHETIC first submission.', attachments: [], submitted_at: at, submission_revision: 2,
    published_feedback: [{ id: '60000000-0000-4000-8000-000000000001', comment: 'SYNTHETIC feedback: add a review date.', revision: 1, published_at: at, mentor_label: 'SYNTHETIC Mentor A' }] },
  { receipt_id: second, attempt_number: 2, answer: 'SYNTHETIC revised plan with a review date.', attachments: [], submitted_at: at, submission_revision: 4, published_feedback: [] }] });

test('submitted history binds learner/item/program and retains separate answers and published feedback', () => {
  const value = history(); value.attempts[0].private_draft = 'not retained'; value.attempts[0].published_feedback[0].private_draft = 'not retained';
  const result = parseAssignmentAttempts(value, 2, program, item);
  assert.equal(result.attempts.length, 2); assert.equal(result.attempts[0].answer, history().attempts[0].answer);
  assert.equal(result.attempts[1].published_feedback.length, 0);
  assert.equal('private_draft' in result.attempts[0], false); assert.equal('private_draft' in result.attempts[0].published_feedback[0], false);
  assert.deepEqual(parseAssignmentAttempts({ ...history(), attempts: [] }, 2, program, item).attempts, []);
  for (const change of [v => { v.learner_id = 3; }, v => { v.environment = 'production'; }, v => { v.item_id = first; }, v => { v.program_id = first; }]) {
    const bad = history(); change(bad); assert.throws(() => parseAssignmentAttempts(bad, 2, program, item));
  }
});

test('history rejects duplicate receipts, broken attempt order, stale revisions and invalid snapshots', () => {
  for (const change of [v => { v.attempts[1].receipt_id = first; }, v => { v.attempts[1].attempt_number = 3; },
    v => { v.attempts[1].submission_revision = 2; }, v => { v.attempts[0].answer = ''; }, v => { v.attempts[0].answer = '\ud800'; },
    v => { v.attempts[0].submitted_at = 'invalid'; }, v => { v.attempts[0].published_feedback[0].comment = ''; },
    v => { v.attempts[0].published_feedback[0].mentor_label = 'Unknown'; },
    v => { v.attempts[1].published_feedback = v.attempts[0].published_feedback; },
    v => { v.attempts = [...v.attempts, ...v.attempts, ...v.attempts]; }]) {
    const bad = history(); change(bad); assert.throws(() => parseAssignmentAttempts(bad, 2, program, item));
  }
});

test('history file snapshots reject unsafe or repeated attachment identities across attempts', () => {
  const file = { id: '50000000-0000-4000-8000-000000000001', filename: 'practice.txt', media_type: 'text/plain', size_bytes: 10, sha256: 'a'.repeat(64), uploaded_at: at };
  const value = history(); value.attempts[0].attachments = [file];
  assert.equal(parseAssignmentAttempts(value, 2, program, item).attempts[0].attachments.length, 1);
  value.attempts[1].attachments = [file]; assert.throws(() => parseAssignmentAttempts(value, 2, program, item));
  value.attempts[1].attachments = []; value.attempts[0].attachments[0] = { ...file, filename: '../private.txt' };
  assert.throws(() => parseAssignmentAttempts(value, 2, program, item));
});

test('history GET sends scoped cookies without identity selectors and sanitizes unavailable errors', async () => {
  let sent; const client = createRevisionClient(async (url, options) => { sent = { url, options }; return Response.json(history()); });
  await client.loadAssignmentAttempts(item, program, 2);
  assert.equal(sent.url, `http://127.0.0.1:58000/api/learner/assignments/${item}/attempts`);
  assert.equal(sent.options.method, 'GET'); assert.equal(sent.options.credentials, 'include'); assert.equal(sent.options.cache, 'no-store');
  assert.equal(sent.options.redirect, 'error'); assert.equal(sent.options.referrerPolicy, 'no-referrer'); assert.equal(sent.options.body, undefined);
  let calls = 0; const never = createRevisionClient(async () => { calls++; return Response.json({ message: 'private HR record' }, { status: 404 }); });
  await assert.rejects(never.loadAssignmentAttempts('../other', program, 2), e => e.status === 404);
  assert.equal(calls, 0);
  await assert.rejects(never.loadAssignmentAttempts(item, program, 2), e => e.status === 404 && !e.message.includes('private'));
  const foreign = createRevisionClient(async () => Response.json({ ...history(), learner_id: 3 }));
  await assert.rejects(foreign.loadAssignmentAttempts(item, program, 2), e => e.status === 502);
});
