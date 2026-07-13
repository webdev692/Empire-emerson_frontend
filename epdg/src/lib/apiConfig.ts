export function normalizeApiOrigin(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) return null;

  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    if (url.username || url.password || url.pathname !== '/' || url.search || url.hash) return null;
    return url.origin;
  } catch {
    return null;
  }
}

export const API_ORIGIN = normalizeApiOrigin(import.meta.env?.VITE_API_URL);

export class ApiConfigurationError extends Error {
  constructor() {
    super('The backend API origin is not configured.');
    this.name = 'ApiConfigurationError';
  }
}
