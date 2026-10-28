import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { createServer } from './node_modules/vite/dist/node/index.js';
import react from './node_modules/@vitejs/plugin-react/dist/index.js';
import React from './node_modules/react/index.js';
import ReactDOMServer from './node_modules/react-dom/server.node.js';

let server;
let render;
let dataset;
before(async () => {
  server = await createServer({
    root: fileURLToPath(new URL('.', import.meta.url)),
    configFile: false,
    plugins: [react()],
    resolve: { dedupe: ['react', 'react-dom'] },
    server: { middlewareMode: true, hmr: false },
    appType: 'custom',
    logLevel: 'silent',
  });
  const { default: Directory } = await server.ssrLoadModule('/src/components/CollegesDirectory.tsx');
  render = props => ReactDOMServer.renderToStaticMarkup(React.createElement(Directory, props));
  dataset = JSON.parse(readFileSync(new URL('./src/data/institutions.local.json', import.meta.url), 'utf8'));
});
after(async () => { await server?.close(); });

test('the directory fits below the existing resource page and limits initial rendering to twelve records', () => {
  const html = render({ dataset });
  assert.match(html, /<h2 id="epdg-colleges-title">Colleges &amp; Universities<\/h2>/);
  assert.doesNotMatch(html, /<h1/);
  assert.equal((html.match(/class="cp-card epdg-college-card"/g) || []).length, Math.min(12, dataset.records.length));
  assert.match(html, /aria-label="Filter colleges and universities"/);
  assert.match(html, /role="status" aria-live="polite" aria-atomic="true"/);
  assert.match(html, /Showing 1–12 of /);
  assert.match(html, /<button type="button" disabled="">Previous page<\/button>/);
  assert.match(html, /<button type="button">Next page<\/button>/);
  const expected = dataset.records.toSorted((first, second) => first.name.localeCompare(second.name, 'en', { sensitivity: 'base' }) || first.id.localeCompare(second.id)).slice(0, 12);
  const escapeHtml = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#x27;');
  assert.deepEqual([...html.matchAll(/<h3>(.*?)<\/h3>/gs)].map(match => match[1]), expected.map(record => escapeHtml(record.name)));
});

test('source uncertainty and safe link labels remain visible without admissions or partnership claims', () => {
  const html = render({ dataset });
  assert.match(html, /Needs review/);
  assert.match(html, /Source check date<\/dt><dd>Not recorded/);
  assert.match(html, /Not supplied:/);
  assert.match(html, /Listings do not establish an Emerson partnership/);
  assert.match(html, /Listings do not guarantee admission, scholarships or free tuition/);
  assert.match(html, /Website supplied in source/);
  assert.match(html, /target="_blank" rel="noreferrer"/);
  assert.doesNotMatch(html, /verify before outreach|Founder Review Required|Pass 1 Complete/);
});

test('invalid imported data is isolated to the directory and never rendered as content', () => {
  const html = render({ dataset: { ...dataset, records: [{ name: '<script>private</script>' }] } });
  assert.match(html, /role="alert"/);
  assert.match(html, /The institution directory could not be loaded/);
  assert.doesNotMatch(html, /<script>|private/);
});
