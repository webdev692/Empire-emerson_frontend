import catalog from './services-catalog.public.json';
import { contactMailboxes, publicIntakeEnabled } from './public-intake';
export type ServiceCompany = 'TEE' | 'TEA' | 'EPDG';
// This address is already published in the three original company footers.
export const serviceMailbox = 'admin@theemersonempire.info';
export function serviceInquiryHref(entity: ServiceCompany, id: string, access = false) {
  const service = catalog.services.find(item => item.id === id && item.entity === entity);
  const course = catalog.classes.find(item => item.id === id);
  const title = service?.name || course?.title;
  if (!title) return '#intake-held';
  const params = new URLSearchParams({
    subject: `[${entity}] ${access ? 'Access options' : 'Service inquiry'}: ${title}`,
    body: `Company: ${entity}\nOffering: ${title}\n\nI would like information about ${access ? 'free, reduced-cost or fee-waiver options and their review conditions' : 'current availability, scope and a planning estimate'}.\n\nMy goal (optional):\n\nPlease do not include identity documents, tax returns, account numbers, medical information or other sensitive records in this initial email.`,
  });
  // mailto headers use percent-encoded spaces, rather than form-urlencoded '+'.
  return `mailto:${publicIntakeEnabled ? contactMailboxes.sales : serviceMailbox}?${params.toString().replaceAll('+', '%20')}`;
}
// Permit only exact generated email drafts. Other forms, mail links and live intake remain held.
export function isServiceInquiryHref(value: string, entity: ServiceCompany) {
  return [...catalog.services.filter(item => item.entity === entity), ...catalog.classes].some(item =>
    value === serviceInquiryHref(entity, item.id) || value === serviceInquiryHref(entity, item.id, true));
}
