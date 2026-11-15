/** Phase-two acceptance checks: approved roles, preserved publications and rendered leadership. */
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { leadershipProfiles, leadershipDirectoryTagline, leadershipFounderNote } from '../shared/LeadershipData.ts';
import { attributes, visibleText, verifyRedirects } from './verify-modern-public.mjs';
import { assertPublicPrivacy } from './public-source-boundary.mjs';

const repository = fileURLToPath(new URL('..', import.meta.url));
const readJson = path => JSON.parse(readFileSync(path, 'utf8'));
const biographyApproval = readJson(resolve(repository, 'docs/LEADERSHIP_BIOGRAPHY_APPROVAL_2026-11-14.json'));
const copyHash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const typesInclude = (node, type) => node['@type'] === type || (Array.isArray(node['@type']) && node['@type'].includes(type));
const tags = (html, tag) => [...html.matchAll(new RegExp(`<${tag}\\b([^>]*)>`, 'gi'))].map(match => attributes(match[1]));
const elements = (html, tag) => [...html.matchAll(new RegExp(`<${tag}\\b([^>]*)>([\\s\\S]*?)<\\/${tag}>`, 'gi'))].map(match => ({ attributes: attributes(match[1]), html: match[2] }));
const sorted = values => [...values].sort();
const publicOrigin = 'https://theemerson.netlify.app';

// Independent acceptance data from the phase-two brief and latest founder-supplied biography update.
export const approvedLeadership = [
  { slug: 'lyric-helena-emerson', legacy: 'lyric', name: 'Lyric Helena Emerson', title: 'Founder & Chief Executive Officer', initials: 'LHE', responsibilities: ['Organizational strategy and executive leadership', 'Community-centered leadership and company direction', 'Independent scholarship and education', 'Program development', 'Public-facing partnerships and institutional communication'] },
  { slug: 'darin-latrelle-james', legacy: 'darin', name: 'Darin Latrelle James', title: 'Managing Partner', initials: 'DLJ', responsibilities: ['Coordination across the Emerson enterprise', 'Strategic implementation', 'Operational planning', 'Management support', 'Cross-functional organizational development', 'Supporting effective collaboration and follow-through'] },
  { slug: 'shamrit-phagura', legacy: 'shamrit', name: 'Shamrit Phagura', title: 'Computer Science Team Lead', initials: 'SP', responsibilities: ['Technical development coordination', 'Digital infrastructure', 'Computer science team leadership', 'Software implementation', 'Technical quality review', 'Coordinating approved development priorities', 'Supporting maintainable digital systems'] },
  { slug: 'godwin-iwatan-kehinde', legacy: 'kenny', name: 'Godwin-Iwatan Kehinde (Kenny)', title: 'Global Outreach, Human Resources & Operations Lead', initials: 'GK', responsibilities: ['Global outreach coordination', 'Human resources administration within authorized scope', 'Organizational operations', 'Program coordination', 'Administrative systems', 'International and institutional communications', 'Operational follow-through and reporting'] },
  { slug: 'todor-tomic', legacy: 'todor', name: 'Todor Tomic', title: 'Sales & Business Development Manager', initials: 'TT', responsibilities: ['Sales management', 'Ethical outreach', 'Business development coordination', 'Customer inquiry and follow-up processes', 'Sales workflow organization', 'Client communication', 'Needs discovery and responsible lead management'] },
];
const expectedPersonId = profile => profile.slug === 'lyric-helena-emerson' ? `${publicOrigin}/founder#lyric-helena-emerson` : `${publicOrigin}/leadership/${profile.slug}#person`;
const professionalLinks = ['https://philpeople.org/profiles/lyric-helena-emerson', 'https://orcid.org/0009-0001-5355-6489'];
export const leadershipPaths = ['/leadership', ...approvedLeadership.map(person => `/leadership/${person.slug}`)];

