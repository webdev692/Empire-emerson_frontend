import assert from 'node:assert/strict';
import test from 'node:test';
import { createInquiryController } from './inquiry.ts';

const payload = (changes = {}) => ({ reply_email: 'QA.User@EXAMPLE.TEST', topic: 'CORRECTION', resource_id: 'sample-resource-1', ...changes });
const deferred = () => {
  let resolve;
  let reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
};

test('default route stays unavailable and never inspects, stores or sends the submitted contents', async () => {
  const controller = createInquiryController();
  const hostile = new Proxy({}, { get: () => { throw new Error('PRIVATE_SENTINEL'); }, ownKeys: () => { throw new Error('PRIVATE_SENTINEL'); } });
  assert.equal(controller.getState().status, 'UNAVAILABLE');
  assert.deepEqual(await controller.submit(hostile), { status: 'UNAVAILABLE', message: 'Inquiry delivery is unavailable. No request has been sent.' });
  assert.equal((await controller.submit(payload())).status, 'UNAVAILABLE');
  assert.equal(controller.getState().status, 'UNAVAILABLE');
});

test('minimal schema rejects narratives, files, missing keys, unknown topics and unsafe resource references', async () => {
  let calls = 0;
  const controller = createInquiryController(async () => { calls++; return { receipt: 'test-receipt' }; });
  const missing = payload();
  delete missing.resource_id;
  const values = [null, [], 'text', missing, payload({ private_story: 'PRIVATE_SENTINEL' }), payload({ files: [] }), payload({ topic: 'HR' }), payload({ topic: 'program' }), payload({ resource_id: '../private' }), payload({ resource_id: 'x'.repeat(129) }), payload({ resource_id: {} })];
  for (const value of values) {
    const result = await controller.submit(value);
    assert.equal(result.status, 'INVALID');
    assert.ok(!JSON.stringify(result).includes('PRIVATE_SENTINEL'));
  }
  const accessor = { topic: 'PROGRAM', resource_id: null };
  Object.defineProperty(accessor, 'reply_email', { enumerable: true, get: () => { throw new Error('PRIVATE_SENTINEL'); } });
  assert.equal((await controller.submit(accessor)).status, 'INVALID');
  assert.equal(calls, 0);
});

test('email syntax and length checks reject header injection, malformed mailboxes and nonmailbox text', async () => {
  let calls = 0;
  const controller = createInquiryController(async () => { calls++; return { receipt: 'test-receipt' }; });
  const invalid = ['', 'not-email', 'a@@example.test', 'a@localhost', '.a@example.test', 'a..b@example.test', 'a.@example.test', 'a@-example.test', 'a@example..test', 'a@127.0.0.1', 'a@example.test\r\nBcc: private@example.test', `${'a'.repeat(65)}@example.test`, `${'a'.repeat(321)}@example.test`, 'x y@example.test'];
  for (const reply_email of invalid) assert.equal((await controller.submit(payload({ reply_email }))).status, 'INVALID');
  assert.equal(calls, 0);
});

test('pending and delivered states are distinct, normalize only the email domain, and expose no payload', async () => {
  const gate = deferred();
  const calls = [];
  const controller = createInquiryController(async (value, key) => { calls.push({ value, key }); return gate.promise; });
  assert.equal(controller.getState().status, 'READY');
  const pending = controller.submit(payload({ reply_email: '  QA.User+tag@EXAMPLE.TEST  ', resource_id: null, topic: 'PROGRAM' }));
  assert.equal(controller.getState().status, 'PENDING');
  await Promise.resolve();
  assert.deepEqual(calls[0].value, { reply_email: 'QA.User+tag@example.test', topic: 'PROGRAM', resource_id: null });
  assert.match(calls[0].key, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  assert.deepEqual(Object.keys(controller.getState()).sort(), ['message', 'status']);
  gate.resolve({ receipt: 'local-test-receipt-1' });
  const result = await pending;
  assert.equal(result.status, 'DELIVERED');
  assert.equal(result.receipt, 'local-test-receipt-1');
  assert.equal(controller.getState().status, 'DELIVERED');
  assert.ok(!JSON.stringify(controller.getState()).includes('QA.User'));
});

test('duplicate in-flight requests share one operation; different input cannot start a second pending action', async () => {
  const gate = deferred();
  let calls = 0;
  const controller = createInquiryController(async () => { calls++; return gate.promise; });
  const first = controller.submit(payload());
  const duplicate = controller.submit(payload({ reply_email: ' QA.User@example.test ' }));
  assert.equal(first, duplicate);
  const blocked = await controller.submit(payload({ topic: 'SPEAKING' }));
  assert.equal(blocked.status, 'PENDING');
  assert.equal(calls, 1);
  assert.equal((await controller.submit(payload({ files: [] }))).status, 'INVALID');
  assert.equal(controller.getState().status, 'PENDING');
  gate.resolve({ receipt: 'local-test-once' });
  assert.deepEqual(await first, await duplicate);
  assert.equal(calls, 1);
});

test('confirmed delivery is cached across later attempts without exposing mutable internal state', async () => {
  let calls = 0;
  const controller = createInquiryController(async () => { calls++; return { receipt: 'local-test-cached' }; });
  const first = await controller.submit(payload());
  first.receipt = 'changed-by-caller';
  const state = controller.getState();
  state.status = 'FAILED';
  const again = await controller.submit(payload());
  assert.equal(calls, 1);
  assert.equal(again.status, 'DELIVERED');
  assert.equal(again.receipt, 'local-test-cached');
  assert.equal(controller.getState().status, 'DELIVERED');
});

test('failures are privacy-safe and an explicit retry reuses the same idempotency key', async () => {
  const calls = [];
  const controller = createInquiryController(async (value, key) => {
    calls.push({ value, key });
    if (calls.length === 1) throw new Error('PRIVATE_SENTINEL provider details');
    return { receipt: 'local-test-retry' };
  });
  const failed = await controller.submit(payload());
  assert.equal(failed.status, 'FAILED');
  assert.equal(controller.getState().status, 'FAILED');
  assert.ok(!JSON.stringify(failed).includes('PRIVATE_SENTINEL'));
  assert.equal(failed.receipt, undefined);
  const retry = await controller.submit(payload());
  assert.equal(retry.status, 'DELIVERED');
  assert.equal(calls.length, 2);
  assert.equal(calls[0].key, calls[1].key);
  assert.deepEqual(calls[0].value, calls[1].value);
  await controller.submit(payload({ topic: 'SPEAKING' }));
  assert.notEqual(calls[2].key, calls[0].key);
});

test('synchronous transport failures and malformed confirmations never claim delivery', async () => {
  const responses = [undefined, {}, { receipt: '' }, { receipt: 'x'.repeat(129) }, { receipt: 'PRIVATE_SENTINEL\n' }, { receipt: 'okay', private_details: 'PRIVATE_SENTINEL' }];
  for (const response of responses) {
    const controller = createInquiryController(async () => response);
    const result = await controller.submit(payload());
    assert.equal(result.status, 'FAILED');
    assert.equal(result.receipt, undefined);
    assert.ok(!JSON.stringify(result).includes('PRIVATE_SENTINEL'));
  }
  const controller = createInquiryController(() => { throw new Error('PRIVATE_SENTINEL'); });
  const pending = controller.submit(payload());
  assert.equal(controller.getState().status, 'PENDING');
  assert.equal((await pending).status, 'FAILED');
});
