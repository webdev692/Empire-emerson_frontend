
import EducationNavbar from './EducationPageNavbar'
import EducationFooter from './EducationPageFooter';
import EducationHero from './EducationMain/EducationHero';
import EducationOverview from './EducationMain/EducationOverview';
import ResourceGrid from './EducationMain/ResourceGrid';
import HelpBanner from './EducationMain/HelpBanner';
export default function EducationPage() {
  return (
    <div>
      <EducationNavbar />
      <EducationHero />
      <EducationOverview />
      <ResourceGrid />
      <HelpBanner />
      <EducationFooter />
      
    </div>
  );
}