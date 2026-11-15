import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateScholarship, validateSiteDocument, verifyRedirects } from './verify-modern-public.mjs';

const root = new URL('../', import.meta.url);
const manuscripts = JSON.parse(readFileSync(new URL('EPDG-Landing-Page/src/scholarship/manuscripts.json', root)));
const conferences = JSON.parse(readFileSync(new URL('EPDG-Landing-Page/src/scholarship/conferences.json', root)));
const clone = value => structuredClone(value);
const context = { entity: 'TEA', site: { origin: 'https://emersonagency.netlify.app' }, route: { path: '/founder', title: 'Founder biography', description: 'Meet Lyric Helena Emerson and learn about the Agency’s professional and educational approach.' } };
const founderId = 'https://theemerson.netlify.app/founder#lyric-helena-emerson';
const graph = { '@context': 'https://schema.org', '@graph': [
  { '@type': 'Person', '@id': founderId, name: 'Lyric Helena Emerson', sameAs: ['https://philpeople.org/profiles/lyric-helena-emerson', 'https://orcid.org/0009-0001-5355-6489'] },
  { '@type': 'Organization', '@id': 'https://emersonagency.netlify.app/#organization', name: 'The Emerson Agency LLC', founder: { '@id': founderId } },
  { '@type': 'BreadcrumbList', itemListElement: [{ position: 1, item: 'https://emersonagency.netlify.app/' }, { position: 2, item: 'https://emersonagency.netlify.app/founder' }] },
] };
const fixture = `<!doctype html><html lang="en"><head><title>Founder biography | The Emerson Agency LLC</title><meta name="description" content="${context.route.description}"><link rel="canonical" href="https://emersonagency.netlify.app/founder"><meta name="robots" content="index, follow"><meta property="og:url" content="https://emersonagency.netlify.app/founder"><meta property="og:image" content="https://emersonagency.netlify.app/social-preview.png"><meta name="twitter:card" content="summary_large_image"><script type="application/ld+json">${JSON.stringify(graph)}</script></head><body><header>The Emerson Agency LLC<button aria-controls="nav" aria-expanded="false">Menu</button><nav id="nav" aria-label="Main navigation"><a href="/founder">Founder</a></nav></header><a href="#main-content">Skip to main content</a><main id="main-content"><h1>Lyric Helena Emerson</h1><p>A founder biography connects the person behind an organization with its work. This initial HTML provides substantive information about professional scope, financial education, and careful next steps.</p><img src="/portrait.webp" alt="Lyric Helena Emerson"></main><footer>The Emerson Agency LLC. Founded by Lyric Helena Emerson | Columbia, South Carolina, USA</footer></body></html>`;

test('the complete manuscript and conference inventory retains source qualifications', () => {
  assert.deepEqual(validateScholarship(manuscripts, conferences), { manuscripts: 49, conferences: 10, statuses: { Delivered: 2, 'Accepted but not delivered': 1, 'Accepted forthcoming': 6, 'Acceptance reported in CV; date pending': 1 } });
});

test('scholarship verification rejects invented publication metadata and lost provenance', () => {
  for (const mutation of [work => { work.year = 2026; }, work => { work.doi = '10.9999/invented'; }, work => { work.status = 'Peer-reviewed journal article'; }, work => { work.verificationNote = ''; }, work => { work.abstract = ''; }, work => { work.sourceUrl = 'https://drive.google.com/file/d/private'; }]) {
    const changed = clone(manuscripts); mutation(changed[0]);
    assert.throws(() => validateScholarship(changed, conferences));
  }
  const duplicates = clone(manuscripts); duplicates[1] = duplicates[0];
  assert.throws(() => validateScholarship(duplicates, conferences), /Duplicate/);
});

test('accepted conferences cannot silently become delivered, or acquire an unsupported abstract', () => {
  const changedStatus = clone(conferences); changedStatus.find(event => event.id === 'reciprocity-regina-2026').status = 'Delivered';
  assert.throws(() => validateScholarship(manuscripts, changedStatus), /preserve verified/);
  const changedAbstract = clone(conferences); changedAbstract[0].abstract = 'A newly invented conference abstract.';
  assert.throws(() => validateScholarship(manuscripts, changedAbstract), /do not invent a conference abstract/);
  const leakedSource = clone(conferences); leakedSource[0].sources.push({ label: 'CV', url: 'https://drive.google.com/file/d/private' });
  assert.throws(() => validateScholarship(manuscripts, leakedSource), /private CV/);
});

test('semantic page checks accept useful server-rendered content and coherent identity', () => {
  const inspected = validateSiteDocument(fixture, context);
  assert.equal(inspected.title, 'Founder biography | The Emerson Agency LLC');
  assert.ok(inspected.ids.has('main-content'));
});

test('page checks reject JavaScript-only shells, duplicate landmarks, and hidden headings', () => {
  assert.throws(() => validateSiteDocument(fixture.replace(/<main[^]*?<\/main>/, '<main id="main-content"><div id="root"></div></main>'), context), /h1/);
  assert.throws(() => validateSiteDocument(fixture.replace('</main>', '<main>Duplicate landmark</main></main>'), context), /main landmark/);
  assert.throws(() => validateSiteDocument(fixture.replace('<h1>', '<h1 class="sr-only">'), context), /cannot be hidden/);
});

test('page checks reject wrong canonicals, missing mobile semantics, and placeholder/private links', () => {
  assert.throws(() => validateSiteDocument(fixture.replace('rel="canonical" href="https://emersonagency.netlify.app/founder"', 'rel="canonical" href="https://emersonagency.netlify.app/"'), context), /canonical/);
  assert.throws(() => validateSiteDocument(fixture.replace(' aria-expanded="false"', ''), context), /expanded state/);
  assert.throws(() => validateSiteDocument(fixture.replace('href="/founder"', 'href="#"'), context), /placeholder/);
  assert.throws(() => validateSiteDocument(fixture.replace('href="/founder"', 'href="https://drive.google.com/file/d/private"'), context), /private or local/);
});

test('each organization retains a separate structured identity', () => {
  const conflated = clone(graph); conflated['@graph'][1]['@id'] = 'https://theemerson.netlify.app/#organization';
  assert.throws(() => validateSiteDocument(fixture.replace(JSON.stringify(graph), JSON.stringify(conflated)), context), /conflate companies/);
});
test('reused ecosystem artwork cannot duplicate graph identities or replace the company logo', () => {
  const duplicate = clone(graph); duplicate['@graph'].push(duplicate['@graph'][1]);
  assert.throws(() => validateSiteDocument(fixture.replace(JSON.stringify(graph), JSON.stringify(duplicate)), context), /duplicate structured identity/);
  const wrongLogo = clone(graph); wrongLogo['@graph'][1].logo = { '@id': context.site.origin + '/media/#epdg-green-emblem' };
  assert.throws(() => validateSiteDocument(fixture.replace(JSON.stringify(graph), JSON.stringify(wrongLogo)), context), /logo must belong/);
});

test('canonical aliases redirect permanently while unknown routes retain HTTP 404 behavior', () => {
  const manifest = { routes: [{ path: '/' }, { path: '/privacy' }], aliases: { '/privacy-policy': '/privacy' } };
  assert.doesNotThrow(() => verifyRedirects('/privacy-policy /privacy 301\n/* /404.html 404\n', manifest));
  assert.throws(() => verifyRedirects('/privacy-policy /privacy 301\n/* /index.html 200\n', manifest), /404 fallback/);
  assert.throws(() => verifyRedirects('/privacy-policy /privacy 200\n/* /404.html 404\n', manifest), /canonical redirect/);
});
