/** EPDG's public directory contract. Raw workbook fields and private notes have no place in this model. */
export const INSTITUTION_SCHEMA_VERSION = '1.0.0' as const
export const MISSING_INSTITUTION_FIELDS = ['institutionType', 'city', 'region', 'country', 'officialUrl', 'sourceUrl', 'sourceCheckedAt'] as const
export const INSTITUTION_REVIEW_REASONS = ['source-check-missing', 'official-url-missing', 'source-url-missing', 'identity-incomplete', 'source-review-hold', 'identity-conflict', 'ambiguous-identity'] as const
export const SOURCE_VERIFICATION_STATUSES = ['needs-enrichment', 'founder-review-required', 'partially-verified', 'pass-one-review-required', 'government-contact-review-required', 'contact-review-required', 'website-contact-review-required'] as const
export type MissingInstitutionField = typeof MISSING_INSTITUTION_FIELDS[number]
export type InstitutionReviewReason = typeof INSTITUTION_REVIEW_REASONS[number]
export type PublicInstitutionContact = { kind: 'url' | 'email' | 'phone'; label: string; url: string; sourceUrl: string; audience: 'public' }
export type InstitutionRecord = {
  id: string
  name: string
  alternateNames: string[]
  institutionType: string | null
  city: string | null
  region: string | null
  country: string | null
  streetAddress: string | null
  postalCode: string | null
  campus: string | null
  program: string | null
  programInformation: string | null
  officialUrl: string | null
  sourceUrl: string | null
  sourceLabel: string
  sourceLocator: string
  sourceCheckedAt: string | null
  sourceVerificationStatus: typeof SOURCE_VERIFICATION_STATUSES[number] | null
  reviewStatus: 'needs-review' | 'source-checked'
  reviewReasons: InstitutionReviewReason[]
  missingFields: MissingInstitutionField[]
  publicContacts: PublicInstitutionContact[]
}
export type InstitutionAudit = { sourceRows: number; acceptedRows: number; duplicateRows: number; heldRows: number; externalRows: number }
export type DirectoryDataset = { schemaVersion: typeof INSTITUTION_SCHEMA_VERSION; importedAt: string; records: InstitutionRecord[]; audit: InstitutionAudit }
export type InstitutionFilter = { query?: string; type?: string; location?: string; country?: string; region?: string; review?: 'all' | 'needs-review' | 'source-checked' }

const RECORD_FIELDS = ['id', 'name', 'alternateNames', 'institutionType', 'city', 'region', 'country', 'streetAddress', 'postalCode', 'campus', 'program', 'programInformation', 'officialUrl', 'sourceUrl', 'sourceLabel', 'sourceLocator', 'sourceCheckedAt', 'sourceVerificationStatus', 'reviewStatus', 'reviewReasons', 'missingFields', 'publicContacts']
const AUDIT_FIELDS = ['sourceRows', 'acceptedRows', 'duplicateRows', 'heldRows', 'externalRows']
const textFields = ['name', 'institutionType', 'city', 'region', 'country', 'streetAddress', 'postalCode', 'campus', 'program', 'sourceLabel', 'sourceLocator'] as const
const nullableTextFields = ['institutionType', 'city', 'region', 'country', 'streetAddress', 'postalCode', 'campus', 'program'] as const
const blockedHostNames = ['drive.google.com', 'docs.google.com', 'mail.google.com', 'gmail.com', 'outlook.com', 'outlook.office.com', 'dropbox.com', '1drv.ms', 'onedrive.live.com', 'sharepoint.com', 'box.com', 'box.net']
const referenceHostNames = ['wikipedia.org', 'wikidata.org', '4icu.org', 'unirank.org', 'webometrics.info', 'facebook.com', 'linkedin.com', 'instagram.com', 'twitter.com', 'x.com', 'youtube.com', 'timeshighereducation.com', 'topuniversities.com', 'education.gov.au', 'studyinaustralia.gov.au']
const sensitiveQueryKey = /(token|access[_-]?token|api[_-]?key|key|secret|auth|session|sig|signature|password|email|user|code)/i
const emailText = /[\w.+-]+@[\w.-]+\.[a-z]{2,}/i

