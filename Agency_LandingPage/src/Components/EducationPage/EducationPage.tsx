
import EducationNavbar from './EducationPageNavbar'
import EducationFooter from './EducationPageFooter';
import EducationHero from './EducationMain/EducationHero';
import EducationOverview from './EducationMain/EducationOverview';
import ResourceGrid from './EducationMain/ResourceGrid';
import HelpBanner from './EducationMain/HelpBanner';
export default function EducationPage({ embedded = false }: { embedded?: boolean }) {
  return (
    <div>
      {!embedded && import.meta.env.DEV && import.meta.env.VITE_COMPANY_PLATFORM === 'true' && (
        <aside aria-label="Development preview" className="bg-[#0f2242] px-5 py-3 text-center text-sm text-white">
          PRIVATE LOCAL DEVELOPMENT · TEA education draft for review · No live submissions
        </aside>
      )}
      {!embedded && <EducationNavbar />}
      <main id="main-content">
      <EducationHero />
      <EducationOverview />
      <ResourceGrid />
      <HelpBanner />
      </main>
      {!embedded && <EducationFooter />}
      
    </div>
  );
}
