import { useEffect } from 'react';
import type { PublicEntity, PublicPage } from './PublicDesignSystem';
import { PublicShell, NotFound } from './PublicDesignSystem';
import { PreviewBoundary } from './InternSiteIntegration';

export default function PublicWebsite({ entity, pages, pathname }: { entity: PublicEntity; pages: PublicPage[]; pathname: string }) {
  const page = pages.find(item => item.path === pathname.replace(/\/$/, '') || (item.path === '/' && pathname === '/'));
  useEffect(() => {
    if (window.location.hash) document.getElementById(decodeURIComponent(window.location.hash.slice(1)))?.scrollIntoView();
  }, []);
  return <PreviewBoundary entity={entity}><PublicShell entity={entity} pathname={page?.path || pathname} title={page?.title || 'Page not found'} description={page?.description || 'This page is unavailable. Return to the company home or explore the resource library.'} hasMain={page?.hasMain}>{page?.content || <NotFound />}</PublicShell></PreviewBoundary>;
}
