import { Component, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import './public-website.css';

function ConnectivityNotice() {
  const [offline, setOffline] = useState(() => !navigator.onLine);
  const [restored, setRestored] = useState(false);
  const wasOffline = useRef(!navigator.onLine);
  useEffect(() => {
    const disconnected = () => { wasOffline.current = true; setOffline(true); setRestored(false); };
    const connected = () => { setOffline(false); if (wasOffline.current) setRestored(true); };
    window.addEventListener('offline', disconnected);
    window.addEventListener('online', connected);
    return () => { window.removeEventListener('offline', disconnected); window.removeEventListener('online', connected); };
  }, []);
  if (!offline && !restored) return null;
  return <aside className="pw-connection" role="status"><p>{offline ? 'You are offline. Pages already loaded may remain available. Registration and external resources need an internet connection.' : 'Your connection is restored. Reload if a page or resource did not load.'}</p>{restored && <><button type="button" onClick={() => window.location.reload()}>Reload page</button><button type="button" onClick={() => setRestored(false)}>Dismiss</button></>}</aside>;
}
export default class PublicWebsiteRecovery extends Component<{children: ReactNode}, {failed: boolean}> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return <main className="pw-legal" role="alert"><h1>This page could not be loaded</h1><p>Check your connection and reload to try again. No application or registration has been submitted by this page.</p><button type="button" onClick={() => window.location.reload()}>Reload page</button><p><a href="/">Return home</a></p></main>;
    return <>{this.props.children}<ConnectivityNotice /></>;
  }
}
