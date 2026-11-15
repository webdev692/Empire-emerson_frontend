import { useState } from 'react';
import { InquiryPanel } from '../../shared/PublicDesignSystem';
import catalog from '../../shared/services-catalog.public.json';
import { contactMailboxes } from '../../shared/public-intake';
const pricingGuide = '/guides/The_Emerson_Agency_Customer_Service_and_Pricing_Guide.pdf';
const inquiryHref = `mailto:${contactMailboxes.sales}?subject=The%20Emerson%20Agency%20service%20inquiry&body=I%20would%20like%20information%20about%3A%20%0A%0AMy%20general%20goal%3A%20%0A%0APlease%20do%20not%20include%20tax%20returns%2C%20account%20numbers%2C%20identity%20documents%20or%20other%20sensitive%20records.`;
const serviceFamilies = [
  { number: '01', title: 'Tax preparation', path: '/tax-preparation', text: 'Document readiness, tax preparation inquiries, and clear next steps for individuals and small businesses.' },
  { number: '02', title: 'Insurance education', path: '/insurance', text: 'Understand policy language, organize questions, and learn what to verify before choosing professional insurance services.' },
  { number: '03', title: 'Financial coaching', path: '/financial-coaching', text: 'Make space for practical conversations about household organization, financial habits, credit, and debt.' },
  { number: '04', title: 'Small business services', path: '/small-business', text: 'Bring structure to business records, financial administration, and the next steps of entrepreneurship.' },
];

export function ServicesOverview() {
  return <div className="agency-service-list">{serviceFamilies.map(service => <article key={service.path}>
    <span className="agency-number" aria-hidden="true">{service.number}</span>
    <div><h3><a href={service.path}>{service.title}</a></h3><p>{service.text}</p></div>
    <a className="agency-service-arrow" href={service.path} aria-label={`Explore ${service.title}`}>↗</a>
  </article>)}</div>;
}

export function ServiceEstimates({ ids }: { ids: string[] }) {
  const services = catalog.services.filter(service => ids.includes(service.id));
  return <div className="agency-estimates">
    <p className="agency-source-note">Planning estimates from the customer service guide prepared May 2026. Final scope, current availability, and price must be confirmed before work begins. The guide uses the $ symbol without specifying a currency code.</p>
    <div className="agency-table-scroll" role="region" aria-label="Service planning estimates" tabIndex={0}>
      <table><caption>Published service estimates and access conditions</caption><thead><tr><th scope="col">Service</th><th scope="col">Planning estimate</th><th scope="col">Access conditions</th></tr></thead><tbody>
        {services.map(service => <tr key={service.id}><th scope="row">{service.name}</th><td><ul>{service.options.map(option => <li key={option.label}>{option.label}: <strong>{option.price}</strong></li>)}</ul></td><td>{service.access}</td></tr>)}
      </tbody></table>
    </div>
    <p><a className="modern-inline-link" href={pricingGuide}>Read the complete May 2026 service and pricing guide (PDF)</a></p>
  </div>;
}

export function ContactPanel({ title = 'Start with a conversation.' }: { title?: string }) {
  return <InquiryPanel title={title}>
    <p>Tell us the type of support you are looking for and your general goal. We can clarify availability, scope, fees, and the appropriate next step.</p>
    <a className="modern-button" href={inquiryHref}>Write a service inquiry</a>
    <p className="agency-source-note">Your email app opens an editable draft to {contactMailboxes.sales}. Keep Social Security numbers, tax returns, bank details, medical information, and insurance documents out of an initial inquiry.</p>
  </InquiryPanel>;
}

const resources = [
  { title: 'Find free tax preparation', provider: 'Internal Revenue Service', category: 'Taxes', href: 'https://www.irs.gov/individuals/free-tax-return-preparation-for-qualifying-taxpayers', description: 'Explore VITA and TCE assistance, provider eligibility, and what to prepare for an appointment.' },
  { title: 'Explore free electronic filing', provider: 'Internal Revenue Service', category: 'Taxes', href: 'https://www.irs.gov/e-file-do-your-taxes-for-free', description: 'Review current free filing options directly with the IRS. Program availability and eligibility vary.' },
  { title: 'Choose a tax professional', provider: 'Internal Revenue Service', category: 'Taxes', href: 'https://www.irs.gov/tax-professionals/choosing-a-tax-professional', description: 'Understand preparer credentials, questions to ask, and the importance of reviewing a return before signing.' },
  { title: 'Consumer financial tools', provider: 'Consumer Financial Protection Bureau', category: 'Household finances', href: 'https://www.consumerfinance.gov/consumer-tools/', description: 'Find explanations of financial products and practical information about credit, debt, banking, and major financial decisions.' },
  { title: 'Insurance consumer assistance', provider: 'South Carolina Department of Insurance', category: 'Insurance', href: 'https://doi.sc.gov/8/Consumers', description: 'Find official consumer education, help with insurance questions, and information about the complaint process.' },
  { title: 'Verify an insurance professional', provider: 'South Carolina Department of Insurance', category: 'Insurance', href: 'https://online.doi.sc.gov/Eng/Public/Common/OnlineServices.aspx', description: 'Use the official Licensee Lookup link to check an individual or business before arranging regulated services.' },
  { title: 'Find local business assistance', provider: 'U.S. Small Business Administration', category: 'Small business', href: 'https://www.sba.gov/counseling/local-assistance/', description: 'Find local assistance, including Small Business Development Centers and SCORE, and check each provider’s services.' },
  { title: 'Community resources in South Carolina', provider: 'The Emerson Empire', category: 'Community', href: 'https://theemerson.netlify.app/community-resources', description: 'Explore the Emerson ecosystem’s directory for practical support and community resource navigation.' },
  { title: 'Classes and professional learning', provider: 'Emerson Professional Development Group', category: 'Community', href: 'https://emersonprofessionaldevelopment.netlify.app/classes', description: 'Explore classes, learning formats, and registration information through the education organization in the Emerson ecosystem.' },
];

export function FinancialResourceDirectory() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All topics');
  const categories = ['All topics', ...new Set(resources.map(resource => resource.category))];
  const visible = resources.filter(resource => (category === 'All topics' || resource.category === category) && `${resource.title} ${resource.provider} ${resource.description}`.toLowerCase().includes(query.toLowerCase().trim()));
  return <>
    <div className="agency-directory-controls">
      <label htmlFor="agency-resource-search">Search resources<input id="agency-resource-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Try taxes, credit, or insurance" /></label>
      <label htmlFor="agency-resource-category">Topic<select id="agency-resource-category" value={category} onChange={event => setCategory(event.target.value)}>{categories.map(item => <option key={item}>{item}</option>)}</select></label>
    </div>
    <p aria-live="polite" role="status">{visible.length} {visible.length === 1 ? 'resource' : 'resources'}</p>
    <div className="agency-resource-list">{visible.map(resource => <article key={resource.href}><p className="modern-kicker">{resource.category} · {resource.provider}</p><h3><a href={resource.href}>{resource.title} <span aria-hidden="true">↗</span></a></h3><p>{resource.description}</p></article>)}</div>
    {!visible.length && <p>No resources match these filters. <button className="modern-button-secondary" onClick={() => { setQuery(''); setCategory('All topics'); }}>Clear filters</button></p>}
    <p className="agency-source-note">External providers determine their own eligibility, availability, fees, and privacy practices. A resource link does not indicate an organizational partnership or endorsement. Official resource pages checked November 14, 2026.</p>
  </>;
}
