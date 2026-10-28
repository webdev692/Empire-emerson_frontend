import { useEffect, useId, useState } from 'react';
import { PortalRequestError, type Session } from './client';
import { loadOnboarding, type OnboardingSummary } from './onboardingClient';
import './onboarding.css';

type Props = { session: Session; busy: boolean; onRefresh: () => void; onAuthenticationRequired: () => void };
type View = { status: 'loading' } | { status: 'ready'; data: OnboardingSummary; verifiedSession: Session } |
  { status: 'error'; message: string; verifiedSession: Session };
const descriptions = {
  not_received: { label: 'Awaiting synthetic handoff', body: 'No synthetic onboarding handoff has been received for this learner.' },
  ready: { label: 'Ready for practice learning', body: 'The synthetic onboarding handoff is current. Its practice program is available in your learning space.' },
  held: { label: 'Practice onboarding on hold', body: 'The synthetic onboarding handoff is on hold. Its practice program is unavailable while clearance is reviewed in CRM.' },
  withdrawn: { label: 'Practice enrollment withdrawn', body: 'The synthetic onboarding handoff was withdrawn. Its practice program is unavailable.' },
};

export default function OnboardingHandoff({ session, busy, onRefresh, onAuthenticationRequired }: Props) {
  const [view, setView] = useState<View>({ status: 'loading' });
  const headingId = useId();
  const learnerId = session.user.id;
  useEffect(() => {
    const controller = new AbortController();
    const task = async () => {
      try {
        const data = await loadOnboarding(learnerId, controller.signal);
        if (!controller.signal.aborted) setView({ status: 'ready', data, verifiedSession: session });
      } catch (error) {
        if (controller.signal.aborted) return;
        if (error instanceof PortalRequestError && error.status === 401) { onAuthenticationRequired(); return; }
        setView({ status: 'error', message: error instanceof PortalRequestError ? error.message : 'The onboarding handoff could not be loaded. Please retry.', verifiedSession: session });
      }
    };
    void task();
    return () => { controller.abort(); };
  }, [learnerId, session, onAuthenticationRequired]);
  // A new session must be checked before a previous readiness result can be displayed.
  const current = view.status !== 'loading' && view.verifiedSession === session ? view : null;
  const data = current?.status === 'ready' ? current.data : null;
  const description = data ? descriptions[data.onboarding.status] : null;
  return <section className="sp-onboarding sp-panel" aria-labelledby={headingId}>
    <div className="sp-onboarding-heading"><div><p className="sp-eyebrow">CRM to learning</p><h2 id={headingId}>Onboarding handoff</h2></div>
      <button type="button" disabled={busy} onClick={onRefresh}>Refresh onboarding status</button></div>
    {!current ? <p role="status">Checking synthetic onboarding status…</p> : null}
    {current?.status === 'error' ? <p role="alert" className="sp-error">{current.message}</p> : null}
    {data && description ? <div className="sp-onboarding-result">
      <p className={`sp-onboarding-badge sp-onboarding-${data.onboarding.status}`} role="status">{description.label}</p>
      <p>{description.body}</p>
      {data.onboarding.program_title ? <p className="sp-onboarding-program">{data.onboarding.program_title}</p> : null}
      <p className="sp-note">{data.onboarding.updated_at ? <>Status updated <time dateTime={data.onboarding.updated_at}>{new Date(data.onboarding.updated_at).toLocaleString()}</time><span aria-hidden="true"> · </span></> : null}
        Checked <time dateTime={data.generated_at}>{new Date(data.generated_at).toLocaleString()}</time></p>
    </div> : null}
    <p className="sp-note">CRM handles applications and onboarding clearance. This synthetic environment uses fictional handoffs for a dedicated practice program. Owner/admin controls remain closed.</p>
  </section>;
}
