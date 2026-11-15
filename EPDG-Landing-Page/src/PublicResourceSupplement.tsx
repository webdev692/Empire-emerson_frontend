import { lazy, Suspense } from 'react';
const CollegesDirectory = lazy(() => import('./components/CollegesDirectory'));
const FreeLearningLibrary = lazy(() => import('./components/FreeLearningLibrary'));
export default function PublicResourceSupplement() { return <Suspense fallback={<p>Loading learning collections…</p>}><FreeLearningLibrary /><CollegesDirectory /></Suspense>; }
