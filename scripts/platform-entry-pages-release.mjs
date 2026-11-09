import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export function validatePlatformEntryPagesRelease(root) {
  const read = path => JSON.parse(readFileSync(resolve(root, path), 'utf8'));
  const links = read('shared/platform-entry-links.json');
  const sites = read('shared/public-sites.json');
  assert.equal(links.schema_version, 1);
  assert.deepEqual(Object.fromEntries(Object.entries(sites).map(([entity, site]) => [entity, site.origin])), {
    TEE: 'https://theemerson.netlify.app',
    TEA: 'https://emersonagency.netlify.app',
    EPDG: 'https://emersonprofessionaldevelopment.netlify.app',
  });
  assert.deepEqual(Object.keys(links.page_paths).sort(), ['EPDG', 'TEA', 'TEE']);
  assert.deepEqual(links.page_paths.TEE, ['/creative-studio', '/platforms']);
  assert.deepEqual(links.page_paths.TEA, ['/staff-crm']);
  assert.deepEqual(links.page_paths.EPDG, ['/intern-portal']);
  assert.deepEqual(links.login_destinations, {
    creative_studio: 'https://start-project-9563ae.netlify.app/',
    crm: 'https://emerson-crm.netlify.app/',
    epdg_portal: 'https://epdg.netlify.app/login',
  });
  assert.deepEqual(links.support_mailboxes, {
    technical: 'webdev@theemersonempire.info',
    hr: 'humanresources@theemersonempire.info',
  });
  for (const [name, destination] of Object.entries(links.login_destinations)) {
    const url = new URL(destination);
    assert.equal(url.protocol, 'https:', `${name}: HTTPS required`);
    assert.equal(url.username, '', `${name}: credentials are not allowed in a URL`);
    assert.equal(url.password, '', `${name}: credentials are not allowed in a URL`);
    assert.equal(url.search, '', `${name}: access tokens or credentials are not allowed in a URL`);
    assert.equal(url.hash, '', `${name}: access tokens or credentials are not allowed in a URL`);
  }
  return { links };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  validatePlatformEntryPagesRelease(fileURLToPath(new URL('..', import.meta.url)));
  console.log('Platform entry pages: exact approved routes and HTTPS destinations; all access and activation boundaries remain closed.');
}
