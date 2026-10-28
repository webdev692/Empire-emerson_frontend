import { useEffect, useId, useState } from 'react';
import { PortalRequestError, type Session } from './client';
import { loadAssignmentFeedback, type LearnerFeedback } from './reviewClient';
import './mentor.css';

type Props = { session: Session; itemId: string; programId: string; receiptId: string | null; onAuthenticationRequired: () => void; onUnavailable: () => void };
type View = { status: 'loading' } | { status: 'ready'; data: LearnerFeedback; verifiedSession: Session; receiptId: string | null } |
  { status: 'error' | 'unavailable'; message: string };

export default function AssignmentFeedback({ session, itemId, programId, receiptId, onAuthenticationRequired, onUnavailable }: Props) {
  const [view, setView] = useState<View>({ status: 'loading' });
  const [reload, setReload] = useState(0);
  const headingId = useId();
  const learnerId = session.user.id;
  useEffect(() => {
    const controller = new AbortController();
    const task = async () => {
      try {
        const data = await loadAssignmentFeedback(itemId, programId, learnerId, receiptId, controller.signal);
        if (!controller.signal.aborted) setView({ status: 'ready', data, verifiedSession: session, receiptId });
      } catch (error) {
        if (controller.signal.aborted) return;
        if (error instanceof PortalRequestError && error.status === 401) { onAuthenticationRequired(); return; }
        const unavailable = error instanceof PortalRequestError && [403, 404].includes(error.status);
        if (unavailable) { onUnavailable(); return; }
        setView({ status: unavailable ? 'unavailable' : 'error', message: unavailable ? 'Feedback is unavailable for your current assignment access.' : 'Published feedback could not be loaded. Please try again.' });
      }
    };
    void task(); return () => { controller.abort(); };
  }, [itemId, programId, learnerId, receiptId, session, reload, onAuthenticationRequired, onUnavailable]);
  const ready = view.status === 'ready' && view.verifiedSession === session && view.receiptId === receiptId ? view.data : null;
  return <section className="sp-assignment-feedback" aria-labelledby={headingId}>
    <div className="sp-mentor-top"><h5 id={headingId}>Published mentor feedback</h5><button type="button" onClick={() => setReload(value => value + 1)}>Refresh feedback</button></div>
    {!ready && (view.status === 'loading' || view.status === 'ready') ? <p role="status">Loading published feedback…</p> : null}
    {view.status === 'error' || view.status === 'unavailable' ? <p className="sp-mentor-error" role="alert">{view.message}</p> : null}
    {ready ? ready.feedback.length === 0 ? <p className="sp-note">No published feedback yet. Private mentor drafts are not visible here.</p> :
      <ul className="sp-feedback-published">{ready.feedback.map(feedback => <li key={feedback.id}><p className="sp-mentor-copy">{feedback.comment}</p>
        <p className="sp-note">{feedback.mentor_label} · <time dateTime={feedback.published_at}>{new Date(feedback.published_at).toLocaleString()}</time></p></li>)}</ul> : null}
    <p className="sp-note">Feedback does not award a grade, credit, certificate or qualification.</p>
  </section>;
}