function fail(path: string): never { throw new Error(`Invalid EPDG institution data at ${path}.`) }
function exactObject(value: unknown, fields: readonly string[], path: string): asserts value is Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value) || ![Object.prototype, null].includes(Object.getPrototypeOf(value))
    || Reflect.ownKeys(value).some(key => typeof key !== 'string' || !fields.includes(key))
    || fields.some(key => !Object.hasOwn(value, key))) fail(path)
}
function safeText(value: unknown, path: string, maxLength = 300): asserts value is string {
  if (typeof value !== 'string' || !value.trim() || value !== value.trim() || value.length > maxLength
    || [...value].some(character => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127)
    || /[<>]|https?:|mailto:|[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(value)) fail(path)
}
/** Preserve explicit public HTTP(S) links; credentials, cloud documents, inboxes and sensitive queries are excluded. */
export function isPublicInstitutionUrl(value: unknown): value is string {
  if (typeof value !== 'string' || value.length > 2000 || value !== value.trim()) return false
  try {
    const url = new URL(value)
    const decoded = decodeURIComponent(value).toLowerCase()
    const fragment = decodeURIComponent(url.hash)
    return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password
      && !url.port && !blockedHostNames.some(host => decoded.includes(host)) && url.hostname.includes('.')
      && !/^[\d.]+$|:|\.(local|internal|test|invalid|localhost|example)$/i.test(url.hostname)
      && !/\s/.test(value)
      && ![...value].some(character => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127)
      && !/%(?:0[0-9a-f]|1[0-9a-f]|7f)/i.test(value)
      && !/(token|access[_-]?token|api[_-]?key|key|secret|auth|session|sig|signature|password|email|user|code)[^=&#?]*=/i.test(fragment)
      && !emailText.test(fragment)
      && [...url.searchParams].every(([key, content]) => !sensitiveQueryKey.test(key)
        && !emailText.test(content)
        && ![...content].some(character => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127))
  } catch { return false }
}
export function isOfficialInstitutionUrl(value: unknown): value is string {
  if (!isPublicInstitutionUrl(value)) return false
  const host = new URL(value).hostname.toLowerCase()
  return !referenceHostNames.some(reference => host === reference || host.endsWith(`.${reference}`))
}
const publicRoleEmails = new Set(['admissions', 'admission', 'info', 'enquiries', 'enquiry', 'inquiries', 'inquiry', 'contact', 'careers', 'career', 'careerservices', 'career.services', 'studentaffairs', 'student.affairs', 'students', 'financialaid', 'financial.aid', 'office', 'registrar'])
function sameInstitutionHost(host: string, officialHost: string): boolean {
  const normalized = officialHost.replace(/^www\./i, '').toLowerCase()
  return host.toLowerCase() === normalized || host.toLowerCase().endsWith(`.${normalized}`)
}
/** Public designation is explicit; named people and non-institutional mailboxes cannot pass this contract. */
export function isPublicInstitutionContact(contact: PublicInstitutionContact, officialUrl: string | null): boolean {
  if (contact.audience !== 'public' || !isPublicInstitutionUrl(contact.sourceUrl) || officialUrl === null || !isPublicInstitutionUrl(officialUrl)) return false
  const officialHost = new URL(officialUrl).hostname
  if (contact.kind === 'url') return isPublicInstitutionUrl(contact.url) && sameInstitutionHost(new URL(contact.url).hostname, officialHost)
  if (!sameInstitutionHost(new URL(contact.sourceUrl).hostname, officialHost)) return false
  if (contact.kind === 'phone') return contact.label === 'Telephone' && /^tel:\+?[1-9][0-9 ()-]{5,24}$/.test(contact.url)
  if (contact.kind !== 'email' || !['General enquiries', 'Admissions and student affairs', 'Career services', 'Financial aid'].includes(contact.label)) return false
  const match = /^mailto:([a-z.]+)@([a-z0-9.-]+)$/i.exec(contact.url)
  return !!match && publicRoleEmails.has(match[1].toLowerCase()) && sameInstitutionHost(match[2], officialHost)
}
function validDate(value: unknown): value is string {
  if (typeof value !== 'string') return false
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value
  return /^\d{4}-\d{2}-\d{2}T/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === value
}
function enumList<T extends string>(value: unknown, values: readonly T[], path: string): asserts value is T[] {
  if (!Array.isArray(value) || value.some(item => !values.includes(item)) || new Set(value).size !== value.length) fail(path)
}
export function missingInstitutionFields(record: Pick<InstitutionRecord, MissingInstitutionField>): MissingInstitutionField[] {
  return MISSING_INSTITUTION_FIELDS.filter(field => record[field] === null)
}
export function requiredInstitutionReviewReasons(record: Pick<InstitutionRecord, 'sourceCheckedAt' | 'sourceUrl' | 'officialUrl' | 'city' | 'region' | 'country'>): InstitutionReviewReason[] {
  return [
    ...(record.sourceCheckedAt === null ? ['source-check-missing' as const] : []),
    ...(record.officialUrl === null ? ['official-url-missing' as const] : []),
    ...(record.sourceUrl === null ? ['source-url-missing' as const] : []),
    ...(record.city === null && record.region === null && record.country === null ? ['identity-incomplete' as const] : []),
  ]
}
export function validateInstitutionRecord(raw: unknown, path = 'record'): InstitutionRecord {
  exactObject(raw, RECORD_FIELDS, path)
  if (typeof raw.id !== 'string' || !/^epdg-inst-[a-f0-9]{24}$/.test(raw.id)) fail(`${path}.id`)
  for (const field of textFields) {
    if (nullableTextFields.includes(field as typeof nullableTextFields[number]) && raw[field] === null) continue
    safeText(raw[field], `${path}.${field}`)
  }
  if (!Array.isArray(raw.alternateNames) || raw.alternateNames.length > 10) fail(`${path}.alternateNames`)
  for (const name of raw.alternateNames) safeText(name, `${path}.alternateNames`)
  if (new Set(raw.alternateNames.map(normalizeInstitutionIdentity)).size !== raw.alternateNames.length) fail(`${path}.alternateNames`)
  if (raw.programInformation !== null) safeText(raw.programInformation, `${path}.programInformation`, 2000)
  for (const field of ['officialUrl', 'sourceUrl'] as const) if (raw[field] !== null && !isPublicInstitutionUrl(raw[field])) fail(`${path}.${field}`)
  if (raw.officialUrl !== null && !isOfficialInstitutionUrl(raw.officialUrl)) fail(`${path}.officialUrl`)
  if (raw.sourceCheckedAt !== null && !validDate(raw.sourceCheckedAt)) fail(`${path}.sourceCheckedAt`)
  if (raw.sourceVerificationStatus !== null && !SOURCE_VERIFICATION_STATUSES.includes(raw.sourceVerificationStatus as typeof SOURCE_VERIFICATION_STATUSES[number])) fail(`${path}.sourceVerificationStatus`)
  enumList(raw.reviewReasons, INSTITUTION_REVIEW_REASONS, `${path}.reviewReasons`)
  enumList(raw.missingFields, MISSING_INSTITUTION_FIELDS, `${path}.missingFields`)
  const record = raw as InstitutionRecord
  const missing = missingInstitutionFields(record)
  if (missing.length !== record.missingFields.length || missing.some(field => !record.missingFields.includes(field))) fail(`${path}.missingFields`)
  if (requiredInstitutionReviewReasons(record).some(reason => !record.reviewReasons.includes(reason))) fail(`${path}.reviewReasons`)
  if (record.sourceVerificationStatus !== null && !record.reviewReasons.includes('source-review-hold')) fail(`${path}.sourceVerificationStatus`)
  if (!['needs-review', 'source-checked'].includes(record.reviewStatus)
    || (record.reviewStatus === 'source-checked' && (record.reviewReasons.length > 0 || record.sourceCheckedAt === null || record.sourceUrl === null))
    || (record.reviewStatus === 'needs-review' && record.reviewReasons.length === 0)) fail(`${path}.reviewStatus`)
  if (!Array.isArray(record.publicContacts) || record.publicContacts.length > 10) fail(`${path}.publicContacts`)
  for (const contact of record.publicContacts) {
    exactObject(contact, ['kind', 'label', 'url', 'sourceUrl', 'audience'], `${path}.publicContacts`)
    safeText(contact.label, `${path}.publicContacts.label`)
    if (!isPublicInstitutionContact(contact as PublicInstitutionContact, record.officialUrl)) fail(`${path}.publicContacts`)
  }
  return record
}
export function validateDirectoryDataset(raw: unknown): DirectoryDataset {
  exactObject(raw, ['schemaVersion', 'importedAt', 'records', 'audit'], 'dataset')
  if (raw.schemaVersion !== INSTITUTION_SCHEMA_VERSION || !validDate(raw.importedAt) || !Array.isArray(raw.records)) fail('dataset')
  const records = raw.records.map((record, index) => validateInstitutionRecord(record, `records[${index}]`))
  if (new Set(records.map(record => record.id)).size !== records.length) fail('records.duplicate-id')
  exactObject(raw.audit, AUDIT_FIELDS, 'audit')
  if (Object.values(raw.audit).some(value => !Number.isSafeInteger(value) || (value as number) < 0)) fail('audit')
  const audit = raw.audit as InstitutionAudit
  if (audit.sourceRows !== audit.acceptedRows + audit.duplicateRows + audit.heldRows + audit.externalRows) fail('audit.counts')
  return raw as DirectoryDataset
}
/** Exact normalization only. Distinct campuses, programs and locations remain distinct identities. */
export function normalizeInstitutionIdentity(value: string | null): string { return (value ?? '').normalize('NFKC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('en-US') }
export function institutionIdentity(record: Pick<InstitutionRecord, 'name' | 'campus' | 'program' | 'city' | 'region' | 'country'>): string {
  return JSON.stringify([record.name, record.campus, record.program, record.city, record.region, record.country].map(normalizeInstitutionIdentity))
}
export function locationLabel(record: Pick<InstitutionRecord, 'city' | 'region' | 'country'>): string { return [record.city, record.region, record.country].filter(Boolean).join(', ') || 'Location not supplied' }
function searchText(value: string): string { return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('en-US') }
export function filterInstitutions(records: readonly InstitutionRecord[], filter: InstitutionFilter = {}): InstitutionRecord[] {
  const query = searchText(filter.query?.trim() ?? '')
  return records.filter(record => (!query || searchText([record.name, ...record.alternateNames, record.institutionType, record.city, record.region, record.country, record.streetAddress, record.postalCode, record.campus, record.program, record.programInformation].filter(Boolean).join(' ')).includes(query))
    && (!filter.type || filter.type === 'all' || record.institutionType === filter.type)
    && (!filter.location || filter.location === 'all' || locationLabel(record) === filter.location)
    && (!filter.country || filter.country === 'all' || record.country === filter.country)
    && (!filter.region || filter.region === 'all' || record.region === filter.region)
    && (!filter.review || filter.review === 'all' || record.reviewStatus === filter.review))
}
export function getInstitutionFilters(records: readonly InstitutionRecord[]): { types: string[]; locations: string[]; countries: string[]; regions: string[] } {
  return {
    types: [...new Set(records.flatMap(record => record.institutionType === null ? [] : [record.institutionType]))].sort((a, b) => a.localeCompare(b)),
    locations: [...new Set(records.filter(record => record.city || record.region || record.country).map(locationLabel))].sort((a, b) => a.localeCompare(b)),
    countries: [...new Set(records.flatMap(record => record.country === null ? [] : [record.country]))].sort((a, b) => a.localeCompare(b)),
    regions: [...new Set(records.flatMap(record => record.region === null ? [] : [record.region]))].sort((a, b) => a.localeCompare(b)),
  }
}
