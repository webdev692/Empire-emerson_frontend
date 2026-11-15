import type { PublicEntity } from './PublicDesignSystem';

export type LeadershipLink = { label: string; href: string };
export type LeadershipProfile = {
  slug: string;
  name: string;
  title: string;
  initials: string;
  department: string;
  canonicalUrl: string;
  personId: string;
  location?: string;
  summary: Record<PublicEntity, string>;
  contribution: Record<PublicEntity, string>;
  responsibilities: string[];
  professionalLinks: LeadershipLink[];
};

const profileUrl = (slug: string) => `https://theemerson.netlify.app/leadership/${slug}`;

/** Public company roles approved by the founder; separate from internship assignments. */
export const leadershipProfiles: LeadershipProfile[] = [
  {
    slug: 'lyric-helena-emerson',
    name: 'Lyric Helena Emerson',
    title: 'Founder & Chief Executive Officer',
    initials: 'LHE',
    department: 'Executive leadership',
    canonicalUrl: profileUrl('lyric-helena-emerson'),
    personId: 'https://theemerson.netlify.app/founder#lyric-helena-emerson',
    location: 'Columbia, South Carolina, USA',
    summary: {
      TEE: 'Lyric Helena Emerson founded The Emerson Empire to connect community-centered service, education, and opportunity. As a woman founder and entrepreneur, she leads organizational strategy and the development of the Emerson companies.',
      TEA: 'Lyric Helena Emerson leads The Emerson Agency LLC with a focus on financial understanding, careful preparation, and community-centered service. Her professional background spans tax preparation, insurance, financial coaching, and financial education.',
      EPDG: 'Lyric Helena Emerson brings independent scholarship, academic research, and educational program design to her leadership of Emerson Professional Development Group. Her work connects thoughtful inquiry with workforce development and professional learning.',
    },
    contribution: {
      TEE: 'Her executive work connects the mission of The Emerson Empire with practical organizational decisions: developing programs, setting priorities, and guiding public-facing partnerships and institutional communication. Independent scholarship and education inform her attention to how people encounter institutions and opportunities.',
      TEA: 'Her direction for the Agency connects financial knowledge with usable next steps: organizing records, preparing questions, defining the scope of a service, and recognizing when specialist support is needed. She brings a founder’s perspective to the administrative responsibilities of households and small businesses.',
      EPDG: 'Her educational leadership brings research, conference presentations, and program development into conversation with career readiness and structured learning. The public academic archive documents her manuscripts and conference activity, while program information explains the expectations of EPDG learning opportunities.',
    },
    responsibilities: [
      'Organizational strategy and executive leadership',
      'Community-centered leadership and company direction',
      'Independent scholarship and education',
      'Program development',
      'Public-facing partnerships and institutional communication',
    ],
    professionalLinks: [
      { label: 'PhilPeople research profile', href: 'https://philpeople.org/profiles/lyric-helena-emerson' },
      { label: 'ORCID researcher identifier', href: 'https://orcid.org/0009-0001-5355-6489' },
    ],
  },
  {
    slug: 'darin-latrelle-james',
    name: 'Darin Latrelle James',
    title: 'Managing Partner',
    initials: 'DLJ',
    department: 'Management & coordination',
    canonicalUrl: profileUrl('darin-latrelle-james'),
    personId: `${profileUrl('darin-latrelle-james')}#person`,
    summary: {
      TEE: 'Darin Latrelle James supports coordination across the Emerson enterprise. The managing-partner role connects strategic implementation, operational planning, and management support so that teams can collaborate and follow through on shared priorities.',
      TEA: 'Darin Latrelle James supports management coordination and operational planning for the Agency within the wider Emerson enterprise. The focus is on turning organizational priorities into clear, coordinated work.',
      EPDG: 'Darin Latrelle James supports organizational coordination, management planning, and strategic implementation across the Emerson enterprise, including the work of Emerson Professional Development Group.',
    },
    contribution: {
      TEE: 'The contribution centers on the work between functions: helping priorities move into practical plans, supporting management decisions, and maintaining attention to collaborative follow-through. This company leadership role serves the coordination needs of the wider Emerson enterprise.',
      TEA: 'This management contribution supports the relationship between planning and service operations. By coordinating priorities and supporting collaboration, Darin helps organize the work that sits behind clear communication and responsible follow-through.',
      EPDG: 'The contribution brings a management perspective to organizational development and coordination. Darin supports the planning and collaboration that connect program priorities with the people and functions responsible for carrying them forward.',
    },
    responsibilities: [
      'Coordination across the Emerson enterprise',
      'Strategic implementation',
      'Operational planning',
      'Management support',
      'Cross-functional organizational development',
      'Supporting effective collaboration and follow-through',
    ],
    professionalLinks: [],
  },
  {
    slug: 'shamrit-phagura',
    name: 'Shamrit Phagura',
    title: 'Computer Science Team Lead',
    initials: 'SP',
    department: 'Technology & digital systems',
    canonicalUrl: profileUrl('shamrit-phagura'),
    personId: `${profileUrl('shamrit-phagura')}#person`,
    summary: {
      TEE: 'Shamrit Phagura coordinates technical development and computer science team priorities across the Emerson companies. The role brings software implementation, technical quality review, and maintainable digital systems into the organization’s work.',
      TEA: 'Shamrit Phagura supports the Agency’s digital systems through technical development coordination and computer science team leadership. This work focuses on approved implementation priorities and technical quality.',
      EPDG: 'Shamrit Phagura supports the digital systems behind professional learning through computer science team leadership, software implementation, and technical quality review. Shamrit coordinates approved development priorities with attention to maintainability.',
    },
    contribution: {
      TEE: 'The contribution is to coordinate the technical work that supports public information and organizational tools. Shamrit connects development priorities with software implementation, quality review, and the ongoing work of maintaining useful digital systems.',
      TEA: 'This technical contribution supports clear public information and maintainable software. Shamrit coordinates development priorities and technical review to support the Agency’s digital communication and organizational work.',
      EPDG: 'The contribution connects educational priorities with the practical work of developing and reviewing digital systems. Shamrit brings technical coordination and attention to software quality to the tools that support professional learning.',
    },
    responsibilities: [
      'Technical development coordination',
      'Digital infrastructure',
      'Computer science team leadership',
      'Software implementation',
      'Technical quality review',
      'Coordinating approved development priorities',
      'Supporting maintainable digital systems',
    ],
    professionalLinks: [],
  },
  {
    slug: 'godwin-iwatan-kehinde',
    name: 'Godwin-Iwatan Kehinde (Kenny)',
    title: 'Global Outreach, Human Resources & Operations Lead',
    initials: 'GK',
    department: 'Outreach, people & operations',
    canonicalUrl: profileUrl('godwin-iwatan-kehinde'),
    personId: `${profileUrl('godwin-iwatan-kehinde')}#person`,
    summary: {
      TEE: 'Godwin-Iwatan Kehinde, known as Kenny, coordinates global outreach, human resources administration within authorized scope, and organizational operations. The company role connects communication, administrative systems, and operational follow-through.',
      TEA: 'Godwin-Iwatan Kehinde, known as Kenny, supports outreach, authorized human resources administration, and operational coordination across the Emerson companies. This work connects administrative processes with clear communication and follow-through.',
      EPDG: 'Godwin-Iwatan Kehinde, known as Kenny, supports program coordination, global outreach, and organizational operations. The role connects administrative systems, authorized human resources work, and international and institutional communication.',
    },
    contribution: {
      TEE: 'The contribution links external communication with the administrative work needed to coordinate an organization. Human resources responsibilities operate within authorized scope and respect the confidentiality of applicants and personnel.',
      TEA: 'This operational contribution supports the administrative coordination behind the Agency’s work and its connections across the Emerson enterprise. Human resources activity remains within authorized scope, with confidential information handled through the appropriate internal process.',
      EPDG: 'The contribution centers on the coordination needed to support educational programs and organizational communication. Program operations and authorized HR administration have distinct responsibilities, and confidential applicant or personnel information remains within the appropriate internal process.',
    },
    responsibilities: [
      'Global outreach coordination',
      'Human resources administration within authorized scope',
      'Organizational operations',
      'Program coordination',
      'Administrative systems',
      'International and institutional communications',
      'Operational follow-through and reporting',
    ],
    professionalLinks: [],
  },
  {
    slug: 'todor-tomic',
    name: 'Todor Tomic',
    title: 'Sales Manager',
    initials: 'TT',
    department: 'Sales & business development',
    canonicalUrl: profileUrl('todor-tomic'),
    personId: `${profileUrl('todor-tomic')}#person`,
    summary: {
      TEE: 'Todor Tomic coordinates sales management and business development with an emphasis on ethical outreach and responsible communication. The company role supports inquiry handling, needs discovery, and organized follow-up.',
      TEA: 'Todor Tomic supports the Agency’s customer inquiry and follow-up processes through sales management and business development coordination. The focus is on understanding needs, communicating responsibly, and organizing the sales workflow.',
      EPDG: 'Todor Tomic supports responsible inquiry handling, ethical outreach, and business development coordination. The sales-management role connects needs discovery with clear communication about the relevant company offering.',
    },
    contribution: {
      TEE: 'The contribution begins with understanding an inquiry and connecting it with the appropriate company service. Organized follow-up and responsible lead management support communication without assuming a service commitment or promising an outcome.',
      TEA: 'The contribution supports a considered first conversation: understanding the type of help requested, organizing follow-up, and communicating the appropriate next step. Service availability, suitability, professional authorization, and scope require confirmation with the relevant service team.',
      EPDG: 'The contribution helps organize inquiries and business-development conversations around the needs being expressed. Responsible communication distinguishes information about an offering from a confirmed service, partnership, or participation arrangement.',
    },
    responsibilities: [
      'Sales management',
      'Ethical outreach',
      'Business development coordination',
      'Customer inquiry and follow-up processes',
      'Sales workflow organization',
      'Client communication',
      'Needs discovery and responsible lead management',
    ],
    professionalLinks: [],
  },
];

