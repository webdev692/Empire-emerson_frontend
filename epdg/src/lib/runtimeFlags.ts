/**
 * Demo authentication and fixture data must require both an explicit opt-in and
 * Vite's development mode. A production build ignores VITE_MOCK_AUTH even if it
 * is accidentally configured.
 */
export const IS_DEVELOPMENT_MOCK_MODE =
  import.meta.env.DEV && import.meta.env.VITE_MOCK_AUTH === 'true';
