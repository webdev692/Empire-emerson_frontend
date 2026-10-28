import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { PortalRequestError, type Session } from './client';
import { downloadReviewAttachment, feedbackProblem, loadReview, loadReviewQueue, publishReview, saveReviewDraft,
  type ReviewDetail, type ReviewQueue } from './reviewClient';
import type { AttachmentMetadata } from './assignmentClient';
import './mentor.css';

type Props = { session: Session; onAuthenticationRequired: () => void; onMutationBusy?: (busy: boolean) => void };
type Review = ReviewDetail['review'];
type View = { status: 'loading' } | { status: 'ready'; queue: ReviewQueue; detail: ReviewDetail | null; selection: string | null; verifiedSession: Session } |
  { status: 'error' | 'unavailable'; message: string };
type Action = 'saving' | 'publishing' | 'reloading' | 'downloading';

function Timestamp({ value }: { value: string }) {
  return <time dateTime={value}>{new Date(value).toLocaleString()}</time>;
}

function MentorReviewEditor({ session, review, onAuthenticationRequired, onUnavailable, onChanged, onMutationBusy }: Props & {
  review: Review; onUnavailable: () => void; onChanged: () => void;
}) {
  const [current, setCurrent] = useState(review);
  const [comment, setComment] = useState(review.draft?.comment ?? '');
  const [phase, setPhase] = useState<'editing' | 'review'>('editing');
  const [busy, setBusy] = useState<Action | null>(null);
  const [notice, setNotice] = useState('');
  const [failure, setFailure] = useState('');
  const [needsReload, setNeedsReload] = useState(false);
  const alive = useRef(false);
  const lock = useRef(false);
  const request = useRef<AbortController | null>(null);
  const busyCallback = useRef(onMutationBusy);
  const urls = useRef<Set<string>>(new Set());
  const focusTarget = useRef<'review' | 'published' | 'editor' | null>(null);
  const reviewHeading = useRef<HTMLHeadingElement>(null);
  const publishedHeading = useRef<HTMLHeadingElement>(null);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const fieldId = useId();
  const revision = current.draft?.revision ?? current.published?.revision ?? 0;
  const remoteRevision = review.draft?.revision ?? review.published?.revision ?? 0;
  const remoteChanged = remoteRevision > revision || (review.published !== null && current.published === null);
  const dirty = comment !== (current.draft?.comment ?? '');
  const problem = feedbackProblem(comment);
  const blank = comment.trim().length === 0;
  const blocked = busy !== null || needsReload || remoteChanged;
  const mentorId = session.user.id;
  const receiptId = current.receipt_id;

  useEffect(() => { busyCallback.current = onMutationBusy; }, [onMutationBusy]);
  useEffect(() => {
    alive.current = true;
    const activeUrls = urls.current;
    return () => {
      alive.current = false; request.current?.abort(); busyCallback.current?.(false);
      for (const url of activeUrls) URL.revokeObjectURL(url);
      activeUrls.clear();
    };
  }, []);
  useEffect(() => {
    if (focusTarget.current === 'review' && phase === 'review') reviewHeading.current?.focus();
    if (focusTarget.current === 'published' && current.published) publishedHeading.current?.focus();
    if (focusTarget.current === 'editor' && phase === 'editing') textarea.current?.focus();
    focusTarget.current = null;
  }, [phase, current, busy]);

  function reportFailure(error: unknown, action: Action) {
    if (error instanceof PortalRequestError && error.status === 401) { onAuthenticationRequired(); return; }
    if (error instanceof PortalRequestError && [403, 404].includes(error.status)) { onUnavailable(); return; }
    if (action === 'downloading') {
      setFailure('The file download could not be verified. Your feedback has been kept. Try downloading the file again.');
      return;
    }
    if (action !== 'reloading') {
      setNeedsReload(true);
      setFailure(error instanceof PortalRequestError && error.status === 409 ?
        'The saved review changed. Your comment is still in this form. Reload saved review status before saving or publishing again.' :
        action === 'publishing' ? 'Publishing could not be confirmed. Your comment is still here. Reload saved review status to check whether feedback was published before retrying.' :
          'Saving could not be confirmed. Your comment is still here. Reload saved review status before trying again.');
    } else setFailure('Saved review status could not be loaded. Your comment has been kept in this form. Please try again.');
  }

  async function run(action: Exclude<Action, 'downloading'>) {
    if (lock.current) return;
    if (action !== 'reloading' && (current.published || problem || needsReload || remoteChanged)) return;
    if (action === 'publishing' && (!current.draft || dirty || blank || phase !== 'review')) return;
    lock.current = true;
    const controller = new AbortController(); request.current = controller;
    setBusy(action); setFailure(''); setNotice(''); onMutationBusy?.(true);
    try {
      const result = action === 'reloading' ? await loadReview(receiptId, mentorId, controller.signal) :
        action === 'saving' ? await saveReviewDraft(receiptId, mentorId, comment, revision, session.csrf_token, controller.signal) :
          await publishReview(receiptId, mentorId, revision, session.csrf_token, controller.signal);
      if (!alive.current || controller.signal.aborted) return;
      setCurrent(result.review); setComment(result.review.draft?.comment ?? ''); setPhase('editing'); setNeedsReload(false);
      if (result.review.published) {
        focusTarget.current = 'published';
        setNotice(action === 'publishing' ? 'Feedback published. The learner can now read it.' : 'This feedback has already been published.');
      } else setNotice(action === 'saving' ? 'Private feedback draft saved. It is not visible to the learner.' : 'Saved review status loaded.');
      onChanged();
    } catch (error) {
      if (alive.current && !controller.signal.aborted) reportFailure(error, action);
    } finally {
      lock.current = false; request.current = null;
      if (alive.current) { setBusy(null); onMutationBusy?.(false); }
    }
  }

  async function download(file: AttachmentMetadata) {
    if (lock.current || blocked || !current.attachments.some(saved => saved.id === file.id)) return;
    lock.current = true;
    const controller = new AbortController(); request.current = controller;
    setBusy('downloading'); setFailure(''); setNotice(''); onMutationBusy?.(true);
    try {
      const result = await downloadReviewAttachment(receiptId, mentorId, file, controller.signal);
      if (!alive.current || controller.signal.aborted) return;
      const url = URL.createObjectURL(result.blob); urls.current.add(url);
      const link = document.createElement('a'); link.href = url; link.download = result.filename; link.hidden = true;
      document.body.append(link); link.click(); link.remove();
      window.setTimeout(() => { URL.revokeObjectURL(url); urls.current.delete(url); }, 1000);
      setNotice('Verified submitted file download prepared.');
    } catch (error) {
      if (alive.current && !controller.signal.aborted) reportFailure(error, 'downloading');
    } finally {
      lock.current = false; request.current = null;
      if (alive.current) { setBusy(null); onMutationBusy?.(false); }
    }
  }

  function save(event: FormEvent) { event.preventDefault(); if (phase === 'editing') void run('saving'); }
  function reviewSaved() {
    if (blocked || current.published || !current.draft || dirty || blank || problem) return;
    setFailure(''); setNotice(''); focusTarget.current = 'review'; setPhase('review');
  }

  return <div className="sp-mentor-detail" aria-busy={busy !== null}>
    <section className="sp-panel" aria-labelledby={`${fieldId}-submission`}><p className="sp-eyebrow">Frozen learner submission</p>
      <h3 id={`${fieldId}-submission`}>{current.assignment_title}</h3>
      <dl className="sp-mentor-facts"><div><dt>Attempt</dt><dd>{current.attempt_number}</dd></div><div><dt>Learner</dt><dd>{current.learner_label}</dd></div><div><dt>Program</dt><dd>{current.program_title}</dd></div>
        <div><dt>Submitted</dt><dd><Timestamp value={current.submitted_at} /></dd></div><div><dt>Receipt reference</dt><dd><code>{current.receipt_id}</code></dd></div>
        <div><dt>Submission revision</dt><dd>{current.submission_revision}</dd></div></dl>
      <h4>Submitted answer</h4><p className="sp-mentor-copy">{current.answer}</p>
      <h4>Submitted files ({current.attachments.length})</h4>
      {current.attachments.length === 0 ? <p className="sp-note">No files were included in this submission.</p> : <ul className="sp-mentor-files">{current.attachments.map(file => <li key={file.id}>
        <strong>{file.filename}</strong><p>{file.size_bytes.toLocaleString()} bytes · {file.media_type}</p><details><summary>File details<span className="sp-sr-only">: {file.filename}</span></summary>
          <dl><div><dt>Uploaded</dt><dd><Timestamp value={file.uploaded_at} /></dd></div><div><dt>SHA-256</dt><dd><code>{file.sha256}</code></dd></div></dl></details>
        <button type="button" onClick={() => void download(file)} disabled={blocked}>Download submitted file<span className="sp-sr-only">: {file.filename}</span></button></li>)}</ul>}
      <p className="sp-note">Submitted answers and files cannot be edited here. Files are downloaded without an inline preview and are not scanned for malware.</p>
    </section>
    <section className="sp-panel" aria-label="Assignment feedback review">
      {notice ? <p className="sp-message" role="status">{notice}</p> : null}
      {failure ? <p className="sp-mentor-error" role="alert">{failure}</p> : null}
      {busy === 'downloading' ? <p role="status">Checking and preparing the submitted file download…</p> : null}
      {current.published ? <div><p className="sp-eyebrow">Visible to the learner</p><h3 ref={publishedHeading} tabIndex={-1}>Published feedback</h3>
        <p className="sp-mentor-copy">{current.published.comment}</p><p className="sp-note">{current.published.mentor_label} · <Timestamp value={current.published.published_at} /></p>
        <p className="sp-note">Published feedback is read-only. It does not award a grade, credit, certificate or qualification.</p></div> : <form data-mentor-editor onSubmit={save}>
        {phase === 'review' ? <><p className="sp-eyebrow">Ready for your review</p><h3 ref={reviewHeading} tabIndex={-1}>Review saved feedback</h3>
          <p>Publishing makes this saved comment visible to the learner. Published feedback is read-only.</p><p className="sp-mentor-copy">{comment}</p>
          <div className="sp-mentor-actions"><button type="button" onClick={() => { focusTarget.current = 'editor'; setPhase('editing'); }} disabled={busy !== null}>Edit feedback draft</button>
            <button type="button" className="sp-learning-primary" onClick={() => void run('publishing')} disabled={blocked}>{busy === 'publishing' ? 'Publishing feedback…' : 'Publish feedback'}</button></div>
        </> : <><p className="sp-eyebrow">Private until published</p><h3>Private feedback draft</h3>
          <label htmlFor={fieldId}>Feedback comment</label><p id={`${fieldId}-help`} className="sp-note">Use synthetic practice information only. Save a private draft, then review it before publishing. Only saved feedback survives a page reload. Leaving this review discards unsaved changes.</p>
          <textarea ref={textarea} id={fieldId} rows={9} maxLength={4000} value={comment} onChange={event => { setComment(event.target.value); setNotice(''); }} disabled={busy !== null}
            aria-invalid={problem ? true : undefined} aria-describedby={`${fieldId}-help ${fieldId}-limit ${fieldId}-state${problem ? ` ${fieldId}-problem` : ''}`} />
          <p id={`${fieldId}-limit`} className="sp-mentor-meta">{comment.length.toLocaleString()} / 4,000 characters · {new TextEncoder().encode(comment).length.toLocaleString()} / 12,000 UTF-8 bytes</p>
          {problem ? <p id={`${fieldId}-problem`} className="sp-mentor-error">{problem}</p> : null}
          <p id={`${fieldId}-state`} className="sp-mentor-saved" role="status">{dirty ? 'Unsaved feedback changes' : current.draft ? 'Private draft saved' : 'No private draft saved'}{current.draft ? <> · <Timestamp value={current.draft.saved_at} /></> : null}</p>
          <div className="sp-mentor-actions"><button type="submit" disabled={blocked || problem !== null || (current.draft !== null && !dirty)}>{busy === 'saving' ? 'Saving private draft…' : 'Save private draft'}</button>
            <button type="button" className="sp-learning-primary" onClick={reviewSaved} disabled={blocked || !current.draft || dirty || blank || problem !== null}>Review saved feedback</button></div>
          {blank ? <p className="sp-note">A blank draft can be saved. Enter a comment before reviewing it for publication.</p> : dirty ? <p className="sp-note">Save your changes to enable feedback review.</p> : null}
        </>}
        {remoteChanged || needsReload ? <div className="sp-mentor-reload">{remoteChanged ? <p role="alert">The server has a newer saved review. Your comment has been kept here.</p> : null}
          <p>Reloading replaces this form’s comment with the latest saved version. Keep a private copy of any unsaved practice text you want to retain.</p>
          <button type="button" onClick={() => void run('reloading')} disabled={busy !== null}>{busy === 'reloading' ? 'Checking saved review…' : 'Reload saved review and replace this comment'}</button></div> : null}
      </form>}
      <p className="sp-note">This synthetic practice workflow provides feedback only. Grades, reopening, learner record administration and owner/admin controls remain unavailable.</p>
    </section>
  </div>;
}

