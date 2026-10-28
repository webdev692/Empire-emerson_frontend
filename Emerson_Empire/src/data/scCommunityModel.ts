export type SCRecord = {
  id: string; title: string; kind: 'current' | 'archive' | 'county-routing';
  need: string; serviceArea: string; details: { label: string; value: string }[];
  warnings: string[]; notes: string[]; sourceUrls: string[]; linkNotes: string[];
  sourceCheckedOn: string | null; sourceCheckedRaw: string | null; sourceSha256: string; sourceParagraph: number;
};
export type SCDataset = {
  schemaVersion: string; sources: { filename: string; sha256: string; edition: string }[];
  records: SCRecord[]; countyRoutes: SCRecord[]; layoutNotes: { paragraph: number; text: string }[];
};
export type SCFilters = { query: string; need: string; area: string; edition: 'current' | 'archive' | 'all' };
export const initialSCFilters: SCFilters = { query: '', need: '', area: '', edition: 'current' };
const privateLinks = /https?:\/\/(?:[^/]+\.)?(?:drive\.google\.com|docs\.google\.com|mail\.google\.com|outlook\.live\.com)\//i;
export function publicSourceUrl(value: string) {
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) && url.hostname.includes('.') && !url.port && !url.username && !url.password && !privateLinks.test(value)
      && !/\s|%(?:0[0-9a-f]|1[0-9a-f]|7f)/i.test(value) && !/^[\d.]+$|:|\.(?:local|internal|localhost|invalid|test|example)$/.test(url.hostname)
      && ![...url.searchParams.keys()].some(key => /token|password|secret|signature|credential|auth|session|api[_-]?key/i.test(key));
  } catch { return false; }
}
export function validateSCDataset(value: unknown): SCDataset {
  const data = value as SCDataset;
  if (!data || data.schemaVersion !== '1.0.0' || !Array.isArray(data.records) || !Array.isArray(data.countyRoutes) || !Array.isArray(data.sources) || !data.sources.length) throw new Error('Invalid directory envelope');
  if (privateLinks.test(JSON.stringify(data))) throw new Error('Private source link');
  const ids = new Set<string>();
  for (const row of [...data.records, ...data.countyRoutes]) {
    if (!row || !/^SC-(?:R\d+|A\d+|ENERGY-[a-z-]+)$/.test(row.id) || ids.has(row.id)) throw new Error('Invalid or duplicate identity');
    ids.add(row.id);
    if (!['current', 'archive', 'county-routing'].includes(row.kind) || ![row.title, row.need, row.serviceArea].every(text => typeof text === 'string' && text.trim())) throw new Error('Incomplete identity');
    if ((row.kind === 'current' && !row.id.startsWith('SC-R')) || (row.kind === 'archive' && !row.id.startsWith('SC-A')) || (row.kind === 'county-routing' && !row.id.startsWith('SC-ENERGY-'))) throw new Error('Identity kind mismatch');
    if (data.records.includes(row) === (row.kind === 'county-routing')) throw new Error('Wrong collection');
    if (!Array.isArray(row.details) || !row.details.length || !row.details.every(field => typeof field.label === 'string' && !!field.label && typeof field.value === 'string' && !!field.value)) throw new Error('Missing source details');
    for (const key of ['warnings', 'notes', 'sourceUrls', 'linkNotes'] as const) if (!Array.isArray(row[key]) || !row[key].every(item => typeof item === 'string')) throw new Error('Invalid source fields');
    if (!row.sourceUrls.every(publicSourceUrl) || !/^[a-f0-9]{64}$/.test(row.sourceSha256) || !data.sources.some(source => source.sha256 === row.sourceSha256) || !Number.isInteger(row.sourceParagraph)) throw new Error('Invalid source provenance');
    if (row.sourceCheckedOn !== null && !/^\d{4}-\d{2}-\d{2}$/.test(row.sourceCheckedOn)) throw new Error('Invalid source check date');
    if (row.sourceCheckedRaw !== null && typeof row.sourceCheckedRaw !== 'string') throw new Error('Invalid raw source date');
  }
  return data;
}
export function scField(record: SCRecord, ...labels: string[]) {
  return record.details.find(field => labels.includes(field.label))?.value || 'Not supplied';
}
const normalize = (text: string) => text.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase();
export function filterSCRecords(records: SCRecord[], filters: SCFilters) {
  const words = normalize(filters.query).trim().split(/\s+/).filter(Boolean);
  return records.filter(row => (filters.edition === 'all' || row.kind === filters.edition)
    && (!filters.need || row.need === filters.need) && (!filters.area || row.serviceArea === filters.area)
    && words.every(word => normalize([row.id, row.title, row.need, row.serviceArea, ...row.details.map(field => field.value), ...row.warnings, ...row.notes].join(' ')).includes(word)));
}
