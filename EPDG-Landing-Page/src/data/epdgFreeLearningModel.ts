/** EPDG-only learning metadata. Public course information only; no learner/account data. */
export const FREE_LEARNING_SCHEMA = '1.0.0' as const;
export const PROVIDER_NAMES = {
  fema_ndemu: 'FEMA / NDEMU', fdic_money_smart: 'FDIC Money Smart', cdc_train: 'CDC TRAIN',
  sba_learning: 'SBA Learning', microsoft_learn: 'Microsoft Learn', google_skillshop: 'Google Skillshop',
  cisa_learning: 'CISA', nih_library: 'NIH Library', unssc: 'UNSSC',
} as const;
export const CREDENTIAL_LABELS = ['Free Certificate', 'Free CE/CEU', 'Free Training / No Credential', 'Free Training / Credential Varies', 'Training Free / Professional Exam Costs Extra', 'Restricted Eligibility — Free for Eligible Learners'] as const;
export type ProviderId = keyof typeof PROVIDER_NAMES;
export type CostStatus = 'verified-free' | 'unverified';
export type Availability = 'active' | 'upcoming' | 'expired' | 'unknown';
export interface LearningResource {
  id: string; providerId: ProviderId; provider: string; externalId: string | null; title: string;
  program: string | null; category: string; subjects: string[]; resourceType: string;
  description: string | null; costUsd: 0 | null; costStatus: CostStatus;
  credentialLabel: typeof CREDENTIAL_LABELS[number] | null; credentialVerified: boolean;
  credentialDetails: string | null; ceu: number | null; ceDetails: string | null; hasCe: boolean | null;
  duration: string | null; durationMinutes: number | null; delivery: string | null; selfPaced: boolean | null;
  eligibility: string; restricted: boolean; language: string; url: string;
  linkScope: 'resource' | 'program' | 'catalog'; sourceUrls: string[]; verifiedOn: string | null;
  packageVerifiedOn: string | null; availability: Availability; enrollmentDeadline: string | null;
  publishedAt: string | null; sourceUpdatedAt: string | null; accessNotes: string[];
  prerequisites: string | null; parentId: string | null;
  externalDeliveryUrl: string | null; courseCode: string | null; skillLevel: string | null; episodes: string | null;
  expirationDate: string | null; startDate: string | null; endDate: string | null; registrationOpensDate: string | null;
  ceStartDate: string | null; ceEndDate: string | null; enrollmentStatus: string | null;
  relatedResources: { title: string; url: string; type: string }[];
}
export interface ProviderCoverage {
  id: ProviderId; name: string; catalogUrl: string; checkedOn: string; status: 'complete' | 'partial' | 'blocked';
  summary: string; sourceCount: number | null; sourceUrls: string[];
}
export interface FreeLearningDataset { schemaVersion: typeof FREE_LEARNING_SCHEMA; importedAt: string; records: LearningResource[]; providers: ProviderCoverage[] }
export interface LearningFilters {
  query: string; provider: string; category: string; credential: string; ce: string;
  eligibility: string; language: string; duration: string; selfPaced: string; availability: string;
}
export const DEFAULT_LEARNING_FILTERS: LearningFilters = { query: '', provider: '', category: '', credential: '', ce: '', eligibility: 'public', language: '', duration: '', selfPaced: '', availability: 'active' };
const fields = ['id','providerId','provider','externalId','title','program','category','subjects','resourceType','description','costUsd','costStatus','credentialLabel','credentialVerified','credentialDetails','ceu','ceDetails','hasCe','duration','durationMinutes','delivery','selfPaced','eligibility','restricted','language','url','linkScope','sourceUrls','verifiedOn','packageVerifiedOn','availability','enrollmentDeadline','publishedAt','sourceUpdatedAt','accessNotes','prerequisites','parentId','relatedResources','externalDeliveryUrl','courseCode','skillLevel','episodes','expirationDate','startDate','endDate','registrationOpensDate','ceStartDate','ceEndDate','enrollmentStatus'];
const sourceHosts: Record<ProviderId, string[]> = {
  fema_ndemu:['fema.gov'], fdic_money_smart:['fdic.gov'], cdc_train:['train.org','cdc.gov'], sba_learning:['sba.gov'],
  microsoft_learn:['learn.microsoft.com'], google_skillshop:['withgoogle.com','google.com','docebosaas.com','exceedlms.com','grow.google'],
  cisa_learning:['cisa.gov','usalearning.gov','fema.gov'], nih_library:['nihlibrary.nih.gov'], unssc:['unssc.org'],
};
function fail(field: string): never { throw new Error(`Invalid EPDG learning metadata: ${field}.`); }
function exact(raw: unknown, allowed: string[], path: string): asserts raw is Record<string, unknown> {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw) || ![Object.prototype, null].includes(Object.getPrototypeOf(raw)) || Reflect.ownKeys(raw).some(k=>typeof k!=='string'||!allowed.includes(k)) || allowed.some(k=>!Object.hasOwn(raw,k))) fail(path);
}
function text(value: unknown, path: string, nullable = false, max = 5000): void {
  if (nullable && value === null) return;
  if (typeof value !== 'string' || !value.trim() || value !== value.trim() || value.length > max || [...value].some(c=>{const n=c.charCodeAt(0);return n<32&&![9,10,13].includes(n)||n===127;}) || /[\w.+-]+@[\w.-]+\.[a-z]{2,}|(?:drive|docs)\.google\.com/i.test(value)) fail(path);
}
export function publicLearningUrl(value: unknown): value is string {
  if (typeof value !== 'string' || value.trim() !== value || value.length > 2500 || /\s|%(?:0[0-9a-f]|1[0-9a-f]|7f)/i.test(value)) return false;
  try {
    const u = new URL(value);
    return ['https:','http:'].includes(u.protocol) && !u.username && !u.password && !u.port && u.hostname.includes('.')
      && !/^[\d.]+$|:|\.(?:local|internal|localhost|invalid|test|example)$/.test(u.hostname)
      && !/(?:drive\.google|docs\.google|dropbox|sharepoint|onedrive|mail\.google|outlook)\./i.test(decodeURIComponent(value))
      && !/[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(decodeURIComponent(value))
      && [...u.searchParams].every(([key])=>!/(?:token|secret|password|auth|session|signature|api[_-]?key)/i.test(key));
  } catch { return false; }
}
export function officialLearningSource(value: unknown, provider: ProviderId): value is string {
  if (!publicLearningUrl(value)) return false;
  const host = new URL(value).hostname.toLowerCase();
  return sourceHosts[provider].some(s=>host===s||host.endsWith(`.${s}`));
}
export function officialLearningTarget(value: unknown,provider:ProviderId): value is string {
  if(officialLearningSource(value,provider))return true;
  if(!publicLearningUrl(value))return false;
  const host=new URL(value).hostname.toLowerCase();
  return provider==='nih_library'&&['youtube.com','www.youtube.com','youtu.be'].includes(host);
}
function date(value: unknown, path: string, nullable = true): void {
  if (nullable && value === null) return;
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(Date.parse(value)) || new Date(value).toISOString().slice(0,10)!==value) fail(path);
}
export function validateLearningResource(raw: unknown): LearningResource {
  exact(raw,fields,'record');
  if (typeof raw.id!=='string'||!/^epdg-free-[a-f0-9]{24}$/.test(raw.id)||typeof raw.providerId!=='string'||!Object.hasOwn(PROVIDER_NAMES,raw.providerId)) fail('identity');
  const r = raw as unknown as LearningResource;
  for (const key of ['provider','title','category','resourceType','eligibility','language'] as const) text(r[key],key);
  for (const key of ['externalId','program','description','credentialDetails','ceDetails','duration','delivery','prerequisites','parentId','sourceUpdatedAt','courseCode','skillLevel','episodes','enrollmentStatus'] as const) text(r[key],key,true);
  for (const key of ['restricted','credentialVerified'] as const) if (typeof r[key]!=='boolean') fail(key);
  for (const key of ['selfPaced','hasCe'] as const) if (r[key]!==null&&typeof r[key]!=='boolean') fail(key);
  if (!['verified-free','unverified'].includes(r.costStatus)||![0,null].includes(r.costUsd)||(r.costStatus==='verified-free'&&r.costUsd!==0)) fail('cost');
  if (r.credentialLabel!==null&&!CREDENTIAL_LABELS.includes(r.credentialLabel)) fail('credentialLabel');
  if (['Free Certificate','Free CE/CEU'].includes(r.credentialLabel??'')&&!r.credentialVerified) fail('unverified-credential');
  if (r.credentialVerified&&r.costStatus!=='verified-free') fail('credential-cost');
  for (const key of ['ceu','durationMinutes'] as const) { const value=r[key]; if (value!==null&&(!Number.isFinite(value)||value<0)) fail(key); }
  if (!officialLearningTarget(r.url,r.providerId)||!['resource','program','catalog'].includes(r.linkScope)) fail('url');
  if(r.externalDeliveryUrl!==null&&!publicLearningUrl(r.externalDeliveryUrl))fail('external-delivery-url');
  for (const key of ['subjects','accessNotes','sourceUrls'] as const) {
    if (!Array.isArray(r[key])||new Set(r[key]).size!==r[key].length) fail(key);
    for (const value of r[key]) text(value,key);
  }
  if (!r.sourceUrls.length||r.sourceUrls.some(u=>!officialLearningSource(u,r.providerId))) fail('official-source');
  for (const key of ['verifiedOn','packageVerifiedOn','enrollmentDeadline','publishedAt','expirationDate','startDate','endDate','registrationOpensDate','ceStartDate','ceEndDate'] as const) date(r[key],key);
  if (r.costStatus==='verified-free'&&r.verifiedOn===null) fail('free-without-current-source-check');
  if (!['active','upcoming','expired','unknown'].includes(r.availability)) fail('availability');
  if (!Array.isArray(r.relatedResources)) fail('relatedResources');
  for (const related of r.relatedResources) { exact(related,['title','url','type'],'relatedResource'); text(related.title,'related-title'); text(related.type,'related-type'); if(!publicLearningUrl(related.url)) fail('related-url'); }
  return r;
}
export function validateFreeLearningDataset(raw: unknown): FreeLearningDataset {
  exact(raw,['schemaVersion','importedAt','records','providers'],'dataset');
  if (raw.schemaVersion!==FREE_LEARNING_SCHEMA||typeof raw.importedAt!=='string'||!Number.isFinite(Date.parse(raw.importedAt))||!Array.isArray(raw.records)||!Array.isArray(raw.providers)) fail('dataset');
  const records=raw.records.map(validateLearningResource);
  if (new Set(records.map(r=>r.id)).size!==records.length) fail('duplicate-id');
  if (new Set(records.map(learningIdentity)).size!==records.length) fail('duplicate-resource');
  const direct=records.filter(r=>r.linkScope==='resource').map(r=>JSON.stringify([r.providerId,canonicalLearningUrl(r.url),r.providerId==='unssc'?r.language.toLowerCase():'']));
  if(new Set(direct).size!==direct.length)fail('duplicate-canonical-resource');
  const seen=new Set();
  for (const item of raw.providers) {
    exact(item,['id','name','catalogUrl','checkedOn','status','summary','sourceCount','sourceUrls'],'provider');
    if(typeof item.id!=='string'||!Object.hasOwn(PROVIDER_NAMES,item.id)||seen.has(item.id))fail('provider-id');
    seen.add(item.id); text(item.name,'provider-name');text(item.summary,'provider-summary');date(item.checkedOn,'provider-date',false);
    if(!officialLearningSource(item.catalogUrl,item.id as ProviderId)||!['complete','partial','blocked'].includes(String(item.status))||!(item.sourceCount===null||(Number.isSafeInteger(item.sourceCount)&&Number(item.sourceCount)>=0))||!Array.isArray(item.sourceUrls)||item.sourceUrls.some(u=>!officialLearningSource(u,item.id as ProviderId)))fail('provider');
  }
  return raw as unknown as FreeLearningDataset;
}
export function canonicalLearningUrl(value: string): string {
  const u=new URL(value);u.hash='';u.hostname=u.hostname.toLowerCase();
  for(const key of [...u.searchParams.keys()]) if(/^utm_|^(?:source|ref|trackingId)$/i.test(key))u.searchParams.delete(key);
  u.searchParams.sort();u.pathname=u.pathname.replace(/\/$/,'')||'/';return u.toString();
}
/** Provider IDs identify actual source units. Program links can legitimately have distinct supplied child IDs. */
export function learningIdentity(r: Pick<LearningResource,'providerId'|'externalId'|'url'|'linkScope'|'language'>): string {
  const key=r.providerId==='unssc'&&r.linkScope==='resource'?canonicalLearningUrl(r.url):r.externalId?.normalize('NFKC').trim().toLowerCase()||canonicalLearningUrl(r.url);
  return JSON.stringify([r.providerId,key,r.providerId==='unssc'?r.language.toLowerCase():'']);
}
export function effectiveAvailability(r: LearningResource,today=new Date().toISOString().slice(0,10)): Availability { return [r.enrollmentDeadline,r.expirationDate,...(r.selfPaced===false?[r.endDate]:[])].some(date=>date!==null&&date<today)?'expired':r.availability; }
export function filterLearningResources(records: readonly LearningResource[],f: LearningFilters,today?:string): LearningResource[] {
  const q=f.query.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
  return records.filter(r=>{
    if(r.costStatus!=='verified-free'||r.costUsd!==0)return false;
    if(f.eligibility==='public'&&r.restricted||f.eligibility==='restricted'&&!r.restricted)return false;
    const status=effectiveAvailability(r,today);
    if(f.availability==='active'&&status!=='active'||f.availability==='archived'&&status!=='expired')return false;
    if(f.provider&&r.providerId!==f.provider||f.category&&r.category!==f.category||f.credential&&r.credentialLabel!==f.credential||f.language&&r.language!==f.language)return false;
    if(f.ce==='yes'&&r.hasCe!==true||f.ce==='no'&&r.hasCe!==false||f.ce==='unknown'&&r.hasCe!==null)return false;
    if(f.selfPaced==='yes'&&r.selfPaced!==true||f.selfPaced==='no'&&r.selfPaced!==false||f.selfPaced==='unknown'&&r.selfPaced!==null)return false;
    if(f.duration==='under60'&&(r.durationMinutes===null||r.durationMinutes>=60)||f.duration==='60to240'&&(r.durationMinutes===null||r.durationMinutes<60||r.durationMinutes>240)||f.duration==='over240'&&(r.durationMinutes===null||r.durationMinutes<=240)||f.duration==='unknown'&&r.durationMinutes!==null)return false;
    return !q||[r.title,r.provider,PROVIDER_NAMES[r.providerId],r.externalId,r.courseCode,r.program,r.category,...r.subjects,r.description].filter(Boolean).join(' ').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().includes(q);
  });
}
