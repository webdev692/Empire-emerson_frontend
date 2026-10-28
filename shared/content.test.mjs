import assert from 'node:assert/strict';
import test from 'node:test';
import { CONTENT_CONTRACT_VERSION, filterResources, resourceAvailability, selectCatalog, validateCatalog } from './content.ts';

const resource = (changes = {}) => ({
  id: 'fixture-resource-us', entity: 'TEE', title: 'Sample library learning support', provider: 'Fictional QA provider',
  topic: 'Education', country: 'US', subregion: 'South Carolina', languages: ['en', 'es'], audience: 'Local residents',
  eligibility: 'Confirm residency with the provider', access_url: null, cost_basis: null, credential_cost_basis: null,
  last_checked_at: null, source_url: null, verification_status: 'UNVERIFIED', content_status: 'DRAFT', synthetic: true,
  recheck_due_at: null, ...changes,
});
const program = (changes = {}) => ({
  id: 'fixture-program', operator: 'EPDG', title: 'Sample planning program', geography: 'South Carolina',
  audience: 'Adults', delivery_format: 'To be confirmed', free_to_participant: true, operating_status: 'PARTNER_PLANNING',
  cta_type: 'PARTNER_INQUIRY', cta_url: null, support_route: null, content_status: 'DRAFT',
  approved_capacity: null, confirmed_dates: null, synthetic: true, ...changes,
});
const person = (changes = {}) => ({
  id: 'fixture-person', name: 'Fictional QA Person', title: 'Sample role', bio: null,
  consent_status: 'VERIFY_BEFORE_PUBLICATION', image_rights_status: 'NO_IMAGE_SUPPLIED', public_links: [],
  content_status: 'DRAFT', synthetic: true, ...changes,
});
const lesson = (changes = {}) => ({
  id: 'fixture-lesson', entity: 'TEA', title: 'Sample source-checking lesson', jurisdiction: 'United States',
  content_status: 'DRAFT', synthetic: true, sections: [{ heading: 'Check applicability', body: 'Identify the country before using a resource.' }],
  ...changes,
});
const research = (changes = {}) => ({
  id: 'fixture-research', title: 'Fictional QA research record', authors: ['Fictional QA Author'], scholarly_status: 'PREPRINT',
  version: '1', canonical_url: null, doi: null, permitted_pdf_url: null, author_review_status: 'PENDING',
  content_status: 'DRAFT', synthetic: true, ...changes,
});
const catalog = (changes = {}) => ({ resources: [], programs: [], people: [], research: [], lessons: [], ...changes });

test('adapter preserves geography, language and unknown facts without inventing values', () => {
  const raw = catalog({ resources: [resource({ title: '  Sample library learning support  ' })], programs: [program()] });
  const value = validateCatalog(raw);
  assert.equal(value.resources[0].title, 'Sample library learning support');
  assert.equal(value.resources[0].country, 'US');
  assert.equal(value.resources[0].subregion, 'South Carolina');
  assert.deepEqual(value.resources[0].languages, ['en', 'es']);
  for (const key of ['cost_basis', 'credential_cost_basis', 'last_checked_at', 'source_url', 'recheck_due_at']) assert.equal(value.resources[0][key], null);
  assert.equal(value.programs[0].confirmed_dates, null);
  assert.equal(value.programs[0].approved_capacity, null);
  assert.notEqual(value.resources[0], raw.resources[0]);
});

test('optional verification notes preserve source caveats without granting publication approval', () => {
  const verification_notes = [
    'Language availability has not been independently verified.',
    'Current availability must be confirmed with the provider.',
    'Source date is unspecified; no verification date is inferred.',
    'Source scope is limited to the listed service area.',
    'Link only; redistribution permission has not been established.',
  ];
  const raw = catalog({ resources: [resource({ synthetic: false, verification_notes })] });
  const value = validateCatalog(raw);
  assert.equal(CONTENT_CONTRACT_VERSION, '1.0.0');
  assert.deepEqual(value.resources[0].verification_notes, verification_notes);
  assert.notEqual(value.resources[0].verification_notes, verification_notes);
  assert.deepEqual(selectCatalog(value, 'development').resources[0].verification_notes, verification_notes);
  assert.equal(selectCatalog(value, 'production').resources.length, 0);
  assert.equal(value.resources[0].content_status, 'DRAFT');
  assert.ok(!Object.hasOwn(validateCatalog(catalog({ resources: [resource()] })).resources[0], 'verification_notes'));
  assert.deepEqual(validateCatalog(catalog({ resources: [resource({ verification_notes: [] })] })).resources[0].verification_notes, []);
});

