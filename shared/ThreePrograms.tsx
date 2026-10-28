import { useEffect } from 'react';
import { publicIntakeEnabled } from './public-intake';
import { InternshipApplication } from './PublicAccess';
import { localHref } from './platform-format';
import { companyHref } from './company-links';
import type { ProgramCompany } from './three-programs-mode';
import { threeProgramsLocal } from './three-programs-mode';
import { companyNames, programFor, programHref, programInquiryHref, programInquiryText } from './three-programs';
import './three-programs.css';

function ProgramMetadata({ entity }: { entity: ProgramCompany }) {
  const program = programFor(entity);
  useEffect(() => {
    const title = document.title;
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const oldDescription = description?.content;
    const oldCanonical = canonical?.href;
    document.title = `${program.name} | ${companyNames[entity]}`;
    if (description) description.content = program.summary;
    const origin = companyHref(entity, program.route);
    if (canonical && origin) canonical.href = origin;
    return () => {
      document.title = title;
      if (description && oldDescription !== undefined) description.content = oldDescription;
      if (canonical && oldCanonical !== undefined) canonical.href = oldCanonical;
    };
  }, [entity, program]);
  return null;
}

function SisterPrograms({ entity }: { entity: ProgramCompany }) {
  return <section className="tp-section" aria-labelledby="sister-programs-title"><p className="tp-eyebrow">Across the Emerson companies</p><h2 id="sister-programs-title">Different goals. A place to begin.</h2><p>These are separate programs. Participation in one is not required to ask about another.</p><div className="tp-grid">{(['TEE', 'TEA', 'EPDG'] as const).filter(brand => brand !== entity).map(brand => {
    const other = programFor(brand);
    const url = programHref(brand);
    return <article className="tp-card" key={brand}><p className="tp-eyebrow">{companyNames[brand]}</p><h3>{other.name}</h3><p>{other.audience}</p>{url && <a href={url}>Explore {other.shortName}<span aria-hidden="true"> →</span></a>}</article>;
  })}</div></section>;
}

