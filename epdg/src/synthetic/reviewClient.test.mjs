import assert from 'node:assert/strict';
import test from 'node:test';
import { createHash } from 'node:crypto';
import { createReviewClient, feedbackProblem, parseLearnerFeedback, parseReview, parseReviewQueue } from './reviewClient.ts';

const receipt = '40000000-0000-4000-8000-000000000001';
const item = '30000000-0000-4000-8000-000000000007';
const program = '10000000-0000-4000-8000-000000000002';
const feedbackId = '60000000-0000-4000-8000-000000000001';
const at = '2026-10-24T16:00:00.000Z'; const csrf = 'r'.repeat(43);
const identity = () => ({ receipt_id: receipt, item_id: item, program_id: program, learner_id: 2, learner_label: 'SYNTHETIC Learner A',
  program_title: 'SYNTHETIC Career Readiness', assignment_title: 'Fictional career plan', submitted_at: at, submission_revision: 5, attempt_number: 1 });
const queue = () => ({ success: true, environment: 'synthetic-local', mentor_id: 3,
  reviews: [{ ...identity(), review_state: 'not_started', review_revision: 0 }] });
const detail = () => ({ success: true, environment: 'synthetic-local', mentor_id: 3,
  review: { ...identity(), answer: 'SYNTHETIC submitted answer.', attachments: [], draft: null, published: null } });
const draft = (revision = 1, comment = 'SYNTHETIC feedback: add one clear next step.') => {
  const value = detail(); value.review.draft = { comment, revision, saved_at: at }; return value;
};
const published = () => { const value = draft(); value.review.published = { id: feedbackId, comment: value.review.draft.comment, revision: 1, published_at: at, mentor_label: 'SYNTHETIC Mentor A' }; return value; };
const learner = () => ({ success: true, environment: 'synthetic-local', learner_id: 2, item_id: item, program_id: program, receipt_id: receipt, feedback: [published().review.published] });

test('review queues require the current mentor and coherent submitted-record identities without retaining extra fields', () => {
  const valid = queue(); valid.reviews[0].private_draft = 'not retained';
  assert.equal('private_draft' in parseReviewQueue(valid, 3).reviews[0], false);
  for (const change of [v => { v.mentor_id = 4; }, v => { v.environment = 'production'; }, v => { v.reviews[0].receipt_id = '../../foreign'; },
    v => { v.reviews[0].learner_label = 'Real learner'; }, v => { v.reviews[0].review_revision = 1; },
    v => { v.reviews[0].review_state = 'graded'; }, v => { v.reviews.push({ ...v.reviews[0] }); }]) {
    const bad = queue(); change(bad); assert.throws(() => parseReviewQueue(bad, 3));
  }
});

test('mentor detail binds the requested receipt and validates frozen answer, private draft and published snapshot', () => {
  assert.equal(parseReview(detail(), 3, receipt).review.draft, null);
  assert.equal(parseReview(published(), 3, receipt).review.published.id, feedbackId);
  for (const change of [v => { v.mentor_id = 4; }, v => { v.review.receipt_id = feedbackId; }, v => { v.review.answer = ' '; },
    v => { v.review.draft.comment = '\ud800'; }, v => { v.review.draft.revision = 0; },
    v => { v.review.published.revision = 2; }, v => { v.review.published.comment = 'Different snapshot'; },
    v => { v.review.attachments = [{ id: feedbackId, filename: '../file.txt' }]; }]) {
    const bad = published(); change(bad); assert.throws(() => parseReview(bad, 3, receipt));
  }
});

test('learner feedback is bound to own learner, program, item and immutable receipt and selects only published fields', () => {
  const valid = learner(); valid.private_draft = 'never retained'; valid.feedback[0].private_draft = 'never retained';
  const result = parseLearnerFeedback(valid, 2, program, item, receipt);
  assert.equal('private_draft' in result, false); assert.equal('private_draft' in result.feedback[0], false);
  for (const change of [v => { v.learner_id = 4; }, v => { v.program_id = feedbackId; }, v => { v.item_id = receipt; },
    v => { v.receipt_id = feedbackId; }, v => { v.feedback[0].mentor_label = 'Unverified'; },
    v => { v.feedback[0].comment = ''; }, v => { v.feedback.push(v.feedback[0]); }]) {
    const bad = learner(); change(bad); assert.throws(() => parseLearnerFeedback(bad, 2, program, item, receipt));
  }
  assert.equal(parseLearnerFeedback({ ...learner(), receipt_id: null, feedback: [] }, 2, program, item, null).feedback.length, 0);
});

test('feedback bounds allow blank private drafts and reject long, malformed Unicode and NUL comments', () => {
  assert.equal(feedbackProblem(''), null); assert.equal(feedbackProblem('界'.repeat(4000)), null);
  for (const comment of ['a'.repeat(4001), '\ud800', 'text\0', '😀'.repeat(2001)]) assert.ok(feedbackProblem(comment));
});

