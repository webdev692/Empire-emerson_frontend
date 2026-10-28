import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { localHref as href } from './platform-format';
import { intakeHoldMessage, isIntakeDestination, publicRelease } from './development-preview';
import { companyHref } from './company-links';
import { isServiceInquiryHref } from './service-inquiry';
import { isProgramInquiryHref } from './three-programs';
import './intern-site-integration.css';
type Entity = 'TEE' | 'TEA' | 'EPDG';
export function PreviewBoundary({ children, entity }: { children: ReactNode; entity: Entity }) {
  const [held, setHeld] = useState(false);
  const close = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!held) return;
    close.current?.focus();
    const key = (event: KeyboardEvent) => { if (event.key === 'Escape') setHeld(false); if (event.key === 'Tab') { event.preventDefault(); close.current?.focus(); } };
    window.addEventListener('keydown', key);
    return () => { window.removeEventListener('keydown', key); previousFocus.current?.focus(); };
  }, [held]);
  return <div className={`intern-site is-${entity.toLowerCase()}`} onSubmitCapture={event => {
    if (event.target instanceof HTMLFormElement && event.target.getAttribute('role') !== 'search') {
      event.preventDefault(); event.stopPropagation(); previousFocus.current = document.activeElement as HTMLElement; setHeld(true);
    }
  }} onClickCapture={event => {
    const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (link && isIntakeDestination(link.getAttribute('href') || '') && !isServiceInquiryHref(link.getAttribute('href') || '', entity) && !((import.meta.env.VITE_THREE_PROGRAMS_PREVIEW === 'true' || (import.meta.env.MODE === 'public-release' && import.meta.env.VITE_THREE_PROGRAMS_RELEASE === 'true')) && isProgramInquiryHref(link.getAttribute('href') || '', entity))) {
      event.preventDefault(); event.stopPropagation(); previousFocus.current = link as HTMLElement; setHeld(true);
    }
  }}>{children}{held && <div className="is-hold-backdrop"><div role="alertdialog" aria-modal="true" aria-labelledby="intake-held-title" className="is-hold-dialog"><h2 id="intake-held-title">Live intake is held</h2><p>{intakeHoldMessage}</p><button ref={close} onClick={() => setHeld(false)}>Close</button></div></div>}</div>;
}
export function PreviewNotice() {
  if (publicRelease) return <aside className="is-preview-notice" aria-label="Site availability">Explore services, resources & learning · Service inquiries open an email draft · Registration and live intake are currently closed.</aside>;
  return <aside className="is-preview-notice" aria-label="Review preview">REVIEW PREVIEW · Existing intern designs + new learning tools · No live submissions. Registration disabled. Draft content and earlier service, schedule and pricing copy await approval.</aside>;
}
export function ExperienceLinks() {
  return <section className="is-experience-links" aria-label="Learning and company information"><nav><a href={href('/services-pricing')}>Services & pricing</a><a href={href('/classes')}>Classes & workshops</a><a href={href('/resources')}>Resources</a><a href={href('/programs')}>{publicRelease ? 'Programs' : 'Program drafts'}</a><a href={href('/learn')}>Guided learning</a><a href={href('/coverage')}>Coverage</a><a href={href('/founder')}>Founder</a><a href={href('/leadership')}>Leadership</a><a href={href('/research')}>Research</a><a href={href('/speaking')}>Speaking</a><a href={href('/inquiry')}>Support availability</a></nav><nav aria-label={publicRelease ? "Emerson companies" : "Emerson company previews"}>{([['TEE','The Emerson Empire'],['TEA','The Emerson Agency'],['EPDG','EPDG']] as const).map(([entity,name]) => companyHref(entity) ? <a key={entity} href={companyHref(entity)!}>{name}</a> : <span key={entity}>{name} · preview link pending</span>)}</nav><p>Existing design and code by the intern teams; learning and directory integration assisted by Codex. Build {import.meta.env.VITE_BUILD_ID || 'working tree'}.</p></section>;
}
export function LearningGateway({ entity }: { entity: Entity }) {
  const cards = entity === 'EPDG' ? [
    ['Free Learning & Credentials', '/resources#free-learning', 'Browse source-checked free learning. Review eligibility and credential conditions.'],
    ['Colleges & Universities', '/resources#colleges-universities', 'Search the supplied institution directory by location and institution type.'],
    ['Practice your first contribution', '/learn/show-the-work', 'Use the guided lesson and save or read the worksheet offline.'],
  ] : [
    ['Financial education', '/educationPage', 'Explore the intern-built education grid and connected source-literacy lessons.'],
    ['Check a financial source', '/learn/financial-source-literacy', 'Practice checking who published information and what it can establish.'],
    ['Education resources', '/resources', 'Check provider sources, eligibility, geography and review status.'],
  ];
  return <section className="is-learning-gateway" aria-labelledby="learning-gateway-title"><div><p className="is-eyebrow">Explore at your own pace</p><h2 id="learning-gateway-title">{entity === 'EPDG' ? 'Learning resources for your next step' : 'Build financial understanding'}</h2><p>Start with a resource or a guided practice. Program drafts do not open registration.</p><div className="is-gateway-grid">{cards.map(([title, url, description]) => <article key={url}><h3>{title}</h3><p>{description}</p><a href={href(url)}>Explore <span className="is-sr-only">{title}</span><span aria-hidden="true"> →</span></a></article>)}</div></div></section>;
}
