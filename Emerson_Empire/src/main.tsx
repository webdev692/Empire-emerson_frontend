import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import PublicWebsiteRecovery from '../../shared/PublicWebsiteRecovery';
import App from './App';
import '../../shared/public-base.css';
const container = document.getElementById('root')!;
const site = <StrictMode><PublicWebsiteRecovery><App /></PublicWebsiteRecovery></StrictMode>;
if (container.hasChildNodes()) hydrateRoot(container, site);
else createRoot(container).render(site);