test('verification notes reject malformed values and nested private objects before public selection', () => {
  for (const verification_notes of [
    null, 'PRIVATE_SENTINEL', [42], ['   '], [['PRIVATE_SENTINEL']], [{ private_feedback: 'PRIVATE_SENTINEL' }],
  ]) {
    const raw = catalog({ resources: [resource({ verification_notes })] });
    assert.throws(() => selectCatalog(raw, 'production'), (error) => {
      assert.match(error.message, /Invalid public content at resources\[0\]\.verification_notes/);
      assert.ok(!error.message.includes('PRIVATE_SENTINEL'));
      return true;
    });
  }
});

test('profile and research provenance preserves checked history without granting public consent or author approval', () => {
  const source = { source_notes: ['Founder-supplied draft title; public permission is held.'], source_version: 'draft-2', source_checked_at: '2026-10-01', source_url: 'https://example.invalid/source' };
  const raw = catalog({ people: [person({ ...source, synthetic: false })], research: [research({ ...source, synthetic: false })] });
  const output = selectCatalog(raw, 'development');
  for (const collection of ['people', 'research']) {
    assert.deepEqual(output[collection][0].source_notes, source.source_notes);
    assert.notEqual(output[collection][0].source_notes, source.source_notes);
    assert.equal(output[collection][0].source_version, 'draft-2');
    assert.equal(output[collection][0].source_checked_at, '2026-10-01');
    assert.equal(output[collection][0].source_url, source.source_url);
    assert.equal(selectCatalog(raw, 'production')[collection].length, 0);
  }
  assert.equal(output.people[0].consent_status, 'VERIFY_BEFORE_PUBLICATION');
  assert.equal(output.research[0].author_review_status, 'PENDING');
  assert.ok(!Object.hasOwn(validateCatalog(catalog({ people: [person()] })).people[0], 'source_notes'));
});

test('profile and research provenance rejects private objects, unsafe source links and inferred dates', () => {
  for (const factory of [person, research]) {
    for (const metadata of [
      { source_notes: [{ private_feedback: 'PRIVATE_SENTINEL' }] },
      { source_notes: null }, { source_notes: ['   '] }, { source_version: { private_notes: 'PRIVATE_SENTINEL' } },
      { source_url: 'javascript:PRIVATE_SENTINEL' }, { source_url: 'https://user:PRIVATE_SENTINEL@example.invalid' },
      { source_checked_at: '2026-02-29' }, { source_checked_at: '2026-10-15T12:00:00' },
      { private_source_control: 'PRIVATE_SENTINEL' },
    ]) {
      const key = factory === person ? 'people' : 'research';
      assert.throws(() => selectCatalog(catalog({ [key]: [factory(metadata)] }), 'production'), error => {
        assert.match(error.message, /Invalid public content/);
        assert.ok(!error.message.includes('PRIVATE_SENTINEL'));
        return true;
      });
    }
  }
});

test('unknown and private fields fail closed at every record depth, including drafts excluded from release', () => {
  const rejected = [
    catalog({ private_grades: [] }),
    catalog({ resources: [resource({ private_feedback: 'PRIVATE_SENTINEL' })] }),
    catalog({ people: [person({ email: 'PRIVATE_SENTINEL' })] }),
    catalog({ lessons: [lesson({ sections: [{ heading: 'Guide', body: 'Draft content', student_id: 'PRIVATE_SENTINEL' }] })] }),
    catalog({ research: [research({ authors: [{ name: 'Author', private_notes: 'PRIVATE_SENTINEL' }] })] }),
  ];
  for (const raw of rejected) {
    assert.throws(() => selectCatalog(raw, 'production'), (error) => {
      assert.match(error.message, /Invalid public content/);
      assert.ok(!error.message.includes('PRIVATE_SENTINEL'));
      return true;
    });
  }
});

test('all required fields and explicit enum states are enforced', () => {
  const missing = resource();
  delete missing.cost_basis;
  for (const value of [missing, resource({ synthetic: 'false' }), resource({ entity: 'OTHER' }), resource({ content_status: 'APPROVED' }), resource({ verification_status: 'LIVE' })]) {
    assert.throws(() => validateCatalog(catalog({ resources: [value] })), /Invalid public content/);
  }
  assert.throws(() => validateCatalog(catalog({ people: [person({ consent_status: 'ASSUMED' })] })), /unsupported state/);
  assert.throws(() => validateCatalog(catalog({ programs: [program({ free_to_participant: false })] })), /must be free/);
  assert.throws(() => validateCatalog(catalog({ resources: [resource({ id: 'unstable id' })] })), /stable identifier/);
});

test('duplicate stable IDs cannot conceal overlapping or overwritten records', () => {
  assert.throws(() => validateCatalog(catalog({ resources: [resource(), resource()] })), /duplicate stable identifier/);
  assert.throws(() => validateCatalog(catalog({ resources: [resource()], lessons: [lesson({ id: 'fixture-resource-us' })] })), /duplicate stable identifier/);
});

