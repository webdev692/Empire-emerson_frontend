import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Navigate, Routes, Route, useLocation } from 'react-router-dom';
import ProjectStudioPage, { StudioReviewNotice } from '../../shared/ProjectStudioEntry';
import ProgramExperience from '../../shared/ThreeProgramsEntry';
import { threeProgramsEnabled } from '../../shared/three-programs-mode';
import { projectStudioEnabled, projectStudioLocal } from '../../shared/project-studio-mode';
import './App.css';
import HomePage from './Components/MainRender/EmpireLanding';
import Services from './Components/Umbrella/Services';
import Disclaimer from './Components/Umbrella/Disclaimer';
import GlobalInternship from './Components/Umbrella/GlobalInternship';
import AgencyPage from './Components/Umbrella/AgencyPage';
import Navbar from './Components/Umbrella/Navbar';
import { Footer, CookieConsent } from './Components/Umbrella';
import ClassCatalog from './Components/Umbrella/Classes';
import Contact from './Components/Umbrella/Contact';

import { PreviewBoundary, PreviewNotice, ExperienceLinks } from '../../shared/InternSiteIntegration';
const IntegratedFeatures = import.meta.env.DEV || (import.meta.env.MODE === 'protected-review' || import.meta.env.MODE === 'public-release' || import.meta.env.MODE === 'studio-local') ? React.lazy(() => import('./IntegratedFeatures')) : null;

const BelowFold = React.lazy(() => import('./Components/MainRender/BelowFold'));

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
      else window.scrollTo(0, 0);
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);
  return null;
}

function PageLoader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontSize: '1rem', color: '#6b7280' }}>
      Loading...
    </div>
  );
}

function AppShell({ enhanced }: { enhanced: boolean }) {
  return (
    <Suspense fallback={<PageLoader />}>
      <ScrollToTop />
      {enhanced && (projectStudioLocal ? <StudioReviewNotice entity="TEE" /> : <PreviewNotice />)}
      <Navbar />
      <Routes>
        {enhanced && threeProgramsEnabled && <Route path="/career-readiness" element={<ProgramExperience entity="TEE" />} />}
        {enhanced && projectStudioEnabled && <Route path="/project-studio" element={<ProjectStudioPage entity="TEE" />} />}
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={enhanced && IntegratedFeatures ? <IntegratedFeatures /> : <Services />} />
        <Route path="/register" element={<Navigate to="/" replace />} />
        <Route path="/about" element={<BelowFold />} />
        <Route path="/classes" element={enhanced && IntegratedFeatures ? <IntegratedFeatures /> : <ClassCatalog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/global-internship" element={enhanced && threeProgramsEnabled ? <main id="main-content" className="pt-24"><ProgramExperience entity="EPDG" view="referral" /></main> : <GlobalInternship />} />
        <Route path="/epdg" element={enhanced && threeProgramsEnabled ? <main id="main-content" className="pt-24"><ProgramExperience entity="EPDG" view="referral" /></main> : <GlobalInternship />} />
        <Route path="/agency" element={<AgencyPage />} />
        {enhanced && IntegratedFeatures && <Route path="*" element={<IntegratedFeatures />} />}
      </Routes>
      {enhanced && <ProgramExperience entity="TEE" view="footer" />}
      {enhanced && <ExperienceLinks />}
      <Footer />
      <CookieConsent />
    </Suspense>
  );
}

function App({ enhanced = false }: { enhanced?: boolean }) {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      {enhanced ? <PreviewBoundary entity="TEE"><AppShell enhanced /></PreviewBoundary> : <AppShell enhanced={false} />}
    </BrowserRouter>
  );
}

export default App;
