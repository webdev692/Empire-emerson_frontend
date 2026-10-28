import { PRACTICE_ENVIRONMENT, type PracticeEnvironment } from './runtimeProfile.ts';
import { API_ORIGIN, PortalRequestError } from './client.ts';

type ReceivedStatus = 'ready' | 'held' | 'withdrawn';
export type OnboardingState = {
  status: 'not_received'; program_id: null; program_title: null; updated_at: null;
} | {
  status: ReceivedStatus; program_id: string; program_title: string; updated_at: string;
};
export interface OnboardingSummary {
  success: true; environment: PracticeEnvironment; learner_id: number; generated_at: string;
  privileged_controls_available: false; onboarding: OnboardingState;
}
const record = (value: unknown): value is Record<string, unknown> => Boolean(value && typeof value === 'object' && !Array.isArray(value));
const owner = (value: unknown): value is number => Number.isSafeInteger(value) && Number(value) > 0;
const uuid = (value: unknown): value is string => typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
const date = (value: unknown): value is string => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value) &&
  Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === value;
const invalid = () => new PortalRequestError(502, 'The onboarding handoff could not be verified. Refresh access and try again.');

export function parseOnboardingSummary(value: unknown, learnerId: number): OnboardingSummary {
  if (!owner(learnerId) || !record(value) || value.success !== true || value.environment !== PRACTICE_ENVIRONMENT ||
    value.learner_id !== learnerId || !date(value.generated_at) || value.privileged_controls_available !== false || !record(value.onboarding)) throw invalid();
  const onboarding = value.onboarding;
  let selected: OnboardingState;
  if (onboarding.status === 'not_received') {
    if (onboarding.program_id !== null || onboarding.program_title !== null || onboarding.updated_at !== null) throw invalid();
    selected = { status: 'not_received', program_id: null, program_title: null, updated_at: null };
  } else {
    if (!['ready', 'held', 'withdrawn'].includes(String(onboarding.status)) || !uuid(onboarding.program_id) ||
      typeof onboarding.program_title !== 'string' || !/^SYNTHETIC \S/.test(onboarding.program_title) || onboarding.program_title.length > 200 ||
      Array.from(onboarding.program_title).some(character => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127) || !date(onboarding.updated_at) ||
      Date.parse(onboarding.updated_at) > Date.parse(value.generated_at)) throw invalid();
    selected = { status: onboarding.status as ReceivedStatus, program_id: onboarding.program_id,
      program_title: onboarding.program_title, updated_at: onboarding.updated_at };
  }
  // Keep the documented learner summary only. HR evidence and source identities never belong in this view.
  return { success: true, environment: PRACTICE_ENVIRONMENT, learner_id: learnerId, generated_at: value.generated_at,
    privileged_controls_available: false, onboarding: selected };
}

export function createOnboardingClient(fetcher: typeof fetch = fetch) {
  return {
    loadOnboarding: async (learnerId: number, signal?: AbortSignal): Promise<OnboardingSummary> => {
      if (!owner(learnerId)) throw invalid();
      let response: Response;
      try {
        response = await fetcher(`${API_ORIGIN}/api/learner/onboarding`, { method: 'GET', credentials: 'include', cache: 'no-store',
          redirect: 'error', referrerPolicy: 'no-referrer', headers: {},
          signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(15000)]) : AbortSignal.timeout(15000) });
      } catch {
        if (signal?.aborted) throw new DOMException('Canceled', 'AbortError');
        throw new PortalRequestError(0, 'The onboarding handoff is unavailable while the synthetic practice backend cannot be reached.');
      }
      if (!response.ok) throw new PortalRequestError(response.status, response.status === 401 ? 'Your session has ended. Sign in to continue.' :
        response.status === 403 || response.status === 404 ? 'The onboarding handoff is unavailable for this account.' :
        response.status === 429 ? 'Too many requests. Please wait and try again.' : 'The onboarding handoff is temporarily unavailable. Please retry.');
      let value: unknown;
      try { value = await response.json(); } catch { throw invalid(); }
      return parseOnboardingSummary(value, learnerId);
    },
  };
}

export const { loadOnboarding } = createOnboardingClient();
