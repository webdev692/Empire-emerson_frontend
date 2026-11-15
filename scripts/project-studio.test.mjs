import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, copyFileSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join, dirname, basename, resolve } from 'node:path';
import { createServer } from '../Emerson_Empire/node_modules/vite/dist/node/index.js';
import react from '../Emerson_Empire/node_modules/@vitejs/plugin-react/dist/index.js';
import { createElement } from '../node_modules/react/index.js';
import { renderToStaticMarkup } from '../node_modules/react-dom/server.node.js';
import { fileURLToPath } from 'node:url';
import { validateStudioPublication } from './project-studio-release.mjs';
const root = fileURLToPath(new URL('..', import.meta.url));
const catalog = JSON.parse(readFileSync(new URL('../shared/project-studio.public.json', import.meta.url), 'utf8'));
const information = JSON.parse(readFileSync(new URL('../shared/project-studio.information.json', import.meta.url), 'utf8'));
const informationPath = 'shared/project-studio.information.json';
const informationApprovalPath = 'docs/PROJECT_STUDIO_PHASE_FOUR_AUTHORIZATION.json';
const hash = text => createHash('sha256').update(text.replaceAll('\r\n', '\n')).digest('hex');
const visibleText = html => html.replace(/<[^>]+>/g, ' ').replaceAll('&amp;', '&').replaceAll('&#x27;', "'").replaceAll('&quot;', '"').replace(/\s+/g, ' ').trim();

function fixture(run) {
  const base = resolve(tmpdir());
  const dir = mkdtempSync(join(base, 'emerson-studio-'));
  try {
    for (const path of ['docs/PROJECT_STUDIO_PUBLICATION_APPROVAL.json', 'shared/project-studio.public.json', 'shared/project-studio.preview.json', informationPath, informationApprovalPath]) {
      mkdirSync(dirname(join(dir, path)), { recursive: true });
      copyFileSync(join(root, path), join(dir, path));
    }
    run(dir);
  } finally {
    assert.equal(dirname(resolve(dir)), base);
    assert.ok(basename(dir).startsWith('emerson-studio-'));
    rmSync(dir, { recursive: true, force: true });
  }
}
const readJson = (dir, path) => JSON.parse(readFileSync(join(dir, path), 'utf8'));
const writeJson = (dir, path, value) => writeFileSync(join(dir, path), JSON.stringify(value, null, 2) + '\n');
function changeInformation(dir, change) {
  const data = readJson(dir, informationPath);
  change(data);
  writeJson(dir, informationPath, data);
  const authorization = readJson(dir, informationApprovalPath);
  authorization.information_data_sha256_lf = hash(readFileSync(join(dir, informationPath), 'utf8'));
  writeJson(dir, informationApprovalPath, authorization);
}

test('the publication approval binds the exact reviewed subset to TEE and TEA only', () => {
  const approval = validateStudioPublication(root);
  assert.equal(approval.reviewed_commit, '060e35ae2e454cf2ef15c6f59619377897faed3d');
  assert.deepEqual(approval.entities, ['TEE', 'TEA']);
  assert.deepEqual(approval.example_ids, ['BUS-03', 'SYS-03']);
  assert.equal(approval.live_intake_enabled, false);
  assert.equal(approval.informationApproval.informational_only, true);
  assert.deepEqual(approval.informationApproval.entities, ['TEE', 'TEA']);
  assert.equal(approval.information.categories.length, 8);
  assert.equal(approval.information.illustrativeCases.length, 4);
  assert.equal(approval.information.processSteps.length, 6);
});

