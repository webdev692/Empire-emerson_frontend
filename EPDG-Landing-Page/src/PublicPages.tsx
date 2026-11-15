import { createPublicPages } from '../../shared/PublicPageCatalog';
import { epdgPages } from './ModernContent';
import PublicResourceSupplement from './PublicResourceSupplement';
export const publicPages = createPublicPages('EPDG', epdgPages, <PublicResourceSupplement />);
