import { useEffect, useState, type FormEvent } from 'react';
import { get, post, PortalApiError, restoreSession, signIn, signOut, type PortalSession } from './client';

type Page = 'overview' | 'users' | 'roles' | 'education';
type Overview = {
  environment: string;
  accounts: { total: number; active: number; inactive: number };
  role_assignments: { pending: number; active: number };
  audit_events_30d: number;
};
type PortalUser = {
  id: number;
  name: string;
  email: string;
  legacy_role: string;
  active: boolean;
  portal_roles: string[];
  pending_role_requests: number;
};
type RoleAssignment = {
  id: string;
  user_id: number;
  name: string;
  email: string;
  role_code: string;
  status: string;
  created_at: string;
};
type RolesPayload = {
  catalog: { code: string; name: string; status: string; requestable: boolean; permissions: string[] }[];
  assignments: RoleAssignment[];
  hr_boundary: string;
};
type Readiness = {
  programs: { status: string; writable: boolean };
  cohorts: { status: string; writable: boolean };
  assignments: { status: string; writable: boolean };
  crm: { owner: string; learner_activation: boolean };
};

const pages: { id: Page; title: string; short: string }[] = [
  { id: 'overview', title: 'Overview', short: 'Overview' },
  { id: 'users', title: 'Users', short: 'Users' },
  { id: 'roles', title: 'Roles', short: 'Roles' },
  { id: 'education', title: 'Education setup', short: 'Programs' },
];

function messageFor(error: unknown): string {
  if (error instanceof PortalApiError) return error.message;
  return 'The request could not be completed.';
}

function AccessDenied() {
  return <section className="panel notice-panel" role="status">
    <span className="eyebrow">Access denied</span>
    <h2>This account has no administrator permission.</h2>
    <p>Permissions come from the server session. A role selected in this page cannot grant access.</p>
  </section>;
}

function LoadingPanel({ label }: { label: string }) {
  return <div className="panel loading-panel" role="status" aria-live="polite"><span className="spinner" /> Loading {label}…</div>;
}