export function validateLeadershipProfiles(profiles) {
  assert.equal(profiles.length, 5, 'Exactly five approved leaders are required');
  assert.deepEqual(sorted(profiles.map(person => person.slug)), sorted(approvedLeadership.map(person => person.slug)), 'Approved leadership identities changed');
  const keys = ['slug', 'name', 'title', 'secondaryTitle', 'initials', 'department', 'canonicalUrl', 'personId', 'location', 'biography', 'closingStatement', 'summary', 'contribution', 'responsibilities', 'professionalLinks'];
  assert.equal(leadershipDirectoryTagline, biographyApproval.directoryTagline);
  assert.equal(leadershipFounderNote.paragraphs.length, biographyApproval.founderNote.paragraphs);
  assert.equal(copyHash(leadershipFounderNote), biographyApproval.founderNote.copySha256, 'Founder note differs from supplied copy');
  for (const expected of approvedLeadership) {
    const person = profiles.find(item => item.slug === expected.slug);
    const approvedCopy = biographyApproval.profiles.find(item => item.slug === expected.slug);
    assert.ok(Object.keys(person).every(key => keys.includes(key)), `${expected.slug}: unapproved/private profile field`);
    for (const field of ['name', 'title', 'initials']) assert.equal(person[field], expected[field], `${expected.slug}: approved ${field} changed`);
    assert.deepEqual(sorted(person.responsibilities), sorted(expected.responsibilities), `${expected.slug}: approved company responsibilities changed`);
    assert.equal(person.canonicalUrl, `${publicOrigin}/leadership/${person.slug}`, `${person.slug}: shared identity URL`);
    assert.equal(person.personId, expectedPersonId(person), `${person.slug}: stable cross-company Person ID`);
    assert.ok(person.department?.length > 3, `${person.slug}: department required`);
    for (const field of ['summary', 'contribution']) {
      assert.deepEqual(sorted(Object.keys(person[field])), ['EPDG', 'TEA', 'TEE'], `${person.slug}: all three company perspectives required`);
      for (const value of Object.values(person[field])) assert.ok(typeof value === 'string' && value.length > 70, `${person.slug}: useful company-specific ${field} required`);
    }
    assert.equal(new Set(Object.values(person.summary)).size, 3, `${person.slug}: company summaries must be distinct`);
    assert.deepEqual(sorted(person.professionalLinks.map(link => link.href)), person.slug === 'lyric-helena-emerson' ? sorted(professionalLinks) : [], `${person.slug}: unapproved professional link`);
    for (const link of person.professionalLinks) assert.ok(link.label?.trim(), `${person.slug}: professional link needs an accessible label`);
    assert.equal(person.location ?? null, approvedCopy.location, `${person.slug}: location differs from supplied copy`);
    assert.equal(person.secondaryTitle ?? null, approvedCopy.secondaryTitle, `${person.slug}: secondary title differs from supplied copy`);
    assert.equal(person.biography?.length, approvedCopy.paragraphs, `${person.slug}: approved biography paragraph missing`);
    assert.equal(copyHash({ biography: person.biography, closingStatement: person.closingStatement }), approvedCopy.copySha256, `${person.slug}: biography differs from supplied copy`);
    assertPublicPrivacy(person);
    const companyCopy = [...Object.values(person.summary), ...Object.values(person.contribution), ...person.responsibilities].join(' ');
    const copy = [companyCopy, ...person.biography, person.closingStatement, person.secondaryTitle, person.location].filter(Boolean).join(' ');
    assert.doesNotMatch(copy, /Team (?:Phoenix|Eclipse)|\bGIP (?:team|lead|manager)|\b(?:IRS.certified|licensed in all states)|\b(?:has|holds|granted) unrestricted (?:production|database|system)|\b\d[\d,]* (?:clients|contracts)|\$\s*\d/i, `${person.slug}: unsupported internship title, authority, credential or commercial outcome`);
    assert.doesNotMatch(copy, /[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}|\b\d{3}[-.]\d{2}[-.]\d{4}\b/i, `${person.slug}: private contact or identifier`);
    if (person.slug !== 'lyric-helena-emerson') assert.doesNotMatch(companyCopy, /\b(?:graduated|degree|university|certified|award-winning|PhD|MBA)\b/i, `${person.slug}: unapproved personal credential outside supplied biography`);
  }
  return { leaders: profiles.length, professionalLinks: 2 };
}

