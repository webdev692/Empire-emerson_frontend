/** Reviewed photography assignments, including retained assets that must not render. */
import assert from 'node:assert/strict';
import { attributes } from './verify-modern-public.mjs';

export const soloPortrait = 'darin-latrelle-james-option-b';
export const jointPortrait = 'lyric-helena-emerson-darin-latrelle-james';
export const heldProfiles = ['shamrit-phagura', 'godwin-iwatan-kehinde', 'todor-tomic'];
const entities = ['TEE', 'TEA', 'EPDG'];

export function validatePhotographyAssignments(media) {
  const portraits = media.placements.filter(item => item.role === 'portrait');
  assert.equal(portraits.length, 6, 'Only the six approved founder/partner assignments may render');
  for (const entity of entities) {
    for (const [subject, assetId] of [
      ['lyric-helena-emerson', entity === 'TEA' ? 'lyric-helena-emerson-plum' : 'lyric-helena-emerson-executive'],
      ['darin-latrelle-james', soloPortrait],
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
  return { activePortraits: 3, retainedPortraits: 1, assignments: portraits.length };
}

export function validateLeadershipPhotography(html, { entity, path, media }) {
  const jointFiles = media.assets.find(asset => asset.id === jointPortrait).files.map(file => file.src);
  assert.ok(!jointFiles.some(src => html.includes(src)), 'Retained joint portrait must not render in leadership');
  const directory = path === '/leadership';
  for (const placement of media.placements.filter(item => item.entity === entity && item.role === 'portrait' && (directory || item.path === path))) {
    const asset = media.assets.find(item => item.id === placement.assetId);
    const region = directory
      ? placement.subject === 'darin-latrelle-james'
        ? html.match(/<article\b[^>]*aria-labelledby="managing-partner-name"[^>]*>([\s\S]*?)<\/article>/)?.[1]
        : html.match(/<div class="leadership-feature">([\s\S]*?)<div class="leadership-feature-copy"/)?.[1]
      : html.match(/<section\b[^>]*class="[^"]*leadership-profile-hero[^"]*"[^>]*>([\s\S]*?)<\/section>/)?.[1];
    assert.ok(region, 'Missing subject-specific leadership region');
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
  for (const slug of heldProfiles) {
    if (!directory && path !== `/leadership/${slug}`) continue;
    const region = directory ? html.match(new RegExp(`<article\\b[^>]*aria-labelledby="leader-${slug}"[^>]*>([\\s\\S]*?)<\\/article>`))?.[1] : html.match(/<section\b[^>]*class="[^"]*leadership-profile-hero[^"]*"[^>]*>([\s\S]*?)<\/section>/)?.[1];
    assert.ok(region && /class="leadership-monogram" aria-hidden="true"/.test(region), 'Held staff portrait must retain decorative initials');
    assert.ok(!/<img\b/i.test(region), 'Held staff image must not be published');
  }
}
