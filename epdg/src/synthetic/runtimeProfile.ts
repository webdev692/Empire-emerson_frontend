export type PracticeEnvironment = 'synthetic-local' | 'synthetic-hosted';
export interface HostedPracticeProfile { environment: 'synthetic-hosted'; portalOrigins: readonly string[] }
declare const __EPDG_HOSTED_PRACTICE_PROFILE__: HostedPracticeProfile | null;
declare const __EPDG_HOSTED_PRACTICE_ENABLED__: boolean;
const profile = typeof __EPDG_HOSTED_PRACTICE_PROFILE__ === 'undefined' ? null : __EPDG_HOSTED_PRACTICE_PROFILE__;
export const HOSTED_PRACTICE = typeof __EPDG_HOSTED_PRACTICE_ENABLED__ !== 'undefined' && __EPDG_HOSTED_PRACTICE_ENABLED__ === true;
export const PRACTICE_ENVIRONMENT: PracticeEnvironment = HOSTED_PRACTICE ? 'synthetic-hosted' : 'synthetic-local';
export const PRACTICE_API_ORIGIN = HOSTED_PRACTICE ? '' : 'http://127.0.0.1:58000';
export const HOSTED_PORTAL_ORIGINS = profile?.portalOrigins ?? [];

export function hostedContextAllowed(context: { mode: string; production: boolean; development: boolean; origin: string },
  origins: readonly string[] = HOSTED_PORTAL_ORIGINS): boolean {
  if (context.mode !== 'hosted-practice' || !context.production || context.development || origins.length < 1) return false;
  let url: URL;
  try { url = new URL(context.origin); } catch { return false; }
  return url.protocol === 'https:' && url.origin === context.origin && !url.username && !url.password
    && !url.port && origins.includes(context.origin);
}
export const recoveryMailbox = HOSTED_PRACTICE ? 'the secure synthetic mail capture' : 'the local test mailbox';
export const recoveryNotice = `If the account is eligible, recovery instructions will be captured in ${recoveryMailbox}. No real email is sent.`;
