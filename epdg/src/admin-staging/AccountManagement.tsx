import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { get, post, PortalApiError } from './client';
import { canAccountAction, deliveryLabel, parseAccountManagement, type AccountManagementData, type RolePlan } from './accountManagementData';
import { safeEmail, safeId } from '../synthetic/releaseAccess';
import { RELEASE_REVIEW } from '../synthetic/runtimeProfile';

const actionLabels: Record<string,string> = { verify_onboarding: 'Verify CRM handoff', approve: 'Approve role plan', provision: 'Provision reviewed account', prepare_invitation: 'Prepare invitation', send: 'Send invitation', resend: 'Resend invitation', disable: 'Disable access' };
const time = (value: string | null) => value ? new Date(value).toLocaleString() : 'Not verified';
type PendingAction = { action: string; path: string; body: Record<string, unknown>; name: string };
export default function AccountManagement({ onAuthenticationRequired }: { onAuthenticationRequired: () => void }) {
  const [data, setData] = useState<AccountManagementData | null>(null);
  const [error, setError] = useState(''); const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false); const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(''); const [filter, setFilter] = useState('all');
  const [tab, setTab] = useState('accounts'); const [pending, setPending] = useState<PendingAction | null>(null);
  const [rolePlan, setRolePlan] = useState<RolePlan[]>([]);
  const [roleCode, setRoleCode] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { const element = dialog.current; if (pending && element) element.showModal(); return () => { if (element?.open) element.close(); }; }, [pending]);
  const revision = useRef(0); const mutating = useRef(false);
  const report = useCallback((reason: unknown) => {
    setData(null); setError(reason instanceof PortalApiError ? reason.status === 409 ? 'This record changed or conflicts with an existing identity. Refresh and review before continuing.' : reason.status === 503 ? 'Account management is held pending release approval.' : reason.message : 'Account management data could not be verified.');
    if (reason instanceof PortalApiError && reason.status === 401) onAuthenticationRequired();
  }, [onAuthenticationRequired]);
  const refresh = useCallback(async () => {
    const current = ++revision.current; setLoading(true); setData(null); setError('');
    try { const result = await get<unknown>('/admin/account-management'); if (current === revision.current) setData(parseAccountManagement(result.data)); }
    catch (reason) { if (current === revision.current) report(reason); }
    finally { if (current === revision.current) setLoading(false); }
  }, [report]);
  useEffect(() => { const activeRevision = revision; void refresh(); return () => { ++activeRevision.current; }; }, [refresh]);
  async function mutate(path: string, body: object) {
    if (mutating.current) return; mutating.current = true; ++revision.current; setBusy(true); setError(''); setNotice(''); setPending(null);
    try { await post(path, body); setNotice('Action recorded by the server. Review the refreshed status below.'); setRolePlan([]); await refresh(); }
    catch (reason) { report(reason); }
    finally { mutating.current = false; setBusy(false); }
  }
  function propose(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const fields = new FormData(event.currentTarget);
    const name = String(fields.get('name') ?? '').trim(); const email = String(fields.get('email') ?? '').trim().toLowerCase();
    const organization = Number(fields.get('organization'));
    if (RELEASE_REVIEW && !email.endsWith('.invalid')) { setError('Local review requires a fictional account email ending in .invalid.'); return; }
    if (!name || !safeEmail(email) || !data?.organizations.some(o => o.id === organization) || rolePlan.length === 0) { setError('Enter the account name, email, approved organization and at least one explicit scoped role.'); return; }
    void mutate('/admin/account-plans', { name, email, organization_id: organization, roles: rolePlan });
  }
  function addRole(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!data) return; const fields = new FormData(event.currentTarget);
    const role = data.roles.find(r => r.code === fields.get('role')); const scope = String(fields.get('scope')); const id = String(fields.get('scope_id')).trim();
    if (!role || !role.scope_types.includes(scope) || !safeId(id)) { setError('Choose a scope supported by the role and enter its approved reference. Use self for an account-specific role.'); return; }
    const next = { role_code: role.code, scope_type: scope, scope_id: id };
    if (rolePlan.length >= 16) { setError('A plan can contain at most 16 scoped role assignments.'); return; }
    if (!rolePlan.some(r => JSON.stringify(r) === JSON.stringify(next))) setRolePlan([...rolePlan, next]); setError('');
  }
  function button(action: string, allowed: string[], path: string, body: Record<string,unknown>, name: string) {
    return data && canAccountAction(data, allowed, action) ? <button className="text-button" type="button" key={action} disabled={busy} onClick={() => setPending({ action, path, body, name })}>{actionLabels[action]}</button> : null;
  }
  const matches = (row: { name: string; email: string }) => `${row.name} ${row.email}`.toLowerCase().includes(query.trim().toLowerCase());
  return <>
    <div className="intro-row"><p>CRM verifies onboarding. EPDG records education access and invitations. Preparing an account does not send mail or grant a role.</p><button className="quiet-button" onClick={() => void refresh()} disabled={busy || loading}>Refresh status</button></div>
    {notice && <p className="success-message" role="status">{notice}</p>}{error && <p className="error-message" role="alert">{error}</p>}
    {loading ? <p role="status">Loading authorized account records…</p> : data ? <>
      {!data.release.enabled && <p className="error-message" role="status">Account mutations are held. Read-only review is available.</p>}
      {!data.release.delivery_enabled && <p className="inline-note">Invitation transport is held. Prepared invitations have not been sent.</p>}
      <nav className="sp-tabs" aria-label="Account management views">{['accounts','plans','invitations', ...(data.capabilities.includes('admin.accounts.audit') ? ['audit'] : [])].map(t => <button type="button" key={t} aria-current={tab === t ? 'page' : undefined} onClick={() => { setTab(t); setFilter('all'); }} disabled={busy}>{t[0].toUpperCase() + t.slice(1)}</button>)}</nav>
      {tab !== 'audit' && <div className="am-filters"><label>Search name or email<input type="search" maxLength={150} value={query} onChange={e => setQuery(e.target.value)} /></label><label>Status<select value={filter} onChange={e => setFilter(e.target.value)}><option value="all">All statuses</option>{(tab === 'accounts' ? ['enabled','disabled'] : tab === 'plans' ? ['proposed','approved','provisioned','blocked'] : ['prepared','pending','accepted','expired','revoked']).map(s => <option key={s}>{s}</option>)}</select></label></div>}
      {tab === 'accounts' && <section className="panel table-panel"><div className="table-scroll"><table><caption>Authorized accounts</caption><thead><tr><th>Account</th><th>Approved roles and scope</th><th>Eligibility</th><th>Access</th><th>Last successful sign-in</th><th>Actions</th></tr></thead><tbody>{data.accounts.filter(matches).filter(a => filter === 'all' || (a.active ? 'enabled' : 'disabled') === filter).map(a => <tr key={a.id}><td><strong>{a.name}</strong><br />{a.email}</td><td>{a.roles.map((r,i) => <div key={i}>{r.role_code}<small> · {r.scope_type}: {r.scope_id}</small></div>)}</td><td>Onboarding: {a.onboarding_status}</td><td>{a.active ? 'Enabled' : 'Disabled'}</td><td>{time(a.last_successful_sign_in)}</td><td>{button('prepare_invitation',a.allowed_actions,`/admin/accounts/${a.id}/invitations`,{},`${a.name} (${a.email})`)}{button('disable',a.allowed_actions,`/admin/accounts/${a.id}/disable`,{reason_code:'access_review'},`${a.name} (${a.email})`)}</td></tr>)}</tbody></table></div>{data.accounts.length === 0 && <p className="empty-state">No authorized accounts are available.</p>}</section>}
      {tab === 'plans' && <>
        {data.capabilities.includes('admin.accounts.prepare') && data.release.enabled && <section className="panel"><h2>Prepare an account plan</h2><p>Use the verified register and CRM evidence. Matching or conflicting identities are reviewed by the server before provisioning.</p>
          <form className="am-form" onSubmit={addRole}><fieldset disabled={busy}><legend>Explicit role and scope</legend><label>Role<select name="role" required value={roleCode || data.roles[0]?.code} onChange={event => setRoleCode(event.target.value)}>{data.roles.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}</select></label><label>Scope type<select key={roleCode} name="scope" required>{(data.roles.find(r => r.code === roleCode)?.scope_types ?? data.roles[0]?.scope_types ?? []).map(s => <option key={s}>{s}</option>)}</select></label><label>Approved scope reference<input name="scope_id" maxLength={100} required /></label><button className="quiet-button">Add scoped role</button></fieldset></form>
          <ul>{rolePlan.map((r,i) => <li key={i}>{r.role_code} · {r.scope_type}: {r.scope_id} <button type="button" className="text-button" disabled={busy} onClick={() => setRolePlan(rolePlan.filter((_,index) => index !== i))}>Remove</button></li>)}</ul>
          <form className="am-form" onSubmit={propose}><fieldset disabled={busy}><label>Name<input name="name" maxLength={100} required /></label><label>Email<input name="email" type="email" maxLength={150} required /></label><label>Approved organization<select name="organization" required>{data.organizations.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}</select></label><button className="primary-button" disabled={!rolePlan.length}>Record proposal</button></fieldset></form>
        </section>}
        <section className="panel table-panel"><div className="table-scroll"><table><caption>Account plans</caption><thead><tr><th>Proposed account</th><th>Scoped roles</th><th>Review</th><th>Eligibility / conflicts</th><th>Actions</th></tr></thead><tbody>{data.plans.filter(matches).filter(p => filter === 'all' || p.status === filter).map(p => <tr key={p.id}><td><strong>{p.name}</strong><br />{p.email}</td><td>{p.roles.map((r,i) => <div key={i}>{r.role_code} · {r.scope_type}: {r.scope_id}</div>)}</td><td>{p.status} · revision {p.revision}</td><td>Onboarding: {p.onboarding_status}<br />{p.conflict_code ? `Blocked: ${p.conflict_code}` : 'No reported conflict'}</td><td>{['verify_onboarding','approve','provision'].map(a => button(a,p.allowed_actions,`/admin/account-plans/${p.id}/${a === 'verify_onboarding' ? 'verify-onboarding' : a}`,{expected_revision:p.revision},`${p.name} (${p.email})`))}</td></tr>)}</tbody></table></div></section>
      </>}
      {tab === 'invitations' && <section className="panel table-panel"><p className="inline-note">Provider acceptance is not proof of inbox delivery. Email confirmation, acceptance, enabled access and successful login are tracked separately.</p><div className="table-scroll"><table><caption>Invitation lifecycle</caption><thead><tr><th>Account</th><th>Invitation</th><th>Transport</th><th>Email confirmed</th><th>Accepted</th><th>Activated</th><th>Last successful sign-in</th><th>Actions</th></tr></thead><tbody>{data.invitations.filter(matches).filter(i => filter === 'all' || i.status === filter).map(i => <tr key={i.id}><td><strong>{i.name}</strong><br />{i.email}</td><td>{i.status}<br /><small>Expires: {time(i.expires_at)}</small></td><td>{deliveryLabel(i.delivery_status)}</td><td>{time(i.email_confirmed_at)}</td><td>{time(i.accepted_at)}</td><td>{time(i.activated_at)}</td><td>{time(i.last_successful_sign_in)}</td><td>{['send','resend'].map(a => button(a,i.allowed_actions,`/admin/invitations/${i.id}/${a}`,{},`${i.name} (${i.email})`))}</td></tr>)}</tbody></table></div></section>}
      {tab === 'audit' && data.capabilities.includes('admin.accounts.audit') && <section className="panel table-panel"><div className="table-scroll"><table><caption>Account audit events</caption><thead><tr><th>Time</th><th>Event</th><th>Actor reference</th><th>Account reference</th><th>Plan / invitation reference</th></tr></thead><tbody>{data.audit.map(a => <tr key={a.id}><td>{time(a.created_at)}</td><td>{a.event}</td><td>{a.actor_user_id ?? 'System'}</td><td>{a.target_user_id ?? '—'}</td><td>{a.plan_id ?? a.invitation_id ?? '—'}</td></tr>)}</tbody></table></div></section>}
    </> : null}
    {pending && <dialog ref={dialog} className="confirm-dialog am-dialog" aria-labelledby="account-action-title" onCancel={() => setPending(null)}><h2 id="account-action-title">{actionLabels[pending.action]}</h2><p>Account: <strong>{pending.name}</strong>. The server rechecks your current permission, scope and record revision.</p>{['send','resend'].includes(pending.action) && <p>This requests invitation transport. The refreshed status will show the provider outcome.</p>}{pending.action === 'disable' && <p>Access and existing sessions will be revoked.</p>}<form onSubmit={e => { e.preventDefault(); const fields = new FormData(e.currentTarget); void mutate(pending.path,{...pending.body,...(pending.action === 'verify_onboarding' ? {evidence_ref: String(fields.get('evidence_ref')).trim()} : {})}); }}>{pending.action === 'verify_onboarding' && <label>Verified CRM evidence reference<input name="evidence_ref" required minLength={8} maxLength={120} pattern={'[A-Za-z0-9][A-Za-z0-9:_.\\/\\-]{7,119}'} autoFocus /><small>Reference only. Do not paste applicant documents or HR details.</small></label>}<div className="dialog-actions"><button className="quiet-button" type="button" onClick={() => setPending(null)}>Cancel</button><button className="primary-button" type="submit">Confirm {actionLabels[pending.action].toLowerCase()}</button></div></form></dialog>}
  </>;
}
