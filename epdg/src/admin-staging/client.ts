const API_ORIGIN = __EPDG_ADMIN_STAGING_API_ORIGIN__;
let csrfToken: string | null = null;

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
]);

type Envelope<T> = { success: true; data?: T; user?: PortalUser; expires_at?: string; csrf_token?: string };

async function request<T>(path: string, init: RequestInit = {}, includeCsrf = true): Promise<T> {
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
  return body as T;
}

function sessionFrom(envelope: Envelope<unknown>): PortalSession {
  if (!envelope.user || !Array.isArray(envelope.user.permissions) || typeof envelope.csrf_token !== 'string'
    || typeof envelope.expires_at !== 'string') {
    throw new PortalApiError(502, 'The API returned an invalid session.');
  }
  csrfToken = envelope.csrf_token;
  return { user: envelope.user, expires_at: envelope.expires_at, csrf_token: envelope.csrf_token };
}

export async function restoreSession(): Promise<PortalSession> {
  const envelope = await request<Envelope<unknown>>('/auth/session');
  return sessionFrom(envelope);
}

export async function signIn(email: string, password: string): Promise<PortalSession> {
  const envelope = await request<Envelope<unknown>>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }, false);
  return sessionFrom(envelope);
}

export async function signOut(): Promise<void> {
  try {
    await request('/auth/logout', { method: 'POST', body: '{}' });
  } finally {
    csrfToken = null;
  }
}

export function get<T>(path: string): Promise<Envelope<T>> {
  return request<Envelope<T>>(path);
}

export function post<T>(path: string, value: unknown): Promise<Envelope<T>> {
  return request<Envelope<T>>(path, { method: 'POST', body: JSON.stringify(value) });
}
