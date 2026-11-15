/** Reviewed photography assignments, including retained assets that must not render. */
import assert from 'node:assert/strict';
import { attributes } from './verify-modern-public.mjs';

export const soloPortrait = 'darin-latrelle-james-option-b';
export const jointPortrait = 'lyric-helena-emerson-darin-latrelle-james';
export const staffPortraits = {
  'shamrit-phagura': 'shamrit-phagura-professional',
  'godwin-iwatan-kehinde': 'godwin-iwatan-kehinde-professional',
  'todor-tomic': 'todor-tomic-professional',
};
const entities = ['TEE', 'TEA', 'EPDG'];
const subjects = ['lyric-helena-emerson', 'darin-latrelle-james', ...Object.keys(staffPortraits)];

export function validatePhotographyAssignments(media) {
  const portraits = media.placements.filter(item => item.role === 'portrait');
  assert.equal(portraits.length, 15, 'All five approved leaders require one assignment per company');
  for (const entity of entities) {
    for (const [subject, assetId] of [
      ['lyric-helena-emerson', entity === 'TEA' ? 'lyric-helena-emerson-plum' : 'lyric-helena-emerson-executive'],
      ['darin-latrelle-james', soloPortrait],
      ...Object.entries(staffPortraits),
    ]) {
      const matches = portraits.filter(item => item.entity === entity && item.subject === subject);
      assert.equal(matches.length, 1, 'Missing or duplicate approved portrait assignment');
      assert.equal(matches[0].assetId, assetId, 'Incorrect portrait subject or selection');
      assert.equal(matches[0].path, `/leadership/${subject}`);
      assert.equal(media.assets.find(asset => asset.id === assetId)?.kind, 'portrait');
    }
  }
  assert.ok(media.assets.some(asset => asset.id === jointPortrait), 'Retain the approved joint asset');
  assert.deepEqual(media.retainedAssets, [{ assetId: jointPortrait, entities }], 'Only the approved joint asset is retained without a placement');
  assert.ok(!media.placements.some(item => item.assetId === jointPortrait), 'The joint asset must no longer have a profile placement');
  return { activePortraits: 6, retainedPortraits: 1, assignments: portraits.length };
}

export function validateLeadershipPhotography(html, { entity, path, media }) {
  validatePhotographyAssignments(media);
  assert.ok(entities.includes(entity), 'Unknown photography company');
  assert.ok(path === '/leadership' || subjects.some(subject => path === `/leadership/${subject}`), 'Unknown leadership photography route');
  const jointFiles = media.assets.find(asset => asset.id === jointPortrait).files.map(file => file.src);
  assert.ok(!jointFiles.some(src => html.includes(src)), 'Retained joint portrait must not render in leadership');
  const directory = path === '/leadership';
  const figures = [...html.matchAll(/<figure\b([^>]*)>/gi)].map(match => attributes(match[1])).filter(props => (props.class || '').split(/\s+/).includes('leadership-portrait'));
  assert.equal(figures.length, directory ? 5 : 1, 'Each approved leader requires exactly one portrait');
  for (const placement of media.placements.filter(item => item.entity === entity && item.role === 'portrait' && (directory || item.path === path))) {
    const asset = media.assets.find(item => item.id === placement.assetId);
    const region = directory
      ? placement.subject === 'darin-latrelle-james'
        ? html.match(/<article\b[^>]*aria-labelledby="managing-partner-name"[^>]*>([\s\S]*?)<\/article>/)?.[1]
        : placement.subject === 'lyric-helena-emerson'
          ? html.match(/<div class="leadership-feature">([\s\S]*?)<div class="leadership-feature-copy"/)?.[1]
          : html.match(new RegExp(`<article\\b[^>]*aria-labelledby="leader-${placement.subject}"[^>]*>([\\s\\S]*?)<\\/article>`))?.[1]
      : html.match(/<section\b[^>]*class="[^"]*leadership-profile-hero[^"]*"[^>]*>([\s\S]*?)<\/section>/)?.[1];
    assert.ok(region, 'Missing subject-specific leadership region');
    assert.ok(!/class="[^"]*leadership-monogram/.test(region), 'Approved portrait must replace the initials fallback');
    assert.ok(!/<figcaption\b/i.test(region), 'Leadership portraits have no visible caption');
    const images = [...region.matchAll(/<img\b([^>]*)>/gi)].map(match => attributes(match[1]));
    assert.equal(images.length, 1, 'Exactly one portrait belongs to each approved subject');
    assert.equal(images.filter(img => asset.files.some(file => file.src === img.src) && img.alt === asset.alt).length, 1, 'Approved portrait missing, duplicated, or incorrectly identified');
    for (const [, tag] of region.matchAll(/<(?:img|source)\b([^>]*)>/gi)) {
      const props = attributes(tag);
      for (const candidate of (props.srcset || '').split(',').filter(Boolean)) {
        assert.ok(asset.files.some(file => file.src === candidate.trim().split(/\s+/)[0]), 'Responsive source belongs to a different portrait');
      }
    }
  }
}