export function verifyPreservedSources(root, baseline) {
  for (const item of baseline.preservedSources) {
    assert.match(item.path, /^(?:shared|EPDG-Landing-Page)\/[\w./-]+$/);
    assert.ok(!item.path.split('/').includes('..'), 'Unsafe baseline source path');
    const bytes = readFileSync(resolve(root, item.path), 'utf8').replaceAll('\r\n', '\n');
    assert.equal(createHash('sha256').update(bytes).digest('hex'), item.sha256, `Phase-one scholarly/legal/catalog source changed: ${item.path}`);
  }
  return baseline.preservedSources.length;
}

export function validateRouteExpansion(manifest, baselineSite, redirects) {
  const paths = manifest.routes.map(route => route.path);
  assert.deepEqual(sorted(paths), sorted([...baselineSite.paths, ...leadershipPaths]), 'Retain every baseline route and add exactly the directory plus five profiles');
  const rules = verifyRedirects(redirects, manifest);
  assert.ok(!rules.some(([from]) => paths.includes(from)), 'A redirect must not hide a rendered public page');
  for (const [from, to] of Object.entries(baselineSite.aliases)) {
    if (from === '/leadership' || baselineSite.paths.includes(from)) continue;
    assert.equal(manifest.aliases[from], to, `Legacy alias changed: ${from}`);
  }
  for (const person of approvedLeadership) {
    const from = `/leadership/${person.legacy}`, to = `/leadership/${person.slug}`;
    assert.equal(manifest.aliases[from], to, `Old leadership identifier must redirect: ${from}`);
    assert.ok(rules.some(rule => rule[0] === from && rule[1] === to && rule[2] === '301'), `Old leadership redirect missing: ${from}`);
  }
  return { routes: paths.length, retained: baselineSite.paths.length, aliases: rules.filter(([from]) => from !== '/*').length };
}

/** Intrinsic dimensions and descriptive srcset candidates are needed at every viewport. */
export function validateImageMarkup(html, label = 'page') {
  const images = tags(html, 'img');
  for (const image of images) {
    assert.ok(Number(image.width) > 0 && Number(image.height) > 0, `${label}: image requires positive width and height`);
    assert.ok(Object.hasOwn(image, 'alt'), `${label}: image alternative text missing`);
    assert.ok(image.src && !/^(?:data:|blob:)|(?:drive|docs)\.google\.com/i.test(image.src), `${label}: use reviewed public assets, not private Drive or inline files`);
    if (image.srcset) {
      const candidates = image.srcset.split(',').map(value => value.trim());
      assert.ok(candidates.every(value => /^\S+\s+[1-9]\d*w$/.test(value)), `${label}: responsive source must use width descriptors`);
      assert.ok(image.sizes?.trim(), `${label}: responsive images require sizes`);
      assert.ok(!/(?:drive|docs)\.google\.com|(?:data|blob):/.test(image.srcset), `${label}: private responsive source`);
    }
    if (image.fetchpriority === 'high') assert.notEqual(image.loading, 'lazy', `${label}: priority image cannot be lazy`);
  }
  return images.length;
}

