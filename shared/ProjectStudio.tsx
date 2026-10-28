import { useState } from 'react';
import catalog from './project-studio.public.json';
import { companyHref } from './company-links';
import { localHref } from './platform-format';
import { projectBriefText } from './project-studio-brief';
import './project-studio.css';

type Entity = 'TEE' | 'TEA';
type Example = typeof catalog.examples[number];
const teeStudio = (anchor = '') => import.meta.env.MODE === 'studio-local'
  ? `http://127.0.0.1:5183/project-studio${anchor}`
  : companyHref('TEE', `/project-studio${anchor}`) || localHref('/coverage');

function Gateway({ entity }: { entity: Entity }) {
  return <section className={`ps ps-gateway ps-${entity.toLowerCase()}`} aria-labelledby="studio-gateway-heading"><div className="ps-wrap ps-gateway-layout">
    <div><p className="ps-eyebrow">Project Studio · The Emerson Empire</p><h2 id="studio-gateway-heading">A defined project.<br />A practical way forward.</h2><p>{entity === 'TEE' ? 'Bring a business task into focus with clear deliverables, a review process and a useful handoff.' : 'Explore business project support through Project Studio, with The Emerson Empire as the proposed operator.'}</p><a className="ps-button" href={localHref('/project-studio')}>Explore Project Studio <span aria-hidden="true">↗</span></a></div>
    <div className="ps-gateway-note"><span className="ps-rule" aria-hidden="true" /><p className="ps-eyebrow">From the first brief to handoff</p><h3>Clarity before commitment.</h3><p>Start with your business goal. Define what the project includes, what it needs from you and how the work will be reviewed.</p><div className="ps-tags"><span>Business foundations</span><span>Business operations</span></div></div>
  </div></section>;
}

function ExampleCard({ offer, referral }: { offer: Example; referral: boolean }) {
  return <article className="ps-offer" id={offer.id.toLowerCase()} aria-labelledby={`title-${offer.id}`}>
    <p className="ps-eyebrow">{offer.family}</p><h3 id={`title-${offer.id}`}>{offer.name}</h3><p>{offer.summary}</p><p className="ps-audience"><strong>For:</strong> {offer.audience}</p>
    {referral ? <><p className="ps-price">{offer.priceDisplay}</p><a className="ps-text-link" href={teeStudio(`#${offer.id.toLowerCase()}`)}>Read the scope at TEE <span aria-hidden="true">↗</span></a></> : <>
      <h4>Included deliverables</h4><ul>{offer.deliverables.map(item => <li key={item}>{item}</li>)}</ul>
      <details><summary>Scope limits & your inputs</summary><h4>Important limits</h4><ul>{offer.limits.map(item => <li key={item}>{item}</li>)}</ul><h4>What you provide</h4><ul>{offer.inputs.map(item => <li key={item}>{item}</li>)}</ul><h4>Review & handoff</h4><p>{offer.handoff}</p></details>
      <p className="ps-delivery">{offer.delivery}</p><p className="ps-price">{offer.priceDisplay}</p><a className="ps-text-link" href="#project-brief">Plan your project brief <span aria-hidden="true">→</span></a>
    </>}
  </article>;
}

