import { useLocation } from 'react-router-dom';
import CompanyPlatform from '../../shared/CompanyPlatform';
import CollegesDirectory from './components/CollegesDirectory';
import FreeLearningLibrary from './components/FreeLearningLibrary';
export default function IntegratedFeatures() {
  const { pathname } = useLocation();
  return <CompanyPlatform entity="EPDG" embedded routePath={pathname} resourcesSupplement={<><FreeLearningLibrary /><CollegesDirectory /></>} />;
}
