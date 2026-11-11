import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';
import { ADMIN_STAGING_HOSTED_OUTPUT, adminStagingHostedHeaders, adminStagingHostedRedirects, validateAdminStagingApiOrigin } from './admin-staging-hosted-profile.mjs';

const root = resolve(process.argv[2] ?? ADMIN_STAGING_HOSTED_OUTPUT);
const apiOrigin = validateAdminStagingApiOrigin(process.env.EPDG_ADMIN_STAGING_API_ORIGIN);
async function filesBelow(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const found = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) found.push(...await filesBelow(path));
    else found.push(path);
  }
  return found;
}
const files = await filesBelow(root);
const names = files.map(path => relative(root, path).replaceAll('\\', '/')).sort();
assert.deepEqual(names.filter(name => name.endsWith('.html')), ['index.html']);
assert.ok(names.includes('_headers') && names.includes('_redirects'));
assert.ok(!names.some(name => name.endsWith('.map')), 'source maps are excluded');
assert.ok(!names.some(name => /^(?:sw\.js|manifest\.webmanifest)$/i.test(name)), 'hosted admin output does not contain a service worker or install manifest');
const redirects = await readFile(join(root, '_redirects'), 'utf8');
assert.equal(redirects, adminStagingHostedRedirects(apiOrigin), 'only the API path is proxied to the verified Railway origin');
const headers = await readFile(join(root, '_headers'), 'utf8');
assert.equal(headers, adminStagingHostedHeaders);
const bundle = (await Promise.all(files.filter(path => /\.(html|js|css)$/.test(path)).map(path => readFile(path, 'utf8')))).join('\n');
assert.match(bundle, /noindex,nofollow/);
assert.doesNotMatch(bundle, /127\.0\.0\.1|localhost|58000|epdg\.netlify\.app|theemersonempire\.info|Local staging|loopback/i);
assert.doesNotMatch(bundle, /localStorage|sessionStorage|Authorization/i);
assert.equal(bundle.includes(apiOrigin), false, 'the backend origin is not embedded in browser JavaScript or HTML');
assert.match(headers, /connect-src 'self'/);
assert.match(headers, /Cache-Control: no-store/);
console.log(`Verified protected admin staging artifact: ${names.length} files, one root entrypoint, same-origin API proxy, no production origin or browser token storage.`);
