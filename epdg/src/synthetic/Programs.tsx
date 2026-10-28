import { useEffect, useRef, useState } from 'react';
import { PortalRequestError, type Session } from './client';
import { completeItem, loadDashboard, loadProgram, type LearningDashboard, type ProgramDetail } from './learningClient';
import AssignmentSubmission from './AssignmentSubmission';
import './programs.css';

type Props = { session: Session; onAuthenticationRequired: () => void; onMutationBusy?: (busy: boolean) => void };
type View = { status: 'loading' } | { status: 'ready'; dashboard: LearningDashboard; detail: ProgramDetail | null; selection: string | null; verifiedSession: Session } |
  { status: 'error' | 'unavailable'; message: string };

function LocalDate({ value }: { value: string }) {
  return <time dateTime={value}>{new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</time>;
}

function Progress({ title, completed, total, percent }: { title: string; completed: number; total: number; percent: number }) {
  return <div className="sp-learning-progress"><div><span>{completed} of {total} lessons complete</span><strong>{percent}%</strong></div>
    <progress max={100} value={percent} aria-label={`${title}: ${percent}% of lessons complete`}>{percent}%</progress></div>;
}

function ProgramsForLearner({ session, onAuthenticationRequired, onMutationBusy }: Props) {
  const [selection, setSelection] = useState<string | null>(null);
  const [targetItem, setTargetItem] = useState<string | null>(null);
  const [view, setView] = useState<View>({ status: 'loading' });
  const [reload, setReload] = useState(0);
  const [busy, setBusy] = useState(false);
  const [assignmentBusy, setAssignmentBusy] = useState<Set<string>>(() => new Set());
  const [message, setMessage] = useState('');
  const [refreshError, setRefreshError] = useState('');
  const alive = useRef(false);
  const requestGeneration = useRef(0);
  const mutationLock = useRef(false);
  const focusRequested = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const learnerId = session.user.id;

  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);

  useEffect(() => {
    const controller = new AbortController();
    const generation = ++requestGeneration.current;
    // Explicit navigation clears the result; session changes hide it while preserving editor state.
    const task = async () => {
      try {
        const [dashboard, detail] = await Promise.all([
          loadDashboard(learnerId, controller.signal),
          selection ? loadProgram(selection, learnerId, controller.signal) : Promise.resolve(null),
        ]);
        if (!controller.signal.aborted && generation === requestGeneration.current) {
          setView({ status: 'ready', dashboard, detail, selection, verifiedSession: session });
          setRefreshError('');
        }
      } catch (error) {
        if (controller.signal.aborted || generation !== requestGeneration.current) return;
        if (error instanceof PortalRequestError && error.status === 401) { onAuthenticationRequired(); return; }
        const unavailable = error instanceof PortalRequestError && [403, 404].includes(error.status);
        const errorMessage = unavailable ?
          'Learning records are unavailable for this account or program. Refresh your account access and try again.' :
          error instanceof PortalRequestError ? error.message : 'Learning records could not be loaded. Please try again.';
        if (unavailable) setView({ status: 'unavailable', message: errorMessage });
        else {
          setRefreshError(errorMessage);
          // A temporary summary failure must not discard an assignment being edited.
          setView(previous => previous.status === 'ready' && previous.selection === selection ? previous : { status: 'error', message: errorMessage });
        }
      }
    };
    void task();
    return () => { controller.abort(); };
  }, [learnerId, selection, reload, session, onAuthenticationRequired]);

  const ready = view.status === 'ready' && view.selection === selection ? view : null;
  const revalidating = ready !== null && ready.verifiedSession !== session;
  const controlsBusy = busy || assignmentBusy.size > 0 || revalidating;
  const mutationBusy = busy || assignmentBusy.size > 0;
  useEffect(() => { onMutationBusy?.(mutationBusy); }, [mutationBusy, onMutationBusy]);
  useEffect(() => () => { onMutationBusy?.(false); }, [onMutationBusy]);
  useEffect(() => {
    if (!ready || revalidating || !focusRequested.current) return;
    if (targetItem && ready.detail) {
      document.getElementById(`learning-item-${targetItem}`)?.focus();
    } else heading.current?.focus();
    focusRequested.current = false;
  }, [ready, revalidating, selection, targetItem]);

  function openProgram(id: string, item: string | null = null) {
    if (controlsBusy) return;
    focusRequested.current = true;
    setMessage(''); setRefreshError(''); setTargetItem(item); setView({ status: 'loading' }); setSelection(id);
  }
  function refresh() { if (controlsBusy) return; focusRequested.current = true; setRefreshError(''); setReload(value => value + 1); }
  function refreshAssignmentSummary() { setRefreshError(''); setReload(value => value + 1); }
  function back() { if (controlsBusy) return; focusRequested.current = true; setMessage(''); setRefreshError(''); setTargetItem(null); setView({ status: 'loading' }); setSelection(null); }
  function assignmentMutation(id: string, active: boolean) {
    setAssignmentBusy(previous => { const next = new Set(previous); if (active) next.add(id); else next.delete(id); return next; });
  }

  async function markComplete(id: string) {
    if (mutationLock.current || controlsBusy) return;
    mutationLock.current = true; setBusy(true); setMessage('');
    try {
      const result = await completeItem(id, session.csrf_token);
      if (!alive.current) return;
      setMessage(result.already_completed ? 'This lesson was already complete.' : 'Lesson completion saved.');
      setTargetItem(id); focusRequested.current = true; setReload(value => value + 1);
    } catch (error) {
      if (!alive.current) return;
      if (error instanceof PortalRequestError && error.status === 401) { onAuthenticationRequired(); return; }
      const errorMessage = error instanceof PortalRequestError && error.status === 403 ? 'The lesson could not be updated. Refresh account access before trying again.' :
        error instanceof PortalRequestError ? error.message : 'The lesson could not be updated. Refresh programs to check its current status.';
      if (error instanceof PortalRequestError && [403, 404].includes(error.status)) setView({ status: 'unavailable', message: errorMessage });
      else setRefreshError(errorMessage);
    } finally {
      mutationLock.current = false;
      if (alive.current) setBusy(false);
    }
  }

  return <section className="sp-learning" aria-labelledby="sp-learning-heading" aria-busy={controlsBusy || (!ready && view.status === 'loading')}>
    <div className="sp-learning-top"><div><p className="sp-eyebrow">Your programs</p><h2 id="sp-learning-heading" ref={heading} tabIndex={-1}>{revalidating ? 'Checking your programs' : ready?.detail ? ready.detail.program.title : 'Make room for your next step'}</h2></div>
      {selection ? <button type="button" onClick={back} disabled={controlsBusy}>Back to programs</button> : null}</div>
    <p className="sp-learning-test">Synthetic learning records · Practice content and progress stay in this synthetic practice environment.</p>
    {message ? <p className="sp-message" role="status">{message}</p> : null}
    {refreshError && ready ? <div className="sp-learning-state"><p role="alert">{refreshError}</p><p>Your assignment editor has been retained. Learning records stay hidden until access is verified when account access changes.</p><button type="button" onClick={() => { setRefreshError(''); setReload(value => value + 1); }} disabled={busy || assignmentBusy.size > 0}>Retry learning records</button></div> : null}
    {(!ready && (view.status === 'loading' || view.status === 'ready')) || (revalidating && !refreshError) ? <div className="sp-learning-state" role="status"><p>Loading your learning records…</p></div> : null}
    {view.status === 'error' || view.status === 'unavailable' ? <div className="sp-learning-state"><h3>{view.status === 'unavailable' ? 'Learning access unavailable' : 'We could not load your learning records'}</h3><p role="alert">{view.message}</p><button type="button" onClick={refresh}>Try again</button></div> : null}
    {ready ? <div hidden={revalidating}>
      {!ready.detail ? <>
        <dl className="sp-learning-summary"><div><dt>Programs in progress</dt><dd>{ready.dashboard.summary.active_programs}</dd></div><div><dt>Lessons complete</dt><dd>{ready.dashboard.summary.completed_items}<span> / {ready.dashboard.summary.total_items}</span></dd></div><div><dt>Lesson progress</dt><dd>{ready.dashboard.summary.progress_percent}<span>%</span></dd></div></dl>
        <div className="sp-learning-section-heading"><h3>My programs</h3><button type="button" onClick={refresh} disabled={controlsBusy}>Refresh programs</button></div>
        {ready.dashboard.programs.length === 0 ? <div className="sp-learning-state"><h3>No programs assigned yet</h3><p>There are no learning enrollments available for your account.</p></div> :
          <div className="sp-program-grid">{ready.dashboard.programs.map(program => <article key={program.id} className="sp-program-card"><div className="sp-program-status">{program.status === 'completed' ? 'Lessons complete' : 'In progress'}</div><h4>{program.title}</h4><p>{program.summary}</p><p className="sp-learning-date"><LocalDate value={program.starts_at} /> – <LocalDate value={program.ends_at} /></p>
            <Progress title={program.title} completed={program.completed_items} total={program.total_items} percent={program.progress_percent} />
            <div className="sp-program-actions"><button type="button" onClick={() => openProgram(program.id)}>View program<span className="sp-sr-only">: {program.title}</span></button>{program.next_item_id ? <button className="sp-learning-primary" type="button" onClick={() => openProgram(program.id, program.next_item_id)}>Continue learning<span className="sp-sr-only">: {program.title}</span></button> : null}</div></article>)}</div>}
        <div className="sp-learning-columns"><section className="sp-panel" aria-labelledby="sp-upcoming-heading"><h3 id="sp-upcoming-heading">Upcoming work</h3>{ready.dashboard.upcoming.length === 0 ? <p>No upcoming work is available.</p> : <ul className="sp-learning-list">{ready.dashboard.upcoming.map(item => <li key={item.id}><p className="sp-learning-meta">{item.program_title} · {item.kind === 'lesson' ? 'Lesson' : 'Assignment'}{item.status === 'draft' ? ' · Saved draft' : ''}</p><h4>{item.title}</h4><p>{item.due_at ? <>Due <LocalDate value={item.due_at} /></> : 'No due date'}</p><button type="button" onClick={() => openProgram(item.program_id, item.id)}>View {item.kind}<span className="sp-sr-only">: {item.title}</span></button></li>)}</ul>}</section>
          <section className="sp-panel" aria-labelledby="sp-feedback-heading"><h3 id="sp-feedback-heading">Mentor feedback</h3>{ready.dashboard.feedback.length === 0 ? <p>No mentor feedback is available.</p> : <ul className="sp-learning-list">{ready.dashboard.feedback.map(feedback => <li key={feedback.id}><p className="sp-learning-meta">{feedback.program_title}</p><h4>{feedback.title}</h4><p className="sp-learning-copy">{feedback.comment}</p><p className="sp-learning-meta">{feedback.mentor_label} · <LocalDate value={feedback.created_at} /></p></li>)}</ul>}</section></div>
        <section className="sp-panel sp-learning-resources" aria-labelledby="sp-resources-heading"><h3 id="sp-resources-heading">Program resources</h3>{ready.dashboard.resources.length === 0 ? <p>No resources are available.</p> : <div className="sp-resource-grid">{ready.dashboard.resources.map(resource => <article key={resource.id}><h4>{resource.title}</h4><p>{resource.description}</p><details><summary>Read resource<span className="sp-sr-only">: {resource.title}</span></summary><p className="sp-learning-copy">{resource.body}</p></details></article>)}</div>}</section>
      </> : <>
        <p>{ready.detail.program.summary}</p>
        <p className="sp-learning-date"><LocalDate value={ready.detail.program.starts_at} /> – <LocalDate value={ready.detail.program.ends_at} /></p>
        <Progress title={ready.detail.program.title} completed={ready.detail.program.completed_items} total={ready.detail.program.total_items} percent={ready.detail.program.progress_percent} />
        <p className="sp-note">Progress counts completed lessons. Synthetic assignments support saved text drafts and practice file attachments. Grading remains unavailable.</p>
        <p className="sp-note">Save assignment drafts before leaving this program. Unsaved answers are discarded when you navigate away.</p>
        {ready.detail.program.items.length === 0 ? <div className="sp-learning-state"><h3>No learning activities yet</h3><p>There are no lessons or assignments available in this program.</p></div> : null}
        <ol className="sp-program-items">{ready.detail.program.items.map(item => <li key={item.id} className="sp-panel"><p className="sp-learning-meta">{item.kind === 'lesson' ? 'Lesson' : 'Assignment'} · {item.status === 'completed' ? 'Completed' : item.status === 'draft' ? 'Saved draft' : item.status === 'submitted' ? 'Submitted' : 'Not started'}</p><h3 id={`learning-item-${item.id}`} tabIndex={-1}>{item.title}</h3><p>{item.description}</p><div className="sp-learning-copy">{item.content}</div><p className="sp-learning-date">{item.due_at ? <>Due <LocalDate value={item.due_at} /></> : 'No due date'}</p>
          {item.kind === 'lesson' ? item.status === 'completed' ? <p className="sp-lesson-completed">✓ Lesson complete{item.completed_at ? <> · <LocalDate value={item.completed_at} /></> : null}</p> : <button type="button" className="sp-learning-primary" onClick={() => void markComplete(item.id)} disabled={controlsBusy}>{busy ? 'Saving lesson…' : 'Mark lesson complete'}<span className="sp-sr-only">: {item.title}</span></button> : <AssignmentSubmission key={`${learnerId}-${item.id}`} session={session} itemId={item.id} programId={ready.detail!.program.id} onAuthenticationRequired={onAuthenticationRequired} onSaved={refreshAssignmentSummary} onSubmitted={refreshAssignmentSummary} onMutationBusy={active => assignmentMutation(item.id, active)} />}</li>)}</ol>
      </>}
      <p className="sp-note">Synthetic lesson progress is self-reported and does not award credit or qualifications.</p>
      <p className="sp-note">Dates use your device’s time zone. Last checked <time dateTime={ready.dashboard.generated_at}>{new Date(ready.dashboard.generated_at).toLocaleString()}</time>.</p>
    </div> : null}
  </section>;
}

export default function Programs(props: Props) {
  // A changed identity always gets fresh component state, with no cached learning records.
  return <ProgramsForLearner key={props.session.user.id} {...props} />;
}
