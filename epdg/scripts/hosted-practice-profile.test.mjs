import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { resolveConfig } from 'vite';
import { validateHostedPracticeProfile, hostedPracticeRedirects, hostedPracticeHeaders } from './hosted-practice-profile.mjs';

// Fictional origins used only for pure validation; these tests make no requests.
const fixture = () => ({ version: 1, environment: 'synthetic-hosted', portalOrigins: ['https://portal.example.com'], backendOrigin: 'https://backend.example.com' });
const enabled = { EPDG_HOSTED_PRACTICE_ENABLED: '1' };
test('hosted profile is default-off and requires exact reviewed fields and HTTPS origins', () => {
  assert.throws(() => validateHostedPracticeProfile(fixture(), {}), /disabled/);
  assert.throws(() => validateHostedPracticeProfile(fixture(), { EPDG_HOSTED_PRACTICE_ENABLED: 'true' }), /disabled/);
  for (const change of [p => { p.environment = 'synthetic-local'; }, p => { p.extra = true; }, p => { p.portalOrigins = []; },
    p => { p.portalOrigins.push(p.portalOrigins[0]); }, p => { p.backendOrigin = p.portalOrigins[0]; }]) {
    const value = fixture(); change(value); assert.throws(() => validateHostedPracticeProfile(value, enabled));
  }
  for (const origin of ['http://portal.example.com', 'https://127.0.0.1', 'https://[::1]', 'https://localhost',
    'https://backend.invalid', 'https://private.internal', 'https://portal.example.com/', 'https://portal.example.com:8443',
    'https://user:password@portal.example.com', 'https://portal.example.com/path', 'https://portal.example.com?x=1']) {
    assert.throws(() => validateHostedPracticeProfile({ ...fixture(), backendOrigin: origin }, enabled));
    assert.throws(() => validateHostedPracticeProfile({ ...fixture(), portalOrigins: [origin] }, enabled));
  }
  assert.ok(Object.isFrozen(validateHostedPracticeProfile(fixture(), enabled)));
});
test('hosted proxy and document headers route only same-origin API paths to the pinned backend', () => {
  const profile = validateHostedPracticeProfile(fixture(), enabled);
  assert.equal(hostedPracticeRedirects(profile), '/api/* https://backend.example.com/api/:splat 200!\n/* /index.html 200\n');
  assert.match(hostedPracticeHeaders, /Cache-Control: no-store/);
  assert.match(hostedPracticeHeaders, /connect-src 'self';/);
  assert.doesNotMatch(hostedPracticeHeaders, /localhost|127\.0\.0\.1|https:\/\//);
});
test('hosted mode cannot run as a dev server or inherit a browser API environment setting', async () => {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const inline = { root, mode: 'hosted-practice', logLevel: 'silent' };
  await assert.rejects(resolveConfig(inline, 'serve'), /explicit reviewed build/);
  const previous = process.env.EPDG_HOSTED_PRACTICE_ENABLED;
  delete process.env.EPDG_HOSTED_PRACTICE_ENABLED;
  try { await assert.rejects(resolveConfig(inline, 'build'), /disabled/); }
  finally { if (previous === undefined) delete process.env.EPDG_HOSTED_PRACTICE_ENABLED; else process.env.EPDG_HOSTED_PRACTICE_ENABLED = previous; }
});
test('hosted entry and profile have no private alias, runtime config or automatic sign-in', () => {
  const source = readFileSync(new URL('../src/synthetic/hosted-main.tsx', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /runtime\.json|frontend-login-alias|localStorage|sessionStorage|\.login\(/);
  assert.match(source, /hostedContextAllowed/);
  assert.match(source, /captureRecovery/);
  const profile = JSON.parse(readFileSync(new URL('../hosted-practice.config.json', import.meta.url), 'utf8'));
  assert.deepEqual(Object.keys(profile).sort(), ['backendOrigin', 'environment', 'portalOrigins', 'version']);
});
