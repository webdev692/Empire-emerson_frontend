import { useEffect } from 'react';
import { Badge, Empty, Facts } from '../../shared/PlatformUI';
import { localHref } from '../../shared/platform-format';
import data from './research.preview.json';
import published from './research.public.json';
import './research-preview.css';

type Work = typeof data.works[number];
const works = import.meta.env.VITE_TEE_RESEARCH_PREVIEW === 'true' ? data.works
  : import.meta.env.MODE === 'public-release' && import.meta.env.VITE_TEE_RESEARCH_RELEASE === 'true' ? published.works : [];
const date = (value: string) => new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T12:00:00Z`));
function Paper({ work, detail = false }: { work: Work; detail?: boolean }) {
  const link = localHref(`/research/${work.id}`);
  return <article className={detail ? 'cp-detail tr-paper' : 'cp-card tr-paper'}>
    {detail && <a href={localHref('/research')}>← All selected research</a>}
    <div className="cp-meta"><Badge>{work.kind}</Badge><Badge>{date(work.date)}</Badge></div>
    {detail ? <h1>{work.title}</h1> : <h2><a href={link}>{work.title}</a></h2>}
    <p className="tr-author">{work.author}</p>
    <p>{work.summary}</p>
    <p className="cp-small">{work.venue}</p><p className="cp-small"><strong>{work.role}</strong></p>
    {detail ? <>
      <Facts fields={{ Author: work.author, [work.id === 'reciprocity-without-justice' ? 'Archived' : 'Conference date']: date(work.date), Venue: work.venue, Role: work.role, 'Source version': work.version, 'Paper availability': work.availability }} />
      {!!work.links.length && <section aria-label="Research sources"><h2>Read the source</h2><ul>{work.links.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.label} <span className="tr-sr-only">(opens in a new tab)</span>↗</a></li>)}</ul></section>}
      <p className="cp-small">Conference participation and manuscript publication are separate. No journal acceptance, DOI, or peer-review status is asserted for these conference materials.</p>
    </> : <a className="cp-text-link" href={link}>Read research details <span className="tr-sr-only">for {work.title}</span> →</a>}
  </article>;
}
export default function ResearchPreview({ pathname }: { pathname: string }) {
  const id = pathname.replace(/\/$/, '').split('/')[2];
  const work = works.find(item => item.id === id);
  useEffect(() => {
    document.title = `${work?.title || 'Selected research'} | The Emerson Empire`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', work?.summary || 'Selected research and conference presentations by Lyric Helena Emerson on administrative evidence, institutional answerability, and justice.');
    if (import.meta.env.MODE === 'public-release' && import.meta.env.VITE_TEE_RESEARCH_RELEASE === 'true' && import.meta.env.VITE_PUBLIC_SITE_ORIGIN === 'https://theemerson.netlify.app') {
      const url = new URL(localHref(id ? `/research/${id}` : '/research'), import.meta.env.VITE_PUBLIC_SITE_ORIGIN).href;
      const canonical = document.querySelector('link[rel="canonical"]') || document.createElement('link');
      canonical.setAttribute('rel', 'canonical'); canonical.setAttribute('href', url);
      if (!canonical.parentNode) document.head.append(canonical);
      document.querySelector('meta[property="og:url"]')?.setAttribute('content', url);
    } else {
      document.querySelector('link[rel="canonical"]')?.remove();
      document.querySelector('meta[property="og:url"]')?.remove();
    }
  }, [id, work]);
  return <div className="company-platform cp-tee cp-embedded tr-research"><main id="cp-main" tabIndex={-1}>
    {import.meta.env.VITE_TEE_RESEARCH_PREVIEW === 'true' && <aside className="cp-callout" aria-label="Local research review"><strong>LOCAL RESEARCH REVIEW</strong><p>These three proposed selections replace the current research index in this local preview. The live selection is unchanged. Conference manuscript versions remain subject to author review.</p></aside>}
    {id ? (work ? <Paper work={work} detail /> : <Empty title="Research record unavailable."><a href={localHref('/research')}>Return to selected research</a>.</Empty>) : <>
      <header className="cp-page-title"><p className="cp-eyebrow">Selected scholarship · Lyric Helena Emerson</p><h1>Research & conference papers</h1><p>Explore work on administrative evidence, institutional answerability, and justice. Each record distinguishes the conference role, manuscript version, and available reading source.</p></header>
      <section className="cp-grid" aria-label="Three selected works">{works.map(item => <Paper key={item.id} work={item} />)}</section>
      <p className="cp-small tr-note">Source details checked October 19, 2026. Conference presentations are confirmed by the author. Repository hosting is separate from peer review and journal publication.</p>
    </>}
  </main></div>;
}
