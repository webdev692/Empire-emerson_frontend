import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateFrozenExports, assertPublicPrivacy } from './public-source-boundary.mjs';
import { validatePublicContent } from './validate-public-content.mjs';
import { validateSCDataset } from '../Emerson_Empire/src/data/scCommunityModel.ts';
import { validateDirectoryDataset } from '../EPDG-Landing-Page/src/data/epdgInstitutionModel.ts';
import { validateFreeLearningDataset } from '../EPDG-Landing-Page/src/data/epdgFreeLearningModel.ts';
import { validateStudioPublication } from './project-studio-release.mjs';
import { validateThreeProgramsPublication } from './three-programs-release.mjs';
import { validateResearchPublication } from './tee-research-release.mjs';

export function validateFrozenPublicContent(root) {
  const boundary = validateFrozenExports(root);
  const read = path => JSON.parse(readFileSync(resolve(root, path), 'utf8'));
  const approval = read('shared/release-approval.json');
  for (const key of ['publication_approved', 'subject_consent_confirmed', 'exact_version_author_review_confirmed']) assert.equal(approval[key], true);
  for (const path of Object.keys(boundary.payloads).filter(path => path.endsWith('.json') && !path.startsWith('docs/'))) assertPublicPrivacy(read(path));
  const catalog = validatePublicContent(read('shared/catalog.public.json'));
  validateSCDataset(read('Emerson_Empire/src/data/sc-community.local.json'));
  validateDirectoryDataset(read('EPDG-Landing-Page/src/data/institutions.local.json'));
  validateFreeLearningDataset(read('EPDG-Landing-Page/src/data/free-learning.local.json'));
  const learning = read('shared/learning.public.json');
  assert.deepEqual(Object.keys(learning).sort(), ['classTopics', 'worksheetText']);
  assert.equal(learning.classTopics.length, 21);
  assert.ok(learning.classTopics.every(topic => typeof topic === 'string' && topic.trim()));
  assert.equal(typeof learning.worksheetText, 'string');
  // Original reviewed-source validators remain unchanged, including exact
  // reviewed/public hashes and per-feature destinations and operating holds.
  validateStudioPublication(root);
  validateThreeProgramsPublication(root);
  validateResearchPublication(root);
  return { boundary, catalog };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  validateFrozenPublicContent(fileURLToPath(new URL('..', import.meta.url)));
  console.log('Frozen public hashes, schemas, source URLs, privacy, consent and original feature approvals PASS. Registration/live intake remain held. No content was authored.');
}
