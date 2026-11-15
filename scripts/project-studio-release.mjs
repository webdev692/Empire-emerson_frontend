import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';

// Phase Four cannot approve more offers by rehashing the historical approval.
const historicalApprovalPath = 'docs/PROJECT_STUDIO_PUBLICATION_APPROVAL.json';
const historicalApprovalHash = '6feb4b389eac43204fa65b6156960cfa5b157ce46989e54e6dcc303a0bb50017';
const historicalCatalogHash = '9bdc4efb983bc2c213f9165397ba07fc24858e82bfdda6c83f9d54e0fb9d2366';
const publicDataPath = 'shared/project-studio.public.json';
const reviewedDataPath = 'shared/project-studio.preview.json';
const informationPath = 'shared/project-studio.information.json';
const informationApprovalPath = 'docs/PROJECT_STUDIO_PHASE_FOUR_AUTHORIZATION.json';
const entities = ['TEE', 'TEA'];
const destinations = ['https://theemerson.netlify.app', 'https://emersonagency.netlify.app'];
const exampleIds = ['BUS-03', 'SYS-03'];
const categories = [
  ['websites-digital-development', 'Websites & Digital Development'],
  ['sales-client-coordination', 'Sales Support & Client Coordination'],
  ['human-resources-people-operations', 'Human Resources & People Operations'],
  ['operations-project-management', 'Business Operations & Project Management'],
  ['business-systems-automation', 'Business Systems & Automation'],
  ['financial-records-organization', 'Financial Records & Business Organization'],
  ['marketing-content-research', 'Marketing, Content & Business Research'],
  ['technical-quality-security', 'Technical Review, Quality & Security'],
];
const caseIds = ['website-refresh', 'appointment-workflow', 'employee-onboarding', 'internal-project'];
const steps = [
  ['tell-us', 'Tell Us What You Need'], ['review', 'Review the Project'],
  ['scope', 'Agree on Scope'], ['assign', 'Assign the Project Team'],
  ['complete-review', 'Complete & Review'], ['accept-handoff', 'Accept & Hand Off'],
];
const closedFlags = [
  'registration_enabled', 'live_intake_enabled', 'payments_enabled',
  'contracts_enabled', 'client_accounts_enabled', 'commercial_activation_enabled',
  'sensitive_system_access_enabled', 'crm_integration_enabled', 'email_routing_enabled',
  'new_spending_authorized', 'permissions_changed',
];
const hash = text => createHash('sha256').update(text).digest('hex');
const read = (root, path) => readFileSync(resolve(root, path), 'utf8').replaceAll('\r\n', '\n');
const exactKeys = (value, keys, label) => assert.deepEqual(Object.keys(value).sort(), [...keys].sort(), `${label}: unexpected or missing field`);
function prose(value, label) {
  assert.equal(typeof value, 'string', `${label}: expected text`);
  assert.ok(value.trim().length >= 10 && value.length <= 1800, `${label}: missing or excessive text`);
  assert.doesNotMatch(value, /https?:|mailto:|\bwww\.|[<>{}]|[$€£]|\b(?:USD|EUR|GBP)\s*\d|\b\d+(?:\.\d+)?\s*(?:dollars?|USD|EUR|GBP|%)/i, `${label}: no endpoints, markup, numeric prices or financial percentages`);
}

