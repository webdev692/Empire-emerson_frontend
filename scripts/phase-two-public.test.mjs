import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { leadershipProfiles } from '../shared/LeadershipData.ts';
import { approvedLeadership, leadershipPaths, validateLeadershipProfiles, verifyPreservedSources, validateRouteExpansion, validateImageMarkup, validateLeadershipDocument } from './verify-phase-two-public.mjs';
import { validatePhotographyAssignments, validateLeadershipPhotography, soloPortrait, jointPortrait } from './leadership-photography-checks.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const baseline = JSON.parse(readFileSync(resolve(root, 'docs/PUBLIC_WEBSITE_PHASE_TWO_BASELINE.json'), 'utf8'));
const clone = value => structuredClone(value);
const site = { origin: 'https://emersonagency.netlify.app' };
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
const monogram = person => `<div class="leadership-monogram" aria-hidden="true"><span>${person.initials}</span></div>`;

function documentFixture({ directory = false, person = leadershipProfiles[1] } = {}) {
  const people = directory ? leadershipProfiles : [person];
  const path = directory ? '/leadership' : `/leadership/${person.slug}`;
  const graph = people.map(profile => ({ '@type': 'Person', '@id': profile.personId, name: profile.name, jobTitle: profile.title, url: profile.canonicalUrl, affiliation: { '@id': site.origin + '/#organization' }, ...(profile.professionalLinks.length ? { sameAs: profile.professionalLinks.map(link => link.href) } : {}) }));
  if (directory) graph.push(
    { '@type': 'CollectionPage', '@id': site.origin + path + '#webpage', mainEntity: { '@id': site.origin + path + '#leadership' } },
    { '@type': 'ItemList', '@id': site.origin + path + '#leadership', numberOfItems: 5, itemListElement: people.map((profile, index) => ({ '@type': 'ListItem', position: index + 1, url: site.origin + '/leadership/' + profile.slug, item: { '@id': profile.personId } })) },
  );
  else graph.push({ '@type': 'ProfilePage', '@id': site.origin + path + '#webpage', url: site.origin + path, mainEntity: { '@id': person.personId } });
  const copy = directory ? `<h1>Meet our leadership.</h1>${people.map(profile => `<article>${monogram(profile)}<h2>${escape(profile.name)}</h2><p>${escape(profile.title)}</p><a href="/leadership/${profile.slug}">Explore ${escape(profile.name)}</a></article>`).join('')}` : `<h1>${escape(person.name)}</h1><p>${escape(person.title)}</p>${monogram(person)}<ul>${person.responsibilities.map(value => `<li>${escape(value)}</li>`).join('')}</ul><a href="/leadership">Meet the leadership team</a>`;
  return { html: `<html><head><script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })}</script></head><body><nav aria-label="Main navigation"><a href="/leadership">Leadership</a></nav><main><div class="wrapper"><div>${copy}</div></div></main></body></html>`, context: { entity: 'TEA', site, route: { path }, profiles: leadershipProfiles }, graph };
}

test('all five founder-approved company roles and responsibilities are complete', () => {
  assert.deepEqual(validateLeadershipProfiles(leadershipProfiles), { leaders: 5, professionalLinks: 2 });
  assert.equal(verifyPreservedSources(root, baseline), 6);
  assert.deepEqual(Object.values(baseline.sites).map(item => item.paths.length), [68, 36, 105]);
});

test('leadership approval checks reject substituted internship titles and missing responsibilities', () => {
  for (const mutate of [people => { people.pop(); }, people => { people[1].title = 'Team Phoenix Lead'; }, people => { people[2].responsibilities.pop(); }, people => { people[3].name = 'Kenny'; }]) {
    const changed = clone(leadershipProfiles); mutate(changed);
    assert.throws(() => validateLeadershipProfiles(changed));
  }
});

test('leadership records reject private fields, unsupplied links and invented achievements', () => {
  for (const mutate of [people => { people[1].private_notes = 'Internal HR record'; }, people => { people[2].professionalLinks = [{ label: 'GitHub', href: 'https://github.com/guessed-user' }]; }, people => { people[4].contribution.TEA += ' Closed 200 contracts worth $100000.'; }, people => { people[1].contribution.TEE += ' Graduated with an MBA.'; }, people => { people[3].summary.EPDG += ' Email private@example.com.'; }]) {
    const changed = clone(leadershipProfiles); mutate(changed);
    assert.throws(() => validateLeadershipProfiles(changed));
  }
});