test('approved public Studio renders verified company links and planning status without local review notes', async () => {
  const server = await ssr('public-release', true);
  try {
    const { projectStudioEnabled } = await server.ssrLoadModule('/shared/project-studio-mode.ts');
    assert.equal(projectStudioEnabled, true);
    const { default: Studio } = await server.ssrLoadModule('/shared/ProjectStudio.tsx');
    for (const entity of ['TEE', 'TEA']) {
      const html = renderToStaticMarkup(createElement(Studio, {entity, view: 'page'}));
      assert.match(html, /Live project intake/);
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
    assert.equal((tee.match(/<details>/g) || []).length, 13);
    assert.equal((tee.match(/<textarea/g) || []).length, 6);
    for (const html of [tee, tea]) {
      assert.doesNotMatch(html, /<form|<iframe|type="submit"|mailto:|forms\.gle|drive\.google|\$\d|80%|20%|guaranteed earnings/);
      assert.match(html, /Request a project quote/);
    }
    assert.match(tee, /not submitted or stored/);
    assert.match(tea, /qualifications, jurisdiction and professional scope/);
    assert.match(tea, /final legal contracting entity/);
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
    const { projectBriefText, briefQuestions } = await server.ssrLoadModule('/shared/project-studio-brief.ts');
    assert.deepEqual(briefQuestions.map(row => row.key), ['goal', 'responsibility', 'materials', 'outcome', 'constraints', 'questions']);
    const brief = { goal: ' Organize inquiry follow-up ', responsibility: 'Coordinate the workflow', materials: 'A notebook\nA calendar', outcome: 'One clear workflow — reviewed', constraints: 'Discuss timing before agreement', questions: 'Who reviews the result?' };
    const original = structuredClone(brief);
    const text = projectBriefText(brief);
    assert.deepEqual(brief, original);
    for (const { key, label } of briefQuestions) { assert.ok(text.includes(label)); assert.ok(text.includes(brief[key].trim())); }
    assert.match(text, /Organize inquiry follow-up\n/);
    assert.match(text, /A notebook\nA calendar/);
    assert.match(text, /One clear workflow — reviewed/);
    assert.match(text, /has not been submitted/);
    assert.match(text, /does not send a request, reserve project capacity or create a contract/);
    assert.match(text, /Do not include passwords, identity documents, financial accounts, tax records, personnel files/);
    assert.equal((projectBriefText(Object.fromEntries(briefQuestions.map(({ key }) => [key, ' ']))).match(/\(To be completed\)/g) || []).length, 6);
  } finally { await server.close(); }
});

test('TEE renders all eight informational areas, four hypothetical cases and six steps, with working category and brief anchors', async () => {
  const server = await ssr('public-release', true);
  try {
    const { default: Studio } = await server.ssrLoadModule('/shared/ProjectStudio.tsx');
    const { briefQuestions } = await server.ssrLoadModule('/shared/project-studio-brief.ts');
    const html = renderToStaticMarkup(createElement(Studio, { entity: 'TEE', view: 'page' }));
    const text = visibleText(html);
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.match(text, /Your business has work to do\. We're here to help move it forward\./);
    assert.match(text, /A clear scope\. An accountable team\. A professionally reviewed result\./);
    for (const row of information.categories) {
      assert.ok(html.includes(`id="category-${row.id}"`));
      assert.ok(html.includes(`href="#category-${row.id}"`));
      for (const value of [row.title, row.summary, row.detail, row.boundary, ...row.examples]) assert.ok(text.includes(value), `${row.id}: missing ${value}`);
    }
    for (const row of [...information.illustrativeCases, ...information.processSteps]) {
      assert.ok(text.includes(row.title)); assert.ok(text.includes(row.description));
    }
    for (const notice of [information.categoryNotice, information.illustrativeCaseNotice]) assert.ok(text.includes(notice));
    for (const id of ['studio-categories', 'studio-packages', 'project-brief']) assert.ok(html.includes(`id="${id}"`));
    for (const { key, label } of briefQuestions) {
      assert.ok(html.includes(`for="studio-${key}"`));
      assert.ok(html.includes(`id="studio-${key}"`));
      assert.ok(text.includes(label));
    }
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(new Set(ids).size, ids.length, 'No duplicate page IDs');
    for (const [, target] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(target), `Missing section ${target}`);
    assert.match(text, /not automatically assigned to revenue-producing work/);
    assert.match(text, /approved staffing, supervision and compensation arrangement/);
    assert.match(text, /does not confer authority to contract, access sensitive records, deliver regulated services or approve client work/);
    assert.match(text, /does not establish the contracting legal entity or authorized signatory/);
  } finally { await server.close(); }
});

test('TEA presents four distinct referral pathways whose TEE targets exist, and retains specialist boundaries', async () => {
  const server = await ssr('public-release', true);
  try {
    const { default: Studio } = await server.ssrLoadModule('/shared/ProjectStudio.tsx');
    const tee = renderToStaticMarkup(createElement(Studio, { entity: 'TEE', view: 'page' }));
    const tea = renderToStaticMarkup(createElement(Studio, { entity: 'TEA', view: 'page' }));
    assert.equal((tea.match(/<h1\b/g) || []).length, 1);
    assert.equal((tea.match(/<article class="ps-referral-pathway"/g) || []).length, 4);
    assert.equal((tea.match(/<textarea\b/g) || []).length, 0);
    assert.match(visibleText(tea), /Your business needs more than advice\. Sometimes it needs the work done\./);
    for (const path of ['/tax-preparation', '/insurance', '/financial-coaching', '/services-pricing']) assert.ok(tea.includes(`href="${path}"`));
    for (const [, anchor] of tea.matchAll(/href="https:\/\/theemerson\.netlify\.app\/project-studio#([^"]+)"/g)) assert.ok(tee.includes(`id="${anchor}"`), `Unresolved TEE referral ${anchor}`);
    assert.match(visibleText(tea), /not formal financial-statement audits or CPA attest services/);
    assert.match(visibleText(tea), /final legal contracting entity, service scope, price and availability require agreement/);
    assert.match(visibleText(tea), /no sales or appointment outcome is guaranteed/);
    assert.match(visibleText(tea), /Live project intake, registration and payments remain closed/);
  } finally { await server.close(); }
});

test('the personal brief has no network submission, browser persistence or tracking implementation', () => {
  const source = readFileSync(new URL('../shared/ProjectStudio.tsx', import.meta.url), 'utf8');
  const helper = readFileSync(new URL('../shared/project-studio-brief.ts', import.meta.url), 'utf8');
  assert.match(source, /URL\.createObjectURL\(new Blob\(\[projectBriefText\(brief\)\]/);
  assert.match(source, /anchor\.download = 'project-studio-personal-brief\.txt'/);
  assert.match(source, /URL\.revokeObjectURL\(url\)/);
  assert.doesNotMatch(source + helper, /\bfetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|indexedDB|document\.cookie|supabase|analytics|onSubmit|<form\b|<iframe\b/i);
});

test('authorization rejects an added informational category even when both new allowlist and checksum are refreshed', () => fixture(dir => {
  changeInformation(dir, data => data.categories.push({ ...data.categories[0], id: 'unapproved-category' }));
  const authorization = readJson(dir, informationApprovalPath);
  authorization.category_ids.push('unapproved-category');
  writeJson(dir, informationApprovalPath, authorization);
  assert.throws(() => validateStudioPublication(dir), /AssertionError/);
}));

test('authorization rejects price fields and numeric prices inside otherwise valid informational copy after rehashing', () => {
  for (const change of [data => { data.categories[0].price = 500; }, data => { data.categories[0].summary = 'Available for $500 per project.'; }]) fixture(dir => {
    changeInformation(dir, change);
    assert.throws(() => validateStudioPublication(dir), /unexpected or missing field|numeric prices/);
  });
});

test('every operational permission stays closed and EPDG cannot be added to the authorization', () => {
  const closed = ['registration_enabled', 'live_intake_enabled', 'payments_enabled', 'contracts_enabled', 'client_accounts_enabled', 'commercial_activation_enabled', 'sensitive_system_access_enabled', 'crm_integration_enabled', 'email_routing_enabled', 'new_spending_authorized', 'permissions_changed'];
  for (const key of closed) fixture(dir => {
    const authorization = readJson(dir, informationApprovalPath);
    authorization[key] = true;
    writeJson(dir, informationApprovalPath, authorization);
    assert.throws(() => validateStudioPublication(dir), new RegExp(`${key} must remain closed`));
  });
  fixture(dir => {
    const authorization = readJson(dir, informationApprovalPath);
    authorization.entities.push('EPDG');
    authorization.destinations.push('https://emersonprofessionaldevelopment.netlify.app');
    writeJson(dir, informationApprovalPath, authorization);
    assert.throws(() => validateStudioPublication(dir), /AssertionError/);
  });
});

test('historical approval and catalog tampering cannot be legalized by refreshing the new authorization hashes', () => {
  for (const [path, field] of [['docs/PROJECT_STUDIO_PUBLICATION_APPROVAL.json', 'historical_approval_sha256_lf'], ['shared/project-studio.public.json', 'historical_public_data_sha256_lf'], ['shared/project-studio.preview.json', 'historical_reviewed_data_sha256_lf']]) fixture(dir => {
    const changed = readJson(dir, path);
    if (changed.example_ids) changed.example_ids.push('NEW-01');
    else changed.examples[0].priceDisplay = 'New unauthorized price';
    writeJson(dir, path, changed);
    const authorization = readJson(dir, informationApprovalPath);
    authorization[field] = hash(readFileSync(join(dir, path), 'utf8'));
    writeJson(dir, informationApprovalPath, authorization);
    assert.throws(() => validateStudioPublication(dir), /immutable|unchanged/);
  });
});

test('case notices, references and schema retain informational boundaries, with no added process steps or endpoints', () => {
  for (const change of [
    data => { data.illustrativeCaseNotice = 'Completed client projects and delivered results.'; },
    data => { data.illustrativeCases[0].clientName = 'Invented client'; },
    data => { data.illustrativeCases[0].categoryId = 'unapproved-category'; },
    data => { data.processSteps.push({ id: 'pay-now', title: 'Pay Now', description: 'Pay for the project online now.' }); },
    data => { data.categories[0].summary = 'Submit your private records at https://example.invalid/intake'; },
  ]) fixture(dir => {
    changeInformation(dir, change);
    assert.throws(() => validateStudioPublication(dir), /AssertionError/);
  });
});

test('changed informational content without a reviewed hash and unknown approval fields are rejected', () => {
  fixture(dir => {
    const data = readJson(dir, informationPath);
    data.categories[0].summary = 'Changed but otherwise plausible informational copy.';
    writeJson(dir, informationPath, data);
    assert.throws(() => validateStudioPublication(dir), /must match Phase Four authorization/);
  });
  fixture(dir => {
    const authorization = readJson(dir, informationApprovalPath);
    authorization.additional_service_approved = true;
    writeJson(dir, informationApprovalPath, authorization);
    assert.throws(() => validateStudioPublication(dir), /unexpected or missing field/);
  });
});
