/** Integrity/privacy checks for the newly authorized three-website release. */
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sha256, lfSha256, assertPublicPrivacy, publicBoundarySha256 } from './public-source-boundary.mjs';
import { validateFrozenPublicContent } from './validate-frozen-public-content.mjs';
import { liveHeaders } from './live-policy.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const { boundary } = validateFrozenPublicContent(root);
const approval = JSON.parse(readFileSync(resolve(root, 'docs/PUBLIC_WEBSITE_REPAIR_2026-10-28.json'), 'utf8'));
assert.equal(lfSha256(readFileSync(resolve(root, approval.legal_source_path))), approval.legal_source_sha256_lf);
assert.deepEqual(approval.scope, ['Emerson_Empire', 'Agency_LandingPage', 'EPDG-Landing-Page']);
for (const key of ['portal_activation_authorized', 'crm_changes_authorized', 'media_studio_changes_authorized']) assert.equal(approval[key], false);
const files = dir => readdirSync(dir).flatMap(name => {
  const path = resolve(dir, name);
  return statSync(path).isDirectory() ? files(path) : [path];
});
for (const [entity, site] of Object.entries(boundary.published)) {
  const dist = resolve(root, site.app, 'dist');
  const manifest = JSON.parse(readFileSync(resolve(dist, 'release-build.json'), 'utf8'));
  assertPublicPrivacy(manifest);
  assert.equal(manifest.mode, 'public-release');
  assert.equal(manifest.content_revision, site.content_revision);
  assert.equal(manifest.public_boundary_sha256, publicBoundarySha256);
  assert.equal(manifest.site_id, site.site_id);
  assert.equal(manifest.origin, site.origin);
  assert.equal(manifest.registration_enabled, true);
  assert.equal(manifest.live_intake_enabled, true);
  assert.equal(manifest.three_programs.email_drafts_only, false);
  assert.equal(manifest.website_repair.authorization_record, 'docs/PUBLIC_WEBSITE_REPAIR_2026-10-28.json');
  assert.equal(manifest.website_repair.legal_approved, approval.legal_publication_approved);
  for (const key of ['portal_changed', 'crm_changed', 'media_studio_changed']) assert.equal(manifest.website_repair[key], false);
  assert.equal(!!manifest.research, entity === 'TEE');
  assert.equal(!!manifest.project_studio, entity !== 'EPDG');
  const emitted = files(dist).map(path => relative(dist, path).replaceAll('\\', '/')).filter(path => path !== 'release-build.json').sort();
  assert.deepEqual(emitted, manifest.files.filter(row => row.path !== 'release-build.json').map(row => row.path).sort());
  for (const row of manifest.files.filter(row => row.path !== 'release-build.json')) {
    const bytes = readFileSync(resolve(dist, row.path));
    assert.equal(sha256(bytes), row.sha256);
    assert.ok(!/catalog\.(?:local|review|drafts)|c4\.local|work-resources\.local|\.map$|\.env$|\.zip$|\.docx$|\.xlsx$/i.test(row.path), 'Private source artifact emitted');
    if (/\.(?:js|html|json|txt)$/.test(row.path)) {
      const text = bytes.toString('utf8');
      assert.doesNotMatch(text, /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\b(?:sk-proj-|sk_live_|sb_secret_|ghp_|github_pat_)[A-Za-z0-9_-]{15,}|\bAKIA[A-Z0-9]{16}\b/, 'Credential pattern in artifact');
      assert.doesNotMatch(text, /Fictional local test provider|demo@example\.invalid|mock-signature|send-consultation-email|new_import_acknowledged|senior_project_synthetic_handoff/, 'Private/fixture marker in artifact');
      assert.doesNotMatch(text, /https:\/\/(?:drive\.google\.com\/(?:file|drive|open)|docs\.google\.com\/(?:document|spreadsheets|presentation)|mail\.google\.com\/)/i, 'Private document/inbox link in artifact');
    }
  }
  const headers = readFileSync(resolve(dist, '_headers'), 'utf8');
  for (const [key, value] of Object.entries(liveHeaders)) assert.ok(headers.includes(`${key}: ${value}`));
  assert.ok(headers.includes("form-action 'none'"));
  const html = readFileSync(resolve(dist, 'index.html'), 'utf8');
  assert.ok(html.includes(`rel="canonical" href="${site.origin}/"`));
  assert.doesNotMatch(html, /onload=|data-netlify|noindex/i);
  const sitemap = readFileSync(resolve(dist, 'sitemap.xml'), 'utf8');
  for (const path of ['/classes', '/privacy', '/terms', '/disclaimer', '/inquiry']) assert.ok(sitemap.includes(site.origin + path));
  console.log(`${entity}: current manifest hashes, approved payloads, privacy, canonical routes and external-only intake PASS (${emitted.length} files).`);
}
