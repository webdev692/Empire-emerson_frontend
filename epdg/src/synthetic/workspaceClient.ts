import { API_ORIGIN, PortalRequestError } from './client.ts';
import { isRecord, safeId, safeText, safeEmail, parseAssignments, permissionList, type Assignment } from './releaseAccess.ts';
import { RELEASE_PORTAL } from './runtimeProfile.ts';
export interface WorkspaceResource { id: string; title: string; kind: string; organization_id: number; group_id: string | null; subject_user_id: number | null; can_edit: boolean; can_review: boolean; can_publish: boolean }
export interface Workspace { user: {id:number;name:string;email:string}; assignments: Assignment[]; permissions: string[]; resources: WorkspaceResource[]; organizations: {id:number;name:string}[] }
export interface ResourceDetail { id: string; title: string; kind: string; body: string; status: string; revision: number; can_edit: boolean; can_review: boolean; can_publish: boolean }
const invalid = (): never => { throw new PortalRequestError(502, 'Workspace data could not be verified.'); };
function resource(value: unknown): WorkspaceResource {
  if (!isRecord(value) || !safeId(value.id) || !safeText(value.title,160) || !safeId(value.kind) || !Number.isSafeInteger(value.organization_id) || Number(value.organization_id)<1 || !(value.group_id === null || safeId(value.group_id)) || !(value.subject_user_id === null || Number.isSafeInteger(value.subject_user_id) && Number(value.subject_user_id)>0) || typeof value.can_edit !== 'boolean' || typeof value.can_review !== 'boolean' || typeof value.can_publish !== 'boolean') return invalid();
  return { id:value.id, title:value.title, kind:value.kind, organization_id:Number(value.organization_id), group_id:value.group_id as string | null, subject_user_id:value.subject_user_id as number | null, can_edit:value.can_edit, can_review:value.can_review, can_publish:value.can_publish };
}
export function parseWorkspace(value: unknown, userId: number): Workspace {
  if (!isRecord(value) || value.environment !== 'portal-release-candidate' || !isRecord(value.user) || value.user.id !== userId || !safeText(value.user.name) || !safeEmail(value.user.email)) return invalid();
  const assignments = parseAssignments(value.assignments), permissions = permissionList(value.permissions);
  if (!assignments || !permissions || !Array.isArray(value.resources) || value.resources.length > 1000 || !Array.isArray(value.organizations)) return invalid();
  return { user: {id:userId, name:value.user.name, email:value.user.email}, assignments, permissions, resources:value.resources.map(resource), organizations:value.organizations.map(o => { if (!isRecord(o) || !Number.isSafeInteger(o.id) || Number(o.id)<1 || !safeText(o.name)) return invalid(); return {id:Number(o.id),name:o.name}; }) };
}
export function parseResource(value: unknown, id: string): ResourceDetail {
  if (!isRecord(value) || !isRecord(value.resource)) return invalid();
  const r = value.resource;
  const revision = typeof r.revision === 'string' && /^[1-9][0-9]*$/.test(r.revision) ? Number(r.revision) : r.revision;
  if (r.id !== id || !safeId(r.id) || !safeText(r.title) || !safeId(r.kind) || !safeId(r.status) || !Number.isSafeInteger(revision) || Number(revision) < 1 || typeof r.body !== 'string' || r.body.length > 100000 || typeof r.can_edit !== 'boolean' || typeof r.can_review !== 'boolean' || typeof r.can_publish !== 'boolean') return invalid();
  return { id:r.id, title:r.title, kind:r.kind, body:r.body, status:r.status, revision:Number(revision), can_edit:r.can_edit, can_review:r.can_review, can_publish:r.can_publish };
}
export function createWorkspaceClient(fetcher: typeof fetch = fetch) {
  async function request(path: string, csrf?: string, body?: object, method: 'PATCH' | 'POST' = 'PATCH') {
    if (!RELEASE_PORTAL || !/^\/(portal\/(workspace|resources\/[a-zA-Z0-9_-]{1,100}(?:\/(?:review|publish))?)|account\/self)$/.test(path)) throw new PortalRequestError(403,'This workspace is unavailable.');
    let response: Response;
    try { response = await fetcher(`${API_ORIGIN}/api${path}`, {method:body ? method:'GET', credentials:'include', cache:'no-store', redirect:'error',referrerPolicy:'no-referrer',signal:AbortSignal.timeout(15000), headers:body ? {'Content-Type':'application/json','X-EPDG-Request':'portal','X-CSRF-Token':csrf ?? ''} : {},...(body ? {body:JSON.stringify(body)} : {})}); }
    catch { throw new PortalRequestError(0,'The portal is unavailable. Please try again.'); }
    if (!response.ok) throw new PortalRequestError(response.status,response.status === 401 ? 'Your session has ended. Sign in again.' : response.status === 403 ? 'Access to this resource is unavailable.' : response.status === 409 ? 'This resource changed. Reload and review the current version before saving.' : 'The workspace request could not be completed.');
    let envelope: unknown; try { envelope=await response.json(); } catch { return invalid(); }
    if (!isRecord(envelope) || envelope.success !== true || !isRecord(envelope.data)) return invalid(); return envelope.data;
  }
  return {
    workspace: async (userId:number) => parseWorkspace(await request('/portal/workspace'),userId),
    resource: async (id:string) => parseResource(await request(`/portal/resources/${id}`),id),
    save: async (id:string,draft:string,revision:number,csrf:string) => { if(new TextEncoder().encode(draft).length>16384) throw new PortalRequestError(400,'Use a draft of at most 16,384 UTF-8 bytes.'); await request(`/portal/resources/${id}`,csrf,{draft,expected_revision:revision}); },
    review: async (id:string,comment:string,csrf:string) => { if(!comment.trim() || comment.length>4000) throw new PortalRequestError(400,'Use a review between 1 and 4,000 characters.'); await request(`/portal/resources/${id}/review`,csrf,{comment},'POST'); },
    publish: async (id:string,revision:number,csrf:string) => { await request(`/portal/resources/${id}/publish`,csrf,{expected_revision:revision},'POST'); },
    profile: async (name:string,csrf:string) => { const value=await request('/account/self',csrf,{name}); if (!Number.isSafeInteger(value.id)||!safeText(value.name)||!safeEmail(value.email)) return invalid(); return {id:Number(value.id),name:value.name,email:value.email}; },
  };
}
