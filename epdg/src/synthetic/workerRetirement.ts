interface PortalWorker { readonly scriptURL: string }
interface WorkerRegistration {
  readonly scope: string;
  readonly active?: PortalWorker | null;
  readonly installing?: PortalWorker | null;
  readonly waiting?: PortalWorker | null;
  unregister(): Promise<boolean>;
}
interface WorkerContainer { readonly controller: PortalWorker | null; getRegistrations(): Promise<readonly WorkerRegistration[]> }
interface PortalCache { keys(): Promise<string[]>; delete(key: string): Promise<boolean> }

function isPortalScript(worker: PortalWorker | null | undefined, origin: string): boolean {
  return worker?.scriptURL === `${origin}/sw.js`;
}
function isPortalRegistration(registration: WorkerRegistration, origin: string): boolean {
  const scripts = [registration.active, registration.installing, registration.waiting].filter((worker): worker is PortalWorker => Boolean(worker));
  return registration.scope === `${origin}/` && scripts.length > 0 && scripts.every(worker => isPortalScript(worker, origin));
}
function isPortalPrecache(key: string, scope: string): boolean {
  return /^workbox-precache-v[0-9]+-(.*)$/.exec(key)?.[1] === scope;
}

// Retire only the reviewed root /sw.js registration and its scope-named Workbox
// precache. Other applications' registrations and ambiguous shared caches stay
// untouched. An unexpected controller closes access before any session request.
export async function retirePortalWorker(workers?: WorkerContainer, storage?: PortalCache, origin?: string): Promise<boolean> {
  if (!workers && !storage) return false;
  let parsed: URL;
  try { parsed = new URL(origin ?? ''); } catch { throw new Error('Portal worker retirement requires its exact origin.'); }
  if (parsed.protocol !== 'https:' || parsed.origin !== origin) throw new Error('Portal worker retirement requires its exact HTTPS origin.');
  if (workers?.controller && !isPortalScript(workers.controller, origin)) throw new Error('Unexpected browser worker controls portal access.');
  const controlled = isPortalScript(workers?.controller, origin);
  if (workers) {
    const registrations = await workers.getRegistrations();
    if (registrations.some(registration => registration.scope === `${origin}/` && !isPortalRegistration(registration, origin))) {
      throw new Error('Unexpected root browser worker prevents portal access.');
    }
    await Promise.all(registrations.filter(registration => isPortalRegistration(registration, origin)).map(registration => registration.unregister()));
    if ((await workers.getRegistrations()).some(registration => isPortalRegistration(registration, origin))) throw new Error('Portal worker retirement could not be verified.');
  }
  if (storage) await Promise.all((await storage.keys()).filter(key => isPortalPrecache(key, `${origin}/`)).map(key => storage.delete(key)));
  return controlled;
}
