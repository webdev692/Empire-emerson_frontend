import { LOCAL_PRACTICE_API_ORIGIN } from './localPracticeRuntime.ts';

export type PracticeEnvironment = 'synthetic-local' | 'synthetic-hosted' | 'portal-release-candidate';
declare const __EPDG_RELEASE_PORTAL_MODE__: boolean;
declare const __EPDG_RELEASE_REVIEW_MODE__: boolean;
declare const __EPDG_RELEASE_PORTAL_ORIGIN__: string;
export const RELEASE_PORTAL = typeof __EPDG_RELEASE_PORTAL_MODE__ !== 'undefined' && __EPDG_RELEASE_PORTAL_MODE__;
export const RELEASE_REVIEW = typeof __EPDG_RELEASE_REVIEW_MODE__ !== 'undefined' && __EPDG_RELEASE_REVIEW_MODE__;
export const RELEASE_ORIGIN = typeof __EPDG_RELEASE_PORTAL_ORIGIN__ === 'undefined' ? '' : __EPDG_RELEASE_PORTAL_ORIGIN__;
export interface HostedPracticeProfile { environment: 'synthetic-hosted'; portalOrigins: readonly string[] }
declare const __EPDG_HOSTED_PRACTICE_PROFILE__: HostedPracticeProfile | null;
declare const __EPDG_HOSTED_PRACTICE_MODE__: boolean;
const profile = typeof __EPDG_HOSTED_PRACTICE_PROFILE__ === 'undefined' ? null : __EPDG_HOSTED_PRACTICE_PROFILE__;
export const HOSTED_PRACTICE = typeof __EPDG_HOSTED_PRACTICE_MODE__ === 'undefined' ? false : __EPDG_HOSTED_PRACTICE_MODE__;
export const PRACTICE_ENVIRONMENT: PracticeEnvironment = RELEASE_PORTAL ? 'portal-release-candidate' : HOSTED_PRACTICE ? 'synthetic-hosted' : 'synthetic-local';
export const PRACTICE_API_ORIGIN = RELEASE_PORTAL && !RELEASE_REVIEW || HOSTED_PRACTICE ? '' : LOCAL_PRACTICE_API_ORIGIN;
export const HOSTED_PORTAL_ORIGINS = profile?.portalOrigins ?? [];

export function hostedContextAllowed(context: { mode: string; production: boolean; development: boolean; origin: string },
  origins: readonly string[] = HOSTED_PORTAL_ORIGINS): boolean {
  if (context.mode !== 'hosted-practice' || !context.production || context.development || origins.length < 1) return false;
  let url: URL;
  try { url = new URL(context.origin); } catch { return false; }
  return url.protocol === 'https:' && url.origin === context.origin && !url.username && !url.password
    && !url.port && origins.includes(context.origin);
}
export const recoveryMailbox = RELEASE_PORTAL && !RELEASE_REVIEW ? 'your account inbox' : HOSTED_PRACTICE ? 'the secure synthetic mail capture' : 'the local test mailbox';
export const recoveryNotice = RELEASE_PORTAL && !RELEASE_REVIEW ? 'If the account is eligible, recovery instructions will be sent to its verified email address.' : `If the account is eligible, recovery instructions will be captured in ${recoveryMailbox}. No real email is sent.`;

export function releaseContextAllowed(context: { mode: string; production: boolean; development: boolean; origin: string }): boolean {
  if (!RELEASE_PORTAL || context.origin !== RELEASE_ORIGIN) return false;
  return RELEASE_REVIEW ? context.mode === 'portal-review' && context.development && !context.production && context.origin === 'http://127.0.0.1:58080'
    : context.mode === 'portal-release' && context.production && !context.development && context.origin.startsWith('https://');
}

export const LEARNING_ENVIRONMENT: PracticeEnvironment = RELEASE_PORTAL && RELEASE_REVIEW ? 'synthetic-local' : PRACTICE_ENVIRONMENT;
