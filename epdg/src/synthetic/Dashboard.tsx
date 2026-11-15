import { lazy, Suspense, useCallback, useState, type FormEvent } from 'react';
import { PortalRequestError, type Session } from './client';
import { RELEASE_PORTAL } from './runtimeProfile';
import { portalNavigation } from './releaseAccess';
import { createWorkspaceClient } from './workspaceClient';
const ScopedWorkspace = __EPDG_RELEASE_PORTAL_MODE__ ? lazy(() => import('./ScopedWorkspace')) : () => null;
const workspaceApi = createWorkspaceClient();
import Programs from './Programs';
import MentorReviews from './MentorReviews';
import OnboardingHandoff from './OnboardingHandoff';

export default function Dashboard({ session, account, resourceId, view, busy, onLogout, onRefresh, onAuthenticationRequired }: {
  session: Session; account: boolean; resourceId?: string; view?: string; busy: boolean; onLogout: () => void; onRefresh: () => void; onAuthenticationRequired: () => void;
}) {
  const [assignmentBusy, setAssignmentBusy] = useState(false);
  const onAssignmentBusy = useCallback((active: boolean) => setAssignmentBusy(active), []);
  const navigationBusy = busy || assignmentBusy;
  // This chooses presentation only. Review APIs enforce explicit synthetic assignments.
  const mentorView = !RELEASE_PORTAL && session.user.legacy_role === 'school';
  const learner = session.user.permissions.includes('learning.participate');
  const reviewer = session.user.permissions.includes('learning.review');
  const selectedView = view ?? (learner ? 'learning' : 'resources');
  const navigation = portalNavigation(session.user.permissions);
  const [profileMessage, setProfileMessage] = useState('');
  async function updateProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (assignmentBusy) return; setAssignmentBusy(true); setProfileMessage('');
    try { await workspaceApi.profile(String(new FormData(event.currentTarget).get('name') ?? '').trim(), session.csrf_token); onRefresh(); }
    catch(error) { setProfileMessage(error instanceof PortalRequestError ? error.message : 'Your name could not be updated.'); if(error instanceof PortalRequestError && error.status === 401) onAuthenticationRequired(); }
    finally { setAssignmentBusy(false); }
  }
  return <>
    <div className="sp-dashboard-heading"><div><p className="sp-eyebrow">Your learning space</p><h1 tabIndex={-1}>{account ? 'My account' : 'My dashboard'}</h1><p>Welcome, {session.user.name}.</p></div><button type="button" onClick={onLogout} disabled={navigationBusy}>Sign out</button></div>
    <nav className="sp-tabs" aria-label="Portal navigation"><a href="/dashboard" aria-current={!account ? 'page' : undefined} aria-disabled={navigationBusy || undefined} tabIndex={navigationBusy ? -1 : undefined} onClick={event => { if (navigationBusy) event.preventDefault(); }}>Overview</a><a href="/account" aria-current={account ? 'page' : undefined} aria-disabled={navigationBusy || undefined} tabIndex={navigationBusy ? -1 : undefined} onClick={event => { if (navigationBusy) event.preventDefault(); }}>My account</a>{RELEASE_PORTAL && learner && <a href="/learning">My learning</a>}{RELEASE_PORTAL && reviewer && <a href="/reviews">Mentor reviews</a>}{RELEASE_PORTAL && navigation.workspace && <a href="/resources">Resources</a>}{RELEASE_PORTAL && navigation.accounts && <a href="/admin/accounts">Users and invitations</a>}</nav>
    {account ? <div className="sp-dashboard-grid">
      <section className="sp-panel"><p className="sp-eyebrow">Account details</p><h2>Your verified account</h2>
        <dl className="sp-details"><dt>Name</dt><dd>{session.user.name}</dd><dt>Email</dt><dd>{session.user.email}</dd><dt>Account reference</dt><dd>{session.user.id}</dd></dl>{RELEASE_PORTAL && navigation.profileEdit ? <form onSubmit={updateProfile}><label htmlFor="profile-name">Display name</label><input id="profile-name" name="name" defaultValue={session.user.name} maxLength={100} required disabled={navigationBusy}/><button disabled={navigationBusy}>Save display name</button>{profileMessage && <p role="status">{profileMessage}</p>}<p className="sp-note">Email, roles and organization scope require a separate administrator review.</p></form> : <p className="sp-note">Profile editing is unavailable for this account.</p>}<a href="/change-password">Change password</a>
      </section>
      <section className="sp-panel"><p className="sp-eyebrow">Account & access</p><h2>Confirmed by the server</h2><dl className="sp-details"><dt>Approved scopes</dt><dd>{RELEASE_PORTAL ? session.user.assignments?.length ?? 0 : session.user.memberships.length}</dd><dt>Account management</dt><dd>{RELEASE_PORTAL && navigation.accounts ? 'Permitted within approved scope' : 'Unavailable'}</dd><dt>Session ends by</dt><dd><time dateTime={session.expires_at}>{new Date(session.expires_at).toLocaleString()}</time></dd></dl>
        <ul className="sp-memberships">{RELEASE_PORTAL ? session.user.assignments?.map(a => <li key={`${a.id}:${a.scope_type}:${a.scope_id}`}>{a.role_code.replaceAll('_',' ')}<small>{a.scope_type}: {a.scope_id}</small></li>) : session.user.memberships.map(m => <li key={m.id}>{m.school_id !== null ? `School reference ${m.school_id}` : `Organization reference ${m.company_id}`}<small>Membership {m.id}</small></li>)}</ul>
        <p className="sp-note">Each request checks your current approved scope. Roles cannot be changed from your profile.</p><button type="button" onClick={onRefresh} disabled={navigationBusy}>Refresh account access</button>
      </section>
    </div> : RELEASE_PORTAL ? selectedView === 'learning' ? learner ? <><OnboardingHandoff session={session} busy={navigationBusy} onRefresh={onRefresh} onAuthenticationRequired={onAuthenticationRequired}/><Programs session={session} onAuthenticationRequired={onAuthenticationRequired} onMutationBusy={onAssignmentBusy}/></> : <p role="status">Learning access is unavailable for this account.</p> : selectedView === 'reviews' ? reviewer ? <MentorReviews session={session} onAuthenticationRequired={onAuthenticationRequired} onMutationBusy={onAssignmentBusy}/> : <p role="status">Mentor review is unavailable for this account.</p> : navigation.workspace ? <Suspense fallback={<p role="status">Loading workspace…</p>}><ScopedWorkspace key={resourceId ?? 'resources'} session={session} resourceId={resourceId} onAuthenticationRequired={onAuthenticationRequired} /></Suspense> : <p role="status">No workspace permission is assigned to this account.</p> : mentorView ? <MentorReviews session={session} onAuthenticationRequired={onAuthenticationRequired} onMutationBusy={onAssignmentBusy} /> : <>
      <OnboardingHandoff session={session} busy={navigationBusy} onRefresh={onRefresh} onAuthenticationRequired={onAuthenticationRequired} />
      <Programs session={session} onAuthenticationRequired={onAuthenticationRequired} onMutationBusy={onAssignmentBusy} />
    </>}
    {!RELEASE_PORTAL && <section className="sp-closed" aria-label="Unavailable portal features"><h2>More portal features are being prepared</h2><p>Reporting, portfolios, certificates, invitations and owner/admin controls remain closed. Practice file uploads are available only within synthetic practice assignments.</p></section>}
  </>;
}
