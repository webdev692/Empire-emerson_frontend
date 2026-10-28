import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createServer } from '../Emerson_Empire/node_modules/vite/dist/node/index.js';
import react from '../Emerson_Empire/node_modules/@vitejs/plugin-react/dist/index.js';
import { createElement } from '../node_modules/react/index.js';
import { renderToStaticMarkup } from '../node_modules/react-dom/server.node.js';
import { fileURLToPath } from 'node:url';
import { validateStudioPublication } from './project-studio-release.mjs';
const root = fileURLToPath(new URL('..', import.meta.url));
const catalog = JSON.parse(readFileSync(new URL('../shared/project-studio.public.json', import.meta.url), 'utf8'));

test('the publication approval binds the exact reviewed subset to TEE and TEA only', () => {
  const approval = validateStudioPublication(root);
  assert.equal(approval.reviewed_commit, '060e35ae2e454cf2ef15c6f59619377897faed3d');
  assert.deepEqual(approval.entities, ['TEE', 'TEA']);
  assert.deepEqual(approval.example_ids, ['BUS-03', 'SYS-03']);
  assert.equal(approval.live_intake_enabled, false);
});

test('approved public Studio renders verified company links and planning status without local review notes', async () => {
  const server = await ssr('public-release', true);
  try {
    const { projectStudioEnabled } = await server.ssrLoadModule('/shared/project-studio-mode.ts');
    assert.equal(projectStudioEnabled, true);
    const { default: Studio } = await server.ssrLoadModule('/shared/ProjectStudio.tsx');
    for (const entity of ['TEE', 'TEA']) {
      const html = renderToStaticMarkup(createElement(Studio, {entity, view: 'page'}));
      assert.match(html, /Planning preview/);
      assert.doesNotMatch(html, /127\.0\.0\.1|localhost|local preview|Local design review|No offers approved for release/);
      if (entity === 'TEA') {
        assert.ok(html.includes('https://theemerson.netlify.app/project-studio#bus-03'));
        assert.ok(html.includes('https://theemerson.netlify.app/project-studio#sys-03'));
      }
    }
  } finally { await server.close(); }
});

test('Studio includes only two sanitized historical examples, with no internal economics or links', () => {
  assert.deepEqual(catalog.examples.map(item => item.id), ['BUS-03', 'SYS-03']);
  const fields = ['id', 'name', 'audience', 'family', 'summary', 'delivery', 'deliverables', 'limits', 'inputs', 'handoff', 'priceDisplay'].sort();
  for (const item of catalog.examples) { assert.deepEqual(Object.keys(item).sort(), fields); assert.equal(item.priceDisplay, 'Request a project quote'); }
  assert.doesNotMatch(JSON.stringify(catalog), /https?:|\$|\d+%|payroll|profit|person.hours|roster|Founder approval|timeline|readiness/i);
  assert.equal(catalog.examples[0].deliverables.length, 5);
  assert.match(catalog.examples[0].limits.join(' '), /Website builds/);
  assert.match(catalog.examples[1].limits.join(' '), /custom development/);
});

async function ssr(mode, approved = false) {
  return createServer({ root, configFile: false, plugins: [react()], optimizeDeps: { noDiscovery: true, include: [] }, define: { 'import.meta.env.MODE': JSON.stringify(mode), 'import.meta.env.VITE_PROJECT_STUDIO_RELEASE': JSON.stringify(String(approved)), 'import.meta.env.VITE_TEE_PUBLIC_ORIGIN': '"https://theemerson.netlify.app"', 'import.meta.env.DEV': 'false', 'import.meta.env.BASE_URL': '"/"' }, server: { middlewareMode: true, watch: null, hmr: false }, appType: 'custom' });
}
test('TEE has scoped deliverables, accessible FAQs and a local planning aid; TEA points to canonical TEE details', async () => {
  const server = await ssr('studio-local');
  try {
    const { default: Studio } = await server.ssrLoadModule('/shared/ProjectStudio.tsx');
    const tee = renderToStaticMarkup(createElement(Studio, { entity: 'TEE', view: 'page' }));
    const tea = renderToStaticMarkup(createElement(Studio, { entity: 'TEA', view: 'page' }));
    for (const item of catalog.examples) { assert.match(tee, new RegExp(`id="${item.id.toLowerCase()}"`)); assert.ok(tea.includes(`http://127.0.0.1:5183/project-studio#${item.id.toLowerCase()}`)); }
    assert.equal((tee.match(/<details>/g) || []).length, 9);
    assert.equal((tee.match(/<textarea/g) || []).length, 3);
    for (const html of [tee, tea]) {
      assert.doesNotMatch(html, /<form|<iframe|type="submit"|mailto:|forms\.gle|drive\.google|\$\d|80%|20%|guaranteed earnings/);
      assert.match(html, /Request a project quote/);
    }
    assert.match(tee, /not submitted or stored/);
    assert.match(tea, /licensed or regulated advice/);
    assert.match(tea, /proposed Studio operator/);
    assert.ok(!tea.includes('studio-goal'));
  } finally { await server.close(); }
});
test('Studio stays disabled in ordinary builds without the explicit approved publication flag', async () => {
  for (const mode of ['public-release', 'protected-review', 'production', 'development']) {
    const server = await ssr(mode);
    try {
      const { projectStudioEnabled } = await server.ssrLoadModule('/shared/project-studio-mode.ts');
      const { default: Page, StudioGateway } = await server.ssrLoadModule('/shared/ProjectStudioEntry.tsx');
      assert.equal(projectStudioEnabled, false);
      assert.equal(renderToStaticMarkup(createElement(Page, { entity: 'TEE' })), '');
      assert.equal(renderToStaticMarkup(createElement(StudioGateway, { entity: 'TEA' })), '');
    } finally { await server.close(); }
  }
});
test('saved planning briefs preserve text and state that no inquiry was submitted', async () => {
  const server = await ssr('studio-local');
  try {
    const { projectBriefText } = await server.ssrLoadModule('/shared/project-studio-brief.ts');
    const text = projectBriefText(' Organize inquiry follow-up ', 'A notebook\nA calendar', 'One clear workflow — reviewed');
    assert.match(text, /Organize inquiry follow-up\n/);
    assert.match(text, /A notebook\nA calendar/);
    assert.match(text, /One clear workflow — reviewed/);
    assert.match(text, /has not been submitted/);
    assert.equal((projectBriefText('', ' ', '').match(/\(To be completed\)/g) || []).length, 3);
  } finally { await server.close(); }
});
