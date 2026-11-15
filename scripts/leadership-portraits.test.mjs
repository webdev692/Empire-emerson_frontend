import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { createRequire } from 'node:module';
import { validateLeadershipPhotography } from './leadership-photography-checks.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const app = resolve(root, 'Emerson_Empire');
const require = createRequire(resolve(app, 'package.json'));
let server, createElement, renderToStaticMarkup, LeadershipDirectory, createPublicPages, leadershipProfiles, publicMedia;
before(async () => {
  const { createServer } = await import(pathToFileURL(resolve(app, 'node_modules/vite/dist/node/index.js')));
  const { default: react } = await import(pathToFileURL(resolve(app, 'node_modules/@vitejs/plugin-react/dist/index.js')));
  server = await createServer({ configFile: false, root: app, plugins: [react()], resolve: { dedupe: ['react', 'react-dom'] }, server: { middlewareMode: true, watch: null } });
  const load = name => server.ssrLoadModule('/@fs/' + resolve(root, 'shared', name).replaceAll('\\', '/'));
  ({ createElement } = require('react'));
  ({ renderToStaticMarkup } = require('react-dom/server'));
  ({ LeadershipDirectory } = await load('LeadershipComponents.tsx'));
  ({ createPublicPages } = await load('PublicPageCatalog.tsx'));
  ({ leadershipProfiles } = await load('LeadershipData.ts'));
  ({ publicMedia } = await load('public-media.ts'));
});
after(async () => { await server?.close(); });

const fixturePortrait = profile => ({
  id: 'test-portrait-' + profile.slug, title: 'Test fixture', alt: profile.name,
  caption: '', kind: 'portrait', width: 600, height: 600,
  files: [
    { src: '/media/test-' + profile.slug + '.webp', format: 'webp', width: 600, height: 600, bytes: 1, sha256: 'fixture' },
    { src: '/media/test-' + profile.slug + '.jpg', format: 'jpeg', width: 600, height: 600, bytes: 1, sha256: 'fixture' },
  ],
});
function departmentCard(html, profile) {
  const card = [...html.matchAll(/<article class="leadership-department"[^>]*>[\s\S]*?<\/article>/g)].map(match => match[0]).find(value => value.includes('aria-labelledby="leader-' + profile.slug + '"'));
  assert.ok(card, 'Missing department card: ' + profile.slug);
  return card;
}

test('a supplied departmental portrait stays with its named profile while other cards keep initials', () => {
  const profile = leadershipProfiles.find(person => person.slug === 'shamrit-phagura');
  const portrait = fixturePortrait(profile);
  for (const entity of ['TEE', 'TEA', 'EPDG']) {
    const html = renderToStaticMarkup(createElement(LeadershipDirectory, { entity, options: { portraits: { [profile.slug]: portrait } } }));
    const card = departmentCard(html, profile);
    assert.ok(card.includes('src="/media/test-shamrit-phagura.jpg"'));
    assert.ok(card.includes('alt="Shamrit Phagura"'));
    assert.ok(card.includes('width="600" height="600" loading="lazy"'));
    assert.ok(card.includes(profile.title));
    assert.ok(!card.includes('leadership-monogram'));
    for (const other of leadershipProfiles.slice(2).filter(person => person.slug !== profile.slug)) {
      const held = departmentCard(html, other);
      assert.ok(held.includes('class="leadership-monogram" aria-hidden="true"'));
      assert.ok(!held.includes('<img'));
    }
  }
});

test('page catalog resolves an approved placement for any department and only its company', () => {
  for (const profile of leadershipProfiles.slice(2)) {
    const portrait = fixturePortrait(profile);
    const assetsLength = publicMedia.assets.length, originalPlacements = [...publicMedia.placements];
    publicMedia.placements.splice(0, publicMedia.placements.length, ...originalPlacements.filter(item => item.subject !== profile.slug));
    publicMedia.assets.push(portrait);
    publicMedia.placements.push({ entity: 'EPDG', path: '/leadership', role: 'portrait', subject: profile.slug, assetId: portrait.id });
    try {
      for (const entity of ['TEE', 'TEA', 'EPDG']) {
        const pages = createPublicPages(entity, []);
        const directory = renderToStaticMarkup(pages.find(page => page.path === '/leadership').content);
        const detail = renderToStaticMarkup(pages.find(page => page.path === '/leadership/' + profile.slug).content);
        assert.equal(departmentCard(directory, profile).includes('src="/media/test-' + profile.slug + '.jpg"'), entity === 'EPDG');
        assert.equal(detail.includes('src="/media/test-' + profile.slug + '.jpg"'), entity === 'EPDG');
        assert.equal(departmentCard(directory, profile).includes('leadership-monogram'), entity !== 'EPDG');
      }
    } finally {
      publicMedia.assets.splice(assetsLength);
      publicMedia.placements.splice(0, publicMedia.placements.length, ...originalPlacements);
    }
  }
});

test('all five approved portraits render in their own directory regions and biography pages on every company', () => {
  for (const entity of ['TEE', 'TEA', 'EPDG']) {
    const pages = createPublicPages(entity, []);
    const directory = renderToStaticMarkup(pages.find(page => page.path === '/leadership').content);
    validateLeadershipPhotography(directory, { entity, path: '/leadership', media: publicMedia });
    assert.ok(!directory.includes('leadership-monogram'));
    for (const profile of leadershipProfiles) {
      const detail = renderToStaticMarkup(pages.find(page => page.path === '/leadership/' + profile.slug).content);
      validateLeadershipPhotography(detail, { entity, path: '/leadership/' + profile.slug, media: publicMedia });
      assert.ok(!detail.includes('leadership-monogram'));
      assert.ok(detail.includes('loading="eager"'));
    }
  }
});

test('rendered directory and biography checks reject cross-subject staff image swaps', () => {
  const staff = leadershipProfiles.slice(2);
  for (const entity of ['TEE', 'TEA', 'EPDG']) {
    const pages = createPublicPages(entity, []);
    for (const [index, profile] of staff.entries()) {
      const ownId = publicMedia.placements.find(item => item.entity === entity && item.subject === profile.slug).assetId;
      const otherId = publicMedia.placements.find(item => item.entity === entity && item.subject === staff[(index + 1) % staff.length].slug).assetId;
      const own = publicMedia.assets.find(asset => asset.id === ownId);
      const other = publicMedia.assets.find(asset => asset.id === otherId);
      for (const path of ['/leadership', '/leadership/' + profile.slug]) {
        const html = renderToStaticMarkup(pages.find(page => page.path === path).content);
        const swapped = own.files.reduce((changed, file) => changed.replaceAll(file.src, other.files[0].src), html);
        assert.notEqual(swapped, html);
        assert.throws(() => validateLeadershipPhotography(swapped, { entity, path, media: publicMedia }), /incorrectly identified|Responsive source/);
      }
    }
  }
});