test('strict dates reject impossible, ambiguous and timezone-free values', () => {
  for (const last_checked_at of ['2026-02-29', '2026-04-31', '10/16/2026', '2026-10-16T12:00:00', '2026-10-16T24:01:00Z', '2026-10-16T12:00:00+25:00']) {
    assert.throws(() => validateCatalog(catalog({ resources: [resource({ last_checked_at })] })), /Invalid public content/);
  }
  for (const last_checked_at of ['2024-02-29', '2026-10-16T12:00:00-04:00', '2026-10-16T12:00:00.123Z']) {
    assert.equal(validateCatalog(catalog({ resources: [resource({ last_checked_at })] })).resources[0].last_checked_at, last_checked_at);
  }
});

test('unsafe URL schemes and embedded credentials are rejected', () => {
  for (const access_url of ['javascript:alert(1)', 'data:text/plain,private', 'https://user:password@example.test/path']) {
    assert.throws(() => validateCatalog(catalog({ resources: [resource({ access_url })] })), /HTTP\(S\) URL/);
  }
  assert.throws(() => validateCatalog(catalog({ programs: [program({ cta_url: '//example.test' })] })), /HTTP\(S\) URL/);
  assert.equal(validateCatalog(catalog({ programs: [program({ support_route: '/contact' })] })).programs[0].support_route, '/contact');
});

test('production selection separates publication approval, synthetic status, consent and author review', () => {
  // These are synthetic unit-test objects only; never written to the public dataset.
  const approved = { content_status: 'PUBLIC_RELEASE_APPROVED', synthetic: false };
  const raw = catalog({
    resources: [resource(), resource({ ...approved, id: 'approved-resource' }), resource({ ...approved, id: 'synthetic-resource', synthetic: true }), resource({ ...approved, id: 'withdrawn-resource', content_status: 'WITHDRAWN' })],
    programs: [program({ ...approved })],
    people: [person({ ...approved, id: 'no-consent' }), person({ ...approved, id: 'consented', consent_status: 'GRANTED' }), person({ ...approved, id: 'rights-denied', consent_status: 'GRANTED', image_rights_status: 'DENIED' })],
    research: [research({ ...approved, id: 'pending-author' }), research({ ...approved, id: 'reviewed-author', author_review_status: 'APPROVED' })],
    lessons: [lesson(), lesson({ ...approved, id: 'approved-lesson' })],
  });
  const output = selectCatalog(raw, 'production');
  assert.deepEqual(output.resources.map((item) => item.id), ['approved-resource']);
  assert.deepEqual(output.people.map((item) => item.id), ['consented']);
  assert.deepEqual(output.research.map((item) => item.id), ['reviewed-author']);
  assert.deepEqual(output.lessons.map((item) => item.id), ['approved-lesson']);
  assert.equal(output.programs.length, 1);
  assert.equal(selectCatalog(raw, 'development').resources.length, 3);
  assert.throws(() => selectCatalog(raw, 'preview'), /unsupported content mode/);
});

test('expired or unconfirmed enrollment cannot survive selection as open', () => {
  const raw = catalog({ programs: [program({ operating_status: 'OPEN_ENROLLMENT', cta_type: 'APPLY', cta_url: 'https://example.test/apply', approved_capacity: 10, confirmed_dates: ['2000-01-01'] })] });
  const output = selectCatalog(raw, 'development').programs[0];
  assert.equal(output.operating_status, 'CLOSED_ENROLLMENT');
  assert.equal(output.cta_type, 'INFORMATION_ONLY');
  assert.equal(output.cta_url, null);
  assert.equal(raw.programs[0].operating_status, 'OPEN_ENROLLMENT');
  const unconfirmed = selectCatalog(catalog({ programs: [program({ operating_status: 'OPEN_ENROLLMENT' })] }), 'development').programs[0];
  assert.equal(unconfirmed.operating_status, 'CLOSED_ENROLLMENT');
});

test('enrollment CTAs cannot activate a planning program, while confirmed open programs retain their route', () => {
  for (const cta_type of ['APPLY', 'APPLY_NOW', 'ENROLL', 'REGISTER', 'REGISTRATION']) {
    const planning = selectCatalog(catalog({ programs: [program({ cta_type, cta_url: 'https://example.test/apply' })] }), 'development').programs[0];
    assert.equal(planning.operating_status, 'PARTNER_PLANNING');
    assert.equal(planning.cta_type, 'INFORMATION_ONLY');
    assert.equal(planning.cta_url, null);
  }
  const open = selectCatalog(catalog({ programs: [program({ operating_status: 'OPEN_ENROLLMENT', cta_type: 'APPLY', cta_url: 'https://example.test/apply', approved_capacity: 2, confirmed_dates: ['9999-01-01'] })] }), 'development').programs[0];
  assert.equal(open.operating_status, 'OPEN_ENROLLMENT');
  assert.equal(open.cta_url, 'https://example.test/apply');
});

