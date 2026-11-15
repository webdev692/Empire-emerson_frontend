import type { ReactNode } from 'react';
import type { PublicMediaAsset } from './public-media';
import { PublicMediaImage } from './PublicMediaImage';
import './editorial-design.css';

type FeatureProps = { asset: PublicMediaAsset; eyebrow?: string; title: ReactNode; children?: ReactNode; reverse?: boolean; tone?: 'mist' | 'dark'; compact?: boolean };
function Illustration({ asset, priority = false, sizes }: { asset: PublicMediaAsset; priority?: boolean; sizes?: string }) {
  return <figure className="editorial-art"><PublicMediaImage asset={asset} priority={priority} decorative={asset.kind === 'brand'} sizes={sizes} /><figcaption>{asset.kind === 'brand' ? 'Company emblem' : 'Editorial illustration'}</figcaption></figure>;
}
export function EditorialBanner({ asset, eyebrow, title, description, children, compact = false }: { asset: PublicMediaAsset; eyebrow?: string; title: ReactNode; description: ReactNode; children?: ReactNode; compact?: boolean }) {
  return <section data-editorial-kind="banner" className={`editorial-banner${compact ? ' is-compact' : ''}`}><div className="modern-wrap editorial-banner-grid"><div className="editorial-banner-copy">{eyebrow && <p className="modern-kicker">{eyebrow}</p>}<h1>{title}</h1><div className="modern-lead">{description}</div>{children && <div className="modern-actions">{children}</div>}</div><Illustration asset={asset} priority sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1340px) 45vw, 580px" /></div></section>;
}
export function EditorialFeature({ asset, eyebrow, title, children, reverse = false, tone, compact = false }: FeatureProps) {
  return <section data-editorial-kind="feature" className={`editorial-feature${reverse ? ' is-reversed' : ''}${tone ? ` tone-${tone}` : ''}${compact ? ' is-compact' : ''}`}><div className="modern-wrap editorial-feature-grid"><div className="editorial-feature-copy">{eyebrow && <p className="modern-kicker">{eyebrow}</p>}<h2>{title}</h2><div className="modern-prose">{children}</div></div><Illustration asset={asset} /></div></section>;
}
export function ResearchFeature(props: FeatureProps) {
  return <div data-editorial-kind="research" className="editorial-research"><EditorialFeature {...props} /></div>;
}
export function ImageCardGrid({ children, columns = 3 }: { children: ReactNode; columns?: 2 | 3 | 4 }) {
  return <div className={`editorial-card-grid columns-${columns}`}>{children}</div>;
}
export function ImageCard({ asset, title, children, href, label = 'Explore', kicker }: { asset: PublicMediaAsset; title: ReactNode; children?: ReactNode; href: string; label?: string; kicker?: string }) {
  return <article data-editorial-kind="card" className="editorial-card"><Illustration asset={asset} sizes="(max-width: 640px) calc(100vw - 40px), (max-width: 1000px) 45vw, 390px" /><div className="editorial-card-copy">{kicker && <p className="modern-kicker">{kicker}</p>}<h3>{title}</h3><div>{children}</div><a className="modern-inline-link" href={href}>{label} <span aria-hidden="true">→</span><span className="modern-sr-only"> {title}</span></a></div></article>;
}
export function StoryBand({ asset, eyebrow, title, children, href, label = 'Explore' }: { asset: PublicMediaAsset; eyebrow?: string; title: ReactNode; children?: ReactNode; href?: string; label?: string }) {
  return <section data-editorial-kind="story" className="editorial-story"><div className="modern-wrap editorial-story-grid"><div>{eyebrow && <p className="modern-kicker">{eyebrow}</p>}<h2>{title}</h2><div className="modern-prose">{children}</div>{href && <a className="modern-inline-link" href={href}>{label} <span aria-hidden="true">→</span></a>}</div><Illustration asset={asset} /></div></section>;
}
