import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';

export function validateStudioPublication(root) {
  const approval = JSON.parse(readFileSync(resolve(root, 'docs/PROJECT_STUDIO_PUBLICATION_APPROVAL.json'), 'utf8'));
  assert.deepEqual(approval.example_ids, ['BUS-03', 'SYS-03']);
  assert.deepEqual(approval.entities, ['TEE', 'TEA']);
  assert.deepEqual(approval.destinations, ['https://theemerson.netlify.app', 'https://emersonagency.netlify.app']);
  for (const key of ['registration_enabled', 'live_intake_enabled', 'new_spending_authorized', 'permissions_changed']) assert.equal(approval[key], false);
  const text = readFileSync(resolve(root, approval.public_data_path), 'utf8').replaceAll('\r\n', '\n');
  assert.equal(createHash('sha256').update(text).digest('hex'), approval.data_sha256_lf);
  assert.equal(readFileSync(resolve(root, approval.reviewed_data_path), 'utf8').replaceAll('\r\n', '\n'), text);
  const data = JSON.parse(text);
  assert.deepEqual(data.examples.map(row => row.id), approval.example_ids);
  const fields = ['id','name','audience','family','summary','delivery','deliverables','limits','inputs','handoff','priceDisplay'].sort();
  for (const row of data.examples) {
    assert.deepEqual(Object.keys(row).sort(), fields);
    assert.equal(row.priceDisplay, 'Request a project quote');
  }
  assert.doesNotMatch(text, /https?:|\$|\d+%|payroll|profit|roster|Founder approval|timeline|readiness/i);
  return approval;
}
