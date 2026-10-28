import { PRACTICE_ENVIRONMENT, type PracticeEnvironment } from './runtimeProfile.ts';
import { API_ORIGIN, PortalRequestError } from './client.ts';
import { answerProblem, downloadVerifiedAttachment, parseAttachment, type AttachmentMetadata } from './assignmentClient.ts';

export interface PublishedFeedback { id: string; comment: string; revision: number; published_at: string; mentor_label: string }
export interface MentorReviewRow {
  receipt_id: string; item_id: string; program_id: string; learner_id: number; learner_label: string;
  program_title: string; assignment_title: string; submitted_at: string; submission_revision: number;
  attempt_number: number;
  review_state: 'not_started' | 'draft' | 'published'; review_revision: number;
}
export interface ReviewQueue { success: true; environment: PracticeEnvironment; mentor_id: number; reviews: MentorReviewRow[] }
export interface ReviewDetail {
  success: true; environment: PracticeEnvironment; mentor_id: number;
  review: Omit<MentorReviewRow, 'review_state' | 'review_revision'> & { answer: string; attachments: AttachmentMetadata[];
    draft: null | { comment: string; revision: number; saved_at: string }; published: PublishedFeedback | null };
}
export type ReviewEnvelope = ReviewDetail;
export interface LearnerFeedback {
  success: true; environment: PracticeEnvironment; learner_id: number; item_id: string; program_id: string;
  receipt_id: string | null; feedback: PublishedFeedback[];
}
const record = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value);
const uuid = (value: unknown): value is string => typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
const id = (value: unknown): value is number => Number.isSafeInteger(value) && Number(value) > 0;
const revision = (value: unknown): value is number => Number.isSafeInteger(value) && Number(value) >= 0 && Number(value) <= 2147483647;
const date = (value: unknown): value is string => typeof value === 'string' && value.length <= 40 && /^\d{4}-\d{2}-\d{2}T/.test(value) && Number.isFinite(Date.parse(value));
const text = (value: unknown): value is string => typeof value === 'string' && value.length > 0 && value.length <= 200;
const syntheticLabel = (value: unknown): value is string => text(value) && value.startsWith('SYNTHETIC ');
const invalid = () => new PortalRequestError(502, 'The review information could not be verified. Reload saved status before continuing.');
export function feedbackProblem(comment: string): string | null { return answerProblem(comment); }
function reviewIdentity(value: Record<string, unknown>): Omit<MentorReviewRow, 'review_state' | 'review_revision'> {
  if (!uuid(value.receipt_id) || !uuid(value.item_id) || !uuid(value.program_id) || !id(value.learner_id) ||
    !syntheticLabel(value.learner_label) || !syntheticLabel(value.program_title) || !text(value.assignment_title) ||
    !date(value.submitted_at) || !revision(value.submission_revision) || value.submission_revision < 1 ||
    !Number.isSafeInteger(value.attempt_number) || Number(value.attempt_number) < 1 || Number(value.attempt_number) > 5 ||
    value.submission_revision < Number(value.attempt_number)) throw invalid();
  return { receipt_id: value.receipt_id, item_id: value.item_id, program_id: value.program_id, learner_id: value.learner_id,
    learner_label: value.learner_label, program_title: value.program_title, assignment_title: value.assignment_title,
    submitted_at: value.submitted_at, submission_revision: value.submission_revision, attempt_number: value.attempt_number as number };
}
function published(value: unknown): PublishedFeedback {
  if (!record(value) || !uuid(value.id) || typeof value.comment !== 'string' || !value.comment.trim() || feedbackProblem(value.comment) ||
    !revision(value.revision) || value.revision < 1 || !date(value.published_at) || !syntheticLabel(value.mentor_label)) throw invalid();
  return { id: value.id, comment: value.comment, revision: value.revision, published_at: value.published_at, mentor_label: value.mentor_label };
}
function envelope(value: unknown, mentorId: number): value is Record<string, unknown> {
  return id(mentorId) && record(value) && value.success === true && value.environment === PRACTICE_ENVIRONMENT && value.mentor_id === mentorId;
}
export function parseReviewQueue(value: unknown, mentorId: number): ReviewQueue {
  if (!envelope(value, mentorId) || !Array.isArray(value.reviews) || value.reviews.length > 100) throw invalid();
  const reviews = value.reviews.map(row => {
    if (!record(row) || !['not_started', 'draft', 'published'].includes(String(row.review_state)) || !revision(row.review_revision) ||
      (row.review_state === 'not_started' ? row.review_revision !== 0 : row.review_revision < 1)) throw invalid();
    return { ...reviewIdentity(row), review_state: row.review_state as MentorReviewRow['review_state'], review_revision: row.review_revision };
  });
  if (new Set(reviews.map(row => row.receipt_id)).size !== reviews.length) throw invalid();
  return { success: true, environment: PRACTICE_ENVIRONMENT, mentor_id: mentorId, reviews };
}
export function parseReview(value: unknown, mentorId: number, receiptId: string): ReviewDetail {
  if (!uuid(receiptId) || !envelope(value, mentorId) || !record(value.review) || value.review.receipt_id !== receiptId) throw invalid();
  const review = value.review; const identity = reviewIdentity(review);
  if (typeof review.answer !== 'string' || !review.answer.trim() || answerProblem(review.answer) || !Array.isArray(review.attachments) || review.attachments.length > 3) throw invalid();
  const attachments = review.attachments.map(parseAttachment);
  if (new Set(attachments.map(file => file.id)).size !== attachments.length) throw invalid();
  let draft: ReviewDetail['review']['draft'] = null;
  if (review.draft !== null) {
    if (!record(review.draft) || typeof review.draft.comment !== 'string' || feedbackProblem(review.draft.comment) ||
      !revision(review.draft.revision) || review.draft.revision < 1 || !date(review.draft.saved_at)) throw invalid();
    draft = { comment: review.draft.comment, revision: review.draft.revision, saved_at: review.draft.saved_at };
  }
  const feedback = review.published === null ? null : published(review.published);
  if (feedback && (!draft || feedback.revision !== draft.revision || feedback.comment !== draft.comment)) throw invalid();
  return { success: true, environment: PRACTICE_ENVIRONMENT, mentor_id: mentorId,
    review: { ...identity, answer: review.answer, attachments, draft, published: feedback } };
}
export function parseLearnerFeedback(value: unknown, learnerId: number, programId: string, itemId: string, receiptId: string | null): LearnerFeedback {
  if (!id(learnerId) || !uuid(programId) || !uuid(itemId) || (receiptId !== null && !uuid(receiptId)) || !record(value) ||
    value.success !== true || value.environment !== PRACTICE_ENVIRONMENT || value.learner_id !== learnerId || value.item_id !== itemId || value.program_id !== programId ||
    value.receipt_id !== receiptId || !Array.isArray(value.feedback) || value.feedback.length > 100 || (receiptId === null && value.feedback.length)) throw invalid();
  const feedback = value.feedback.map(published);
  if (new Set(feedback.map(row => row.id)).size !== feedback.length) throw invalid();
  return { success: true, environment: PRACTICE_ENVIRONMENT, learner_id: learnerId, item_id: itemId, program_id: programId, receipt_id: receiptId, feedback };
}
export function createReviewClient(fetcher: typeof fetch = fetch) {
  async function request(path: string, body?: object, csrf?: string, signal?: AbortSignal): Promise<unknown> {
    if (body && !/^[A-Za-z0-9_-]{43}$/.test(csrf ?? '')) throw new PortalRequestError(403, 'Request verification failed. Recheck account access.');
    let response: Response;
    try {
      response = await fetcher(`${API_ORIGIN}/api${path}`, { method: body ? 'POST' : 'GET', credentials: 'include', cache: 'no-store',
        redirect: 'error', referrerPolicy: 'no-referrer', signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(15000)]) : AbortSignal.timeout(15000),
        headers: body ? { 'Content-Type': 'application/json', 'X-EPDG-Request': 'portal', 'X-CSRF-Token': csrf! } : {},
        ...(body ? { body: JSON.stringify(body) } : {}) });
    } catch {
      if (signal?.aborted) throw new DOMException('Canceled', 'AbortError');
      throw new PortalRequestError(0, 'The synthetic practice backend could not be reached. Recheck saved review status before retrying a change.');
    }
    if (!response.ok) throw new PortalRequestError(response.status,
      response.status === 401 ? 'Your session has ended. Sign in to continue.' :
      response.status === 403 || response.status === 404 ? 'This review is unavailable for your current assignment access.' :
      response.status === 409 ? 'The saved review changed or was already published. Reload its saved status before continuing.' :
      response.status === 400 ? 'Check the feedback and saved revision before trying again.' :
      response.status === 429 ? 'Too many attempts. Wait before trying again.' : 'The review request could not be confirmed. Reload saved status before retrying.');
    try { return await response.json(); } catch { throw invalid(); }
  }
  function identifiers(mentorId: number, receiptId?: string) {
    if (!id(mentorId) || (receiptId !== undefined && !uuid(receiptId))) throw new PortalRequestError(404, 'This review is unavailable.');
  }
  return {
    loadReviewQueue: async (mentorId: number, signal?: AbortSignal) => {
      identifiers(mentorId); return parseReviewQueue(await request('/mentor/reviews', undefined, undefined, signal), mentorId);
    },
    loadReview: async (receiptId: string, mentorId: number, signal?: AbortSignal) => {
      identifiers(mentorId, receiptId); return parseReview(await request(`/mentor/reviews/${receiptId}`, undefined, undefined, signal), mentorId, receiptId);
    },
    saveReviewDraft: async (receiptId: string, mentorId: number, comment: string, expectedRevision: number, csrf: string, signal?: AbortSignal) => {
      identifiers(mentorId, receiptId); const problem = feedbackProblem(comment);
      if (problem || !revision(expectedRevision) || expectedRevision === 2147483647) throw new PortalRequestError(400, problem ?? 'Invalid saved revision.');
      const result = parseReview(await request(`/mentor/reviews/${receiptId}/draft`, { comment, expected_revision: expectedRevision }, csrf, signal), mentorId, receiptId);
      if (!result.review.draft || result.review.published || result.review.draft.comment !== comment || result.review.draft.revision !== expectedRevision + 1) throw invalid();
      return result;
    },
    publishReview: async (receiptId: string, mentorId: number, expectedRevision: number, csrf: string, signal?: AbortSignal) => {
      identifiers(mentorId, receiptId);
      if (!revision(expectedRevision) || expectedRevision < 1) throw new PortalRequestError(400, 'Save feedback before publishing.');
      const result = parseReview(await request(`/mentor/reviews/${receiptId}/publish`, { expected_revision: expectedRevision }, csrf, signal), mentorId, receiptId);
      if (!result.review.published || result.review.published.revision !== expectedRevision) throw invalid();
      return result;
    },
    downloadReviewAttachment: async (receiptId: string, mentorId: number, file: AttachmentMetadata, signal?: AbortSignal) => {
      identifiers(mentorId, receiptId); return downloadVerifiedAttachment(fetcher, 'mentor/reviews', receiptId, file, signal);
    },
    loadAssignmentFeedback: async (itemId: string, programId: string, learnerId: number, receiptId: string | null, signal?: AbortSignal) => {
      if (!id(learnerId) || !uuid(itemId) || !uuid(programId) || (receiptId !== null && !uuid(receiptId))) throw new PortalRequestError(404, 'Feedback is unavailable.');
      return parseLearnerFeedback(await request(`/learner/assignments/${itemId}/feedback`, undefined, undefined, signal), learnerId, programId, itemId, receiptId);
    },
  };
}
const client = createReviewClient();
export const { loadReviewQueue, loadReview, saveReviewDraft, publishReview, downloadReviewAttachment, loadAssignmentFeedback } = client;
