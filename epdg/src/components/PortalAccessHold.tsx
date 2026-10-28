import logo from '../assets/epd_logo.png';
import { portalAvailability } from '../lib/portalAvailability';
import './PortalAccessHold.css';

/**
 * Temporary fail-closed entry point while backend access is blocked.
 * The legacy router and auth store deliberately are not imported here.
 * This is an availability screen, not authentication or authorization.
 */
export default function PortalAccessHold() {
  const state = portalAvailability(window.location.pathname);

  return (
    <div className="portal-hold">
      <a className="portal-hold-skip" href="#portal-status">Skip to access status</a>
      <header className="portal-hold-header">
        <img src={logo} alt="EPDG" width="80" height="80" />
        <p>EPDG Learning &amp; Program Portal</p>
      </header>
      <main id="portal-status" tabIndex={-1} className="portal-hold-main">
        <div className="portal-hold-intro">
          <p className="portal-hold-eyebrow">Portal access</p>
          <h1>{state.title}</h1>
          <p className="portal-hold-description">{state.description}</p>
          <nav aria-label="Account information" className="portal-hold-nav">
            <a href="/login">Sign-in status</a>
            <a href="/register">Invitation information</a>
          </nav>
        </div>
        <aside className="portal-hold-note" aria-labelledby="availability-heading">
          <p className="portal-hold-eyebrow">Currently unavailable</p>
          <h2 id="availability-heading">Access remains closed.</h2>
          <p>This screen does not load account records or accept credentials. No access permissions are assigned here.</p>
          <p>Learning, reporting, uploads, portfolios, and certificates are not available in this release.</p>
        </aside>
      </main>
      <footer className="portal-hold-footer">Individual access. Secure foundations first.</footer>
    </div>
  );
}
