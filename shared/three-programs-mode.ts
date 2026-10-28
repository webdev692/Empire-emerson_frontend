export const threeProgramsLocal = import.meta.env.VITE_THREE_PROGRAMS_PREVIEW === 'true';
// The public flag is set only after validating the founder's exact-copy approval.
export const threeProgramsEnabled = threeProgramsLocal || (import.meta.env.MODE === 'public-release' && import.meta.env.VITE_THREE_PROGRAMS_RELEASE === 'true');
export type ProgramCompany = 'TEE' | 'TEA' | 'EPDG';
export function legacyProgramOwner(id?: string): ProgramCompany | null {
  if (!threeProgramsEnabled) return null;
  return id === 'EPDG-PATHWAYS' ? 'TEA' : id === 'EPDG-SC-CAREER' ? 'TEE' : id === 'EPDG-GLOBAL-INTERNSHIP' ? 'EPDG' : null;
}
