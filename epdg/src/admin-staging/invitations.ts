import { PortalApiError } from './client.ts';

export interface Invitation {
  id: string; user_id: number; name: string; email: string; role_code: string;
  status: 'pending' | 'accepted' | 'expired' | 'revoked';
  delivery_status: 'sending' | 'sent' | 'failed';
  email_confirmed_at: string | null; accepted_at: string | null; expires_at: string;
  last_successful_sign_in: string | null;
}
export interface InvitationReview {
  enabled: true; production_release_available: false; items: Invitation[];
  eligible_users: { id: number; name: string; email: string }[];
  roles: { code: string; name: string; invitable: boolean; reason: string | null }[];
}
const record = (value: unknown): value is Record<string, unknown> => Boolean(value && typeof value === 'object' && !Array.isArray(value));
const positiveId = (value: unknown): value is number => Number.isSafeInteger(value) && Number(value) > 0;
const text = (value: unknown): value is string => typeof value === 'string' && value.length > 0;
const syntheticEmail = (value: unknown): value is string => typeof value === 'string' && /^[^\s@]+@[^\s@]+\.invalid$/.test(value);
const date = (value: unknown): value is string => typeof value === 'string' && Number.isFinite(Date.parse(value));
const optionalDate = (value: unknown): value is string | null => value === null || date(value);
function invalid(): never { throw new PortalApiError(502, 'Invitation status could not be verified.'); }

export function parseInvitation(value: unknown): Invitation {
  if (!record(value) || !text(value.id) || !positiveId(value.user_id) || !text(value.name) || !syntheticEmail(value.email)
    || !text(value.role_code) || !['pending', 'accepted', 'expired', 'revoked'].includes(String(value.status))
    || !['sending', 'sent', 'failed'].includes(String(value.delivery_status)) || !date(value.expires_at)
    || !optionalDate(value.email_confirmed_at) || !optionalDate(value.accepted_at) || !optionalDate(value.last_successful_sign_in)
    || (value.status === 'accepted' && (!date(value.accepted_at) || !date(value.email_confirmed_at)))) invalid();
  return { id: value.id, user_id: value.user_id, name: value.name, email: value.email, role_code: value.role_code,
    status: value.status as Invitation['status'], delivery_status: value.delivery_status as Invitation['delivery_status'],
    email_confirmed_at: value.email_confirmed_at, accepted_at: value.accepted_at, expires_at: value.expires_at,
    last_successful_sign_in: value.last_successful_sign_in };
}
export function parseInvitationReview(value: unknown): InvitationReview {
  if (!record(value) || value.enabled !== true || value.production_release_available !== false || !Array.isArray(value.items)
    || !Array.isArray(value.eligible_users) || !Array.isArray(value.roles)) invalid();
  return { enabled: true, production_release_available: false, items: value.items.map(parseInvitation),
    eligible_users: value.eligible_users.map(user => {
      if (!record(user) || !positiveId(user.id) || !text(user.name) || !syntheticEmail(user.email)) invalid();
      return { id: user.id, name: user.name, email: user.email };
    }),
    roles: value.roles.map(role => {
      if (!record(role) || !text(role.code) || !text(role.name) || typeof role.invitable !== 'boolean'
        || !(role.reason === null || typeof role.reason === 'string')) invalid();
      return { code: role.code, name: role.name, invitable: role.invitable, reason: role.reason };
    }) };
}
