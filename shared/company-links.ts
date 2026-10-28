import { localHref } from './platform-format';

type Entity = 'TEE' | 'TEA' | 'EPDG';
const origins = {
  TEE: import.meta.env.MODE === 'public-release' ? import.meta.env.VITE_TEE_PUBLIC_ORIGIN : import.meta.env.VITE_TEE_PREVIEW_ORIGIN,
  TEA: import.meta.env.MODE === 'public-release' ? import.meta.env.VITE_TEA_PUBLIC_ORIGIN : import.meta.env.VITE_TEA_PREVIEW_ORIGIN,
  EPDG: import.meta.env.MODE === 'public-release' ? import.meta.env.VITE_EPDG_PUBLIC_ORIGIN : import.meta.env.VITE_EPDG_PREVIEW_ORIGIN,
};
const ports = { TEE: 5173, TEA: 5174, EPDG: 5175 };

export function companyHref(entity: Entity, path = '/') {
  if (import.meta.env.DEV) return `http://127.0.0.1:${ports[entity]}${path}`;
  // Review the same compiled bundles together without leaving the local previews.
  if (import.meta.env.MODE === 'public-release' && typeof window !== 'undefined') {
    try {
      const local = new URL(window.location.href);
      if (local.protocol === 'http:' && ['127.0.0.1','localhost','[::1]'].includes(local.hostname) && Object.values(ports).includes(Number(local.port))) {
        local.port = String(ports[entity]);
        return new URL(path, local.origin).href;
      }
    } catch { /* Non-browser rendering continues to configured origins. */ }
  }
  try {
    const origin = new URL(origins[entity]);
    if (origin.protocol === 'https:' && !origin.username && !origin.password &&
        origin.pathname === '/' && !origin.search && !origin.hash) return new URL(path, origin).href;
  } catch { /* Unverified destinations stay within this experience. */ }
  return null;
}
export const companyInformationHref = (entity: Entity) => companyHref(entity) || localHref('/coverage');
