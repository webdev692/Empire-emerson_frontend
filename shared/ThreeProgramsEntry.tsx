import { lazy, Suspense } from 'react';
import type { ProgramCompany } from './three-programs-mode';

// Literal guards prevent unapproved program chunks entering ordinary builds.
const Experience = import.meta.env.VITE_THREE_PROGRAMS_PREVIEW === 'true' || (import.meta.env.MODE === 'public-release' && import.meta.env.VITE_THREE_PROGRAMS_RELEASE === 'true')
  ? lazy(() => import('./ThreePrograms')) : null;
type Props = { entity: ProgramCompany; view?: 'page' | 'gateway' | 'footer' | 'referral' | 'card' };
export default function ProgramExperience({ entity, view = 'page' }: Props) {
  return Experience ? <Suspense fallback={view === 'page' ? <p role="status">Loading program information…</p> : null}><Experience entity={entity} view={view} /></Suspense> : null;
}
