export interface ClassItem {
  id: number;
  title: string;
  day: string;
  time: string;
  ticketType: string;
  theme: string;
  category: string;
  description: string;
  price: number;
  spotsTotal: number;
  spotsTaken: number;
  status: 'ongoing' | 'upcoming';
  featured?: boolean;
}

export const classes: ClassItem[] = [

  // ── MONDAY ────────────────────────────────────────────────────────────────────
  {
    id: 1,
    title: "Career Readiness Foundations",
    day: "Monday",
    time: "5:00 PM EDT",
    ticketType: "Free Classes",
    theme: "Career Readiness & Professional Foundations",
    category: "Career Readiness / Professional Development",
    description:
      "An entry-level introduction to career readiness covering professionalism, workplace expectations, communication standards, and what employers look for. Ideal for students, job seekers, career changers, and anyone preparing to enter or re-enter the workforce. Waiver available for those who need it.",
    price: 0,
    spotsTotal: 150,
    spotsTaken: 91,
    status: "ongoing",
    featured: true,
  },
  {
    id: 2,
    title: "Resume Basics and Professional Documents",
    day: "Monday",
    time: "7:00 PM EDT",
    ticketType: "Paid Workshops",
    theme: "Career Readiness & Professional Foundations",
    category: "Career Readiness / Resume Writing / Professional Documents",
    description:
      "A practical workshop on building and improving resumes, cover letters, and professional reference lists. Participants will learn how to structure a resume by experience level, write strong bullet points, and tailor documents to specific job postings. Fee waiver available.",
    price: 15,
    spotsTotal: 40,
    spotsTaken: 22,
    status: "ongoing",
  },
  {
    id: 15,
    title: "Sales Basics, Ethical Outreach, and Appointment Setting",
    day: "Monday",
    time: "6:00 PM EDT",
    ticketType: "Paid Intensives",
    theme: "Sales, Marketing & Digital Presence",
    category: "Sales / Outreach / Appointment Setting",
    description:
      "A hands-on intensive for entrepreneurs, interns, and service providers who need to communicate their offer confidently and professionally. Covers outreach scripts, appointment-setting language, follow-up timing, and respectful selling — without pressure tactics. Fee waiver available.",
    price: 35,
    spotsTotal: 25,
    spotsTaken: 14,
    status: "ongoing",
  },

  // ── TUESDAY ───────────────────────────────────────────────────────────────────
  {
    id: 3,
    title: "LinkedIn Profile and Professional Branding",
    day: "Tuesday",
    time: "5:00 PM EDT",
    ticketType: "Paid Workshops",
    theme: "Career Readiness & Professional Foundations",
    category: "LinkedIn / Professional Branding / Digital Presence",
    description:
      "This workshop helps participants build and optimize a LinkedIn profile that reflects their skills, goals, and professional identity. Topics include headline writing, summary drafting, experience descriptions, and how to use LinkedIn to support a job search or business presence. Fee waiver available.",
    price: 15,
    spotsTotal: 40,
    spotsTaken: 29,
    status: "ongoing",
  },
  {
    id: 4,
    title: "Interview Preparation and Professional Confidence",
    day: "Tuesday",
    time: "7:00 PM EDT",
    ticketType: "Paid Workshops",
    theme: "Career Readiness & Professional Foundations",
    category: "Interview Preparation / Career Readiness / Confidence Building",
    description:
      "Participants will practice answering common interview questions using the STAR method, learn how to handle tough questions, and build confidence for high-stakes interviews. Includes guidance on pre-interview research, professional attire, and post-interview follow-up. Fee waiver available.",
    price: 15,
    spotsTotal: 40,
    spotsTaken: 18,
    status: "ongoing",
  },
  {
    id: 16,
    title: "Digital Marketing Strategy Foundations",
    day: "Tuesday",
    time: "6:00 PM EDT",
    ticketType: "Paid Intensives",
    theme: "Sales, Marketing & Digital Presence",
    category: "Digital Marketing / Strategy / Business Growth",
    description:
      "A strategy-focused intensive covering how to identify a target audience, choose the right platforms, craft consistent messaging, and build a beginner-friendly marketing plan. Designed for entrepreneurs, small business owners, and professionals building their brand online. Fee waiver available.",
    price: 35,
    spotsTotal: 25,
    spotsTaken: 11,
    status: "ongoing",
  },

  // ── WEDNESDAY ─────────────────────────────────────────────────────────────────
  {
    id: 5,
    title: "Job Search Strategy and Application Organization",
    day: "Wednesday",
    time: "5:00 PM EDT",
    ticketType: "Paid Workshops",
    theme: "Career Readiness & Professional Foundations",
    category: "Job Search / Application Organization / Career Readiness",
    description:
      "This workshop helps participants move from scattered job searching to an organized, consistent process. Attendees will learn how to evaluate job postings, track applications, prioritize opportunities, and write professional follow-up messages. Fee waiver available.",
    price: 15,
    spotsTotal: 40,
    spotsTaken: 25,
    status: "ongoing",
  },
  {
    id: 6,
    title: "Remote Work Readiness and Digital Professionalism",
    day: "Wednesday",
    time: "7:00 PM EDT",
    ticketType: "Paid Workshops",
    theme: "Career Readiness & Professional Foundations",
    category: "Remote Work / Digital Professionalism / Workplace Skills",
    description:
      "Covers the standards, tools, and habits needed to work effectively in remote and hybrid environments. Topics include professional email and messaging etiquette, video call preparation, time management, and how to stay visible and productive as a remote team member. Fee waiver available.",
    price: 15,
    spotsTotal: 40,
    spotsTaken: 16,
    status: "ongoing",
  },
  {
    id: 17,
    title: "Content Strategy and Social Media Planning",
    day: "Wednesday",
    time: "6:00 PM EDT",
    ticketType: "Paid Intensives",
    theme: "Sales, Marketing & Digital Presence",
    category: "Content Strategy / Social Media / Marketing",
    description:
      "A practical intensive on building a content plan that supports visibility and growth. Participants will develop content pillars, draft captions, build a basic posting schedule, and learn what types of content perform best on each platform. Includes a starter 30-day content calendar exercise. Fee waiver available.",
    price: 35,
    spotsTotal: 25,
    spotsTaken: 17,
    status: "ongoing",
  },

  // ── THURSDAY ──────────────────────────────────────────────────────────────────
  {
    id: 7,
    title: "Professional Communication and Workplace Etiquette",
    day: "Thursday",
    time: "5:00 PM EDT",
    ticketType: "Paid Workshops",
    theme: "Workplace Skills & Leadership",
    category: "Professional Communication / Workplace Etiquette / Career Readiness",
    description:
      "Covers written and verbal communication skills expected in professional environments. Topics include email structure, meeting participation, tone and language standards, giving and receiving feedback, and how to navigate difficult workplace conversations professionally. Fee waiver available.",
    price: 15,
    spotsTotal: 40,
    spotsTaken: 20,
    status: "ongoing",
  },
  {
    id: 8,
    title: "Leadership, Initiative, and Team Collaboration",
    day: "Thursday",
    time: "7:00 PM EDT",
    ticketType: "Paid Workshops",
    theme: "Workplace Skills & Leadership",
    category: "Leadership / Team Collaboration / Professional Development",
    description:
      "Designed for emerging professionals, students, interns, and new team leads who want to build leadership skills without a formal title. Covers how to take initiative, contribute to a team, communicate under pressure, and develop accountability and follow-through. Fee waiver available.",
    price: 15,
    spotsTotal: 40,
    spotsTaken: 13,
    status: "ongoing",
  },
  {
    id: 18,
    title: "Website, Landing Page, and Digital Presence Basics",
    day: "Thursday",
    time: "6:00 PM EDT",
    ticketType: "Paid Intensives",
    theme: "Sales, Marketing & Digital Presence",
    category: "Website / Landing Page / Digital Presence",
    description:
      "A beginner-friendly intensive on building a professional digital presence. Covers what makes a landing page effective, how to write service descriptions and bios, what trust signals matter to clients and employers, and how to align your website with your social media and outreach. Fee waiver available.",
    price: 35,
    spotsTotal: 25,
    spotsTaken: 9,
    status: "ongoing",
  },

  // ── FRIDAY ────────────────────────────────────────────────────────────────────
  {
    id: 9,
    title: "Budgeting Basics and Household Financial Organization",
    day: "Friday",
    time: "5:00 PM EDT",
    ticketType: "Free Classes",
    theme: "Personal Finance & Household Stability",
    category: "Financial Literacy / Budgeting / Household Stability",
    description:
      "A beginner-friendly, nonjudgmental class that helps participants organize income, bills, expenses, and savings goals into a clear household money system. Designed for families, individuals, and anyone who wants to better understand where their money is going. Waiver available.",
    price: 0,
    spotsTotal: 150,
    spotsTaken: 104,
    status: "ongoing",
  },
  {
    id: 10,
    title: "Credit, Debt, and Financial Decision-Making",
    day: "Friday",
    time: "7:00 PM EDT",
    ticketType: "Paid Workshops",
    theme: "Personal Finance & Household Stability",
    category: "Credit Education / Debt Management / Financial Literacy",
    description:
      "Helps participants understand credit scores, credit reports, types of debt, interest rates, and how financial decisions compound over time. The class is supportive and practical — focused on understanding and next steps, not judgment. Fee waiver available.",
    price: 15,
    spotsTotal: 40,
    spotsTaken: 27,
    status: "ongoing",
  },
  {
    id: 19,
    title: "Customer Service and Client Communication",
    day: "Friday",
    time: "6:00 PM EDT",
    ticketType: "Paid Workshops",
    theme: "Professional Growth & Next Steps",
    category: "Customer Service / Client Communication / Professional Development",
    description:
      "Covers how to handle client inquiries, complaints, and difficult situations professionally. Participants will learn communication scripts, de-escalation language, follow-up systems, and how to maintain professionalism under pressure — whether in a business or employment context. Fee waiver available.",
    price: 15,
    spotsTotal: 40,
    spotsTaken: 15,
    status: "ongoing",
  },

  // ── SATURDAY ──────────────────────────────────────────────────────────────────
  {
    id: 11,
    title: "Tax Readiness and Document Organization",
    day: "Saturday",
    time: "11:00 AM EDT",
    ticketType: "Free Classes",
    theme: "Tax & Insurance Literacy",
    category: "Tax Readiness / Financial Literacy / Community Education",
    description:
      "Helps individuals and families gather, organize, and prepare tax documents before working with a qualified tax professional. Topics include common tax forms (W-2, 1099), building a tax folder, tracking missing documents, and preparing questions for a preparer. This is a readiness class, not a tax preparation service. Waiver available.",
    price: 0,
    spotsTotal: 150,
    spotsTaken: 78,
    status: "ongoing",
  },
  {
    id: 12,
    title: "Insurance Literacy and Family Protection Basics",
    day: "Saturday",
    time: "1:00 PM EDT",
    ticketType: "Free Classes",
    theme: "Tax & Insurance Literacy",
    category: "Insurance Literacy / Financial Literacy / Family Protection",
    description:
      "A plain-language overview of health, auto, renter's, and life insurance. Participants will learn what each type of coverage does, how to read a basic policy summary, what questions to ask an agent, and how to identify gaps in household protection. Waiver available.",
    price: 0,
    spotsTotal: 150,
    spotsTaken: 62,
    status: "ongoing",
  },
  {
    id: 13,
    title: "Small Business Startup Organization",
    day: "Saturday",
    time: "3:00 PM EDT",
    ticketType: "Paid Intensives",
    theme: "Business Development & Entrepreneurship",
    category: "Entrepreneurship / Small Business Education / Business Development",
    description:
      "Covers the foundational steps to organize a new or informal business, including business structure basics, naming, record-keeping, and separating personal and business finances. Designed for people who have a skill or service and want to formalize and grow it properly. Fee waiver available.",
    price: 35,
    spotsTotal: 25,
    spotsTaken: 16,
    status: "ongoing",
  },
  {
    id: 14,
    title: "Business Operations and Client Intake Systems",
    day: "Saturday",
    time: "5:00 PM EDT",
    ticketType: "Paid Intensives",
    theme: "Business Development & Entrepreneurship",
    category: "Business Operations / Client Intake / Systems Building",
    description:
      "Helps entrepreneurs and service providers build repeatable systems for onboarding clients, managing schedules, collecting payments, and maintaining records. Participants will leave with a basic intake flow and an understanding of what operational consistency looks like for a small business. Fee waiver available.",
    price: 35,
    spotsTotal: 25,
    spotsTaken: 12,
    status: "ongoing",
  },
  {
    id: 20,
    title: "Professional Development Planning and Goal Setting",
    day: "Saturday",
    time: "7:00 PM EDT",
    ticketType: "Free Classes",
    theme: "Professional Growth & Next Steps",
    category: "Professional Development / Goal Setting / Planning",
    description:
      "Supports participants in creating a 30–90 day professional development plan built around realistic goals, not perfection. Covers how to identify priorities, set measurable goals, build accountability systems, and track progress over time — whether focused on career, business, or personal growth. Waiver available.",
    price: 0,
    spotsTotal: 150,
    spotsTaken: 55,
    status: "ongoing",
  },

  // ── SUNDAY ────────────────────────────────────────────────────────────────────
  {
    id: 21,
    title: "Career, Business, and Financial Next Steps Workshop",
    day: "Sunday",
    time: "5:00 PM EDT",
    ticketType: "Free Classes",
    theme: "Professional Growth & Next Steps",
    category: "Career / Business / Financial Planning / Community Education",
    description:
      "A community-focused wrap-up class that brings together the key themes from across the weekly series. Participants will review their progress, connect key takeaways across career, finance, and business topics, identify their most urgent next steps, and learn how to access additional support through The Emerson Empire. Waiver available.",
    price: 0,
    spotsTotal: 150,
    spotsTaken: 48,
    status: "ongoing",
  },

];
