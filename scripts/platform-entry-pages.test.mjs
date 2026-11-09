import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from '../Emerson_Empire/node_modules/vite/dist/node/index.js';
import react from '../Emerson_Empire/node_modules/@vitejs/plugin-react/dist/index.js';
import { createElement } from '../node_modules/react/index.js';
import { renderToStaticMarkup } from '../node_modules/react-dom/server.node.js';
import { MemoryRouter } from '../node_modules/react-router-dom/dist/index.mjs';
import { validatePlatformEntryPagesRelease } from './platform-entry-pages-release.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const links = JSON.parse(readFileSync(resolve(root, 'shared/platform-entry-links.json'), 'utf8'));

test('platform page approval uses the authorized routes, destinations, and closed access boundaries', () => {
  const approved = validatePlatformEntryPagesRelease(root);
  assert.deepEqual(approved.links.page_paths, { TEE: ['/creative-studio', '/platforms'], TEA: ['/staff-crm'], EPDG: ['/intern-portal'] });
  assert.equal(approved.links.login_destinations.creative_studio, 'https://start-project-9563ae.netlify.app/');
  assert.equal(approved.links.login_destinations.crm, 'https://emerson-crm.netlify.app/');
  assert.equal(approved.links.login_destinations.epdg_portal, 'https://epdg.netlify.app/login');
});

test('the public route table and navigation expose each approved information page', () => {
  const tee = readFileSync(resolve(root, 'Emerson_Empire/src/App.tsx'), 'utf8');
  const tea = readFileSync(resolve(root, 'Agency_LandingPage/src/App.tsx'), 'utf8');
  const epdg = readFileSync(resolve(root, 'EPDG-Landing-Page/src/App.tsx'), 'utf8');
  assert.match(tee, /path="\/creative-studio"/);
  assert.match(tee, /path="\/platforms"/);
  assert.match(tea, /path="\/staff-crm"/);
  assert.match(epdg, /path="\/intern-portal"/);
  assert.match(readFileSync(resolve(root, 'Emerson_Empire/src/Components/Umbrella/Navbar.tsx'), 'utf8'), /label: 'Creative Studio'/);
  assert.match(readFileSync(resolve(root, 'Agency_LandingPage/src/Components/Umbrella/Navbar.tsx'), 'utf8'), /label: 'Staff CRM Login'/);
  const epdgNavigation = readFileSync(resolve(root, 'EPDG-Landing-Page/src/components/EPDG/Navbar.tsx'), 'utf8');
  assert.match(epdgNavigation, /label: "Intern Portal"/);
  assert.doesNotMatch(epdgNavigation, /Create Account|PLATFORM_URL/);
  assert.match(readFileSync(resolve(root, 'EPDG-Landing-Page/src/components/EPDG/Internship.tsx'), 'utf8'), /Intern Portal information/);
});

test('rendered portal pages state their verified access boundaries and link to the exact applications', async () => {
  const server = await createServer({
    root,
    configFile: false,
    plugins: [react()],
    optimizeDeps: { noDiscovery: true, include: [] },
    define: {
      'import.meta.env.MODE': '"public-release"',
      'import.meta.env.DEV': 'false',
      'import.meta.env.BASE_URL': '"/"',
      'import.meta.env.VITE_PLATFORM_ENTRY_PAGES_RELEASE': '"true"',
      'import.meta.env.VITE_TEE_PUBLIC_ORIGIN': '"https://theemerson.netlify.app"',
      'import.meta.env.VITE_TEA_PUBLIC_ORIGIN': '"https://emersonagency.netlify.app"',
      'import.meta.env.VITE_EPDG_PUBLIC_ORIGIN': '"https://emersonprofessionaldevelopment.netlify.app"',
    },
    server: { middlewareMode: true, watch: null, hmr: false },
    appType: 'custom',
  });
  try {
    const { PlatformInformationPage, PlatformHomeGateway } = await server.ssrLoadModule('/shared/PlatformEntryPages.tsx');
    const render = (entity, page) => renderToStaticMarkup(createElement(PlatformInformationPage, { entity, page }));
    const creative = render('TEE', 'creative-studio');
    const crm = render('TEA', 'staff-crm');
    const portal = render('EPDG', 'intern-portal');
    const directory = render('TEE', 'platforms');
    const gateway = renderToStaticMarkup(createElement(PlatformHomeGateway, { entity: 'TEE' }));
    assert.ok(creative.includes('href="https://start-project-9563ae.netlify.app/"'));
    assert.match(creative, /Personal accounts available · company workspace controlled/);
    assert.match(creative, /private save and reopen flows for supported Image, Video, Audio, and Social projects/);
    assert.ok(crm.includes('href="https://emerson-crm.netlify.app/"'));
    assert.match(crm, /Invitation-only · membership and record permissions required/);
    assert.match(crm, /The CRM owns applicant, resume, and onboarding records/);
    assert.ok(portal.includes('href="https://epdg.netlify.app/login"'));
    assert.match(portal, /Hosted synthetic practice · real learner access not activated/);
    assert.match(portal, /No public portal registration is offered/);
    assert.match(portal, /humanresources@theemersonempire.info/);
    assert.match(directory, /Emerson CRM/);
    assert.match(directory, /The Emerson Agency/);
    assert.match(directory, /Emerson Professional Development Group information/);
    assert.match(directory, /TEE Project Studio/);
    assert.match(directory, /TEA Project Studio/);
    assert.match(gateway, /href="\/creative-studio"/);
    assert.match(gateway, /href="\/platforms"/);
    for (const html of [creative, crm, portal, directory]) {
      assert.match(html, /aria-label="Breadcrumb"/);
      assert.match(html, /aria-label="Frequently asked questions"|<section[^>]*aria-labelledby="pe-faq-heading"/);
      assert.doesNotMatch(html, /\?utm_source=|token=|access_token=|Create Account/);
    }
  } finally { await server.close(); }
});

test('TEE Project Studio expands planning and review without changing its two approved examples or opening intake', async () => {
  const server = await createServer({
    root,
    configFile: false,
    plugins: [react()],
    optimizeDeps: { noDiscovery: true, include: [] },
    define: { 'import.meta.env.MODE': '"studio-local"', 'import.meta.env.DEV': 'false', 'import.meta.env.BASE_URL': '"/"', 'import.meta.env.VITE_TEE_PUBLIC_ORIGIN': '"https://theemerson.netlify.app"' },
    server: { middlewareMode: true, watch: null, hmr: false },
    appType: 'custom',
  });
  try {
    const { default: ProjectStudio } = await server.ssrLoadModule('/shared/ProjectStudio.tsx');
    const html = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(ProjectStudio, { entity: 'TEE', view: 'page' })));
    assert.match(html, /Project stages and the record used to guide each decision/);
    assert.match(html, /The lead and reviewer should compare each deliverable/);
    assert.match(html, /Confidentiality and ownership/);
    assert.match(html, /Intern contributor, if assigned/);
    assert.match(html, /not accept project inquiries/);
    assert.match(html, /BUS-03/);
    assert.match(html, /SYS-03/);
    assert.doesNotMatch(html, /Create Account|Book a project|Start payment/);
    const data = JSON.parse(readFileSync(resolve(root, 'shared/project-studio.public.json'), 'utf8'));
    assert.deepEqual(data.examples.map(item => item.id), ['BUS-03', 'SYS-03']);
  } finally { await server.close(); }
});
