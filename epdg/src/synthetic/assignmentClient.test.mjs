import assert from 'node:assert/strict';
import test from 'node:test';
import { createHash } from 'node:crypto';
import { answerProblem, attachmentProblem, createAssignmentClient, parseSubmission } from './assignmentClient.ts';

const item = '30000000-0000-4000-8000-000000000004';
const program = '10000000-0000-4000-8000-000000000001';
const receipt = '40000000-0000-4000-8000-000000000001';
const at = '2026-10-24T15:00:00.000Z';
const csrf = 'c'.repeat(43);
const draft = () => ({ success: true, environment: 'synthetic-local', learner_id: 2,
  submission: { item_id: item, program_id: program, state: 'draft', attempt_number: 1, previous_receipt_id: null, can_start_revision: false,
    answer: 'SYNTHETIC response only.', revision: 1, saved_at: at, receipt: null, attachments: [], removed_attachments: [] } });
const submitted = () => { const value = draft(); value.submission.state = 'submitted'; value.submission.receipt = { id: receipt, submitted_at: at, revision: 1 }; return value; };

test('submission records require own learner/item/program and coherent state; arbitrary fields are discarded', () => {
  const valid = draft(); valid.submission.private_record = 'not retained';
  assert.equal('private_record' in parseSubmission(valid, 2, program, item).submission, false);
  for (const alter of [v => { v.learner_id = 3; }, v => { v.environment = 'production'; }, v => { v.submission.program_id = receipt; },
    v => { v.submission.item_id = receipt; }, v => { v.submission.revision = -1; }, v => { v.submission.state = 'graded'; },
    v => { v.submission.saved_at = null; }, v => { v.submission.receipt = { id: receipt, submitted_at: at, revision: 1 }; }]) {
    const invalid = draft(); alter(invalid); assert.throws(() => parseSubmission(invalid, 2, program, item));
  }
  const fresh = draft(); Object.assign(fresh.submission, { state: 'not_started', answer: '', revision: 0, saved_at: null });
  assert.equal(parseSubmission(fresh, 2, program, item).submission.state, 'not_started');
  const lastRevision = draft(); lastRevision.submission.revision = 2147483647;
  assert.equal(parseSubmission(lastRevision, 2, program, item).submission.revision, 2147483647);
});

test('submitted receipts bind to the saved revision and a nonblank immutable answer', () => {
  assert.equal(parseSubmission(submitted(), 2, program, item).submission.receipt.id, receipt);
  for (const alter of [s => { s.receipt.revision = 2; }, s => { s.answer = '   '; }, s => { s.receipt = null; }, s => { s.receipt.submitted_at = 'invalid'; }]) {
    const invalid = submitted(); alter(invalid.submission); assert.throws(() => parseSubmission(invalid, 2, program, item));
  }
});

test('attempt state requires a bounded chain and permits revision only on a submitted nonfinal attempt', () => {
  const valid = submitted(); valid.submission.can_start_revision = true;
  assert.equal(parseSubmission(valid, 2, program, item).submission.can_start_revision, true);
  for (const change of [s => { delete s.attempt_number; }, s => { s.attempt_number = 0; }, s => { s.attempt_number = 6; },
    s => { s.previous_receipt_id = receipt; }, s => { s.attempt_number = 2; }, s => { s.can_start_revision = 'yes'; },
    s => { s.state = 'draft'; s.receipt = null; s.can_start_revision = true; },
    s => { s.attempt_number = 5; s.previous_receipt_id = item; s.revision = 5; s.receipt.revision = 5; s.can_start_revision = true; }]) {
    const bad = submitted(); change(bad.submission); assert.throws(() => parseSubmission(bad, 2, program, item));
  }
});

