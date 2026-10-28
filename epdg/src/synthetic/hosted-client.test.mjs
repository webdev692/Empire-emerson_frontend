import assert from 'node:assert/strict';
import test from 'node:test';

// Node's module boundary stands in for the Vite compile-time profile. No network,
// runtime secrets or local login alias are read by this suite.
globalThis.__EPDG_HOSTED_PRACTICE_PROFILE__ = { environment: 'synthetic-hosted', portalOrigins: ['https://portal.example.com'] };
globalThis.__EPDG_HOSTED_PRACTICE_ENABLED__ = true;
const { API_ORIGIN, createPortalClient, loginAlias, parseSession, resolveLoginEmail } = await import('./client.ts');
const { hostedContextAllowed, PRACTICE_ENVIRONMENT } = await import('./runtimeProfile.ts');
const { parseDashboard, createLearningClient } = await import('./learningClient.ts');
const { parseOnboardingSummary, createOnboardingClient } = await import('./onboardingClient.ts');
const { parseSubmission } = await import('./assignmentClient.ts');
const { parseReviewQueue, parseLearnerFeedback } = await import('./reviewClient.ts');
const { parseAssignmentAttempts } = await import('./revisionClient.ts');
const { retirePortalWorker } = await import('./workerRetirement.ts');
const at = '2026-10-24T18:00:00.000Z';
const program = '10000000-0000-4000-8000-000000000001';
const item = '30000000-0000-4000-8000-000000000001';
const environment = 'synthetic-hosted';
const account = () => ({ success: true, environment, user: { id: 2, name: 'SYNTHETIC learner', email: 'learner@epdg.invalid', legacy_role: 'intern',
  memberships: [{ id: program, school_id: 1, company_id: null }], permissions: [], privileged_controls_available: false },
  expires_at: at, csrf_token: 'c'.repeat(43) });
const dashboard = () => ({ success: true, environment, learner_id: 2, generated_at: at,
  summary: { active_programs: 0, completed_items: 0, total_items: 0, progress_percent: 0 }, programs: [], upcoming: [], feedback: [], resources: [] });
const onboarding = () => ({ success: true, environment, learner_id: 2, generated_at: at, privileged_controls_available: false,
  onboarding: { status: 'not_received', program_id: null, program_title: null, updated_at: null } });

