import { HOSTED_PRACTICE, PRACTICE_API_ORIGIN, PRACTICE_ENVIRONMENT } from './runtimeProfile.ts';
export const API_ORIGIN = PRACTICE_API_ORIGIN;
export const PORTAL_ORIGIN = 'http://127.0.0.1:58080';

export interface LoginAlias { loginEmail: string; fixtureEmail: string }
declare const __EPDG_SYNTHETIC_LOGIN_ALIAS__: LoginAlias | null;
export const loginAlias: LoginAlias | null = HOSTED_PRACTICE ? null : typeof __EPDG_SYNTHETIC_LOGIN_ALIAS__ === 'undefined' ? null : __EPDG_SYNTHETIC_LOGIN_ALIAS__;
export function resolveLoginEmail(email: string, alias: LoginAlias | null = loginAlias): string | null {
  const normalized = email.trim().toLowerCase();
  // The hosted server resolves its approved login alias; the browser never learns a fixture mapping.
  if (HOSTED_PRACTICE) return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) && normalized.length <= 150 ? normalized : null;
  if (/^[^\s@]+@[^\s@]+\.invalid$/.test(normalized)) return normalized;
  // Exact local alias only; it cannot select a role, new identity or different institution.
  if (alias?.fixtureEmail === 'learner-a@epdg.invalid' && normalized === alias.loginEmail) return alias.fixtureEmail;
  return null;
}

export interface Membership { id: string; school_id: number | null; company_id: number | null }
export interface Session {
  user: { id: number; name: string; email: string; legacy_role: string; memberships: Membership[];
    permissions: never[]; privileged_controls_available: false };
  expires_at: string;
  csrf_token: string;
}
export class PortalRequestError extends Error {
  status: number;
  constructor(status: number, message: string) { super(message); this.status = status; }
}
const record = (value: unknown): value is Record<string, unknown> => Boolean(value && typeof value === 'object' && !Array.isArray(value));
const positiveId = (value: unknown) => Number.isSafeInteger(value) && Number(value) > 0;

export function parseSession(value: unknown): Session {
  if (!record(value) || value.success !== true || !record(value.user)
    || (HOSTED_PRACTICE ? value.environment !== PRACTICE_ENVIRONMENT : value.environment !== undefined && value.environment !== PRACTICE_ENVIRONMENT)) throw new PortalRequestError(502, 'Account access could not be verified.');
  const user = value.user;
  if (!positiveId(user.id) || typeof user.name !== 'string' || typeof user.email !== 'string' || !user.email.endsWith('.invalid') ||
      typeof user.legacy_role !== 'string' || !Array.isArray(user.memberships) || user.memberships.length < 1 || user.memberships.length > 64 ||
      !user.memberships.every(m => record(m) && typeof m.id === 'string' && m.id.length > 0 &&
        ((positiveId(m.school_id) && m.company_id === null) || (positiveId(m.company_id) && m.school_id === null))) ||
      !Array.isArray(user.permissions) || user.permissions.length !== 0 || user.privileged_controls_available !== false ||
      typeof value.expires_at !== 'string' || !Number.isFinite(Date.parse(value.expires_at)) ||
      typeof value.csrf_token !== 'string' || !/^[A-Za-z0-9_-]{43}$/.test(value.csrf_token)) {
    throw new PortalRequestError(502, 'Account access could not be verified.');
  }
  // Select only the documented self-account fields; never retain arbitrary response data.
  return { user: { id: user.id as number, name: user.name, email: user.email, legacy_role: user.legacy_role,
    memberships: user.memberships.map(m => ({ id: m.id, school_id: m.school_id, company_id: m.company_id })),
    permissions: [], privileged_controls_available: false }, expires_at: value.expires_at, csrf_token: value.csrf_token };
}

export function captureRecovery(location: Pick<Location, 'pathname' | 'hash'>): string | null {
  if (location.pathname !== '/reset-password') return null;
  const match = /^#token=([A-Za-z0-9_-]{43})$/.exec(location.hash);
  return match?.[1] ?? null;
}
export function passwordProblem(password: string): string | null {
  if (password.length < 12) return 'Use at least 12 characters.';
  if (new TextEncoder().encode(password).length > 72) return 'Use a password of at most 72 UTF-8 bytes.';
  return null;
}
export function createPortalClient(fetcher: typeof fetch = fetch, alias: LoginAlias | null = loginAlias) {
  async function request(path: string, body?: object, csrf?: string, signal?: AbortSignal): Promise<unknown> {
    const timeout = AbortSignal.timeout(15000);
    let response: Response;
    try {
      response = await fetcher(`${API_ORIGIN}/api${path}`, { method: body ? 'POST' : 'GET', credentials: 'include',
        cache: 'no-store', redirect: 'error', referrerPolicy: 'no-referrer',
        headers: body ? { 'Content-Type': 'application/json', 'X-EPDG-Request': 'portal', ...(csrf ? { 'X-CSRF-Token': csrf } : {}) } : {},
        ...(body ? { body: JSON.stringify(body) } : {}), signal: signal ? AbortSignal.any([signal, timeout]) : timeout });
    } catch {
      if (signal?.aborted) throw new DOMException('Canceled', 'AbortError');
      throw new PortalRequestError(0, 'The synthetic practice backend is unavailable. Please try again.');
    }
    if (!response.ok) {
      const message = response.status === 429 ? 'Too many attempts. Please wait before trying again.' :
        response.status === 401 ? 'Sign-in details are incorrect or your account access is unavailable.' :
        path === '/auth/reset-password' && response.status === 400 ? 'This recovery link is invalid or expired. Request a new link.' :
        response.status === 403 ? 'Request verification failed. Reload and try again.' : 'The request could not be completed. Please try again.';
      throw new PortalRequestError(response.status, message);
    }
    let data: unknown;
    try { data = await response.json(); } catch { throw new PortalRequestError(502, 'The backend response could not be verified.'); }
    if (!record(data) || data.success !== true || (HOSTED_PRACTICE ? data.environment !== PRACTICE_ENVIRONMENT : data.environment !== undefined && data.environment !== PRACTICE_ENVIRONMENT)) throw new PortalRequestError(502, 'The backend response could not be verified.');
    return data;
  }
  return {
    session: async (signal?: AbortSignal) => parseSession(await request('/auth/session', undefined, undefined, signal)),
    login: async (email: string, password: string) => {
      const resolved = resolveLoginEmail(email, alias);
      if (!resolved) throw new PortalRequestError(400, 'Use an authorized practice account email.');
      return parseSession(await request('/auth/login', { email: resolved, password }));
    },
    logout: (csrf: string) => request('/auth/logout', {}, csrf),
    forgot: (email: string) => {
      const resolved = resolveLoginEmail(email, alias);
      if (!resolved) return Promise.reject(new PortalRequestError(400, 'Use an authorized practice account email.'));
      return request('/auth/forgot-password', { email: resolved });
    },
    reset: (token: string, password: string) => request('/auth/reset-password', { token, password }),
    change: (current: string, password: string, csrf: string) => request('/auth/change-password', { current_password: current, new_password: password }, csrf),
  };
}
