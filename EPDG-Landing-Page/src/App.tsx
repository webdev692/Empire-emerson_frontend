import PublicWebsite from '../../shared/PublicWebsite';
import { publicPages } from './PublicPages';
export default function App({ pathname = typeof window === 'undefined' ? '/' : window.location.pathname }: { pathname?: string }) {
  return <PublicWebsite entity="EPDG" pages={publicPages} pathname={pathname} />;
}
