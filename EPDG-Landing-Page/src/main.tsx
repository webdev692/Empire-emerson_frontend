import PublicWebsiteRecovery from '../../shared/PublicWebsiteRecovery';
import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import CompanyPlatform from '../../shared/CompanyPlatform'
const platformEnabled = import.meta.env.VITE_COMPANY_PLATFORM === 'true'
const App = !platformEnabled || import.meta.env.DEV || (import.meta.env.MODE === 'protected-review' || import.meta.env.MODE === 'public-release') ? lazy(() => import('./App.tsx')) : null
const enhanced = platformEnabled && ((import.meta.env.MODE === 'protected-review' || import.meta.env.MODE === 'public-release') || (import.meta.env.DEV && !new URLSearchParams(window.location.search).has('legacy')))

createRoot(document.getElementById('root')!).render(
  <StrictMode><PublicWebsiteRecovery>
    <Suspense fallback={<p role="status" style={{ background: '#041913', color: '#fff', padding: '32px', minHeight: '100vh' }}>Loading learning resources…</p>}>
      {App ? <App enhanced={enhanced} /> : <CompanyPlatform entity="EPDG" />}
    </Suspense>
  </PublicWebsiteRecovery></StrictMode>,
)
