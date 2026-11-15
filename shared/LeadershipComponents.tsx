import { PublicHero, Section } from './PublicDesignSystem';
import type { PublicEntity } from './PublicDesignSystem';
import { leadershipCompanyIntroduction, leadershipDirectoryTagline, leadershipFounderNote, leadershipProfiles } from './LeadershipData';
import type { LeadershipProfile } from './LeadershipData';
import { publicCompanies } from './public-company-identity';
import './Leadership.css';
import { PublicMediaImage } from './PublicMediaImage';
import type { PublicMediaAsset } from './public-media';

export type LeadershipPageOptions = { portraits?: Record<string, PublicMediaAsset | undefined> };

function ProfileVisual({ profile, portrait, priority = false }: { profile: LeadershipProfile; portrait?: PublicMediaAsset; priority?: boolean }) {
  if (portrait) {
    return <figure className="leadership-portrait"><PublicMediaImage asset={portrait} priority={priority} /></figure>;
  }
  return <div className="leadership-monogram" aria-hidden="true"><span>{profile.initials}</span><span className="leadership-monogram-line" /></div>;
}

function ProfileLink({ profile }: { profile: LeadershipProfile }) {
  return <a className="modern-inline-link" href={`/leadership/${profile.slug}`}>Explore the profile <span aria-hidden="true">→</span><span className="modern-sr-only"> of {profile.name}</span></a>;
}

export function LeadershipDirectory({ entity, options }: { entity: PublicEntity; options: LeadershipPageOptions }) {
  const introduction = leadershipCompanyIntroduction[entity];
  const founder = leadershipProfiles[0];
  const partner = leadershipProfiles[1];
  const departments = introduction.departments.map(slug => leadershipProfiles.find(profile => profile.slug === slug)!);
  return <>
    <PublicHero eyebrow={`${publicCompanies[entity].short} · Company leadership`} title="Meet our leadership." description={<><p className="leadership-directory-tagline">{leadershipDirectoryTagline}</p><p>{introduction.description}</p></>}>
      <a className="modern-button" href="#executive-leadership">Executive leadership <span aria-hidden="true">↓</span></a>
      <a className="modern-button-secondary" href="#departmental-leadership">Departmental leadership</a>
    </PublicHero>
    <Section id="executive-leadership">
      <div className="leadership-feature">
        <ProfileVisual profile={founder} portrait={options.portraits?.[founder.slug]} />
        <div className="leadership-feature-copy"><p className="modern-kicker">Founder leadership</p><h2>{founder.name}</h2><p className="leadership-role">{founder.title}</p><p className="leadership-location">{founder.location}</p><p>{founder.summary[entity]}</p><div className="modern-actions"><ProfileLink profile={founder} /><a className="modern-inline-link" href="/founder">The founder’s story <span aria-hidden="true">→</span></a></div></div>
      </div>
    </Section>
    <Section tone="mist">
      <article className="leadership-partner" aria-labelledby="managing-partner-name"><ProfileVisual profile={partner} portrait={options.portraits?.[partner.slug]} /><div><p className="modern-kicker">Management & coordination</p><h2 id="managing-partner-name">{partner.name}</h2><p className="leadership-role">{partner.title}</p><p>{partner.summary[entity]}</p><ProfileLink profile={partner} /></div></article>
    </Section>
    <Section id="departmental-leadership" eyebrow="Departmental leadership" title="The work that connects our teams." description={introduction.emphasis}>
      <div className="leadership-departments">{departments.map(profile => <article className="leadership-department" key={profile.slug} aria-labelledby={`leader-${profile.slug}`}>
        <ProfileVisual profile={profile} portrait={options.portraits?.[profile.slug]} /><p className="leadership-department-label">{profile.department}</p><h3 id={`leader-${profile.slug}`}>{profile.name}</h3><p className="leadership-role">{profile.title}</p>{profile.secondaryTitle && <p className="leadership-secondary-role">{profile.secondaryTitle}</p>}<p className="leadership-card-summary">{profile.summary[entity]}</p><ProfileLink profile={profile} />
      </article>)}</div>
    </Section>
    <Section id="founder-note" eyebrow="Recognition & shared purpose" title="A Note from Our Founder">
      <div className="leadership-founder-note"><blockquote>{leadershipFounderNote.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}<p className="leadership-closing"><strong>{leadershipFounderNote.closingStatement}</strong></p></blockquote><p className="leadership-signature"><strong>— Lyric Helena Emerson</strong><span>Founder &amp; Chief Executive Officer</span><span>The Emerson Empire</span></p></div>
    </Section>
    <Section tone="mist"><div className="leadership-context"><div><p className="modern-kicker">Connected companies. Clear responsibilities.</p><h2>A shared team, with a distinct purpose in each company.</h2></div><div><p>These profiles describe company leadership responsibilities across the Emerson ecosystem. Individual program and internship assignments are separate from these company roles.</p><p>For a service question, program inquiry, or proposed collaboration, use the relevant company contact route so your message reaches the right team.</p><a className="modern-inline-link" href="/contact">Find the right contact <span aria-hidden="true">→</span></a></div></div></Section>
  </>;
}

