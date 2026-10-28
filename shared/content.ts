/** Version 1 public-content adapter. Keep private records outside this contract. */
export const CONTENT_CONTRACT_VERSION = '1.0.0';

export type Entity = 'TEE' | 'TEA' | 'EPDG';
export type ContentStatus = 'DRAFT' | 'SOURCE_CHECKED' | 'READY_FOR_REVIEW' | 'PUBLIC_RELEASE_APPROVED' | 'WITHDRAWN';
export type VerificationStatus = 'UNVERIFIED' | 'SOURCE_CHECKED' | 'NEEDS_RECHECK' | 'SOURCE_UNAVAILABLE';
export type ContentMode = 'development' | 'production';

export interface Resource {
  id: string;
  entity: Entity;
  title: string;
  provider: string;
  topic: string;
  country: string;
  subregion: string | null;
  languages: string[];
  audience: string;
  eligibility: string | null;
  access_url: string | null;
  cost_basis: string | null;
  credential_cost_basis: string | null;
  last_checked_at: string | null;
  source_url: string | null;
  verification_status: VerificationStatus;
  content_status: ContentStatus;
  synthetic: boolean;
  recheck_due_at: string | null;
  description?: string;
  verification_notes?: string[];
  deadline_at?: string | null;
  deadline_type?: 'RECIPIENT' | 'DONOR' | null;
}

export interface Program {
  id: string;
  operator: Entity;
  title: string;
  geography: string;
  audience: string;
  delivery_format: string;
  free_to_participant: boolean;
  operating_status: string;
  cta_type: string;
  cta_url: string | null;
  support_route: string | null;
  content_status: ContentStatus;
  approved_capacity: number | null;
  confirmed_dates: string[] | null;
  description?: string;
  synthetic?: boolean;
}

export interface SourceProvenance {
  source_notes?: string[];
  source_version?: string;
  source_checked_at?: string | null;
  source_url?: string | null;
}

export interface ResearchWork extends SourceProvenance {
  id: string;
  title: string;
  authors: string[];
  scholarly_status: string;
  version: string;
  canonical_url: string | null;
  doi: string | null;
  permitted_pdf_url: string | null;
  author_review_status: string;
  content_status: ContentStatus;
  synthetic?: boolean;
}

export interface PublicPerson extends SourceProvenance {
  id: string;
  name: string;
  title: string;
  bio: string | null;
  consent_status: 'VERIFY_BEFORE_PUBLICATION' | 'GRANTED' | 'DENIED' | 'WITHDRAWN';
  image_rights_status: 'NO_IMAGE_SUPPLIED' | 'VERIFIED' | 'PENDING' | 'DENIED' | 'WITHDRAWN';
  public_links: string[];
  content_status: ContentStatus;
  pronouns?: string;
  synthetic?: boolean;
}

export interface Lesson {
  id: string;
  entity: Entity;
  title: string;
  content_status: ContentStatus;
  synthetic: boolean;
  jurisdiction: string;
  sections: { heading: string; body: string }[];
}

export interface Catalog {
  resources: Resource[];
  programs: Program[];
  people: PublicPerson[];
  research: ResearchWork[];
  lessons: Lesson[];
}

type RawRecord = Record<string, unknown>;
const ENTITIES = ['TEE', 'TEA', 'EPDG'] as const;
const CONTENT_STATES = ['DRAFT', 'SOURCE_CHECKED', 'READY_FOR_REVIEW', 'PUBLIC_RELEASE_APPROVED', 'WITHDRAWN'] as const;
const VERIFICATION_STATES = ['UNVERIFIED', 'SOURCE_CHECKED', 'NEEDS_RECHECK', 'SOURCE_UNAVAILABLE'] as const;
const CONSENT_STATES = ['VERIFY_BEFORE_PUBLICATION', 'GRANTED', 'DENIED', 'WITHDRAWN'] as const;
const IMAGE_RIGHTS_STATES = ['NO_IMAGE_SUPPLIED', 'VERIFIED', 'PENDING', 'DENIED', 'WITHDRAWN'] as const;

/** Errors identify a field, never echo imported content or private values. */
function fail(path: string, reason: string): never {
  throw new Error(`Invalid public content at ${path}: ${reason}.`);
}

