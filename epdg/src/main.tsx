import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import PortalAccessHold from './components/PortalAccessHold'
import { bootTheme } from './store/themeStore'

bootTheme();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <PortalAccessHold />
    </HelmetProvider>
  </StrictMode>,
)
