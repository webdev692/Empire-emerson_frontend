import PublicLegalPages from '../../shared/PublicLegalPages';
import { lazy, Suspense } from 'react';
import ProgramExperience from '../../shared/ThreeProgramsEntry';
import { threeProgramsEnabled } from '../../shared/three-programs-mode';
import { PreviewBoundary, PreviewNotice, ExperienceLinks } from '../../shared/InternSiteIntegration';
import Navbar from './components/EPDG/Navbar';
import EPDGFooter from './components/EPDG/EPDGFooter';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FormModalProvider } from "./components/EPDG/FormModal";
import ScrollManager from "./components/EPDG/ScrollManager";
import LandingPage from "./components/EPDG/LandingPage";
import ClassesPage from "./components/EPDG/ClassesPage";
const FeedbackView = !(import.meta.env.MODE === 'protected-review' || import.meta.env.MODE === 'public-release') ? lazy(() => import("./components/EPDG/FeedbackView")) : null;

const Features = import.meta.env.DEV || (import.meta.env.MODE === 'protected-review' || import.meta.env.MODE === 'public-release') ? lazy(() => import('./IntegratedFeatures')) : null;
function FeaturePage() {
  return <><Navbar /><PreviewNotice /><Suspense fallback={<p role="status">Loading learning resources…</p>}>{Features && <Features />}</Suspense><ProgramExperience entity="EPDG" view="footer" /><ExperienceLinks /><EPDGFooter /></>;
}
function ProgramPage() {
  return <><Navbar /><PreviewNotice /><ProgramExperience entity="EPDG" /><ProgramExperience entity="EPDG" view="footer" /><ExperienceLinks /><EPDGFooter /></>;
}
function Boundary({ enhanced, children }: { enhanced: boolean; children: React.ReactNode }) { return enhanced ? <PreviewBoundary entity="EPDG">{children}</PreviewBoundary> : children; }
function App({ enhanced = false }: { enhanced?: boolean }) {
  const base = import.meta.env.BASE_URL

  return (
    <BrowserRouter basename={base}>
      <Boundary enhanced={enhanced}><FormModalProvider>
        <ScrollManager />
        <div className="font-sans">
          <Routes>
        <Route path="/disclaimer" element={<PublicLegalPages kind="disclaimer" />} />
        <Route path="/privacy" element={<PublicLegalPages kind="privacy" />} />
        <Route path="/privacy-policy" element={<PublicLegalPages kind="privacy" />} />
        <Route path="/terms" element={<PublicLegalPages kind="terms" />} />
        <Route path="/terms-of-use" element={<PublicLegalPages kind="terms" />} />

            {enhanced && threeProgramsEnabled && <Route path="/global-internship-program" element={<ProgramPage />} />}
            <Route path="/" element={<LandingPage enhanced={enhanced} />} />
            <Route path="/classes" element={enhanced ? <FeaturePage /> : <ClassesPage />} />
            <Route path="/assignments/:assignmentId/feedback" element={FeedbackView ? <Suspense fallback={<p>Loading feedback…</p>}><FeedbackView /></Suspense> : <p role="status">Account feedback is unavailable in this review preview. No account data is connected.</p>} />
            {enhanced && <Route path="*" element={<FeaturePage />} />}
          </Routes>
        </div>
      </FormModalProvider></Boundary>
    </BrowserRouter>
  );
}

export default App;