test('a changed scholarly or legal source fails even when its record count stays the same', t => {
  const temporaryRoot = mkdtempSync(resolve(tmpdir(), 'emerson-phase-two-'));
  assert.ok(temporaryRoot.startsWith(resolve(tmpdir()) + sep));
  t.after(() => rmSync(temporaryRoot, { recursive: true, force: true }));
  mkdirSync(resolve(temporaryRoot, 'shared'));
  const source = '{"approved":"original wording"}\n';
  const fixture = { preservedSources: [{ path: 'shared/catalog.public.json', sha256: createHash('sha256').update(source).digest('hex') }] };
  writeFileSync(resolve(temporaryRoot, 'shared/catalog.public.json'), source.replaceAll('\n', '\r\n'));
  assert.equal(verifyPreservedSources(temporaryRoot, fixture), 1);
  writeFileSync(resolve(temporaryRoot, 'shared/catalog.public.json'), source.replace('original', 'invented'));
  assert.throws(() => verifyPreservedSources(temporaryRoot, fixture), /source changed/);
});

function routeFixture(entity = 'TEE') {
  const before = baseline.sites[entity];
  const routes = [...before.paths, ...leadershipPaths].map(path => ({ path }));
  const aliases = { ...before.aliases, ...Object.fromEntries(approvedLeadership.map(person => [`/leadership/${person.legacy}`, `/leadership/${person.slug}`])) };
  const redirects = Object.entries(aliases).filter(([from]) => !routes.some(route => route.path === from)).map(([from, to]) => `${from} ${to} 301`).join('\n') + '\n/* /404.html 404\n';
  return { before, manifest: { routes, aliases }, redirects };
}

test('route expansion retains 209 public pages and adds exactly 18 leadership pages with 51 aliases', () => {
  const counts = ['TEE', 'TEA', 'EPDG'].map(entity => { const fixture = routeFixture(entity); return validateRouteExpansion(fixture.manifest, fixture.before, fixture.redirects); });
  assert.deepEqual(counts.map(item => item.routes), [74, 42, 111]);
  assert.equal(counts.reduce((sum, item) => sum + item.retained, 0), 209);
  assert.equal(counts.reduce((sum, item) => sum + item.aliases, 0), 51);
});

test('route checks reject a lost manuscript, a shadowed directory and a broken historical profile URL', () => {
  const lost = routeFixture('EPDG'); lost.manifest.routes = lost.manifest.routes.filter(route => route.path !== '/research/emelws');
  assert.throws(() => validateRouteExpansion(lost.manifest, lost.before, lost.redirects), /baseline route/);
  const shadowed = routeFixture();
  assert.throws(() => validateRouteExpansion(shadowed.manifest, shadowed.before, '/leadership /founder 301\n' + shadowed.redirects), /hide a rendered/);
  const broken = routeFixture(); delete broken.manifest.aliases['/leadership/darin'];
  assert.throws(() => validateRouteExpansion(broken.manifest, broken.before, broken.redirects), /Old leadership identifier/);
});

test('rendered directory connects all five real profiles and uses decorative initials by default', () => {
  const fixture = documentFixture({ directory: true });
  assert.deepEqual(validateLeadershipDocument(fixture.html, fixture.context), { people: 5, portraits: 0, monograms: 5 });
  assert.throws(() => validateLeadershipDocument(fixture.html.replace('href="/leadership/todor-tomic"', 'href="/missing"'), fixture.context), /detail link/);
  assert.throws(() => validateLeadershipDocument(fixture.html.replace('aria-hidden="true"', 'aria-hidden="false"'), fixture.context), /decorative initials/);
});

test('individual structured profiles retain cross-company identity and their approved responsibilities', () => {
  for (const person of leadershipProfiles) {
    const fixture = documentFixture({ person });
    assert.deepEqual(validateLeadershipDocument(fixture.html, fixture.context), { people: 1, portraits: 0, monograms: 1 });
  }
  const fixture = documentFixture();
  const graph = clone(fixture.graph); graph.at(-1).mainEntity['@id'] = leadershipProfiles[0].personId;
  assert.throws(() => validateLeadershipDocument(fixture.html.replace(JSON.stringify(fixture.graph), JSON.stringify(graph)), fixture.context), /actual leader/);
  assert.throws(() => validateLeadershipDocument(fixture.html.replace('Strategic implementation', 'Generic tasks'), fixture.context), /missing approved responsibility/);
});

