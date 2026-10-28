export const projectStudioLocal = import.meta.env.MODE === 'studio-local';
// The build runner sets this flag only after validating the exact public approval.
export const projectStudioEnabled = projectStudioLocal ||
  (import.meta.env.MODE === 'public-release' && import.meta.env.VITE_PROJECT_STUDIO_RELEASE === 'true');
