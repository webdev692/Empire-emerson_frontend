import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.tsx'

//compenement and a routing trick for the education page
import EducationPage from './Components/EducationPage/EducationPage'
const isEducationRoute = window.location.pathname === '/educationPage'
 
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      {isEducationRoute ? <EducationPage /> : <App />}
    </HelmetProvider>
  </StrictMode>,
)
