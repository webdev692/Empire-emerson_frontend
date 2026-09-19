
import EducationNavbar from './EducationPageNavbar'
import EducationFooter from './EducationPageFooter';
import EducationHero from './EducationMain/EducationHero';
import EducationOverview from './EducationMain/EducationOverview';
import ResourceGrid from './EducationMain/ResourceGrid';
import HelpBanner from './EducationMain/HelpBanner';
import EducationConsentBanner from './EducationMain/EducationConsentBanner';
export default function EducationPage() {
  return (
    <div>
      <EducationNavbar />
      <EducationHero />
      <EducationOverview />
      <ResourceGrid />
      <HelpBanner />
      <EducationConsentBanner />
      <EducationFooter />
      
    </div>
  );
}