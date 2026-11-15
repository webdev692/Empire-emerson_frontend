import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
const repository = fileURLToPath(new URL('..', import.meta.url));
const appRoot = resolve(process.argv[2]);
const sites = JSON.parse(readFileSync(resolve(repository, 'shared/public-sites.json'), 'utf8'));
const publicMedia = JSON.parse(readFileSync(resolve(repository, 'shared/public-media.json'), 'utf8'));
const entry = Object.entries(sites).find(([, site]) => resolve(repository, site.app) === appRoot);
assert.ok(entry, 'Only the three public company apps may be rendered');
const [entity, site] = entry;
const { build } = await import(pathToFileURL(resolve(appRoot, 'node_modules/vite/dist/node/index.js')));
const { default: react } = await import(pathToFileURL(resolve(appRoot, 'node_modules/@vitejs/plugin-react/dist/index.js')));
await build({ configFile: false, root: appRoot, mode: 'public-release', plugins: [react()], resolve: { dedupe: ['react', 'react-dom'] }, ssr: { noExternal: true }, build: { ssr: resolve(appRoot, 'src/entry-server.tsx'), outDir: 'dist-ssr', target: 'node22', minify: false, emptyOutDir: true } });
const { routes, render, scholarlyData, leadershipData } = await import(pathToFileURL(resolve(appRoot, 'dist-ssr/entry-server.js')));
assert.equal(new Set(routes.map(route => route.path)).size, routes.length, 'Duplicate public routes');
const out = resolve(appRoot, 'dist');
const template = readFileSync(resolve(out, 'index.html'), 'utf8');
const names = { TEE: 'The Emerson Empire', TEA: 'The Emerson Agency LLC', EPDG: 'Emerson Professional Development Group' };
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const personId = 'https://theemerson.netlify.app/founder#lyric-helena-emerson';
function structured(route) {
  const url = site.origin + route.path;
  const graph = [
    { '@type': 'Organization', '@id': `${site.origin}/#organization`, name: names[entity], url: site.origin + '/', founder: { '@id': personId } },
    { '@type': 'Person', '@id': personId, name: 'Lyric Helena Emerson', url: 'https://theemerson.netlify.app/founder', jobTitle: 'Founder and CEO', homeLocation: { '@type': 'Place', name: 'Columbia, South Carolina, USA' }, sameAs: ['https://philpeople.org/profiles/lyric-helena-emerson', 'https://orcid.org/0009-0001-5355-6489'] },
    { '@type': 'WebPage', '@id': url + '#webpage', url, name: route.title, description: route.description, isPartOf: { '@id': `${site.origin}/#website` } },
    { '@type': 'WebSite', '@id': `${site.origin}/#website`, url: site.origin + '/', name: names[entity], publisher: { '@id': `${site.origin}/#organization` } },
  ];
  const mediaPlacements = publicMedia.placements.filter(item => item.entity === entity && (item.role === 'brand' || item.path === route.path));
  for (const placement of mediaPlacements) {
    const asset = publicMedia.assets.find(item => item.id === placement.assetId);
    const file = asset.files.filter(item => item.format === 'webp').at(-1);
    const imageId = `${site.origin}/media/#${asset.id}`;
    graph.push({ '@type': 'ImageObject', '@id': imageId, contentUrl: site.origin + file.src, width: file.width, height: file.height, name: asset.title, description: asset.alt });
    if (placement.role === 'brand') graph[0].logo = { '@id': imageId };
    else graph.find(node => node['@type'] === 'WebPage').primaryImageOfPage = { '@id': imageId };
  }
  if (route.path !== '/') graph.push({ '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: site.origin + '/' }, { '@type': 'ListItem', position: 2, name: route.title, item: url }] });
  const leader = leadershipData?.find(person => route.path === `/leadership/${person.slug}`);
  if (route.path === '/leadership' || leader) {
    const people = leader ? [leader] : leadershipData;
    for (const person of people) {
      const identity = { '@type': 'Person', '@id': person.personId, name: person.name, jobTitle: person.title, url: person.canonicalUrl, description: person.summary[entity], affiliation: { '@id': `${site.origin}/#organization` }, ...(person.professionalLinks.length ? { sameAs: person.professionalLinks.map(link => link.href) } : {}) };
      const existing = graph.find(node => node['@id'] === person.personId);
      if (existing) Object.assign(existing, identity); else graph.push(identity);
    }
    const page = graph.find(node => node['@type'] === 'WebPage');
    if (leader) { page['@type'] = 'ProfilePage'; page.mainEntity = { '@id': leader.personId }; }
    else {
      page['@type'] = 'CollectionPage'; page.mainEntity = { '@id': url + '#leadership' };
      graph.push({ '@type': 'ItemList', '@id': url + '#leadership', name: 'Company leadership', numberOfItems: people.length, itemListElement: people.map((person, index) => ({ '@type': 'ListItem', position: index + 1, url: `${site.origin}/leadership/${person.slug}`, item: { '@id': person.personId } })) });
    }
  }
  const work = scholarlyData?.manuscripts.find(item => route.path === `/research/${item.slug}`);
  if (work) graph.push({ '@type': 'ScholarlyArticle', '@id': url + '#work', name: work.title, headline: work.title, abstract: work.abstract, author: { '@id': personId }, url, sameAs: [work.canonicalUrl, ...work.alternateRecords], creativeWorkStatus: work.status, keywords: work.categories, ...(work.year ? { datePublished: String(work.year) } : {}), ...(work.doi ? { identifier: work.doi } : {}), ...(work.pdfUrl ? { encoding: { '@type': 'MediaObject', contentUrl: work.pdfUrl, encodingFormat: 'application/pdf' } } : {}) });
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replaceAll('<', '\\u003c');
}
async function pageHtml(route, notFound = false) {
  const title = route.path === '/' ? `${names[entity]} | ${route.title}` : `${route.title} | ${names[entity]}`;
  let html = template.replace(/<title>[\s\S]*?<\/title>/i, '').replace(/<meta\b[^>]*(?:name=["'](?:description|robots|twitter:[^"']+)["']|property=["']og:[^"']+["'])[^>]*>/gi, '').replace(/<link\b[^>]*rel=["']canonical["'][^>]*>/gi, '').replace(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, '');
  const meta = `<title>${escape(title)}</title>\n<meta name="description" content="${escape(route.description)}" />\n<link rel="canonical" href="${escape(site.origin + route.path)}" />\n<meta name="robots" content="${notFound ? 'noindex, follow' : 'index, follow'}" />\n<meta property="og:type" content="website" />\n<meta property="og:title" content="${escape(title)}" />\n<meta property="og:description" content="${escape(route.description)}" />\n<meta property="og:url" content="${escape(site.origin + route.path)}" />\n<meta property="og:site_name" content="${names[entity]}" />\n<meta property="og:image" content="${site.origin}/social-preview.png" />\n<meta property="og:image:alt" content="${names[entity]} — Founded by Lyric Helena Emerson" />\n<meta name="twitter:card" content="summary_large_image" />\n<meta name="twitter:title" content="${escape(title)}" />\n<meta name="twitter:description" content="${escape(route.description)}" />\n<meta name="twitter:image" content="${site.origin}/social-preview.png" />\n<script type="application/ld+json">${structured(route)}</script>`;
  html = html.replace('</head>', meta + '\n</head>').replace(/<div id="root"><\/div>/, `<div id="root">${await render(route.path)}</div>`);
  assert.ok(!html.includes('<div id="root"></div>'), `Missing content: ${route.path}`);
  return html;
}
for (const route of routes) {
  const target = route.path === '/' ? resolve(out, 'index.html') : resolve(out, route.path.slice(1), 'index.html');
  assert.ok(target.startsWith(out), 'Route escaped public output');
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, await pageHtml(route));
}
writeFileSync(resolve(out, '404.html'), await pageHtml({ path: '/404', title: 'Page not found', description: 'The requested page is unavailable. Return to the company home or explore the resource library.' }, true));
writeFileSync(resolve(out, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + routes.map(route => `  <url><loc>${escape(site.origin + route.path)}</loc></url>`).join('\n') + '\n</urlset>\n');
const aliases = { '/privacy-policy': '/privacy', '/terms-of-use': '/terms', '/educational-resources': '/resources', '/resource-library': '/resources', '/inquiry': '/contact', '/leadership/lyric': '/leadership/lyric-helena-emerson', '/leadership/darin': '/leadership/darin-latrelle-james', '/leadership/shamrit': '/leadership/shamrit-phagura', '/leadership/kenny': '/leadership/godwin-iwatan-kehinde', '/leadership/todor': '/leadership/todor-tomic', '/services': '/services-pricing', '/register': '/classes', '/journal': '/research', '/speaking': entity === 'EPDG' ? '/conferences' : '/research', ...(entity === 'TEE' ? { '/sc-community': '/community-resources', '/research/administrative-records': 'https://emersonprofessionaldevelopment.netlify.app/conferences/evidence-policymaking-2026', '/research/ordered-liberty-datafication': 'https://emersonprofessionaldevelopment.netlify.app/conferences/ordered-liberty-2026', '/research/reciprocity-without-justice': 'https://emersonprofessionaldevelopment.netlify.app/research/emerwj', '/global-internship': 'https://emersonprofessionaldevelopment.netlify.app/global-internship-program', '/epdg': 'https://emersonprofessionaldevelopment.netlify.app/', '/agency': 'https://emersonagency.netlify.app/' } : entity === 'TEA' ? { '/educationPage': '/community-education' } : { '/global-internship': '/global-internship-program', '/programs': '/global-internship-program' }) };
writeFileSync(resolve(out, '_redirects'), Object.entries(aliases).filter(([from]) => !routes.some(route => route.path === from)).map(([from, to]) => `${from} ${to} 301`).join('\n') + '\n/* /404.html 404\n');
writeFileSync(resolve(out, 'public-routes.json'), JSON.stringify({ revision: '2026-11-14', routes, aliases }, null, 2) + '\n');
assert.ok(readFileSync(resolve(out, 'social-preview.png')).length > 1000, 'Reviewed social preview is missing');
console.log(`${entity}: pre-rendered ${routes.length} indexable public routes, aliases and a true 404.`);
