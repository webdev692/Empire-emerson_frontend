import { useMemo, useRef, useState } from 'react';
import learningData from '../data/free-learning.local.json';
import { Badge } from '../../../shared/PlatformUI';
import { CREDENTIAL_LABELS, DEFAULT_LEARNING_FILTERS, PROVIDER_NAMES, effectiveAvailability, filterLearningResources, validateFreeLearningDataset } from '../data/epdgFreeLearningModel';
import type { FreeLearningDataset, LearningFilters, LearningResource } from '../data/epdgFreeLearningModel';
import './FreeLearningLibrary.css';

const PAGE_SIZE=12;
const fieldLabels: Record<keyof LearningFilters,string>={query:'Search',provider:'Provider',category:'Category',credential:'Credential',ce:'CE / CEU',eligibility:'Eligibility',language:'Language',duration:'Duration',selfPaced:'Self-paced',availability:'Availability'};
const valueLabels:Record<string,string>={public:'Public access',all:'Include restricted eligibility',restricted:'Restricted only',active:'Active / current',archived:'Archived',any:'Any',yes:'Yes',no:'No',unknown:'Not stated',under60:'Under 1 hour','60to240':'1–4 hours',over240:'Over 4 hours'};
function FreeLearningCard({record,today,parent}:{record:LearningResource;today:string;parent?:LearningResource}) {
  const status=effectiveAvailability(record,today);
  return <article className="cp-card epdg-learning-card">
    <div className="cp-meta"><Badge>Free</Badge><Badge>{PROVIDER_NAMES[record.providerId]}</Badge><Badge>{status==='active'?'Current source listing':status==='expired'?'Archived':status==='upcoming'?'Upcoming':'Availability not verified'}</Badge></div>
    <h3>{record.title}</h3>
    <p className="cp-small">{record.provider}{record.externalId&&<> · {record.externalId}</>}</p>
    <p>{record.description?(record.description.length>360?`${record.description.slice(0,360).replace(/\s+\S*$/,'')}…`:record.description):'Description not supplied. Read the official resource for its full scope and requirements.'}</p>
    <p className="epdg-learning-credential">{record.credentialLabel||'Credential not verified'}</p>
    <div className={`epdg-learning-eligibility${record.restricted?' epdg-learning-restricted':''}`}><strong>{record.restricted?'Restricted eligibility':'Audience & eligibility'}</strong><p>{record.eligibility}</p></div>
    {record.accessNotes.length>0&&<ul className="epdg-learning-access">{record.accessNotes.map(note=><li key={note}>{note}</li>)}</ul>}
    <dl className="epdg-learning-summary"><div><dt>Duration</dt><dd>{record.duration||'Not stated'}</dd></div><div><dt>Language</dt><dd>{record.language}</dd></div><div><dt>Delivery</dt><dd>{record.delivery||'Not stated'}</dd></div><div><dt>CE / CEU</dt><dd>{record.ceu!==null?`${record.ceu} CEUs`:record.ceDetails||'Not stated'}{record.ceu!==null&&record.ceDetails&&<> · {record.ceDetails}</>}</dd></div></dl>
    <details className="epdg-learning-details"><summary>Program, credential & source details</summary><dl>
      {record.description&&record.description.length>360&&<div><dt>Full supplied description</dt><dd>{record.description}</dd></div>}
      <div><dt>Program</dt><dd>{record.program||'Not stated'}</dd></div><div><dt>Category</dt><dd>{record.category}</dd></div><div><dt>Resource type</dt><dd>{record.resourceType}</dd></div>
      {record.parentId&&<div><dt>Parent journey / excursion</dt><dd>{parent?<a href={parent.url} target="_blank" rel="noreferrer">{parent.title} (opens in a new tab)</a>:record.parentId}</dd></div>}
      {record.subjects.length>0&&<div><dt>Subjects, products & roles</dt><dd>{record.subjects.join(' · ')}</dd></div>}
      <div><dt>Credential details</dt><dd>{record.credentialDetails||'Not verified; check the provider before planning around a credential.'}</dd></div>
      <div><dt>Prerequisites</dt><dd>{record.prerequisites||'Not stated'}</dd></div><div><dt>Enrollment deadline</dt><dd>{record.enrollmentDeadline||'Not stated'}</dd></div>
      <div><dt>Enrollment status</dt><dd>{record.enrollmentStatus||'Check the provider for current enrollment and completion terms.'}</dd></div><div><dt>Course code / skill level</dt><dd>{[record.courseCode,record.skillLevel].filter(Boolean).join(' · ')||'Not stated'}</dd></div>
      <div><dt>Dates</dt><dd>{record.startDate||'Start not stated'} · {record.endDate||'End not stated'} · Expires: {record.expirationDate||'Not stated'}</dd></div>
      <div><dt>CE window</dt><dd>{record.ceStartDate||'Start not stated'} – {record.ceEndDate||'End not stated'}</dd></div><div><dt>Episodes</dt><dd>{record.episodes||'Not stated'}</dd></div>
      <div><dt>Released</dt><dd>{record.publishedAt||'Not stated'}</dd></div><div><dt>Provider update</dt><dd>{record.sourceUpdatedAt||'Not stated'}</dd></div>
      <div><dt>Source checked</dt><dd>{record.verifiedOn?<time dateTime={record.verifiedOn}>{record.verifiedOn}</time>:'No live source check recorded'}</dd></div>
      {record.packageVerifiedOn&&<div><dt>Package source date</dt><dd>{record.packageVerifiedOn} · separate from live verification</dd></div>}
    </dl>
      {record.relatedResources.length>0&&<><p><strong>Related self-study materials</strong></p><ul>{record.relatedResources.map(item=><li key={`${item.url}-${item.title}`}><a href={item.url} target="_blank" rel="noreferrer">{item.title} <span className="cp-small">({item.type}; opens in a new tab)</span></a></li>)}</ul></>}
      {record.externalDeliveryUrl&&<p><a href={record.externalDeliveryUrl} target="_blank" rel="noreferrer">Provider’s external delivery page (opens in a new tab)</a></p>}
      <p><strong>Official sources</strong></p><ul>{record.sourceUrls.map((url,index)=><li key={url}><a href={url} target="_blank" rel="noreferrer">Source {index+1} for {record.title} <span aria-hidden="true">↗</span></a></li>)}</ul>
    </details>
    {status==='expired'&&<p className="cp-small"><strong>Archived:</strong> the recorded enrollment window has closed. This is a reference link.</p>}
    {status==='unknown'&&<p className="cp-small">Current enrollment is not verified. Check the official schedule.</p>}
    <p className="cp-small">Source checked: {record.verifiedOn||'Not recorded'}</p>
    <a className="cp-text-link epdg-learning-link" href={record.url} target="_blank" rel="noreferrer" aria-label={`${record.linkScope==='program'?'Open provider program':record.linkScope==='catalog'?'Open official catalog':'View official resource'} for ${record.title} (opens in a new tab)`}>{record.linkScope==='program'?'Open provider program':record.linkScope==='catalog'?'Open official catalog':'View official resource'} <span aria-hidden="true">↗</span></a>
    {record.linkScope!=='resource'&&<p className="cp-small">This source links to the {record.linkScope}; find this named item there.</p>}
  </article>;
}

