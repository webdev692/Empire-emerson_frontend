import assert from 'node:assert/strict';
import { before, after, test } from 'node:test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from './node_modules/vite/dist/node/index.js';
import react from './node_modules/@vitejs/plugin-react/dist/index.js';
import React from './node_modules/react/index.js';
import ReactDOMServer from './node_modules/react-dom/server.node.js';
import { filterSCRecords, initialSCFilters, publicSourceUrl, validateSCDataset } from './src/data/scCommunityModel.ts';
const data = JSON.parse(readFileSync(new URL('./src/data/sc-community.local.json', import.meta.url), 'utf8'));
let server, render;
before(async () => {
  server = await createServer({ root: fileURLToPath(new URL('.', import.meta.url)), configFile: false, plugins: [react()], resolve: { dedupe: ['react', 'react-dom'] }, server: { middlewareMode: true, hmr: false }, appType: 'custom', logLevel: 'silent' });
  const { default: Directory } = await server.ssrLoadModule('/src/Components/SCCommunityDirectory.tsx');
  render = dataset => ReactDOMServer.renderToStaticMarkup(React.createElement(Directory, { dataset }));
});
after(async () => { await server?.close(); });
test('SC11 source reconciliation retains all 1,039 listing identities and 46 county routes', () => {
  validateSCDataset(data);
  assert.equal(data.records.length, 1039); assert.equal(data.countyRoutes.length, 46);
  assert.deepEqual(data.records.filter(row => row.kind === 'current').map(row => row.id), Array.from({ length: 1013 }, (_, i) => `SC-R${String(i + 1).padStart(3, '0')}`));
  assert.deepEqual(data.records.filter(row => row.kind === 'archive').map(row => row.id), Array.from({ length: 26 }, (_, i) => `SC-A${String(i + 1).padStart(3, '0')}`));
  for (const row of data.records.filter(row => row.kind === 'current')) {
    assert.equal(row.details.length, 12, row.id); assert.ok(row.sourceCheckedRaw); assert.ok(row.sourceUrls.length);
    for (const label of ['Need', 'Service area', 'Who may qualify', 'How to start', 'Public contact', 'Public address / access', 'Published hours / dates', 'Documents / screening', 'Cost / payment', 'Evidence status', 'Availability status', 'Important caveat']) assert.ok(row.details.some(field => field.label === label), `${row.id}: ${label}`);
  }
  assert.deepEqual(data.records.filter(row => row.warnings.length).map(row => row.id), ['SC-A002', 'SC-A013', 'SC-A018']);
  assert.equal(data.layoutNotes.length, 4); // Misplaced source captions are not provider eligibility.
  assert.equal(data.records.filter(row => row.sourceCheckedRaw && !row.sourceCheckedOn).length, 380);
  assert.deepEqual([...new Set(data.records.map(row => row.sourceCheckedOn))].sort(), ['2026-10-07', '2026-10-15', '2026-10-16', null].sort());
});
test('search covers IDs, requirements and locations; filters and archive boundaries compose', () => {
  assert.equal(filterSCRecords(data.records, initialSCFilters).length, 1013);
  assert.equal(filterSCRecords(data.records, { ...initialSCFilters, edition: 'archive' }).length, 26);
  assert.equal(filterSCRecords(data.records, { ...initialSCFilters, edition: 'all' }).length, 1039);
  assert.deepEqual(filterSCRecords(data.records, { ...initialSCFilters, query: 'SC-R1013' }).map(row => row.id), ['SC-R1013']);
  const match = data.records[4];
  const results = filterSCRecords(data.records, { ...initialSCFilters, need: match.need, area: match.serviceArea });
  assert.ok(results.some(row => row.id === match.id)); assert.ok(results.every(row => row.need === match.need && row.serviceArea === match.serviceArea));
  assert.equal(filterSCRecords(data.records, { ...initialSCFilters, query: 'no-such-fictional-program-xyz' }).length, 0);
});
test('initial rendering uses existing design, twelve cards and the full 46-county selector', () => {
  const html = render(data);
  assert.match(html, /id="south-carolina-resources"/); assert.doesNotMatch(html, /<h1/);
  assert.equal((html.match(/class="cp-card sc-resource-card"/g) || []).length, 12);
  assert.equal((html.match(/value="SC-ENERGY-/g) || []).length, 46);
  assert.match(html, /Showing 1–12 of 1,013 SC listings/); assert.match(html, /Next SC page/);
  assert.match(html, /Some services charge fees/); assert.match(html, /not a new live availability check/);
  assert.match(html, /Public contact supplied/); assert.match(html, /target="_blank" rel="noreferrer"/);
});
test('source conflicts, fees and archive cautions render before source links', () => {
  const held = data.records.find(row => row.id === 'SC-A013');
  const html = render({ ...data, records: [{ ...held, id: 'SC-R9999', kind: 'current' }] });
  assert.match(html, /PHONE CONFLICT/); assert.match(html, /843-817-4428/); assert.match(html, /803-531-9528/);
  assert.ok(html.indexOf('PHONE CONFLICT') < html.indexOf('sc-source-links'));
  assert.match(html, /No separate check date supplied/);
  const paid = data.records.find(row => row.id === 'SC-A021');
  const paidHtml = render({ ...data, records: [{ ...paid, id: 'SC-R9998', kind: 'current' }] });
  assert.match(paidHtml, /park admission/);
});
test('private links, duplicate identities and invalid content fail within the supplement', () => {
  for (const url of ['javascript:alert(1)', 'https://drive.google.com/file/d/private', 'https://example.org/?token=secret', 'https://user:pw@example.org/']) assert.equal(publicSourceUrl(url), false);
  assert.throws(() => validateSCDataset({ ...data, records: [data.records[0], data.records[0]] }));
  const html = render({ ...data, records: [{ ...data.records[0], sourceUrls: ['https://docs.google.com/spreadsheets/d/private'] }] });
  assert.match(html, /role="alert"/); assert.match(html, /existing resource collection remains available/); assert.doesNotMatch(html, /docs\.google/);
});
