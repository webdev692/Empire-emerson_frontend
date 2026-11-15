import { useEffect, useRef, useState, type FormEvent } from 'react';
import { get, post, PortalApiError } from './client';
import { parseInvitation, parseInvitationReview, type InvitationReview as Review } from './invitations';

const displayDate = (value: string | null) => value ? new Date(value).toLocaleString() : 'Not verified';

export default function InvitationReview({ onAuthenticationRequired }: { onAuthenticationRequired: () => void }) {
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [reload, setReload] = useState(0);
  const revision = useRef(0);
  const pending = useRef(false);

  useEffect(() => {
    let mounted = true;
    const currentRevision = revision;
    get<unknown>('/admin/invitations').then(result => { if (mounted) setReview(parseInvitationReview(result.data)); })
      .catch(reason => { if (mounted) {
        setError(reason instanceof PortalApiError ? reason.message : 'Invitation status could not be verified.');
        if (reason instanceof PortalApiError && reason.status === 401) onAuthenticationRequired();
      } })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; currentRevision.current++; };
  }, [onAuthenticationRequired, reload]);

  async function mutate(path: string, body: object) {
    if (pending.current) return;
    pending.current = true; setBusy(true); setError(''); setNotice('');
    const current = revision.current;
    try {
      const result = await post<{ invitation: unknown; reused: boolean }>(path, body);
      const invitation = parseInvitation(result.data?.invitation);
      const fresh = await get<unknown>('/admin/invitations');
      const next = parseInvitationReview(fresh.data);
      if (current !== revision.current) return;
      setReview(next);
      setNotice(invitation.delivery_status === 'sent' ? (result.data?.reused ? 'Existing invitation reused. No duplicate account or invitation was created.' : 'Invitation recorded in the local test mailbox.') : 'Invitation recorded. Delivery has not been confirmed; review its status before retrying.');
    } catch (reason) {
      if (current !== revision.current) return;
      // A network failure may follow a committed operation. Reload before retrying;
      // the server is responsible for idempotent creation and resend behavior.
      setReview(null);
      setError(reason instanceof PortalApiError ? reason.message : 'Invitation status could not be verified.');
      if (reason instanceof PortalApiError && reason.status === 401) onAuthenticationRequired();
    } finally { pending.current = false; if (current === revision.current) setBusy(false); }
  }
  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const userId = Number(values.get('user'));
    const roleCode = String(values.get('role') ?? '');
    if (!review?.eligible_users.some(user => user.id === userId) || !review.roles.some(role => role.code === roleCode && role.invitable)) return;
    await mutate('/admin/invitations', { user_id: userId, role_code: roleCode });
  }
  return <>
    <p className="boundary-callout">Local synthetic invitation review. Messages stay in the test mailbox. Acceptance verifies an email and password; learning access still requires a verified onboarding handoff. Real invitations and privileged role grants remain closed.</p>
    {error && <p className="error-message" role="alert">{error} Refresh status before trying again.</p>}
    {notice && <p className="success-message" role="status">{notice}</p>}
    <button type="button" className="quiet-button" disabled={busy || loading} onClick={() => { setReview(null); setLoading(true); setError(''); setNotice(''); setReload(value => value + 1); }}>Refresh invitation status</button>
    {loading ? <p role="status">Checking invitation eligibility…</p> : review && <>
      <section className="panel"><h2>Invite an eligible account</h2><form onSubmit={event => void create(event)} className="invitation-form">
        <fieldset disabled={busy}><label htmlFor="invitation-user">Existing synthetic identity</label><select id="invitation-user" name="user" required defaultValue=""><option value="" disabled>Select an eligible account</option>{review.eligible_users.map(user => <option key={user.id} value={user.id}>{user.name} · {user.email}</option>)}</select>
          <label htmlFor="invitation-role">Server-approved role</label><select id="invitation-role" name="role" required defaultValue=""><option value="" disabled>Select an available role</option>{review.roles.map(role => <option key={role.code} value={role.code} disabled={!role.invitable}>{role.name}{role.invitable ? '' : ' — unavailable'}</option>)}</select>
          <button className="primary-button" type="submit" disabled={!review.eligible_users.length || !review.roles.some(role => role.invitable)}>{busy ? 'Checking delivery…' : 'Send to local test mailbox'}</button>
        </fieldset></form>
        {!review.eligible_users.length && <p>No eligible accounts. An authenticated administrator must reconcile an existing synthetic identity first.</p>}
        <details><summary>Role scope and review restrictions</summary><ul>{review.roles.filter(role => !role.invitable).map(role => <li key={role.code}>{role.name}: {role.reason ?? 'Requires separate authorized review.'}</li>)}</ul></details>
      </section>
      <section className="panel table-panel"><h2>Invitation and authentication status</h2>{review.items.length ? <div className="table-scroll"><table><thead><tr><th>Account</th><th>Role</th><th>Invitation / delivery</th><th>Email confirmation / acceptance</th><th>Expires</th><th>Last successful sign-in</th><th>Action</th></tr></thead><tbody>{review.items.map(item => <tr key={item.id}>
        <td><strong>{item.name}</strong><br />{item.email}</td><td>{item.role_code}</td><td>{item.status}<br />{item.delivery_status}</td><td>{displayDate(item.email_confirmed_at)}<br />{displayDate(item.accepted_at)}</td><td>{displayDate(item.expires_at)}</td><td>{displayDate(item.last_successful_sign_in)}</td><td>{!['accepted', 'revoked'].includes(item.status) && <button className="text-button" type="button" disabled={busy} onClick={() => void mutate(`/admin/invitations/${encodeURIComponent(item.id)}/resend`, {})}>Resend test invitation</button>}</td>
      </tr>)}</tbody></table></div> : <p>No invitations have been recorded.</p>}</section>
    </>}
  </>;
}