test('all nonapproved stages, withdrawn consent and every synthetic record class stay outside production', () => {
  for (const content_status of ['DRAFT', 'SOURCE_CHECKED', 'READY_FOR_REVIEW', 'WITHDRAWN']) {
    const result = selectCatalog(catalog({ resources: [resource({ content_status, synthetic: false })] }), 'production');
    assert.equal(result.resources.length, 0);
  }
  const content_status = 'PUBLIC_RELEASE_APPROVED';
  const result = selectCatalog(catalog({
    resources: [resource({ content_status })], programs: [program({ content_status })],
    people: [person({ content_status, consent_status: 'GRANTED' })], research: [research({ content_status, author_review_status: 'APPROVED' })],
    lessons: [lesson({ content_status })],
  }), 'production');
  assert.ok(Object.values(result).every((items) => items.length === 0));
  const withdrawn = catalog({ people: [person({ content_status, synthetic: false, consent_status: 'WITHDRAWN' })] });
  assert.equal(selectCatalog(withdrawn, 'production').people.length, 0);
  assert.equal(selectCatalog(withdrawn, 'development').people.length, 0);
});

test('overdue source checks become visibly uncertain without mutating imported history', () => {
  const value = resource({ verification_status: 'SOURCE_CHECKED', recheck_due_at: '2000-01-01', deadline_at: '9999-01-01', deadline_type: 'RECIPIENT' });
  assert.equal(resourceAvailability(value, '2026-10-16'), 'CHECK_PROVIDER');
  const selected = selectCatalog(catalog({ resources: [value] }), 'development').resources[0];
  assert.equal(selected.verification_status, 'NEEDS_RECHECK');
  assert.equal(value.verification_status, 'SOURCE_CHECKED');
  assert.equal(value.recheck_due_at, '2000-01-01');
});

test('recipient expiration, donor deadlines and unknown availability remain distinct', () => {
  const base = resource({ verification_status: 'SOURCE_CHECKED', deadline_at: '2026-10-18', deadline_type: 'RECIPIENT' });
  assert.equal(resourceAvailability(base, '2026-10-19'), 'EXPIRED');
  assert.equal(resourceAvailability(base, '2026-10-18T23:00:00Z'), 'RECIPIENT_DEADLINE_UPCOMING');
  assert.equal(resourceAvailability({ ...base, deadline_type: 'DONOR' }, '2026-10-16'), 'DONOR_DEADLINE');
  assert.equal(resourceAvailability(resource(), '2026-10-16'), 'CHECK_PROVIDER');
  assert.equal(resourceAvailability({ ...base, verification_status: 'SOURCE_UNAVAILABLE' }, '2026-10-16'), 'CHECK_PROVIDER');
  assert.equal(resourceAvailability({ ...base, content_status: 'WITHDRAWN' }, '2026-10-16'), 'WITHDRAWN');
  assert.throws(() => resourceAvailability(resource({ deadline_at: '2026-10-18' }), '2026-10-16'), /explicit recipient or donor/);
  assert.equal(resourceAvailability({ ...base, deadline_at: '2026-10-18T00:00:00-04:00' }, '2026-10-18T03:59:59Z'), 'RECIPIENT_DEADLINE_UPCOMING');
  assert.equal(resourceAvailability({ ...base, deadline_at: '2026-10-18T00:00:00-04:00' }, '2026-10-18T04:00:01Z'), 'EXPIRED');
});

test('filters combine real terms, region, country, topic and available translations', () => {
  const resources = [resource(), resource({ id: 'fixture-resource-canada', country: 'CA', subregion: 'Nova Scotia', languages: ['en', 'fr'] }), resource({ id: 'fixture-resource-other-state', subregion: 'West Virginia', topic: 'Career' })];
  assert.equal(filterResources(resources, { query: 'library local', topic: 'education', country: 'us', subregion: 'South Carolina', language: 'ES' }).length, 1);
  assert.deepEqual(filterResources(resources, { country: 'CA', language: 'fr' }).map((item) => item.id), ['fixture-resource-canada']);
  assert.equal(filterResources(resources, { language: 'pt' }).length, 0);
  assert.equal(filterResources(resources, { country: 'US', subregion: 'Nova Scotia' }).length, 0);
  assert.equal(filterResources(resources, { query: '  ' }).length, 3);
  assert.equal(filterResources(resources, { query: 'not-present' }).length, 0);
});
