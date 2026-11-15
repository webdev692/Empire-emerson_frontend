import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { loadReviewArtifact, requestPath, reviewOrigin } from './portal-release-preview.mjs';
import { portalReleaseHeaders } from './portal-release-profile.mjs';

test('HTTPS review rejects traversal, ambiguous paths and private dotfiles before proxy or SPA routing', () => {
  for (const path of ['/../secret', '/%2e%2e/secret', '/%252e%252e/secret', '//other.test/api', '/.env', '/assets/.key', '/a\\b', '/api/%ff', 'https://other.test/']) assert.equal(requestPath(path), null, path);
  assert.equal(requestPath('/api/auth/session'), '/api/auth/session');
  assert.equal(requestPath('/resources/approved-id?returnTo=%2Flearning'), '/resources/approved-id');
});

test('HTTPS review binds every immutable artifact byte to its manifest and exact held origin', () => {
  const parent = resolve(tmpdir());
  const directory = mkdtempSync(join(parent, 'epdg-https-artifact-test-'));
  try {
    const artifact = join(directory, 'artifact'); mkdirSync(artifact);
    const files = { 'index.html': '<html>Public sign-in</html>', '_headers': portalReleaseHeaders, '_redirects': 'fixture routing', 'release-candidate.json': JSON.stringify({ environment: 'portal-release-candidate', portalOrigin: reviewOrigin, releaseAuthorized: false }) };
    const manifest = { sourceCommit: 'a'.repeat(40), profile: 'portal-release', files: Object.entries(files).map(([path, contents]) => ({ path, sha256: createHash('sha256').update(contents).digest('hex') })) };
    for (const [name, contents] of Object.entries(files)) writeFileSync(join(artifact, name), contents);
    const manifestFile = join(directory, 'manifest.json'); writeFileSync(manifestFile, JSON.stringify(manifest));
    const loaded = loadReviewArtifact(artifact, manifestFile);
    writeFileSync(join(artifact, 'index.html'), 'Changed after snapshot');
    assert.equal(loaded.bytesByPath.get('index.html').toString(), files['index.html']);
    assert.throws(() => loadReviewArtifact(artifact, manifestFile));
    writeFileSync(join(artifact, 'index.html'), files['index.html']);
    writeFileSync(join(artifact, 'private.json'), '{}');
    assert.throws(() => loadReviewArtifact(artifact, manifestFile));
  } finally {
    if (resolve(directory).startsWith(join(parent, 'epdg-https-artifact-test-'))) rmSync(directory, { recursive: true, force: true });
  }
});
