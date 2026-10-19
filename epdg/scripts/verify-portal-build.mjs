import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const [mode, directory] = process.argv.slice(2);
assert.ok(['normal', 'design-preview'].includes(mode), 'Specify normal or design-preview');
assert.ok(directory, 'Specify the isolated build output directory');
const root = resolve(directory);
const files = [];
function collect(folder, prefix = '') {
  for (const entry of readdirSync(folder, { withFileTypes: true })) {
    const name = join(prefix, entry.name);
    if (entry.isDirectory()) collect(join(folder, entry.name), name);
    else files.push(name);
  }
}
collect(root);
const index = readFileSync(join(root, 'index.html'), 'utf8');
const scripts = files.filter(file => file.endsWith('.js'));
assert.ok(scripts.some(file => file.startsWith('assets/')), 'Missing compiled JavaScript');
for (const match of index.matchAll(/(?:src|href)="(\/assets\/[^"?#]+)"/g)) {
  assert.ok(existsSync(join(root, match[1].slice(1))), 'HTML references a missing build asset');
}
const js = scripts.map(file => readFileSync(join(root, file), 'utf8')).join('\n');
const notice = 'Design preview — authentication and participant data are not connected.';
const designMarkers = [notice, 'Your learning workspace', 'Guide the next step', 'Program delivery workspace', 'Institution workspace', 'Authorized-student reporting'];
const holdMarkers = ['Secure access is being prepared', 'An invitation is required', 'Account recovery is unavailable'];
if (mode === 'normal') {
  for (const marker of holdMarkers) assert.ok(js.includes(marker), `Normal artifact lacks hold state: ${marker}`);
  for (const marker of designMarkers) assert.ok(!js.includes(marker), `Design interface leaked into normal artifact: ${marker}`);
} else {
  for (const marker of designMarkers) assert.ok(js.includes(marker), `Design artifact lacks layout/notice: ${marker}`);
  for (const marker of holdMarkers) assert.ok(!js.includes(marker), 'Hold entry leaked into design artifact');
  assert.ok(!files.some(file => /(?:^|\/)(?:sw\.js|registerSW\.js|workbox[^/]*\.js|manifest\.webmanifest)$/.test(file)), 'Preview emitted service-worker/PWA files');
  assert.doesNotMatch(index + js, /serviceWorker|registerSW\.js/, 'Preview includes worker registration');
  assert.doesNotMatch(js, /auth-store|Bearer |\/api\/auth\/|XMLHttpRequest|tranquil-tenderness-productionepdg\.up\.railway\.app/, 'Preview contains legacy authentication or API connection markers');
}
for (const marker of ['mock-signature', 'intern@test.com', 'school@test.com', 'Alice Mwangi', 'University of Nebraska']) {
  assert.ok(!js.includes(marker), `Artifact contains legacy fixture marker: ${marker}`);
}
assert.doesNotMatch(index + js, /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----|sb_secret_|sk_live_/, 'Artifact contains a credential-shaped value');
const evidence = {
  mode,
  checkedOutRevision: process.env.GITHUB_SHA ?? null,
  pullRequestHead: process.env.PR_HEAD_SHA ?? null,
  files: files.map(file => ({ file, sha256: createHash('sha256').update(readFileSync(join(root, file))).digest('hex') })),
  limitations: 'Artifact marker and registration checks; not browser interaction, comprehensive secret detection, or backend authorization evidence.',
};
writeFileSync(join(root, 'verification.json'), JSON.stringify(evidence, null, 2) + '\n');
console.log(`${mode}: compiled artifact checks passed (${files.length} files)`);
