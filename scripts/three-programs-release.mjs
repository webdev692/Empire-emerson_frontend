import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';

export function approvedProgramData(approval, reviewedText, publicText) {
  assert.equal(approval.publication_approved, true);
  assert.equal(approval.reviewed_commit, '2e05121ea8da7edb37f3ed79011be9469055fcd7');
  assert.equal(approval.reviewed_data_path, 'shared/three-programs.preview.json');
  assert.equal(approval.public_data_path, 'shared/three-programs.public.json');
  assert.deepEqual(approval.destinations, ['https://theemerson.netlify.app', 'https://emersonagency.netlify.app', 'https://emersonprofessionaldevelopment.netlify.app']);
  for (const field of ['registration_enabled', 'live_intake_enabled', 'new_spending_authorized', 'permissions_changed']) assert.equal(approval[field], false);
  const reviewed = reviewedText.replaceAll('\r\n', '\n'), published = publicText.replaceAll('\r\n', '\n');
  assert.equal(published, reviewed, 'Program copy must match the reviewed version.');
  assert.equal(createHash('sha256').update(published).digest('hex'), approval.data_sha256_lf);
  const data = JSON.parse(published);
  assert.deepEqual(data.programs.map(p => ({id:p.id,entity:p.brand,route:p.route,units:p.units.length})), approval.programs);
  assert.deepEqual(data.programs.map(p => [p.brand,p.route,p.units.length]), [['TEA','/pathways',12],['TEE','/career-readiness',16],['EPDG','/global-internship-program',7]]);
  assert.deepEqual(data.programs.map(p => p.contactEmail), ['humanresources@theemersonempire.info', 'admin@theemersonempire.info', 'humanresources@theemersonempire.info']);
  assert.equal(data.programs.reduce((n,p) => n+p.actions.length, 0), 7);
  assert.doesNotMatch(published, /https?:|drive\.google|docs\.google|approved_capacity|roster|-----BEGIN .*PRIVATE KEY/i);
  return data;
}
export function validateThreeProgramsPublication(root) {
  const approval = JSON.parse(readFileSync(resolve(root, 'docs/THREE_PROGRAMS_PUBLICATION_APPROVAL.json'), 'utf8'));
  approvedProgramData(approval, readFileSync(resolve(root, approval.reviewed_data_path), 'utf8'), readFileSync(resolve(root, approval.public_data_path), 'utf8'));
  return approval;
}
