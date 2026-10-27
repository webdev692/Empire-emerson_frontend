import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import SyntheticPortal from './SyntheticPortal';
import { captureRecovery, PORTAL_ORIGIN } from './client';
import './synthetic.css';

const root = createRoot(document.getElementById('root')!);
if (import.meta.env.DEV && import.meta.env.MODE === 'synthetic-local' && window.location.origin === PORTAL_ORIGIN) {
  // Capture before React/StrictMode effects, then remove fragments and queries from this history entry.
  const recoveryToken = captureRecovery(window.location);
  window.history.replaceState(null, '', window.location.pathname);
  root.render(<StrictMode><SyntheticPortal recoveryToken={recoveryToken} /></StrictMode>);
} else {
  root.render(<main><h1>Local test access is unavailable</h1><p>This entry requires the isolated local test runner.</p></main>);
}
