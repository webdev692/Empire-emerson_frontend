import { useMemo, useRef, useState } from 'react';
import { Badge } from '../../../shared/PlatformUI';
import directoryData from '../data/institutions.local.json';
import { filterInstitutions, getInstitutionFilters, locationLabel, validateDirectoryDataset } from '../data/epdgInstitutionModel';
import type { DirectoryDataset, InstitutionRecord } from '../data/epdgInstitutionModel';
import './CollegesDirectory.css';

const pageSize = 12;
const emptyFilters = { query: '', country: '', region: '', type: '', review: 'all' as 'all' | 'needs-review' | 'source-checked' };
const fieldLabels: Record<string, string> = {
  institutionType: 'institution type', city: 'city', region: 'state / province', country: 'country',
  officialUrl: 'website', sourceUrl: 'source link', sourceCheckedAt: 'source check date',
};
const reasonLabels: Record<string, string> = {
  'source-check-missing': 'Source check is not recorded.',
  'official-url-missing': 'An institution website is not supplied.',
  'source-url-missing': 'A public source link is not supplied.',
  'identity-incomplete': 'Institution identity needs more information.',
  'identity-conflict': 'Source details need to be reconciled.',
  'ambiguous-identity': 'Institution identity needs to be confirmed.',
  'source-review-hold': 'The supplied source marks this record for review.',
};

function CollegeCard({ institution }: { institution: InstitutionRecord }) {
  const checkedDate = institution.sourceCheckedAt?.slice(0, 10);
  return <article className="cp-card epdg-college-card">
    <div className="cp-meta"><Badge>{institution.reviewStatus === 'source-checked' ? 'Source checked' : 'Needs review'}</Badge>{institution.institutionType && <Badge>{institution.institutionType}</Badge>}</div>
    <h3>{institution.name}</h3>
    {institution.alternateNames.length > 0 && <p className="cp-small">Also listed as: {institution.alternateNames.join(' · ')}</p>}
    <p className="epdg-college-location">{locationLabel(institution) || 'Location not supplied'}</p>
    <dl>
      <div><dt>Institution type</dt><dd>{institution.institutionType || 'Not supplied'}</dd></div>
      {institution.streetAddress && <div><dt>Street address</dt><dd>{institution.streetAddress}</dd></div>}
      {institution.postalCode && <div><dt>Postal code</dt><dd>{institution.postalCode}</dd></div>}
      {institution.campus && <div><dt>Campus</dt><dd>{institution.campus}</dd></div>}
      {institution.program && <div><dt>Program</dt><dd>{institution.program}</dd></div>}
      {institution.sourceVerificationStatus && <div><dt>Source review status</dt><dd>{institution.sourceVerificationStatus === 'partially-verified' ? 'Source partly verified; review required' : 'Review required'}</dd></div>}
      <div><dt>Source check date</dt><dd>{checkedDate ? <time dateTime={checkedDate}>{checkedDate}</time> : 'Not recorded'}</dd></div>
    </dl>
    {institution.missingFields.length > 0 && <p className="cp-small epdg-college-missing"><strong>Not supplied:</strong> {institution.missingFields.map(field => fieldLabels[field] || field).join(', ')}.</p>}
    {institution.reviewReasons.length > 0 && <details className="epdg-college-review"><summary>Review notes ({institution.reviewReasons.length})</summary><ul>{institution.reviewReasons.map(reason => <li key={reason}>{reasonLabels[reason] || reason.replaceAll('-', ' ')}</li>)}</ul></details>}
    {institution.programInformation && <details className="epdg-college-review"><summary>Programs mentioned in source</summary><p>{institution.programInformation}</p><p className="cp-small">Check current offerings with the institution.</p></details>}
    <p className="cp-small epdg-college-source"><strong>Source:</strong> {institution.sourceLabel}<br />{institution.sourceLocator}</p>
    {institution.publicContacts.length > 0 && <div className="epdg-college-contacts"><p className="cp-small"><strong>Public institution contacts</strong></p><ul>{institution.publicContacts.map(contact => <li key={`${contact.label}-${contact.url}`}><a href={contact.url} {...(contact.kind === 'url' ? { target: '_blank', rel: 'noreferrer' } : {})} aria-label={`${contact.label} for ${institution.name}${contact.kind === 'url' ? ' (opens in a new tab)' : ''}`}>{contact.label}</a></li>)}</ul></div>}
    <div className="epdg-college-links">
      {institution.officialUrl ? <a href={institution.officialUrl} target="_blank" rel="noreferrer" aria-label={`Website supplied in source for ${institution.name} (opens in a new tab)`}>Website supplied in source <span aria-hidden="true">↗</span></a> : <span className="cp-small">Website not supplied</span>}
      {institution.sourceUrl ? <a href={institution.sourceUrl} target="_blank" rel="noreferrer" aria-label={`Source record for ${institution.name} (opens in a new tab)`}>Source record <span aria-hidden="true">↗</span></a> : <span className="cp-small">Public source link not supplied</span>}
    </div>
  </article>;
}