export const leadershipCompanyIntroduction: Record<PublicEntity, { description: string; emphasis: string; departments: string[] }> = {
  TEE: {
    description: 'Meet the people responsible for company direction, management coordination, technology, operations, and business development across The Emerson Empire.',
    emphasis: 'Founder leadership and managing-partner coordination connect the work of three distinct companies. Departmental leaders support the systems, communication, and follow-through that bring shared priorities into practice.',
    departments: ['shamrit-phagura', 'godwin-iwatan-kehinde', 'todor-tomic'],
  },
  TEA: {
    description: 'Meet the leadership behind the Agency’s financial education, service coordination, and responsible customer communication.',
    emphasis: 'Lyric’s financial-service background, Darin’s management coordination, and Todor’s sales leadership connect service direction with thoughtful inquiries and follow-through. Technical and operational leaders support the wider company work.',
    departments: ['todor-tomic', 'shamrit-phagura', 'godwin-iwatan-kehinde'],
  },
  EPDG: {
    description: 'Meet the company leaders connecting scholarship, educational programs, operational coordination, and digital development.',
    emphasis: 'Lyric’s academic and educational leadership works alongside Kenny’s operational coordination and Shamrit’s technical leadership. Darin supports management coordination, while Todor supports responsible outreach and inquiry processes.',
    departments: ['godwin-iwatan-kehinde', 'shamrit-phagura', 'todor-tomic'],
  },
};
