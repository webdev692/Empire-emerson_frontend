export const platformEntryPagesEnabled = import.meta.env.DEV ||
  (import.meta.env.MODE === 'public-release' && import.meta.env.VITE_PLATFORM_ENTRY_PAGES_RELEASE === 'true');
