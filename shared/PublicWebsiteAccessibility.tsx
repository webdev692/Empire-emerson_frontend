import { useEffect, useRef } from 'react';

/** Public-site keyboard entry and focus after client-side page navigation. */
export default function PublicWebsiteAccessibility({ pathname }: { pathname: string }) {
  const previousPath = useRef(pathname);
  const skipLink = useRef<HTMLAnchorElement>(null);
  const excluded = pathname.startsWith('/project-studio') || pathname.startsWith('/assignments/');

  useEffect(() => {
    const changed = previousPath.current !== pathname;
    previousPath.current = pathname;
    if (excluded) return;
    const focusPage = () => {
      const main = document.querySelector<HTMLElement>('main');
      if (!main) return false;
      if (!main.id) main.id = 'main-content';
      skipLink.current?.setAttribute('href', '#' + main.id);
      if (!changed) return true;
      const heading = document.querySelector<HTMLElement>('main h1');
      if (!heading) return false;
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
      return true;
    };
    if (focusPage()) return;
    // Lazy routes can replace their loading state after this effect runs.
    const observer = new MutationObserver(() => { if (focusPage()) observer.disconnect(); });
    observer.observe(document.getElementById('root') || document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [pathname, excluded]);

  if (excluded) return null;
  return <nav aria-label="Skip navigation"><a ref={skipLink} className="pw-skip" href="#main-content" onClick={event => {
    const main = document.querySelector<HTMLElement>('main');
    if (!main) return;
    event.preventDefault();
    main.tabIndex = -1;
    main.focus({ preventScroll: true });
    main.scrollIntoView({ block: 'start' });
  }}>Skip to main content</a></nav>;
}
