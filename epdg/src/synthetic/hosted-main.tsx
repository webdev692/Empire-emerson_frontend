import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import SyntheticPortal from './SyntheticPortal';
import { captureRecovery } from './client';
import { HOSTED_PRACTICE, hostedContextAllowed } from './runtimeProfile';
import { retirePortalWorker } from './workerRetirement';
import './synthetic.css';

const root = createRoot(document.getElementById('root')!);
async function start() {
  if (!HOSTED_PRACTICE || !hostedContextAllowed({ mode: import.meta.env.MODE, production: import.meta.env.PROD,
    development: import.meta.env.DEV, origin: window.location.origin })) {
    root.render(<main><h1>Hosted practice access is unavailable</h1><p>This artifact requires its reviewed HTTPS portal origin.</p></main>);
    return;
  }
  root.render(<main role="status"><h1>Preparing secure practice access</h1><p>Checking this browser’s portal cache…</p></main>);
  try {
    if (await retirePortalWorker(navigator.serviceWorker, window.caches, window.location.origin)) {
      window.location.reload();
      return;
    }
    const recoveryToken = captureRecovery(window.location);
    window.history.replaceState(null, '', window.location.pathname);
    root.render(<StrictMode><SyntheticPortal recoveryToken={recoveryToken} /></StrictMode>);
  } catch {
    root.render(<main><h1>Hosted practice access is unavailable</h1><p>Browser cache retirement could not be verified. Reload while connected before signing in.</p></main>);
  }
}
void start();
