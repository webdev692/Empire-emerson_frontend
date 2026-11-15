/** Semantic release checks for the statically rendered public websites. */
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repository = fileURLToPath(new URL('..', import.meta.url));
const founderName = 'Lyric Helena Emerson';
const expectedFounderId = 'https://theemerson.netlify.app/founder#lyric-helena-emerson';
const companyNames = { TEE: 'The Emerson Empire', TEA: 'The Emerson Agency LLC', EPDG: 'Emerson Professional Development Group' };
const readJson = path => JSON.parse(readFileSync(path, 'utf8'));
export const decodeHtml = value => String(value).replace(/&#(x[\da-f]+|\d+);/gi, (_, code) => String.fromCodePoint(code[0].toLowerCase() === 'x' ? parseInt(code.slice(1), 16) : Number(code))).replace(/&(amp|quot|apos|lt|gt|nbsp);/g, (_, name) => ({ amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ' })[name]);
export const visibleText = value => decodeHtml(String(value).replace(/<!--[^]*?-->/g, '').replace(/<(script|style)\b[^>]*>[^]*?<\/\1>/gi, '').replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
const elements = (html, tag) => [...html.matchAll(new RegExp(`<${tag}\\b([^>]*)>([\\s\\S]*?)<\\/${tag}>`, 'gi'))].map(match => ({ attributes: attributes(match[1]), content: match[2] }));
export function attributes(source) {
  return Object.fromEntries([...source.matchAll(/([^\s=<>/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)].map(match => [match[1].toLowerCase(), decodeHtml(match[2] ?? match[3] ?? match[4] ?? '')]));
}
const openingTags = (html, tag) => [...html.matchAll(new RegExp(`<${tag}\\b([^>]*)>`, 'gi'))].map(match => attributes(match[1]));
const tagProperty = (html, tag, key, value) => openingTags(html, tag).filter(item => item[key] === value);
const normalizePath = path => path === '/' ? '/' : path.replace(/\/$/, '');
const typesInclude = (entry, type) => entry['@type'] === type || (Array.isArray(entry['@type']) && entry['@type'].includes(type));

function publicUrl(value, hosts, label) {
  const url = new URL(value);
  assert.equal(url.protocol, 'https:', `${label}: HTTPS required`);
  assert.ok(!url.username && !url.password, `${label}: URL credentials are prohibited`);
  if (hosts) assert.ok(hosts.includes(url.hostname), `${label}: unapproved source host`);
  assert.ok(![...url.searchParams.keys()].some(key => /^(token|password|api_key|secret|access_token)$/i.test(key)), `${label}: private query parameter`);
  return url;
}

export function validateScholarship(manuscripts, conferences) {
  assert.equal(manuscripts.length, 49, 'The reconciled November 14 inventory contains 49 distinct manuscripts');
  for (const field of ['id', 'slug', 'title', 'canonicalUrl']) assert.equal(new Set(manuscripts.map(work => work[field])).size, manuscripts.length, `Duplicate manuscript ${field}`);
  const canonicalRecords = new Set(manuscripts.map(work => work.canonicalUrl));
  for (const work of manuscripts) {
    assert.equal(work.author, founderName, `${work.id}: unexpected author`);
    assert.match(work.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `${work.id}: unsafe route slug`);
    assert.ok(work.title.length > 10 && work.abstract?.length > 80, `${work.id}: title and sourced abstract required`);
    assert.equal(work.status, 'Public manuscript', `${work.id}: indexing alone must not assert publication or peer review`);
    assert.ok(work.categories.length > 0 && Array.isArray(work.sourceCategories), `${work.id}: retain editorial research subjects and source subjects, including an empty source list when none was published`);
    assert.ok(work.categoryNote?.includes('abstract'), `${work.id}: explain the basis for editorial categories`);
    assert.equal(new Set(work.categories).size, work.categories.length, `${work.id}: duplicate category`);
    publicUrl(work.canonicalUrl, ['philpapers.org', 'philarchive.org'], work.id);
    publicUrl(work.sourceUrl, ['philpeople.org', 'philpapers.org', 'philarchive.org'], work.id);
    assert.ok(work.verificationNote?.length > 40, `${work.id}: record verification provenance`);
    assert.ok(Array.isArray(work.alternateRecords), `${work.id}: preserve alternate-record information`);
    for (const alternate of work.alternateRecords) {
      publicUrl(alternate, ['philpapers.org', 'philarchive.org'], work.id);
      assert.ok(!canonicalRecords.has(alternate), `${work.id}: alternate duplicates a distinct canonical work`);
    }
    if (work.year !== null) {
      assert.ok(Number.isInteger(work.year) && work.year > 1900, `${work.id}: invalid publication year`);
      assert.ok(work.publicationYearSource, `${work.id}: publication year requires its own verified source, not an archive upload date`);
      publicUrl(work.publicationYearSource, null, work.id);
    }
    if (work.doi !== null) {
      assert.match(work.doi, /^(?:https:\/\/doi\.org\/)?10\.\d{4,9}\//, `${work.id}: invalid DOI`);
      assert.ok(work.doiSource, `${work.id}: DOI requires verified source evidence`);
      publicUrl(work.doiSource, null, work.id);
    }
    if (work.pdfUrl !== null) {
      publicUrl(work.pdfUrl, ['philarchive.org', 'philpapers.org'], work.id);
      assert.ok(work.archiveUrl && work.pdfLinkVerification, `${work.id}: public PDF requires observed source and verification limits`);
    }
    if (work.version) {
      assert.ok(work.archiveUrl && work.archivedAt, `${work.id}: version requires archival history evidence`);
      publicUrl(work.archiveUrl, ['philarchive.org'], work.id);
    }
    assert.ok(!Object.keys(work).some(key => /password|privateKey|licenseNumber|homeAddress|ssn|taxId/i.test(key)), `${work.id}: private field`);
  }
  assert.equal(conferences.length, 10, 'The verified November 2026 conference inventory contains ten entries');
  for (const field of ['id', 'slug', 'title']) assert.equal(new Set(conferences.map(event => event[field])).size, conferences.length, `Duplicate conference ${field}`);
  const expected = {
    'evidence-policymaking-2026': ['Delivered', '2026-09-25', 'Presenter'],
    'ordered-liberty-2026': ['Delivered', '2026-10-17', 'Invited keynote response'],
    'reciprocity-regina-2026': ['Accepted but not delivered', '2026-10-02', 'Accepted paper'],
    'deprived-health-2026': ['Accepted forthcoming', '2026-11-20', 'Accepted presenter'],
    'de-la-salle-2026': ['Accepted forthcoming', '2026-11-21', 'Accepted presenter'],
    'usable-mobility-2026': ['Accepted forthcoming', '2026-11-24', 'Accepted presenter'],
    'popmec-2026': ['Accepted forthcoming', '2026-11-27', 'Accepted presenter'],
    'memory-nostalgia-2026': ['Accepted forthcoming', '2026-12-02', 'Accepted presenter'],
    'bcps-2027': ['Accepted forthcoming', '2027-03-05', 'Accepted presenter'],
    'collective-discussions-2027': ['Acceptance reported in CV; date pending', null, 'Presenter listed in academic CV'],
  };
  for (const event of conferences) {
    assert.deepEqual([event.status, event.dateStart, event.role], expected[event.id], `${event.id}: preserve verified delivery/acceptance, date, and role`);
    assert.equal(event.author, founderName);
    assert.ok(event.title.length > 20 && event.event && event.organizer && event.dateLabel && event.format && event.location, `${event.id}: incomplete public conference record`);
    assert.ok(event.sources.length && event.verificationNote.length > 40, `${event.id}: missing provenance`);
    if (event.eventUrl) publicUrl(event.eventUrl, null, event.id);
    for (const source of event.sources) if (source.url) {
      const url = publicUrl(source.url, null, event.id);
      assert.notEqual(url.hostname, 'drive.google.com', `${event.id}: private CV must not be linked`);
    }
    if (event.abstract !== null) assert.ok(event.abstractSource, `${event.id}: do not invent a conference abstract or substitute a manuscript abstract without evidence`);
    if (event.dateStart && event.dateEnd) assert.ok(event.dateEnd >= event.dateStart, `${event.id}: invalid date range`);
  }
  return { manuscripts: manuscripts.length, conferences: conferences.length, statuses: conferences.reduce((counts, event) => ({ ...counts, [event.status]: (counts[event.status] || 0) + 1 }), {}) };
}

export function validateSiteDocument(html, { entity, site, route, notFound = false }) {
  const page = `${entity} ${route.path}`;
  assert.match(html, /<!doctype html>/i, `${page}: missing HTML doctype`);
  assert.equal(openingTags(html, 'main').length, 1, `${page}: exactly one main landmark required`);
  const heading = elements(html, 'h1');
  assert.equal(heading.length, 1, `${page}: exactly one visible h1 required`);
  assert.ok(visibleText(heading[0].content).length > 4, `${page}: meaningful h1 required`);
  assert.ok(!/sr-only|visually-hidden|hidden/.test(heading[0].attributes.class || ''), `${page}: h1 cannot be hidden`);
  assert.ok(visibleText(elements(html, 'main')[0].content).length > 100, `${page}: initial HTML must contain useful content`);
  if (!notFound) assert.doesNotMatch(visibleText(heading[0].content), /page not found|loading|unavailable/i, `${page}: an indexed route cannot be an empty fallback`);
  const header = elements(html, 'header')[0];
  const footer = elements(html, 'footer')[0];
  assert.ok(header && visibleText(header.content).includes(companyNames[entity]), `${page}: full company identity in header`);
  assert.ok(footer && visibleText(footer.content).includes(companyNames[entity]) && visibleText(footer.content).includes(founderName), `${page}: company and founder in footer`);
  assert.ok(visibleText(footer.content).includes('Columbia, South Carolina, USA'), `${page}: public founder location`);
  const title = elements(html, 'title');
  assert.equal(title.length, 1, `${page}: unique title element`);
  assert.ok(visibleText(title[0].content).includes(companyNames[entity]), `${page}: title identifies company`);
  const description = tagProperty(html, 'meta', 'name', 'description');
  assert.equal(description.length, 1, `${page}: unique description element`);
  assert.equal(description[0].content, route.description, `${page}: route-specific description`);
  assert.ok(description[0].content.length > 35, `${page}: substantive page description`);
  const canonical = tagProperty(html, 'link', 'rel', 'canonical');
  assert.equal(canonical.length, 1, `${page}: unique canonical element`);
  assert.equal(canonical[0].href, site.origin + route.path, `${page}: canonical must match this public route`);
  const robots = tagProperty(html, 'meta', 'name', 'robots');
  assert.equal(robots.length, 1, `${page}: explicit indexing policy`);
  assert.equal(/\bnoindex\b/i.test(robots[0].content), notFound, `${page}: incorrect indexing policy`);
  assert.equal(tagProperty(html, 'meta', 'property', 'og:url')[0]?.content, canonical[0].href, `${page}: Open Graph canonical mismatch`);
  assert.ok(tagProperty(html, 'meta', 'property', 'og:image')[0]?.content.startsWith(site.origin + '/'), `${page}: same-site social preview`);
  assert.equal(tagProperty(html, 'meta', 'name', 'twitter:card')[0]?.content, 'summary_large_image', `${page}: social preview card`);
  const mainNavigation = openingTags(html, 'nav').find(nav => nav['aria-label'] === 'Main navigation');
  assert.ok(mainNavigation?.id, `${page}: named navigation with stable ID`);
  const toggle = elements(html, 'button').find(button => button.attributes['aria-controls'] === mainNavigation.id);
  assert.ok(toggle && ['true', 'false'].includes(toggle.attributes['aria-expanded']), `${page}: mobile control exposes expanded state and navigation relationship`);
  assert.ok(toggle.attributes['aria-label'] || visibleText(toggle.content), `${page}: mobile control needs an accessible name`);
  assert.ok(openingTags(html, 'a').some(anchor => anchor.href === '#main-content'), `${page}: skip link missing`);
  assert.ok(openingTags(html, 'main')[0].id === 'main-content', `${page}: skip-link target missing`);
  for (const image of openingTags(html, 'img')) assert.ok(Object.hasOwn(image, 'alt'), `${page}: image is missing alternative text`);
  const ld = elements(html, 'script').filter(script => script.attributes.type === 'application/ld+json');
  assert.equal(ld.length, 1, `${page}: one coherent structured-data graph`);
  const structured = JSON.parse(ld[0].content);
  assert.equal(structured['@context'], 'https://schema.org');
  const graph = structured['@graph'];
  assert.ok(Array.isArray(graph), `${page}: structured graph required`);
  const person = graph.find(item => typesInclude(item, 'Person'));
  const organization = graph.find(item => typesInclude(item, 'Organization'));
  assert.equal(person?.name, founderName, `${page}: structured founder identity`);
  assert.equal(person?.['@id'], expectedFounderId, `${page}: shared founder identity`);
  assert.ok(person.sameAs?.includes('https://philpeople.org/profiles/lyric-helena-emerson') && person.sameAs?.includes('https://orcid.org/0009-0001-5355-6489'), `${page}: scholarly profile links`);
  assert.equal(organization?.name, companyNames[entity], `${page}: distinct organization identity`);
  assert.equal(organization?.['@id'], `${site.origin}/#organization`, `${page}: organization ID must not conflate companies`);
  assert.equal(organization?.founder?.['@id'], person['@id'], `${page}: organization-founder relationship`);
  if (route.path !== '/') {
    const breadcrumb = graph.find(item => typesInclude(item, 'BreadcrumbList'));
    assert.ok(breadcrumb?.itemListElement?.length >= 2, `${page}: meaningful breadcrumb graph`);
    assert.equal(breadcrumb.itemListElement.at(-1).item, canonical[0].href, `${page}: breadcrumb ends at canonical route`);
  }
  const links = openingTags(html, 'a').map(anchor => anchor.href).filter(Boolean);
  for (const href of links) {
    assert.notEqual(href, '#', `${page}: placeholder link`);
    assert.doesNotMatch(href, /(?:drive\.google\.com\/file|docs\.google\.com\/(?:document|spreadsheets)|wa\.me\/|localhost|127\.0\.0\.1)/i, `${page}: private or local destination`);
    assert.doesNotMatch(href, /(?:\?|&)(?:password|token|access_token|api_key)=/i, `${page}: sensitive URL parameter`);
  }
  return { title: visibleText(title[0].content), description: description[0].content, links, graph, ids: new Set([...html.matchAll(/\bid=["']([^"']+)["']/g)].map(match => decodeHtml(match[1]))) };
}

export function verifyRedirects(text, manifest) {
  const rules = text.split(/\r?\n/).map(line => line.trim()).filter(line => line && !line.startsWith('#')).map(line => line.split(/\s+/));
  assert.ok(rules.some(([from, to, code]) => from === '/*' && to === '/404.html' && code === '404'), 'Unknown routes must have an actual 404 fallback');
  assert.ok(!rules.some(([from, , code]) => from === '/*' && /^200/.test(code || '')), 'An SPA 200 fallback produces soft 404s');
  assert.deepEqual(rules.filter(([from]) => from === '/*'), [['/*', '/404.html', '404']], 'A competing wildcard must not mask the 404 fallback');
  const paths = new Set(manifest.routes.map(route => route.path));
  for (const [from, to] of Object.entries(manifest.aliases)) if (!paths.has(from)) assert.ok(rules.some(([ruleFrom, ruleTo, code]) => ruleFrom === from && ruleTo === to && code === '301'), `Missing canonical redirect for ${from}`);
  return rules;
}

function staticFile(out, pathname) {
  const candidate = resolve(out, decodeURIComponent(pathname).replace(/^\/+/, ''));
  assert.ok(candidate === out || candidate.startsWith(out + sep), 'URL escaped public output');
  return candidate;
}

export function verifyBuiltSites(root = repository) {
  const sites = readJson(resolve(root, 'shared/public-sites.json'));
  const manuscripts = readJson(resolve(root, 'EPDG-Landing-Page/src/scholarship/manuscripts.json'));
  const conferences = readJson(resolve(root, 'EPDG-Landing-Page/src/scholarship/conferences.json'));
  const result = { passed: false, scholarship: validateScholarship(manuscripts, conferences), sites: {}, errors: [], fragmentWarnings: [] };
  const built = new Map();
  const check = (label, action) => { try { return action(); } catch (error) { result.errors.push(`${label}: ${error.message}`); return null; } };
  for (const [entity, site] of Object.entries(sites)) {
    const out = resolve(root, site.app, 'dist');
    const manifest = check(entity, () => readJson(resolve(out, 'public-routes.json')));
    if (!manifest) continue;
    check(entity, () => {
      assert.equal(manifest.revision, '2026-11-14', 'Expected modernization revision');
      assert.ok(Array.isArray(manifest.routes) && manifest.routes.length >= 15, 'Substantive public page collection required');
      assert.equal(new Set(manifest.routes.map(route => route.path)).size, manifest.routes.length, 'Duplicate public paths');
      assert.ok(manifest.routes.some(route => route.path === '/') && manifest.routes.some(route => route.path === '/founder'), 'Home and founder routes required');
      verifyRedirects(readFileSync(resolve(out, '_redirects'), 'utf8'), manifest);
      const sitemap = [...readFileSync(resolve(out, 'sitemap.xml'), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => decodeHtml(match[1]));
      assert.deepEqual([...sitemap].sort(), manifest.routes.map(route => site.origin + route.path).sort(), 'Sitemap must exactly match rendered public routes');
      assert.equal(new Set(sitemap).size, sitemap.length, 'Duplicate sitemap URL');
      assert.ok(sitemap.every(url => !/(?:\/assignments\/|\/admin(?:\/|$)|\/login(?:\/|$)|\/404$)/.test(url)), 'Private or unavailable paths in sitemap');
      const robots = readFileSync(resolve(out, 'robots.txt'), 'utf8');
      assert.ok(robots.includes(`Sitemap: ${site.origin}/sitemap.xml`), 'Correct public sitemap in robots');
      assert.doesNotMatch(robots, /^Disallow:\s*\/$/m, 'Production robots must permit public crawling');
      assert.ok(statSync(resolve(out, 'social-preview.png')).size > 1000, 'Usable local social preview required');
    });
    const documents = new Map();
    const titles = new Set(), descriptions = new Set();
    for (const route of manifest.routes) check(`${entity} ${route.path}`, () => {
      assert.match(route.path, /^\/(?:[a-zA-Z0-9_-]+\/?)*$/, 'Unsafe or query-dependent canonical route');
      const html = readFileSync(resolve(staticFile(out, route.path), 'index.html'), 'utf8');
      const inspected = validateSiteDocument(html, { entity, site, route });
      assert.ok(!titles.has(inspected.title), 'Duplicate title on distinct canonical pages');
      assert.ok(!descriptions.has(inspected.description), 'Duplicate description on distinct canonical pages');
      titles.add(inspected.title); descriptions.add(inspected.description);
      if (entity === 'EPDG') {
        const manuscript = manuscripts.find(work => route.path === `/research/${work.slug}`);
        if (manuscript) {
          const article = inspected.graph.find(item => typesInclude(item, 'ScholarlyArticle'));
          assert.equal(article?.name, manuscript.title, 'Scholarly structured title must match source');
          assert.equal(article?.abstract, manuscript.abstract, 'Scholarly abstract must match source');
          assert.equal(article?.creativeWorkStatus, manuscript.status, 'Do not upgrade manuscript publication status');
          assert.equal(article?.author?.['@id'], expectedFounderId, 'Scholarly author identity');
          assert.ok(!article.datePublished || manuscript.year, 'Archive upload date cannot become publication date');
          assert.ok(!article.identifier || manuscript.doi, 'Unverified DOI in structured data');
          assert.ok(visibleText(html).includes(manuscript.title) && visibleText(html).includes(manuscript.abstract), 'Full manuscript detail must be delivered as HTML');
        }
      }
      documents.set(route.path, inspected);
    });
    check(`${entity} 404`, () => validateSiteDocument(readFileSync(resolve(out, '404.html'), 'utf8'), { entity, site, route: { path: '/404', title: 'Page not found', description: 'The requested page is unavailable. Return to the company home or explore the resource library.' }, notFound: true }));
    if (entity === 'EPDG') check('EPDG scholarship routes', () => {
      for (const work of manuscripts) assert.ok(documents.has(`/research/${work.slug}`), `Missing manuscript page ${work.slug}`);
      for (const event of conferences) assert.ok(documents.has(`/conferences/${event.slug}`), `Missing conference page ${event.slug}`);
    });
    built.set(site.origin, { entity, site, out, manifest, documents });
    result.sites[entity] = { origin: site.origin, indexedRoutes: manifest.routes.length, verifiedDocuments: documents.size };
  }
  for (const entry of built.values()) for (const [path, document] of entry.documents) for (const href of document.links) check(`${entry.entity} ${path} → ${href}`, () => {
    if (/^(mailto:|tel:)/i.test(href)) return;
    const url = new URL(href, entry.site.origin + path);
    const target = built.get(url.origin);
    if (!target) return;
    let targetPath = normalizePath(url.pathname);
    const visited = new Set();
    while (!target.documents.has(targetPath) && target.manifest.aliases[targetPath]) {
      assert.ok(!visited.has(targetPath), 'Alias cycle'); visited.add(targetPath);
      const alias = new URL(target.manifest.aliases[targetPath], target.site.origin);
      if (alias.origin !== target.site.origin) {
        const remote = built.get(alias.origin);
        if (remote) assert.ok(remote.documents.has(normalizePath(alias.pathname)), 'Cross-company alias has no target');
        return;
      }
      targetPath = normalizePath(alias.pathname);
    }
    const destination = target.documents.get(targetPath);
    if (!destination) {
      const file = staticFile(target.out, url.pathname);
      assert.ok(existsSync(file) && statSync(file).isFile(), 'Broken public link: no rendered route, alias, or static file');
      return;
    }
    if (url.hash && !destination.ids.has(decodeURIComponent(url.hash.slice(1)))) result.fragmentWarnings.push(`${entry.entity} ${path} → ${href}: fragment is not present in initial HTML; check dynamic content`);
  });
  result.errors = [...new Set(result.errors)];
  result.fragmentWarnings = [...new Set(result.fragmentWarnings)];
  result.passed = result.errors.length === 0;
  return result;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const result = verifyBuiltSites();
  console.log(JSON.stringify(result, null, 2));
  process.exitCode = result.passed ? 0 : 1;
}
