import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { PortalRequestError, type Session } from './client';
import { answerProblem, attachmentProblem, downloadAttachment, downloadAttemptAttachment, loadSubmission, removeAttachment, restoreAttachment, saveDraft, startRevision, submitAssignment, uploadAttachment,
  type AssignmentRecord, type AttachmentMetadata } from './assignmentClient';
import './assignment.css';
import AssignmentFeedback from './AssignmentFeedback';
import AssignmentAttemptHistory from './AssignmentAttemptHistory';

type Props = {
  session: Session; itemId: string; programId: string; onAuthenticationRequired: () => void;
  onSaved?: () => void; onSubmitted?: () => void; onMutationBusy?: (busy: boolean) => void;
};
type View = { status: 'loading' } | { status: 'ready'; record: AssignmentRecord } |
  { status: 'error' | 'unavailable'; message: string };
type Action = 'saving' | 'submitting' | 'starting_revision' | 'reloading' | 'uploading' | 'removing' | 'restoring' | 'downloading';
type Selection = { name: string; size: number; problem: string | null };

function Timestamp({ value }: { value: string }) {
  return <time dateTime={value}>{new Date(value).toLocaleString()}</time>;
}

function FileList({ files, removed = false, editing = false, blocked, restoreBlocked = false, onDownload, onChange }: {
  files: AttachmentMetadata[]; removed?: boolean; editing?: boolean; blocked: boolean; restoreBlocked?: boolean;
  onDownload: (file: AttachmentMetadata) => void; onChange?: (action: 'removing' | 'restoring', file: AttachmentMetadata) => void;
}) {
  if (files.length === 0) return <p className="sp-note">{removed ? 'No files have been removed.' : 'No saved files attached.'}</p>;
  return <ul className="sp-assignment-files">{files.map(file => <li key={file.id}>
    <div className="sp-assignment-file-heading"><strong>{file.filename}</strong><span>{file.size_bytes.toLocaleString()} bytes · {file.media_type}</span></div>
    <details><summary>File details<span className="sp-sr-only">: {file.filename}</span></summary><dl><div><dt>Uploaded</dt><dd><Timestamp value={file.uploaded_at} /></dd></div>
      <div><dt>SHA-256</dt><dd><code>{file.sha256}</code></dd></div></dl></details>
    <div className="sp-assignment-actions">{!removed ? <button type="button" onClick={() => onDownload(file)} disabled={blocked}>Download<span className="sp-sr-only"> {file.filename}</span></button> : null}
      {editing ? <button type="button" onClick={() => onChange?.(removed ? 'restoring' : 'removing', file)} disabled={blocked || (removed && restoreBlocked)}>{removed ? 'Restore file' : 'Remove file'}<span className="sp-sr-only">: {file.filename}</span></button> : null}</div>
  </li>)}</ul>;
}

