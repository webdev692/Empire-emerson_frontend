import { useMemo, useRef, useState } from 'react';
import { Badge } from '../../../shared/PlatformUI';
import sourceData from '../data/sc-community.local.json';
import { filterSCRecords, initialSCFilters, scField, validateSCDataset } from '../data/scCommunityModel';
import type { SCDataset, SCFilters, SCRecord } from '../data/scCommunityModel';
import './SCCommunityDirectory.css';

const pageSize = 12;
function SourceLinks({ record }: { record: SCRecord }) {
  return <><p className="cp-small"><strong>Source-reported check:</strong> {record.sourceCheckedOn ? <time dateTime={record.sourceCheckedOn}>{record.sourceCheckedOn}</time> : record.sourceCheckedRaw ? `Unresolved source value ${record.sourceCheckedRaw}; calendar date not established` : 'No separate check date supplied; archive edition October 10, 2026'}. Live availability has not been confirmed by this import.</p>
    {record.sourceUrls.length ? <ul className="sc-source-links">{record.sourceUrls.map(url => <li key={url}><a href={url} target="_blank" rel="noreferrer">{url}<span className="sc-sr-only"> (source for {record.id}; opens in a new tab)</span></a></li>)}</ul> : <p className="sc-caution">Public source link not supplied. Confirm the provider before acting.</p>}
    {record.linkNotes.map(note => <p key={note} className="sc-caution">{note}</p>)}</>;
}
function ResourceCard({ record }: { record: SCRecord }) {
  return <article id={record.id} className="cp-card sc-resource-card">
    <div className="cp-meta"><Badge>{record.id}</Badge><Badge>{record.kind === 'archive' ? 'Archive · reconfirm before referral' : 'SC11 master listing'}</Badge></div>
    <h3>{record.title}</h3><p className="sc-resource-area">{record.need} · {record.serviceArea}</p>
    {record.warnings.map(warning => <p key={warning} className="sc-caution"><strong>{warning}</strong></p>)}
    <dl>
      <div><dt>Who may qualify / access</dt><dd>{scField(record, 'Who may qualify', 'Access')}</dd></div>
      <div><dt>Cost / payment</dt><dd>{scField(record, 'Cost / payment', 'Status / cost')}</dd></div>
      <div><dt>Published hours / dates</dt><dd>{scField(record, 'Published hours / dates', 'Recorded schedule')}</dd></div>
      <div><dt>Public contact supplied</dt><dd>{scField(record, 'Public contact', 'Telephone / contact')}</dd></div>
    </dl>
    <p className="sc-caution"><strong>Before taking action:</strong> {scField(record, 'Important caveat', 'Before referral')}</p>
    <details className="sc-record-details"><summary>Access, requirements & source details for {record.id}</summary>
      <dl>{record.details.map((field, index) => <div key={`${field.label}-${index}`}><dt>{field.label}</dt><dd>{field.value}</dd></div>)}</dl>
      {record.notes.map(note => <p key={note} className="cp-small">{note}</p>)}
      <SourceLinks record={record} />
    </details>
  </article>;
}
function CountyRouting({ records }: { records: SCRecord[] }) {
  const [county, setCounty] = useState('');
  const row = records.find(record => record.id === county);
  return <section className="sc-county cp-callout" aria-labelledby="sc-county-title">
    <h3 id="sc-county-title">County energy-assistance contacts</h3>
    <p>Find the supplied LIHEAP and weatherization routing contacts for all {records.length} counties. These contacts do not confirm funding, appointments or eligibility.</p>
    <label>Choose a county<select value={county} onChange={event => setCounty(event.target.value)}><option value="">Select a county</option>{records.map(record => <option key={record.id} value={record.id}>{record.title}</option>)}</select></label>
    {row && <article className="sc-county-result" aria-live="polite"><h4>{row.title} County routing</h4><dl>{row.details.map((field, index) => <div key={`${field.label}-${index}`}><dt>{field.label}</dt><dd>{field.value}</dd></div>)}</dl>{row.notes.map(note => <p className="cp-small" key={note}>{note}</p>)}<SourceLinks record={row} /></article>}
  </section>;
}
function DirectoryRecords({ dataset }: { dataset: SCDataset }) {
  const [filters, setFilters] = useState(initialSCFilters);
  const [page, setPage] = useState(1);
  const resultsHeading = useRef<HTMLHeadingElement>(null);
  const scoped = useMemo(() => dataset.records.filter(row => filters.edition === 'all' || row.kind === filters.edition), [dataset.records, filters.edition]);
  const currentCount = dataset.records.filter(row => row.kind === 'current').length.toLocaleString();
  const archiveCount = dataset.records.filter(row => row.kind === 'archive').length.toLocaleString();
  const needs = useMemo(() => [...new Set(scoped.map(row => row.need))].sort(), [scoped]);
  const areas = useMemo(() => [...new Set(scoped.map(row => row.serviceArea))].sort(), [scoped]);
  const results = useMemo(() => filterSCRecords(dataset.records, filters), [dataset.records, filters]);
  const pageCount = Math.max(1, Math.ceil(results.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * pageSize;
  function changeFilter(field: keyof SCFilters, value: string) {
    setFilters(previous => ({ ...previous, [field]: value, ...(field === 'edition' ? { need: '', area: '' } : {}) }));
    setPage(1);
  }
  function changePage(next: number) { setPage(next); resultsHeading.current?.focus(); }
  return <>
    <section className="cp-filter sc-filter" aria-label="Filter South Carolina resources">
      <label className="sc-search">Search South Carolina resources<input type="search" value={filters.query} onChange={event => changeFilter('query', event.target.value)} placeholder="Need, provider, town, county or SC record ID" /></label>
      <label>Source collection<select value={filters.edition} onChange={event => changeFilter('edition', event.target.value)}><option value="current">SC11 master ({currentCount})</option><option value="archive">Preserved archive ({archiveCount})</option><option value="all">All source records ({dataset.records.length.toLocaleString()})</option></select></label>
      <label>Need (as supplied)<select value={filters.need} onChange={event => changeFilter('need', event.target.value)}><option value="">All needs</option>{needs.map(need => <option key={need}>{need}</option>)}</select></label>
      <label>Service area (as supplied)<select value={filters.area} onChange={event => changeFilter('area', event.target.value)}><option value="">All service areas</option>{areas.map(area => <option key={area}>{area}</option>)}</select></label>
      <button type="button" onClick={() => { setFilters(initialSCFilters); setPage(1); }}>Reset SC filters</button>
    </section>
    <p className="cp-small">Search matches the supplied text. A county or town mention does not establish household eligibility. Source dates and schedules may require reconfirmation; archive entries are retained research, not confirmed current offers.</p>
    <h3 tabIndex={-1} ref={resultsHeading} className="sc-results-heading">South Carolina results</h3>
    <p role="status" aria-live="polite" aria-atomic="true" className="cp-result-count">{results.length ? `Showing ${start + 1}–${Math.min(start + pageSize, results.length)} of ${results.length.toLocaleString()} SC listings · Page ${currentPage} of ${pageCount}` : 'No SC listings match these filters.'}</p>
    {results.length ? <div className="cp-grid sc-resource-grid">{results.slice(start, start + pageSize).map(row => <ResourceCard key={row.id} record={row} />)}</div> : <div className="cp-empty"><p>Try a different need or location, include the archive, or reset the SC filters.</p></div>}
    {pageCount > 1 && <nav className="sc-pagination" aria-label="South Carolina results pages"><button type="button" disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)}>Previous SC page</button><span>Page {currentPage} of {pageCount}</span><button type="button" disabled={currentPage === pageCount} onClick={() => changePage(currentPage + 1)}>Next SC page</button></nav>}
  </>;
}
export default function SCCommunityDirectory({ dataset }: { dataset?: SCDataset }) {
  let collection: SCDataset;
  try { collection = validateSCDataset(dataset || sourceData); }
  catch { return <section id="south-carolina-resources" className="sc-community"><h2>South Carolina community resources</h2><div className="cp-empty" role="alert"><p>The SC directory could not be loaded. The existing resource collection remains available above.</p></div></section>; }
  return <section id="south-carolina-resources" className="sc-community" aria-labelledby="sc-community-title">
    <div className="sc-intro"><p className="cp-eyebrow">South Carolina · source directory</p><h2 id="sc-community-title">South Carolina community resources</h2>
      <p>Explore {collection.records.length.toLocaleString()} supplied listings: {collection.records.filter(row => row.kind === 'current').length.toLocaleString()} SC11 master records and {collection.records.filter(row => row.kind === 'archive').length.toLocaleString()} preserved archive records, plus energy-assistance routing for all {collection.countyRoutes.length} counties.</p>
      <p>Find food, housing, utilities, health, employment, seasonal activities and other community services. Read each listing’s eligibility, costs, dates and cautions before contacting the provider.</p>
      <p className="cp-small">Source: The Emerson Empire South Carolina Community Resource Directory, complete SC11 edition, October 16, 2026. Check dates are reported by that directory; this import is not a new live availability check. Providers determine eligibility and capacity. Listings do not guarantee assistance or imply an Emerson partnership. Some services charge fees.</p>
    </div>
    <CountyRouting records={collection.countyRoutes} />
    <DirectoryRecords dataset={collection} />
    <p className="sc-back"><a href="#tee-resource-collection">Back to existing resource collection ↑</a></p>
  </section>;
}
