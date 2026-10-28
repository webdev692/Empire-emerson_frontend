import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
export function approvedResearchData(approval, reviewedText, publicText) {
  assert.equal(approval.publication_approved, true);
  assert.equal(approval.reviewed_commit, '734251fae289d2b6580c8c5fbcba5ba4a2e6cc75');
  assert.equal(approval.entity, 'TEE'); assert.equal(approval.destination, 'https://theemerson.netlify.app');
  assert.equal(approval.site_id, '32b31e79-2259-4ca8-8f62-7177fa4099cd');
  assert.equal(approval.reviewed_data_path, 'Emerson_Empire/src/research.preview.json');
  assert.equal(approval.public_data_path, 'Emerson_Empire/src/research.public.json');
  assert.equal(approval.selection, 'replace-current-three');
  assert.equal(approval.conference_content, 'summaries_and_presentation_details_only');
  for (const key of ['full_conference_manuscripts_published', 'registration_enabled', 'live_intake_enabled', 'new_spending_authorized', 'permissions_changed', 'tea_epdg_changes_authorized']) assert.equal(approval[key], false);
  const normalized = text => text.replaceAll('\r\n', '\n');
  const sha = text => createHash('sha256').update(normalized(text)).digest('hex');
  assert.equal(sha(reviewedText), approval.reviewed_data_sha256_lf, 'Reviewed research changed');
  assert.equal(sha(publicText), approval.public_data_sha256_lf, 'Public research changed');
  const reviewed = JSON.parse(reviewedText), data = JSON.parse(publicText);
  assert.equal(data.entity, 'TEE'); assert.equal(data.schemaVersion, 1);
  assert.deepEqual(data.works, reviewed.works, 'Research must match the exact reviewed summaries and metadata');
  assert.deepEqual(data.works.map(w => w.id), ['administrative-records', 'ordered-liberty-datafication', 'reciprocity-without-justice']);
  assert.deepEqual(data.works.map(w => w.id), approval.work_ids);
  const fields = ['id','title','author','kind','summary','venue','date','role','version','availability','links'].sort();
  for (const work of data.works) {
    assert.deepEqual(Object.keys(work).sort(), fields); assert.equal(work.author, 'Lyric Helena Emerson');
    for (const link of work.links) { const url = new URL(link.url); assert.equal(url.protocol, 'https:'); assert.ok(['philevents.org','philarchive.org','philpapers.org'].includes(url.hostname)); }
  }
  assert.doesNotMatch(publicText, /drive\.google|docs\.google|libfile_|private-imports|\.docx|\.pdf|full_text|pdf_url|doi"/i);
  return data;
}
export function validateResearchPublication(root) {
  const approval = JSON.parse(readFileSync(resolve(root, 'docs/TEE_RESEARCH_PUBLICATION_APPROVAL.json'), 'utf8'));
  approvedResearchData(approval, readFileSync(resolve(root, approval.reviewed_data_path), 'utf8'), readFileSync(resolve(root, approval.public_data_path), 'utf8'));
  return approval;
}
