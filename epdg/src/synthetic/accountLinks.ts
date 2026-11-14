import { captureInvitation, captureRecovery } from './client.ts';

export interface AccountLink { path: string; recoveryToken: string | null; invitationToken: string | null }
type LinkBrowser = Pick<Window, 'location' | 'history' | 'addEventListener' | 'removeEventListener'>;

export function consumeAccountLink(browser: Pick<LinkBrowser, 'location' | 'history'>): AccountLink {
  const link = { path: browser.location.pathname, recoveryToken: captureRecovery(browser.location), invitationToken: captureInvitation(browser.location) };
  // Scrub fragments and queries before returning a value to any rendering code.
  browser.history.replaceState(null, '', link.path);
  return link;
}

export function observeAccountLinks(browser: LinkBrowser, onLink: (link: AccountLink) => void, onNavigate: () => void): () => void {
  const hash = () => {
    // Ordinary anchors (including the skip link) must preserve an in-memory
    // invitation or recovery token. Only account-token fragments are consumed.
    if (/^#token(?:=|&|$)/.test(browser.location.hash)) onLink(consumeAccountLink(browser));
  };
  const pop = () => {
    // Fragment navigations emit popstate and hashchange; consume once in hashchange.
    if (!browser.location.hash) onNavigate();
  };
  browser.addEventListener('hashchange', hash);
  browser.addEventListener('popstate', pop);
  return () => { browser.removeEventListener('hashchange', hash); browser.removeEventListener('popstate', pop); };
}
