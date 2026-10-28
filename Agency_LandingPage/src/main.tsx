import PublicWebsiteRecovery from '../../shared/PublicWebsiteRecovery';
import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import CompanyPlatform from '../../shared/CompanyPlatform'
const platformEnabled = import.meta.env.VITE_COMPANY_PLATFORM === 'true'
const App = !platformEnabled || import.meta.env.DEV || (import.meta.env.MODE === 'protected-review' || import.meta.env.MODE === 'public-release' || import.meta.env.MODE === 'studio-local') ? lazy(() => import('./App.tsx')) : null
const enhanced = platformEnabled && ((import.meta.env.MODE === 'protected-review' || import.meta.env.MODE === 'public-release' || import.meta.env.MODE === 'studio-local') || (import.meta.env.DEV && !new URLSearchParams(window.location.search).has('legacy')))

createRoot(document.getElementById('root')!).render(
  <StrictMode><PublicWebsiteRecovery>
    <HelmetProvider>
      <Suspense fallback={<p role="status">Loading the company website…</p>}>
        {App ? <App enhanced={enhanced} /> : <CompanyPlatform entity="TEA" />}
      </Suspense>
    </HelmetProvider>
  </PublicWebsiteRecovery></StrictMode>,
)
