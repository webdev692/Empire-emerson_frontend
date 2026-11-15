import type { PublicPage } from '../../shared/PublicDesignSystem';
import manuscriptData from './scholarship/manuscripts.json';
import conferenceData from './scholarship/conferences.json';
import { Home, About, Founder, AcademicBiography, AcademicCv, ResearchDirectory, ManuscriptPage, ConferenceDirectory, ConferencePage, InternshipProgram, Programs, InternshipTracks, Classes, CareerReadiness, ProfessionalTraining, Certificates, Partnerships, InternPortal, Contact } from './scholarship/ContentPages';
const manuscripts = manuscriptData;
const conferences = conferenceData;
export const epdgPages: PublicPage[] = [
  { path:'/', title:'Research-informed learning and professional development', description:'Research-informed professional development, structured internships, practical classes and independent scholarship led by founder Lyric Helena Emerson.', content:<Home /> },
  { path:'/about', title:'About EPDG', description:'Learn about Emerson Professional Development Group, its education mission, founder and role in the Emerson ecosystem.', content:<About /> },
  { path:'/founder', title:'Lyric Helena Emerson — Founder & Scholar', description:'Meet Lyric Helena Emerson, independent scholar, educator and founder of Emerson Professional Development Group in Columbia, South Carolina.', content:<Founder /> },
  { path:'/academic-biography', title:'Academic Biography — Lyric Helena Emerson', description:'Research interests in political philosophy, institutional ethics, administrative power, race and law, and education in progress.', content:<AcademicBiography /> },
  { path:'/academic-cv', title:'Academic CV — Lyric Helena Emerson', description:'A public academic CV summary covering education in progress, public manuscripts, conference presentations and educational practice.', content:<AcademicCv /> },
  { path:'/research', title:'Research & Publications — Lyric Helena Emerson', description:'Search public manuscripts by Lyric Helena Emerson, with verified abstracts, research subjects and canonical scholarly references.', content:<ResearchDirectory /> },
  ...manuscripts.map(work => ({ path:`/research/${work.slug}`, title:work.title, description:`${work.author}: ${work.abstract.slice(0,140).replace(/\s+\S*$/, '')}…`, content:<ManuscriptPage key={work.id} work={work} /> })),
  { path:'/conferences', title:'Conferences & Presentations — Lyric Helena Emerson', description:'Delivered talks, accepted presentations not delivered, and forthcoming academic presentations by Lyric Helena Emerson.', content:<ConferenceDirectory /> },
  ...conferences.map(event => ({ path:`/conferences/${event.slug}`, title:event.title, description:`${event.status}: ${event.event}, ${event.dateLabel}. Presentation by Lyric Helena Emerson.`, content:<ConferencePage key={event.id} event={event} /> })),
  { path:'/global-internship-program', title:'Global Internship Program', description:'Explore the EPDG Global Internship Program: remote learning, seven track families, guided projects, feedback and portfolio evidence.', content:<InternshipProgram /> },
  { path:'/programs', title:'Learning Programs', description:'Compare EPDG classes, workshops, guided internship learning, career readiness and professional training pathways.', content:<Programs /> },
  { path:'/internship-tracks', title:'Internship Tracks', description:'Explore seven documented internship track families, from web development and design to operations, media and global outreach.', content:<InternshipTracks /> },
  { path:'/classes', title:'Classes & Workshops', description:'Browse 19 documented class descriptions, two retained curriculum topics, and the daily free and low-cost Eastern Time session schedule.', content:<Classes /> },
  { path:'/career-readiness', title:'Career Readiness', description:'Build professional habits, career materials, communication skills and evidence of your contributions through EPDG learning pathways.', content:<CareerReadiness /> },
  { path:'/professional-training', title:'Professional Training', description:'Explore professional learning through clear objectives, practical application, communication, feedback and responsible work habits.', content:<ProfessionalTraining /> },
  { path:'/certificates', title:'Certificates & Portfolio Evidence', description:'Understand EPDG learning evidence, completion conditions, certificates, attribution and the limits of educational recognition.', content:<Certificates /> },
  { path:'/partnerships', title:'Schools & Institutional Partnerships', description:'Discuss educational collaboration with EPDG, including learning objectives, supervision, accessibility and institutional requirements.', content:<Partnerships /> },
  { path:'/intern-portal', title:'Intern Portal Information', description:'Learn how EPDG education access relates to verified onboarding, assignment submissions and mentor feedback. Public activation remains unavailable.', content:<InternPortal /> },
  { path:'/contact', title:'Contact EPDG', description:'Find the appropriate EPDG route for internship information, class registration, fee-waiver requests, scholarship and institutional inquiries.', content:<Contact /> },
];

export const epdgScholarlyData = { manuscripts, conferences };
