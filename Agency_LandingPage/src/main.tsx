import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.tsx'
import IntakeStatusForm from './Components/intake-status/IntakeStatusForm'
import EducationPage from './Components/EducationPage/EducationPage'

const pathname = window.location.pathname;

const renderContent = () => {
  if (pathname === '/educationPage') {
    return <EducationPage />
  }
  if (pathname === '/intake' || pathname === '/intake-status') {
    return <IntakeStatusForm />
  }
  return <App />
}
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
     {renderContent()}
    </HelmetProvider>
  </StrictMode>,
)
