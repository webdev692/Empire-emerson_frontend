import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { assertPublicPrivacy, readPublicBoundary, validateFrozenExports } from './public-source-boundary.mjs';
import { validateFrozenPublicContent } from './validate-frozen-public-content.mjs';
import { validatePublicContent } from './validate-public-content.mjs';
import { approvedProgramData } from './three-programs-release.mjs';
import { approvedResearchData } from './tee-research-release.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const read = path => readFileSync(resolve(root, path));
const json = path => JSON.parse(read(path));

test('public checkout reproduces only the approved hashes, schemas, source URLs, consent and feature holds', () => {
  const { boundary, catalog } = validateFrozenPublicContent(root);
  assert.equal(Object.keys(boundary.payloads).length, 23);
  assert.equal(Object.values(boundary.published).reduce((n, site) => n + site.files.length, 0), 217);
  assert.ok(catalog.people.every(person => person.consent_status === 'GRANTED'));
  assert.ok(catalog.research.every(work => work.author_review_status === 'APPROVED'));
});

test('changed public content cannot reuse the frozen exact-version approval', () => {
  const changed = resolve(root, 'shared/catalog.public.json');
  const readChanged = path => path === changed ? Buffer.from(JSON.stringify({ ...json('shared/catalog.public.json'), resources: [] })) : readFileSync(path);
  assert.throws(() => validateFrozenExports(root, readChanged), /Approved public payload changed/);
});

test('changed registration holds or payload receipts cannot manufacture an approval', () => {
  const path = resolve(root, 'shared/public-source-boundary.json');
  const altered = { ...json('shared/public-source-boundary.json'), registration_enabled: true };
  assert.throws(() => readPublicBoundary(root, file => file === path ? Buffer.from(JSON.stringify(altered)) : readFileSync(file)), /Frozen public boundary changed/);
});

test('public semantic gate rejects private fields, private URLs, credentials and draft/synthetic catalog entries', () => {
  for (const value of [{ source_notes: ['not public'] }, { private_feedback: 'not public' }, { url: 'https://drive.google.com/file/d/held' }, { url: 'https://user:password@example.test/' }, { url: 'https://example.org/?token=secret' }]) assert.throws(() => assertPublicPrivacy(value));
  const catalog = json('shared/catalog.public.json');
  for (const changes of [{ synthetic: true }, { content_status: 'DRAFT' }]) assert.throws(() => validatePublicContent({ ...catalog, resources: [{ ...catalog.resources[0], ...changes }] }), /not eligible/);
});

test('original program/research validators still reject changed reviewed text and wider operating authority', () => {
  const program = json('docs/THREE_PROGRAMS_PUBLICATION_APPROVAL.json');
  const programText = read(program.public_data_path).toString();
  assert.throws(() => approvedProgramData({ ...program, live_intake_enabled: true }, programText, programText));
  assert.throws(() => approvedProgramData(program, programText + ' ', programText));
  const research = json('docs/TEE_RESEARCH_PUBLICATION_APPROVAL.json');
  const reviewed = read(research.reviewed_data_path).toString(), published = read(research.public_data_path).toString();
  assert.throws(() => approvedResearchData(research, reviewed + ' ', published), /Reviewed research changed/);
  assert.throws(() => approvedResearchData({ ...research, full_conference_manuscripts_published: true }, reviewed, published));
});

test('private authoring fails explicitly without creating exports or approvals', () => {
  const result = spawnSync(process.execPath, [resolve(root, 'scripts/private-authoring-unavailable.mjs')], { encoding: 'utf8' });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Private content authoring\/review is unavailable/);
});
