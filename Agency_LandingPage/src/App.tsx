import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { PreviewBoundary, PreviewNotice, ExperienceLinks } from '../../shared/InternSiteIntegration'
import EducationPage from './Components/EducationPage/EducationPage'
import ProjectStudioPage, { StudioReviewNotice } from '../../shared/ProjectStudioEntry';
import ProgramExperience from '../../shared/ThreeProgramsEntry';
import { threeProgramsEnabled } from '../../shared/three-programs-mode';
import { projectStudioEnabled, projectStudioLocal } from '../../shared/project-studio-mode';
import './App.css'
import Navbar from './Components/Umbrella/Navbar'
import HomePage from './Components/MainRender/EmpireLanding'
import Footer from './Components/Umbrella/Footer'
import RequestFormModal from './Components/Umbrella/RequestFormModal'

const Features = import.meta.env.DEV || (import.meta.env.MODE === 'protected-review' || import.meta.env.MODE === 'public-release' || import.meta.env.MODE === 'studio-local') ? lazy(() => import('./IntegratedFeatures')) : null

function Site({ enhanced }: { enhanced: boolean }) {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
      else window.scrollTo(0, 0);
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash])
  if (!enhanced && pathname === "/educationPage") return <EducationPage />
  return (
    <div className="min-h-screen bg-[#0A1128] text-white">
      <Navbar />
      {enhanced && (projectStudioLocal ? <StudioReviewNotice entity="TEA" /> : <PreviewNotice />)}
      <Suspense fallback={<p role="status">Loading education…</p>}>
        <Routes>
          {enhanced && threeProgramsEnabled && <Route path="/pathways" element={<ProgramExperience entity="TEA" />} />}
        {enhanced && projectStudioEnabled && <Route path="/project-studio" element={<ProjectStudioPage entity="TEA" />} />}
          <Route path="/" element={<HomePage enhanced={enhanced} />} />
          <Route path="/educationPage" element={<EducationPage embedded />} />
          {enhanced && Features && <Route path="*" element={<Features />} />}
        </Routes>
      </Suspense>
      {enhanced && <ProgramExperience entity="TEA" view="footer" />}
      {enhanced && <ExperienceLinks />}
      <Footer />
      <RequestFormModal />
    </div>
  )
}

function App({ enhanced = false }: { enhanced?: boolean }) {
  return <BrowserRouter basename={import.meta.env.BASE_URL}>{enhanced ? <PreviewBoundary entity="TEA"><Site enhanced /></PreviewBoundary> : <Site enhanced={false} />}</BrowserRouter>
}
export default App
