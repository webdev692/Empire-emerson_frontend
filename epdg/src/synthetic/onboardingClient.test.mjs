import assert from 'node:assert/strict';
import test from 'node:test';
import { createOnboardingClient, parseOnboardingSummary } from './onboardingClient.ts';
import { PortalRequestError } from './client.ts';

const programId = '10000000-0000-4000-8000-000000000099';
const at = '2026-10-24T18:00:00.000Z';
const summary = (status = 'ready') => ({ success: true, environment: 'synthetic-local', learner_id: 2, generated_at: at,
  privileged_controls_available: false,
  onboarding: status === 'not_received' ? { status, program_id: null, program_title: null, updated_at: null } :
    { status, program_id: programId, program_title: 'SYNTHETIC CRM onboarding practice', updated_at: '2026-10-24T17:59:00.000Z' } });

test('own-learner summary accepts all documented states and retains only safe display fields', () => {
  for (const status of ['not_received', 'ready', 'held', 'withdrawn']) {
    const value = summary(status);
    value.private_source = { fixture: 'not retained' };
    value.onboarding.private_evidence = 'not retained';
    const parsed = parseOnboardingSummary(value, 2);
    assert.equal(parsed.onboarding.status, status);
    assert.equal('private_source' in parsed, false);
    assert.equal('private_evidence' in parsed.onboarding, false);
    assert.equal(parsed.privileged_controls_available, false);
    assert.deepEqual(parsed.onboarding, summary(status).onboarding);
  }
});

test('wrong learner, environment, success and privileged authority are rejected', () => {
  for (const alter of [value => { value.learner_id = 3; }, value => { value.learner_id = '2'; },
    value => { value.environment = 'production'; }, value => { value.success = false; },
    value => { value.privileged_controls_available = true; }, value => { delete value.privileged_controls_available; }]) {
    const value = summary(); alter(value);
    assert.throws(() => parseOnboardingSummary(value, 2), error => error instanceof PortalRequestError && error.status === 502);
  }
  for (const id of [0, -1, 2.5, '2', NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(() => parseOnboardingSummary(summary(), id), PortalRequestError);
  }
});

test('unreceived and received states cannot contradict their program mapping', () => {
  for (const property of ['program_id', 'program_title', 'updated_at']) {
    const value = summary('not_received'); value.onboarding[property] = summary().onboarding[property];
    assert.throws(() => parseOnboardingSummary(value, 2), PortalRequestError);
    const missing = summary('not_received'); delete missing.onboarding[property];
    assert.throws(() => parseOnboardingSummary(missing, 2), PortalRequestError);
    for (const status of ['ready', 'held', 'withdrawn']) {
      const mapped = summary(status); mapped.onboarding[property] = null;
      assert.throws(() => parseOnboardingSummary(mapped, 2), PortalRequestError);
    }
  }
  for (const state of ['active', 'approved', 'denied', '', null, undefined, 1, {}, []]) {
    const value = summary(); value.onboarding.status = state;
    assert.throws(() => parseOnboardingSummary(value, 2), PortalRequestError);
  }
});

test('program identity, synthetic label and canonical timestamp boundaries are checked', () => {
  for (const alter of [value => { value.onboarding.program_id = '../programs/other'; },
    value => { value.onboarding.program_title = 'Live program'; }, value => { value.onboarding.program_title = 'SYNTHETIC '; },
    value => { value.onboarding.program_title = `SYNTHETIC ${'x'.repeat(201)}`; },
    value => { value.onboarding.program_title = 'SYNTHETIC unsafe\nlabel'; },
    value => { value.onboarding.updated_at = '2026-10-24T18:00:00.001Z'; },
    value => { value.onboarding.updated_at = '2026-10-24T18:00:00Z'; },
    value => { value.generated_at = '2026-10-24T18:00:00.000+00:00'; },
    value => { value.generated_at = '2026-02-30T18:00:00.000Z'; },
    value => { value.generated_at = 'not a date'; }, value => { value.onboarding = []; }]) {
    const value = summary(); alter(value);
    assert.throws(() => parseOnboardingSummary(value, 2), PortalRequestError);
  }
});

test('read transport uses the fixed current-session endpoint without learner selectors or write authority', async () => {
  const calls = [];
  const client = createOnboardingClient(async (url, options) => { calls.push({ url, options }); return Response.json(summary()); });
  assert.deepEqual(Object.keys(client), ['loadOnboarding']);
  assert.equal((await client.loadOnboarding(2)).onboarding.status, 'ready');
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'http://127.0.0.1:58000/api/learner/onboarding');
  assert.deepEqual({ ...calls[0].options, signal: undefined }, {
    method: 'GET', credentials: 'include', cache: 'no-store', redirect: 'error', referrerPolicy: 'no-referrer', headers: {}, signal: undefined,
  });
  assert.ok(calls[0].options.signal instanceof AbortSignal);
});

test('invalid caller identity is rejected before network access and cross-learner responses fail closed', async () => {
  let requests = 0;
  const client = createOnboardingClient(async () => { requests++; return Response.json(summary()); });
  for (const id of [0, '2', -2, 1.1]) await assert.rejects(client.loadOnboarding(id), error => error.status === 502);
  assert.equal(requests, 0);
  await assert.rejects(client.loadOnboarding(3), error => error.status === 502);
  assert.equal(requests, 1);
});

test('disabled, unavailable and authentication responses remain errors and never become not_received', async () => {
  for (const status of [401, 403, 404, 429, 500, 503]) {
    const client = createOnboardingClient(async () => Response.json({ private_detail: 'not for display' }, { status }));
    await assert.rejects(client.loadOnboarding(2), error => error instanceof PortalRequestError && error.status === status &&
      !error.message.includes('not for display') && !error.message.includes('not_received'));
  }
  const malformed = createOnboardingClient(async () => new Response('not-json', { status: 200 }));
  await assert.rejects(malformed.loadOnboarding(2), error => error.status === 502);
});

test('network failures are privacy-safe and explicit cancellation remains an AbortError', async () => {
  const offline = createOnboardingClient(async () => { throw new Error('private network detail'); });
  await assert.rejects(offline.loadOnboarding(2), error => error.status === 0 && !error.message.includes('private network detail'));
  const controller = new AbortController(); controller.abort();
  await assert.rejects(offline.loadOnboarding(2, controller.signal), error => error.name === 'AbortError');
});
