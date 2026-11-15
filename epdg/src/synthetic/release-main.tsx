import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import SyntheticPortal from './SyntheticPortal';
import { consumeAccountLink } from './accountLinks';
import { RELEASE_REVIEW, releaseContextAllowed } from './runtimeProfile';
import { retirePortalWorker } from './workerRetirement';
import './synthetic.css';

// Remove secrets before rendering, fetching a session, or retiring old caches.
const link = consumeAccountLink(window);
const root = createRoot(document.getElementById('root')!);
async function start() {
  if (!releaseContextAllowed({ mode: import.meta.env.MODE, production: import.meta.env.PROD, development: import.meta.env.DEV, origin: window.location.origin })) {
    root.render(<main><h1>Portal access is unavailable</h1><p>This artifact requires its reviewed portal origin.</p></main>); return;
  }
  try {
    if (!RELEASE_REVIEW && await retirePortalWorker(navigator.serviceWorker, window.caches, window.location.origin)) {
      window.location.reload(); return;
    }
    root.render(<StrictMode><SyntheticPortal recoveryToken={link.recoveryToken} invitationToken={link.invitationToken} /></StrictMode>);
  } catch {
    root.render(<main><h1>Portal access is unavailable</h1><p>Browser cache retirement could not be verified. Reload while connected before signing in.</p></main>);
  }
}
void start();
