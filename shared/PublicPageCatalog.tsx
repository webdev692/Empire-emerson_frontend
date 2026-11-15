import type { ReactNode } from 'react';
import type { PublicEntity, PublicPage } from './PublicDesignSystem';
import { PublicHero, Section } from './PublicDesignSystem';
import CompanyPlatform from './CompanyPlatform';
import PublicLegalPages from './PublicLegalPages';
import { PlatformInformationPage } from './PlatformEntryPages';
import ProjectStudio from './ProjectStudio';
import ThreePrograms from './ThreePrograms';
import catalog from './catalog.public.json';

/** Retains approved resource and learning records while replacing their surrounding presentation. */
export function createPublicPages(entity: PublicEntity, modernPages: PublicPage[], resourceSupplement?: ReactNode): PublicPage[] {
  const legacy = (path: string, title: string, description: string): PublicPage => ({ path, title, description, content: <div className="modern-legacy">{entity === 'TEA' && path === '/services-pricing' && <aside className="modern-wrap modern-prose"><h2>Service scope and availability</h2><p>These guide options are planning references. Insurance product recommendations, placement and availability are not confirmed here; any regulated service requires current license and jurisdiction verification. Sponsored or partner-delivered sessions require a separately confirmed arrangement.</p></aside>}<CompanyPlatform entity={entity} embedded routePath={path} resourcesSupplement={path === '/resources' ? resourceSupplement : undefined} /></div> });
  const pages: PublicPage[] = [
    legacy('/resources', 'Resource Library', 'Browse the Emerson resource library with searchable provider information, source links, eligibility and access conditions.'),
    legacy('/classes', 'Classes & Workshops', 'Explore the Emerson catalog of 19 class descriptions, two retained curriculum topics, and daily free and low-cost Eastern Time sessions.'),
    legacy('/services-pricing', 'Services & Pricing', 'Review approved Emerson service descriptions, estimated prices, access conditions and appropriate inquiry routes.'),
    legacy('/learn', 'Guided Learning', 'Explore practical Emerson learning resources, source-literacy exercises and independent learning activities.'),
    legacy('/programs', 'Programs & Opportunities', 'Explore Emerson learning programs and confirm participation conditions before applying.'),
    legacy('/coverage', 'Resource Coverage', 'Understand the scope and source verification of the Emerson public resource collection.'),
    legacy('/corrections', 'Suggest a Correction', 'Send a privacy-conscious correction to help improve public resource information.'),
    ...catalog.resources.filter(row => entity === 'TEE' || row.entity === entity).map(row => legacy(`/resources/${row.id}`, row.title, row.description)),
    ...catalog.lessons.filter(row => entity === 'TEE' || row.entity === entity).map(row => legacy(`/learn/${row.id}`, row.title, `Guided learning: ${row.title}. Explore practical activities and public educational resources.`)),
    ...catalog.programs.filter(row => !['EPDG-PATHWAYS', 'EPDG-SC-CAREER', 'EPDG-GLOBAL-INTERNSHIP'].includes(row.id)).map(row => legacy(`/programs/${row.id}`, row.title, `Explore ${row.title}, including learning expectations and participation information.`)),
    ...(['privacy', 'terms', 'disclaimer'] as const).map(kind => ({ path: `/${kind}`, title: {privacy:'Privacy Policy',terms:'Terms of Use',disclaimer:'Disclaimer'}[kind], description: `Read the Emerson ${kind === 'privacy' ? 'privacy policy and information-handling practices' : kind === 'terms' ? 'website terms of use and participation conditions' : 'educational and professional service disclaimers'}.`, hasMain: true, content: <PublicLegalPages kind={kind} /> })),
  ];
  if (entity !== 'EPDG') pages.push({path:'/project-studio',title:'Project Studio',description:'Explore approved business and systems project examples, the project-planning process, and an offline personal brief.',hasMain:true,content:<ProjectStudio entity={entity} view="page" />});
  if (entity === 'TEE') {
    for (const page of ['creative-studio', 'platforms'] as const) pages.push({path:`/${page}`,title:page === 'platforms' ? 'Platforms Directory' : 'Creative Studio Information',description:page === 'platforms' ? 'Find the right Emerson platform and understand its access requirements.' : 'Explore Emerson Creative Studio and its supported personal creative workflows.',hasMain:true,content:<PlatformInformationPage entity={entity} page={page} />});
    pages.push({path:'/career-readiness',title:'Career Readiness',description:'Explore the Emerson career-readiness pathway and guided professional preparation.',hasMain:true,content:<ThreePrograms entity="TEE" view="page" />});
  }
  if (entity === 'TEA') {
    pages.push({path:'/staff-crm',title:'Staff CRM Information',description:'Understand the invitation-only Emerson CRM workspace and the authorized staff sign-in route.',hasMain:true,content:<PlatformInformationPage entity={entity} page="staff-crm" />});
    pages.push({path:'/pathways',title:'Financial Education Pathways',description:'Explore practical financial education, source literacy and the Agency learning pathway.',hasMain:true,content:<ThreePrograms entity="TEA" view="page" />});
    pages.push({path:'/research',title:'Research & Scholarship',description:'Explore the independent scholarship of Lyric Helena Emerson through the EPDG public academic archive.',content:<><PublicHero eyebrow="Research & scholarship" title="A considered approach to public life." description="Explore our founder’s independent scholarship in the Emerson Professional Development Group academic archive." /><Section><div className="modern-prose"><p>Lyric Helena Emerson’s research considers institutional ethics, administrative power, evidence, and access. The complete manuscript and conference directories are maintained on EPDG’s public website.</p><a className="modern-button" href="https://emersonprofessionaldevelopment.netlify.app/research">Explore the scholarly archive</a></div></Section></>});
  }
  const merged = new Map(pages.map(page => [page.path, page]));
  for (const page of modernPages) merged.set(page.path, page);
  return [...merged.values()];
}
