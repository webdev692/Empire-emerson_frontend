import { HOSTED_PRACTICE, recoveryMailbox, recoveryNotice } from './runtimeProfile';
import { useCallback, useEffect, useRef, useState } from 'react';
import logo from '../assets/epd_logo.png';
import AccountForms from './AccountForms';
import type { AccountAction } from './AccountForms';
import Dashboard from './Dashboard';
import { createPortalClient, PortalRequestError } from './client';
import type { Session } from './client';

const api = createPortalClient();
const knownPaths = new Set(['/', '/login', '/forgot-password', '/reset-password', '/dashboard', '/account', '/change-password']);
const privatePaths = new Set(['/dashboard', '/account', '/change-password']);
const editingSelector = '[data-assignment-editor], [data-mentor-editor]';
function errorMessage(error: unknown) { return error instanceof PortalRequestError ? error.message : 'The request could not be completed. Please try again.'; }
export default function SyntheticPortal({ recoveryToken }: { recoveryToken: string | null }) {
  const [path, setPath] = useState(window.location.pathname);
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [unavailable, setUnavailable] = useState(false);
  const [token, setToken] = useState(recoveryToken);
  const [logoutUnconfirmed, setLogoutUnconfirmed] = useState(false);
  const generation = useRef(0);
  const activeRead = useRef<AbortController | null>(null);
  const pendingMutation = useRef(false);
  const failedLogout = useRef<string | null>(null);

  function navigate(next: string) {
    window.history.replaceState(null, '', next); setPath(next);
    requestAnimationFrame(() => { window.scrollTo(0, 0); document.querySelector<HTMLElement>('h1')?.focus({ preventScroll: true }); });
  }
  const refresh = useCallback(async () => {
    if (pendingMutation.current || failedLogout.current) return;
    const revision = ++generation.current;
    activeRead.current?.abort();
    const controller = new AbortController(); activeRead.current = controller;
    // Hide account details while checking current server state, including after returning to this tab.
    // Keep only an editing subtree in memory while hidden; a 401 or changed
    // identity/scope still discards it. Nothing is persisted in browser storage.
    if (!document.querySelector(editingSelector)) setSession(null);
    setChecking(true); setUnavailable(false);
    try {
      const value = await api.session(controller.signal);
      if (generation.current === revision) { setSession(value); setNotice(''); }
    } catch (error) {
      if (controller.signal.aborted || generation.current !== revision) return;
      if (!(error instanceof PortalRequestError) || error.status !== 401) { setUnavailable(true); setNotice(errorMessage(error)); }
      else { setSession(null); if (privatePaths.has(window.location.pathname)) setNotice('Your session has ended. Sign in to continue.'); }
    } finally { if (generation.current === revision) setChecking(false); }
  }, []);
  useEffect(() => {
    let mounted = true;
    const revision = generation;
    queueMicrotask(() => { if (mounted) void refresh(); });
    // Returning from a password manager or test mailbox must not discard typed form fields.
    // Form submissions still validate current access at the server.
    const focus = () => { if (document.visibilityState === 'visible' && (!document.querySelector('form') || document.querySelector(editingSelector))) void refresh(); };
    const pop = () => { setToken(null); setPath(window.location.pathname); void refresh(); };
    const offline = () => {
      ++generation.current; activeRead.current?.abort();
      const editing = Boolean(document.querySelector(editingSelector));
      if (!editing) setSession(null);
      setChecking(false); setUnavailable(true);
      setNotice(editing ? 'You are offline. Your unsaved work is kept in this tab while account details are hidden. Recheck access when connected.' : 'You are offline. Account details are hidden until access can be checked.');
    };
    window.addEventListener('focus', focus); document.addEventListener('visibilitychange', focus);
    window.addEventListener('popstate', pop); window.addEventListener('offline', offline);
    return () => { mounted = false; ++revision.current; activeRead.current?.abort(); window.removeEventListener('focus', focus);
      document.removeEventListener('visibilitychange', focus); window.removeEventListener('popstate', pop); window.removeEventListener('offline', offline); };
  }, [refresh]);
  useEffect(() => {
    if (!session) return;
    const expires = window.setTimeout(() => {
      ++generation.current; activeRead.current?.abort(); setSession(null);
      setNotice('Your session has ended. Sign in to continue.');
    }, Math.max(0, Date.parse(session.expires_at) - Date.now()));
    return () => window.clearTimeout(expires);
  }, [session]);

  async function submit(action: AccountAction, values: { email: string; password: string; current: string }) {
    if (pendingMutation.current) return;
    pendingMutation.current = true; const revision = ++generation.current; activeRead.current?.abort(); setChecking(false); setBusy(true); setNotice('');
    const current = session; setSession(null);
    try {
      if (action === 'login') { const value = await api.login(values.email, values.password); if (generation.current !== revision) return; failedLogout.current = null; setSession(value); setUnavailable(false); navigate('/dashboard'); }
      if (action === 'forgot') { await api.forgot(values.email); if (generation.current !== revision) return; setNotice(recoveryNotice); }
      if (action === 'reset') {
        if (!token) throw new PortalRequestError(400, `Open a fresh recovery link from ${recoveryMailbox}.`);
        await api.reset(token, values.password); if (generation.current !== revision) return; setToken(null); failedLogout.current = null;
        navigate('/login'); setNotice('Password reset. Sign in with your new password.');
      }
      if (action === 'change') {
        if (!current) throw new PortalRequestError(401, 'Your session has ended. Sign in to continue.');
        await api.change(values.current, values.password, current.csrf_token); if (generation.current !== revision) return; failedLogout.current = null;
        navigate('/login'); setNotice('Password changed. Sign in again. Existing sessions have ended.');
      }
    } catch (error) {
      if (generation.current !== revision) return;
      setNotice(errorMessage(error));
      if (action === 'change' && current && error instanceof PortalRequestError && error.status !== 401 && error.status !== 0) setSession(current);
      if (action === 'login' && error instanceof PortalRequestError && error.status === 0) setUnavailable(true);
    } finally { pendingMutation.current = false; setBusy(false); }
  }
  async function logout() {
    const csrf = session?.csrf_token ?? failedLogout.current;
    if (!csrf || pendingMutation.current) return;
    pendingMutation.current = true; ++generation.current; activeRead.current?.abort(); setSession(null); setChecking(false); setBusy(true);
    failedLogout.current = csrf; setLogoutUnconfirmed(true);
    try { await api.logout(csrf); failedLogout.current = null; setLogoutUnconfirmed(false); navigate('/login'); setNotice('You have signed out.'); }
    catch (error) {
      if (error instanceof PortalRequestError && error.status === 401) { failedLogout.current = null; setLogoutUnconfirmed(false); navigate('/login'); setNotice('Your session has ended.'); }
      else { navigate('/login'); setNotice('Account details are hidden, but server sign-out could not be confirmed. Retry sign-out before closing this tab.'); }
    } finally { pendingMutation.current = false; setBusy(false); }
  }
  const closed = !knownPaths.has(path);
  let content;
  if (closed) content = <section className="sp-form-card"><h1 tabIndex={-1}>This area is unavailable</h1><p>Owner/admin tools, invitations and other program areas remain closed.</p><a href={session ? '/dashboard' : '/login'}>Return to {session ? 'dashboard' : 'sign in'}</a></section>;
  else if (logoutUnconfirmed) content = <section className="sp-form-card"><h1 tabIndex={-1}>Sign-out needs another attempt</h1><p role="alert">{notice}</p><button onClick={() => void logout()} disabled={busy} type="button">Retry sign-out</button></section>;
  else if (session && path !== '/forgot-password' && path !== '/reset-password' && path !== '/change-password') content = <>
    {checking ? <section className="sp-form-card" role="status"><h1>Checking account access</h1><p>Your unsaved answer remains in memory while the server checks access.</p></section> : unavailable ? <section className="sp-form-card"><h1>Account access could not be checked</h1><p role="alert">{notice}</p><button type="button" onClick={() => void refresh()}>Try again</button></section> : null}
    <div hidden={checking || unavailable}><Dashboard key={`${session.user.id}:${session.csrf_token}:${JSON.stringify(session.user.memberships)}`} session={session} account={path === '/account'} busy={busy} onLogout={() => void logout()} onRefresh={() => void refresh()} onAuthenticationRequired={refresh} /></div>
  </>;
  else if (checking) content = <section className="sp-form-card" role="status"><h1>Checking account access</h1><p>Please wait while the server verifies your practice session.</p></section>;
  else if (path === '/reset-password' && !token) content = <section className="sp-form-card"><h1 tabIndex={-1}>A fresh recovery link is required</h1><p>Recovery links are used once and are removed from the address bar. If this page was reloaded, request a new link.</p><a href="/forgot-password">Request a recovery link</a></section>;
  else if (unavailable && privatePaths.has(path)) content = <section className="sp-form-card"><h1 tabIndex={-1}>Account access could not be checked</h1><p role="alert">{notice}</p><button type="button" onClick={() => void refresh()}>Try again</button><a href="/login">Back to sign in</a></section>;
  else {
    const action: AccountAction = path === '/forgot-password' ? 'forgot' : path === '/reset-password' ? 'reset' : path === '/change-password' && session ? 'change' : 'login';
    content = <AccountForms key={action} action={action} busy={busy} notice={notice} onSubmit={values => submit(action, values)} />;
  }
  return <div className="sp-root"><a href="#portal-main" className="sp-skip">Skip to main content</a><div className="sp-environment" role="note">{HOSTED_PRACTICE ? 'Hosted synthetic practice · Fictional learning records only · Owner/admin controls closed' : 'Local synthetic environment · Test accounts only · Production locked'}</div><header className="sp-header"><a href="/" aria-label="EPDG portal home"><img src={logo} alt="EPDG" width="60" height="60" /><span>Learning &amp;<br />Program Portal</span></a><span className="sp-status"><span aria-hidden="true">●</span> Synthetic test</span></header><main id="portal-main" tabIndex={-1}>{notice && session ? <p className="sp-message" role="status">{notice}</p> : null}{content}</main><footer className="sp-footer">Individual access. Learning with purpose.<span>Test data only · Privileged controls closed</span></footer></div>;
}