test('mentor transport uses scoped cookie GETs and exact CSRF JSON save/publish requests without identity selectors', async () => {
  const calls = []; const client = createReviewClient(async (url, options) => {
    calls.push({ url, options }); return Response.json(url.endsWith('/reviews') ? queue() : url.endsWith('/publish') ? published() : url.endsWith('/draft') ? draft() : detail());
  });
  await client.loadReviewQueue(3); await client.loadReview(receipt, 3);
  await client.saveReviewDraft(receipt, 3, draft().review.draft.comment, 0, csrf); await client.publishReview(receipt, 3, 1, csrf);
  assert.deepEqual(calls.map(c => c.url), [`http://127.0.0.1:58000/api/mentor/reviews`, ...['', '/draft', '/publish'].map(action => `http://127.0.0.1:58000/api/mentor/reviews/${receipt}${action}`)]);
  for (const { options } of calls) { assert.equal(options.credentials, 'include'); assert.equal(options.cache, 'no-store'); assert.equal(options.redirect, 'error'); assert.equal(options.headers.Authorization, undefined); }
  assert.deepEqual(JSON.parse(calls[2].options.body), { comment: draft().review.draft.comment, expected_revision: 0 });
  assert.deepEqual(JSON.parse(calls[3].options.body), { expected_revision: 1 }); assert.equal(calls[3].options.headers['X-CSRF-Token'], csrf);
});

test('unconfirmed draft saves and publications cannot report success', async () => {
  const client = createReviewClient(async () => Response.json(draft()));
  await assert.rejects(client.publishReview(receipt, 3, 1, csrf), e => e.status === 502);
  await assert.rejects(client.saveReviewDraft(receipt, 3, 'Different comment', 0, csrf), e => e.status === 502);
  await assert.rejects(client.saveReviewDraft(receipt, 3, draft().review.draft.comment, 1, csrf), e => e.status === 502);
});

test('invalid requests never fetch and private server errors are not echoed', async () => {
  let calls = 0; const client = createReviewClient(async () => { calls++; return Response.json({ message: 'private draft or database detail' }, { status: 409 }); });
  await assert.rejects(client.loadReview('../../foreign', 3), e => e.status === 404);
  await assert.rejects(client.loadReviewQueue(0), e => e.status === 404);
  await assert.rejects(client.saveReviewDraft(receipt, 3, 'a'.repeat(4001), 0, csrf), e => e.status === 400);
  await assert.rejects(client.saveReviewDraft(receipt, 3, 'text', 2147483647, csrf), e => e.status === 400);
  await assert.rejects(client.publishReview(receipt, 3, 0, csrf), e => e.status === 400);
  await assert.rejects(client.saveReviewDraft(receipt, 3, 'text', 0, 'forged'), e => e.status === 403);
  assert.equal(calls, 0);
  await assert.rejects(client.saveReviewDraft(receipt, 3, 'text', 0, csrf), e => e.status === 409 && !e.message.includes('private draft'));
});

test('mentor file download shares bounded hash verification and uses only the receipt-scoped mentor route', async () => {
  const bytes = Buffer.from('SYNTHETIC mentor download.'); const metadata = { id: '50000000-0000-4000-8000-000000000001', filename: 'practice.txt',
    media_type: 'text/plain', size_bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex'), uploaded_at: at }; let sent;
  const client = createReviewClient(async (url, options) => { sent = { url, options }; return new Response(bytes, { headers: { 'Content-Type': 'application/octet-stream' } }); });
  const result = await client.downloadReviewAttachment(receipt, 3, metadata);
  assert.equal(sent.url, `http://127.0.0.1:58000/api/mentor/reviews/${receipt}/attachments/${metadata.id}/download`);
  assert.equal(sent.options.credentials, 'include'); assert.deepEqual(Buffer.from(await result.blob.arrayBuffer()), bytes);
  const corrupt = createReviewClient(async () => new Response(Buffer.alloc(bytes.length), { headers: { 'Content-Type': 'application/octet-stream' } }));
  await assert.rejects(corrupt.downloadReviewAttachment(receipt, 3, metadata), e => e.status === 502);
});

test('learner feedback transport sends no mentor selector or mutation and rejects another receipt response', async () => {
  let sent; const client = createReviewClient(async (url, options) => { sent = { url, options }; return Response.json(learner()); });
  await client.loadAssignmentFeedback(item, program, 2, receipt);
  assert.equal(sent.url, `http://127.0.0.1:58000/api/learner/assignments/${item}/feedback`); assert.equal(sent.options.method, 'GET');
  assert.equal(sent.options.credentials, 'include'); assert.equal(sent.options.body, undefined);
  await assert.rejects(client.loadAssignmentFeedback(item, program, 2, feedbackId), e => e.status === 502);
});