export function validateStudioPublication(root) {
  const approvalText = read(root, historicalApprovalPath);
  assert.equal(hash(approvalText), historicalApprovalHash, 'Historical Studio approval must remain immutable');
  const approval = JSON.parse(approvalText);
  assert.deepEqual(approval.example_ids, exampleIds);
  assert.deepEqual(approval.entities, entities);
  assert.deepEqual(approval.destinations, destinations);
  for (const key of ['registration_enabled', 'live_intake_enabled', 'new_spending_authorized', 'permissions_changed']) assert.equal(approval[key], false);
  assert.equal(approval.public_data_path, publicDataPath);
  assert.equal(approval.reviewed_data_path, reviewedDataPath);
  const text = read(root, publicDataPath);
  assert.equal(hash(text), historicalCatalogHash, 'Historical Studio catalog must remain immutable');
  assert.equal(hash(text), approval.data_sha256_lf);
  assert.equal(read(root, reviewedDataPath), text, 'Reviewed historical catalog must remain unchanged');
  const data = JSON.parse(text);
  assert.deepEqual(data.examples.map(row => row.id), exampleIds);
  const fields = ['id', 'name', 'audience', 'family', 'summary', 'delivery', 'deliverables', 'limits', 'inputs', 'handoff', 'priceDisplay'];
  for (const row of data.examples) {
    exactKeys(row, fields, row.id);
    assert.equal(row.priceDisplay, 'Request a project quote');
  }
  assert.doesNotMatch(text, /https?:|\$|\d+%|payroll|profit|roster|Founder approval|timeline|readiness/i);

  const informationApproval = JSON.parse(read(root, informationApprovalPath));
  exactKeys(informationApproval, [
    'schema_version', 'authority', 'approved_on', 'reviewed_source_commit',
    'entities', 'destinations', 'information_data_path', 'information_data_sha256_lf',
    'historical_approval_path', 'historical_approval_sha256_lf',
    'historical_public_data_path', 'historical_public_data_sha256_lf',
    'historical_reviewed_data_path', 'historical_reviewed_data_sha256_lf',
    'category_ids', 'illustrative_case_ids', 'process_step_ids', 'historical_example_ids',
    'public_information_authorized', 'informational_only', ...closedFlags,
  ], 'Phase Four authorization');
  assert.equal(informationApproval.schema_version, 1);
  prose(informationApproval.authority, 'Authorization authority');
  assert.equal(informationApproval.approved_on, '2026-11-15');
  assert.match(informationApproval.reviewed_source_commit, /^[a-f0-9]{40}$/);
  assert.deepEqual(informationApproval.entities, entities);
  assert.deepEqual(informationApproval.destinations, destinations);
  assert.equal(informationApproval.information_data_path, informationPath);
  assert.equal(informationApproval.historical_approval_path, historicalApprovalPath);
  assert.equal(informationApproval.historical_approval_sha256_lf, historicalApprovalHash);
  assert.equal(informationApproval.historical_public_data_path, publicDataPath);
  assert.equal(informationApproval.historical_public_data_sha256_lf, historicalCatalogHash);
  assert.equal(informationApproval.historical_reviewed_data_path, reviewedDataPath);
  assert.equal(informationApproval.historical_reviewed_data_sha256_lf, historicalCatalogHash);
  assert.deepEqual(informationApproval.historical_example_ids, exampleIds);
  assert.deepEqual(informationApproval.category_ids, categories.map(([id]) => id));
  assert.deepEqual(informationApproval.illustrative_case_ids, caseIds);
  assert.deepEqual(informationApproval.process_step_ids, steps.map(([id]) => id));
  assert.equal(informationApproval.public_information_authorized, true);
  assert.equal(informationApproval.informational_only, true);
  for (const key of closedFlags) assert.equal(informationApproval[key], false, `${key} must remain closed`);

  const informationText = read(root, informationPath);
  assert.equal(hash(informationText), informationApproval.information_data_sha256_lf, 'Informational content must match Phase Four authorization');
  const information = JSON.parse(informationText);
  exactKeys(information, ['schemaVersion', 'scope', 'categoryNotice', 'illustrativeCaseNotice', 'categories', 'illustrativeCases', 'processSteps'], 'Information catalog');
  assert.equal(information.schemaVersion, 1);
  assert.equal(information.scope, 'informational-project-inquiries');
  prose(information.categoryNotice, 'Category notice');
  assert.match(information.categoryNotice, /not additional commercial packages/);
  assert.match(information.categoryNotice, /before a project can be accepted/);
  prose(information.illustrativeCaseNotice, 'Illustrative case notice');
  assert.match(information.illustrativeCaseNotice, /Hypothetical/);
  assert.match(information.illustrativeCaseNotice, /not completed client projects/);
  assert.deepEqual(information.categories.map(({ id, title }) => [id, title]), categories, 'Exactly eight approved informational categories');
  for (const row of information.categories) {
    exactKeys(row, ['id', 'title', 'summary', 'detail', 'examples', 'boundary'], row.id);
    for (const key of ['summary', 'detail', 'boundary']) prose(row[key], `${row.id}.${key}`);
    assert.ok(Array.isArray(row.examples) && row.examples.length >= 2 && row.examples.length <= 3, `${row.id}: two or three illustrative examples`);
    for (const example of row.examples) prose(example, `${row.id}.examples`);
  }
  assert.deepEqual(information.illustrativeCases.map(({ id }) => id), caseIds, 'Exactly four hypothetical cases');
  for (const row of information.illustrativeCases) {
    exactKeys(row, ['id', 'categoryId', 'title', 'description'], row.id);
    assert.ok(categories.some(([id]) => id === row.categoryId), `${row.id}: unknown category`);
    prose(row.title, `${row.id}.title`);
    prose(row.description, `${row.id}.description`);
  }
  assert.deepEqual(information.processSteps.map(({ id, title }) => [id, title]), steps, 'Exactly six approved process steps');
  for (const row of information.processSteps) {
    exactKeys(row, ['id', 'title', 'description'], row.id);
    prose(row.description, `${row.id}.description`);
  }
  return { ...approval, information, informationApproval };
}