function MentorReviewsForAccount({ session, onAuthenticationRequired, onMutationBusy }: Props) {
  const [selection, setSelection] = useState<string | null>(null);
  const [view, setView] = useState<View>({ status: 'loading' });
  const [reload, setReload] = useState(0);
  const [busy, setBusy] = useState(false);
  const [refreshError, setRefreshError] = useState('');
  const generation = useRef(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const focusRequested = useRef(false);
  const mentorId = session.user.id;

  useEffect(() => { onMutationBusy?.(busy); }, [busy, onMutationBusy]);
  useEffect(() => () => { onMutationBusy?.(false); }, [onMutationBusy]);
  useEffect(() => {
    const controller = new AbortController(); const requestGeneration = ++generation.current;
    const task = async () => {
      try {
        const [queue, detail] = await Promise.all([loadReviewQueue(mentorId, controller.signal), selection ? loadReview(selection, mentorId, controller.signal) : Promise.resolve(null)]);
        if (controller.signal.aborted || requestGeneration !== generation.current) return;
        setView({ status: 'ready', queue, detail, selection, verifiedSession: session }); setRefreshError('');
      } catch (error) {
        if (controller.signal.aborted || requestGeneration !== generation.current) return;
        if (error instanceof PortalRequestError && error.status === 401) { onAuthenticationRequired(); return; }
        if (error instanceof PortalRequestError && [403, 404].includes(error.status)) {
          setView({ status: 'unavailable', message: 'Mentor review records are unavailable for your current assignment or account.' });
        } else {
          const message = 'Mentor review records could not be refreshed. Your open feedback editor has been retained.';
          setRefreshError(message); setView(previous => previous.status === 'ready' && previous.selection === selection ? previous : { status: 'error', message });
        }
      }
    };
    void task(); return () => { controller.abort(); };
  }, [session, mentorId, selection, reload, onAuthenticationRequired]);

  const ready = view.status === 'ready' && view.selection === selection ? view : null;
  const revalidating = ready !== null && ready.verifiedSession !== session;
  const blocked = busy || revalidating;
  useEffect(() => {
    if (ready && !revalidating && focusRequested.current) { heading.current?.focus(); focusRequested.current = false; }
  }, [ready, revalidating]);
  function navigate(receiptId: string | null) {
    if (blocked) return;
    focusRequested.current = true; setRefreshError(''); setView({ status: 'loading' }); setSelection(receiptId);
  }
  function refresh() { if (busy) return; setRefreshError(''); setReload(value => value + 1); }

  return <section className="sp-mentor" aria-labelledby="sp-mentor-heading" aria-busy={blocked || view.status === 'loading'}>
    <div className="sp-mentor-top"><div><p className="sp-eyebrow">Synthetic mentor workspace</p><h2 id="sp-mentor-heading" ref={heading} tabIndex={-1}>{revalidating ? 'Checking your review access' : selection ? 'Review a submitted assignment' : 'Mentor review queue'}</h2></div>
      {selection ? <button type="button" onClick={() => navigate(null)} disabled={blocked}>Back to review queue</button> : <button type="button" onClick={refresh} disabled={blocked}>Refresh review queue</button>}</div>
    <p className="sp-mentor-test">Synthetic practice review only · The server checks each explicit program assignment. Owner/admin controls remain closed.</p>
    {(!ready && view.status === 'loading') || (revalidating && !refreshError) ? <p className="sp-mentor-state" role="status">Loading authorized review records…</p> : null}
    {refreshError && ready ? <div className="sp-mentor-state"><p role="alert">{refreshError}</p><p>Records remain hidden until changed account access is verified.</p><button type="button" onClick={refresh} disabled={busy}>Retry review records</button></div> : null}
    {view.status === 'error' || view.status === 'unavailable' ? <div className="sp-mentor-state"><h3>{view.status === 'unavailable' ? 'Mentor review access unavailable' : 'Review records unavailable'}</h3><p role="alert">{view.message}</p><button type="button" onClick={refresh}>Try again</button></div> : null}
    {ready ? <div hidden={revalidating}>
      {ready.detail ? <><p className="sp-note">Save your feedback before leaving this review. Unsaved comments are discarded when you navigate away.</p>
        <MentorReviewEditor key={`${mentorId}-${ready.detail.review.receipt_id}`} session={session} review={ready.detail.review} onAuthenticationRequired={onAuthenticationRequired}
          onUnavailable={() => setView({ status: 'unavailable', message: 'Mentor review records are unavailable for your current assignment or account.' })}
          onChanged={() => { setRefreshError(''); setReload(value => value + 1); }} onMutationBusy={setBusy} /></> : <>
        <p className="sp-note">{ready.queue.reviews.length} submitted {ready.queue.reviews.length === 1 ? 'assignment' : 'assignments'} shown. This queue shows up to 100 submissions from programs explicitly assigned to this synthetic reviewer.</p>
        {ready.queue.reviews.length === 0 ? <div className="sp-mentor-state"><h3>No submitted assignments to review</h3><p>No submitted learner work is currently available within your assigned program scope.</p></div> :
          <ol className="sp-mentor-queue">{ready.queue.reviews.map(row => <li className="sp-panel" key={row.receipt_id}><p className="sp-eyebrow">Attempt {row.attempt_number} · {row.review_state === 'published' ? 'Feedback published' : row.review_state === 'draft' ? 'Private draft saved' : 'Awaiting review'}</p>
            <h3>{row.assignment_title}</h3><dl className="sp-mentor-facts"><div><dt>Learner</dt><dd>{row.learner_label}</dd></div><div><dt>Program</dt><dd>{row.program_title}</dd></div>
              <div><dt>Submitted</dt><dd><Timestamp value={row.submitted_at} /></dd></div></dl>
            <button type="button" onClick={() => navigate(row.receipt_id)} disabled={blocked}>{row.review_state === 'published' ? 'View published review' : 'Open review'}<span className="sp-sr-only">: attempt {row.attempt_number}, {row.assignment_title}, {row.learner_label}</span></button></li>)}</ol>}
      </>}
      <p className="sp-note">Dates use your device’s time zone.</p>
    </div> : null}
  </section>;
}

export default function MentorReviews(props: Props) {
  return <MentorReviewsForAccount key={props.session.user.id} {...props} />;
}