export function validateLeadershipDocument(html, { entity, site, route, profiles = leadershipProfiles, approvedPortraitSources = [] }) {
  const label = `${entity} ${route.path}`;
  const main = elements(html, 'main')[0]?.html;
  assert.ok(main, `${label}: rendered main content required`);
  const text = visibleText(main);
  const navigation = elements(html, 'nav').find(node => node.attributes['aria-label'] === 'Main navigation');
  assert.ok(navigation && tags(navigation.html, 'a').some(link => link.href === '/leadership'), `${label}: leadership must be discoverable in main navigation`);
  const scripts = elements(html, 'script').filter(node => node.attributes.type === 'application/ld+json');
  assert.equal(scripts.length, 1, `${label}: coherent structured graph required`);
  const graph = JSON.parse(scripts[0].html)['@graph'];
  assert.equal(new Set(graph.filter(node => node['@id']).map(node => node['@id'])).size, graph.filter(node => node['@id']).length, `${label}: duplicate structured identity`);
  const links = tags(main, 'a').map(link => link.href);
  const people = route.path === '/leadership' ? profiles : profiles.filter(person => route.path === `/leadership/${person.slug}`);
  assert.ok(people.length, `${label}: unknown leadership page`);
  for (const person of people) {
    assert.ok(text.includes(person.name) && text.includes(person.title), `${label}: complete approved public name and company title required`);
    if (person.secondaryTitle) assert.ok(text.includes(person.secondaryTitle), `${label}: secondary company title missing`);
    const node = graph.find(item => item['@id'] === person.personId);
    assert.ok(node && typesInclude(node, 'Person'), `${label}: leader Person node missing`);
    for (const [field, expected] of [['name', person.name], ['jobTitle', person.title], ['url', person.canonicalUrl]]) assert.equal(node[field], expected, `${label}: Person ${field} differs from approved identity`);
    if (person.secondaryTitle) assert.ok(node.description?.includes(person.secondaryTitle), `${label}: structured secondary company title missing`);
    assert.equal(node.affiliation?.['@id'], `${site.origin}/#organization`, `${label}: affiliation must identify this company`);
    assert.deepEqual(sorted(node.sameAs || []), sorted(person.professionalLinks.map(link => link.href)), `${label}: unapproved structured professional profile`);
  }
  const portraits = elements(main, 'figure').filter(node => (node.attributes.class || '').split(/\s+/).includes('leadership-portrait'));
  for (const portrait of portraits) {
    for (const image of tags(portrait.html, 'img')) assert.ok(approvedPortraitSources.includes(image.src), `${label}: portrait requires an explicitly approved public asset`);
  }
  const monograms = tags(main, 'div').filter(node => (node.class || '').split(/\s+/).includes('leadership-monogram'));
  const visualCount = route.path === '/leadership' ? 5 : 1;
  assert.equal(monograms.length + portraits.length, visualCount, `${label}: each leader needs one initials fallback or approved portrait`);
  for (const monogram of monograms) assert.equal(monogram['aria-hidden'], 'true', `${label}: decorative initials should not duplicate accessible names`);
  if (route.path === '/leadership') {
    assert.ok(text.includes(leadershipDirectoryTagline), `${label}: supplied directory tagline missing`);
    for (const paragraph of [...leadershipFounderNote.paragraphs, leadershipFounderNote.closingStatement]) assert.ok(text.includes(paragraph), `${label}: approved founder note missing`);
    for (const person of profiles) assert.ok(links.includes(`/leadership/${person.slug}`), `${label}: leader detail link missing`);
    const list = graph.find(node => typesInclude(node, 'ItemList'));
    assert.equal(list?.numberOfItems, 5, `${label}: directory structured count`);
    assert.equal(list.itemListElement.length, 5, `${label}: directory structured entries`);
    assert.deepEqual(sorted(list.itemListElement.map(item => item.item?.['@id'])), sorted(profiles.map(person => person.personId)), `${label}: directory structured identities`);
    assert.deepEqual(sorted(list.itemListElement.map(item => item.url)), sorted(profiles.map(person => site.origin + `/leadership/${person.slug}`)), `${label}: directory links must resolve on this company`);
    assert.deepEqual(sorted(list.itemListElement.map(item => item.position)), [1, 2, 3, 4, 5], `${label}: unique list positions`);
    const collection = graph.find(node => typesInclude(node, 'CollectionPage'));
    assert.equal(collection?.mainEntity?.['@id'], list['@id'], `${label}: collection must reference the directory`);
  } else {
    const person = people[0];
    assert.equal(visibleText(elements(main, 'h1')[0]?.html || ''), person.name, `${label}: individual profile heading`);
    for (const paragraph of [...person.biography, person.closingStatement]) assert.ok(text.includes(paragraph), `${label}: approved biography text missing`);
    if (person.location) assert.ok(text.includes(person.location), `${label}: supplied location missing`);
    for (const responsibility of person.responsibilities) assert.ok(text.includes(responsibility), `${label}: missing approved responsibility ${responsibility}`);
    const profilePage = graph.find(node => typesInclude(node, 'ProfilePage'));
    assert.equal(profilePage?.mainEntity?.['@id'], person.personId, `${label}: ProfilePage must identify the actual leader`);
    assert.equal(profilePage.url, site.origin + route.path, `${label}: ProfilePage URL must be local canonical`);
    assert.ok(links.includes('/leadership'), `${label}: directory return link missing`);
    if (!portraits.length) assert.ok(text.includes(person.initials), `${label}: wrong fallback initials`);
  }
  validateImageMarkup(main, label);
  return { people: people.length, portraits: portraits.length, monograms: monograms.length };
}

