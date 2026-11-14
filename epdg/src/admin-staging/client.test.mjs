import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { after, test } from 'node:test';

const originalFetch = globalThis.fetch;
const calls = [];
globalThis.__EPDG_ADMIN_STAGING_API_ORIGIN__ = 'http://127.0.0.1:58000';
globalThis.fetch = async (url, init) => {
  calls.push({ url: String(url), init });
  if (String(url).endsWith('/auth/session') || String(url).endsWith('/auth/login')) {
    return new Response(JSON.stringify({ success: true, user: {
      id: 1, name: 'SYNTHETIC Local Founder Admin', email: 'founder-admin@epdg.invalid',
      legacy_role: 'admin', portal_roles: ['founder_admin'], permissions: ['admin.overview.read'],
      privileged_controls_available: true,
    }, expires_at: '2030-01-01T00:00:00.000Z', csrf_token: 'c'.repeat(43) }), { status: 200 });
  }
  if (String(url).endsWith('/admin/overview')) {
    return new Response(JSON.stringify({ success: true, data: { environment: 'isolated-synthetic' } }), { status: 200 });
  }
  return new Response(JSON.stringify({ success: true }), { status: 200 });
};

const client = await import('./client.ts');
const { parseInvitationReview } = await import('./invitations.ts');

after(() => {
  globalThis.fetch = originalFetch;
  delete globalThis.__EPDG_ADMIN_STAGING_API_ORIGIN__;
});

test('login uses the server session and does not submit a client-selected role', async () => {
  const session = await client.signIn('founder-admin@epdg.invalid', 'synthetic-only-password');
  assert.equal(session.user.portal_roles[0], 'founder_admin');
  const login = calls.at(-1);
  assert.equal(login.url, 'http://127.0.0.1:58000/api/auth/login');
  assert.equal(login.init.credentials, 'include');
  assert.equal(login.init.cache, 'no-store');
  assert.equal(login.init.headers.get('X-EPDG-Request'), 'portal');
  assert.deepEqual(JSON.parse(login.init.body), { email: 'founder-admin@epdg.invalid', password: 'synthetic-only-password' });
  assert.equal(login.init.headers.has('Authorization'), false);
});

test('read APIs use cookie credentials and mutations send the in-memory CSRF token', async () => {
  await client.signIn('founder-admin@epdg.invalid', 'synthetic-only-password');
  await client.get('/admin/overview');
  const read = calls.at(-1);
  assert.equal(read.init.credentials, 'include');
  assert.equal(read.init.headers.has('Authorization'), false);

  await client.post('/admin/role-requests', { target_user_id: 2, role_code: 'webdev_technical' });
  const mutation = calls.at(-1);
  assert.equal(mutation.init.headers.get('X-EPDG-Request'), 'portal');
  assert.equal(mutation.init.headers.get('X-CSRF-Token'), 'c'.repeat(43));
  assert.equal(mutation.init.credentials, 'include');

  await client.signOut();
  assert.equal(calls.at(-1).init.headers.get('X-CSRF-Token'), 'c'.repeat(43));
});

test('the client has no browser token storage and does not render arbitrary API error text', async () => {
  const source = await readFile(new URL('./client.ts', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /localStorage|sessionStorage|Authorization/i);
  const workingFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({ success: false, message: 'password=private-fixture' }), { status: 400 });
  await assert.rejects(() => client.signIn('founder-admin@epdg.invalid', 'private-fixture'), error => {
    assert.equal(error.message, 'The request could not be completed.');
    assert.equal(error.message.includes('private-fixture'), false);
    return true;
  });
  globalThis.fetch = workingFetch;
});

test('a failed logout keeps its CSRF token for an explicit retry', async () => {
  await client.signIn('founder-admin@epdg.invalid', 'synthetic-only-password');
  const workingFetch = globalThis.fetch;
  globalThis.fetch = async () => { throw new Error('offline'); };
  await assert.rejects(() => client.signOut(), error => error.status === 0);
  globalThis.fetch = workingFetch;
  await client.signOut();
  const logout = calls.at(-1);
  assert.equal(logout.url, 'http://127.0.0.1:58000/api/auth/logout');
  assert.equal(logout.init.headers.get('X-CSRF-Token'), 'c'.repeat(43));
});

test('malformed or real-identity sessions and unsuccessful envelopes are rejected', async () => {
  const workingFetch = globalThis.fetch;
  const fixture = { success: true, user: { id: 2, name: 'SYNTHETIC Account', email: 'review@epdg.invalid', legacy_role: 'intern',
    portal_roles: [], permissions: [], privileged_controls_available: false }, expires_at: '2030-01-01T00:00:00Z', csrf_token: 'c'.repeat(43) };
  try {
    for (const change of [v => { v.success = false; }, v => { v.user.email = 'person@example.com'; },
      v => { v.expires_at = 'not-a-date'; }, v => { v.expires_at = '2000-01-01'; }, v => { v.user.permissions = ['read', {}]; }, v => { v.csrf_token = 'short'; }]) {
      const bad = structuredClone(fixture); change(bad);
      globalThis.fetch = async () => Response.json(bad);
      await assert.rejects(client.restoreSession(), e => e.status === 502);
    }
    globalThis.fetch = async () => Response.json({ ...fixture, token: 'private', user: { ...fixture.user, password: 'private' } });
    const session = await client.restoreSession();
    assert.equal('password' in session.user, false); assert.equal('token' in session, false);
  } finally { globalThis.fetch = workingFetch; }
});

test('late session restoration cannot repopulate CSRF after logout', async () => {
  const workingFetch = globalThis.fetch;
  let release;
  try {
    globalThis.fetch = async (url, init) => String(url).endsWith('/auth/session') ? new Promise(resolve => { release = resolve; }) : workingFetch(url, init);
    const restoration = client.restoreSession();
    await client.signOut();
    release(await workingFetch('http://127.0.0.1:58000/api/auth/session', {}));
    await assert.rejects(restoration, e => e.status === 401);
    await client.post('/admin/role-requests', { target_user_id: 2 });
    assert.equal(calls.at(-1).init.headers.has('X-CSRF-Token'), false);
  } finally { globalThis.fetch = workingFetch; }
});

test('invitation review rejects live identities or release grants and strips token fields', () => {
  const fixture = { enabled: true, production_release_available: false,
    items: [{ id: 'synthetic-invite', user_id: 2, name: 'SYNTHETIC Account', email: 'review@epdg.invalid', role_code: 'participant',
      status: 'pending', delivery_status: 'sent', expires_at: '2030-01-01T00:00:00Z', email_confirmed_at: null, accepted_at: null, last_successful_sign_in: null, token: 'private' }],
    eligible_users: [{ id: 2, name: 'SYNTHETIC Account', email: 'review@epdg.invalid' }],
    roles: [{ code: 'participant', name: 'Participant', invitable: true, reason: null }] };
  const result = parseInvitationReview(fixture);
  assert.equal('token' in result.items[0], false);
  assert.equal(result.items[0].last_successful_sign_in, null);
  for (const change of [v => { v.production_release_available = true; }, v => { v.eligible_users[0].email = 'real@example.com'; },
    v => { v.items[0].email = 'real@example.com'; }, v => { v.items[0].status = 'invented'; }, v => { v.items[0].last_successful_sign_in = 'unknown'; },
    v => { v.items[0].status = 'accepted'; }]) {
    const invalid = structuredClone(fixture); change(invalid); assert.throws(() => parseInvitationReview(invalid), e => e.status === 502);
  }
});
