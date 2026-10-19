import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Navigate, Routes, Route, useLocation } from 'react-router-dom';
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

const BelowFold = React.lazy(() => import('./Components/MainRender/BelowFold'));

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) { window.scrollTo({ top: 0, behavior: 'instant' }); return; }
    // Wait for lazy routes as well as ordinary client-side route transitions.
    const scrollToTarget = () => {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!target) return false;
      target.scrollIntoView({ behavior: 'instant' });
      return true;
    };
    if (scrollToTarget()) return;
    const observer = new MutationObserver(() => { if (scrollToTarget()) observer.disconnect(); });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
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

function AppShell() {
  const location = useLocation();
  return (
    <Suspense fallback={<PageLoader />}>
      <ScrollToTop />
      <Navbar key={location.key} />
      <div className="page-offset">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<Services />} />
          <Route path="/register" element={<Navigate to="/" replace />} />
          <Route path="/about" element={<BelowFold />} />
          <Route path="/classes" element={<ClassCatalog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/global-internship" element={<GlobalInternship />} />
          <Route path="/epdg" element={<GlobalInternship />} />
          <Route path="/agency" element={<AgencyPage />} />
        </Routes>
      </div>
      <Footer />
      <CookieConsent />
    </Suspense>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;