function DirectoryRecords({ dataset }: { dataset: DirectoryDataset }) {
  const [filters, setFilters] = useState(emptyFilters);
  const [page, setPage] = useState(1);
  const resultsHeading = useRef<HTMLHeadingElement>(null);
  const records = useMemo(() => dataset.records.toSorted((first, second) => first.name.localeCompare(second.name, 'en', { sensitivity: 'base' }) || first.id.localeCompare(second.id)), [dataset.records]);
  const choices = useMemo(() => getInstitutionFilters(records), [records]);
  const regions = useMemo(() => [...new Set(records.filter(record => !filters.country || record.country === filters.country).map(record => record.region).filter((region): region is string => !!region))].sort(), [records, filters.country]);
  const results = useMemo(() => filterInstitutions(records, filters), [records, filters]);
  const pageCount = Math.max(1, Math.ceil(results.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * pageSize;
  const shown = results.slice(start, start + pageSize);
  function changeFilter(field: keyof typeof filters, value: string) {
    setFilters(previous => ({ ...previous, [field]: value, ...(field === 'country' ? { region: '' } : {}) }));
    setPage(1);
  }
  function changePage(nextPage: number) {
    setPage(nextPage);
    resultsHeading.current?.focus();
  }
  return <>
    <section className="cp-filter epdg-college-filter" aria-label="Filter colleges and universities">
      <label className="epdg-college-search">Search institutions<input type="search" value={filters.query} onChange={event => changeFilter('query', event.target.value)} placeholder="Institution name, location or type" /></label>
      <label>Country<select value={filters.country} onChange={event => changeFilter('country', event.target.value)}><option value="">All countries</option>{choices.countries.map(country => <option key={country}>{country}</option>)}</select></label>
      <label>State / province<select value={filters.region} onChange={event => changeFilter('region', event.target.value)}><option value="">All states / provinces</option>{regions.map(region => <option key={region}>{region}</option>)}</select></label>
      <label>Institution type<select value={filters.type} onChange={event => changeFilter('type', event.target.value)}><option value="">All institution types</option>{choices.types.map(type => <option key={type}>{type}</option>)}</select></label>
      <label>Review status<select value={filters.review} onChange={event => changeFilter('review', event.target.value)}><option value="all">All review statuses</option><option value="needs-review">Needs review</option><option value="source-checked">Source checked</option></select></label>
      <button type="button" onClick={() => { setFilters(emptyFilters); setPage(1); }}>Reset institution filters</button>
    </section>
    <h3 className="epdg-college-results" ref={resultsHeading} tabIndex={-1}>Institution results</h3>
    <p role="status" aria-live="polite" aria-atomic="true" className="cp-result-count">{results.length ? `Showing ${start + 1}–${start + shown.length} of ${results.length.toLocaleString()} institutions · Page ${currentPage} of ${pageCount}` : 'No institutions match these filters.'}</p>
    {shown.length ? <div className="cp-grid">{shown.map(institution => <CollegeCard key={institution.id} institution={institution} />)}</div> : <div className="cp-empty"><p>Try a different name, choose fewer filters or reset the institution filters to see the collection.</p></div>}
    {results.length > pageSize && <nav className="epdg-college-pagination" aria-label="Institution results pages"><button type="button" disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)}>Previous page</button><span>Page {currentPage} of {pageCount}</span><button type="button" disabled={currentPage === pageCount} onClick={() => changePage(currentPage + 1)}>Next page</button></nav>}
  </>;
}

export default function CollegesDirectory({ dataset }: { dataset?: DirectoryDataset }) {
  let collection: DirectoryDataset;
  try { collection = validateDirectoryDataset(dataset || directoryData); }
  catch { return <section className="epdg-colleges" id="colleges-universities" aria-labelledby="epdg-colleges-title"><h2 id="epdg-colleges-title">Colleges & Universities</h2><div className="cp-empty" role="alert"><p>The institution directory could not be loaded. The learning and support resources above remain available.</p></div></section>; }
  return <section className="epdg-colleges" id="colleges-universities" aria-labelledby="epdg-colleges-title">
    <div className="epdg-colleges-intro"><p className="cp-eyebrow">Institution directory</p><h2 id="epdg-colleges-title">Colleges & Universities</h2><p>Explore institution records from the supplied source collection. Check each institution’s official information for current programs, location, admission requirements, costs and financial aid.</p><p>Institutions set their own admissions requirements, tuition and financial-aid terms. Listings do not guarantee admission, scholarships or free tuition.</p><p className="cp-small">Listings do not establish an Emerson partnership. Supplied websites await source review. Missing information and review holds are shown with each record. Website and source links open in a new tab.</p></div>
    <p className="cp-small epdg-colleges-provenance">{collection.records.length.toLocaleString()} institution records · Imported <time dateTime={collection.importedAt}>{collection.importedAt.slice(0, 10)}</time>. Import dates describe this collection; source check dates are recorded separately for each institution.{collection.audit.heldRows > 0 && ` ${collection.audit.heldRows.toLocaleString()} source rows were held out for review.`}</p>
    {collection.records.length ? <DirectoryRecords dataset={collection} /> : <div className="cp-empty"><p>No institution records are available in this collection.</p></div>}
    <p className="epdg-college-back"><a href="#epdg-resource-collection">Back to learning & support resources ↑</a></p>
  </section>;
}