export function AdminStagingApp() {
  const hostedBuild = __EPDG_ADMIN_STAGING_HOSTED__;
  const [session, setSession] = useState<PortalSession | null>(null);
  const [booting, setBooting] = useState(true);
  const [page, setPage] = useState<Page>('overview');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [logoutUnconfirmed, setLogoutUnconfirmed] = useState(false);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [users, setUsers] = useState<PortalUser[]>([]);
  const [roles, setRoles] = useState<RolesPayload | null>(null);
  const [readiness, setReadiness] = useState<Readiness | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<PortalUser | null>(null);

  useEffect(() => {
    let mounted = true;
    restoreSession()
      .then(value => { if (mounted) setSession(value); })
      .catch(reason => {
        if (mounted && !(reason instanceof PortalApiError && reason.status === 401)) setError(messageFor(reason));
      })
      .finally(() => { if (mounted) setBooting(false); });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!session) return;
    let mounted = true;
    const load = async () => {
      try {
        if (page === 'overview') {
          const result = await get<Overview>('/admin/overview');
          if (mounted) setOverview(result.data ?? null);
        } else if (page === 'users') {
          const result = await get<{ items: PortalUser[] }>('/admin/users');
          if (mounted) setUsers(result.data?.items ?? []);
        } else if (page === 'roles') {
          const result = await get<RolesPayload>('/admin/roles');
          if (mounted) setRoles(result.data ?? null);
        } else {
          const result = await get<Readiness>('/admin/education-readiness');
          if (mounted) setReadiness(result.data ?? null);
        }
      } catch (reason) {
        if (mounted) {
          setError(messageFor(reason));
          if (reason instanceof PortalApiError && reason.status === 401) setSession(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    void load();
    return () => { mounted = false; };
  }, [page, session]);

  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setLoading(true);
    setError('');
    setNotice('');
    try {
      const next = await signIn(email.trim(), password);
      setSession(next);
      setPassword('');
      setLogoutUnconfirmed(false);
      setPage('overview');
    } catch (reason) {
      setError(messageFor(reason));
    } finally {
      setPending(false);
    }
  }

  async function handleSignOut() {
    setPending(true);
    setError('');
    setNotice('');
    let confirmed = false;
    try {
      await signOut();
      confirmed = true;
    } catch {
      // Keep the login page locked while retaining the in-memory CSRF token for a retry.
    }
    setSession(null);
    setOverview(null);
    setUsers([]);
    setRoles(null);
    setPassword('');
    setPage('overview');
    setLogoutUnconfirmed(!confirmed);
    setNotice(confirmed ? 'Signed out.' : '');
    setError(confirmed ? '' : 'The server could not confirm logout. This device may still have an active session; reconnect and retry server sign out.');
    setPending(false);
  }

  async function retryServerLogout() {
    setPending(true);
    setError('');
    try {
      await signOut();
      setLogoutUnconfirmed(false);
      setNotice('Signed out.');
    } catch {
      setError('The server could not confirm logout. This device may still have an active session; reconnect and retry server sign out.');
    } finally {
      setPending(false);
    }
  }

  async function submitRoleRequest() {
    if (!confirmTarget) return;
    setPending(true);
    setError('');
    setNotice('');
    try {
      await post('/admin/role-requests', { target_user_id: confirmTarget.id, role_code: 'webdev_technical' });
      setNotice('Request recorded for policy review. No permission was granted.');
      setConfirmTarget(null);
      setLoading(true);
      setPage('roles');
    } catch (reason) {
      setError(messageFor(reason));
    } finally {
      setPending(false);
    }
  }

  const hasAdminAccess = Boolean(session?.user.permissions.includes('admin.overview.read'));

  if (booting) return <main className="boot-screen"><div className="loading-card"><span className="spinner" /> Restoring secure session…</div></main>;
  if (!session) return <main className="login-screen">
    <div className="login-wrap">
      <div className="brand-lockup"><div className="brand-mark">E</div><div><span className="eyebrow">The Emerson Empire</span><strong>EPDG administrator</strong></div></div>
      <div className="staging-banner"><span className="status-dot" /> {hostedBuild ? 'Protected hosted staging' : 'Isolated local staging'} · synthetic <code>.invalid</code> accounts only</div>
      <section className="login-card">
        <span className="eyebrow">Secure sign in</span>
        <h1>Welcome back</h1>
        <p className="muted">Sign in with an approved staging account. Access and permissions are verified by the server.</p>
        <form onSubmit={handleSignIn}>
          <label htmlFor="admin-email">Email address</label>
          <input id="admin-email" type="email" autoComplete="username" value={email} onChange={event => setEmail(event.target.value)} required maxLength={150} />
          <label htmlFor="admin-password">Password</label>
          <input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required maxLength={72} />
          {notice && <p className="success-message" role="status">{notice}</p>}
          {error && <p className="error-message" role="alert">{error}</p>}
          {logoutUnconfirmed && <button className="quiet-button full-width" type="button" onClick={() => void retryServerLogout()} disabled={pending}>{pending ? 'Retrying sign out…' : 'Retry server sign out'}</button>}
          <button className="primary-button full-width" type="submit" disabled={pending}>
            {pending ? 'Signing in…' : 'Sign in'} <span aria-hidden="true">→</span>
          </button>
        </form>
        <p className="login-footnote">No role selector. No browser-stored bearer token. Sessions use an HttpOnly cookie.</p>
      </section>
      {!hostedBuild && <p className="local-only">This build is restricted to loopback. It does not connect to production EPDG or CRM data.</p>}
    </div>
  </main>;

  return <main className="app-shell">
    <header className="topbar">
      <div className="brand-lockup"><div className="brand-mark">E</div><div><span className="eyebrow">The Emerson Empire</span><strong>EPDG administrator</strong></div></div>
      <div className="topbar-right"><span className="environment-pill"><span className="status-dot" /> {hostedBuild ? 'Hosted staging' : 'Local staging'}</span>
        <div className="user-menu"><div className="avatar">{session.user.name.slice(0, 1).toUpperCase()}</div><div className="user-identity"><strong>{session.user.name}</strong><span>{session.user.portal_roles?.join(', ') || 'No portal role'}</span></div></div>
        <button className="quiet-button signout-button" onClick={() => void handleSignOut()} disabled={pending}>Sign out</button>
      </div>
    </header>
    <div className="staging-strip"><span className="status-dot" /> Staging data is isolated and uses synthetic <code>.invalid</code> identities. Production access remains locked.</div>
    <div className="layout">
      <aside className="sidebar" aria-label="Administrator navigation">
        <span className="sidebar-label">Workspace</span>
        <nav>{pages.map(item => <button key={item.id} className={`nav-item ${page === item.id ? 'selected' : ''}`} onClick={() => { setLoading(true); setPage(item.id); setError(''); setNotice(''); }} aria-current={page === item.id ? 'page' : undefined}>
          <span className="nav-icon" aria-hidden="true">{item.id === 'overview' ? '◫' : item.id === 'users' ? '◎' : item.id === 'roles' ? '◇' : '▤'}</span>{item.short}<span className="nav-arrow" aria-hidden="true">›</span>
        </button>)}</nav>
        <div className="sidebar-note"><span className="sidebar-label">Data boundary</span><p>Applicants, resumes and onboarding remain in the Emerson CRM.</p><p>EPDG starts after verified onboarding.</p></div>
      </aside>
      <section className="main-content">
        <div className="page-heading"><div><span className="eyebrow">Administrator workspace</span><h1>{pages.find(item => item.id === page)?.title}</h1></div><span className="read-only-pill">Server session verified</span></div>
        {notice && <p className="success-message" role="status">{notice}</p>}
        {error && <p className="error-message page-error" role="alert">{error}</p>}
        {!hasAdminAccess ? <AccessDenied /> : loading ? <LoadingPanel label={page === 'overview' ? 'overview' : page} /> : <>
          {page === 'overview' && <OverviewPage data={overview} />}
          {page === 'users' && <UsersPage users={users} currentUserId={session.user.id} onRequest={setConfirmTarget} />}
          {page === 'roles' && <RolesPage data={roles} />}
          {page === 'education' && <EducationPage data={readiness} />}
        </>}
      </section>
    </div>
    <footer className="footer"><span>EPDG admin staging</span><span>{hostedBuild ? 'Hosted synthetic review · no real learner records · no production permissions' : 'Local only · no real learner records · no production permissions'}</span></footer>
    {confirmTarget && <div className="modal-backdrop" role="presentation"><section className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="role-request-title">
      <span className="eyebrow">Role review request</span><h2 id="role-request-title">Request WebDev policy review?</h2>
      <p>This records a pending request for <strong>{confirmTarget.name}</strong>. It does not assign a role or grant permissions.</p>
      <div className="dialog-actions"><button className="quiet-button" onClick={() => setConfirmTarget(null)} disabled={pending}>Cancel</button><button className="primary-button" onClick={() => void submitRoleRequest()} disabled={pending}>{pending ? 'Recording…' : 'Record pending request'}</button></div>
    </section></div>}
  </main>;
}

function OverviewPage({ data }: { data: Overview | null }) {
  if (!data) return <section className="panel empty-panel"><h2>No overview available</h2><p>The API did not return staging metrics.</p></section>;
  const cards = [
    { label: 'Synthetic EPDG accounts', value: data.accounts.total, hint: 'Visible to this staging service' },
    { label: 'Active portal accounts', value: data.accounts.active, hint: 'Explicitly enabled in the isolated database' },
    { label: 'Pending role requests', value: data.role_assignments.pending, hint: 'No permission is granted while pending' },
    { label: 'Audit events · 30 days', value: data.audit_events_30d, hint: 'Administrative actions only' },
  ];
  return <>
    <section className="welcome-panel"><div><span className="eyebrow">Institution overview</span><h2>A clear view of EPDG access</h2><p>These counts come from the isolated administrator API. No applicant or real learner records are included.</p></div><div className="welcome-seal" aria-hidden="true">E</div></section>
    <div className="stat-grid">{cards.map(card => <article className="stat-card" key={card.label}><span>{card.label}</span><strong>{card.value.toLocaleString()}</strong><small>{card.hint}</small></article>)}</div>
    <section className="section-heading"><div><span className="eyebrow">Current build</span><h2>Ready for staged review</h2></div><span className="state-tag">{data.environment}</span></section>
    <div className="two-column-grid"><article className="panel"><div className="panel-top"><div><span className="eyebrow">Account controls</span><h3>Secure session foundation</h3></div><span className="check-mark">✓</span></div><ul className="check-list"><li>Server-verified identity and role</li><li>HttpOnly session cookie with CSRF checks</li><li>Logout and session restoration</li><li>Role requests remain inactive until review</li></ul></article>
      <article className="panel boundary-panel"><span className="eyebrow">System boundary</span><h3>CRM and EPDG have separate jobs</h3><p>The CRM owns applicants, resumes and verified onboarding. EPDG begins after that handoff and owns learning records.</p><span className="inline-note">No records are transferred in this staging build.</span></article></div>
  </>;
}

function UsersPage({ users, currentUserId, onRequest }: { users: PortalUser[]; currentUserId: number; onRequest: (user: PortalUser) => void }) {
  return <>
    <div className="intro-row"><p>Only verified synthetic accounts with an active EPDG staging account are listed.</p><span className="state-tag">{users.length} shown</span></div>
    <section className="panel table-panel"><div className="panel-top"><div><span className="eyebrow">Account directory</span><h2>Users and access requests</h2></div><span className="panel-icon">◎</span></div>
      {users.length === 0 ? <p className="empty-state">No eligible synthetic accounts are available.</p> : <div className="table-scroll"><table><thead><tr><th>Name</th><th>Email</th><th>Legacy profile</th><th>Portal role</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{users.map(user => <tr key={user.id}>
        <td><strong>{user.name}</strong>{user.id === currentUserId && <span className="self-label">You</span>}</td><td className="mono">{user.email}</td><td>{user.legacy_role}</td>
        <td>{user.portal_roles.length ? user.portal_roles.map(role => <span className="role-chip" key={role}>{role}</span>) : <span className="muted">None</span>}</td>
        <td><span className={`state-tag ${user.active ? 'active' : 'inactive'}`}>{user.active ? 'Active' : 'Inactive'}</span></td>
        <td>{user.id !== currentUserId && user.pending_role_requests === 0 && !user.portal_roles.includes('webdev_technical')
          ? <button className="text-button" onClick={() => onRequest(user)}>Request WebDev review</button>
          : user.pending_role_requests > 0 ? <span className="pending-label">Review pending</span> : null}</td>
      </tr>)}</tbody></table></div>}
    </section>
  </>;
}

function RolesPage({ data }: { data: RolesPayload | null }) {
  if (!data) return <section className="panel empty-panel"><h2>Role catalog unavailable</h2></section>;
  return <>
    <p className="page-intro">Portal permissions are resolved by the backend on every session. Founder access cannot be requested from this interface.</p>
    <div className="role-grid">{data.catalog.map(role => <article className="panel role-card" key={role.code}><div className="role-card-head"><span className="role-icon">◇</span><span className="state-tag">{role.status.replaceAll('-', ' ')}</span></div><h2>{role.name}</h2><p className="mono">{role.code}</p><div className="permission-list"><span className="eyebrow">Effective permissions</span>{role.permissions.length ? role.permissions.map(permission => <span className="permission-chip" key={permission}>{permission}</span>) : <p className="muted">None pending approved scope.</p>}</div></article>)}</div>
    <section className="panel table-panel"><div className="panel-top"><div><span className="eyebrow">Assignment history</span><h2>Active roles and review requests</h2></div></div>
      {data.assignments.length === 0 ? <p className="empty-state">No role assignments or requests.</p> : <div className="table-scroll"><table><thead><tr><th>Account</th><th>Role</th><th>State</th><th>Requested</th></tr></thead><tbody>{data.assignments.map(item => <tr key={item.id}><td><strong>{item.name}</strong><br /><span className="muted mono">{item.email}</span></td><td className="mono">{item.role_code}</td><td><span className={`state-tag ${item.status === 'active' ? 'active' : 'pending'}`}>{item.status}</span></td><td>{new Date(item.created_at).toLocaleDateString()}</td></tr>)}</tbody></table></div>}
    </section>
    <p className="boundary-callout">{data.hr_boundary} HR permissions are not defined in EPDG staging.</p>
  </>;
}

function EducationPage({ data }: { data: Readiness | null }) {
  if (!data) return <section className="panel empty-panel"><h2>Education readiness unavailable</h2></section>;
  const modules = [
    ['Programs', data.programs],
    ['Cohorts', data.cohorts],
    ['Assignments', data.assignments],
  ] as const;
  return <>
    <div className="intro-row"><p>These modules start after verified onboarding and remain separate from CRM applicant workflows.</p><span className="state-tag">Foundation only</span></div>
    <div className="module-grid">{modules.map(([name, module]) => <article className="panel module-card" key={name}><div className="module-number">0{name === 'Programs' ? '1' : name === 'Cohorts' ? '2' : '3'}</div><span className="eyebrow">Education records</span><h2>{name}</h2><p>Integration is waiting for an approved education schema and ownership map.</p><span className="state-tag">{module.status}</span><button className="disabled-button" disabled={!module.writable}>Manage {name.toLowerCase()}</button></article>)}</div>
    <section className="panel boundary-panel"><span className="eyebrow">Data ownership</span><h2>{data.crm.owner}</h2><p>Applicant, resume and onboarding records stay in the CRM. The EPDG service does not activate learners from a CRM stage label.</p><span className="inline-note">Learner activation: {data.crm.learner_activation ? 'enabled' : 'disabled'}</span></section>
  </>;
}
