import { publicCompanies } from './public-company-identity';
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import './public-design-system.css';
import { brandMedia } from './public-media';
import type { PublicMediaAsset } from './public-media';
import { PublicMediaImage } from './PublicMediaImage';
import './company-media.css';

export type PublicEntity = 'TEE' | 'TEA' | 'EPDG';
export type PublicPage = { path: string; title: string; description: string; eyebrow?: string; content: ReactNode; hasMain?: boolean };
const navigation = {
  TEE: [['About', '/about'], ['Find your path', '/start-here'], ['Resources', '/resources'], ['Programs', '/programs'], ['Leadership', '/leadership']],
  TEA: [['About', '/about'], ['Services', '/services-pricing'], ['Education', '/community-education'], ['Resources', '/financial-resources'], ['Leadership', '/leadership']],
  EPDG: [['About', '/about'], ['Programs', '/global-internship-program'], ['Classes', '/classes'], ['Research', '/research'], ['Leadership', '/leadership']],
};
export function PublicShell({ entity, pathname, title, description, children, hasMain = false }: { entity: PublicEntity; pathname: string; title: string; description: string; children: ReactNode; hasMain?: boolean }) {
  const company = publicCompanies[entity];
  const emblem = brandMedia(entity);
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const Content = hasMain ? 'div' : 'main';
  useEffect(() => {
    document.title = pathname === '/' ? `${company.name} | ${title}` : `${title} | ${company.name}`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', `${company.origin}${pathname}`);
  }, [company, description, pathname, title]);
  return <div className={`modern-site modern-${entity.toLowerCase()}`}>
    <a className="modern-skip" href="#main-content">Skip to main content</a>
    <div className="modern-topbar"><div className="modern-wrap"><span>Founder-led. Built by interns.</span><a href={entity === 'EPDG' ? '/conferences' : '/partnerships'}>{entity === 'EPDG' ? 'Conferences & presentations' : 'Community & institutional connections'} <span aria-hidden="true">↗</span></a></div></div>
    <header className="modern-header"><div className="modern-wrap modern-header-inner">
      <a className="modern-brand" href="/" aria-label={entity === 'EPDG' ? `${company.name} — home` : undefined}>{emblem ? <PublicMediaImage asset={emblem} className="modern-brand-media" decorative priority sizes="54px" /> : <span className="modern-mark" aria-hidden="true">{company.initials}</span>}<span>{company.name}<small>{company.line}</small></span></a>
      <button className="modern-menu-toggle" ref={toggle} onKeyDown={event => { if (event.key === 'Escape') setOpen(false); }} aria-expanded={open} aria-controls="modern-navigation" onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'} <span aria-hidden="true">{open ? '×' : '☰'}</span></button>
      <nav id="modern-navigation" className={`modern-navigation${open ? ' is-open' : ''}`} aria-label="Main navigation" onKeyDown={event => { if (event.key === 'Escape') { setOpen(false); toggle.current?.focus(); } }}>
        {navigation[entity].map(([label, href]) => <a key={href} href={href} aria-current={pathname === href ? 'page' : undefined}>{label}</a>)}<a className="modern-nav-contact" href="/contact">Get in touch <span aria-hidden="true">↗</span></a>
      </nav>
    </div></header>
    <Content id={hasMain ? undefined : 'main-content'} tabIndex={hasMain ? undefined : -1}>{pathname !== '/' && <nav className="modern-breadcrumb modern-wrap" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span>{title}</span></nav>}{children}</Content>
    <footer className="modern-footer"><div className="modern-wrap"><div className="modern-footer-grid"><div><p className="modern-kicker">The Emerson ecosystem</p><h2>{company.name}</h2><p>{company.line}</p><p className="modern-founder-credit">Founded by Lyric Helena Emerson<br />Columbia, South Carolina, USA</p><a href="/founder">Meet our founder <span aria-hidden="true">→</span></a></div><div><h3>Explore</h3><nav aria-label="Footer pages"><a href="/about">About the organization</a><a href="/leadership">Meet our leadership</a><a href="/classes">Classes & learning</a><a href="/resources">Resource library</a><a href="/research">Research & scholarship</a><a href="/contact">Contact</a>{entity === 'TEE' ? <><a href="/creative-studio">Creative Studio</a><a href="/platforms">Platforms directory</a></> : <a href={entity === 'TEA' ? '/staff-crm' : '/intern-portal'}>{entity === 'TEA' ? 'Staff CRM information' : 'Intern portal information'}</a>}</nav></div><div><h3>Our organizations</h3><nav aria-label="Emerson organizations">{Object.entries(publicCompanies).map(([key, item]) => <a key={key} href={item.origin + '/'}>{item.name}<span aria-hidden="true"> ↗</span></a>)}</nav><p className="modern-small">Connected by a shared founder, with distinct services and responsibilities.</p></div></div><div className="modern-footer-bottom"><p>© {new Date().getUTCFullYear()} {company.name}.<br />Founder-led. Built by interns. Credit given wherever credit is due.</p><nav aria-label="Legal"><a href="/privacy">Privacy</a><a href="/terms">Terms of use</a><a href="/disclaimer">Disclaimer</a></nav></div></div></footer>
  </div>;
}
export function PublicHero({ eyebrow, title, description, children, image, imageAlt }: { eyebrow?: string; title: ReactNode; description: ReactNode; children?: ReactNode; image?: string | PublicMediaAsset; imageAlt?: string }) {
  return <section className={`modern-hero${image ? ' has-image' : ''}`}><div className="modern-wrap modern-hero-grid"><div className="modern-hero-copy">{eyebrow && <p className="modern-kicker">{eyebrow}</p>}<h1>{title}</h1><div className="modern-lead">{description}</div>{children && <div className="modern-actions">{children}</div>}</div>{image && <figure className="modern-portrait">{typeof image === 'string' ? <img src={image} alt={imageAlt || 'Lyric Helena Emerson, founder'} width="720" height="900" fetchPriority="high" /> : <PublicMediaImage asset={image} priority />}</figure>}</div></section>;
}
export function Section({ eyebrow, title, description, children, id, tone }: { eyebrow?: string; title?: ReactNode; description?: ReactNode; children: ReactNode; id?: string; tone?: 'mist' | 'dark' }) {
  return <section id={id} className={`modern-section${tone ? ` modern-section-${tone}` : ''}`}><div className="modern-wrap">{(eyebrow || title || description) && <div className="modern-section-heading">{eyebrow && <p className="modern-kicker">{eyebrow}</p>}{title && <h2>{title}</h2>}{description && <p>{description}</p>}</div>}{children}</div></section>;
}
export function CardGrid({ children }: { children: ReactNode }) { return <div className="modern-card-grid">{children}</div>; }
export function Card({ title, children, href, label }: { title: ReactNode; children: ReactNode; href?: string; label?: string }) { return <article className="modern-card"><h3>{title}</h3><div>{children}</div>{href && <a className="modern-inline-link" href={href}>{label || 'Explore'} <span aria-hidden="true">→</span><span className="modern-sr-only"> {title}</span></a>}</article>; }
export function FounderFeature({ children, href = '/founder', image }: { children: ReactNode; href?: string; image?: string | PublicMediaAsset }) { return <Section tone="mist"><div className="modern-founder-feature">{image && (typeof image === 'string' ? <img src={image} alt="Lyric Helena Emerson" loading="lazy" width="480" height="600" /> : <PublicMediaImage asset={image} />)}<div><p className="modern-kicker">Meet the founder</p><h2>Lyric Helena Emerson</h2><div className="modern-prose">{children}</div><a className="modern-inline-link" href={href}>Read the founder’s story <span aria-hidden="true">→</span></a></div></div></Section>; }
export function InquiryPanel({ title = 'A thoughtful next step starts with a conversation.', children }: { title?: string; children: ReactNode }) { return <Section tone="dark"><div className="modern-inquiry"><div><p className="modern-kicker">Get in touch</p><h2>{title}</h2></div><div>{children}</div></div></Section>; }
export function Faq({ items }: { items: { question: string; answer: ReactNode }[] }) { return <Section eyebrow="Helpful to know" title="Frequently asked questions"><div className="modern-faq">{items.map(item => <details key={item.question}><summary>{item.question}</summary><div className="modern-prose">{item.answer}</div></details>)}</div></Section>; }
export function NotFound() { return <PublicHero eyebrow="Page not found" title="Let’s find your next step." description="The address you requested is unavailable. Explore the home page or use our resource library to continue."><a className="modern-button" href="/">Return home</a><a className="modern-button-secondary" href="/resources">Explore resources</a></PublicHero>; }