function Brief() {
  const [goal, setGoal] = useState('');
  const [process, setProcess] = useState('');
  const [outcome, setOutcome] = useState('');
  function save() {
    const url = URL.createObjectURL(new Blob([projectBriefText(goal, process, outcome)], { type: 'text/plain;charset=utf-8' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'project-studio-personal-brief.txt';
    document.body.append(anchor); anchor.click(); anchor.remove(); setTimeout(() => URL.revokeObjectURL(url), 10000);
  }
  return <section className="ps-brief ps-wrap" id="project-brief" aria-labelledby="brief-heading"><div><p className="ps-eyebrow">Start with the outcome</p><h2 id="brief-heading">Plan your project brief.</h2><p>Write a few notes about the task you want to discuss. Save a personal text copy to revisit before a conversation.</p><p id="brief-privacy" className="ps-small">These notes stay in this page until you save them. They are not submitted or stored by the site and clear when you reload. Leave out sensitive information.</p><p className="ps-availability">Project inquiries are not being accepted through this page. No capacity is reserved and no request is sent.</p><a className="ps-text-link" href={localHref('/inquiry')}>View existing support availability →</a></div>
    <div className="ps-note-fields" aria-describedby="brief-privacy"><label htmlFor="studio-goal">What do you want to accomplish?</label><textarea id="studio-goal" maxLength={2000} rows={3} value={goal} onChange={event => setGoal(event.target.value)} placeholder="For example: organize the steps after a new customer inquiry." /><label htmlFor="studio-process">What process or materials do you already have?</label><textarea id="studio-process" maxLength={2000} rows={3} value={process} onChange={event => setProcess(event.target.value)} /><label htmlFor="studio-outcome">What would a useful result look like?</label><textarea id="studio-outcome" maxLength={2000} rows={3} value={outcome} onChange={event => setOutcome(event.target.value)} /><button type="button" className="ps-button" onClick={save}>Save my brief (.txt)</button><p className="ps-small">Saves a file on your device. This does not send an inquiry.</p></div>
  </section>;
}

const faq = [
  ['How is the project scope agreed?', 'Discovery clarifies the goal and service fit. A written scope should define deliverables, exclusions, client inputs, price, milestones and acceptance before any work is accepted.'],
  ['Are discovery, an audit and implementation the same service?', 'They are different scopes. Discovery defines the need; an audit assesses an existing process; implementation produces agreed deliverables. A recurring engagement needs its own period, deliverables and renewal terms. Neither example package includes ongoing management.'],
  ['How are revisions handled?', 'Each example includes one consolidated revision round. Additional work or a changed brief needs a separately agreed scope and price.'],
  ['Who delivers and reviews the work?', 'The project scope should identify an accountable lead and reviewer. Depending on the agreed service, delivery can be founder-led, supervised intern-delivered or joint. A qualified team and capacity must be confirmed before acceptance.'],
  ['What happens at handoff, and who owns the work?', 'The agreed scope should set the acceptance method, editable files, handoff and any support period. Ownership or licensing, existing materials and third-party assets need to be stated in the written terms; a download or inquiry does not transfer rights.'],
  ['What does the client provide?', 'Accurate business facts, client-owned or licensed materials, any agreed system access and one decision maker for feedback. Project-specific inputs should be agreed before work begins.'],
  ['Does a brief reserve a project or hire an intern?', 'No. A personal brief is only a planning aid. An inquiry is a request for review; it does not reserve capacity, accept a project, hire an individual, create a contract or guarantee an outcome.'],
];

function Page({ entity }: { entity: Entity }) {
  const referral = entity === 'TEA';
  return <main id="studio-main" className={`ps ps-page ps-${entity.toLowerCase()}`}>
    <section className="ps-hero"><div className="ps-wrap"><a className="ps-back" href={localHref('/')}>← {referral ? 'The Emerson Agency' : 'The Emerson Empire'}</a><p className="ps-eyebrow">{referral ? 'Business support · Project Studio' : 'The Emerson Empire · Project Studio'}</p><h1>{referral ? <>Business project support.<br /><em>A clear path to TEE.</em></> : <>Your next business task,<br /><em>with a clear scope.</em></>}</h1><p className="ps-lead">{referral ? 'Explore defined business and operations projects through Project Studio, with The Emerson Empire as the proposed operator and delivery home.' : 'Organize your business foundations or improve a customer workflow with defined deliverables, review and a practical handoff.'}</p><div className="ps-actions"><a className="ps-button" href="#studio-packages">Explore the project scopes <span aria-hidden="true">↓</span></a><a className="ps-light-link" href={referral ? teeStudio('#project-brief') : '#project-brief'}>{referral ? 'Plan a brief at TEE ↗' : 'Plan your project brief →'}</a></div><p className="ps-hero-note">Planning preview · Project scope, team and availability require agreement before work begins.</p></div></section>
    {referral && <section className="ps-wrap ps-referral" aria-labelledby="operator-heading"><p className="ps-eyebrow">Know who you are working with</p><h2 id="operator-heading">Project details belong with TEE.</h2><p>TEE is the proposed Studio operator. The links below take you to its Studio page for full scope details and brief planning. TEA’s insurance, tax, financial and other specialist services remain separately scoped; Studio support does not include licensed or regulated advice.</p><a className="ps-text-link" href={localHref('/services-pricing')}>Explore TEA’s existing services & pricing →</a></section>}
    <section className="ps-wrap ps-packages" id="studio-packages" aria-labelledby="packages-heading"><div className="ps-section-heading"><div><p className="ps-eyebrow">Business foundations & operations</p><h2 id="packages-heading">Start with one defined project.</h2></div><p>Choose the scope closest to your goal, then identify what is included, what you provide and what needs a separate brief.</p></div><div className="ps-offers">{catalog.examples.map(offer => <ExampleCard key={offer.id} offer={offer} referral={referral} />)}</div></section>
    {!referral && <><section className="ps-process"><div className="ps-wrap"><p className="ps-eyebrow">How a scoped project works</p><h2>From a clear brief to a reviewed handoff.</h2><ol>{[['Define the goal', 'Discuss the need, inputs and service fit. Discovery or an audit can be scoped separately.'], ['Agree the project', 'Confirm the lead, reviewer, deliverables, limits, price and written terms before acceptance.'], ['Create and review', 'Work to the agreed milestones, with a defined revision allowance and written changes for extra scope.'], ['Accept and hand over', 'Check the agreed deliverables, record acceptance and hand over files and guidance.']].map(([title, text], i) => <li key={title}><span aria-hidden="true">0{i + 1}</span><h3>{title}</h3><p>{text}</p></li>)}</ol></div></section><Brief /><section className="ps-wrap ps-faq" aria-labelledby="faq-heading"><p className="ps-eyebrow">Before a project begins</p><h2 id="faq-heading">Questions about working together.</h2>{faq.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</section></>}
    {referral && <section className="ps-wrap ps-tea-next"><h2>Take the next step with a clear brief.</h2><p>Review the project at TEE and save your own planning notes. Registration and live intake are currently closed. Saving a brief does not submit an inquiry.</p><a className="ps-button" href={teeStudio()}>Continue to TEE Project Studio ↗</a></section>}
  </main>;
}

export default function ProjectStudio({ entity, view }: { entity: Entity; view: 'page' | 'gateway' }) {
  if (view === 'gateway') return <Gateway entity={entity} />;
  return <Page entity={entity} />;
}
