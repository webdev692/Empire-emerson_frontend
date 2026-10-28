/** Reproduce an existing approved publication. This is not an authoring approval. */
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export const publicBoundarySha256 = '6333c77aff71a9c1a85e25c00808a6e197a992fe92394ec5ac4527329fa4f49f';
export const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
export const lfSha256 = value => sha256(value.toString('utf8').replaceAll('\r\n', '\n'));

export function readPublicBoundary(root, read = readFileSync) {
  const text = read(resolve(root, 'shared/public-source-boundary.json'));
  assert.equal(lfSha256(text), publicBoundarySha256, 'Frozen public boundary changed; separate exact-version review is required.');
  const boundary = JSON.parse(text);
  assert.equal(boundary.schema_version, 1);
  assert.equal(boundary.registration_enabled, false);
  assert.equal(boundary.live_intake_enabled, false);
  assert.deepEqual(Object.keys(boundary.published), ['TEE', 'TEA', 'EPDG']);
  return boundary;
}

export function validateFrozenExports(root, read = readFileSync) {
  const boundary = readPublicBoundary(root, read);
  for (const [path, receipt] of Object.entries(boundary.payloads)) {
    assert.ok(!path.includes('..') && !path.startsWith('/'));
    const bytes = read(resolve(root, path));
    const digest = path.endsWith('.pdf') ? sha256(bytes) : lfSha256(bytes);
    assert.equal(digest, receipt.sha256_lf, `Approved public payload changed: ${path}`);
  }
  return boundary;
}

const privateKeys = /^(?:source_notes|source_version|verification_notes|private_notes|private_feedback|password|access_token|refresh_token|authorization|resume|applicant_email|application_id|learner_record|private_messages)$/i;
const secrets = /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\b(?:sk-proj-|sk_live_|sb_secret_|ghp_|github_pat_)[A-Za-z0-9_-]{15,}|\bAKIA[A-Z0-9]{16}\b/;
const privateHosts = /(?:^|\.)(?:drive\.google\.com|docs\.google\.com|mail\.google\.com|outlook\.live\.com|sharepoint\.com|localhost|internal|local|invalid|test)$/i;

/** Separate semantic privacy check, in addition to immutable payload hashes. */
export function assertPublicPrivacy(value) {
  if (Array.isArray(value)) return value.forEach(assertPublicPrivacy);
  if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) {
      assert.ok(!privateKeys.test(key), 'Private field in public content');
      assertPublicPrivacy(item);
    }
  } else if (typeof value === 'string') {
    assert.ok(!secrets.test(value), 'Credential pattern in public content');
    if (/^https?:\/\//i.test(value)) {
      const url = new URL(value);
      assert.ok(!url.username && !url.password && !url.port && !privateHosts.test(url.hostname) && !/^[\d.]+$|:/.test(url.hostname), 'Private or local source URL');
      assert.ok(![...url.searchParams.keys()].some(key => /token|password|secret|signature|credential|auth|session|api[_-]?key/i.test(key)), 'Credential query in source URL');
    }
  }
}
