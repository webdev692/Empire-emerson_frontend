import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import CompanyPlatform from '../../shared/CompanyPlatform'
const platformEnabled = import.meta.env.VITE_COMPANY_PLATFORM === 'true'
const App = !platformEnabled || import.meta.env.DEV || (import.meta.env.MODE === 'protected-review' || import.meta.env.MODE === 'public-release') ? lazy(() => import('./App.tsx')) : null
const enhanced = platformEnabled && ((import.meta.env.MODE === 'protected-review' || import.meta.env.MODE === 'public-release') || (import.meta.env.DEV && !new URLSearchParams(window.location.search).has('legacy')))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<p role="status">Loading existing learning interface…</p>}>
      {App ? <App enhanced={enhanced} /> : <CompanyPlatform entity="EPDG" />}
    </Suspense>
  </StrictMode>,
)
