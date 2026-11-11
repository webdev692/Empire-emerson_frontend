import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ADMIN_STAGING_HOSTED_OUTPUT, adminStagingHostedHeaders, adminStagingHostedRedirects, validateAdminStagingApiOrigin } from './admin-staging-hosted-profile.mjs';

const fixtureOrigin = 'https://fixture.up.railway.app';

test('hosted admin build uses a separate output directory', () => {
  assert.equal(ADMIN_STAGING_HOSTED_OUTPUT, 'dist-admin-staging-hosted');
});

test('accepts only one exact HTTPS Railway service origin', () => {
  assert.equal(validateAdminStagingApiOrigin(fixtureOrigin), fixtureOrigin);
  for (const value of [
    'http://fixture.up.railway.app',
    'https://fixture.up.railway.app/',
    'https://fixture.up.railway.app/path',
    'https://fixture.up.railway.app?x=1',
    'https://user:pass@fixture.up.railway.app',
    'https://localhost',
    'https://example.invalid',
    '',
  ]) assert.throws(() => validateAdminStagingApiOrigin(value));
});

test('the only hosted proxy maps same-origin /api paths to the verified upstream API path', () => {
  assert.equal(adminStagingHostedRedirects(fixtureOrigin), '/api/* https://fixture.up.railway.app/api/:splat 200!\n');
});

test('hosted headers keep API access same-origin and prevent caching and framing', () => {
  assert.match(adminStagingHostedHeaders, /connect-src 'self'/);
  assert.match(adminStagingHostedHeaders, /Cache-Control: no-store/);
  assert.match(adminStagingHostedHeaders, /frame-ancestors 'none'/);
  assert.match(adminStagingHostedHeaders, /X-Robots-Tag: noindex, nofollow/);
  assert.doesNotMatch(adminStagingHostedHeaders, /railway\.app|http:/i);
});
