import { PRACTICE_ENVIRONMENT, type PracticeEnvironment } from './runtimeProfile.ts';
import { API_ORIGIN, PortalRequestError } from './client.ts';
import { answerProblem, parseAttachment, type AttachmentMetadata } from './assignmentClient.ts';
import { parseLearnerFeedback, type PublishedFeedback } from './reviewClient.ts';

export interface AssignmentAttempt {
  receipt_id: string; attempt_number: number; answer: string; attachments: AttachmentMetadata[];
  submitted_at: string; submission_revision: number; published_feedback: PublishedFeedback[];
}
export interface AssignmentAttempts {
  success: true; environment: PracticeEnvironment; learner_id: number; item_id: string; program_id: string;
  attempts: AssignmentAttempt[];
}
const record = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const uuid = (v: unknown): v is string => typeof v === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
const date = (v: unknown): v is string => typeof v === 'string' && v.length <= 40 && /^\d{4}-\d{2}-\d{2}T/.test(v) && Number.isFinite(Date.parse(v));
const invalid = () => new PortalRequestError(502, 'The submitted attempt history could not be verified. Refresh its saved status.');
export function parseAssignmentAttempts(value: unknown, learnerId: number, programId: string, itemId: string): AssignmentAttempts {
  if (!Number.isSafeInteger(learnerId) || learnerId <= 0 || !uuid(programId) || !uuid(itemId) || !record(value) ||
    value.success !== true || value.environment !== PRACTICE_ENVIRONMENT || value.learner_id !== learnerId ||
    value.item_id !== itemId || value.program_id !== programId || !Array.isArray(value.attempts) || value.attempts.length > 5) throw invalid();
  const attempts = value.attempts.map((row, index): AssignmentAttempt => {
    if (!record(row) || !uuid(row.receipt_id) || row.attempt_number !== index + 1 || typeof row.answer !== 'string' ||
      !row.answer.trim() || answerProblem(row.answer) || !date(row.submitted_at) || !Number.isSafeInteger(row.submission_revision) ||
      Number(row.submission_revision) < index + 1 || Number(row.submission_revision) > 2147483647 ||
      !Array.isArray(row.attachments) || row.attachments.length > 3) throw invalid();
    const attachments = row.attachments.map(parseAttachment);
    const feedback = parseLearnerFeedback({ success: true, environment: PRACTICE_ENVIRONMENT, learner_id: learnerId,
      item_id: itemId, program_id: programId, receipt_id: row.receipt_id, feedback: row.published_feedback }, learnerId, programId, itemId, row.receipt_id).feedback;
    return { receipt_id: row.receipt_id, attempt_number: index + 1, answer: row.answer, attachments,
      submitted_at: row.submitted_at, submission_revision: row.submission_revision as number, published_feedback: feedback };
  });
  if (new Set(attempts.map(row => row.receipt_id)).size !== attempts.length ||
    attempts.some((row, index) => index > 0 && row.submission_revision <= attempts[index - 1].submission_revision)) throw invalid();
  const fileIds = attempts.flatMap(row => row.attachments.map(file => file.id));
  const feedbackIds = attempts.flatMap(row => row.published_feedback.map(feedback => feedback.id));
  if (new Set(fileIds).size !== fileIds.length || new Set(feedbackIds).size !== feedbackIds.length) throw invalid();
  return { success: true, environment: PRACTICE_ENVIRONMENT, learner_id: learnerId, item_id: itemId, program_id: programId, attempts };
}
export function createRevisionClient(fetcher: typeof fetch = fetch) {
  return {
    loadAssignmentAttempts: async (itemId: string, programId: string, learnerId: number, signal?: AbortSignal): Promise<AssignmentAttempts> => {
      if (!uuid(itemId) || !uuid(programId) || !Number.isSafeInteger(learnerId) || learnerId <= 0) throw new PortalRequestError(404, 'Assignment history is unavailable.');
      let response: Response;
      try {
        response = await fetcher(`${API_ORIGIN}/api/learner/assignments/${itemId}/attempts`, { method: 'GET',
          credentials: 'include', cache: 'no-store', redirect: 'error', referrerPolicy: 'no-referrer',
          signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(15000)]) : AbortSignal.timeout(15000) });
      } catch {
        if (signal?.aborted) throw new DOMException('Canceled', 'AbortError');
        throw new PortalRequestError(0, 'The synthetic practice backend could not be reached. Refresh attempt history when connected.');
      }
      if (!response.ok) throw new PortalRequestError(response.status,
        response.status === 401 ? 'Your session has ended. Sign in to continue.' :
        response.status === 403 || response.status === 404 ? 'Assignment history is unavailable for your current access.' :
        'Submitted attempt history could not be loaded. Please try again.');
      let value: unknown;
      try { value = await response.json(); } catch { throw invalid(); }
      return parseAssignmentAttempts(value, learnerId, programId, itemId);
    },
  };
}
export const { loadAssignmentAttempts } = createRevisionClient();
