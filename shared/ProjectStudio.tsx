import { useState } from 'react';
import catalog from './project-studio.public.json';
import information from './project-studio.information.json';
import { localHref } from './platform-format';
import { briefQuestions, projectBriefText, type ProjectBrief } from './project-studio-brief';
import { PublicMediaImage } from './PublicMediaImage';
import { mediaAsset } from './public-media';
import ProjectStudioReferral from './ProjectStudioReferral';
import './project-studio.css';

type Entity = 'TEE' | 'TEA';
type Example = typeof catalog.examples[number];

function Gateway({ entity }: { entity: Entity }) {
  return <section className={`ps ps-gateway ps-${entity.toLowerCase()}`} aria-labelledby="studio-gateway-heading"><div className="ps-wrap ps-gateway-layout">
    <div><p className="ps-eyebrow">Project Studio · The Emerson Empire</p><h2 id="studio-gateway-heading">Your business has work to do.</h2><p>{entity === 'TEE' ? 'Explore help with websites, workflows, client coordination, business research and other defined projects. Every proposed scope begins with a review of the need and the expertise it requires.' : 'Explore practical implementation support through Project Studio, the wider Emerson ecosystem’s managed project service.'}</p><a className="ps-button" href={localHref('/project-studio')}>Explore Project Studio <span aria-hidden="true">↗</span></a></div>
    <div className="ps-gateway-note"><p className="ps-eyebrow">From a clear scope to a useful handoff</p><h3>A clear scope. An accountable team.<br />A professionally reviewed result.</h3><p>Browse the project areas and prepare an offline brief. Scope, team, availability and written terms require individual agreement.</p><div className="ps-tags"><span>Digital development</span><span>Business operations</span><span>Client systems</span></div></div>
  </div></section>;
}

function ExampleCard({ offer }: { offer: Example }) {
  return <article className="ps-offer" id={offer.id.toLowerCase()} aria-labelledby={`title-${offer.id}`}>
    <p className="ps-eyebrow">{offer.id} · {offer.family}</p><h3 id={`title-${offer.id}`}>{offer.name}</h3><p>{offer.summary}</p><p className="ps-audience"><strong>For:</strong> {offer.audience}</p>
    <h4>Included deliverables</h4><ul>{offer.deliverables.map(item => <li key={item}>{item}</li>)}</ul>
    <details><summary>Scope limits & your inputs</summary><h4>Important limits</h4><ul>{offer.limits.map(item => <li key={item}>{item}</li>)}</ul><h4>What you provide</h4><ul>{offer.inputs.map(item => <li key={item}>{item}</li>)}</ul><h4>Review & handoff</h4><p>{offer.handoff}</p></details>
    <p className="ps-delivery">{offer.delivery}</p><p className="ps-price">{offer.priceDisplay}</p><a className="ps-text-link" href="#project-brief">Prepare your project brief <span aria-hidden="true">→</span></a>
  </article>;
}

