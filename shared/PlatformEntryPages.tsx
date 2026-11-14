import { useEffect } from 'react';
import { companyHref } from './company-links';
import { localHref } from './platform-format';
import entryLinks from './platform-entry-links.json';
import './platform-entry-pages.css';

type Entity = 'TEE' | 'TEA' | 'EPDG';
type Page = 'creative-studio' | 'staff-crm' | 'intern-portal' | 'platforms';

const siteName: Record<Entity, string> = {
  TEE: 'The Emerson Empire',
  TEA: 'The Emerson Agency LLC',
  EPDG: 'Emerson Professional Development Group',
};

const platform = {
  creative_studio: {
    organization: 'The Emerson Empire',
    name: 'Emerson Creative Studio',
    purpose: 'A developing workspace for personal creative projects and carefully scoped collaboration.',
    access: 'Personal accounts use their own sign-in. Company workspace membership is separate and controlled.',
    info: '/creative-studio',
    accessLabel: 'Personal account · company membership by authorization',
  },
  crm: {
    organization: 'The Emerson Agency LLC',
    name: 'Emerson CRM',
    purpose: 'An internal workspace for authorized staff managing relationships, service workflows, and assignments.',
    access: 'Invitation-only. Active membership and record permissions are enforced by the CRM.',
    info: '/staff-crm',
    accessLabel: 'Authorized staff · invitation-only',
  },
  epdg_portal: {
    organization: 'Emerson Professional Development Group',
    name: 'EPDG Intern Portal',
    purpose: 'An authenticated learning environment for modules, assignments, portfolio evidence, revision history, and mentor feedback.',
    access: 'The portal is reserved for authorized review. Learner registration and activation are not available.',
    info: '/intern-portal',
    accessLabel: 'Authorized review access only',
  },
} as const;

function OutboundLink({ href, children, className = 'pe-button', label }: { href: string; children: React.ReactNode; className?: string; label?: string }) {
  return <a className={className} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
    {children}<span className="pe-outbound" aria-hidden="true">↗</span><span className="pe-sr-only"> (opens in a new tab)</span>
  </a>;
}

function Breadcrumb({ entity, label }: { entity: Entity; label: string }) {
  const home = entity === 'TEE' ? localHref('/') : companyHref(entity, '/') || localHref('/');
  return <nav className="pe-breadcrumb" aria-label="Breadcrumb"><a href={home}>{siteName[entity]}</a><span aria-hidden="true">/</span><span aria-current="page">{label}</span></nav>;
}

function Hero({ entity, label, title, summary, status, action, secondary }: {
  entity: Entity; label: string; title: React.ReactNode; summary: string; status: string;
  action?: React.ReactNode; secondary?: React.ReactNode;
}) {
  return <header className="pe-hero"><div className="pe-wrap pe-hero-grid">
    <div className="pe-hero-copy"><Breadcrumb entity={entity} label={label} /><p className="pe-eyebrow">{label}</p><h1>{title}</h1><p className="pe-lead">{summary}</p>
      {(action || secondary) && <div className="pe-actions">{action}{secondary}</div>}
    </div>
    <aside className="pe-status-card" aria-label="Access status"><span className="pe-status-kicker">Access status</span><strong>{status}</strong><span className="pe-status-rule" /><p>Each application has its own sign-in and access requirements. Opening a public information page does not grant an account or membership.</p></aside>
  </div></header>;
}

function SectionHeading({ eyebrow, title, copy, headingId }: { eyebrow: string; title: string; copy?: string; headingId?: string }) {
  return <div className="pe-section-heading"><p className="pe-eyebrow">{eyebrow}</p><h2 id={headingId}>{title}</h2>{copy && <p>{copy}</p>}</div>;
}

function Note({ title, children, tone = 'plain' }: { title: string; children: React.ReactNode; tone?: 'plain' | 'boundary' }) {
  return <aside className={`pe-note pe-note-${tone}`}><h3>{title}</h3>{children}</aside>;
}

