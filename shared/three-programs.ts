import data from './three-programs.preview.json';
import publicData from './three-programs.public.json';
import { companyHref } from './company-links';
import { threeProgramsEnabled, type ProgramCompany } from './three-programs-mode';

export type ProgramRecord = typeof data.programs[number];
export const programs = import.meta.env.VITE_THREE_PROGRAMS_PREVIEW === 'true' ? data.programs : (import.meta.env.MODE === 'public-release' && import.meta.env.VITE_THREE_PROGRAMS_RELEASE === 'true') ? publicData.programs : [];
export const companyNames = { TEE: 'The Emerson Empire', TEA: 'The Emerson Agency', EPDG: 'Emerson Professional Development Group' };
export function programFor(entity: ProgramCompany) { return programs.find(program => program.brand === entity)!; }

export function programHref(entity: ProgramCompany, locationHref = typeof window === 'undefined' ? '' : window.location.href) {
  const program = programFor(entity);
  try {
    const current = new URL(locationHref);
    const ports = { TEE: 5193, TEA: 5194, EPDG: 5195 };
    if (threeProgramsEnabled && current.protocol === 'http:' && ['127.0.0.1', 'localhost', '[::1]'].includes(current.hostname) && Object.values(ports).includes(Number(current.port))) {
      current.port = String(ports[entity]);
      return new URL(program.route, current.origin).href;
    }
  } catch { /* Static rendering uses the configured, verified company origin. */ }
  return companyHref(entity, program.route);
}

export function programInquiryText(entity: ProgramCompany, actionId: string) {
  if (!threeProgramsEnabled) return null;
  const program = programFor(entity);
  const action = program.actions.find(item => item.id === actionId);
  if (!action) return null;
  return {
    subject: `[${entity} program] ${program.name}: ${action.label}`,
    body: `Program: ${program.name}\n\n${action.question}\n\nName (optional):\nOrganization (if applicable):\nGeneral location (optional):\nQuestion:\n\nPlease do not include student records, identity documents, medical information, account numbers or other sensitive information in this initial inquiry.`,
  };
}
export function programInquiryHref(entity: ProgramCompany, actionId: string) {
  const text = programInquiryText(entity, actionId);
  return text ? `mailto:${programFor(entity).contactEmail}?${new URLSearchParams(text).toString().replaceAll('+', '%20')}` : '#program-contact';
}
export function isProgramInquiryHref(value: string, entity: ProgramCompany) {
  return threeProgramsEnabled && programFor(entity).actions.some(action => value === programInquiryHref(entity, action.id));
}
