import catalog from './project-studio.public.json';
import { companyHref } from './company-links';
import { localHref } from './platform-format';
import { mediaAsset } from './public-media';
import { EditorialBanner } from './EditorialDesign';
import './project-studio-referral.css';

const teeStudio = (anchor = '') => import.meta.env.MODE === 'studio-local'
  ? `http://127.0.0.1:5183/project-studio${anchor}`
  : companyHref('TEE', `/project-studio${anchor}`) || localHref('/coverage');

export default function ProjectStudioReferral() {
  return <main id="main-content" tabIndex={-1} className="ps ps-page ps-tea ps-referral-page">
    <EditorialBanner
      asset={mediaAsset('tea-organized-records')}
      eyebrow="The Emerson Agency · Project Studio"
      title="Your business needs more than advice. Sometimes it needs the work done."
      description="From organizing business records and improving client scheduling to creating forms, updating websites and strengthening everyday operations, The Emerson Agency helps business owners connect with Project Studio, the wider Emerson ecosystem's managed project service."
    >
      <a className="modern-button" href="#service-pathways">Find the right pathway <span aria-hidden="true">↓</span></a>
      <a className="modern-button-secondary" href={teeStudio('#project-brief')}>Prepare a brief at TEE <span aria-hidden="true">↗</span></a>
    </EditorialBanner>

    <section id="service-pathways" className="ps-wrap ps-referral-pathways" aria-labelledby="pathways-heading">
      <div className="ps-section-heading">
        <div><p className="ps-eyebrow">Four ways to move forward</p><h2 id="pathways-heading">Start with the work your business needs.</h2></div>
        <p>Explore the Agency’s existing services or a project pathway through The Emerson Empire. Each proposed project needs an individual review of fit, expertise, capacity and appropriate oversight.</p>
      </div>
      <div className="ps-referral-pathway-grid">
        <article className="ps-referral-pathway">
          <p className="ps-eyebrow"><span aria-hidden="true">01 · </span>Agency services</p>
          <h3>Financial and Specialist Services</h3>
          <p>Start with the Agency’s approved information for <a href={localHref('/tax-preparation')}>tax preparation</a>, <a href={localHref('/insurance')}>insurance education</a> and <a href={localHref('/financial-coaching')}>financial coaching</a>. Current qualifications, jurisdiction and professional scope must be confirmed for the particular service.</p>
          <a className="ps-text-link" href={localHref('/services-pricing')}>Explore Agency services and pricing <span aria-hidden="true">→</span></a>
        </article>
        <article className="ps-referral-pathway">
          <p className="ps-eyebrow"><span aria-hidden="true">02 · </span>Project Studio at TEE</p>
          <h3>Financial Organization &amp; Business Administration</h3>
          <p>Explore a defined project to organize invoices, records, reporting templates or administrative routines, with appropriate specialist involvement where required. Record organization and internal review are not formal financial-statement audits or CPA attest services.</p>
          <a className="ps-text-link" href={teeStudio('#category-financial-records-organization')}>Explore record-organization projects <span aria-hidden="true">↗</span></a>
        </article>
        <article className="ps-referral-pathway">
          <p className="ps-eyebrow"><span aria-hidden="true">03 · </span>Project Studio at TEE</p>
          <h3>Websites &amp; Digital Systems</h3>
          <p>Bring a website update, digital workflow or technical problem into focus. TEE explains the possibilities for websites, <a href={teeStudio('#category-business-systems-automation')}>CRM systems, forms and automation</a>, and <a href={teeStudio('#category-technical-quality-security')}>debugging and technical review</a>. System access requires a separately approved scope.</p>
          <a className="ps-text-link" href={teeStudio('#category-websites-digital-development')}>Explore websites and digital development <span aria-hidden="true">↗</span></a>
        </article>
        <article className="ps-referral-pathway">
          <p className="ps-eyebrow"><span aria-hidden="true">04 · </span>Project Studio at TEE</p>
          <h3>Sales, HR &amp; Operational Support</h3>
          <p>Explore appointment-setting workflows, authorized sales coordination, <a href={teeStudio('#category-human-resources-people-operations')}>HR administration</a> and <a href={teeStudio('#category-operations-project-management')}>project management and organizational systems</a>. Outreach, personnel information and employer decisions require appropriate authority and professional oversight; no sales or appointment outcome is guaranteed.</p>
          <a className="ps-text-link" href={teeStudio('#category-sales-client-coordination')}>Explore client-coordination projects <span aria-hidden="true">↗</span></a>
        </article>
      </div>
    </section>

    <section className="ps-referral-transparency" aria-labelledby="responsibility-heading">
      <div className="ps-wrap ps-referral-transparency-grid">
        <div><p className="ps-eyebrow">Clear responsibility</p><h2 id="responsibility-heading">The right service, with a clear agreement.</h2></div>
        <div>
          <p>The Emerson Agency provides its own appropriately scoped services. Project Studio’s full categories and delivery process are presented through The Emerson Empire.</p>
          <p>The final legal contracting entity, service scope, price and availability require agreement before work begins. Visiting either website does not establish a client relationship.</p>
          <a className="ps-text-link" href={teeStudio('#studio-categories')}>Review all eight project categories at TEE <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </section>

    <section id="studio-packages" className="ps-wrap ps-referral-examples" aria-labelledby="examples-heading">
      <p className="ps-eyebrow">Two retained scope examples</p>
      <h2 id="examples-heading">What a defined project can look like.</h2>
      <p className="ps-referral-intro">These existing, quote-only examples illustrate the scoping approach. They are not the full range of projects that may be proposed. Other projects require individual review before deliverables, price, timing and terms can be confirmed.</p>
      <div className="ps-referral-example-grid">{catalog.examples.map(offer => <article className="ps-referral-example" id={offer.id.toLowerCase()} key={offer.id} aria-labelledby={`referral-${offer.id}`}>
        <p className="ps-eyebrow">{offer.id} · {offer.family}</p>
        <h3 id={`referral-${offer.id}`}>{offer.name}</h3>
        <p>{offer.summary}</p>
        <p className="ps-price">{offer.priceDisplay}</p>
        <a className="ps-text-link" href={teeStudio(`#${offer.id.toLowerCase()}`)}>Read {offer.name} inclusions and limits at TEE <span aria-hidden="true">↗</span></a>
      </article>)}</div>
    </section>

    <section className="ps-referral-planning" aria-labelledby="planning-heading">
      <div className="ps-wrap ps-referral-transparency-grid">
        <div><p className="ps-eyebrow">Prepare before committing</p><h2 id="planning-heading">Make room for a practical next step.</h2></div>
        <div>
          <p>Use TEE’s offline planning brief to describe your goal, the work you need help with and what a useful result would look like. Keep passwords, personnel files and private financial records out of your notes.</p>
          <a className="ps-button" href={teeStudio('#project-brief')}>Prepare your offline project brief <span aria-hidden="true">↗</span></a>
          <p className="ps-small">Live project intake, registration and payments remain closed. Saving a brief does not send a request, reserve project capacity or create a contract.</p>
        </div>
      </div>
    </section>
  </main>;
}