export function verifyPhaseTwoPublic(root = repository, { profiles = leadershipProfiles, approvedPortraitSources = readJson(resolve(root, 'shared/public-media.json')).assets.filter(asset => asset.kind === 'portrait').flatMap(asset => asset.files.map(file => file.src)) } = {}) {
  const baseline = readJson(resolve(root, 'docs/PUBLIC_WEBSITE_PHASE_TWO_BASELINE.json'));
  const sites = readJson(resolve(root, 'shared/public-sites.json'));
  const result = { passed: false, sites: {}, routes: 0, retainedRoutes: 0, aliases: 0, images: 0, errors: [] };
  const check = (label, action) => { try { return action(); } catch (error) { result.errors.push(`${label}: ${error.message}`); return null; } };
  check('Approved leadership', () => validateLeadershipProfiles(profiles));
  result.preservedSources = check('Preserved phase-one sources', () => verifyPreservedSources(root, baseline));
  for (const [entity, site] of Object.entries(sites)) {
    const out = resolve(root, site.app, 'dist');
    const manifest = check(entity, () => readJson(resolve(out, 'public-routes.json')));
    if (!manifest) continue;
    const counts = check(entity, () => validateRouteExpansion(manifest, baseline.sites[entity], readFileSync(resolve(out, '_redirects'), 'utf8')));
    if (counts) { result.sites[entity] = counts; result.routes += counts.routes; result.retainedRoutes += counts.retained; result.aliases += counts.aliases; }
    for (const route of manifest.routes) check(`${entity} ${route.path}`, () => {
      const html = readFileSync(resolve(out, route.path.slice(1), 'index.html'), 'utf8');
      result.images += validateImageMarkup(html, `${entity} ${route.path}`);
      const navigation = elements(html, 'nav').find(node => node.attributes['aria-label'] === 'Main navigation');
      assert.ok(navigation && tags(navigation.html, 'a').some(link => link.href === '/leadership'), 'Leadership missing from main navigation');
      if (leadershipPaths.includes(route.path)) validateLeadershipDocument(html, { entity, site, route, profiles, approvedPortraitSources });
      if (['/about', '/founder'].includes(route.path)) assert.ok(tags(elements(html, 'main')[0]?.html || '', 'a').some(link => link.href === '/leadership'), 'About/founder must link to the leadership directory');
    });
  }
  check('Full public inventory', () => { assert.equal(result.routes, 227); assert.equal(result.retainedRoutes, 209); assert.equal(result.aliases, 51); });
  result.passed = result.errors.length === 0;
  return result;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const result = verifyPhaseTwoPublic();
  console.log(JSON.stringify(result, null, 2));
  process.exitCode = result.passed ? 0 : 1;
}