function LearningCollection({dataset,today}:{dataset:FreeLearningDataset;today:string}){
  const [filters,setFilters]=useState({...DEFAULT_LEARNING_FILTERS});const [page,setPage]=useState(1);const heading=useRef<HTMLHeadingElement>(null);
  const records=useMemo(()=>dataset.records.toSorted((a,b)=>a.title.localeCompare(b.title,'en',{sensitivity:'base'})||a.id.localeCompare(b.id)),[dataset.records]);
  const parentRecords=useMemo(()=>new Map(records.filter(r=>r.externalId).map(r=>[`${r.providerId}:${r.externalId}`,r])),[records]);
  const categories=useMemo(()=>[...new Set(records.map(r=>r.category))].sort(),[records]);
  const languages=useMemo(()=>[...new Set(records.map(r=>r.language))].sort(),[records]);
  const shown=useMemo(()=>filterLearningResources(records,filters,today),[records,filters,today]);
  const pageCount=Math.max(1,Math.ceil(shown.length/PAGE_SIZE));const currentPage=Math.min(page,pageCount);const start=(currentPage-1)*PAGE_SIZE;
  function change(field:keyof LearningFilters,value:string){setFilters(previous=>({...previous,[field]:value}));setPage(1);}
  function changePage(value:number){setPage(value);heading.current?.focus();}
  const activeFields=(Object.keys(filters) as (keyof LearningFilters)[]).filter(key=>filters[key]!==DEFAULT_LEARNING_FILTERS[key]);
  const providerCount=Object.entries(PROVIDER_NAMES).map(([id,name])=>({id,name,count:records.filter(r=>r.providerId===id&&r.costStatus==='verified-free').length}));
  return <>
    <section className="cp-filter epdg-learning-filter" aria-label="Filter free learning resources">
      <label className="epdg-learning-search">Search free learning<input type="search" value={filters.query} onChange={e=>change('query',e.target.value)} placeholder="Title, provider, topic or course code" /></label>
      <label>Provider<select value={filters.provider} onChange={e=>change('provider',e.target.value)}><option value="">All providers</option>{providerCount.map(p=><option key={p.id} value={p.id}>{p.name} ({p.count.toLocaleString()} verified free)</option>)}</select></label>
      <label>Category<select value={filters.category} onChange={e=>change('category',e.target.value)}><option value="">All categories</option>{categories.map(c=><option key={c}>{c}</option>)}</select></label>
      <label>Credential<select value={filters.credential} onChange={e=>change('credential',e.target.value)}><option value="">All credential labels</option>{CREDENTIAL_LABELS.map(c=><option key={c}>{c}</option>)}</select></label>
      <label>CE / CEU<select value={filters.ce} onChange={e=>change('ce',e.target.value)}><option value="">Any CE status</option><option value="yes">CE / CEU listed</option><option value="no">No CE / CEU</option><option value="unknown">Not stated</option></select></label>
      <label>Eligibility<select value={filters.eligibility} onChange={e=>change('eligibility',e.target.value)}><option value="public">Public access</option><option value="all">Include restricted eligibility</option><option value="restricted">Restricted only</option></select></label>
      <label>Language<select value={filters.language} onChange={e=>change('language',e.target.value)}><option value="">All languages</option>{languages.map(language=><option key={language}>{language}</option>)}</select></label>
      <label>Duration<select value={filters.duration} onChange={e=>change('duration',e.target.value)}><option value="">Any duration</option><option value="under60">Under 1 hour</option><option value="60to240">1–4 hours</option><option value="over240">Over 4 hours</option><option value="unknown">Not stated / varies</option></select></label>
      <label>Self-paced<select value={filters.selfPaced} onChange={e=>change('selfPaced',e.target.value)}><option value="">Any delivery pace</option><option value="yes">Self-paced</option><option value="no">Instructor-led / scheduled</option><option value="unknown">Not stated</option></select></label>
      <label>Availability<select value={filters.availability} onChange={e=>change('availability',e.target.value)}><option value="active">Active / current</option><option value="archived">Archived</option><option value="all">All recorded availability</option></select></label>
      <button type="button" onClick={()=>{setFilters({...DEFAULT_LEARNING_FILTERS});setPage(1);}}>Reset free-learning filters</button>
    </section>
    {activeFields.length>0&&<nav className="epdg-learning-chips" aria-label="Active free-learning filters">{activeFields.map(field=><button type="button" key={field} onClick={()=>change(field,DEFAULT_LEARNING_FILTERS[field])} aria-label={`Remove ${fieldLabels[field]} filter`}>{fieldLabels[field]}: {field==='provider'?PROVIDER_NAMES[filters[field] as keyof typeof PROVIDER_NAMES]:field==='availability'&&filters[field]==='all'?'All recorded availability':valueLabels[filters[field]]||filters[field]} <span aria-hidden="true">×</span></button>)}</nav>}
    <h3 className="epdg-learning-result-heading" tabIndex={-1} ref={heading}>Free-learning results</h3>
    <p className="cp-result-count" role="status" aria-live="polite" aria-atomic="true">{shown.length?`Showing ${start+1}–${Math.min(start+PAGE_SIZE,shown.length)} of ${shown.length.toLocaleString()} resources · Page ${currentPage} of ${pageCount}`:'No verified free resources match these filters.'}</p>
    {shown.length?<div className="cp-grid">{shown.slice(start,start+PAGE_SIZE).map(record=><FreeLearningCard key={record.id} record={record} today={today} parent={record.parentId?parentRecords.get(`${record.providerId}:${record.parentId}`):undefined}/>)}</div>:<div className="cp-empty"><p>Try fewer filters or reset. Unknown prices, trials, paid subscriptions and audit-only access never enter these results.</p></div>}
    {shown.length>PAGE_SIZE&&<nav className="epdg-learning-pagination" aria-label="Free-learning result pages"><button type="button" disabled={currentPage===1} onClick={()=>changePage(currentPage-1)}>Previous free-learning page</button><span>Page {currentPage} of {pageCount}</span><button type="button" disabled={currentPage===pageCount} onClick={()=>changePage(currentPage+1)}>Next free-learning page</button></nav>}
    <details className="epdg-learning-coverage"><summary>Catalog coverage & source checks</summary><p>Counts describe the records reviewed for this collection. A source may have additional offerings behind sign-in or with unresolved terms. An unknown price never means free.</p><div className="cp-grid">{dataset.providers.map(provider=><article className="cp-card" key={provider.id}><h3>{provider.name}</h3><p className="cp-small">{provider.status==='complete'?'Public catalog enumeration complete':provider.status==='partial'?'Partial public catalog':'Catalog access limited'} · Checked {provider.checkedOn}</p><p>{provider.summary}</p><p className="cp-small">{records.filter(r=>r.providerId===provider.id).length.toLocaleString()} records retained; {records.filter(r=>r.providerId===provider.id&&r.costStatus!=='verified-free').length.toLocaleString()} awaiting current $0 verification.</p><a href={provider.catalogUrl} target="_blank" rel="noreferrer">Open {provider.name} catalog <span aria-hidden="true">↗</span></a></article>)}</div></details>
  </>;
}

