import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { validatePortalReleaseProfile, portalReleaseRedirects, portalReleaseHeaders } from './portal-release-profile.mjs';
const root = resolve(process.argv[2] ?? 'dist-portal-release');
const expected = validatePortalReleaseProfile(process.env);
const metadata = JSON.parse(readFileSync(join(root,'release-candidate.json'),'utf8'));
assert.deepEqual(metadata,expected);
assert.equal(readFileSync(join(root,'_redirects'),'utf8'),portalReleaseRedirects(expected));
assert.equal(readFileSync(join(root,'_headers'),'utf8'),portalReleaseHeaders);
const html = readFileSync(join(root,'index.html'),'utf8');
assert.doesNotMatch(html,/https?:|fonts\.google|manifest|registerSW|crossorigin="use-credentials"/);
assert.match(html,/no-referrer/);
const files = readdirSync(join(root,'assets'));
assert.ok(files.some(f=>f.endsWith('.js')));
for(const file of files) {
  assert.ok(!file.endsWith('.map'));
  if(!file.endsWith('.js'))continue;
  const content=readFileSync(join(root,'assets',file),'utf8');
  assert.doesNotMatch(content,/127\.0\.0\.1:580(?:00|80)|local-synthetic\/|frontend-login-alias|localStorage\.setItem|sessionStorage\.setItem|VITE_API_BASE_URL|Bearer /);
}
assert.ok(existsSync(join(root,'sw.js')));
assert.ok(!existsSync(join(root,'manifest.webmanifest')));
console.log('Portal release artifact verified: isolated, same-origin API, no stored credentials, explicit target, release held.');
