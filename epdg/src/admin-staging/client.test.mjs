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
    }, expires_at: '2030-01-01T00:00:00.000Z', csrf_token: 'csrf-fixture' }), { status: 200 });
  }
  if (String(url).endsWith('/admin/overview')) {
    return new Response(JSON.stringify({ success: true, data: { environment: 'isolated-synthetic' } }), { status: 200 });
  }
  return new Response(JSON.stringify({ success: true }), { status: 200 });
};

const client = await import('./client.ts');

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
  assert.equal(mutation.init.headers.get('X-CSRF-Token'), 'csrf-fixture');
  assert.equal(mutation.init.credentials, 'include');

  await client.signOut();
  assert.equal(calls.at(-1).init.headers.get('X-CSRF-Token'), 'csrf-fixture');
});

test('the client has no browser token storage and does not render arbitrary API error text', async () => {
  const source = await readFile(new URL('./client.ts', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /localStorage|sessionStorage|Authorization/i);
  globalThis.fetch = async () => new Response(JSON.stringify({ success: false, message: 'password=private-fixture' }), { status: 400 });
  await assert.rejects(() => client.signIn('founder-admin@epdg.invalid', 'private-fixture'), error => {
    assert.equal(error.message, 'The request could not be completed.');
    assert.equal(error.message.includes('private-fixture'), false);
    return true;
  });
});
