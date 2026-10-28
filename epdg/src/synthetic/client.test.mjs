import assert from 'node:assert/strict';
import test from 'node:test';
import { API_ORIGIN, captureRecovery, createPortalClient, parseSession, passwordProblem, PortalRequestError, resolveLoginEmail } from './client.ts';

const fixture = () => ({ success: true, user: { id: 1, name: 'SYNTHETIC learner', email: 'learner@epdg.invalid', legacy_role: 'intern',
  memberships: [{ id: 'membership-a', school_id: 7, company_id: null }], permissions: [], privileged_controls_available: false },
  expires_at: '2026-12-31T12:00:00.000Z', csrf_token: 'c'.repeat(43) });

test('session accepts only minimal synthetic self data and no privileged permissions', () => {
  const value = fixture(); value.token = 'must-not-be-retained'; value.user.password = 'must-not-be-retained';
  const parsed = parseSession(value);
  assert.equal(parsed.user.id, 1); assert.equal('token' in parsed, false); assert.equal('password' in parsed.user, false);
  for (const alter of [u => { u.permissions = ['admin']; }, u => { u.privileged_controls_available = true; },
    u => { u.email = 'person@example.com'; }, u => { u.memberships = []; },
    u => { u.memberships[0].company_id = 4; }, u => { u.memberships[0].school_id = -1; }]) {
    const invalid = fixture(); alter(invalid.user); assert.throws(() => parseSession(invalid), PortalRequestError);
  }
});

test('client uses pinned loopback cookies and verified CSRF, never a bearer or role field', async () => {
  const calls = [];
  const client = createPortalClient(async (url, options) => { calls.push({ url, options }); return Response.json(fixture()); });
  const current = await client.login('learner@epdg.invalid', 'synthetic-password');
  await client.session(); await client.logout(current.csrf_token);
  await client.change('current-password', 'new-synthetic-password', current.csrf_token);
  await client.forgot('learner@epdg.invalid'); await client.reset('r'.repeat(43), 'new-synthetic-password');
  assert.deepEqual(calls.map(c => c.url), ['/auth/login', '/auth/session', '/auth/logout', '/auth/change-password', '/auth/forgot-password', '/auth/reset-password'].map(path => `${API_ORIGIN}/api${path}`));
  for (const { options } of calls) {
    assert.equal(options.credentials, 'include'); assert.equal(options.cache, 'no-store');
    assert.equal(options.referrerPolicy, 'no-referrer'); assert.equal(options.redirect, 'error');
    assert.equal(options.headers.Authorization, undefined);
    if (options.method === 'POST') { assert.equal(options.headers['X-EPDG-Request'], 'portal'); assert.equal(options.headers['Content-Type'], 'application/json'); }
  }
  assert.deepEqual(JSON.parse(calls[0].options.body), { email: 'learner@epdg.invalid', password: 'synthetic-password' });
  assert.equal(calls[2].options.headers['X-CSRF-Token'], current.csrf_token);
  assert.equal(calls[3].options.headers['X-CSRF-Token'], current.csrf_token);
  assert.equal(calls[4].options.headers['X-CSRF-Token'], undefined);
});

test('API errors never reflect server payloads or network exceptions', async () => {
  const marker = 'private-provider-detail';
  const client = createPortalClient(async () => Response.json({ message: marker }, { status: 500 }));
  await assert.rejects(client.session(), e => e instanceof PortalRequestError && !e.message.includes(marker));
  const offline = createPortalClient(async () => { throw new Error(marker); });
  await assert.rejects(offline.session(), e => e.status === 0 && !e.message.includes(marker));
  const invalid = createPortalClient(async () => Response.json({ success: false }));
  await assert.rejects(invalid.forgot('learner@epdg.invalid'), e => e.status === 502);
});

test('recovery consumes only the documented reset fragment shape', () => {
  const valid = 'r'.repeat(43);
  assert.equal(captureRecovery({ pathname: '/reset-password', hash: `#token=${valid}` }), valid);
  for (const location of [ { pathname: '/login', hash: `#token=${valid}` }, { pathname: '/reset-password', hash: '#token=short' },
    { pathname: '/reset-password', hash: `#token=${valid}&email=private` }, { pathname: '/reset-password', hash: `#token=${valid}%20` } ]) {
    assert.equal(captureRecovery(location), null);
  }
});

test('password validation preserves the backend UTF-8 bcrypt boundary', () => {
  assert.ok(passwordProblem('short'));
  assert.equal(passwordProblem('a'.repeat(72)), null);
  assert.ok(passwordProblem('a'.repeat(73)));
  assert.equal(passwordProblem('é'.repeat(36)), null);
  assert.ok(passwordProblem('é'.repeat(37)));
});

test('an exact local alias preserves the existing synthetic identity without broad real-email access', () => {
  const alias = { loginEmail: 'preferred@review.example', fixtureEmail: 'learner-a@epdg.invalid' };
  assert.equal(resolveLoginEmail(' Preferred@Review.Example ', alias), 'learner-a@epdg.invalid');
  assert.equal(resolveLoginEmail('learner-b@epdg.invalid', alias), 'learner-b@epdg.invalid');
  assert.equal(resolveLoginEmail('other@review.example', alias), null);
  assert.equal(resolveLoginEmail('preferred@review.example', null), null);
  assert.equal(resolveLoginEmail('preferred@review.example', { ...alias, fixtureEmail: 'admin@epdg.invalid' }), null);
});

test('login and recovery send only the synthetic address to the backend and block unmatched real addresses', async () => {
  const calls = [];
  const alias = { loginEmail: 'preferred@review.example', fixtureEmail: 'learner-a@epdg.invalid' };
  const client = createPortalClient(async (_url, options) => { calls.push(JSON.parse(options.body)); return Response.json(fixture()); }, alias);
  await client.login('preferred@review.example', 'synthetic-password');
  await client.forgot('preferred@review.example');
  assert.deepEqual(calls, [{ email: 'learner-a@epdg.invalid', password: 'synthetic-password' }, { email: 'learner-a@epdg.invalid' }]);
  await assert.rejects(client.login('other@review.example', 'synthetic-password'), e => e.status === 400);
  await assert.rejects(client.forgot('other@review.example'), e => e.status === 400);
  assert.equal(calls.length, 2);
});
