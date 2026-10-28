import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { validateHostedPracticeProfile, hostedPracticeRedirects, hostedPracticeHeaders } from './hosted-practice-profile.mjs';

const directory = process.argv[2];
assert.ok(directory, 'Specify the isolated hosted practice build directory.');
const root = resolve(directory);
const profile = validateHostedPracticeProfile(JSON.parse(readFileSync(new URL('../hosted-practice.config.json', import.meta.url), 'utf8')));
const files = [];
function collect(folder, prefix = '') {
  for (const entry of readdirSync(folder, { withFileTypes: true })) {
    const name = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) collect(join(folder, entry.name), name);
    else files.push(name);
  }
}
collect(root);
const index = readFileSync(join(root, 'index.html'), 'utf8');
const javascript = files.filter(file => file.endsWith('.js')).map(file => readFileSync(join(root, file), 'utf8')).join('\n');
assert.ok(javascript.length > 0, 'Missing compiled hosted practice JavaScript.');
for (const match of index.matchAll(/(?:src|href)="(\/assets\/[^"?#]+)"/g)) assert.ok(existsSync(join(root, match[1].slice(1))), 'Missing referenced asset.');
assert.match(index, /Hosted synthetic practice/);
for (const marker of ['synthetic-hosted', 'Hosted synthetic practice', 'Owner/admin controls closed', 'Onboarding handoff', '/auth/login', '/api/learner/onboarding']) {
  assert.ok((index + javascript).includes(marker), `Hosted artifact lacks ${marker}.`);
}
assert.doesNotMatch(index + javascript, /http:\/\/127\.0\.0\.1|localhost|__EPDG_SYNTHETIC_LOGIN_ALIAS__|frontend-login-alias|runtime\.json|learner-a@epdg\.invalid|admin@theemersonempire\.info|mock-signature|intern@test\.com|Alice Mwangi|University of Nebraska/,
  'Hosted artifact contains local-only, private alias or legacy mock content.');
assert.doesNotMatch(index + javascript, /serviceWorker\s*\.\s*register\s*\(|registerSW\.js|-----BEGIN (?:RSA |EC )?PRIVATE KEY-----|sb_secret_|sk_live_/, 'Hosted artifact contains worker registration or credential-shaped content.');
assert.match(javascript, /getRegistrations/, 'Hosted artifact must retire an installed older portal worker before account access.');
assert.ok(!files.some(file => /\.map$|(?:^|\/)(?:registerSW\.js|workbox[^/]*\.js|manifest\.webmanifest)$/.test(file)), 'Hosted artifact emitted a source map or PWA file.');
assert.deepEqual(files.filter(file => /(?:^|\/)sw\.js$/.test(file)), ['sw.js'], 'Only the exact prior root worker path may carry retirement code.');
const retirementSource = readFileSync(new URL('./hosted-practice-retirement-worker.js', import.meta.url), 'utf8');
assert.equal(readFileSync(join(root, 'sw.js'), 'utf8'), retirementSource, 'Retirement worker differs from the audited source.');
assert.doesNotMatch(retirementSource, /addEventListener\(['"]fetch|\bfetch\s*\(|importScripts|\bcaches\.(?:open|match|put)\s*\(/,
  'Retirement worker must not fetch, serve or populate cached content.');
assert.equal(readFileSync(join(root, '_redirects'), 'utf8'), hostedPracticeRedirects(profile), 'Hosted API proxy differs from the pinned profile.');
assert.equal(readFileSync(join(root, '_headers'), 'utf8'), hostedPracticeHeaders, 'Hosted document headers differ from the secure profile.');
assert.deepEqual(JSON.parse(readFileSync(join(root, 'hosted-practice.json'), 'utf8')), profile);
writeFileSync(join(root, 'verification.json'), JSON.stringify({ mode: 'hosted-practice', environment: profile.environment,
  api: 'same-origin /api; pinned backend rewrite', checkedOutRevision: process.env.GITHUB_SHA ?? null,
  files: files.map(file => ({ file, sha256: createHash('sha256').update(readFileSync(join(root, file))).digest('hex') })),
  limitations: 'Compiled profile checks only; hosted cookie, backend isolation and browser acceptance require their own evidence.' }, null, 2) + '\n');
console.log(`hosted-practice: compiled profile checks passed (${files.length} files)`);
