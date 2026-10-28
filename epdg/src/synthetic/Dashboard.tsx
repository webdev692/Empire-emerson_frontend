import { useCallback, useState } from 'react';
import type { Session } from './client';
import Programs from './Programs';
import MentorReviews from './MentorReviews';
import OnboardingHandoff from './OnboardingHandoff';

export default function Dashboard({ session, account, busy, onLogout, onRefresh, onAuthenticationRequired }: {
  session: Session; account: boolean; busy: boolean; onLogout: () => void; onRefresh: () => void; onAuthenticationRequired: () => void;
}) {
  const [assignmentBusy, setAssignmentBusy] = useState(false);
  const onAssignmentBusy = useCallback((active: boolean) => setAssignmentBusy(active), []);
  const navigationBusy = busy || assignmentBusy;
  // This chooses presentation only. Review APIs enforce explicit synthetic assignments.
  const mentorView = session.user.legacy_role === 'school';
  return <>
    <div className="sp-dashboard-heading"><div><p className="sp-eyebrow">Your learning space</p><h1 tabIndex={-1}>{account ? 'My account' : 'My dashboard'}</h1><p>Welcome, {session.user.name}.</p></div><button type="button" onClick={onLogout} disabled={navigationBusy}>Sign out</button></div>
    <nav className="sp-tabs" aria-label="Portal navigation"><a href="/dashboard" aria-current={!account ? 'page' : undefined} aria-disabled={navigationBusy || undefined} tabIndex={navigationBusy ? -1 : undefined} onClick={event => { if (navigationBusy) event.preventDefault(); }}>Overview</a><a href="/account" aria-current={account ? 'page' : undefined} aria-disabled={navigationBusy || undefined} tabIndex={navigationBusy ? -1 : undefined} onClick={event => { if (navigationBusy) event.preventDefault(); }}>My account</a></nav>
    {account ? <div className="sp-dashboard-grid">
      <section className="sp-panel"><p className="sp-eyebrow">Account details</p><h2>Your verified account</h2>
        <dl className="sp-details"><dt>Name</dt><dd>{session.user.name}</dd><dt>Email</dt><dd>{session.user.email}</dd><dt>Account reference</dt><dd>{session.user.id}</dd></dl><p className="sp-note">Profile editing is unavailable while editable fields are being reviewed.</p><a href="/change-password">Change password</a>
      </section>
      <section className="sp-panel"><p className="sp-eyebrow">Account & access</p><h2>Confirmed by the server</h2><dl className="sp-details"><dt>Memberships</dt><dd>{session.user.memberships.length}</dd><dt>Privileged controls</dt><dd>Closed</dd><dt>Administrative permissions</dt><dd>None</dd><dt>Session ends by</dt><dd><time dateTime={session.expires_at}>{new Date(session.expires_at).toLocaleString()}</time></dd></dl>
        <ul className="sp-memberships">{session.user.memberships.map(m => <li key={m.id}>{m.school_id !== null ? `School reference ${m.school_id}` : `Organization reference ${m.company_id}`}<small>Membership {m.id}</small></li>)}</ul>
        <p className="sp-note">Membership describes your account scope. Mentor review in this synthetic practice environment also requires an active program assignment. Owner/admin controls remain closed.</p><button type="button" onClick={onRefresh} disabled={navigationBusy}>Refresh account access</button>
      </section>
    </div> : mentorView ? <MentorReviews session={session} onAuthenticationRequired={onAuthenticationRequired} onMutationBusy={onAssignmentBusy} /> : <>
      <OnboardingHandoff session={session} busy={navigationBusy} onRefresh={onRefresh} onAuthenticationRequired={onAuthenticationRequired} />
      <Programs session={session} onAuthenticationRequired={onAuthenticationRequired} onMutationBusy={onAssignmentBusy} />
    </>}
    <section className="sp-closed" aria-label="Unavailable portal features"><h2>More portal features are being prepared</h2><p>Reporting, portfolios, certificates, invitations and owner/admin controls remain closed. Practice file uploads are available only within synthetic practice assignments.</p></section>
  </>;
}
