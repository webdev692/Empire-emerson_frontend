import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';

const root = resolve(process.argv[2] ?? 'dist-admin-staging');
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
assert.deepEqual(names.filter(name => name.endsWith('.html')), ['admin-staging.html']);
assert.ok(names.includes('_headers'), 'local-only security headers are emitted');
const combined = (await Promise.all(files.filter(path => /\.(html|js|css|json|txt)$/.test(path) || path.endsWith('\\_headers') || path.endsWith('/_headers')).map(path => readFile(path, 'utf8')))).join('\n');
assert.match(combined, /noindex, nofollow/);
assert.match(combined, /admin-staging-local/);
assert.doesNotMatch(combined, /epdg\.netlify\.app|theemersonempire\.info|VITE_API_URL|localStorage|sessionStorage|Authorization/i);
assert.doesNotMatch(combined, /fonts\.googleapis\.com|fonts\.gstatic\.com/i);
const staticContent = (await Promise.all(files.filter(path => /\.(html|css)$/.test(path) || path.endsWith('\\_headers') || path.endsWith('/_headers')).map(path => readFile(path, 'utf8')))).join('\n');
assert.doesNotMatch(staticContent, /https:\/\//i);
console.log(`Verified isolated admin build: ${names.length} files, one HTML entrypoint, no production origin or browser token storage.`);