const relevantLinks: Record<PublicEntity, { label: string; href: string }[]> = {
  TEE: [{ label: 'About The Emerson Empire', href: '/about' }, { label: 'Community & institutional partnerships', href: '/partnerships' }],
  TEA: [{ label: 'About The Emerson Agency', href: '/about' }, { label: 'Service information & planning estimates', href: '/services-pricing' }],
  EPDG: [{ label: 'About Emerson Professional Development', href: '/about' }, { label: 'Professional learning & program information', href: '/global-internship-program' }],
};

function FounderContext({ entity }: { entity: PublicEntity }) {
  if (entity === 'TEA') return <aside className="leadership-scope"><h3>Financial-service scope</h3><p>Lyric’s background includes tax preparation, insurance, financial coaching, and financial education. Current qualifications, jurisdiction, service scope, and availability must be confirmed before arranging a regulated service. This profile does not establish active insurance licensure or a specific tax credential.</p><a className="modern-inline-link" href="/founder">Read the founder’s professional approach <span aria-hidden="true">→</span></a></aside>;
  if (entity === 'EPDG') return <aside className="leadership-scope"><h3>Scholarship & educational work</h3><p>The academic archive presents independent manuscripts, conference activity, and educational interests with the status of each record kept clear.</p><div className="leadership-link-list"><a href="/academic-biography">Academic biography</a><a href="/research">Research & manuscripts</a><a href="/conferences">Conferences & presentations</a></div></aside>;
  return <aside className="leadership-scope"><h3>Founder, entrepreneur & independent scholar</h3><p>Explore Lyric’s founder story and the connections between community-centered leadership, education, and independent scholarship.</p><div className="leadership-link-list"><a href="/founder">The founder’s story</a><a href="/research">Selected scholarship</a></div></aside>;
}

export function LeadershipDetail({ entity, profile, options }: { entity: PublicEntity; profile: LeadershipProfile; options: LeadershipPageOptions }) {
  return <>
    <section className="modern-hero leadership-profile-hero"><div className="modern-wrap leadership-profile-header"><div><p className="modern-kicker">{publicCompanies[entity].short} · Company leadership</p><h1>{profile.name}</h1><p className="leadership-role">{profile.title}</p>{profile.secondaryTitle && <p className="leadership-secondary-role">{profile.secondaryTitle}</p>}{profile.location && <p className="leadership-location">{profile.location}</p>}<p className="modern-lead">{profile.summary[entity]}</p><a className="modern-inline-link" href="/leadership"><span aria-hidden="true">← </span>Meet the leadership team</a></div><ProfileVisual profile={profile} portrait={options.portraits?.[profile.slug]} priority /></div></section>
    <Section id="biography" eyebrow="Personal & professional journey" title="Biography"><div className="modern-prose leadership-biography">{profile.biography.map(paragraph => <p key={paragraph}>{paragraph}</p>)}<p className="leadership-closing"><strong>{profile.closingStatement}</strong></p></div></Section>
    <Section eyebrow={profile.department} title="Professional contribution"><div className="leadership-detail-body"><div className="modern-prose"><p>{profile.contribution[entity]}</p>{profile.slug === 'lyric-helena-emerson' && <FounderContext entity={entity} />}</div><aside className="leadership-company-note"><p className="modern-kicker">Company connection</p><h3>{publicCompanies[entity].name}</h3><p>{publicCompanies[entity].line}</p><ul>{relevantLinks[entity].map(link => <li key={link.href}><a href={link.href}>{link.label}</a></li>)}</ul></aside></div></Section>
    <Section tone="mist" eyebrow="Areas of responsibility" title="What the role brings together."><ul className="leadership-responsibilities">{profile.responsibilities.map((responsibility, index) => <li key={responsibility}><span className="leadership-responsibility-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><span>{responsibility}</span></li>)}</ul></Section>
    {profile.professionalLinks.length > 0 && <Section eyebrow="Public professional profiles" title="Explore the work in context."><ul className="leadership-public-links">{profile.professionalLinks.map(link => <li key={link.href}><a href={link.href}>{link.label} <span aria-hidden="true">↗</span></a></li>)}</ul></Section>}
    <Section><div className="leadership-context"><div><p className="modern-kicker">Across the Emerson ecosystem</p><h2>One leadership profile. Three company perspectives.</h2></div><div><p>Explore the context of {profile.name}’s company role across the Emerson organizations.</p><nav className="leadership-company-links" aria-label={`${profile.name} across the Emerson companies`}>{(Object.entries(publicCompanies) as [PublicEntity, typeof publicCompanies[PublicEntity]][]).map(([key, company]) => <a key={key} href={key === entity ? `/leadership/${profile.slug}` : `${company.origin}/leadership/${profile.slug}`} aria-current={key === entity ? 'page' : undefined}>{company.name}{key === entity ? <span className="leadership-current">Current company</span> : <span aria-hidden="true">↗</span>}</a>)}</nav><div className="modern-actions"><a className="modern-inline-link" href="/leadership">View all company leaders <span aria-hidden="true">→</span></a><a className="modern-inline-link" href="/contact">Contact the company <span aria-hidden="true">→</span></a></div></div></div></Section>
  </>;
}
