import { useState, type ReactNode } from 'react';
import logo from '../assets/epd_logo.png';
import { roleLayouts, previewNotice, type PageView, type RoleView } from './layouts';

interface ShellProps {
  role: RoleView; page: PageView; title: string;
  onRoleChange: (role: RoleView) => void; onPageChange: (page: PageView) => void;
  children: ReactNode;
}
const pages: { id: PageView; label: string; number: string }[] = [
  { id: 'overview', label: 'Workspace', number: '01' },
  { id: 'profile', label: 'My profile', number: '02' },
  { id: 'support', label: 'Help & support', number: '03' },
];
export default function PortalShell({ role, page, title, onRoleChange, onPageChange, children }: ShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  return <div className="design-portal">
    <a className="dp-skip" href="#preview-main">Skip to main content</a>
    <div className="dp-preview-notice">{previewNotice}</div>
    <div className="dp-frame">
      <aside className="dp-sidebar">
        <div className="dp-brand"><img src={logo} alt="EPDG" width="64" height="64" /><span>Learning &amp;<br />Program Portal</span></div>
        <button className="dp-menu dp-button" type="button" aria-expanded={menuOpen} aria-controls="preview-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? 'Close navigation' : 'Open navigation'}</button>
        <nav id="preview-navigation" aria-label="Portal design" className={menuOpen ? 'dp-navigation is-open' : 'dp-navigation'}>
          <p className="dp-eyebrow">Your workspace</p>
          {pages.map(item => <button key={item.id} type="button" aria-current={page === item.id ? 'page' : undefined} onClick={() => { onPageChange(item.id); setMenuOpen(false); document.getElementById('preview-main')?.focus(); }}><span aria-hidden="true">{item.number}</span>{item.label}</button>)}
          <div className="dp-sidebar-note"><span className="dp-dot" /> Interface review only<p>No account is signed in. This view does not represent access permissions.</p></div>
        </nav>
      </aside>
      <div className="dp-workspace">
        <header className="dp-topbar"><span>EPDG Learning &amp; Program Portal</span><span className="dp-badge">Not connected</span></header>
        <main id="preview-main" tabIndex={-1}>
          <div className="dp-controls"><p className="dp-breadcrumb">Design preview <span aria-hidden="true">/</span> {pages.find(item => item.id === page)?.label}</p>
            <div><label htmlFor="role-view">Presentation view</label><select id="role-view" value={role} onChange={event => onRoleChange(event.target.value as RoleView)}>{Object.entries(roleLayouts).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}</select><p className="dp-field-help">Changes the layout only. Does not assign a role.</p></div>
          </div>
          <h1>{title}</h1>
          {children}
        </main>
        <footer className="dp-footer">EPDG <span aria-hidden="true">/</span> Thoughtful learning starts with secure foundations.</footer>
      </div>
    </div>
  </div>;
}
