import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sha256, assertPublicPrivacy, publicBoundarySha256 } from './public-source-boundary.mjs';
import { validateFrozenPublicContent } from './validate-frozen-public-content.mjs';
import { liveHeaders } from './live-policy.mjs';
import { readLinuxCompilationBoundary } from './linux-compilation-boundary.mjs';

function compareArtifacts(root, selectedEntities, platform) {
  const { boundary } = validateFrozenPublicContent(root);
  const fingerprints = platform === 'linux' ? readLinuxCompilationBoundary(root).compiled : boundary.published;
  const identity = platform === 'linux' ? 'verified Linux compilation' : 'published';
  const files = dir => readdirSync(dir).flatMap(name => {
    const path = resolve(dir, name);
    return statSync(path).isDirectory() ? files(path) : [path];
  });
  const results = [];
  for (const [entity, site] of Object.entries(fingerprints)) {
    if (selectedEntities?.length && !selectedEntities.includes(entity)) continue;
    const dist = resolve(root, site.app, 'dist');
    const actual = files(dist).map(path => relative(dist, path).replaceAll('\\', '/')).filter(path => path !== 'release-build.json').sort();
    assert.deepEqual(actual, site.files.map(row => row.path).sort(), `${entity}: ${identity} artifact set changed`);
    for (const row of site.files) {
      const bytes = readFileSync(resolve(dist, row.path));
      assert.equal(bytes.length, row.bytes, `${entity}: ${identity} artifact size changed: ${row.path}`);
      assert.equal(sha256(bytes), row.sha256, `${entity}: ${identity} artifact hash changed: ${row.path}`);
      assert.ok(!/catalog\.(?:local|review|drafts)|c4\.local|work-resources\.local|\.map$|\.env$|\.zip$|\.docx$|\.xlsx$/i.test(row.path), 'Private source artifact emitted');
      if (/\.(?:js|html|json|txt)$/.test(row.path)) {
        const text = bytes.toString('utf8');
        assert.ok(!/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\b(?:sk-proj-|sk_live_|sb_secret_|ghp_|github_pat_)[A-Za-z0-9_-]{15,}|\bAKIA[A-Z0-9]{16}\b/.test(text), `${entity}: credential pattern in artifact`);
        assert.ok(!/Fictional local test provider|demo@example\.invalid|mock-signature|send-consultation-email|new_import_acknowledged|senior_project_synthetic_handoff/.test(text), `${entity}: private/fixture marker in artifact`);
        // Legacy Google Forms destinations remain in preserved intern source;
        // the public release intercepts them and CSP blocks all submissions.
        // Private documents, Drive files and inbox links are never permitted.
        assert.ok(!/https:\/\/(?:drive\.google\.com\/(?:file|drive|open)|docs\.google\.com\/(?:document|spreadsheets|presentation)|mail\.google\.com\/)/i.test(text), `${entity}: private document/inbox link in artifact`);
      }
    }
    const manifest = JSON.parse(readFileSync(resolve(dist, 'release-build.json'), 'utf8'));
    assertPublicPrivacy(manifest);
    assert.equal(manifest.mode, 'public-release');
    assert.equal(manifest.content_revision, site.content_revision);
    assert.equal(manifest.public_boundary_sha256, publicBoundarySha256);
    assert.equal(manifest.site_id, site.site_id);
    assert.equal(manifest.origin, site.origin);
    assert.equal(manifest.public_release_approved, true);
    assert.equal(manifest.registration_enabled, false);
    assert.equal(manifest.live_intake_enabled, false);
    assert.equal(manifest.three_programs.email_drafts_only, true);
    assert.equal(!!manifest.research, entity === 'TEE');
    assert.equal(!!manifest.project_studio, entity !== 'EPDG');
    for (const row of manifest.files.filter(row => row.path !== 'release-build.json')) assert.equal(sha256(readFileSync(resolve(dist, row.path))), row.sha256);
    const headers = readFileSync(resolve(dist, '_headers'), 'utf8');
    for (const [key, value] of Object.entries(liveHeaders)) assert.ok(headers.includes(`${key}: ${value}`));
    assert.ok(headers.includes("form-action 'none'"));
    results.push({ entity, app: site.app, content_revision: site.content_revision, files: site.files.length, ...(platform === 'linux' ? { unchanged_linux_compilation_hashes: true } : { unchanged_published_hashes: true }), excluded_metadata: ['release-build.json'] });
    console.log(`${entity}: all ${site.files.length} ${identity} asset/content hashes unchanged; fresh metadata, privacy and submission holds PASS.`);
  }
  return results;
}

export const comparePublishedArtifacts = (root, selectedEntities) => compareArtifacts(root, selectedEntities, 'windows');
export const compareLinuxCompiledArtifacts = (root, selectedEntities) => compareArtifacts(root, selectedEntities, 'linux');

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const linux = args.includes('--platform=linux');
  const entities = args.filter(arg => arg !== '--platform=linux');
  assert.ok(entities.every(entity => ['TEE', 'TEA', 'EPDG'].includes(entity)), 'Unknown artifact platform/entity argument');
  (linux ? compareLinuxCompiledArtifacts : comparePublishedArtifacts)(fileURLToPath(new URL('..', import.meta.url)), entities);
}
