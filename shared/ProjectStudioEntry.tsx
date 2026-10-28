import { lazy, Suspense } from 'react';

// Keep literal conditions beside the imports so Vite excludes unapproved chunks.
const Studio = import.meta.env.MODE === 'studio-local' ||
  (import.meta.env.MODE === 'public-release' && import.meta.env.VITE_PROJECT_STUDIO_RELEASE === 'true')
  ? lazy(() => import('./ProjectStudio')) : null;
const LocalNotice = import.meta.env.MODE === 'studio-local' ? lazy(() => import('./ProjectStudioLocalNotice')) : null;
type Props = { entity: 'TEE' | 'TEA' };

export function StudioGateway({ entity }: Props) {
  return Studio ? <Suspense fallback={null}><Studio entity={entity} view="gateway" /></Suspense> : null;
}
export function StudioReviewNotice({ entity }: Props) {
  return LocalNotice ? <Suspense fallback={null}><LocalNotice entity={entity} /></Suspense> : null;
}
export default function ProjectStudioPage({ entity }: Props) {
  return Studio ? <Suspense fallback={<p role="status">Loading Project Studio…</p>}><Studio entity={entity} view="page" /></Suspense> : null;
}
