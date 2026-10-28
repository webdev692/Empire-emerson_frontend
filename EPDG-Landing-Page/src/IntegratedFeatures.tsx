import { lazy, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import CompanyPlatform from '../../shared/CompanyPlatform';
const CollegesDirectory = lazy(() => import('./components/CollegesDirectory'));
const FreeLearningLibrary = lazy(() => import('./components/FreeLearningLibrary'));
export default function IntegratedFeatures() {
  const { pathname } = useLocation();
  const resources = pathname === '/resources' || pathname === '/educational-resources';
  return <CompanyPlatform entity="EPDG" embedded routePath={pathname} resourcesSupplement={resources ? <Suspense fallback={<p role="status">Loading learning collections…</p>}><FreeLearningLibrary /><CollegesDirectory /></Suspense> : undefined} />;
}
