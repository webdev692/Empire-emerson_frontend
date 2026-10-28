import { useLocation } from 'react-router-dom';
import CompanyPlatform from '../../shared/CompanyPlatform';
export default function IntegratedFeatures() {
  const { pathname } = useLocation();
  return <CompanyPlatform entity="TEA" embedded routePath={pathname}  />;
}
