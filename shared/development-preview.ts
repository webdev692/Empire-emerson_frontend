import { isApprovedPublicDestination, publicIntakeEnabled } from './public-intake';
import { localHref } from './platform-format';
// Review is a production-compiled artifact, not an authentication mechanism.
// Its entire hosting perimeter must be protected before any upload.
export const reviewPreview = import.meta.env.MODE === 'protected-review';
export const publicRelease = import.meta.env.MODE === 'public-release';
export const integratedPreview = import.meta.env.VITE_COMPANY_PLATFORM === 'true' &&
  (reviewPreview || publicRelease || import.meta.env.MODE === 'studio-local' || (import.meta.env.DEV && !new URLSearchParams(window.location.search).has('legacy')));
export const intakeHoldMessage = publicIntakeEnabled
  ? 'This request route is unavailable. Use Contact & support to reach the correct team. No information has been sent.'
  : publicRelease
  ? 'Registration and live intake are currently closed. No information has been sent. Explore the resources and learning pages while service availability is confirmed.'
  : 'Live intake and registration are disabled in this review preview. No form was loaded and no request was sent. Use the learning and resource pages while destinations and operating details are reviewed.';
export const intakeHref = (value: string) => integratedPreview && !isApprovedPublicDestination(value) ? publicIntakeEnabled ? localHref('/inquiry') : '#intake-held' : value;
export function isIntakeDestination(value: string) {
  if (value === '#intake-held') return true;
  try {
    const url = new URL(value, 'http://localhost');
    return ['mailto:', 'tel:'].includes(url.protocol) || url.hostname === 'forms.gle' || (url.hostname === 'docs.google.com' && url.pathname.startsWith('/forms/')) || url.hostname === 'formsubmit.co';
  } catch { return false; }
}
