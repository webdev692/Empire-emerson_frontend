import test from 'node:test';
import assert from 'node:assert/strict';
import { inspectEditorialDocument, renderedMediaLayouts } from './editorial-layout-checks.mjs';

const editorial = { id: 'company-work', kind: 'editorial', files: [{ src: '/media/work.jpg' }] };
const founder = { id: 'lyric-helena-emerson-executive', kind: 'portrait', files: [{ src: '/media/founder.jpg' }] };
const context = { entity: 'TEE', path: '/', media: { assets: [editorial, founder] } };
const picture = asset => `<picture data-media-id="${asset.id}"><img src="${asset.files[0].src}" loading="eager" fetchpriority="high"></picture>`;
const page = (hero = editorial, extra = '') => `<main><section data-editorial-kind="banner"><h1>Company purpose</h1>${picture(hero)}</section>${extra}</main>`;
test('a company banner can coexist with one deliberate founder acknowledgment', () => {
  assert.equal(inspectEditorialDocument(page(editorial, picture(founder)), context).founderPortraits, 1);
});
test('editorial acceptance rejects repeated portraits and artwork within a page', () => {
  assert.throws(() => inspectEditorialDocument(page(editorial, picture(founder).repeat(2)), context), /repeated founder/);
  assert.throws(() => inspectEditorialDocument(page(editorial, picture(editorial)), context), /repeated editorial/);
});
test('company banners reject a founder substitution, unreviewed art or lazy priority image', () => {
  assert.throws(() => inspectEditorialDocument(page(founder), context), /cannot substitute/);
  assert.throws(() => inspectEditorialDocument(page().replace('company-work', 'unapproved'), context), /unreviewed/);
  assert.throws(() => inspectEditorialDocument(page().replace('loading="eager"', 'loading="lazy"'), context));
});
test('responsive alternatives and retained joint portraits cannot bypass the placement review', () => {
  const substituted = page().replace('<img ', '<source srcset="/media/unreviewed.webp 600w"><img ');
  assert.throws(() => inspectEditorialDocument(substituted, context), /differs from its reviewed asset/);
  const joint = { id: 'lyric-helena-emerson-darin-latrelle-james', kind: 'portrait', files: [{ src: '/media/joint.jpg' }] };
  assert.throws(() => inspectEditorialDocument(page(editorial, picture(joint)), { ...context, path: '/about', media: { assets: [...context.media.assets, joint], retainedAssets: [{ assetId: joint.id }] } }), /retained portrait/);
});
test('presentation belongs to the actual picture container, not another layout on the page', () => {
  const html = `<section data-editorial-kind="banner">${picture(editorial)}</section><div data-editorial-kind="research"><section data-editorial-kind="feature">${picture(founder)}</section></div>`;
  assert.deepEqual(renderedMediaLayouts(html), [{ assetId: editorial.id, presentation: 'banner' }, { assetId: founder.id, presentation: 'research' }]);
});