test('start revision sends only the expected immutable receipt and revision and confirms a separate file-free draft', async () => {
  const next = () => { const value = draft(); Object.assign(value.submission, { attempt_number: 2, previous_receipt_id: receipt, revision: 2 }); return value; };
  let sent;
  const client = createAssignmentClient(async (url, options) => { sent = { url, options }; return Response.json(next()); });
  const result = await client.startRevision(item, program, 2, receipt, 1, csrf);
  assert.equal(result.submission.attempt_number, 2);
  assert.equal(sent.url, `http://127.0.0.1:58000/api/learner/assignments/${item}/start-revision`);
  assert.deepEqual(JSON.parse(sent.options.body), { expected_receipt_id: receipt, expected_revision: 1 });
  assert.equal(sent.options.credentials, 'include'); assert.equal(sent.options.headers['X-CSRF-Token'], csrf);
  for (const change of [s => { s.previous_receipt_id = item; }, s => { s.revision = 3; },
    s => { s.answer = ' '; }, s => { s.attachments = [fileRecord()]; }, s => { s.state = 'submitted'; s.receipt = { id: program, revision: 2, submitted_at: at }; }]) {
    const unconfirmed = createAssignmentClient(async () => { const value = next(); change(value.submission); return Response.json(value); });
    await assert.rejects(unconfirmed.startRevision(item, program, 2, receipt, 1, csrf), e => e.status === 502);
  }
  let calls = 0; const never = createAssignmentClient(async () => { calls++; throw new Error('unexpected'); });
  for (const [ref, rev] of [['../foreign', 1], [receipt, 0], [receipt, 2147483647]]) await assert.rejects(never.startRevision(item, program, 2, ref, rev, csrf), e => e.status === 400);
  await assert.rejects(never.startRevision(item, program, 2, receipt, 1, 'invalid'), e => e.status === 403);
  assert.equal(calls, 0);
});

test('bounded answers allow empty drafts but reject excessive characters, UTF8 bytes and nulls', () => {
  assert.equal(answerProblem(''), null); assert.equal(answerProblem('a'.repeat(4000)), null);
  assert.ok(answerProblem('a'.repeat(4001))); assert.equal(answerProblem('界'.repeat(4000)), null);
  assert.ok(answerProblem('界'.repeat(4001))); assert.ok(answerProblem('unsupported\0character'));
  assert.ok(answerProblem('\ud800')); assert.ok(answerProblem('\udfff'));
  assert.equal(answerProblem('Valid Unicode 😀'), null);
});

test('draft and submit transport uses exact cookie/CSRF requests and never sends identity selectors or a second answer on submit', async () => {
  const calls = [];
  const client = createAssignmentClient(async (url, options) => { calls.push({ url, options }); return Response.json(url.endsWith('/submit') ? submitted() : draft()); });
  await client.loadSubmission(item, program, 2); await client.saveDraft(item, program, 2, draft().submission.answer, 0, csrf);
  await client.submitAssignment(item, program, 2, 1, csrf);
  assert.deepEqual(calls.map(c => c.url), ['submission', 'draft', 'submit'].map(action => `http://127.0.0.1:58000/api/learner/assignments/${item}/${action}`));
  for (const { options } of calls) { assert.equal(options.credentials, 'include'); assert.equal(options.cache, 'no-store'); assert.equal(options.referrerPolicy, 'no-referrer'); assert.equal(options.headers.Authorization, undefined); }
  assert.deepEqual(JSON.parse(calls[1].options.body), { answer: draft().submission.answer, expected_revision: 0 });
  assert.deepEqual(JSON.parse(calls[2].options.body), { expected_revision: 1 }); assert.equal(calls[2].options.headers['X-CSRF-Token'], csrf);
});

test('unconfirmed mutation responses cannot be presented as saved or submitted', async () => {
  const client = createAssignmentClient(async () => Response.json(draft()));
  await assert.rejects(client.submitAssignment(item, program, 2, 1, csrf), e => e.status === 502);
  await assert.rejects(client.saveDraft(item, program, 2, 'Different answer', 0, csrf), e => e.status === 502);
  await assert.rejects(client.saveDraft(item, program, 2, draft().submission.answer, 1, csrf), e => e.status === 502);
});

test('invalid inputs do not send a request and server errors never echo response contents', async () => {
  let calls = 0;
  const client = createAssignmentClient(async () => { calls++; return Response.json({ message: 'private answer or provider detail' }, { status: 409 }); });
  await assert.rejects(client.saveDraft(item, program, 2, 'a'.repeat(4001), 0, csrf), e => e.status === 400);
  await assert.rejects(client.saveDraft(item, program, 2, '\ud800', 0, csrf), e => e.status === 400);
  await assert.rejects(client.saveDraft(item, program, 2, 'text', 2147483647, csrf), e => e.status === 400);
  await assert.rejects(client.submitAssignment(item, program, 2, 0, csrf), e => e.status === 400);
  await assert.rejects(client.saveDraft(item, program, 2, 'text', 0, 'forged'), e => e.status === 403);
  assert.equal(calls, 0);
  await assert.rejects(client.saveDraft(item, program, 2, 'text', 1, csrf), e => e.status === 409 && !e.message.includes('private answer'));
});

