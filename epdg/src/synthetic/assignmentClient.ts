import { PRACTICE_ENVIRONMENT, type PracticeEnvironment } from './runtimeProfile.ts';
import { API_ORIGIN, PortalRequestError } from './client.ts';

export interface AttachmentMetadata {
  id: string; filename: string; media_type: string; size_bytes: number; sha256: string; uploaded_at: string;
}
export interface AssignmentRecord {
  item_id: string; program_id: string; state: 'not_started' | 'draft' | 'submitted';
  attempt_number: number; previous_receipt_id: string | null; can_start_revision: boolean;
  answer: string; revision: number; saved_at: string | null;
  receipt: null | { id: string; submitted_at: string; revision: number };
  attachments: AttachmentMetadata[]; removed_attachments: AttachmentMetadata[];
}
export interface SubmissionEnvelope {
  success: true; environment: PracticeEnvironment; learner_id: number; submission: AssignmentRecord;
}
const record = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const uuid = (v: unknown): v is string => typeof v === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
const date = (v: unknown): v is string => typeof v === 'string' && v.length <= 40 && /^\d{4}-\d{2}-\d{2}T/.test(v) && Number.isFinite(Date.parse(v));
const revision = (v: unknown): v is number => Number.isSafeInteger(v) && Number(v) >= 0 && Number(v) <= 2147483647;
const mediaTypes: Record<string, string> = { txt: 'text/plain', pdf: 'application/pdf', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg' };
const mediaFor = (name: string) => mediaTypes[name.split('.').at(-1)?.toLowerCase() ?? ''];
export function attachmentProblem(file: Pick<File, 'name' | 'size' | 'type'>): string | null {
  if (!Number.isSafeInteger(file.size) || file.size < 1 || file.size > 1048576) return 'Choose a nonempty file no larger than 1 MiB.';
  if (!/^[A-Za-z0-9][A-Za-z0-9 ._-]{0,99}$/.test(file.name) || file.name.includes('..') || /[ .]$/.test(file.name)) return 'Use a filename of at most 100 ASCII letters, numbers, spaces, periods, hyphens or underscores, starting with a letter or number.';
  const media = mediaFor(file.name);
  if (!media) return 'Choose a TXT, PDF, PNG or JPEG practice file.';
  if (file.type && file.type !== 'application/octet-stream' && file.type !== media) return 'The file type must match its filename extension.';
  return null;
}
export function parseAttachment(value: unknown): AttachmentMetadata {
  if (!record(value) || !uuid(value.id) || typeof value.filename !== 'string' || typeof value.media_type !== 'string' ||
    typeof value.size_bytes !== 'number' || attachmentProblem({ name: value.filename, size: value.size_bytes, type: value.media_type }) ||
    mediaFor(value.filename) !== value.media_type || typeof value.sha256 !== 'string' || !/^[0-9a-f]{64}$/.test(value.sha256) || !date(value.uploaded_at)) {
    throw new PortalRequestError(502, 'The saved file metadata could not be verified. Reload saved status.');
  }
  return { id: value.id, filename: value.filename, media_type: value.media_type, size_bytes: value.size_bytes, sha256: value.sha256, uploaded_at: value.uploaded_at };
}
async function checksum(bytes: ArrayBuffer): Promise<string> {
  return [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map(byte => byte.toString(16).padStart(2, '0')).join('');
}
export async function downloadVerifiedAttachment(fetcher: typeof fetch, scope: 'learner/assignments' | 'mentor/reviews', recordId: string, metadata: AttachmentMetadata, signal?: AbortSignal, attemptReceiptId?: string): Promise<{ blob: Blob; filename: string }> {
  const file = parseAttachment(metadata);
  if (!uuid(recordId) || !['learner/assignments', 'mentor/reviews'].includes(scope) ||
    (attemptReceiptId !== undefined && (scope !== 'learner/assignments' || !uuid(attemptReceiptId)))) throw new PortalRequestError(404, 'This file is unavailable.');
  const attemptPath = attemptReceiptId === undefined ? '' : `/attempts/${attemptReceiptId}`;
  let response: Response;
  try {
    response = await fetcher(`${API_ORIGIN}/api/${scope}/${recordId}${attemptPath}/attachments/${file.id}/download`, {
      method: 'GET', credentials: 'include', cache: 'no-store', redirect: 'error', referrerPolicy: 'no-referrer',
      signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(15000)]) : AbortSignal.timeout(15000),
    });
  } catch {
    if (signal?.aborted) throw new DOMException('Canceled', 'AbortError');
    throw new PortalRequestError(0, 'The file could not be downloaded. Check your connection and try again.');
  }
  if (!response.ok) throw new PortalRequestError(response.status, response.status === 401 ? 'Your session has ended. Sign in to continue.' : 'The file is unavailable for your current access.');
  const invalid = () => new PortalRequestError(502, 'The downloaded file did not match its saved record. Nothing was downloaded.');
  if (response.status !== 200 || response.headers.get('Content-Type') !== 'application/octet-stream' || !response.body ||
    (response.headers.get('Content-Length') !== null && response.headers.get('Content-Length') !== String(file.size_bytes))) { await response.body?.cancel(); throw invalid(); }
  const reader = response.body.getReader(); const chunks: Uint8Array[] = []; let size = 0;
  try {
    for (;;) {
      const chunk = await reader.read(); if (chunk.done) break;
      size += chunk.value.length;
      if (size > file.size_bytes || size > 1048576) { await reader.cancel(); throw invalid(); }
      chunks.push(chunk.value);
    }
  } catch (error) {
    if (signal?.aborted) throw new DOMException('Canceled', 'AbortError');
    if (error instanceof PortalRequestError) throw error;
    throw new PortalRequestError(0, 'The file download was interrupted. Please try again.');
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  if (size !== file.size_bytes || await checksum(bytes.buffer) !== file.sha256) throw invalid();
  if (signal?.aborted) throw new DOMException('Canceled', 'AbortError');
  return { blob: new Blob([bytes.buffer], { type: 'application/octet-stream' }), filename: file.filename };
}
export function answerProblem(answer: string): string | null {
  if (answer.length > 4000) return 'Use at most 4,000 characters.';
  const encoded = new TextEncoder().encode(answer);
  if (encoded.length > 12000) return 'Use at most 12,000 UTF-8 bytes.';
  if (new TextDecoder().decode(encoded) !== answer) return 'Use valid Unicode text.';
  if (answer.includes('\0')) return 'Remove the unsupported null character.';
  return null;
}
export function parseSubmission(value: unknown, ownerId: number, programId: string, itemId: string): SubmissionEnvelope {
  const invalid = () => new PortalRequestError(502, 'The saved assignment status could not be verified. Reload its status before trying again.');
  if (!record(value) || value.success !== true || value.environment !== PRACTICE_ENVIRONMENT || value.learner_id !== ownerId ||
    !Number.isSafeInteger(ownerId) || ownerId <= 0 || !uuid(programId) || !uuid(itemId) || !record(value.submission)) throw invalid();
  const s = value.submission;
  if (s.item_id !== itemId || s.program_id !== programId || typeof s.answer !== 'string' || answerProblem(s.answer) || !revision(s.revision) ||
    !['not_started', 'draft', 'submitted'].includes(String(s.state))) throw invalid();
  if (!Number.isSafeInteger(s.attempt_number) || Number(s.attempt_number) < 1 || Number(s.attempt_number) > 5 ||
    (s.attempt_number === 1 ? s.previous_receipt_id !== null : !uuid(s.previous_receipt_id)) || typeof s.can_start_revision !== 'boolean' ||
    (s.can_start_revision && (s.state !== 'submitted' || s.attempt_number === 5))) throw invalid();
  if (!Array.isArray(s.attachments) || !Array.isArray(s.removed_attachments) || s.attachments.length > 3 || s.attachments.length + s.removed_attachments.length > 6) throw invalid();
  const attachments = s.attachments.map(parseAttachment); const removed = s.removed_attachments.map(parseAttachment);
  if (new Set([...attachments, ...removed].map(file => file.id)).size !== attachments.length + removed.length) throw invalid();
  if ((s.state === 'not_started' && (attachments.length || removed.length)) || (s.state === 'submitted' && removed.length)) throw invalid();
  if (s.state === 'not_started') {
    if (s.revision !== 0 || s.answer !== '' || s.saved_at !== null || s.receipt !== null || s.attempt_number !== 1) throw invalid();
  } else {
    if (s.revision < Number(s.attempt_number) || !date(s.saved_at)) throw invalid();
    if (s.state === 'draft' && s.receipt !== null) throw invalid();
    if (s.state === 'submitted' && (!s.answer.trim() || !record(s.receipt) || !uuid(s.receipt.id) || !date(s.receipt.submitted_at) || s.receipt.revision !== s.revision)) throw invalid();
    if (record(s.receipt) && s.receipt.id === s.previous_receipt_id) throw invalid();
  }
  return { success: true, environment: PRACTICE_ENVIRONMENT, learner_id: ownerId,
    submission: { item_id: itemId, program_id: programId, state: s.state as AssignmentRecord['state'], answer: s.answer,
      attempt_number: s.attempt_number as number, previous_receipt_id: s.previous_receipt_id as string | null, can_start_revision: s.can_start_revision,
      revision: s.revision, saved_at: s.saved_at as string | null, attachments, removed_attachments: removed,
      receipt: s.receipt === null ? null : { id: (s.receipt as Record<string, unknown>).id as string,
        submitted_at: (s.receipt as Record<string, unknown>).submitted_at as string, revision: s.revision } } };
}
export function createAssignmentClient(fetcher: typeof fetch = fetch) {
  function transportError(status: number): PortalRequestError {
    return new PortalRequestError(status,
      status === 401 ? 'Your session has ended. Sign in to continue.' :
      status === 403 ? 'This assignment action is unavailable for your current access.' :
      status === 404 ? 'This assignment or file is unavailable for your account.' :
      status === 409 ? 'The saved draft changed or was already submitted. Reload its saved status before continuing.' :
      status === 413 ? 'Choose a nonempty file no larger than 1 MiB.' :
      status === 415 ? 'Choose a supported file whose content matches its type.' :
      status === 400 || status === 422 ? 'Check the answer, file and saved revision before trying again.' :
      status === 429 ? 'Too many attempts. Please wait and try again.' : 'The assignment request could not be confirmed. Reload its saved status before retrying.');
  }
  async function request(itemId: string, programId: string, ownerId: number, action: string, body?: object, csrf?: string, signal?: AbortSignal) {
    if (!uuid(itemId) || !uuid(programId) || !Number.isSafeInteger(ownerId) || ownerId <= 0) throw new PortalRequestError(404, 'This assignment is unavailable.');
    if (body && !/^[A-Za-z0-9_-]{43}$/.test(csrf ?? '')) throw new PortalRequestError(403, 'Request verification failed. Recheck account access before trying again.');
    let response: Response;
    try {
      response = await fetcher(`${API_ORIGIN}/api/learner/assignments/${itemId}/${action}`, { method: body ? 'POST' : 'GET',
        credentials: 'include', cache: 'no-store', redirect: 'error', referrerPolicy: 'no-referrer',
        signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(15000)]) : AbortSignal.timeout(15000),
        headers: body ? { ...(body instanceof FormData ? {} : { 'Content-Type': 'application/json' }), 'X-EPDG-Request': 'portal', 'X-CSRF-Token': csrf! } : {},
        ...(body ? { body: body instanceof FormData ? body : JSON.stringify(body) } : {}) });
    } catch {
      if (signal?.aborted) throw new DOMException('Canceled', 'AbortError');
      throw new PortalRequestError(0, 'The backend could not be reached. Your latest saved status must be checked before retrying a submission.');
    }
    if (!response.ok) throw transportError(response.status);
    let data: unknown;
    try { data = await response.json(); } catch { throw new PortalRequestError(502, 'The saved assignment status could not be verified.'); }
    return parseSubmission(data, ownerId, programId, itemId);
  }
  async function changeAttachment(itemId: string, programId: string, ownerId: number, attachmentId: string, expectedRevision: number, csrf: string, action: 'remove' | 'restore', signal?: AbortSignal) {
    if (!uuid(attachmentId) || !revision(expectedRevision) || expectedRevision < 1 || expectedRevision === 2147483647) throw new PortalRequestError(400, 'Save and reload the current draft before changing files.');
    const result = await request(itemId, programId, ownerId, `attachments/${attachmentId}/${action}`, { expected_revision: expectedRevision }, csrf, signal);
    const active = result.submission.attachments.some(file => file.id === attachmentId);
    const removed = result.submission.removed_attachments.some(file => file.id === attachmentId);
    if (result.submission.state !== 'draft' || result.submission.revision !== expectedRevision + 1 ||
      (action === 'remove' ? active || !removed : !active || removed)) throw new PortalRequestError(502, 'The file change could not be confirmed. Reload saved status.');
    return result;
  }
  return {
    loadSubmission: (itemId: string, programId: string, ownerId: number, signal?: AbortSignal) => request(itemId, programId, ownerId, 'submission', undefined, undefined, signal),
    saveDraft: async (itemId: string, programId: string, ownerId: number, answer: string, expectedRevision: number, csrf: string, signal?: AbortSignal) => {
      const problem = answerProblem(answer);
      if (problem || !revision(expectedRevision) || expectedRevision === 2147483647) return Promise.reject(new PortalRequestError(400, problem ?? 'Invalid saved revision.'));
      const result = await request(itemId, programId, ownerId, 'draft', { answer, expected_revision: expectedRevision }, csrf, signal);
      if (result.submission.state !== 'draft' || result.submission.revision !== expectedRevision + 1 || result.submission.answer !== answer) throw new PortalRequestError(502, 'The draft save could not be confirmed. Reload its saved status.');
      return result;
    },
    submitAssignment: async (itemId: string, programId: string, ownerId: number, expectedRevision: number, csrf: string, signal?: AbortSignal) => {
      if (!revision(expectedRevision) || expectedRevision === 0) return Promise.reject(new PortalRequestError(400, 'Save your answer before submitting it.'));
      const result = await request(itemId, programId, ownerId, 'submit', { expected_revision: expectedRevision }, csrf, signal);
      if (result.submission.state !== 'submitted' || result.submission.revision !== expectedRevision) throw new PortalRequestError(502, 'Submission could not be confirmed. Reload its saved status.');
      return result;
    },
    startRevision: async (itemId: string, programId: string, ownerId: number, receiptId: string, expectedRevision: number, csrf: string, signal?: AbortSignal) => {
      if (!uuid(receiptId) || !revision(expectedRevision) || expectedRevision < 1 || expectedRevision === 2147483647) throw new PortalRequestError(400, 'Reload the latest submitted receipt before starting a revision.');
      const result = await request(itemId, programId, ownerId, 'start-revision', { expected_receipt_id: receiptId, expected_revision: expectedRevision }, csrf, signal);
      const s = result.submission;
      if (s.state !== 'draft' || s.attempt_number < 2 || s.previous_receipt_id !== receiptId || s.revision !== expectedRevision + 1 ||
        !s.answer.trim() || s.attachments.length || s.removed_attachments.length || s.can_start_revision) throw new PortalRequestError(502, 'The new revision could not be confirmed. Reload saved status before retrying.');
      return result;
    },
    uploadAttachment: async (itemId: string, programId: string, ownerId: number, file: File, expectedRevision: number, csrf: string, signal?: AbortSignal) => {
      const problem = attachmentProblem(file);
      if (problem || !revision(expectedRevision) || expectedRevision < 1 || expectedRevision === 2147483647) throw new PortalRequestError(400, problem ?? 'Save the text draft before uploading a file.');
      const sha256 = await checksum(await file.arrayBuffer());
      const form = new FormData(); form.append('expected_revision', String(expectedRevision)); form.append('file', file, file.name);
      const result = await request(itemId, programId, ownerId, 'attachments', form, csrf, signal);
      if (result.submission.state !== 'draft' || result.submission.revision !== expectedRevision + 1 ||
        !result.submission.attachments.some(saved => saved.filename === file.name && saved.size_bytes === file.size && saved.media_type === mediaFor(file.name) && saved.sha256 === sha256)) {
        throw new PortalRequestError(502, 'The file upload could not be confirmed. Reload saved status.');
      }
      return result;
    },
    removeAttachment: (itemId: string, programId: string, ownerId: number, attachmentId: string, expectedRevision: number, csrf: string, signal?: AbortSignal) => changeAttachment(itemId, programId, ownerId, attachmentId, expectedRevision, csrf, 'remove', signal),
    restoreAttachment: (itemId: string, programId: string, ownerId: number, attachmentId: string, expectedRevision: number, csrf: string, signal?: AbortSignal) => changeAttachment(itemId, programId, ownerId, attachmentId, expectedRevision, csrf, 'restore', signal),
    downloadAttachment: async (itemId: string, programId: string, ownerId: number, metadata: AttachmentMetadata, signal?: AbortSignal): Promise<{ blob: Blob; filename: string }> => {
      if (!uuid(itemId) || !uuid(programId) || !Number.isSafeInteger(ownerId) || ownerId <= 0) throw new PortalRequestError(404, 'This assignment is unavailable.');
      return downloadVerifiedAttachment(fetcher, 'learner/assignments', itemId, metadata, signal);
    },
    downloadAttemptAttachment: async (itemId: string, programId: string, ownerId: number, receiptId: string, metadata: AttachmentMetadata, signal?: AbortSignal): Promise<{ blob: Blob; filename: string }> => {
      if (!uuid(itemId) || !uuid(programId) || !uuid(receiptId) || !Number.isSafeInteger(ownerId) || ownerId <= 0) throw new PortalRequestError(404, 'This submitted file is unavailable.');
      return downloadVerifiedAttachment(fetcher, 'learner/assignments', itemId, metadata, signal, receiptId);
    },
  };
}
const client = createAssignmentClient();
export const { loadSubmission, saveDraft, submitAssignment, startRevision, uploadAttachment, removeAttachment, restoreAttachment, downloadAttachment, downloadAttemptAttachment } = client;
