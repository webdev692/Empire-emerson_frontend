import { lazy, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import CompanyPlatform from '../../shared/CompanyPlatform';
import SCCommunityDirectory from './Components/SCCommunityDirectory';
// Only local review or an explicitly validated TEE public release includes these works.
const ResearchPreview = (import.meta.env.MODE === 'public-release' && import.meta.env.VITE_TEE_RESEARCH_PREVIEW === 'true') || (import.meta.env.MODE === 'public-release' && import.meta.env.VITE_TEE_RESEARCH_RELEASE === 'true')
  ? lazy(() => import('./ResearchPreview')) : null;
export default function IntegratedFeatures() {
  const { pathname } = useLocation();
  const researchPath = /^\/research\/?$/.test(pathname) || /^\/research\/(administrative-records|ordered-liberty-datafication|reciprocity-without-justice)\/?$/.test(pathname);
  if (ResearchPreview && researchPath) return <Suspense fallback={<p role="status">Loading selected research…</p>}><ResearchPreview pathname={pathname} /></Suspense>;
  return <CompanyPlatform entity="TEE" embedded routePath={pathname} resourcesSupplement={<SCCommunityDirectory />} />;
}