const fileBytes = Buffer.from('SYNTHETIC file only.\n');
const fileRecord = () => ({ id: '50000000-0000-4000-8000-000000000001', filename: 'synthetic.txt', media_type: 'text/plain',
  size_bytes: fileBytes.length, sha256: createHash('sha256').update(fileBytes).digest('hex'), uploaded_at: at });
const attached = () => { const value = draft(); value.submission.revision = 2; value.submission.attachments = [fileRecord()]; return value; };

test('file selection validation bounds type, filename and size without reading or sending contents', () => {
  assert.equal(attachmentProblem({ name: 'Practice Plan.PDF', size: 1048576, type: 'application/pdf' }), null);
  assert.equal(attachmentProblem({ name: 'practice.txt', size: 1, type: '' }), null);
  for (const name of ['../private.txt', 'nested/file.txt', 'file.svg', 'file.docx', '.hidden.txt', 'two..dots.txt', 'bad\rname.txt', 'x'.repeat(101)+'.txt']) {
    assert.ok(attachmentProblem({ name, size: 10, type: '' }), name);
  }
  assert.ok(attachmentProblem({ name: 'practice.txt', size: 0, type: 'text/plain' }));
  assert.ok(attachmentProblem({ name: 'practice.txt', size: 1048577, type: 'text/plain' }));
  assert.ok(attachmentProblem({ name: 'practice.txt', size: 10, type: 'image/png' }));
});

test('file manifests reject duplicates, unsafe metadata, missing arrays and excess files', () => {
  const valid = attached(); valid.submission.attachments[0].private_path = 'not retained';
  assert.equal('private_path' in parseSubmission(valid, 2, program, item).submission.attachments[0], false);
  for (const change of [v => { delete v.submission.attachments; }, v => { v.submission.attachments[0].filename = '../x.txt'; },
    v => { v.submission.attachments[0].sha256 = 'forged'; }, v => { v.submission.attachments[0].size_bytes = 1048577; },
    v => { v.submission.removed_attachments = [fileRecord()]; }, v => { v.submission.attachments = [1, 2, 3, 4].map(n => ({ ...fileRecord(), id: `50000000-0000-4000-8000-00000000000${n}` })); }]) {
    const bad = attached(); change(bad); assert.throws(() => parseSubmission(bad, 2, program, item));
  }
  const final = submitted(); final.submission.removed_attachments = [fileRecord()]; assert.throws(() => parseSubmission(final, 2, program, item));
});

test('explicit upload sends one bounded multipart file and revision with cookie/CSRF only', async () => {
  const file = new File([fileBytes], 'synthetic.txt', { type: 'text/plain' }); let sent;
  const client = createAssignmentClient(async (url, options) => { sent = { url, options }; return Response.json(attached()); });
  const result = await client.uploadAttachment(item, program, 2, file, 1, csrf);
  assert.equal(result.submission.revision, 2); assert.equal(sent.url, `http://127.0.0.1:58000/api/learner/assignments/${item}/attachments`);
  assert.equal(sent.options.credentials, 'include'); assert.equal(sent.options.cache, 'no-store'); assert.equal(sent.options.redirect, 'error');
  assert.equal(sent.options.headers['X-CSRF-Token'], csrf); assert.equal(sent.options.headers['Content-Type'], undefined);
  assert.deepEqual([...sent.options.body.keys()], ['expected_revision', 'file']);
  assert.equal(sent.options.body.get('expected_revision'), '1'); assert.equal(sent.options.body.get('file').name, file.name);
});

test('invalid or unconfirmed uploads cannot report success', async () => {
  let calls = 0; const file = new File([fileBytes], 'synthetic.txt', { type: 'text/plain' });
  const client = createAssignmentClient(async () => { calls++; const wrong = attached(); wrong.submission.attachments[0].sha256 = '0'.repeat(64); return Response.json(wrong); });
  await assert.rejects(client.uploadAttachment(item, program, 2, file, 0, csrf), e => e.status === 400);
  await assert.rejects(client.uploadAttachment(item, program, 2, new File([], 'empty.txt'), 1, csrf), e => e.status === 400);
  await assert.rejects(client.uploadAttachment(item, program, 2, file, 1, 'forged'), e => e.status === 403);
  assert.equal(calls, 0);
  await assert.rejects(client.uploadAttachment(item, program, 2, file, 1, csrf), e => e.status === 502);
});

