import { useState, type ReactNode } from 'react';
import { roleLayouts, type RoleView, type PageView, type StateView } from './layouts';
import PortalShell from './PortalShell';
import './preview.css';

function StatusPanel({ state, subject, onReset }: { state: StateView; subject: string; onReset: () => void }) {
  if (state === 'loading') return <div className="dp-state" role="status"><p>Loading layout example</p><div className="dp-skeleton" /><div className="dp-skeleton short" /><small>No request is in progress.</small></div>;
  if (state === 'error') return <div className="dp-state dp-error" role="alert"><h3>Unable to display this area</h3><p>Error appearance example. No participant information has been requested.</p><button className="dp-button" onClick={onReset} type="button">Return to empty layout</button></div>;
  return <div className="dp-state"><span className="dp-state-mark" aria-hidden="true">—</span><h3>{state === 'unavailable' ? 'This area is not available yet' : `No ${subject.toLowerCase()} connected`}</h3><p>{state === 'unavailable' ? 'This feature remains closed while secure account access is prepared.' : 'This design preview contains no participant or program records. An authorized connection is required before information can appear here.'}</p></div>;
}
function Card({ title, children }: { title: string; children: ReactNode }) {
  return <section className="dp-card"><h2>{title}</h2>{children}</section>;
}
function Dashboard({ role }: { role: RoleView }) {
  const layout = roleLayouts[role];
  const [state, setState] = useState<StateView>('empty');
  return <>
    <p className="dp-lead">{layout.description}</p>
    <div className="dp-state-toolbar"><label htmlFor="state-view">Review a display state</label><select id="state-view" value={state} onChange={event => setState(event.target.value as StateView)}><option value="empty">Empty</option><option value="loading">Loading example</option><option value="unavailable">Unavailable</option><option value="error">Error example</option></select></div>
    <div className="dp-card-grid">{layout.sections.map((title, index) => <Card title={title} key={title}><p className="dp-section-label">{index === 0 ? 'Workspace overview' : 'Not connected'}</p><StatusPanel state={state} subject={title} onReset={() => setState('empty')} />{title === 'Authorized-student reporting' && <p className="dp-scope-note">Institution scope and reporting permission must be verified by the server. No student records are available here.</p>}</Card>)}</div>
    <Card title={`${layout.table} · list layout`}><div className="dp-table-scroll"><table><caption>Presentation structure only — no records loaded</caption><thead><tr>{layout.columns.map(column => <th scope="col" key={column}>{column}</th>)}</tr></thead><tbody><tr><td colSpan={layout.columns.length}>No connected records to display.</td></tr></tbody></table></div></Card>
  </>;
}
function Profile() {
  return <><p className="dp-lead">Your details, in one place. Profile information is not connected in this preview.</p><div className="dp-profile-grid"><Card title="Personal details"><p className="dp-form-note" id="profile-note">Fields are disabled. Do not enter personal information. Saving remains unavailable.</p><fieldset disabled aria-describedby="profile-note"><legend>Profile layout</legend><label htmlFor="profile-name">Display name</label><input id="profile-name" placeholder="Not connected" autoComplete="off" /><label htmlFor="profile-email">Account email</label><input id="profile-email" type="email" placeholder="Not connected" autoComplete="off" /><label htmlFor="profile-description">About you</label><textarea id="profile-description" placeholder="Not connected" rows={3} /><button className="dp-button" type="button" disabled>Save unavailable</button></fieldset></Card><Card title="Account & access"><dl className="dp-details"><dt>Session</dt><dd>Not connected</dd><dt>Memberships</dt><dd>Not loaded</dd><dt>Effective permissions</dt><dd>Not available</dd></dl><p className="dp-form-note">Only a verified server response can describe access. The presentation selector does not change your account.</p><p className="dp-form-note">Editable fields are subject to backend approval. Email and access changes are not enabled.</p></Card></div></>;
}
function Support() {
  return <><p className="dp-lead">Clear guidance while portal access is being prepared.</p><div className="dp-profile-grid"><Card title="Help with access"><p>Sign-in, registration, recovery, and account verification remain unavailable. This preview cannot send invitations or change an account.</p><details><summary>Can I use my existing account here?</summary><p>No. This is an interface review without authentication. Do not enter credentials.</p></details><details><summary>Where are programs and reports?</summary><p>Program features and participant reporting remain closed. Empty layouts do not indicate an enrollment or an institution assignment.</p></details><details><summary>Does the view selector change my permissions?</summary><p>No. It changes only the arrangement of this design preview.</p></details></Card><Card title="Contact & support"><p>The existing portal lists this support address:</p><p className="dp-contact">support@theemersonempire.info</p><p className="dp-form-note">Shown as contact information only; current delivery has not been tested. This preview does not send email or submit support requests. Do not share passwords or participant records.</p><span className="dp-badge">Support submission unavailable</span></Card></div></>;
}
export default function Presentation() {
  const [role, setRole] = useState<RoleView>('learner');
  const [page, setPage] = useState<PageView>('overview');
  const title = page === 'profile' ? 'My profile' : page === 'support' ? 'Help & support' : roleLayouts[role].title;
  return <PortalShell role={role} page={page} title={title} onRoleChange={setRole} onPageChange={setPage}>{page === 'overview' ? <Dashboard role={role} key={role} /> : page === 'profile' ? <Profile /> : <Support />}</PortalShell>;
}
