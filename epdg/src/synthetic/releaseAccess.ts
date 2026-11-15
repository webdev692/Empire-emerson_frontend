export const portalRoles = ['founder_owner', 'organization_admin', 'hr_admin', 'technical_maintainer', 'program_coordinator', 'intern_team_lead', 'content_editor', 'sales_staff', 'global_outreach', 'restricted_viewer', 'participant'] as const;
export type PortalRole = typeof portalRoles[number];
export interface Assignment { id: string; role_code: PortalRole; revision: string; scope_type: string; scope_id: string; organization_id: number }
export const isRecord = (value: unknown): value is Record<string, unknown> => Boolean(value && typeof value === 'object' && !Array.isArray(value));
export const safeText = (value: unknown, max = 200): value is string => typeof value === 'string' && value.length > 0 && value.length <= max && ![...value].some(character => character.charCodeAt(0) < 32);
export const safeId = (value: unknown): value is string => typeof value === 'string' && /^[a-zA-Z0-9_-]{1,100}$/.test(value);
export const safeEmail = (value: unknown): value is string => typeof value === 'string' && value.length <= 150 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
export function permissionList(value: unknown): string[] | null {
  return Array.isArray(value) && value.length <= 100 && value.every(p => typeof p === 'string' && /^[a-z][a-z0-9_.]{1,79}$/.test(p)) ? [...new Set(value)] : null;
}
export function parseAssignments(value: unknown): Assignment[] | null {
  if (!Array.isArray(value) || value.length > 128) return null;
  const result: Assignment[] = [];
  for (const item of value) {
    if (!isRecord(item) || !safeId(item.id) || !portalRoles.includes(item.role_code as PortalRole) || typeof item.revision !== 'string' || !/^[1-9][0-9]{0,18}:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}:[1-9][0-9]{0,18}$/i.test(item.revision)
      || !safeId(item.scope_type) || !(safeId(item.scope_id) || Number.isSafeInteger(item.scope_id)) || !Number.isSafeInteger(item.organization_id) || Number(item.organization_id) < 1) return null;
    result.push({ id: item.id, role_code: item.role_code as PortalRole, revision: item.revision, scope_type: item.scope_type, scope_id: String(item.scope_id), organization_id: Number(item.organization_id) });
  }
  return result;
}

// Navigation is a presentation hint. Every resource and mutation is separately
// authorized by the server against current assignment revisions and scopes.
export function portalNavigation(permissions: readonly string[]) {
  return { workspace: permissions.some(p => ['resource.read', 'resource.edit', 'resource.review', 'technical.diagnostics', 'program.coordinate'].includes(p)),
    accounts: permissions.includes('admin.accounts.read'), profile: permissions.includes('account.self.read'), profileEdit: permissions.includes('account.self.update') };
}
export function safeReturnPath(path: string): string {
  return /^\/(dashboard|learning|reviews|resources|account|change-password|admin\/accounts|resources\/[a-zA-Z0-9_-]{1,100})$/.test(path) ? path : '/dashboard';
}