export default function FreeLearningLibrary({dataset,today=new Date().toISOString().slice(0,10)}:{dataset?:FreeLearningDataset;today?:string}){
  let collection:FreeLearningDataset;
  try{collection=validateFreeLearningDataset(dataset||learningData);}catch{return <section className="epdg-free-learning" id="free-learning" aria-labelledby="epdg-free-learning-title"><h2 id="epdg-free-learning-title">Free Learning & Credentials</h2><p role="alert">The free-learning collection could not be loaded. The existing resource collections remain available.</p></section>;}
  return <section className="epdg-free-learning" id="free-learning" aria-labelledby="epdg-free-learning-title">
    <div className="epdg-learning-intro"><p className="cp-eyebrow">Third-party learning library</p><h2 id="epdg-free-learning-title">Free Learning & Credentials</h2><p>Find learning with verified $0 required access. Start with current public offerings, or enable restricted eligibility and archived records. Registration, prerequisites, equipment and credential conditions remain the provider’s terms.</p><p><strong>EPDG curates links to third-party learning resources. Listing does not imply provider endorsement of or affiliation with EPDG.</strong></p><p className="cp-small">Paid courses, trials, subscription-required learning and audit-only offers are excluded from the free results. Optional professional exams, instructor delivery and licensed tools are identified separately. Source checks describe the date inspected, not guaranteed future availability. All provider links open in a new tab.</p><p className="cp-small">FDIC materials remain attributed to FDIC. Their inclusion does not imply FDIC endorsement of EPDG or of any organization, product or service.</p></div>
    <LearningCollection dataset={collection} today={today}/>
    <p className="epdg-learning-back"><a href="#epdg-resource-collection">Back to learning & support resources ↑</a> · <a href="#colleges-universities">Colleges & Universities ↓</a></p>
  </section>;
}