test('remove and restore confirm reversible state changes at the next revision', async () => {
  const calls = []; const client = createAssignmentClient(async (url, options) => {
    calls.push({ url, options }); const value = attached();
    if (url.endsWith('/remove')) { value.submission.revision = 3; value.submission.attachments = []; value.submission.removed_attachments = [fileRecord()]; }
    else value.submission.revision = 4;
    return Response.json(value);
  });
  const removed = await client.removeAttachment(item, program, 2, fileRecord().id, 2, csrf);
  assert.equal(removed.submission.removed_attachments.length, 1);
  const restored = await client.restoreAttachment(item, program, 2, fileRecord().id, 3, csrf);
  assert.equal(restored.submission.attachments.length, 1);
  assert.deepEqual(calls.map(c => JSON.parse(c.options.body)), [{ expected_revision: 2 }, { expected_revision: 3 }]);
  await assert.rejects(client.removeAttachment(item, program, 2, '../../other', 2, csrf), e => e.status === 400);
});

test('downloads require scoped cookies, binary response and exact saved bytes/hash before returning a blob', async () => {
  let sent; const client = createAssignmentClient(async (url, options) => { sent = { url, options }; return new Response(fileBytes, { headers: { 'Content-Type': 'application/octet-stream', 'Content-Length': String(fileBytes.length) } }); });
  const download = await client.downloadAttachment(item, program, 2, fileRecord());
  assert.equal(download.filename, 'synthetic.txt'); assert.deepEqual(Buffer.from(await download.blob.arrayBuffer()), fileBytes);
  assert.equal(sent.options.credentials, 'include'); assert.equal(sent.options.cache, 'no-store'); assert.equal(sent.options.headers, undefined);
  for (const response of [new Response('wrong bytes', { headers: { 'Content-Type': 'application/octet-stream' } }),
    new Response(Buffer.alloc(fileBytes.length, 0x41), { headers: { 'Content-Type': 'application/octet-stream' } }),
    new Response(fileBytes, { headers: { 'Content-Type': 'text/html' } }),
    new Response(Buffer.alloc(fileBytes.length + 1), { headers: { 'Content-Type': 'application/octet-stream' } }),
    new Response(fileBytes, { headers: { 'Content-Type': 'application/octet-stream', 'Content-Length': '999' } })]) {
    const corrupt = createAssignmentClient(async () => response);
    await assert.rejects(corrupt.downloadAttachment(item, program, 2, fileRecord()), e => e.status === 502);
  }
  const denied = createAssignmentClient(async () => new Response('private detail', { status: 404 }));
  await assert.rejects(denied.downloadAttachment(item, program, 2, fileRecord()), e => e.status === 404 && !e.message.includes('private detail'));
});

test('historical downloads bind both item and receipt and retain binary integrity checks', async () => {
  let sent; let calls = 0;
  const client = createAssignmentClient(async (url, options) => { calls++; sent = { url, options };
    return new Response(fileBytes, { headers: { 'Content-Type': 'application/octet-stream' } }); });
  const result = await client.downloadAttemptAttachment(item, program, 2, receipt, fileRecord());
  assert.deepEqual(Buffer.from(await result.blob.arrayBuffer()), fileBytes);
  assert.equal(sent.url, `http://127.0.0.1:58000/api/learner/assignments/${item}/attempts/${receipt}/attachments/${fileRecord().id}/download`);
  assert.equal(sent.options.method, 'GET'); assert.equal(sent.options.credentials, 'include'); assert.equal(sent.options.cache, 'no-store');
  await assert.rejects(client.downloadAttemptAttachment(item, program, 2, '../other', fileRecord()), e => e.status === 404);
  assert.equal(calls, 1);
  const corrupt = createAssignmentClient(async () => new Response(Buffer.alloc(fileBytes.length), { headers: { 'Content-Type': 'application/octet-stream' } }));
  await assert.rejects(corrupt.downloadAttemptAttachment(item, program, 2, receipt, fileRecord()), e => e.status === 502);
});
