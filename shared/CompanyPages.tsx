import type { Catalog, Entity, Program, Lesson, PublicPerson, ResearchWork, SourceProvenance } from './content';
import { Badge, Empty, Facts } from './PlatformUI';
import { contractHref, displayDate, localHref as href, readable } from './platform-format';
import LessonBody from './LessonBody';
import { companyHref } from './company-links';
import { publicRelease } from './development-preview';
import { legacyProgramOwner } from './three-programs-mode';
import ProgramExperience from './ThreeProgramsEntry';

const founderHref = () => {
  if (import.meta.env.MODE === 'protected-review') return companyHref('TEE', '/founder') || href('/leadership/lyric');
  if (import.meta.env.DEV) return 'http://127.0.0.1:5173/founder';
  try { const origin = new URL(import.meta.env.VITE_TEE_PUBLIC_ORIGIN); return origin.protocol === 'https:' && !origin.username && !origin.password && origin.pathname === '/' ? new URL('/founder',origin).href : null; } catch { return null; }
};
export function ProgramPages({ catalog, id, classTopics = [] }: { catalog: Catalog; id?: string; classTopics?: string[] }) {
  if (id) {
    const owner = legacyProgramOwner(id);
    if (owner) return <ProgramExperience entity={owner} view="referral" />;
    const program = catalog.programs.find(item => item.id === id);
    return program ? <ProgramDetail program={program} /> : <Empty title="Program information is unavailable.">This program may be awaiting review. <a href={href('/programs')}>Return to programs</a>.</Empty>;
  }
  return <><div className="cp-page-title"><p className="cp-eyebrow">Learn through guided practice</p><h1>Programs & free learning</h1><p>Each pathway has its own audience, geography and operating status. A curriculum catalog does not establish active sessions or open enrollment.</p></div>
    {catalog.programs.length ? <div className="cp-grid">{catalog.programs.map(program => legacyProgramOwner(program.id) ? <ProgramExperience key={program.id} entity={legacyProgramOwner(program.id)!} view="card" /> : <article className="cp-card" key={program.id}><Badge>{readable(program.operating_status)}</Badge><h2><a href={href(`/programs/${program.id}`)}>{program.title}</a></h2><p>{program.description}</p><p className="cp-small">Operator: {program.operator} · {program.geography}</p><p><strong>Free to participants, schools and communities.</strong></p><Badge>{readable(program.content_status)}</Badge></article>)}</div> : <Empty />}
    <section className="cp-intro"><h2>Class & workshop curriculum</h2><p>Free internship participation and independent learning resources are distinct from optional paid services and low-cost classes. Third-party costs are separate. No active class dates, capacity or registration are confirmed.</p>{classTopics.length ? <details><summary>Review {classTopics.length} draft curriculum topics</summary><ol>{classTopics.map(topic => <li key={topic}>{topic}</li>)}</ol></details> : <p>Reviewed curriculum topics will appear after approval.</p>}<p><a href={href('/classes')}>Explore the sourced class descriptions</a> or <a href={href('/services-pricing')}>compare documented services and planning estimates</a>.</p></section></>;
}
function ProgramDetail({ program }: { program: Program }) {
  const canEnroll = program.operating_status === 'OPEN_ENROLLMENT' && !!program.cta_url;
  return <article className="cp-detail"><a href={href('/programs')}>← All programs</a><div className="cp-meta"><Badge>{readable(program.content_status)}</Badge><Badge>{readable(program.operating_status)}</Badge></div><h1>{program.title}</h1><p className="cp-lead">{program.description}</p>
    <Facts fields={{ Operator: program.operator === 'EPDG' ? 'Emerson Professional Development Group' : program.operator, Audience: program.audience, Geography: program.geography, Format: program.delivery_format, 'Fee policy': 'Free to participants, schools and communities; third-party costs are separate.', 'Operating status': readable(program.operating_status), 'Confirmed dates': program.confirmed_dates?.join(', ') || 'Not confirmed', 'Approved capacity': program.approved_capacity || 'Not confirmed', Support: program.support_route ? <a href={contractHref(program.support_route)}>Verified support route</a> : 'Support destination awaiting verification' }} />
    <section className="cp-callout"><h2>{canEnroll ? 'Next step' : 'Program information & next steps'}</h2>{program.cta_url ? <a href={contractHref(program.cta_url)}>{canEnroll ? 'View verified enrollment information' : readable(program.cta_type)}</a> : <p>{readable(program.cta_type)} route is awaiting verification. No application or inquiry has been submitted.</p>}<p>This page does not establish open enrollment, accreditation, academic credit or employment. <a href={href('/inquiry')}>Check inquiry availability</a>.</p></section>
  </article>;
}
export function LearningPages({ catalog, entity, id, worksheet }: { catalog: Catalog; entity: Entity; id?: string; worksheet?: string }) {
  const lessons = catalog.lessons.filter(item => entity === 'TEE' || item.entity === entity);
  if (id) {
    const lesson = lessons.find(item => item.id === id);
    return lesson ? <LessonDetail lesson={lesson} worksheet={worksheet} /> : <Empty title="Lesson unavailable.">This lesson may be awaiting content review. <a href={href('/learn')}>Browse available lessons</a>.</Empty>;
  }
  return <><div className="cp-page-title"><p className="cp-eyebrow">Understand · practice · reflect</p><h1>{entity === 'TEA' ? 'Financial education' : 'Learning library'}</h1><p>Read a lesson, check its jurisdiction and use a bounded practice task. Learning completion and publication approval are separate decisions.</p></div>
    {entity === 'TEA' && <section className="cp-callout"><h2>Education and referrals</h2><p>General education is not individualized financial, tax, insurance, investment or legal advice. Country-specific rules need local review. No financial accounts, identity documents, tax returns, statements or personal investment details are collected here.</p><a href={href('/resources')}>Find financial education resources</a>{import.meta.env.DEV && <p><a href={href('/educationPage')}>Existing education & consent interface</a></p>}</section>}
    {lessons.length ? <div className="cp-grid">{lessons.map(lesson => <article className="cp-card" key={lesson.id}><Badge>{readable(lesson.content_status)}</Badge><h2><a href={href(`/learn/${lesson.id}`)}>{lesson.title}</a></h2><p>{lesson.jurisdiction}</p><a href={href(`/learn/${lesson.id}`)}>Read lesson & practice task →</a></article>)}</div> : <Empty />}
    <section className="cp-callout"><h2>Continue learning</h2><p>{publicRelease ? 'These lessons are available for independent practice. Account registration, assignment submissions, grades and instructor feedback are not available through these pages.' : 'Account-specific submissions, grades and feedback remain in the existing learner system. The verified account route and sanitized senior-project schema/test handoff are still required. No duplicate learner dashboard or account is created here.'}</p></section></>;
}
function LessonDetail({ lesson, worksheet }: { lesson: Lesson; worksheet?: string }) {
  return <article className="cp-detail"><a href={href('/learn')}>← Learning library</a><div className="cp-meta"><Badge>{readable(lesson.content_status)}</Badge>{lesson.synthetic && <Badge>LOCAL-ONLY draft practice</Badge>}</div><h1>{lesson.title}</h1><p className="cp-callout">Jurisdiction: {lesson.jurisdiction}</p><div className="cp-lesson">{lesson.sections.map((section, index) => <section key={`${section.heading}-${index}`}><h2>{section.heading}</h2><LessonBody body={section.body} heading={section.heading} /></section>)}</div>
    {worksheet && <section className="cp-callout"><h2>First contribution worksheet</h2><p>A draft practice guide from the founder-provided Work learning package. Use fictional examples and preserve contributor credit.</p><a className="cp-button" download="emerson-first-contribution-draft.txt" href={`data:text/plain;charset=utf-8,${encodeURIComponent(worksheet)}`}>Download draft worksheet (.txt)</a><p>If your browser does not save the file, read the worksheet below. A click alone does not confirm a saved download.</p><details><summary>Read the draft worksheet here</summary><pre className="cp-worksheet">{worksheet}</pre></details></section>}
    <p className="cp-small">{publicRelease ? lesson.entity === 'TEA' ? 'Source-literacy lesson assisted by Codex; reviewed for publication by the founder.' : 'Learning materials from the founder-provided Work learning package; reviewed for publication.' : lesson.entity === 'TEA' ? 'Codex AI-assisted source-literacy draft; source review pending.' : 'Founder-provided Work Monday Readiness Package · SHARED_LEARNING_FOUNDATION.md · review before distribution.'}</p><a href={href('/corrections')}>Report a lesson correction</a></article>;
}
function PersonCard({ person }: { person: PublicPerson }) {
  const introduction = person.bio?.split(/\n\s*\n/, 1)[0];
  return <article className="cp-card"><Badge>{readable(person.content_status)}</Badge><h2><a href={href(`/leadership/${person.id}`)}>{person.name}</a></h2><p><strong>{person.title}</strong></p>{person.pronouns && <p>{person.pronouns}</p>}<p>{introduction || 'Biography awaiting consent and content review.'}</p><p className="cp-small">Consent: {readable(person.consent_status)} · Image: {readable(person.image_rights_status)}</p><a href={href(`/leadership/${person.id}`)}>Read profile →</a></article>;
}
function SuppliedLink({ url, label }: { url: string; label: string }) {
  const host = new URL(url).hostname.replace(/^www\./, '');
  return <a href={url} rel="noreferrer" target="_blank">{label} on {host}<span className="cp-small"> (opens in a new tab)</span></a>;
}
function SourceReview({ record }: { record: SourceProvenance }) {
  if (!import.meta.env.DEV) return null;
  return <details className="cp-callout"><summary>Development review record (not published)</summary><p className="cp-small">These audit notes support private content review. They are separate from the biography or research metadata above and are omitted from production rendering.</p><Facts fields={{ 'Source version': record.source_version || 'Not supplied', 'Source checked': displayDate(record.source_checked_at ?? null) }} />{record.source_url && <p><SuppliedLink url={record.source_url} label="Supplied source" /></p>}{record.source_notes?.length ? <ul>{record.source_notes.map((note, index) => <li key={`${index}-${note}`}>{note}</li>)}</ul> : <p>Source notes have not been supplied. Content and publication review remain separate.</p>}</details>;
}
function PersonDetail({ person, founder = false }: { person: PublicPerson; founder?: boolean }) {
  const paragraphs = person.bio?.split(/\n\s*\n/).filter(paragraph => paragraph.trim());
  return <article className="cp-detail"><a href={href('/leadership')}>← Leadership</a><div className="cp-meta"><Badge>{readable(person.content_status)}</Badge><Badge>{readable(person.consent_status)}</Badge></div>{!founder && <h1>{person.name}</h1>}<p className="cp-lead">{person.title}</p>{person.pronouns && <p>{person.pronouns}</p>}<section><h2>Profile</h2>{paragraphs?.length ? paragraphs.map((paragraph, index) => <p key={`${person.id}-bio-${index}`}>{paragraph}</p>) : <p>A biography has not been supplied for review. The confirmed role title is retained without adding credentials, affiliations or personal history.</p>}</section><Facts fields={{ 'Publication consent': readable(person.consent_status), 'Image rights': readable(person.image_rights_status) }} />{!!person.public_links.length && <section><h2>Supplied profile links</h2><ul>{person.public_links.map(link => <li key={link}><SuppliedLink url={link} label={`${person.name}'s profile`} /></li>)}</ul></section>}<SourceReview record={person} />{person.id === 'lyric' && <div className="cp-actions"><a href={href('/research')}>Research & scholarship</a><a href={href('/speaking')}>Speaking inquiry status</a></div>}</article>;
}
export function ProfilePages({ catalog, entity, kind, id }: { catalog: Catalog; entity: Entity; kind: string; id?: string }) {
  if (kind === 'founder' && entity !== 'TEE') return <><div className="cp-page-title"><h1>Founder, scholarship & speaking</h1><p>The Emerson Empire maintains the canonical founder destination for all three companies.</p></div>{founderHref() ? <a className="cp-button" href={founderHref()!}>Visit the founder destination</a> : <Empty title="Founder destination awaiting release configuration." />}</>;
  if (kind === 'founder') {
    const founder = catalog.people.find(item => item.id === 'lyric');
    return <><div className="cp-page-title"><p className="cp-eyebrow">Founder · leadership · scholarship</p><h1>{founder?.name || 'Founder & scholarship'}</h1><p>{founder ? `Canonical founder destination for the Emerson companies.${founder.content_status === 'PUBLIC_RELEASE_APPROVED' ? '' : ' Review the source and permission status alongside this draft.'}` : 'A reviewed founder profile will appear after publication approval.'}</p></div>{founder ? <PersonDetail person={founder} founder /> : <Empty />}<div className="cp-actions"><a href={href('/research')}>Selected research</a><a href={href('/journal')}>Writing & project journal</a><a href={href('/speaking')}>Speaking</a><a href={href('/leadership')}>Meet the leadership</a></div></>;
  }
  if (kind === 'leadership') {
    if (id) {
      const person = catalog.people.find(item => item.id === id);
      return person ? <PersonDetail person={person} /> : <Empty title="Profile unavailable.">This profile may be awaiting content review or publication consent. <a href={href('/leadership')}>Return to leadership</a>.</Empty>;
    }
    const people = catalog.people;
    return <><div className="cp-page-title"><p className="cp-eyebrow">People & contribution</p><h1>Leadership roles</h1><p>Communications titles do not establish access permissions, equity, employment terms, nonprofit directorship or professional licensure.</p></div>{people.length ? <div className="cp-grid">{people.map(person => <PersonCard key={person.id} person={person} />)}</div> : <Empty title="No approved profile is available." />}</>;
  }
  if (kind === 'research') {
    if (id) {
      const work = catalog.research.find(item => item.id === id);
      return work ? <ResearchDetail work={work} detail /> : <Empty title="Research record unavailable.">This record may be awaiting author review or permitted source metadata. <a href={href('/research')}>Return to research</a>.</Empty>;
    }
    const works = catalog.research;
    return <><div className="cp-page-title"><p className="cp-eyebrow">Selected scholarship</p><h1>Research index</h1><p>Draft, preprint, published, accepted and presented are separate statuses. A respondent role is not a keynote. Each record retains its supplied author, version and review status.</p></div>{works.length ? <div className="cp-grid">{works.map(work => <ResearchDetail key={work.id} work={work} />)}</div> : <Empty title={import.meta.env.DEV ? 'Research metadata is awaiting a sourced transfer.' : 'No approved research records have been connected.'}>Titles, abstracts, DOI values and metrics remain absent until permitted source metadata is supplied.</Empty>}</>;
  }
  if (kind === 'journal') return <><div className="cp-page-title"><h1>Writing & project journal</h1><p>A place for reviewed public writing and project notes.</p></div><Empty title="No approved journal entries are available." /></>;
  return <><div className="cp-page-title"><p className="cp-eyebrow">Speaking & inquiry</p><h1>Conversations grounded in learning</h1><p>Speaker biography, past engagements and topics are awaiting review. No event delivery or invitation is claimed.</p></div><Empty title="Speaking topics are awaiting founder approval.">Once reviewed, topics can be connected to verified research and published work.</Empty><a className="cp-button" href={href('/inquiry?topic=SPEAKING')}>Check speaking inquiry availability</a></>;
}
function ResearchDetail({ work, detail = false }: { work: ResearchWork; detail?: boolean }) {
  const doiHref = work.doi ? (/^https:\/\/doi\.org\//i.test(work.doi) ? work.doi : `https://doi.org/${work.doi}`) : null;
  return <article className={detail ? 'cp-detail' : 'cp-card'}>{detail && <p><a href={href('/research')}>← Research index</a></p>}<div className="cp-meta"><Badge>{readable(work.scholarly_status)}</Badge><Badge>{readable(work.content_status)}</Badge></div>{detail ? <h1>{work.title}</h1> : <h2><a href={href(`/research/${work.id}`)}>{work.title}</a></h2>}<Facts fields={{ Authors: work.authors.join(', '), Version: work.version, 'Author review': readable(work.author_review_status), DOI: doiHref ? <a href={doiHref} rel="noreferrer" target="_blank">{work.doi}</a> : 'No verified DOI supplied' }} />{work.canonical_url && <p><SuppliedLink url={work.canonical_url} label="Canonical research source" /></p>}{work.permitted_pdf_url && <p><SuppliedLink url={work.permitted_pdf_url} label="Permitted paper file" /></p>}{detail ? <SourceReview record={work} /> : <a href={href(`/research/${work.id}`)}>Read research metadata →</a>}</article>;
}
