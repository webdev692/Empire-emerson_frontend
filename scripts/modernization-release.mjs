import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
export function validateModernizationRelease(root) {
  const approval = JSON.parse(readFileSync(resolve(root, 'docs/PUBLIC_WEBSITE_MODERNIZATION_2026-11-14.json'), 'utf8'));
  assert.equal(approval.revision, '2026-11-14-public-modernization');
  assert.deepEqual(approval.scope, ['Emerson_Empire', 'Agency_LandingPage', 'EPDG-Landing-Page']);
  assert.equal(approval.publication_approved, true);
  for (const key of ['portal_activation_authorized', 'portal_changes_authorized', 'crm_changes_authorized', 'media_studio_changes_authorized', 'paid_resources_authorized']) assert.equal(approval[key], false);
  assert.equal(approval.content_policy.private_cv_publication, false);
  assert.equal(approval.release_policy.preserve_previous_receipts, true);
  return approval;
}
