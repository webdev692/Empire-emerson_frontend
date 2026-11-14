import { lazy, Suspense } from 'react';
const SCCommunityDirectory = lazy(() => import('./Components/SCCommunityDirectory'));
export default function PublicResourceSupplement() { return <Suspense fallback={<p>Loading community resources…</p>}><SCCommunityDirectory /></Suspense>; }