test('hosted bootstrap requires exact HTTPS origin and compiled production mode', () => {
  const context = { mode: 'hosted-practice', production: true, development: false, origin: 'https://portal.example.com' };
  assert.equal(hostedContextAllowed(context), true);
  for (const delta of [{ mode: 'production' }, { mode: 'synthetic-local' }, { production: false }, { development: true },
    { origin: 'http://portal.example.com' }, { origin: 'https://other.example.com' }, { origin: 'https://portal.example.com/' },
    { origin: 'http://127.0.0.1:58080' }]) assert.equal(hostedContextAllowed({ ...context, ...delta }), false);
});
test('hosted bootstrap retires only the exact portal worker and its scoped precache before sign-in', async () => {
  const events = []; let registered = true;
  const origin = 'https://portal.example.com';
  const other = { scope: `${origin}/other/`, active: { scriptURL: `${origin}/other/sw.js` }, async unregister() { throw new Error('Unrelated worker changed'); } };
  const portal = { scope: `${origin}/`, active: { scriptURL: `${origin}/sw.js` }, async unregister() { events.push('unregister'); registered = false; return true; } };
  const key = `workbox-precache-v2-${origin}/`;
  const reload = await retirePortalWorker({ controller: portal.active, async getRegistrations() {
    return registered ? [portal, other] : [other];
  } }, { async keys() { events.push('cache-keys'); return [key, 'google-fonts-cache', `workbox-precache-v2-${origin}/other/`, 'other-app-cache']; },
    async delete(key) { events.push(key); return true; } }, origin);
  assert.equal(reload, true);
  assert.deepEqual(events, ['unregister', 'cache-keys', key]);
  assert.equal(await retirePortalWorker(), false);
});
test('hosted bootstrap fails closed when an older worker cannot be retired', async () => {
  const origin = 'https://portal.example.com';
  const registration = { scope: `${origin}/`, active: { scriptURL: `${origin}/sw.js` }, async unregister() { return false; } };
  await assert.rejects(retirePortalWorker({ controller: registration.active, async getRegistrations() { return [registration]; } }, undefined, origin), /could not be verified/);
});
test('hosted bootstrap rejects unexpected controlling or root workers without changing them', async () => {
  const origin = 'https://portal.example.com'; let changed = false;
  const registration = { scope: `${origin}/`, active: { scriptURL: `${origin}/different.js` }, async unregister() { changed = true; return true; } };
  await assert.rejects(retirePortalWorker({ controller: registration.active, async getRegistrations() { return [registration]; } }, undefined, origin), /Unexpected/);
  await assert.rejects(retirePortalWorker({ controller: null, async getRegistrations() { return [registration]; } }, undefined, origin), /Unexpected/);
  await assert.rejects(retirePortalWorker(undefined, { async keys() { return []; }, async delete() { changed = true; return true; } }, 'http://portal.example.com'), /HTTPS origin/);
  assert.equal(changed, false);
});
test('hosted login stays blank and forwards a typed approved email without a client fixture mapping', async () => {
  assert.equal(PRACTICE_ENVIRONMENT, environment);
  assert.equal(API_ORIGIN, '');
  assert.equal(loginAlias, null);
  assert.equal(resolveLoginEmail(' admin@theemersonempire.info '), 'admin@theemersonempire.info');
  assert.equal(resolveLoginEmail('invalid'), null);
  let sent;
  const client = createPortalClient(async (url, options) => { sent = { url, options }; return Response.json(account()); });
  await client.login('admin@theemersonempire.info', 'not-a-real-password');
  assert.equal(sent.url, '/api/auth/login');
  assert.equal(JSON.parse(sent.options.body).email, 'admin@theemersonempire.info');
  assert.equal(sent.options.credentials, 'include');
  assert.equal(sent.options.redirect, 'error');
  assert.equal(sent.options.cache, 'no-store');
});
test('hosted authentication rejects missing or wrong environment and privileged or real-user responses', () => {
  assert.equal(parseSession(account()).user.id, 2);
  for (const wrong of [undefined, 'synthetic-local', 'production']) assert.throws(() => parseSession({ ...account(), environment: wrong }));
  const privileged = account(); privileged.user.privileged_controls_available = true; assert.throws(() => parseSession(privileged));
  const real = account(); real.user.email = 'real@example.com'; assert.throws(() => parseSession(real));
});
test('hosted data parsers accept only their expected environment for every data family', () => {
  const cases = [
    [dashboard(), value => parseDashboard(value, 2)],
    [onboarding(), value => parseOnboardingSummary(value, 2)],
    [{ success: true, environment, learner_id: 2, submission: { item_id: item, program_id: program, state: 'not_started',
      attempt_number: 1, previous_receipt_id: null, can_start_revision: false, answer: '', revision: 0, saved_at: null,
      receipt: null, attachments: [], removed_attachments: [] } }, value => parseSubmission(value, 2, program, item)],
    [{ success: true, environment, mentor_id: 3, reviews: [] }, value => parseReviewQueue(value, 3)],
    [{ success: true, environment, learner_id: 2, item_id: item, program_id: program, receipt_id: null, feedback: [] }, value => parseLearnerFeedback(value, 2, program, item, null)],
    [{ success: true, environment, learner_id: 2, item_id: item, program_id: program, attempts: [] }, value => parseAssignmentAttempts(value, 2, program, item)],
  ];
  for (const [valid, parse] of cases) {
    assert.equal(parse(valid).environment, environment);
    for (const wrong of [undefined, 'synthetic-local', 'production']) assert.throws(() => parse({ ...valid, environment: wrong }));
  }
});
test('hosted clients use fixed same-origin paths and never interpret backend errors as onboarding approval', async () => {
  const calls = [];
  const fetcher = async (url, options) => { calls.push({ url, options }); return Response.json(url.endsWith('/onboarding') ? onboarding() : dashboard()); };
  await createLearningClient(fetcher).loadDashboard(2);
  await createOnboardingClient(fetcher).loadOnboarding(2);
  assert.deepEqual(calls.map(call => call.url), ['/api/learner/dashboard', '/api/learner/onboarding']);
  for (const call of calls) { assert.equal(call.options.credentials, 'include'); assert.equal(call.options.redirect, 'error'); assert.equal(call.options.cache, 'no-store'); }
  await assert.rejects(createOnboardingClient(async () => Response.json({ success: true }, { status: 503 })).loadOnboarding(2));
  await assert.rejects(createPortalClient(async () => Response.json({ success: true, environment: 'synthetic-local' })).logout('c'.repeat(43)));
});
