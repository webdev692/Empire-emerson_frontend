import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { filterResources, resourceAvailability, selectCatalog, validateCatalog } from './content';
import type { Catalog, Resource } from './content';
import publicCatalog from './catalog.public.json';
import publicLearning from './learning.public.json';
import teeLogo from '../Emerson_Empire/src/assets/EmersonEmpire_logo.webp';
import teaLogo from '../Emerson_Empire/src/assets/LogoAgency.png';
import epdgLogo from '../Emerson_Empire/src/assets/EPDG_LOGO.webp';
import './company-platform.css';
import { Badge, Empty } from './PlatformUI';
import { displayDate as date, localHref as href, readable } from './platform-format';
import { LearningPages, ProfilePages, ProgramPages } from './CompanyPages';
import InquiryPage from './InquiryPage';
import ServicesPricing from './ServicesPricing';
import ClassOfferings from './ClassOfferings';

type Entity = 'TEE' | 'TEA' | 'EPDG';
type PageCopy = { entity: string; headline: string; intro: string };
const companies = {
  TEE: { name: 'The Emerson Empire', label: 'Resource hub', logo: teeLogo, port: 5173 },
  TEA: { name: 'The Emerson Agency LLC', label: 'Financial education', logo: teaLogo, port: 5174 },
  EPDG: { name: 'Emerson Professional Development Group', label: 'Learning & practice', logo: epdgLogo, port: 5175 },
};
function ResourceCard({ resource }: { resource: Resource }) {
  return <article className="cp-card">
    <div className="cp-meta"><Badge>{resource.topic}</Badge><Badge>{resource.country}{resource.subregion ? ` · ${resource.subregion}` : ''}</Badge></div>
    <h2><a href={href(`/resources/${resource.id}`)}>{resource.title}</a></h2>
    <p>{resource.provider}</p><p>{resource.description}</p>
    <p className="cp-small">{resource.languages.join(', ')} · Checked: {date(resource.last_checked_at)}</p>
    <div className="cp-meta"><Badge>{readable(resource.content_status)}</Badge>{resource.synthetic && <Badge>LOCAL-ONLY fictional example</Badge>}<Badge>{readable(resourceAvailability(resource))}</Badge></div>
    <a className="cp-text-link" href={href(`/resources/${resource.id}`)}>Read eligibility & source <span aria-hidden="true">→</span></a>
  </article>;
}
function ResourceList({ catalog, entity, hasSupplement = false }: { catalog: Catalog; entity: Entity; hasSupplement?: boolean }) {
  const initial = Object.fromEntries(new URLSearchParams(window.location.search));
  const [filters, setFilters] = useState({ query: initial.q || '', topic: initial.topic || '', country: initial.country || '', subregion: initial.subregion || '', language: initial.language || '' });
  const resources = catalog.resources.filter(r => entity === 'TEE' || r.entity === entity);
  const results = filterResources(resources, filters);
  const fields = ['topic', 'country', 'subregion', 'language'] as const;
  useEffect(() => {
    const query = new URLSearchParams();
    if (import.meta.env.DEV && new URLSearchParams(window.location.search).has('__fixtures')) query.set('__fixtures','1');
    Object.entries(filters).forEach(([key, value]) => { if (value) query.set(key === 'query' ? 'q' : key, value); });
    window.history.replaceState(null, '', `${window.location.pathname}${query.size ? `?${query}` : ''}${window.location.hash}`);
  }, [filters]);
  return <><div className="cp-page-title"><p className="cp-eyebrow">Find a useful next step</p><h1>Explore resources</h1><p>Start with a topic. Check the service area, language, eligibility and source for every listing.</p></div>
    {hasSupplement && (entity === 'TEE' ? <nav className="cp-actions" aria-label="Resource collections"><a className="cp-button" href="#tee-resource-collection">Existing resource collection ({resources.length})</a><a href="#south-carolina-resources">South Carolina community resources <span aria-hidden="true">↓</span></a></nav> : <nav className="cp-actions" aria-label="Resource collections"><a className="cp-button" href="#epdg-resource-collection">Learning & support resources ({resources.length})</a><a href="#free-learning">Free Learning & Credentials <span aria-hidden="true">↓</span></a><a href="#colleges-universities">Colleges & Universities <span aria-hidden="true">↓</span></a></nav>)}
    <section id={hasSupplement ? entity === 'TEE' ? 'tee-resource-collection' : 'epdg-resource-collection' : undefined} aria-label="Filter resources" className="cp-filter">
      <label>Search resources<input type="search" value={filters.query} onChange={e => setFilters({ ...filters, query: e.target.value })} placeholder="Topic, provider or need" /></label>
      {fields.map(field => {
        const values = resources.flatMap(r => field === 'language' ? r.languages : [r[field]]).filter((x): x is string => !!x);
        return <label key={field}>{field === 'subregion' ? 'State / region' : field[0].toUpperCase() + field.slice(1)}<select value={filters[field]} onChange={e => setFilters({ ...filters, [field]: e.target.value })}><option value="">All {field === 'subregion' ? 'regions' : field === 'country' ? 'countries' : `${field}s`}</option>{[...new Set(values)].sort().map(value => <option key={value}>{value}</option>)}</select></label>;
      })}
      <button onClick={() => setFilters({ query: '', topic: '', country: '', subregion: '', language: '' })}>Reset filters</button>
    </section>
    <p role="status" aria-live="polite" className="cp-result-count">{results.length} {results.length === 1 ? 'resource' : 'resources'} found</p>
    {results.length ? <div className="cp-grid">{results.map(r => <ResourceCard key={r.id} resource={r} />)}</div> : resources.length ? <Empty title="No resources match these filters.">Try fewer filters or use Reset filters to see the full collection.</Empty> : <Empty title="No reviewed resources are available yet.">This collection is waiting for reviewed content. No approved provider listing is currently available here.</Empty>}
  </>;
}
function ResourceDetail({ resource }: { resource?: Resource }) {
  if (!resource) return <Empty title="Resource unavailable.">This record may be withdrawn or awaiting publication approval. <a href={href('/resources')}>Return to resources</a>.</Empty>;
  const fields = { Provider: resource.provider, Topic: resource.topic, Country: resource.country, 'State / region': resource.subregion || 'Not specified', Languages: resource.languages.join(', '), Audience: resource.audience, Eligibility: resource.eligibility || 'Unknown — verify before acting', 'Resource cost': resource.cost_basis || 'Unknown — verify with the provider', 'Credential cost': resource.credential_cost_basis || 'Unknown — verify separately', 'Last checked': date(resource.last_checked_at), 'Recheck due': date(resource.recheck_due_at), 'Verification status': readable(resource.verification_status), Availability: readable(resourceAvailability(resource)), 'Applicable deadline': resource.deadline_at ? `${date(resource.deadline_at)} (${readable(resource.deadline_type || 'UNSPECIFIED')})` : 'No verified deadline' };
  return <article className="cp-detail"><a href={href('/resources')}>← All resources</a><div className="cp-meta"><Badge>{readable(resource.content_status)}</Badge>{resource.synthetic && <Badge>LOCAL-ONLY fictional example</Badge>}</div><h1>{resource.title}</h1><p className="cp-lead">{resource.description}</p>
    <dl>{Object.entries(fields).map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl>
    <section className="cp-callout"><h2>Check the source before taking action</h2>{resource.synthetic ? <p>This fictional development record has no real provider or application route.</p> : <><p>{resource.source_url ? <a href={resource.source_url} target="_blank" rel="noreferrer">Read the original source</a> : 'Source unavailable. This listing needs review.'}</p>{resource.access_url && resourceAvailability(resource) !== 'EXPIRED' && <a href={resource.access_url} target="_blank" rel="noreferrer">Visit provider access page</a>}</>}
      {!!resource.verification_notes?.length && <><h3>What was checked & what remains uncertain</h3><ul>{resource.verification_notes.map(note => <li key={note}>{note}</li>)}</ul></>}
      <p>A donor deadline does not indicate recipient enrollment. Global information does not establish local eligibility.</p><a href={href(`/corrections?resource=${resource.id}`)}>Suggest a correction</a>
    </section></article>;
}
function Coverage({ catalog }: { catalog: Catalog }) {
  const reviewedPlaces = [...new Set(catalog.resources.filter(resource => !resource.synthetic && resource.verification_status === 'SOURCE_CHECKED' && resource.last_checked_at).map(resource => `${resource.country}${resource.subregion ? ` · ${resource.subregion}` : ''} (${resource.languages.join(', ')})`))];
  return <><div className="cp-page-title"><p className="cp-eyebrow">Global mission · local verification</p><h1>Understand our coverage</h1><p>South Carolina is the initial service-pilot focus. Coverage describes what has been checked, rather than a promise of availability worldwide.</p></div><div className="cp-grid">
    <article className="cp-card"><Badge>Verified</Badge><h2>Record by record</h2>{reviewedPlaces.length ? <><p>Source-reviewed records are present for these places. This establishes a checked listing, not universal eligibility or current service availability.</p><ul>{reviewedPlaces.map(place => <li key={place}>{place}</li>)}</ul></> : <p>No current source-reviewed provider records are connected to this candidate. No geographic service coverage is verified here.</p>}</article>
    <article className="cp-card"><Badge>Being researched</Badge><h2>South Carolina, United States</h2><p>Resource collections and institutional pilot arrangements require current source and partner review.</p></article>
    <article className="cp-card"><Badge>Not yet covered</Badge><h2>Additional countries & languages</h2><p>The data contract supports country, subregion and language. A new country pack needs local source review. Missing translations stay visibly unavailable.</p></article>
    </div><p className="cp-callout">Free internships and independent learning resources are available alongside optional paid services and low-cost class formats. <a href={href('/services-pricing')}>Review service-specific prices and access conditions</a>. Third-party fees and credential costs are separate.</p></>;
}
function Home({ entity, copy }: { entity: Entity; copy?: PageCopy }) {
  return <><section className="cp-hero"><p className="cp-eyebrow">{companies[entity].label}</p><h1>{copy?.headline || companies[entity].name}</h1><p className="cp-lead">{copy?.intro || 'Reviewed information will appear here after content approval.'}</p><div className="cp-actions"><a className="cp-button" href={href(entity === 'TEA' ? '/learn' : entity === 'EPDG' ? '/programs' : '/resources')}>{entity === 'TEA' ? 'Explore financial education' : entity === 'EPDG' ? 'Explore learning programs' : 'Explore resources'} <span aria-hidden="true">→</span></a><a href={href('/coverage')}>Check geographic coverage</a></div><p className="cp-small">Free Emerson learning programs. Clear sources. Country-aware information.</p></section>
    <section className="cp-intro"><p className="cp-eyebrow">A connected Emerson community</p><h2>Find information you can understand and check.</h2><div className="cp-grid">{Object.entries(companies).map(([key, company]) => <article className="cp-card" key={key}><img className="cp-company-logo" src={company.logo} alt="" /><h3>{company.name}</h3><p>{company.label}</p>{import.meta.env.DEV ? <a href={`http://127.0.0.1:${company.port}/`}>Explore {key} <span aria-hidden="true">→</span></a> : <p>Company routing requires release configuration.</p>}</article>)}</div></section></>;
}

export default function CompanyPlatform({ entity, resourcesSupplement, routePath, embedded = false }: { entity: Entity; resourcesSupplement?: ReactNode; routePath?: string; embedded?: boolean }) {
  const path = routePath || window.location.pathname.slice(import.meta.env.BASE_URL.length - 1) || '/';
  const [state, setState] = useState<{ catalog?: Catalog; pages?: PageCopy[]; classTopics?: string[]; worksheet?: string; error?: boolean }>({});
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        if (import.meta.env.DEV && new URLSearchParams(window.location.search).get('__fixture') === 'fetch-error' && attempt === 0) throw new Error('Controlled local failure');
        if (import.meta.env.DEV) {
          const local = await import('./catalog.local');
          const catalog = new URLSearchParams(window.location.search).has('__fixtures') ? local.fixtureCatalog : local.default;
          if (active) setState({ catalog: selectCatalog(validateCatalog(catalog), 'development'), pages: local.homePages, classTopics: local.classTopics, worksheet: local.worksheetText });
        } else if (import.meta.env.MODE === 'protected-review') {
          const review = await import('./catalog.review');
          if (active) setState({ catalog: review.default, pages: review.homePages, classTopics: review.classTopics, worksheet: review.worksheetText });
        } else if (active) setState({ catalog: selectCatalog(validateCatalog(publicCatalog), 'production'), ...(import.meta.env.MODE === 'public-release' ? {classTopics:publicLearning.classTopics,worksheet:publicLearning.worksheetText} : {}) });
      } catch (error) { if (import.meta.env.DEV) console.warn('Catalog load failed:', error instanceof Error ? error.message : 'Content load error'); if (active) setState({ error: true }); }
    }
    void load();
    return () => { active = false; };
  }, [attempt]);
  useEffect(() => {
    document.title = `${path === '/' ? companies[entity].label : path.split('/')[1]} | ${companies[entity].name}`;
    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute('content', `${companies[entity].label}. Check publication, jurisdiction, source and operating status before taking a next step.`);
    // Never turn a localhost or unconfigured release route into an invented public canonical.
    const canonical = document.querySelector('link[rel="canonical"]');
    const research = path.startsWith('/research/') ? state.catalog?.research.find(work => work.id === path.split('/')[2] && work.content_status === 'PUBLIC_RELEASE_APPROVED') : undefined;
    let verifiedCanonical = research?.canonical_url || null;
    if (!import.meta.env.DEV && import.meta.env.VITE_PUBLIC_SITE_ORIGIN) {
      try { const origin = new URL(import.meta.env.VITE_PUBLIC_SITE_ORIGIN); if (origin.protocol === 'https:' && !origin.username && !origin.password && origin.pathname === '/') verifiedCanonical ||= new URL(href(path), origin).href; } catch { /* Invalid release metadata stays absent. */ }
    }
    if (verifiedCanonical) { const link = canonical || document.createElement('link'); link.setAttribute('rel','canonical'); link.setAttribute('href',verifiedCanonical); if (!canonical) document.head.append(link); } else canonical?.remove();
    document.querySelector('meta[property="og:url"]')?.remove();
  }, [entity, path, state.catalog]);
  useEffect(() => {
    if (!state.catalog || !window.location.hash) return;
    // A home-page collection link can arrive before the private catalog mounts.
    const frame = requestAnimationFrame(() => document.getElementById(window.location.hash.slice(1))?.scrollIntoView());
    return () => cancelAnimationFrame(frame);
  }, [path, state.catalog]);
  const company = companies[entity];
  let page: React.ReactNode = <p role="status">Loading reviewed content…</p>;
  if (state.error) page = <div className="cp-empty" role="alert"><h1>Resources could not be loaded.</h1><p>This is a loading error. The resource count is unavailable.</p><button onClick={() => { setState({}); setAttempt(attempt + 1); }}>Try again</button></div>;
  else if (state.catalog) {
    const catalog = state.catalog;
    if (path === '/') page = <Home entity={entity} copy={state.pages?.find(p => p.entity === entity)} />;
    else if (path === '/resources' || path === '/educational-resources') page = <><ResourceList catalog={catalog} entity={entity} hasSupplement={entity !== 'TEA' && !!resourcesSupplement} />{entity !== 'TEA' && resourcesSupplement}</>;
    else if (path.startsWith('/resources/')) page = <ResourceDetail resource={catalog.resources.find(r => r.id === path.split('/')[2] && (entity === 'TEE' || r.entity === entity))} />;
    else if (path === '/coverage') page = <Coverage catalog={catalog} />;
    else if (path === '/services' || path === '/services-pricing') page = <ServicesPricing entity={entity} />;
    else if (path === '/classes') page = <ClassOfferings entity={entity} />;
    else if (path === '/programs') page = <ProgramPages catalog={catalog} classTopics={state.classTopics} />;
    else if (path.startsWith('/programs/')) page = <ProgramPages catalog={catalog} id={path.split('/')[2]} />;
    else if (path === '/learn' || path.startsWith('/learn/')) page = <LearningPages catalog={catalog} entity={entity} id={path.split('/')[2]} worksheet={state.worksheet} />;
    else if (['founder','leadership','research','speaking','journal'].includes(path.split('/')[1])) page = <ProfilePages catalog={catalog} entity={entity} kind={path.split('/')[1]} id={path.split('/')[2]} />;
    else if (path === '/corrections' || path === '/inquiry') page = <InquiryPage />;
    else page = <Empty title="This page is not available."><a href={href('/')}>Return to the company home</a>.</Empty>;
  }
  if (embedded) return <div className={`company-platform cp-${entity.toLowerCase()} cp-embedded`}><main id="cp-main" tabIndex={-1}>{page}</main></div>;
  return <div className={`company-platform cp-${entity.toLowerCase()}`}><a className="cp-skip" href="#cp-main">Skip to main content</a>
    <div className="cp-environment">{import.meta.env.DEV ? 'PRIVATE LOCAL DEVELOPMENT · Draft content & fictional examples · No live submissions' : 'RELEASE CANDIDATE · Reviewed content only · Not a deployment receipt'}</div>
    <header className="cp-header"><a className="cp-brand" href={href('/')}><img src={company.logo} alt="" /><span>{company.name}</span></a><nav aria-label="Main navigation"><a href={href('/resources')} aria-current={path.startsWith('/resources') ? 'page' : undefined}>Resources</a><a href={href('/coverage')}>Coverage</a><a href={href('/programs')}>Programs</a><a href={href('/learn')}>Learn</a><a href={href('/founder')}>Founder</a></nav></header>
    <main id="cp-main" tabIndex={-1}>{page}</main>
    <footer className="cp-footer"><strong>{company.name}</strong><p>Founder-led. Built through intern contributions. Credit stays with the work.</p><nav aria-label="Supporting information"><a href={href('/leadership')}>Leadership</a><a href={href('/research')}>Research</a><a href={href('/speaking')}>Speaking</a><a href={href('/corrections')}>Corrections & support</a>{import.meta.env.DEV && <a href={href('/?legacy=1')}>Existing site</a>}</nav><p className="cp-small">Build {import.meta.env.VITE_BUILD_ID || 'unrecorded working tree'} · Contract 1.0.0 · October 16–18, 2026</p></footer>
  </div>;
}
