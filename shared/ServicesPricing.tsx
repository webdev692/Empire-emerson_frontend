import { useState } from 'react';
import data from './services-catalog.public.json';
import { serviceInquiryHref } from './service-inquiry';
import type { ServiceCompany } from './service-inquiry';
import { localHref as href } from './platform-format';
import { companyHref } from './company-links';
import './company-platform.css';
import './services-pricing.css';

const serviceCompanies = { TEE: 'The Emerson Empire', TEA: 'The Emerson Agency LLC', EPDG: 'Emerson Professional Development Group' };
type Service = typeof data.services[number];
function InquiryLinks({ entity, id }: { entity: ServiceCompany; id: string }) {
  return <div className="cp-actions sp-inquiries"><a className="cp-button" href={serviceInquiryHref(entity, id)}>Request a service by email</a><a href={serviceInquiryHref(entity, id, true)}>Ask about access options</a></div>;
}
function ServiceCard({ service }: { service: Service }) {
  return <article className="cp-card sp-service" id={service.id}>
    <p className="cp-eyebrow">{service.category}</p><h3>{service.name}</h3><p>{service.description}</p>
    <p><strong>Best for:</strong> {service.audience}</p>
    {service.id === 'epdg-enhanced-portfolio-review' && <p className="sp-note">Optional paid support; internship participation remains free.</p>}
    <div className="sp-price-table"><table><caption>Options & planning estimates</caption><thead><tr><th scope="col">Option / what may be included</th><th scope="col">Guide price</th></tr></thead><tbody>{service.options.map(option => <tr key={option.label}><th scope="row">{option.label}{option.basis === 'add-on' ? ' (add-on)' : ''}</th><td>{option.price}</td></tr>)}</tbody></table></div>
    {service.options.length === 1 && <p><strong>May include:</strong> {service.mayInclude}.</p>}
    <p className="sp-access"><strong>Access & conditions:</strong> {service.access}{service.id === 'tea-tax-document-organization' && <>. The guide mentions a free checklist; a verified standalone download was not supplied. Ask for the current copy.</>}</p>
    <p className="cp-small">Customer guide · {service.sourcePrepared} · page {service.sourcePage}. Scope and availability require confirmation.</p>
    <InquiryLinks entity={service.entity as ServiceCompany} id={service.id} />
  </article>;
}
export function ServicesGateway({ entity }: { entity: ServiceCompany }) {
  const services = data.services.filter(item => item.entity === entity);
  return <section className={`company-platform cp-${entity.toLowerCase()} sp-gateway`} aria-label="Services and pricing"><div><p className="cp-eyebrow">Find the right support</p><h2>Services, packages & pricing</h2><p>{services.length} documented service families, with free options, package comparisons and planning estimates.</p><a className="cp-button" href={href('/services-pricing')}>Explore services & pricing →</a>{entity === 'EPDG' && <p>Free internships · Optional career support · Classes & workforce training</p>}</div></section>;
}
export default function ServicesPricing({ entity }: { entity: ServiceCompany }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const services = data.services.filter(item => item.entity === entity);
  const categories = [...new Set(services.map(item => item.category))];
  const results = services.filter(item => (!category || item.category === category) && `${item.name} ${item.audience} ${item.category} ${item.mayInclude}`.toLowerCase().includes(query.trim().toLowerCase()));
  const guide = data.guides.find(item => item.entity === entity)!;
  return <><div className="cp-page-title" id="emerson-empire"><p className="cp-eyebrow">{serviceCompanies[entity]}</p><h1>Services & pricing</h1><p>Choose support that fits your goals. Compare the documented options, review access conditions and ask about current availability.</p></div>
    <div className="cp-callout"><p><strong>Planning estimates, with a final quote before service.</strong> {data.pricingMeaning}</p><p className="cp-small">{data.currencyNote} Listed options do not promise every deliverable in every package.</p><div className="cp-actions"><a className="cp-button" href={href(guide.href)} target="_blank" rel="noreferrer">View Services & Pricing Guide (PDF)</a><a href={href(guide.href)} download={guide.filename}>Download pricing guide</a><a href="#access-options">Free & reduced-cost options</a><a href={href('/classes')}>Classes & workshops</a></div><p className="cp-small">Original customer-facing guide, prepared {guide.prepared}. Public-program figures in the PDF may be dated; use the current official referral links below. No Drive sign-in needed.</p></div>
    <section className="cp-filter" aria-label="Find services"><label>Search services<input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Service, audience or package" /></label><label>Service category<select value={category} onChange={event => setCategory(event.target.value)}><option value="">All categories</option>{categories.map(value => <option key={value}>{value}</option>)}</select></label><button onClick={() => { setQuery(''); setCategory(''); }}>Reset filters</button></section>
    <p role="status" aria-live="polite" className="cp-result-count">{results.length} of {services.length} service families</p>
    {categories.filter(value => !category || value === category).map(value => { const items = results.filter(item => item.category === value); return items.length ? <section className="sp-category" key={value} aria-label={value}><h2>{value}</h2>{value === 'Internships' && <p>Internship participation is free. Leadership selection and optional portfolio support have separate conditions; current placements are not confirmed here.</p>}<div className="sp-grid">{items.map(service => <ServiceCard key={service.id} service={service} />)}</div></section> : null; })}
    {!results.length && <p className="cp-empty">No services match. Try another term or reset the filters.</p>}
    <section id="access-options" className="cp-callout"><h2>Free options, sliding scale & fee waivers</h2><p>Each service lists its documented free or reduced-cost options. Eligibility may include students, active interns, low-income or unemployed people, single parents and caregivers, seniors, veterans, adult learners, agency referrals and community organizations, depending on the service.</p><p>Ask about access when making an initial inquiry. Describe your goal and the type of support needed; do not email sensitive documents. Review depends on need, service availability, licensing and capacity. A request does not establish approval, a discount or a funded place.</p><p>Email buttons open an editable draft to the existing company contact, <strong>admin@theemersonempire.info</strong>, with the selected company and service. You review and send it in your email app. No request is sent by this website. Online applications, class registration and live document intake remain closed.</p></section>
    <ServiceQualifications entity={entity} />
    <section className="cp-intro"><h2>Find the right Emerson company</h2><div className="cp-grid">{(Object.keys(serviceCompanies) as ServiceCompany[]).filter(value => value !== entity).map(value => <article className="cp-card" id={value === 'TEA' ? 'emerson-agency' : value.toLowerCase()} key={value}><h3>{serviceCompanies[value]}</h3><p>{value === 'TEA' ? 'Insurance education, tax readiness, financial organization and small-business support.' : value === 'EPDG' ? 'Free internships, career services, professional development and workforce training.' : 'Consultation, resource navigation, business direction, community education and partnerships.'}</p>{companyHref(value, '/services-pricing') ? <a href={companyHref(value, '/services-pricing')!}>View {value} services & pricing →</a> : <p>Company link unavailable.</p>}</article>)}</div></section>
  </>;
}
function ServiceQualifications({ entity }: { entity: ServiceCompany }) {
  return <section className="cp-callout"><h2>Service qualifications & outside referrals</h2>{entity === 'TEA' && <><p>Insurance services depend on licensing, state requirements, carrier availability, underwriting and product suitability. Tax services depend on document review, eligibility, applicable rules and capacity. Educational guidance does not replace specialized legal or accounting advice.</p><p>Financial education does not guarantee credit improvement, debt reduction, insurance approval, tax outcomes, revenue or income.</p></>}{entity !== 'TEA' && <p>Career support, classes and internships do not guarantee employment, income, promotion, admission, academic credit or professional outcomes. Completion documentation depends on participation and requirements; academic credit requires the relevant institution’s approval.</p>}<p>Referrals to outside public programs do not establish Emerson provider approval, a funding contract, partnership or eligibility. The responsible agency decides eligibility and availability.</p><ul><li><a href="https://www.irs.gov/individuals/free-tax-return-preparation-for-qualifying-taxpayers" target="_blank" rel="noreferrer">IRS VITA/TCE eligibility and local tax-help sites</a></li><li><a href="https://www.irs.gov/e-file-do-your-taxes-for-free" target="_blank" rel="noreferrer">IRS Free File options and current partner conditions</a></li><li><a href="https://studentaid.gov/understand-aid/types/grants/pell" target="_blank" rel="noreferrer">Federal Student Aid: Pell Grant information</a></li><li><a href="https://scworks.org/jobseeker" target="_blank" rel="noreferrer">SC Works jobseeker information</a></li><li><a href="https://www.sba.gov/counseling/local-assistance/" target="_blank" rel="noreferrer">SBA local assistance, including SBDC and SCORE</a></li></ul><p className="cp-small">Official referral pages checked October 18, 2026. No current dollar threshold, award amount or open application window is asserted here.</p></section>;
}