export default function ThreePrograms({ entity, view }: { entity: ProgramCompany; view: 'page' | 'gateway' | 'footer' | 'referral' | 'card' }) {
  const program = programFor(entity);
  const url = programHref(entity);
  useEffect(() => {
    if (view !== 'page' && view !== 'referral') return;
    // Resolve deep links after this lazy-loaded view has mounted.
    const frame = requestAnimationFrame(() => {
      const id = window.location.hash.slice(1);
      if (id) document.getElementById(id)?.scrollIntoView();
    });
    return () => cancelAnimationFrame(frame);
  }, [entity, view]);
  if (view === 'footer') return <nav className={`tp tp-${entity.toLowerCase()} tp-footer`} aria-label="Featured educational programs">{(['TEE', 'TEA', 'EPDG'] as const).map(brand => {
    const destination = programHref(brand);
    return destination && <a key={brand} href={destination}>{programFor(brand).shortName} · {brand}</a>;
  })}</nav>;
  if (view === 'card' || view === 'referral') return <article className={`tp tp-${entity.toLowerCase()} tp-referral`}>
    {view === 'referral' && <ProgramMetadata entity={entity} />}
    <p className="tp-eyebrow">Program home · {companyNames[entity]}</p>
    {view === 'card' ? <h2>{program.name}</h2> : <h1>{program.name}</h1>}
    <p>{program.summary}</p><p className="tp-status">{program.status}</p>
    {url && <a className="tp-button" href={url}>Explore {program.shortName}<span aria-hidden="true"> →</span></a>}
    <p>The full learning model, participation information and inquiry options are on {companyNames[entity]}.</p>{publicIntakeEnabled && entity === 'EPDG' && <InternshipApplication />}
    {view === 'referral' && entity === 'EPDG' && url && <nav className="tp-actions" aria-label="Internship information"><a id="application-form" href={`${url}#program-contact`}>Ask about participation</a><a id="tracks" href={`${url}#program-curriculum`}>Explore tracks</a><a id="portfolio" href={`${url}#program-participation`}>Learning & portfolio evidence</a><a id="evidence-certificates" href={`${url}#program-faq`}>Completion questions</a></nav>}
  </article>;
  if (view === 'gateway') return <section className={`tp tp-${entity.toLowerCase()} tp-gateway`} aria-labelledby="featured-program-title"><div className="tp-wrap"><p className="tp-eyebrow">Featured program · {companyNames[entity]}</p><div className="tp-gateway-layout"><div><h2 id="featured-program-title">{program.name}</h2><p className="tp-tagline">{program.tagline}</p><p>{program.summary}</p><a className="tp-button" href={localHref(program.route)}>Explore {program.shortName}<span aria-hidden="true"> →</span></a></div><aside className="tp-card"><p className="tp-status">{program.status}</p><p>{program.availability}</p><p>{publicIntakeEnabled ? 'Class registration and internship applications are open through the linked Google Forms.' : 'Program information and email inquiries are available. Registration and live intake remain closed.'}</p></aside></div></div></section>;
  const primary = program.actions[0];
  return <main id="main-content" className={`tp tp-${entity.toLowerCase()} tp-page`}>
    <ProgramMetadata entity={entity} />
    <a className="tp-skip" href="#program-curriculum">Skip to the learning model</a>
    {threeProgramsLocal && <aside className="tp-review" aria-label="Local program review">Local program preview · Registration and live intake closed · Email links prepare a draft for you to review.</aside>}
    <header className="tp-hero"><div className="tp-wrap"><a href={localHref('/')}>← {companyNames[entity]}</a><p className="tp-eyebrow">{program.status}</p><h1>{program.name}</h1><p className="tp-tagline">{program.tagline}</p><p className="tp-lead">{program.summary}</p><div className="tp-actions"><a className="tp-button" href="#program-contact">{primary.label}</a><a className="tp-button tp-secondary" href="#program-curriculum">{entity === 'EPDG' ? 'Explore Tracks' : entity === 'TEE' ? 'Explore the Learning Model' : 'Explore the Curriculum'}</a></div></div></header>
    <nav className="tp-jump tp-wrap" aria-label="On this program page"><a href="#program-audience">Who it is for</a><a href="#program-curriculum">{entity === 'EPDG' ? 'Tracks' : 'Curriculum'}</a><a href="#program-participation">Participation</a><a href="#program-faq">Questions</a><a href="#program-contact">Contact</a></nav>
    <div className="tp-wrap">
      <section id="program-audience" className="tp-section"><p className="tp-eyebrow">Your starting point</p><h2>Who is this for?</h2><p className="tp-lead">{program.audience}</p><div className="tp-grid">{program.audienceGroups.map(item => <article className="tp-card" key={item.title}><h3>{item.title}</h3><p>{item.body}</p></article>)}</div><p>{program.geography}</p></section>
      <section className="tp-section"><p className="tp-eyebrow">Practical learning</p><h2>{entity === 'TEA' ? 'Support connected to your goals.' : 'What you can practice.'}</h2><ul className="tp-focus">{program.focus.map(item => <li key={item}>{item}</li>)}</ul></section>
      {!!program.modes.length && <section className="tp-section"><h2>Choose a level of support.</h2><div className="tp-grid">{program.modes.map(item => <article className="tp-card" key={item.title}><h3>{item.title}</h3><p>{item.body}</p></article>)}</div></section>}
      <section id="program-curriculum" className="tp-section"><p className="tp-eyebrow">Explore the learning model</p><h2>{program.curriculumTitle}</h2><p>{program.curriculumIntro}</p><div className="tp-accordion">{program.units.map((item, index) => <details key={item.title}><summary><span className="tp-unit">{program.unitLabel} {index + 1}</span><span>{item.title}</span></summary><p>{item.body}</p></details>)}</div></section>
      {!!program.phases.length && <section className="tp-section"><p className="tp-eyebrow">A source-supported example</p><h2>{entity === 'EPDG' ? 'The documented Fall 2026 framework.' : 'How the learning sequence develops.'}</h2><ol className="tp-timeline">{program.phases.map(item => <li key={item.title}><h3>{item.title}</h3><p>{item.body}</p></li>)}</ol></section>}
      {!!program.pathways.length && <section className="tp-section"><h2>Two developed curriculum previews.</h2><p>These examples show educational project possibilities. They do not establish current openings, school participation or student responsibility for live company or client work.</p><div className="tp-grid">{program.pathways.map(item => <article className="tp-card" key={item.title}><h3>{item.title}</h3><p>{item.body}</p></article>)}</div></section>}
      {!!program.workshops.length && <section className="tp-section"><h2>Bring practical learning to your community.</h2><p>Organizations can discuss referral, workshop, transition, facility-delivery and opportunity partnerships. Formats and adaptations are agreed for each arrangement.</p><div className="tp-grid">{program.workshops.map(item => <article className="tp-card" key={item.title}><h3>{item.title}</h3><p>{item.body}</p></article>)}</div></section>}
      <section id="program-participation" className="tp-section"><p className="tp-eyebrow">Before making plans</p><h2>Participation & availability.</h2><p className="tp-status">{program.status}</p><dl className="tp-facts"><div><dt>Current availability</dt><dd>{program.availability}</dd></div><div><dt>Time & format</dt><dd>{program.duration}</dd></div><div><dt>Participation fees</dt><dd>{program.participantFee}</dd></div><div><dt>Participant compensation</dt><dd>{program.compensation}</dd></div></dl><p>{program.boundary}</p></section>
      {program.localConnection && <section className="tp-section"><p className="tp-eyebrow">A local connection</p><h2>Rooted in South Carolina.</h2><p>{program.localConnection}</p><a href={localHref('/founder')}>Meet the founder →</a></section>}
      <section id="program-faq" className="tp-section"><h2>Frequently asked questions.</h2><div className="tp-accordion">{program.faqs.map(item => <details key={item.title}><summary>{item.title}</summary><p>{item.body}</p></details>)}</div></section>
      <section id="program-contact" className="tp-section tp-contact"><p className="tp-eyebrow">Start a conversation</p><h2>{program.contactLabel}</h2><p>Choose an inquiry below. Your email app opens a draft; you decide whether to send it. This website does not submit, store or confirm an inquiry.</p><p className="tp-mailbox">{program.contactEmail}</p><div className="tp-grid">{program.actions.map(action => {
        const draft = programInquiryText(entity, action.id)!;
        return <article className="tp-card" key={action.id}><h3>{action.label}</h3><p>{action.question}</p><a className="tp-button" href={programInquiryHref(entity, action.id)}>{action.label}<span className="tp-small">Opens an email draft</span></a><details><summary>No email app? Read and copy the draft</summary><p>To: {program.contactEmail}</p><p>Subject: {draft.subject}</p><pre className="tp-draft">{draft.body}</pre></details></article>;
      })}</div><p>Please use a general question for this first conversation. Do not send student records, identity documents or other sensitive information.</p><p>{publicIntakeEnabled ? (entity === 'EPDG' ? 'Use the internship application below to apply. General questions use the email drafts above.' : 'Class registration and internship application links are available on the Contact & next steps page. Use the email drafts above for questions about this program.') : 'No current application destination is linked. Registration and live intake remain closed.'}</p></section>
      {publicIntakeEnabled && entity === 'EPDG' && <InternshipApplication />}<SisterPrograms entity={entity} />
      <p className="tp-credit">Program descriptions prepared from founder-provided source records{threeProgramsLocal ? ' for local review' : ''} on October 18, 2026. The intern teams’ original site designs and contributions are retained.</p>
    </div>
  </main>;
}
