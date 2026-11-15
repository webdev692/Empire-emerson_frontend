import type { PublicEntity } from './PublicDesignSystem';

export type LeadershipLink = { label: string; href: string };
export type LeadershipProfile = {
  slug: string;
  name: string;
  title: string;
  secondaryTitle?: string;
  initials: string;
  department: string;
  canonicalUrl: string;
  personId: string;
  location?: string;
  biography: string[];
  closingStatement: string;
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
    biography: [
      "Lyric Helena Emerson's journey into entrepreneurship, education, and scholarship has not followed a traditional timeline. Her path has been shaped by perseverance, an enduring curiosity about the world, and a belief that meaningful achievement is not limited by when someone begins.",
      "Lyric began her college education at Midlands Technical College in South Carolina in 2018 before transferring to Southern New Hampshire University in 2022. She is currently pursuing her Bachelor of Arts in Political Science, with a strong academic focus on global affairs, and anticipates completing her undergraduate degree in 2027. She is also preparing applications to doctoral programs, where she hopes to continue her research into political institutions, public policy, justice, and the responsibilities societies hold toward their communities.",
      "In 2022, Lyric founded The Emerson Agency LLC and began her professional career as a licensed insurance producer. What began as a commitment to helping individuals and families better understand their financial circumstances gradually developed into a wider organizational vision.",
      "Today, that vision connects three companies: The Emerson Empire, The Emerson Agency LLC, and Emerson Professional Development Group. Together, they reflect her commitment to financial education, professional opportunity, community-centered service, independent scholarship, and ethical leadership.",
      "As the founder of the Global Internship Program, Lyric believes that young professionals deserve opportunities to contribute meaningful work, develop practical skills, and receive recognition for their achievements. She has taken particular pride in watching students from different countries, educational backgrounds, and professional disciplines grow into capable contributors and emerging leaders.",
      "Her own educational journey continues alongside the companies she is building. For Lyric, the work is deeply personal: an opportunity to demonstrate that growth does not follow a single timetable, that education can begin or continue at any stage of life, and that determination can turn an unconventional path into a purposeful one.",
    ],
    closingStatement: "Her guiding belief is simple: opportunity should not depend on having followed a perfect path to reach it.",
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
    biography: [
      "Darin Latrelle James brings a background in business management, athletics, and organizational leadership to his role as Managing Partner of The Emerson Empire.",
      "Darin earned his bachelor's degree in Business Management from Ferrum College in Virginia in 2024. A football player throughout high school and college, he brings an appreciation for discipline, teamwork, commitment, and the importance of working toward a shared goal.",
      "His personal and professional story is closely connected to that of The Emerson Empire's founder, Lyric Helena Emerson.",
      "Darin and Lyric met in late 2024 and married in late 2025. What began as a personal partnership has grown into a shared commitment to developing three interconnected companies with a focus on education, financial stability, workforce development, and community-centered opportunity.",
      "As Managing Partner, Darin helps coordinate organizational priorities, support strategic planning, strengthen operational systems, and connect the work being carried out across the Emerson companies. His leadership emphasizes dependable communication, accountability, and helping teams translate ambitious ideas into practical action.",
      "Darin is also pursuing an MBA at Southern New Hampshire University. He and Lyric share a commitment to continuing their education and are preparing to pursue doctoral studies, with the goal of expanding their research and community outreach.",
      "Together, they are building something that extends beyond their professional ambitions: an organization grounded in shared purpose, education, service, and the belief that successful institutions should create opportunities for others.",
    ],
    closingStatement: "For Darin and Lyric, The Emerson Empire represents both a family commitment and a long-term vision for meaningful work.",
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
    location: "California State University, Sacramento — Sacramento, California, USA",
    biography: [
      "Shamrit Phagura is an undergraduate student pursuing a Bachelor of Science in Computer Science at California State University, Sacramento, commonly known as Sacramento State.",
      "Shamrit first joined The Emerson Empire Global Internship Program during the summer of 2026, as part of an international cohort of 63 students from around the world. More than half of that inaugural cohort participated in web development, making it one of the program's largest and most collaborative areas of study.",
      "From the beginning, Shamrit distinguished herself through consistent performance, initiative, and a strong commitment to the quality of her work. Week after week, her contributions earned some of the strongest evaluations among her peers. Equally important was her willingness to support the larger team and help turn technical questions into organized, actionable work.",
      "Her development throughout the summer made a lasting impression on the program's founder.",
      "In fall 2026, Shamrit stepped into the role of Computer Science Team Lead, taking on responsibility for coordinating technical development and helping guide the next stage of the companies' digital infrastructure.",
      "She is now leading a team of fellow college students on an academic project to develop an in-house customer relationship management (CRM) system for the Emerson companies. The project brings together classroom learning, software development, systems planning, and the practical requirements of a growing organization.",
      "Shamrit's journey from summer intern to departmental leader reflects the kind of professional growth the Global Internship Program was designed to encourage.",
    ],
    closingStatement: "We are proud of the determination, intelligence, and initiative she has demonstrated, and honored to have her helping lead the future of our computer science department.",
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
    secondaryTitle: 'Executive Assistant to the CEO',
    initials: 'GK',
    department: 'Outreach, people & operations',
    canonicalUrl: profileUrl('godwin-iwatan-kehinde'),
    personId: `${profileUrl('godwin-iwatan-kehinde')}#person`,
    location: "Babcock University — Ilishan-Remo, Ogun State, Nigeria",
    biography: [
      "Godwin-Iwatan Kehinde, affectionately known as Kenny, is an undergraduate student studying International Law and Diplomacy at Babcock University in Nigeria.",
      "Among the younger participants in The Emerson Empire Global Internship Program, Kenny joined the fall 2026 cohort and quickly distinguished herself through her intelligence, initiative, organizational ability, and willingness to take responsibility.",
      "Her work consistently placed her among the strongest contributors in her cohort, but what made her particularly valuable was her ability to see how different parts of an organization must work together.",
      "Kenny demonstrated an understanding that leadership is not simply about completing individual assignments. It is also about creating structure, maintaining clear communication, supporting others, and ensuring that important responsibilities do not fall through the cracks.",
      "She subsequently stepped into leadership responsibilities supporting the Global Internship Program's Human Resources, Finance, and Global Outreach pathways.",
      "Beyond her role in the internship program, Kenny also serves as Executive Assistant to the CEO and supports organizational operations across the Emerson companies.",
      "Her responsibilities connect institutional outreach, administrative coordination, internal communication, and the careful systems that allow a growing international organization to function effectively.",
      "For founder Lyric Helena Emerson, Kenny has become an especially valued collaborator. Her thoughtfulness, consistency, and willingness to step forward have made her an integral part of the company's daily work.",
    ],
    closingStatement: "It is difficult to imagine our day-to-day operations without Kenny's contributions. We are deeply grateful for her dedication and proud of the leader she continues to become.",
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
    title: 'Sales & Business Development Manager',
    initials: 'TT',
    department: 'Sales & business development',
    canonicalUrl: profileUrl('todor-tomic'),
    personId: `${profileUrl('todor-tomic')}#person`,
    location: "Gornji Milanovac, Serbia",
    biography: [
      "At just 21 years old in 2026, Todor Tomic was already balancing substantial professional responsibilities, including full-time work in his family's business in Serbia, with his growing interest in sales, entrepreneurship, and organizational development.",
      "Todor first contributed to The Emerson Empire Global Internship Program during its summer 2026 cohort and continued developing his work into the fall, concentrating increasingly on sales strategy, business development, ethical outreach, and commercial operations.",
      "He quickly demonstrated a natural aptitude for understanding business needs, organizing information, developing practical sales systems, and identifying opportunities for organizational growth.",
      "His initiative and consistently strong evaluations distinguished him among his peers. What began as internship work developed into broader responsibilities involving sales planning, client communication, lead management, and connecting the company's services with the needs of prospective clients.",
      "One of Todor's important contributions has been helping shape the development of Project Studio, an Emerson initiative designed to connect businesses with carefully scoped professional projects. Through this model, the company aims to collaborate with businesses on real work, creating practical learning opportunities while developing responsible, revenue-generating services.",
      "Todor has helped bring valuable thinking to the relationship between sales, marketing, technical development, and operational coordination. His work reflects an understanding that effective business development requires more than persuasion; it requires preparation, integrity, organization, and a genuine commitment to understanding the people and businesses being served.",
      "We are honored to recognize Todor as Sales & Business Development Manager.",
    ],
    closingStatement: "His determination, commercial awareness, and willingness to grow into responsibility have made him an important part of The Emerson Empire's development. We look forward to seeing what he continues to accomplish.",
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

export const leadershipDirectoryTagline = "Founder-led. Built through collaboration. Strengthened by the people who help turn vision into lasting work.";

export const leadershipFounderNote: { paragraphs: string[]; closingStatement: string } = {
  paragraphs: [
    "One of the most meaningful parts of building The Emerson Empire has been watching people grow into responsibilities they may not have imagined for themselves when they first joined us.",
    "Shamrit, Kenny, and Todor each came into the Global Internship Program with different experiences, academic interests, and professional goals. What they share is remarkable initiative, determination, intelligence, and a willingness to learn.",
    "Darin and I have had the privilege of witnessing their development while continuing our own educational and professional journeys.",
    "These individuals have contributed more than completed assignments. They have helped develop the systems, ideas, and organizational practices that will support the Emerson companies as we continue to grow.",
    "Their achievements deserve recognition, and their contributions deserve accurate credit.",
  ],
  closingStatement: "The Emerson Empire is founder-led, but its progress has been shaped by the people who have helped build it.",
};

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