function record(raw: unknown, path: string, required: readonly string[], optional: readonly string[] = []): RawRecord {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) fail(path, 'expected an object');
  const prototype = Object.getPrototypeOf(raw);
  if (prototype !== Object.prototype && prototype !== null) fail(path, 'expected a plain object');
  const value = raw as RawRecord;
  const allowed = new Set([...required, ...optional]);
  // Fail closed before selecting fields; deleting unknown keys would hide a private import.
  for (const key of Reflect.ownKeys(value)) {
    if (typeof key !== 'string' || !allowed.has(key)) fail(path, 'unexpected field');
  }
  for (const key of required) {
    if (!Object.prototype.hasOwnProperty.call(value, key)) fail(`${path}.${key}`, 'required field missing');
  }
  return value;
}

function string(raw: unknown, path: string): string {
  if (typeof raw !== 'string' || !raw.trim() || raw.length > 30_000) fail(path, 'expected nonempty text');
  return raw.trim();
}

function nullableString(raw: unknown, path: string): string | null {
  return raw === null ? null : string(raw, path);
}

function bool(raw: unknown, path: string): boolean {
  if (typeof raw !== 'boolean') fail(path, 'expected a boolean');
  return raw;
}

function enumValue<T extends string>(raw: unknown, path: string, values: readonly T[]): T {
  if (typeof raw !== 'string' || !values.includes(raw as T)) fail(path, 'unsupported state');
  return raw as T;
}

function statusToken(raw: unknown, path: string): string {
  const value = string(raw, path);
  if (!/^[A-Z][A-Z0-9_]{0,95}$/.test(value)) fail(path, 'expected an explicit status token');
  return value;
}

function id(raw: unknown, path: string): string {
  const value = string(raw, path);
  if (!/^[A-Za-z0-9][A-Za-z0-9_-]{0,127}$/.test(value)) fail(path, 'expected a stable identifier');
  return value;
}

function list<T>(raw: unknown, path: string, convert: (value: unknown, path: string) => T): T[] {
  if (!Array.isArray(raw)) fail(path, 'expected an array');
  return raw.map((item, index) => convert(item, `${path}[${index}]`));
}

function strings(raw: unknown, path: string): string[] {
  const values = list(raw, path, string);
  if (new Set(values.map((value) => value.toLocaleLowerCase())).size !== values.length) fail(path, 'duplicate values');
  return values;
}

function date(raw: unknown, path: string): string {
  const value = string(raw, path);
  const match = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?(Z|[+-]\d{2}:\d{2}))?$/.exec(value);
  if (!match) fail(path, 'expected an ISO date or timestamp with timezone');
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const calendar = new Date(0);
  calendar.setUTCFullYear(year, month - 1, day);
  calendar.setUTCHours(0, 0, 0, 0);
  if (calendar.getUTCFullYear() !== year || calendar.getUTCMonth() !== month - 1 || calendar.getUTCDate() !== day) {
    fail(path, 'invalid calendar date');
  }
  if (match[4] && (Number(match[4]) > 23 || Number(match[5]) > 59 || Number(match[6]) > 59)) fail(path, 'invalid time');
  const offset = match[8];
  if (offset && offset !== 'Z' && (Number(offset.slice(1, 3)) > 23 || Number(offset.slice(4)) > 59)) fail(path, 'invalid timezone');
  if (!Number.isFinite(Date.parse(value))) fail(path, 'invalid date');
  return value;
}

function nullableDate(raw: unknown, path: string): string | null {
  return raw === null ? null : date(raw, path);
}

