import { contactMailboxes, dailySessions, publicForms } from './public-intake';
import { localHref } from './platform-format';
import './public-website.css';

export function CollectionNotice() {
  return <p className="pw-collection-notice">Applications and registration open in Google Forms. Review the <a href={localHref('/privacy')}>Privacy Policy</a> and <a href={localHref('/terms')}>Terms of Use</a> before sharing information. Do not send passwords, Social Security numbers, account details or sensitive documents through general inquiries. The website does not confirm a submission.</p>;
}
export function DailyClassSchedule() {
  return <section className="pw-access" id="daily-class-schedule" aria-labelledby="daily-class-title"><p className="cp-eyebrow">Every day · Eastern Time (America/New_York)</p><h2 id="daily-class-title">Daily classes & workshops</h2><div className="pw-session-grid">{dailySessions.map(session => <article className="pw-session" key={session.id}><h3>{session.time}</h3><p>{session.duration}</p><p><strong>{session.price ? `$${session.price} USD or fee waiver` : 'Free'}</strong></p><a href={publicForms.classes} target="_blank" rel="noopener noreferrer">Register for this session<span className="is-sr-only"> at {session.time}</span> ↗</a></article>)}</div><p>Fee waivers are available for the 2 PM workshop and 7 PM intensive, subject to review. <a href={publicForms.feeWaiver} target="_blank" rel="noopener noreferrer">Request a fee waiver ↗</a>. Registration does not guarantee a place until confirmed by the program.</p><CollectionNotice /></section>;
}
export function InternshipApplication() {
  return <section className="pw-access" id="apply"><h2>Apply for the Global Internship Program</h2><p>Internship participation is free. Apply through the existing Google Form. The form states that your Google account name, email and photo are recorded when you upload files and submit. HR reviews applications and confirms onboarding separately. Applying does not activate a learning-portal account or guarantee placement.</p><a className="cp-button" href={publicForms.internship} target="_blank" rel="noopener noreferrer">Open internship application ↗</a><p>If the form asks for access, contact <a href={`mailto:${contactMailboxes.hr}`}>{contactMailboxes.hr}</a>. Do not send application documents by general inquiry email.</p><CollectionNotice /></section>;
}
