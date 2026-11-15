import { isRecord, safeId, safeText, safeEmail, permissionList, portalRoles, type PortalRole } from '../synthetic/releaseAccess.ts';
import { RELEASE_REVIEW } from '../synthetic/runtimeProfile.ts';

export interface RoleChoice { code: PortalRole; name: string; permissions: string[]; scope_types: string[] }
export interface RolePlan { role_code: PortalRole; scope_type: string; scope_id: string }
export interface AccountPlan { id: string; email: string; name: string; roles: RolePlan[]; revision: number; status: string; onboarding_status: string; conflict_code: string | null; existing_user_id: number | null; user_id: number | null; allowed_actions: string[] }
export interface ManagedAccount { id: number; name: string; email: string; active: boolean; roles: RolePlan[]; last_successful_sign_in: string | null; onboarding_status: string; allowed_actions: string[] }
export interface ManagedInvitation { id: string; user_id: number; name: string; email: string; status: string; delivery_status: string; expires_at: string | null; email_confirmed_at: string | null; accepted_at: string | null; activated_at: string | null; last_successful_sign_in: string | null; allowed_actions: string[] }
export interface AccountAudit { id: string; event: string; actor_user_id: number | null; target_user_id: number | null; plan_id: string | null; invitation_id: string | null; created_at: string }
export interface AccountManagementData { capabilities: string[]; roles: RoleChoice[]; organizations: { id: number; name: string }[]; plans: AccountPlan[]; accounts: ManagedAccount[]; invitations: ManagedInvitation[]; audit: AccountAudit[]; release: { enabled: boolean; delivery_enabled: boolean } }
const positive = (v: unknown): v is number => Number.isSafeInteger(v) && Number(v) > 0;
const nullableId = (v: unknown) => v === null || positive(v);
const date = (v: unknown): v is string | null => v === null || typeof v === 'string' && Number.isFinite(Date.parse(v));
const email = (v: unknown): v is string => safeEmail(v) && (!RELEASE_REVIEW || v.endsWith('.invalid'));
const invalid = (): never => { throw new Error('Account management data could not be verified.'); };
const actions = (v: unknown): string[] => Array.isArray(v) && v.length < 15 && v.every(safeId) ? [...v] : invalid();
function roles(v: unknown): RolePlan[] {
  if (!Array.isArray(v) || v.length > 16) return invalid();
  return v.map(r => {
    if (!isRecord(r) || !portalRoles.includes(r.role_code as PortalRole) || !safeId(r.scope_type) || !(safeId(r.scope_id) || positive(r.scope_id))) return invalid();
    return { role_code: r.role_code as PortalRole, scope_type: r.scope_type, scope_id: String(r.scope_id) };
  });
}
export function parseAccountManagement(value: unknown): AccountManagementData {
  if (!isRecord(value) || value.environment !== 'portal-release-candidate' || !isRecord(value.release) || typeof value.release.enabled !== 'boolean' || typeof value.release.delivery_enabled !== 'boolean') return invalid();
  const capabilities = permissionList(value.capabilities);
  if (!capabilities || !['roles','organizations','plans','accounts','invitations','audit'].every(k => Array.isArray(value[k]) && value[k].length <= 1000)) return invalid();
  const data = value as Record<string, unknown[]>;
  return {
    capabilities, release: { enabled: value.release.enabled, delivery_enabled: value.release.delivery_enabled },
    roles: data.roles.map(r => {
      if (!isRecord(r) || !portalRoles.includes(r.code as PortalRole) || !safeText(r.name) || !permissionList(r.permissions) || !Array.isArray(r.scope_types) || !r.scope_types.every(safeId)) return invalid();
      return { code: r.code as PortalRole, name: r.name, permissions: permissionList(r.permissions)!, scope_types: [...r.scope_types] as string[] };
    }),
    organizations: data.organizations.map(o => { if (!isRecord(o) || !positive(o.id) || !safeText(o.name)) return invalid(); return { id: o.id, name: o.name }; }),
    plans: data.plans.map(p => {
      if (!isRecord(p) || !safeId(p.id) || !safeText(p.name) || !email(p.email) || !positive(p.revision) || !['proposed','approved','provisioned','blocked'].includes(String(p.status))
        || !['required','verified','not_required'].includes(String(p.onboarding_status)) || !(p.conflict_code === null || safeId(p.conflict_code)) || !nullableId(p.existing_user_id) || !nullableId(p.user_id)) return invalid();
      return { id: p.id, name: p.name, email: p.email, roles: roles(p.roles), revision: p.revision, status: String(p.status), onboarding_status: String(p.onboarding_status), conflict_code: p.conflict_code as string | null, existing_user_id: p.existing_user_id as number | null, user_id: p.user_id as number | null, allowed_actions: actions(p.allowed_actions) };
    }),
    accounts: data.accounts.map(a => {
      if (!isRecord(a) || !positive(a.id) || !safeText(a.name) || !email(a.email) || typeof a.active !== 'boolean' || !date(a.last_successful_sign_in) || !['required','verified','not_required'].includes(String(a.onboarding_status))) return invalid();
      return { id: a.id, name: a.name, email: a.email, active: a.active, roles: roles(a.roles), last_successful_sign_in: a.last_successful_sign_in, onboarding_status: String(a.onboarding_status), allowed_actions: actions(a.allowed_actions) };
    }),
    invitations: data.invitations.map(i => {
      if (!isRecord(i) || !safeId(i.id) || !positive(i.user_id) || !safeText(i.name) || !email(i.email) || !['prepared','pending','accepted','expired','revoked'].includes(String(i.status))
        || !['not_sent','sending','provider_accepted','failed','unknown'].includes(String(i.delivery_status)) || !date(i.expires_at) || !date(i.email_confirmed_at) || !date(i.accepted_at) || !date(i.activated_at) || !date(i.last_successful_sign_in)
        || i.status === 'accepted' && (!i.email_confirmed_at || !i.accepted_at || !i.activated_at)) return invalid();
      return { id: i.id, user_id: i.user_id, name: i.name, email: i.email, status: String(i.status), delivery_status: String(i.delivery_status), expires_at: i.expires_at, email_confirmed_at: i.email_confirmed_at, accepted_at: i.accepted_at, activated_at: i.activated_at, last_successful_sign_in: i.last_successful_sign_in, allowed_actions: actions(i.allowed_actions) };
    }),
    audit: data.audit.map(a => {
      if (!isRecord(a) || !(safeId(a.id) || positive(a.id)) || !safeText(a.event,100) || !nullableId(a.actor_user_id) || !nullableId(a.target_user_id) || !(a.plan_id === null || safeId(a.plan_id)) || !(a.invitation_id === null || safeId(a.invitation_id)) || !date(a.created_at) || !a.created_at) return invalid();
      return { id: String(a.id), event: a.event, actor_user_id: a.actor_user_id as number | null, target_user_id: a.target_user_id as number | null, plan_id: a.plan_id as string | null, invitation_id: a.invitation_id as string | null, created_at: a.created_at };
    }),
  };
}
export const actionPermission: Record<string,string> = { verify_onboarding: 'admin.accounts.prepare', approve: 'admin.accounts.approve', provision: 'admin.accounts.prepare', prepare_invitation: 'admin.accounts.prepare', send: 'admin.accounts.send', resend: 'admin.accounts.send', disable: 'admin.accounts.disable' };
export function canAccountAction(data: AccountManagementData, allowed: string[], action: string): boolean {
  return data.release.enabled && allowed.includes(action) && Boolean(actionPermission[action]) && data.capabilities.includes(actionPermission[action]) && (!['send','resend'].includes(action) || data.release.delivery_enabled);
}
export const deliveryLabel = (value: string) => ({ not_sent: 'Prepared · not sent', sending: 'Transport in progress', provider_accepted: 'Provider accepted · delivery unconfirmed', failed: 'Transport failed', unknown: 'Transport outcome unknown' })[value] ?? 'Unverified';
