import { createPublicPages } from '../../shared/PublicPageCatalog';
import { empirePages } from './ModernContent';
import PublicResourceSupplement from './PublicResourceSupplement';
export const publicPages = createPublicPages('TEE', empirePages, <PublicResourceSupplement />);
