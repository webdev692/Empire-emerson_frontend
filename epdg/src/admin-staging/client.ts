const API_ORIGIN = __EPDG_ADMIN_STAGING_API_ORIGIN__;
let csrfToken: string | null = null;
let sessionRevision = 0;

export interface PortalUser {
  id: number;
  name: string;
  email: string;
  legacy_role: string;
  portal_roles?: string[];
  permissions: string[];
  privileged_controls_available: boolean;
}

export interface PortalSession {
  user: PortalUser;
  expires_at: string;
  csrf_token: string;
}

export class PortalApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'PortalApiError';
    this.status = status;
  }
}

const safeMessages = new Set([
  'Invalid email or password',
  'Authentication required',
  'Request verification failed',
  'Administrator permission required',
  'Unavailable pending security review',
  'A valid synthetic user id is required',
  'This role cannot be requested from EPDG staging',
  'Self-assignment is unavailable',
  'Active synthetic EPDG account not found',
  'A WebDev role request already exists',
  'Invitation review is unavailable',
  'An eligible synthetic account is required',
  'This role is unavailable for invitation review',
]);

type Envelope<T> = { success: true; data?: T; user?: PortalUser; expires_at?: string; csrf_token?: string };

async function request<T>(path: string, init: RequestInit = {}, includeCsrf = true): Promise<T> {
  if (!/^\/admin\/[a-z0-9/-]+$|^\/auth\/(session|login|logout)$/.test(path)) throw new PortalApiError(400, 'The request could not be completed.');
  const method = (init.method ?? 'GET').toUpperCase();
  const headers = new Headers(init.headers);
  if (init.body !== undefined) headers.set('Content-Type', 'application/json');
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    headers.set('X-EPDG-Request', 'portal');
    if (includeCsrf && csrfToken) headers.set('X-CSRF-Token', csrfToken);
  }

  let response: Response;
  try {
    response = await fetch(`${API_ORIGIN}/api${path}`, {
      ...init,
      method,
      headers,
      credentials: 'include',
      cache: 'no-store',
      redirect: 'error',
      referrerPolicy: 'no-referrer',
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    throw new PortalApiError(0, 'The isolated staging API is unavailable.');
  }

  let body: Record<string, unknown> = {};
  try {
    const parsed: unknown = await response.json();
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) body = parsed as Record<string, unknown>;
  } catch {
    // Keep malformed or non-JSON responses on a generic privacy-safe path.
  }
  if (!response.ok) {
    const message = typeof body.message === 'string' && safeMessages.has(body.message)
      ? body.message
      : 'The request could not be completed.';
    if (response.status === 401) csrfToken = null;
    throw new PortalApiError(response.status, message);
  }
  if (body.success !== true) throw new PortalApiError(502, 'The API returned an invalid response.');
  return body as T;
}

function sessionFrom(envelope: Envelope<unknown>): PortalSession {
  const user = envelope.user;
  if (!user || !Number.isSafeInteger(user.id) || user.id < 1 || typeof user.name !== 'string'
    || typeof user.email !== 'string' || !/^[^\s@]+@[^\s@]+\.invalid$/.test(user.email)
    || typeof user.legacy_role !== 'string' || !Array.isArray(user.permissions) || !user.permissions.every(value => typeof value === 'string')
    || !Array.isArray(user.portal_roles) || !user.portal_roles.every(value => typeof value === 'string')
    || typeof user.privileged_controls_available !== 'boolean'
    || typeof envelope.csrf_token !== 'string' || !/^[A-Za-z0-9_-]{43}$/.test(envelope.csrf_token)
    || typeof envelope.expires_at !== 'string' || !Number.isFinite(Date.parse(envelope.expires_at)) || Date.parse(envelope.expires_at) <= Date.now()) {
    throw new PortalApiError(502, 'The API returned an invalid session.');
  }
  csrfToken = envelope.csrf_token;
  return { user: { id: user.id, name: user.name, email: user.email, legacy_role: user.legacy_role,
    portal_roles: [...user.portal_roles], permissions: [...user.permissions], privileged_controls_available: user.privileged_controls_available },
    expires_at: envelope.expires_at, csrf_token: envelope.csrf_token };
}

export async function restoreSession(): Promise<PortalSession> {
  const revision = sessionRevision;
  const envelope = await request<Envelope<unknown>>('/auth/session');
  if (revision !== sessionRevision) throw new PortalApiError(401, 'Authentication required');
  return sessionFrom(envelope);
}

export async function signIn(email: string, password: string): Promise<PortalSession> {
  const revision = ++sessionRevision;
  csrfToken = null;
  const envelope = await request<Envelope<unknown>>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }, false);
  if (revision !== sessionRevision) throw new PortalApiError(401, 'Authentication required');
  return sessionFrom(envelope);
}

export async function signOut(): Promise<void> {
  ++sessionRevision;
  try {
    await request('/auth/logout', { method: 'POST', body: '{}' });
  } catch (error) {
    if (error instanceof PortalApiError && error.status === 401) {
      csrfToken = null;
      return;
    }
    throw error;
  }
  csrfToken = null;
}

export function forgetSession(): void {
  ++sessionRevision;
  csrfToken = null;
}

export function get<T>(path: string): Promise<Envelope<T>> {
  return request<Envelope<T>>(path);
}

export function post<T>(path: string, value: unknown): Promise<Envelope<T>> {
  return request<Envelope<T>>(path, { method: 'POST', body: JSON.stringify(value) });
}