test('unapproved headshots and duplicated schema identities cannot pass with correct profile text', () => {
  const fixture = documentFixture();
  const photo = '<figure class="leadership-portrait"><img src="/fictional-staff.webp" alt="Darin Latrelle James" width="640" height="800"></figure>';
  assert.throws(() => validateLeadershipDocument(fixture.html.replace(monogram(leadershipProfiles[1]), photo), fixture.context), /explicitly approved/);
  const graph = [...fixture.graph, fixture.graph[0]];
  assert.throws(() => validateLeadershipDocument(fixture.html.replace(JSON.stringify(fixture.graph), JSON.stringify(graph)), fixture.context), /duplicate structured identity/);
  assert.throws(() => validateLeadershipDocument(fixture.html.replace('aria-label="Main navigation"', 'aria-label="Unrelated navigation"'), fixture.context), /discoverable/);
});

test('responsive image markup reserves layout space and excludes private Drive sources', () => {
  const image = '<img src="/media/research-640.webp" srcset="/media/research-640.webp 640w, /media/research-1280.webp 1280w" sizes="(max-width: 680px) 100vw, 50vw" alt="Books and research notes" width="1280" height="800" loading="lazy">';
  assert.equal(validateImageMarkup(image), 1);
  for (const changed of [image.replace('width="1280"', 'width="0"'), image.replace('height="800"', ''), image.replace(' sizes="(max-width: 680px) 100vw, 50vw"', ''), image.replace('src="/media/research-640.webp"', 'src="https://drive.google.com/file/d/private"'), image.replace('640w', '0w'), image.replace('loading="lazy"', 'loading="lazy" fetchpriority="high"')]) assert.throws(() => validateImageMarkup(changed));
});

test('photography approval requires the solo partner portrait and retains the joint asset without placement', () => {
  const media = JSON.parse(readFileSync(resolve(root, 'shared/public-media.json'), 'utf8'));
  assert.deepEqual(validatePhotographyAssignments(media), { activePortraits: 3, retainedPortraits: 1, assignments: 6 });
  for (const mutate of [
    data => { data.placements.find(item => item.subject === 'darin-latrelle-james').assetId = jointPortrait; },
    data => { data.assets = data.assets.filter(item => item.id !== jointPortrait); },
    data => { data.retainedAssets = []; },
    data => { data.placements.push({ entity: 'TEE', role: 'portrait', subject: 'todor-tomic', path: '/leadership/todor-tomic', assetId: soloPortrait }); },
    data => { data.placements = data.placements.filter(item => !(item.entity === 'TEA' && item.subject === 'darin-latrelle-james')); },
  ]) { const changed = clone(media); mutate(changed); assert.throws(() => validatePhotographyAssignments(changed)); }
});

test('rendered photography checks catch a substituted image and preserve staff initials', () => {
  const media = JSON.parse(readFileSync(resolve(root, 'shared/public-media.json'), 'utf8'));
  const solo = media.assets.find(item => item.id === soloPortrait);
  const joint = media.assets.find(item => item.id === jointPortrait);
  const context = { entity: 'TEE', path: '/leadership/darin-latrelle-james', media };
  const image = `<section class="modern-hero leadership-profile-hero"><picture><source srcset="${solo.files[0].src} 480w"><img src="${solo.files[0].src}" alt="${solo.alt}"></picture></section>`;
  validateLeadershipPhotography(image, context);
  assert.throws(() => validateLeadershipPhotography(image.replace(solo.files[0].src, joint.files[0].src), context), /Retained joint/);
  assert.throws(() => validateLeadershipPhotography(image.replace(solo.alt, 'Someone else'), context), /incorrectly identified/);
  assert.throws(() => validateLeadershipPhotography(image.replace(`srcset="${solo.files[0].src}`, 'srcset="/media/another-person.webp'), context), /Responsive source/);
  const staff = { ...context, path: '/leadership/shamrit-phagura' };
  const placeholder = `<section class="modern-hero leadership-profile-hero">${monogram(leadershipProfiles[2])}</section>`;
  validateLeadershipPhotography(placeholder, staff);
  assert.throws(() => validateLeadershipPhotography(placeholder.replace('</section>', `<img src="${solo.files[0].src}"></section>`), staff), /must not be published/);
});