export default function AssignmentSubmission({ session, itemId, programId, onAuthenticationRequired, onSaved, onSubmitted, onMutationBusy }: Props) {
  const [view, setView] = useState<View>({ status: 'loading' });
  const [answer, setAnswer] = useState('');
  const [phase, setPhase] = useState<'editing' | 'review'>('editing');
  const [busy, setBusy] = useState<Action | null>(null);
  const [notice, setNotice] = useState('');
  const [failure, setFailure] = useState('');
  const [needsReload, setNeedsReload] = useState(false);
  const [selection, setSelection] = useState<Selection | null>(null);
  const alive = useRef(false);
  const generation = useRef(0);
  const mutationLock = useRef(false);
  const mutationBusyCallback = useRef(onMutationBusy);
  const mutation = useRef<AbortController | null>(null);
  const focusTarget = useRef<'review' | 'receipt' | 'answer' | null>(null);
  const reviewHeading = useRef<HTMLHeadingElement>(null);
  const receiptHeading = useRef<HTMLHeadingElement>(null);
  const editor = useRef<HTMLTextAreaElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const selectedFile = useRef<File | null>(null);
  const downloadUrls = useRef<Set<string>>(new Set());
  const fieldId = useId();
  const learnerId = session.user.id;
  const current = view.status === 'ready' ? view.record : null;
  const dirty = current !== null && answer !== current.answer;
  const problem = answerProblem(answer);
  const blank = answer.trim().length === 0;
  const activeFiles = current?.attachments ?? [];
  const removedFiles = current?.removed_attachments ?? [];
  const fileLimitReached = activeFiles.length >= 3 || activeFiles.length + removedFiles.length >= 6;
  const feedbackUnavailable = useCallback(() => {
    mutation.current?.abort(); selectedFile.current = null; setSelection(null);
    if (fileInput.current) fileInput.current.value = '';
    setView({ status: 'unavailable', message: 'This assignment is unavailable for your current access. Refresh account access before trying again.' });
  }, []);
  const newerAttempt = useCallback(() => {
    setNeedsReload(true); setFailure('A newer saved attempt was found. Your answer is still here. Reload saved status before making further changes.');
  }, []);

  useEffect(() => { mutationBusyCallback.current = onMutationBusy; }, [onMutationBusy]);

  useEffect(() => {
    alive.current = true;
    const urls = downloadUrls.current;
    return () => {
      alive.current = false; mutation.current?.abort(); selectedFile.current = null; mutationBusyCallback.current?.(false);
      for (const url of urls) URL.revokeObjectURL(url);
      urls.clear();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const requestGeneration = ++generation.current;
    const task = async () => {
      try {
        const result = await loadSubmission(itemId, programId, learnerId, controller.signal);
        if (controller.signal.aborted || requestGeneration !== generation.current) return;
        setView({ status: 'ready', record: result.submission });
        setAnswer(result.submission.answer);
      } catch (error) {
        if (controller.signal.aborted || requestGeneration !== generation.current) return;
        if (error instanceof PortalRequestError && error.status === 401) { onAuthenticationRequired(); return; }
        const unavailable = error instanceof PortalRequestError && [403, 404].includes(error.status);
        setView({ status: unavailable ? 'unavailable' : 'error', message: unavailable ?
          'This assignment is unavailable for your account or program.' :
          'Your saved assignment could not be loaded. Try again before entering an answer.' });
      }
    };
    void task();
    const input = fileInput.current;
    return () => { controller.abort(); selectedFile.current = null; if (input) input.value = ''; };
  }, [itemId, programId, learnerId, onAuthenticationRequired]);

  useEffect(() => {
    if (focusTarget.current === 'review' && phase === 'review') reviewHeading.current?.focus();
    if (focusTarget.current === 'receipt' && current?.state === 'submitted') receiptHeading.current?.focus();
    if (focusTarget.current === 'answer' && phase === 'editing') editor.current?.focus();
    focusTarget.current = null;
  }, [phase, current, busy]);

  function clearSelection() {
    selectedFile.current = null; setSelection(null);
    if (fileInput.current) fileInput.current.value = '';
  }

  function reportFailure(error: unknown, action: Action) {
    if (error instanceof PortalRequestError && error.status === 401) { clearSelection(); onAuthenticationRequired(); return; }
    if (error instanceof PortalRequestError && [403, 404].includes(error.status)) {
      clearSelection();
      setView({ status: 'unavailable', message: 'This assignment is unavailable for your account or program. Refresh account access before trying again.' });
      return;
    }
    if (action === 'uploading' && error instanceof PortalRequestError && [400, 413, 415, 422].includes(error.status)) {
      setFailure('This file was not accepted. Use a non-empty TXT, PDF, PNG or JPEG file of at most 1 MiB, with an allowed filename of at most 100 ASCII characters. Check the selected file and try again.');
      return;
    }
    if (action === 'downloading') {
      setFailure('The file download could not be verified. Your saved answer and files have not been changed. Try downloading it again.');
      return;
    }
    if (error instanceof PortalRequestError && error.status === 409) {
      setNeedsReload(true);
      setFailure('The saved assignment changed. Your answer is still in this form. Reload the saved draft to check its latest status before saving or submitting again.');
      return;
    }
    if (action !== 'reloading') {
      setNeedsReload(true);
      setFailure(action === 'submitting' ?
        'Submission could not be confirmed. Your answer is still here. Reload saved status to check whether a receipt was created before trying again.' :
        action === 'starting_revision' ? 'Starting a revision could not be confirmed. Reload saved status to check whether a new draft was created before trying again. Earlier receipts remain read-only.' :
        ['uploading', 'removing', 'restoring'].includes(action) ?
          'The file change could not be confirmed. Your answer is still here. Reload saved status to check the saved files before trying again. A selected file may need to be chosen again.' :
          'Saving could not be confirmed. Your answer is still here. Reload saved status before saving again.');
    } else setFailure('Saved status could not be loaded. Your answer has been kept in this form. Please try again.');
  }

  async function run(action: Exclude<Action, 'downloading'>, attachment?: AttachmentMetadata) {
    if (mutationLock.current) return;
    if (action !== 'reloading' && (!current || (current.state === 'submitted' && action !== 'starting_revision') || problem || needsReload)) return;
    if (action === 'starting_revision' && (!current || current.state !== 'submitted' || !current.receipt || !current.can_start_revision || selection)) return;
    if (action === 'submitting' && (!current || current.state !== 'draft' || dirty || blank || selection || phase !== 'review')) return;
    if (action === 'saving' && selection) return;
    if (['uploading', 'removing', 'restoring'].includes(action) && (!current || current.state !== 'draft' || dirty || phase !== 'editing')) return;
    const file = selectedFile.current;
    if (action === 'uploading' && (!file || attachmentProblem(file) || fileLimitReached)) return;
    if (action === 'removing' && (selection || !attachment || !activeFiles.some(saved => saved.id === attachment.id))) return;
    if (action === 'restoring' && (selection || !attachment || activeFiles.length >= 3 || !removedFiles.some(saved => saved.id === attachment.id))) return;
    mutationLock.current = true;
    const controller = new AbortController();
    mutation.current = controller;
    const requestGeneration = generation.current;
    setBusy(action); setFailure(''); setNotice(''); onMutationBusy?.(true);
    try {
      const result = action === 'reloading' ? await loadSubmission(itemId, programId, learnerId, controller.signal) :
        action === 'starting_revision' ? await startRevision(itemId, programId, learnerId, current!.receipt!.id, current!.revision, session.csrf_token, controller.signal) :
        action === 'saving' ? await saveDraft(itemId, programId, learnerId, answer, current!.revision, session.csrf_token, controller.signal) :
          action === 'uploading' ? await uploadAttachment(itemId, programId, learnerId, file!, current!.revision, session.csrf_token, controller.signal) :
            action === 'removing' ? await removeAttachment(itemId, programId, learnerId, attachment!.id, current!.revision, session.csrf_token, controller.signal) :
              action === 'restoring' ? await restoreAttachment(itemId, programId, learnerId, attachment!.id, current!.revision, session.csrf_token, controller.signal) :
                await submitAssignment(itemId, programId, learnerId, current!.revision, session.csrf_token, controller.signal);
      if (!alive.current || controller.signal.aborted || requestGeneration !== generation.current) return;
      setView({ status: 'ready', record: result.submission });
      setAnswer(result.submission.answer); setNeedsReload(false); setPhase('editing'); clearSelection();
      if (result.submission.state === 'submitted') {
        focusTarget.current = 'receipt';
        setNotice(action === 'submitting' ? 'Assignment submitted. Your receipt is below.' : 'The saved assignment has already been submitted. Your receipt is below.');
        onSubmitted?.();
      } else {
        if (action === 'starting_revision' || action === 'reloading') focusTarget.current = 'answer';
        setNotice(action === 'starting_revision' ? 'Revision started. Your earlier answer is copied into this saved draft. Choose any practice files again; earlier submitted files were not copied.' :
          action === 'saving' ? 'Draft saved. You can return to this saved answer after a reload.' : action === 'uploading' ? 'File uploaded to this saved draft.' :
          action === 'removing' ? 'File removed from this draft. You can restore it before submission.' : action === 'restoring' ? 'File restored to this draft.' : 'Saved draft loaded.');
        if (action !== 'reloading') onSaved?.();
      }
    } catch (error) {
      if (alive.current && !controller.signal.aborted && requestGeneration === generation.current) reportFailure(error, action);
    } finally {
      mutationLock.current = false; mutation.current = null;
      if (alive.current) { setBusy(null); onMutationBusy?.(false); }
    }
  }

  async function download(file: AttachmentMetadata, receiptId?: string) {
    if (mutationLock.current || needsReload || selection || !current || (!receiptId && !activeFiles.some(saved => saved.id === file.id))) return;
    mutationLock.current = true;
    const controller = new AbortController(); mutation.current = controller;
    const requestGeneration = generation.current;
    setBusy('downloading'); setFailure(''); setNotice(''); onMutationBusy?.(true);
    try {
      const result = receiptId ? await downloadAttemptAttachment(itemId, programId, learnerId, receiptId, file, controller.signal) :
        await downloadAttachment(itemId, programId, learnerId, file, controller.signal);
      if (!alive.current || controller.signal.aborted || requestGeneration !== generation.current) return;
      const url = URL.createObjectURL(result.blob); downloadUrls.current.add(url);
      const link = document.createElement('a'); link.href = url; link.download = result.filename; link.hidden = true;
      document.body.append(link); link.click(); link.remove();
      window.setTimeout(() => { URL.revokeObjectURL(url); downloadUrls.current.delete(url); }, 1000);
      setNotice('Verified file download prepared.');
    } catch (error) {
      if (alive.current && !controller.signal.aborted && requestGeneration === generation.current) reportFailure(error, 'downloading');
    } finally {
      mutationLock.current = false; mutation.current = null;
      if (alive.current) { setBusy(null); onMutationBusy?.(false); }
    }
  }

  function save(event: FormEvent) { event.preventDefault(); void run('saving'); }
  function review() {
    if (!current || current.state !== 'draft' || dirty || blank || problem || busy || needsReload || selection) return;
    setFailure(''); setNotice(''); focusTarget.current = 'review'; setPhase('review');
  }

  if (view.status === 'loading') return <div className="sp-assignment" role="status"><p>Loading your saved assignment…</p></div>;
  if (view.status === 'error' || view.status === 'unavailable') return <div className="sp-assignment"><p role="alert">{view.message}</p>
    {view.status === 'error' ? <button type="button" onClick={() => void run('reloading')} disabled={busy !== null}>{busy === 'reloading' ? 'Checking saved status…' : 'Try loading saved assignment again'}</button> : null}</div>;
  if (!current) return null;

  return <section className="sp-assignment" aria-label="Your assignment answer" aria-busy={busy !== null}>
    <p className="sp-assignment-scope">Synthetic assignment submission · Practice files stay in this synthetic practice environment. Grading and certificates remain unavailable.</p>
    <p className="sp-assignment-state">Practice attempt {current.attempt_number} of 5{current.state === 'draft' ? ' · Draft' : current.state === 'submitted' ? ' · Submitted' : ' · Not started'}</p>
    <p className="sp-note">The five-attempt practice cap applies only to this synthetic practice environment.</p>
    {notice ? <p className="sp-message" role="status">{notice}</p> : null}
    {failure ? <p className="sp-assignment-error" role="alert">{failure}</p> : null}
    {['uploading', 'removing', 'restoring', 'downloading'].includes(busy ?? '') ? <p className="sp-assignment-state" role="status">{busy === 'uploading' ? 'Uploading practice file…' : busy === 'removing' ? 'Removing file from the draft…' : busy === 'restoring' ? 'Restoring file to the draft…' : 'Checking and preparing the file download…'}</p> : null}
    {current.state === 'submitted' && current.receipt ? <div className="sp-assignment-receipt">
      <h4 ref={receiptHeading} tabIndex={-1}>Assignment submitted</h4>
      <p>This submitted answer is read-only. It has not been graded.</p>
      <dl><div><dt>Attempt</dt><dd>{current.attempt_number}</dd></div><div><dt>Receipt reference</dt><dd><code>{current.receipt.id}</code></dd></div>
        <div><dt>Submitted</dt><dd><Timestamp value={current.receipt.submitted_at} /></dd></div>
        <div><dt>Submitted revision</dt><dd>{current.receipt.revision}</dd></div></dl>
      <h5>Your submitted answer</h5><p className="sp-assignment-answer">{current.answer}</p>
      <h5>Files included with this submission</h5><FileList files={activeFiles} blocked={busy !== null || needsReload} onDownload={file => void download(file)} />
      <AssignmentFeedback session={session} itemId={itemId} programId={programId} receiptId={current.receipt.id} onAuthenticationRequired={onAuthenticationRequired} onUnavailable={feedbackUnavailable} />
      <form data-assignment-editor className="sp-start-revision" onSubmit={event => { event.preventDefault(); void run('starting_revision'); }}>
        <h5>Revise after feedback</h5><p className="sp-note">A new attempt copies this submitted answer into a saved draft. Earlier receipts, files and published feedback stay read-only. Files are not copied: upload the practice files you want in the new attempt.</p>
        {current.can_start_revision ? <button type="submit" className="sp-learning-primary" disabled={busy !== null || needsReload}>{busy === 'starting_revision' ? 'Starting revision…' : 'Start a revision'}</button> :
          <p className="sp-note">{current.attempt_number >= 5 ? 'The five-attempt synthetic practice limit has been reached.' : 'A revision becomes available after published mentor feedback on your latest submitted attempt. Check availability after refreshing feedback.'}</p>}
        <button type="button" onClick={() => void run('reloading')} disabled={busy !== null}>{busy === 'reloading' ? 'Checking saved status…' : needsReload ? 'Reload saved status before trying again' : 'Check revision availability'}</button>
      </form>
    </div> : <form data-assignment-editor onSubmit={save}>
      {phase === 'review' ? <div className="sp-assignment-review">
        <h4 ref={reviewHeading} tabIndex={-1}>Review your saved answer</h4>
        <p>After submission this answer and its attached files are read-only. Review the saved answer and files before submitting this synthetic assignment.</p>
        <p className="sp-assignment-answer">{answer}</p>
        <h5>Saved files to include ({activeFiles.length} / 3)</h5><FileList files={activeFiles} blocked={busy !== null || needsReload} onDownload={file => void download(file)} />
        <div className="sp-assignment-actions"><button type="button" onClick={() => { focusTarget.current = 'answer'; setPhase('editing'); }} disabled={busy !== null}>Edit answer</button>
          <button className="sp-learning-primary" type="button" onClick={() => void run('submitting')} disabled={busy !== null || needsReload}>{busy === 'submitting' ? 'Submitting assignment…' : 'Submit assignment'}</button></div>
      </div> : <>
        <label htmlFor={fieldId}>Your assignment answer</label>
        {current.previous_receipt_id ? <p className="sp-note">This is revision attempt {current.attempt_number}. Its starting text came from your previous submission. Earlier submitted files remain with their original receipt; upload any files you want in this attempt.</p> : null}
        <p id={`${fieldId}-help`} className="sp-note">Use practice information only. Save a draft before reviewing and submitting. Only saved answers survive a page reload; leaving this program discards unsaved changes.</p>
        <textarea ref={editor} id={fieldId} value={answer} onChange={event => { setAnswer(event.target.value); setNotice(''); }} maxLength={4000} rows={9}
          disabled={busy !== null || selection !== null} aria-invalid={problem ? true : undefined} aria-describedby={`${fieldId}-help ${fieldId}-limit ${fieldId}-state${problem ? ` ${fieldId}-problem` : ''}`} />
        <p id={`${fieldId}-limit`} className="sp-assignment-count">{answer.length.toLocaleString()} / 4,000 characters · {new TextEncoder().encode(answer).length.toLocaleString()} / 12,000 UTF-8 bytes</p>
        {problem ? <p id={`${fieldId}-problem`} className="sp-assignment-error">{problem}</p> : null}
        <p id={`${fieldId}-state`} className="sp-assignment-state" role="status">{dirty ? 'Unsaved changes' : current.state === 'draft' ? 'Saved draft' : 'No saved draft'}
          {current.saved_at ? <> · Last saved <Timestamp value={current.saved_at} /></> : null}</p>
        <div className="sp-assignment-actions"><button type="submit" disabled={busy !== null || problem !== null || needsReload || selection !== null || (current.state === 'draft' && !dirty)}>{busy === 'saving' ? 'Saving draft…' : 'Save draft'}</button>
          <button type="button" className="sp-learning-primary" onClick={review} disabled={busy !== null || problem !== null || dirty || blank || current.state !== 'draft' || needsReload || selection !== null}>Review saved answer</button></div>
        {blank ? <p className="sp-note">A blank draft can be saved. Enter an answer before reviewing it for submission.</p> : dirty ? <p className="sp-note">Save your changes to enable review.</p> : null}
        <div className="sp-assignment-attachments">
          <h4>Practice files</h4>
          <p id={`${fieldId}-file-help`} className="sp-note">Save your text draft before adding files. Use synthetic information only: TXT, PDF, PNG or JPEG; non-empty and at most 1 MiB (1,048,576 bytes) each. Include up to 3 active files and 6 uploaded files in total per attempt. Removing a file does not reset this attempt’s total.</p>
          <p id={`${fieldId}-file-name-help`} className="sp-note">Filenames may contain ASCII letters, digits, spaces, underscores, hyphens and periods, up to 100 characters. Start with a letter or digit; avoid repeated periods and trailing spaces or periods. File selection is not saved: upload it explicitly, or choose it again after a reload. File contents are not displayed here. Files are not scanned for malware.</p>
          <p className="sp-assignment-state">{activeFiles.length} / 3 active files · {activeFiles.length + removedFiles.length} / 6 total uploads</p>
          <label htmlFor={`${fieldId}-file`}>Choose a practice file</label>
          <input ref={fileInput} id={`${fieldId}-file`} type="file" accept=".txt,.pdf,.png,.jpg,.jpeg,text/plain,application/pdf,image/png,image/jpeg"
            disabled={busy !== null || needsReload || current.state !== 'draft' || dirty || problem !== null || fileLimitReached}
            aria-describedby={`${fieldId}-file-help ${fieldId}-file-name-help${selection?.problem ? ` ${fieldId}-file-problem` : ''}`}
            aria-invalid={selection?.problem ? true : undefined} onChange={event => {
              const file = event.target.files?.[0] ?? null; selectedFile.current = file;
              setSelection(file ? { name: file.name, size: file.size, problem: attachmentProblem(file) } : null);
              setNotice(''); setFailure('');
            }} />
          {selection ? <div className="sp-assignment-selected"><p>Selected, not uploaded: <strong>{selection.name}</strong> · {selection.size.toLocaleString()} bytes</p>
            {selection.problem ? <p id={`${fieldId}-file-problem`} className="sp-assignment-error" role="alert">{selection.problem}</p> : null}
            <p className="sp-note">Upload or clear this selection before editing your answer or reviewing the assignment.</p>
            <div className="sp-assignment-actions"><button type="button" className="sp-learning-primary" onClick={() => void run('uploading')}
              disabled={busy !== null || needsReload || selection.problem !== null || dirty || fileLimitReached}>{busy === 'uploading' ? 'Uploading practice file…' : 'Upload selected file'}</button>
              <button type="button" onClick={clearSelection} disabled={busy !== null}>Clear selected file</button></div></div> : null}
          {current.state !== 'draft' || dirty ? <p className="sp-note">Save your latest text draft to enable file changes.</p> : null}
          {activeFiles.length >= 3 ? <p className="sp-note">Three files are attached. Remove an active file before adding or restoring another.</p> : null}
          {activeFiles.length + removedFiles.length >= 6 ? <p className="sp-note">The six-upload limit has been reached. Existing removed files may still be restored when an active slot is available.</p> : null}
          <h5>Saved files</h5><FileList files={activeFiles} editing blocked={busy !== null || needsReload || dirty || selection !== null} onDownload={file => void download(file)} onChange={(action, file) => void run(action, file)} />
          {removedFiles.length > 0 ? <><h5>Removed files</h5><p className="sp-note">Removed files will not be included in the final submission. Restore a file to include it again.</p>
            <FileList files={removedFiles} removed editing blocked={busy !== null || needsReload || dirty || selection !== null} restoreBlocked={activeFiles.length >= 3} onDownload={file => void download(file)} onChange={(action, file) => void run(action, file)} /></> : null}
        </div>
      </>}
      {needsReload ? <div className="sp-assignment-reload"><p>Reloading replaces this form’s answer with the saved version. Keep a private copy of any unsaved practice text you want to retain.</p>
        <button type="button" onClick={() => void run('reloading')} disabled={busy !== null}>{busy === 'reloading' ? 'Checking saved status…' : 'Reload saved status and replace this answer'}</button></div> : null}
    </form>}
    <AssignmentAttemptHistory session={session} itemId={itemId} programId={programId} currentAttempt={current.attempt_number} currentReceiptId={current.receipt?.id ?? null}
      busy={busy !== null || needsReload || selection !== null} onDownload={(receiptId, file) => void download(file, receiptId)} onAuthenticationRequired={onAuthenticationRequired} onUnavailable={feedbackUnavailable} onNewerAttempt={newerAttempt} />
    <p className="sp-note">Dates use your device’s time zone. A synthetic receipt confirms this synthetic practice submission only.</p>
  </section>;
}