function Brief() {
  const [brief, setBrief] = useState<ProjectBrief>({ goal: '', responsibility: '', materials: '', outcome: '', constraints: '', questions: '' });
  const [saved, setSaved] = useState(false);
  function save() {
    const url = URL.createObjectURL(new Blob([projectBriefText(brief)], { type: 'text/plain;charset=utf-8' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'project-studio-personal-brief.txt';
    document.body.append(anchor); anchor.click(); anchor.remove(); setTimeout(() => URL.revokeObjectURL(url), 10000);
    setSaved(true);
  }
  return <section className="ps-brief ps-wrap" id="project-brief" aria-labelledby="brief-heading"><div><p className="ps-eyebrow">Your next useful step</p><h2 id="brief-heading">Prepare your project brief.</h2><p>Start with the work you would like to move forward. These six questions can help you organize your thoughts before a future scoping conversation.</p><p id="brief-privacy" className="ps-small">These notes stay in this page until you save them. They are not submitted or stored by the site and clear when you reload. Leave out passwords, personnel files, private financial records and other sensitive information.</p><p className="ps-availability"><strong>Saving a brief does not send a request, reserve project capacity or create a contract.</strong></p><p className="ps-small">Live project intake and client registration remain closed. This planning page does not accept projects or payments.</p><a className="ps-text-link" href={localHref('/inquiry')}>View existing support availability →</a></div>
    <div className="ps-note-fields" aria-describedby="brief-privacy">{briefQuestions.map(({ key, label }, index) => <div key={key}><label htmlFor={`studio-${key}`}><span className="ps-field-number" aria-hidden="true">0{index + 1}</span>{label}</label><textarea id={`studio-${key}`} maxLength={2000} rows={3} value={brief[key]} onChange={event => { setBrief({ ...brief, [key]: event.target.value }); setSaved(false); }} /></div>)}<button type="button" className="ps-button" onClick={save}>Save my brief (.txt)</button><p className="ps-small" role="status">{saved ? 'Your text file is ready on your device. No request was sent.' : 'Saves a text file on your device. No information is sent to Emerson.'}</p></div>
  </section>;
}

const faq = [
  ['Can I explore a project outside these examples?', 'Yes. The eight categories describe areas for individual review, not a complete list of accepted projects. Expertise, capacity, confidentiality, qualifications, jurisdiction, compensation and oversight must be assessed before an engagement is accepted.'],
  ['How does Project Studio begin?', 'Start with a business need and the offline planning brief. A future conversation would check service fit, the information needed and who has authority to approve the work. The current public page does not accept project inquiries.'],
  ['Are discovery, internal review and implementation the same service?', 'They are different scopes. Discovery defines the need; internal review examines a process or records; implementation produces agreed deliverables. Internal financial review is not a formal independent financial-statement audit. Recurring support needs its own period, deliverables and terms.'],
  ['How are revisions handled?', 'The BUS-03 and SYS-03 examples each include one consolidated revision round. Other projects need an individually agreed review allowance. Additional work or a changed brief requires a separately approved scope and price.'],
  ['Who delivers and reviews the work?', 'An authorized project lead coordinates appropriately skilled contributors and a designated reviewer. Qualified personnel, capacity, supervision and compensation arrangements must be confirmed before acceptance. No team is reserved by viewing this page.'],
  ['How is quality checked?', 'The lead and reviewer should compare each deliverable with the agreed scope, check sources and permissions, resolve open questions, and record client acceptance before handoff. The review method belongs in the project scope.'],
  ['How are confidentiality and access handled?', 'Share only information needed for the agreed work. Sensitive records, credentials and private client data do not belong in the offline brief. Any system access must be separately approved, scoped and removed when no longer needed.'],
  ['Can emerging professionals contribute?', 'Supervised emerging professionals may contribute alongside qualified, accountable leads under appropriate staffing and compensation arrangements. Educational participation does not automatically assign unpaid interns to commercial work or make them interchangeable with employees or contractors.'],
  ['What happens at handoff, and who owns the work?', 'The agreed scope should set the acceptance method, editable files, handoff and any support period. Ownership or licensing, existing materials and third-party assets need to be stated in the written terms; saving a brief does not transfer rights.'],
  ['What does the client provide?', 'Accurate business facts, client-owned or licensed materials, any separately approved system access and a decision maker for feedback. Project-specific inputs and responsibilities should be agreed before work begins.'],
  ['Who would contract for the project?', 'The Emerson Empire presents Project Studio, but this website does not establish the contracting legal entity or authorized signatory. Those details, the scope, price, responsible personnel, availability and terms must be verified and agreed before work starts. Visiting or saving a brief creates no client relationship.'],
];

const iconPaths = [
  'M3 5h18v14H3z M3 9h18 M7 7h.01 M11 12l-3 2 3 2 M14 12l3 2-3 2',
  'M4 4h16v12H8l-4 4z M8 8h8 M8 12h5',
  'M9 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6 M3 20v-3a6 6 0 0 1 12 0v3 M17 5a3 3 0 0 1 0 6 M19 14a4 4 0 0 1 2 4v2',
  'M4 4h16v16H4z M8 8h8 M8 12h5 M8 16h3',
  'M3 3h6v6H3z M15 15h6v6h-6z M15 3h6v6h-6z M6 9v9h9 M9 6h6',
  'M5 3h14v18H5z M9 7h6 M9 11h2 M14 11h1 M9 15h2 M14 15h1 M9 18h6',
  'M4 4h6v16H4z M14 4h6v16h-6z M7 8h.01 M7 12h.01 M17 8h.01 M17 12h.01',
  'M12 3l8 3v6c0 5-8 9-8 9S4 17 4 12V6z M8 12l3 3 5-6',
];

function Categories() {
  return <section className="ps-wrap ps-categories" id="studio-categories" aria-labelledby="categories-heading"><div className="ps-section-heading"><div><p className="ps-eyebrow">Explore the possibilities</p><h2 id="categories-heading">What can we help you with?</h2></div><p>Start with the responsibility you want help completing. Each area is a starting point for a considered project review.</p></div>
    <div className="ps-category-grid">{information.categories.map((category, index) => <article className="ps-category" key={category.id}><svg className="ps-category-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={iconPaths[index]} /></svg><h3>{category.title}</h3><p>{category.summary}</p><ul>{category.examples.map(example => <li key={example}>{example}</li>)}</ul><a className="ps-text-link" href={`#category-${category.id}`}>Explore this area <span aria-hidden="true">→</span><span className="modern-sr-only"> {category.title}</span></a></article>)}</div>
    <p className="ps-category-notice">{information.categoryNotice}</p>
  </section>;
}

function Page() {
  return <main id="main-content" tabIndex={-1} className="ps ps-page ps-tee">
    <section className="ps-hero" data-editorial-kind="banner"><div className="ps-wrap"><a className="ps-back" href={localHref('/')}>← The Emerson Empire</a><div className="ps-hero-grid"><div><p className="ps-eyebrow">The Emerson Empire · Project Studio</p><h1>Your business has work to do. <em>We're here to help move it forward.</em></h1><p className="ps-lead">Bring us the project your business needs help completing. Whether you're building a website, improving a workflow, organizing operations or developing better client systems, Project Studio offers a structured way to explore the work, define the scope and coordinate professional delivery.</p><div className="ps-actions"><a className="ps-button" href="#studio-categories">Explore What We Can Help With <span aria-hidden="true">↓</span></a><a className="ps-light-link" href="#project-brief">Prepare Your Project Brief <span aria-hidden="true">→</span></a></div><p className="ps-hero-note">Project planning · Scope, team and availability require agreement. Live intake is closed.</p></div><figure className="ps-hero-art"><PublicMediaImage asset={mediaAsset('tee-project-clarity')} priority sizes="(max-width: 850px) calc(100vw - 48px), 42vw" /><figcaption>Editorial illustration</figcaption></figure></div></div></section>
    <section className="ps-promise"><div className="ps-wrap"><p>A clear scope. <span>An accountable team.</span> A professionally reviewed result.</p></div></section>
    <Categories />
    <section className="ps-practice" aria-labelledby="practice-heading"><div className="ps-wrap"><p className="ps-eyebrow">Projects in practice</p><h2 id="practice-heading">Start with a real business need.</h2><p className="ps-section-intro">{information.illustrativeCaseNotice}</p><div className="ps-case-grid">{information.illustrativeCases.map((example, index) => <article key={example.id}><p className="ps-eyebrow">Illustrative scenario · 0{index + 1}</p><h3>{example.title}</h3><p>{example.description}</p><a className="ps-text-link" href={`#category-${example.categoryId}`}>Explore the project area <span aria-hidden="true">→</span></a></article>)}</div></div></section>
    <section className="ps-process" id="studio-process" aria-labelledby="process-heading"><div className="ps-wrap"><p className="ps-eyebrow">A proposed delivery path</p><h2 id="process-heading">How Project Studio Works</h2><p className="ps-section-intro">A useful outcome starts with clear decisions. This is the intended process for a separately approved engagement, not a confirmation that a project has been accepted.</p><ol>{information.processSteps.map((step, index) => <li key={step.id}><span aria-hidden="true">0{index + 1}</span><h3>{step.title}</h3><p>{step.description}</p></li>)}</ol></div></section>
    <section className="ps-team ps-wrap" aria-labelledby="team-heading" data-editorial-kind="feature"><div className="ps-team-grid"><figure className="ps-team-art"><PublicMediaImage asset={mediaAsset('tee-shared-handoff')} /><figcaption>Editorial illustration</figcaption></figure><div><p className="ps-eyebrow">The people behind the projects</p><h2 id="team-heading">Coordinated teams. Clear responsibility.</h2><p>The Emerson ecosystem brings together areas of technical development, sales, business operations, marketing, administration and professional learning. A project begins by identifying the skills, accountable lead and review it needs.</p><p>Where appropriate, supervised emerging professionals may contribute alongside qualified, accountable leads. Commercial work requires an approved staffing, supervision and compensation arrangement.</p><p className="ps-small">Educational interns are not automatically assigned to revenue-producing work or treated as interchangeable with employees or contractors. A project assignment does not confer authority to contract, access sensitive records, deliver regulated services or approve client work.</p><p className="ps-attribution">Founder-led. Built through collaborative work.<br />Credit given wherever credit is due.</p></div></div></section>
    <section className="ps-wrap ps-category-details" aria-labelledby="details-heading"><p className="ps-eyebrow">A closer look</p><h2 id="details-heading">Define the work. Understand the scope.</h2><div>{information.categories.map((category, index) => <article id={`category-${category.id}`} key={category.id}><div><p className="ps-eyebrow">Project area · 0{index + 1}</p><h3>{category.title}</h3></div><div><p>{category.detail}</p><p className="ps-boundary">{category.boundary}</p><a className="ps-text-link" href="#project-brief">Prepare notes for this project <span aria-hidden="true">→</span></a></div></article>)}</div></section>
    <section className="ps-wrap ps-packages" id="studio-packages" aria-labelledby="packages-heading"><div className="ps-section-heading"><div><p className="ps-eyebrow">Two existing quote-only examples</p><h2 id="packages-heading">What a defined scope can look like.</h2></div><p>Have a different project in mind? These examples illustrate our scoping approach. Other projects are reviewed individually before availability, deliverables, pricing and terms can be confirmed.</p></div><div className="ps-offers">{catalog.examples.map(offer => <ExampleCard key={offer.id} offer={offer} />)}</div></section>
    <section className="ps-standards" aria-labelledby="standards-heading"><div className="ps-wrap"><p className="ps-eyebrow">Professional delivery standards</p><h2 id="standards-heading">Careful work, from the first decision to handoff.</h2><div className="ps-quality-grid"><article><h3>A shared understanding</h3><p>Written scope, defined deliverables, agreed milestones and documented changes keep the work and expectations clear.</p></article><article><h3>Accountable people</h3><p>An identified project lead, an appropriate reviewer and clear client communication support every agreed stage.</p></article><article><h3>Confidentiality and ownership</h3><p>Appropriate confidentiality, secure and approved access, and written ownership or licensing terms protect the information and materials involved.</p></article><article><h3>A reviewed result</h3><p>Quality checks, client review and acceptance, and a professional handoff bring the agreed files, documentation and guidance together.</p></article></div><p className="ps-small">Some requests need licensed, certified or otherwise authorized professionals. We assess the required qualifications and scope, including whether a referral to a qualified provider is appropriate.</p></div></section>
    <Brief />
    <section className="ps-wrap ps-faq" aria-labelledby="faq-heading"><p className="ps-eyebrow">Before a project begins</p><h2 id="faq-heading">Questions about working together.</h2>{faq.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</section>
  </main>;
}

export default function ProjectStudio({ entity, view }: { entity: Entity; view: 'page' | 'gateway' }) {
  if (view === 'gateway') return <Gateway entity={entity} />;
  return entity === 'TEA' ? <ProjectStudioReferral /> : <Page />;
}