function Faq({ items }: { items: [string, string][] }) {
  return <section className="pe-wrap pe-faq" aria-labelledby="pe-faq-heading"><SectionHeading eyebrow="Before you continue" title="Frequently asked questions" headingId="pe-faq-heading" /><div className="pe-faq-list">{items.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></section>;
}

function ContactAction({ mailbox, label }: { mailbox: string; label: string }) {
  return <a className="pe-text-link" href={`mailto:${mailbox}`}>{label}<span aria-hidden="true"> →</span></a>;
}

function StudioPage() {
  const destination = entryLinks.login_destinations.creative_studio;
  const faq: [string, string][] = [
    ['Who can create an account?', 'Personal account access is separate from a company workspace. Email confirmation and the application’s existing account checks still apply.'],
    ['Does a personal account grant Emerson company access?', 'No. Public account creation does not add an account to a company workspace. Membership is separately approved and scoped.'],
    ['What can I save?', 'Supported Image, Video, Audio, and Social projects can be saved privately and reopened in a personal account. Drafts saved only in your browser remain on that browser and device. Use the available save controls and keep an export when you need a portable copy.'],
    ['Are all tools and features available?', 'Use the availability labels in your account. Some tools are marked as coming later; only enabled features are available for use.'],
    ['Does Creative Studio include AI generation or paid plans?', 'AI generation and paid capabilities are not currently offered through this public information page.'],
    ['Can I publish to social accounts from Studio?', 'External account connections and social publishing are not available as a public capability. Social work can be organized as a draft, with any export handled by the user.'],
    ['Who owns the original media?', 'Use media you created or have permission to use. Keep ownership and licensing terms for original and third-party materials clear; an account or workspace does not transfer rights.'],
    ['How do I request company workspace access?', 'A personal account does not grant organization membership. Company access is separately approved and limited to authorized members.'],
  ];
  return <>
    <Hero entity="TEE" label="The Emerson Empire · Creative Studio" title={<>Creative work,<br /><em>with room to grow.</em></>} summary="Emerson Creative Studio is a developing digital workspace for organizing creative projects with clear boundaries around personal accounts, company membership, media, and collaboration." status="Personal accounts available · company workspace controlled"
      action={<OutboundLink href={destination}>Open Creative Studio / Sign In</OutboundLink>} secondary={<a className="pe-light-link" href="#availability">See current availability ↓</a>} />
    <section className="pe-wrap pe-section" aria-labelledby="pe-environment"><SectionHeading eyebrow="A creative environment" title="A place for the parts of a project to meet." headingId="pe-environment" copy="The platform is designed to organize media creation, editing, review, and handoff. Use the features currently enabled in your account." />
      <div className="pe-capability-grid">
        {[
          ['01', 'Visual work', 'Organize image projects and save supported work privately in your personal account.'],
          ['02', 'Video editing', 'Organize video projects and use the available manual editing tools. Some controls are not yet available.'],
          ['03', 'Audio and voice', 'Organize and save supported audio projects. Drafts saved only in your browser remain on that browser and device.'],
          ['04', 'Content planning', 'Social content can be prepared as a draft. External account connections and automatic publishing are not included.'],
        ].map(([number, title, copy]) => <article className="pe-capability" key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}
      </div>
      <Note title="Read the availability labels in the app" tone="boundary"><p>Some creative tools are marked as forthcoming. Use the controls enabled in your signed-in account; features shown as coming later are not yet available.</p></Note>
    </section>
    <section className="pe-process-band" aria-labelledby="pe-workflow-heading"><div className="pe-wrap"><SectionHeading eyebrow="How creative work is organized" title="A considered path from idea to handoff." headingId="pe-workflow-heading" copy="The intended workflow keeps a clear decision at each step; it does not imply that every tool is active in every account." /><ol className="pe-process">{[
      ['Plan', 'Set the goal, intended audience, and useful result.'], ['Create', 'Work with original or appropriately licensed material.'], ['Edit', 'Make deliberate changes and keep the source distinct.'], ['Review', 'Check the result and confirm permissions before sharing.'], ['Save', 'Save supported work privately or export a portable copy.'], ['Handoff', 'Share only through a channel and workspace that you are authorized to use.'],
    ].map(([title, copy], index) => <li key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></li>)}</ol></div></section>
    <section className="pe-wrap pe-two-column pe-section" id="availability"><div><SectionHeading eyebrow="Personal and company spaces" title="Your account is yours. Organization access is separate." /><p>Independent accounts and Emerson company workspaces have separate membership. A personal sign-up never adds company access, staff permissions, or access to another person’s projects.</p><p>The company workspace requires separate approval. Creating a personal account does not grant company membership or access to company materials.</p></div><Note title="Keep project ownership clear"><p>Work with original, licensed, or otherwise permission-cleared assets. Limit information in a project to what the work needs. Do not place client credentials or sensitive business data in a personal workspace. Company materials belong only in an explicitly authorized company workspace.</p></Note></section>
    <section className="pe-wrap pe-section pe-collaboration"><SectionHeading eyebrow="Development and collaboration" title="Built through reviewed, collaborative work." copy="The Studio’s development includes intern contributions within supervised project work. Credit follows the work, with individual acknowledgment published only with permission." /></section>
    <Faq items={faq} />
    <section className="pe-cta-band"><div className="pe-wrap pe-cta-row"><div><p className="pe-eyebrow">Continue to the application</p><h2>Open your Creative Studio account.</h2><p>Personal account access and company workspace membership remain separate.</p></div><OutboundLink href={destination}>Open Creative Studio / Sign In</OutboundLink></div></section>
  </>;
}

function CrmPage() {
  const destination = entryLinks.login_destinations.crm;
  const faq: [string, string][] = [
    ['Can the public create a CRM account?', 'No. The CRM is invitation-only. Public visitors see explanatory information here; they cannot register or view CRM records.'],
    ['Does signing in guarantee access to records?', 'No. Staff need active membership and permission for the records they use. Applicant and onboarding records have additional HR access restrictions.'],
    ['Will an access request be approved automatically?', 'No. Invitations and membership are controlled by authorized administrators. A login help request does not create an invitation or grant a role.'],
    ['Where do applicant and onboarding records belong?', 'The CRM owns applicant, resume, and onboarding records. The EPDG learning portal begins after verified onboarding; CRM status labels alone do not activate a learner account.'],
  ];
  return <>
    <Hero entity="TEA" label="The Emerson Agency LLC · Staff CRM" title={<>A private workspace<br /><em>for authorized staff.</em></>} summary="Emerson CRM supports ethical relationship management and internal operations. This page explains its purpose; it does not display contact records or provide public account creation." status="Invitation-only · membership and record permissions required"
      action={<OutboundLink href={destination}>Open CRM / Staff Sign In</OutboundLink>} secondary={<a className="pe-light-link" href="#crm-capabilities">Review the workspace ↓</a>} />
    <section className="pe-wrap pe-section" id="crm-capabilities"><SectionHeading eyebrow="Internal workspace" title="A clear record of relationships and work." copy="Authorized team members use the CRM to coordinate work with recorded sources, clear assignments and access appropriate to their responsibilities." />
      <div className="pe-capability-grid pe-crm-grid">{[
        ['Relationships', 'Contacts and organizations, connected through reviewed records.'],
        ['Sales and service', 'Distinct opportunity and service workflows with their own evidence and approvals.'],
        ['Inquiry follow-up', 'Inquiry tracking, next actions, and responsible follow-up. Saving an activity does not send an email.'],
        ['Assignments and handoffs', 'Internal owners, assignments, and delivery handoffs with explicit acceptance steps.'],
        ['Data quality', 'Recorded sources, reviewed imports, duplicate checks and corrections.'],
        ['Controlled administration', 'Membership, assignments, and administrative workflows stay permission-controlled; sales authority does not imply HR access.'],
      ].map(([title, copy], index) => <article className="pe-capability" key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
      <Note title="Private by design" tone="boundary"><p>CRM data appears only after the application confirms a valid staff identity, active membership, and the requested record permissions. Applicant and resume details stay restricted to authorized HR workflows.</p></Note>
    </section>
    <section className="pe-wrap pe-two-column pe-section"><div><SectionHeading eyebrow="For current team members" title="Sign-in trouble? Use the support route." /><p>If you already have authorized CRM access and cannot sign in, contact technical support. Support can investigate an existing access issue; this page does not promise an invitation or approval.</p><ContactAction mailbox={entryLinks.support_mailboxes.technical} label="Contact technical support" /></div><Note title="No public registration"><p>CRM access remains invitation-only and requires active staff membership. An account at another Emerson application does not create CRM access.</p></Note></section>
    <Faq items={faq} />
    <section className="pe-cta-band"><div className="pe-wrap pe-cta-row"><div><p className="pe-eyebrow">Authorized team access</p><h2>Continue to the protected CRM.</h2><p>CRM sign-in and record access are enforced by the application.</p></div><OutboundLink href={destination}>Open CRM / Staff Sign In</OutboundLink></div></section>
  </>;
}

function InternPortalPage() {
  const destination = entryLinks.login_destinations.epdg_portal;
  const faq: [string, string][] = [
    ['Can all current interns sign in today?', 'The current portal is reserved for separately authorized review. Real learner accounts are not activated. Confirm your access with HR before attempting to sign in.'],
    ['Can I create my own portal account?', 'No public portal registration is offered. Protected sign-in and an explicit access decision are required.'],
    ['What belongs in the portal?', 'After verified onboarding, the education portal is intended for learning modules, course materials, assignments, portfolio evidence, submissions and revisions, mentor feedback, and progress documentation.'],
    ['Where should an intern go if portal access is unavailable?', 'Follow the guides already issued to you and the authorized HR submission instructions. Do not send passwords or access tokens by email.'],
  ];
  return <>
    <Hero entity="EPDG" label="EPDG · Intern Portal" title={<>Learning begins<br /><em>after verified onboarding.</em></>} summary="The education portal is intended to support learning after onboarding has been verified. The CRM owns applicant, resume, and onboarding records; EPDG owns learning activity after that handoff." status="Restricted review access · learner activation unavailable"
      action={<OutboundLink href={destination} label="Open EPDG sign-in for authorized reviewers only">Authorized reviewer sign-in</OutboundLink>} secondary={<a className="pe-light-link" href="#learning-work">See the learning experience ↓</a>} />
    <section className="pe-wrap pe-section" id="learning-work"><SectionHeading eyebrow="The intended learning experience" title="A record of learning, practice, and feedback." copy="These are the education portal’s intended learning areas. The current portal is reserved for authorized review; learner access is not activated." />
      <div className="pe-capability-grid pe-epdg-grid">{[
        ['01', 'Learning modules', 'Course materials and professional-development resources.'],
        ['02', 'Individual assignments', 'A clear task, expected evidence, and a place to work through revisions.'],
        ['03', 'Portfolio evidence', 'A learner’s own work organized with its submission history.'],
        ['04', 'Revision history', 'Submission evidence and later revisions remain distinguishable.'],
        ['05', 'Mentor feedback', 'Feedback supports the next learning step and remains linked to the appropriate work.'],
        ['06', 'Progress documentation', 'Learning progress and completed work are documented in the education workspace.'],
      ].map(([number, title, copy]) => <article className="pe-capability" key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
    </section>
    <section className="pe-boundary-band"><div className="pe-wrap pe-two-column"><div><p className="pe-eyebrow">Current access</p><h2>Learner access is not activated.</h2><p>The current portal is available only for authorized review. Public enrollment and real learner activation remain closed. Future learner access requires verified onboarding, confirmed permissions and an explicit access decision.</p><p>Protected sign-in may require an additional authorization step. An account at another Emerson application does not grant EPDG access.</p></div><aside className="pe-guide-card"><h3>Need a next step?</h3><p>If you are an intern without verified portal access, use your already-issued guide and the authorized HR submission instructions.</p><ContactAction mailbox={entryLinks.support_mailboxes.hr} label="Contact authorized HR" /></aside></div></section>
    <Faq items={faq} />
    <section className="pe-cta-band"><div className="pe-wrap pe-cta-row"><div><p className="pe-eyebrow">Protected access</p><h2>Continue with authorized review access.</h2><p>Protected sign-in and portal access checks remain in place. Learner activation is unavailable.</p></div><OutboundLink href={destination} label="Open EPDG sign-in for authorized reviewers only">Authorized reviewer sign-in</OutboundLink></div></section>
  </>;
}

function PlatformDirectory() {
  const destinations: Record<Entity, string> = {
    TEE: companyHref('TEE', '/') || '#',
    TEA: companyHref('TEA', '/') || '#',
    EPDG: companyHref('EPDG', '/') || '#',
  };
  const infoLinks = [
    { id: 'creative_studio' as const, entity: 'TEE' as const, infoPath: '/creative-studio', action: 'Open Creative Studio / Sign In' },
    { id: 'crm' as const, entity: 'TEA' as const, infoPath: '/staff-crm', action: 'Open CRM / Staff Sign In' },
    { id: 'epdg_portal' as const, entity: 'EPDG' as const, infoPath: '/intern-portal', action: 'Authorized reviewer sign-in' },
  ];
  const faq: [string, string][] = [
    ['Can one Emerson account open every platform?', 'No. Creative Studio, CRM, and EPDG use separate identity and authorization checks. An account on one platform does not grant access to another.'],
    ['Which spaces are public?', 'This directory and the company information pages are public. CRM records and EPDG portal content remain protected. The portal is currently reserved for authorized review.'],
    ['Is Project Studio a login system?', 'No. Project Studio is public project-planning information with an offline personal brief. It does not accept live project requests or create an account.'],
  ];
  return <>
    <Hero entity="TEE" label="The Emerson Empire · Platforms" title={<>Four clear routes<br /><em>through the Emerson ecosystem.</em></>} summary="Start with public information, then continue only if you have the authorization required by that application. Each platform keeps its own identity, workspace, and access rules." status="Separate applications · separate sign-in and permissions" secondary={<a className="pe-light-link" href="#platform-directory">Browse the directory ↓</a>} />
    <section className="pe-wrap pe-section" id="platform-directory" aria-labelledby="pe-platform-directory-heading"><SectionHeading eyebrow="Platforms and workspaces" title="Choose the organization and access route that fits." headingId="pe-platform-directory-heading" />
      <div className="pe-directory-grid">{infoLinks.map(({ id, entity, infoPath, action }) => <article className="pe-directory-card" key={id}><p className="pe-eyebrow">{platform[id].organization}</p><h2>{platform[id].name}</h2><p>{platform[id].purpose}</p><p className="pe-access-label">{platform[id].accessLabel}</p><p>{platform[id].access}</p><div className="pe-card-actions">{entity === 'TEE' ? <a className="pe-text-link" href={localHref(infoPath)}>Platform information<span aria-hidden="true"> →</span></a> : <OutboundLink className="pe-text-link" href={companyHref(entity, infoPath)!}>{platform[id].organization} information</OutboundLink>}<OutboundLink className="pe-button pe-button-small" href={entryLinks.login_destinations[id]}>{action}</OutboundLink></div></article>)}
        <article className="pe-directory-card pe-project-card"><p className="pe-eyebrow">The Emerson Empire · Project Studio</p><h2>Business project planning</h2><p>Public information about defined business-foundation and operations projects, with examples of scope and deliverables.</p><p className="pe-access-label">Public planning · quote-only examples · no project submissions</p><p>The personal brief is a planning file you can save to your own device. It is not a login, contract, booking, or project request.</p><div className="pe-card-actions"><a className="pe-text-link" href={localHref('/project-studio')}>TEE Project Studio<span aria-hidden="true"> →</span></a><OutboundLink className="pe-text-link" href={companyHref('TEA', '/project-studio')!}>TEA Project Studio</OutboundLink></div></article>
      </div>
    </section>
    <section className="pe-wrap pe-site-links pe-section"><SectionHeading eyebrow="Public company websites" title="Return to an organization." /><div className="pe-site-link-row">{(['TEE', 'TEA', 'EPDG'] as Entity[]).map(entity => <OutboundLink key={entity} href={destinations[entity]} className="pe-site-link">{siteName[entity]}</OutboundLink>)}</div></section>
    <Faq items={faq} />
  </>;
}

export function PlatformInformationPage({ entity, page }: { entity: Entity; page: Page }) {
  const title = page === 'creative-studio' ? 'Creative Studio' : page === 'staff-crm' ? 'Staff CRM Login' : page === 'intern-portal' ? 'Intern Portal' : 'Platforms';
  useEffect(() => {
    document.title = `${title} | ${siteName[entity]}`;
    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute('content', page === 'creative-studio'
      ? 'Learn about Emerson Creative Studio, personal account access and separately approved company membership.'
      : page === 'staff-crm'
        ? 'Information about the invitation-only Emerson CRM for authorized staff.'
        : page === 'intern-portal'
          ? 'Learn about EPDG learning access and the portal reserved for authorized review. Learner activation remains unavailable.'
          : 'Find Emerson applications, public information pages, and their distinct access requirements.');
  }, [entity, page, title]);
  return <main id="main-content" className={`platform-entry pe-${entity.toLowerCase()}`}>
    {page === 'creative-studio' ? <StudioPage /> : page === 'staff-crm' ? <CrmPage /> : page === 'intern-portal' ? <InternPortalPage /> : <PlatformDirectory />}
  </main>;
}

export function PlatformHomeGateway({ entity }: { entity: 'TEE' | 'TEA' }) {
  const destination = entity === 'TEE' ? localHref('/creative-studio') : localHref('/staff-crm');
  const title = entity === 'TEE' ? 'Explore Emerson Creative Studio' : 'For authorized Agency staff';
  const copy = entity === 'TEE'
    ? 'Learn how personal creative accounts, company workspaces, and supported project saves are kept separate.'
    : 'The Emerson CRM is an invitation-only internal workspace. Sign-in and membership are checked by the application.';
  return <section className={`platform-entry-gateway pe-${entity.toLowerCase()}`} aria-labelledby="pe-gateway-heading"><div className="pe-wrap pe-gateway-row"><div><p className="pe-eyebrow">{entity === 'TEE' ? 'Digital creative workspace' : 'Internal team access'}</p><h2 id="pe-gateway-heading">{title}</h2><p>{copy}</p></div><a className="pe-button" href={destination}>{entity === 'TEE' ? 'Creative Studio information' : 'Staff CRM Login information'}<span aria-hidden="true"> →</span></a>{entity === 'TEE' && <a className="pe-light-link" href={localHref('/platforms')}>Browse all platforms</a>}</div></section>;
}
