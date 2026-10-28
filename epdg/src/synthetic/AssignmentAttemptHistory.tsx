import { useEffect, useId, useState } from 'react';
import { PortalRequestError, type Session } from './client';
import type { AttachmentMetadata } from './assignmentClient';
import { loadAssignmentAttempts, type AssignmentAttempts } from './revisionClient';
import './assignment.css';

type Props = { session: Session; itemId: string; programId: string; currentAttempt: number; currentReceiptId: string | null;
  busy: boolean; onDownload: (receiptId: string, file: AttachmentMetadata) => void; onAuthenticationRequired: () => void; onUnavailable: () => void; onNewerAttempt: () => void };
type View = { status: 'loading' } | { status: 'ready'; data: AssignmentAttempts; session: Session; attempt: number; receiptId: string | null } |
  { status: 'error'; message: string };

export default function AssignmentAttemptHistory({ session, itemId, programId, currentAttempt, currentReceiptId, busy, onDownload, onAuthenticationRequired, onUnavailable, onNewerAttempt }: Props) {
  const [view, setView] = useState<View>({ status: 'loading' });
  const [reload, setReload] = useState(0);
  const headingId = useId();
  const learnerId = session.user.id;
  useEffect(() => {
    const controller = new AbortController();
    const task = async () => {
      try {
        const data = await loadAssignmentAttempts(itemId, programId, learnerId, controller.signal);
        if (!controller.signal.aborted) setView({ status: 'ready', data, session, attempt: currentAttempt, receiptId: currentReceiptId });
      } catch (error) {
        if (controller.signal.aborted) return;
        if (error instanceof PortalRequestError && error.status === 401) { onAuthenticationRequired(); return; }
        if (error instanceof PortalRequestError && [403, 404].includes(error.status)) { onUnavailable(); return; }
        setView({ status: 'error', message: 'Earlier attempts could not be loaded. Your current answer has been kept. Try loading the history again.' });
      }
    };
    void task(); return () => { controller.abort(); };
  }, [session, learnerId, itemId, programId, currentAttempt, currentReceiptId, reload, onAuthenticationRequired, onUnavailable]);
  const ready = view.status === 'ready' && view.session === session && view.attempt === currentAttempt && view.receiptId === currentReceiptId ? view.data : null;
  const newerSavedAttempt = ready?.attempts.some(attempt => attempt.attempt_number > currentAttempt ||
    (attempt.attempt_number === currentAttempt && attempt.receipt_id !== currentReceiptId)) ?? false;
  const earlier = ready?.attempts.filter(attempt => attempt.attempt_number < currentAttempt) ?? [];
  useEffect(() => { if (newerSavedAttempt) onNewerAttempt(); }, [newerSavedAttempt, onNewerAttempt]);
  return <section className="sp-attempt-history" aria-labelledby={headingId}>
    <div className="sp-attempt-history-top"><h5 id={headingId}>Earlier submitted attempts</h5><button type="button" onClick={() => setReload(value => value + 1)} disabled={busy}>Refresh attempt history</button></div>
    <p className="sp-note">Earlier receipts, answers, files and published feedback stay read-only. Feedback belongs to the attempt shown with it.</p>
    {!ready && view.status !== 'error' ? <p role="status">Loading submitted attempt history…</p> : null}
    {view.status === 'error' ? <p className="sp-assignment-error" role="alert">{view.message}</p> : null}
    {newerSavedAttempt ? <p className="sp-assignment-error" role="alert">Another saved submission was found. Reload the current assignment status before continuing; your answer has been kept in its form.</p> : null}
    {ready ? earlier.length === 0 ? <p className="sp-note">There are no earlier submitted attempts. The current submission is shown above when available.</p> :
      <ol className="sp-attempt-list">{earlier.map(attempt => <li key={attempt.receipt_id}><details><summary>Attempt {attempt.attempt_number}<span> · Submitted <time dateTime={attempt.submitted_at}>{new Date(attempt.submitted_at).toLocaleString()}</time></span></summary>
        <dl className="sp-attempt-facts"><div><dt>Receipt reference</dt><dd><code>{attempt.receipt_id}</code></dd></div><div><dt>Submitted revision</dt><dd>{attempt.submission_revision}</dd></div></dl>
        <h6>Submitted answer</h6><p className="sp-assignment-answer">{attempt.answer}</p>
        <h6>Files submitted with attempt {attempt.attempt_number}</h6>
        {attempt.attachments.length === 0 ? <p className="sp-note">No files were included with this attempt.</p> : <ul className="sp-assignment-files">{attempt.attachments.map(file => <li key={file.id}>
          <div className="sp-assignment-file-heading"><strong>{file.filename}</strong><span>{file.size_bytes.toLocaleString()} bytes · {file.media_type}</span></div>
          <details><summary>File details<span className="sp-sr-only">: attempt {attempt.attempt_number}, {file.filename}</span></summary><dl><div><dt>Uploaded</dt><dd><time dateTime={file.uploaded_at}>{new Date(file.uploaded_at).toLocaleString()}</time></dd></div><div><dt>SHA-256</dt><dd><code>{file.sha256}</code></dd></div></dl></details>
          <button type="button" onClick={() => onDownload(attempt.receipt_id, file)} disabled={busy}>Download attempt {attempt.attempt_number} file<span className="sp-sr-only">: {file.filename}</span></button>
        </li>)}</ul>}
        <h6>Published feedback for attempt {attempt.attempt_number}</h6>
        {attempt.published_feedback.length === 0 ? <p className="sp-note">No published feedback is available for this attempt.</p> : <ul className="sp-feedback-published">{attempt.published_feedback.map(feedback => <li key={feedback.id}>
          <p className="sp-assignment-answer">{feedback.comment}</p><p className="sp-note">{feedback.mentor_label} · <time dateTime={feedback.published_at}>{new Date(feedback.published_at).toLocaleString()}</time></p>
        </li>)}</ul>}
      </details></li>)}</ol> : null}
  </section>;
}