function url(raw: unknown, path: string, localAllowed = false): string {
  const value = string(raw, path);
  if (localAllowed && /^\/(?!\/)[A-Za-z0-9/_?&#=.%~-]*$/.test(value)) return value;
  let parsed: URL;
  try { parsed = new URL(value); } catch { return fail(path, 'expected an HTTP(S) URL'); }
  if (!['https:', 'http:'].includes(parsed.protocol) || parsed.username || parsed.password) fail(path, 'expected a credential-free HTTP(S) URL');
  return value;
}

function nullableUrl(raw: unknown, path: string, localAllowed = false): string | null {
  return raw === null ? null : url(raw, path, localAllowed);
}

function synthetic(value: RawRecord, path: string): { synthetic?: boolean } {
  return 'synthetic' in value ? { synthetic: bool(value.synthetic, `${path}.synthetic`) } : {};
}

function optionalText(value: RawRecord, field: string, path: string): Record<string, string> {
  return field in value ? { [field]: string(value[field], `${path}.${field}`) } : {};
}

const PROVENANCE_FIELDS = ['source_notes', 'source_version', 'source_checked_at', 'source_url'] as const;
function provenance(value: RawRecord, path: string): SourceProvenance {
  const result: SourceProvenance = {};
  if ('source_notes' in value) result.source_notes = list(value.source_notes, `${path}.source_notes`, string);
  if ('source_version' in value) result.source_version = string(value.source_version, `${path}.source_version`);
  if ('source_checked_at' in value) result.source_checked_at = nullableDate(value.source_checked_at, `${path}.source_checked_at`);
  if ('source_url' in value) result.source_url = nullableUrl(value.source_url, `${path}.source_url`);
  return result;
}

function resource(raw: unknown, path: string): Resource {
  const value = record(raw, path, [
    'id', 'entity', 'title', 'provider', 'topic', 'country', 'subregion', 'languages', 'audience', 'eligibility',
    'access_url', 'cost_basis', 'credential_cost_basis', 'last_checked_at', 'source_url', 'verification_status',
    'content_status', 'synthetic', 'recheck_due_at',
  ], ['description', 'verification_notes', 'deadline_at', 'deadline_type']);
  const result: Resource = {
    id: id(value.id, `${path}.id`), entity: enumValue(value.entity, `${path}.entity`, ENTITIES),
    title: string(value.title, `${path}.title`), provider: string(value.provider, `${path}.provider`),
    topic: string(value.topic, `${path}.topic`), country: string(value.country, `${path}.country`),
    subregion: nullableString(value.subregion, `${path}.subregion`), languages: strings(value.languages, `${path}.languages`),
    audience: string(value.audience, `${path}.audience`), eligibility: nullableString(value.eligibility, `${path}.eligibility`),
    access_url: nullableUrl(value.access_url, `${path}.access_url`), cost_basis: nullableString(value.cost_basis, `${path}.cost_basis`),
    credential_cost_basis: nullableString(value.credential_cost_basis, `${path}.credential_cost_basis`),
    last_checked_at: nullableDate(value.last_checked_at, `${path}.last_checked_at`), source_url: nullableUrl(value.source_url, `${path}.source_url`),
    verification_status: enumValue(value.verification_status, `${path}.verification_status`, VERIFICATION_STATES),
    content_status: enumValue(value.content_status, `${path}.content_status`, CONTENT_STATES), synthetic: bool(value.synthetic, `${path}.synthetic`),
    recheck_due_at: nullableDate(value.recheck_due_at, `${path}.recheck_due_at`), ...optionalText(value, 'description', path),
  };
  if ('verification_notes' in value) result.verification_notes = list(value.verification_notes, `${path}.verification_notes`, string);
  if ('deadline_at' in value) result.deadline_at = nullableDate(value.deadline_at, `${path}.deadline_at`);
  if ('deadline_type' in value) result.deadline_type = value.deadline_type === null ? null : enumValue(value.deadline_type, `${path}.deadline_type`, ['RECIPIENT', 'DONOR'] as const);
  if (result.deadline_at && !result.deadline_type) fail(`${path}.deadline_type`, 'a deadline needs an explicit recipient or donor meaning');
  return result;
}

function program(raw: unknown, path: string): Program {
  const value = record(raw, path, [
    'id', 'operator', 'title', 'geography', 'audience', 'delivery_format', 'free_to_participant', 'operating_status',
    'cta_type', 'cta_url', 'support_route', 'content_status', 'approved_capacity', 'confirmed_dates',
  ], ['description', 'synthetic']);
  const capacity = value.approved_capacity;
  if (capacity !== null && (typeof capacity !== 'number' || !Number.isSafeInteger(capacity) || capacity < 0)) fail(`${path}.approved_capacity`, 'expected a nonnegative integer or null');
  if (bool(value.free_to_participant, `${path}.free_to_participant`) !== true) fail(`${path}.free_to_participant`, 'Emerson programs must be free to participants');
  return {
    id: id(value.id, `${path}.id`), operator: enumValue(value.operator, `${path}.operator`, ENTITIES),
    title: string(value.title, `${path}.title`), geography: string(value.geography, `${path}.geography`),
    audience: string(value.audience, `${path}.audience`), delivery_format: string(value.delivery_format, `${path}.delivery_format`),
    free_to_participant: bool(value.free_to_participant, `${path}.free_to_participant`),
    operating_status: statusToken(value.operating_status, `${path}.operating_status`), cta_type: statusToken(value.cta_type, `${path}.cta_type`),
    cta_url: nullableUrl(value.cta_url, `${path}.cta_url`, true), support_route: nullableUrl(value.support_route, `${path}.support_route`, true),
    content_status: enumValue(value.content_status, `${path}.content_status`, CONTENT_STATES),
    approved_capacity: capacity as number | null,
    confirmed_dates: value.confirmed_dates === null ? null : list(value.confirmed_dates, `${path}.confirmed_dates`, date),
    ...optionalText(value, 'description', path), ...synthetic(value, path),
  };
}

function research(raw: unknown, path: string): ResearchWork {
  const value = record(raw, path, ['id', 'title', 'authors', 'scholarly_status', 'version', 'canonical_url', 'doi', 'permitted_pdf_url', 'author_review_status', 'content_status'], ['synthetic', ...PROVENANCE_FIELDS]);
  const doi = nullableString(value.doi, `${path}.doi`);
  if (doi !== null && !/^(?:https:\/\/doi\.org\/)?10\.\d{4,9}\/\S+$/i.test(doi)) fail(`${path}.doi`, 'expected a DOI identifier or canonical DOI URL');
  return {
    id: id(value.id, `${path}.id`), title: string(value.title, `${path}.title`), authors: strings(value.authors, `${path}.authors`),
    scholarly_status: string(value.scholarly_status, `${path}.scholarly_status`), version: string(value.version, `${path}.version`),
    canonical_url: nullableUrl(value.canonical_url, `${path}.canonical_url`), doi,
    permitted_pdf_url: nullableUrl(value.permitted_pdf_url, `${path}.permitted_pdf_url`),
    author_review_status: statusToken(value.author_review_status, `${path}.author_review_status`),
    content_status: enumValue(value.content_status, `${path}.content_status`, CONTENT_STATES), ...synthetic(value, path), ...provenance(value, path),
  };
}

function person(raw: unknown, path: string): PublicPerson {
  const value = record(raw, path, ['id', 'name', 'title', 'bio', 'consent_status', 'image_rights_status', 'public_links', 'content_status'], ['pronouns', 'synthetic', ...PROVENANCE_FIELDS]);
  return {
    id: id(value.id, `${path}.id`), name: string(value.name, `${path}.name`), title: string(value.title, `${path}.title`),
    bio: nullableString(value.bio, `${path}.bio`), consent_status: enumValue(value.consent_status, `${path}.consent_status`, CONSENT_STATES),
    image_rights_status: enumValue(value.image_rights_status, `${path}.image_rights_status`, IMAGE_RIGHTS_STATES),
    public_links: list(value.public_links, `${path}.public_links`, url),
    content_status: enumValue(value.content_status, `${path}.content_status`, CONTENT_STATES),
    ...optionalText(value, 'pronouns', path), ...synthetic(value, path), ...provenance(value, path),
  };
}

function lesson(raw: unknown, path: string): Lesson {
  const value = record(raw, path, ['id', 'entity', 'title', 'content_status', 'synthetic', 'jurisdiction', 'sections']);
  return {
    id: id(value.id, `${path}.id`), entity: enumValue(value.entity, `${path}.entity`, ENTITIES), title: string(value.title, `${path}.title`),
    content_status: enumValue(value.content_status, `${path}.content_status`, CONTENT_STATES), synthetic: bool(value.synthetic, `${path}.synthetic`),
    jurisdiction: string(value.jurisdiction, `${path}.jurisdiction`),
    sections: list(value.sections, `${path}.sections`, (rawSection, sectionPath) => {
      const section = record(rawSection, sectionPath, ['heading', 'body']);
      return { heading: string(section.heading, `${sectionPath}.heading`), body: string(section.body, `${sectionPath}.body`) };
    }),
  };
}

/** Validates every record before returning a new allowlisted object graph. */
export function validateCatalog(raw: unknown): Catalog {
  const value = record(raw, 'catalog', ['resources', 'programs', 'people', 'research', 'lessons']);
  const catalog: Catalog = {
    resources: list(value.resources, 'resources', resource), programs: list(value.programs, 'programs', program),
    people: list(value.people, 'people', person), research: list(value.research, 'research', research), lessons: list(value.lessons, 'lessons', lesson),
  };
  const ids = new Set<string>();
  for (const collection of Object.values(catalog)) {
    for (const item of collection) {
      if (ids.has(item.id)) fail('catalog', 'duplicate stable identifier');
      ids.add(item.id);
    }
  }
  return catalog;
}

function clockValue(today: Date | string): number {
  const value = today instanceof Date ? today.getTime() : Date.parse(date(today, 'today'));
  if (!Number.isFinite(value)) fail('today', 'invalid date');
  return value;
}

/** Date-only deadlines remain current through that complete UTC date. */
function deadlineValue(value: string): number {
  return Date.parse(value.length === 10 ? `${value}T23:59:59.999Z` : value);
}

export type ResourceAvailability = 'WITHDRAWN' | 'EXPIRED' | 'DONOR_DEADLINE' | 'CHECK_PROVIDER' | 'RECIPIENT_DEADLINE_UPCOMING';

export function resourceAvailability(item: Resource, today: Date | string = new Date()): ResourceAvailability {
  const value = resource(item, 'resource');
  const now = clockValue(today);
  if (value.content_status === 'WITHDRAWN') return 'WITHDRAWN';
  if (value.deadline_at && deadlineValue(value.deadline_at) < now) return 'EXPIRED';
  if (value.deadline_type === 'DONOR' && value.deadline_at) return 'DONOR_DEADLINE';
  if (value.recheck_due_at && deadlineValue(value.recheck_due_at) < now) return 'CHECK_PROVIDER';
  if (value.verification_status !== 'SOURCE_CHECKED') return 'CHECK_PROVIDER';
  if (value.deadline_type === 'RECIPIENT' && value.deadline_at) return 'RECIPIENT_DEADLINE_UPCOMING';
  return 'CHECK_PROVIDER';
}

function currentProgram(item: Program, now: number): Program {
  if (item.operating_status !== 'OPEN_ENROLLMENT') {
    // Planning and information approval do not authorize participant enrollment.
    if (/^(APPLY|ENROLL|REGISTER)(?:_NOW)?$|^REGISTRATION$/.test(item.cta_type)) {
      return { ...item, cta_type: 'INFORMATION_ONLY', cta_url: null };
    }
    return item;
  }
  const dates = item.confirmed_dates;
  if (!dates?.length || Math.max(...dates.map(deadlineValue)) < now || !item.cta_url || !item.approved_capacity) {
    return { ...item, operating_status: 'CLOSED_ENROLLMENT', cta_type: 'INFORMATION_ONLY', cta_url: null };
  }
  return item;
}

/** Approval, synthetic status and person consent are separate release gates. */
export function selectCatalog(raw: unknown, mode: ContentMode): Catalog {
  if (mode !== 'development' && mode !== 'production') fail('mode', 'unsupported content mode');
  const catalog = validateCatalog(raw); // Even excluded drafts must pass the privacy boundary.
  const now = Date.now();
  const allowed = (item: { content_status: ContentStatus; synthetic?: boolean }) =>
    item.content_status !== 'WITHDRAWN' && (mode === 'development' || (item.content_status === 'PUBLIC_RELEASE_APPROVED' && !item.synthetic));
  return {
    resources: catalog.resources.filter(allowed).map((item) => item.verification_status === 'SOURCE_CHECKED' && item.recheck_due_at && deadlineValue(item.recheck_due_at) < now
      ? { ...item, verification_status: 'NEEDS_RECHECK' as const }
      : item),
    programs: catalog.programs.filter(allowed).map((item) => currentProgram(item, now)),
    people: catalog.people.filter((item) => allowed(item) && item.consent_status !== 'WITHDRAWN' && (mode === 'development' || (item.consent_status === 'GRANTED' && ['NO_IMAGE_SUPPLIED', 'VERIFIED'].includes(item.image_rights_status)))),
    research: catalog.research.filter((item) => allowed(item) && (mode === 'development' || item.author_review_status === 'APPROVED')),
    lessons: catalog.lessons.filter(allowed),
  };
}

export interface ResourceFilters { query?: string; topic?: string; country?: string; subregion?: string; language?: string }
const searchable = (value: string) => value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();

export function filterResources(resources: Resource[], filters: ResourceFilters = {}): Resource[] {
  const matches = (value: string | null, filter: string | undefined) => !filter?.trim() || searchable(value ?? '') === searchable(filter);
  const terms = searchable(filters.query ?? '').split(/\s+/).filter(Boolean);
  return resources.filter((item) => {
    const text = searchable([item.title, item.provider, item.topic, item.country, item.subregion, item.audience, item.eligibility, item.description, ...item.languages].filter(Boolean).join(' '));
    return terms.every((term) => text.includes(term)) && matches(item.topic, filters.topic) && matches(item.country, filters.country)
      && matches(item.subregion, filters.subregion) && (!filters.language?.trim() || item.languages.some((language) => matches(language, filters.language)));
  });
}
