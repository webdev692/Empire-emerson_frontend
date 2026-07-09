export interface ClassItem {
  id: number;
  title: string;
  day: string;
  time: string;
  duration: string;
  durationMinutes: number;
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

type TierId = 'free' | 'workshop' | 'intensive';

const tierDetails: Record<TierId, Pick<ClassItem, 'time' | 'duration' | 'durationMinutes' | 'ticketType' | 'price' | 'spotsTotal'>> = {
  free: {
    time: '10:00 AM EDT',
    duration: '60 minutes',
    durationMinutes: 60,
    ticketType: 'Free Classes',
    price: 0,
    spotsTotal: 150,
  },
  workshop: {
    time: '2:00 PM EDT',
    duration: '90 minutes',
    durationMinutes: 90,
    ticketType: 'Paid Workshops',
    price: 10,
    spotsTotal: 40,
  },
  intensive: {
    time: '7:00 PM EDT',
    duration: '2 hours',
    durationMinutes: 120,
    ticketType: 'Paid Intensives',
    price: 20,
    spotsTotal: 25,
  },
};

function makeClass(
  id: number,
  tier: TierId,
  day: string,
  title: string,
  theme: string,
  category: string,
  description: string,
  spotsTaken: number,
  featured = false,
): ClassItem {
  return {
    id,
    title,
    day,
    ...tierDetails[tier],
    theme,
    category,
    description,
    spotsTaken,
    status: 'ongoing',
    featured,
  };
}

export const classes: ClassItem[] = [
  makeClass(
    1,
    'free',
    'Monday',
    'Career Readiness 101: Building a Professional Foundation',
    'Career Readiness & Professional Foundations',
    'Career Readiness / Professional Development',
    'A beginner-friendly class for students, job seekers, workers, career changers, and emerging professionals who want a clear starting point for professional development, confidence, and career organization.',
    91,
    true,
  ),
  makeClass(
    2,
    'workshop',
    'Monday',
    'Resume, Cover Letter, and LinkedIn Profile Workshop',
    'Career Readiness & Professional Foundations',
    'Resume Writing / Cover Letters / LinkedIn',
    'A practical workshop for strengthening resumes, cover letters, LinkedIn profiles, and core career materials so participants can present their experience with more clarity and professionalism.',
    22,
  ),
  makeClass(
    3,
    'intensive',
    'Monday',
    'Job Search Strategy Lab: Applications, Interviews, and Follow-Up',
    'Career Readiness & Professional Foundations',
    'Job Search / Interviews / Follow-Up',
    'A structured lab that helps participants organize applications, prepare for interviews, evaluate roles, track opportunities, and follow up professionally.',
    18,
  ),

  makeClass(
    4,
    'free',
    'Tuesday',
    'Budgeting Basics: Building a Household Money System',
    'Personal Finance & Household Stability',
    'Budgeting / Household Finance / Financial Literacy',
    'A calm, practical introduction to organizing income, bills, groceries, savings goals, and weekly money check-ins without shame or complicated financial language.',
    104,
  ),
  makeClass(
    5,
    'workshop',
    'Tuesday',
    'Credit, Debt, and Financial Confidence',
    'Personal Finance & Household Stability',
    'Credit Education / Debt Management / Financial Confidence',
    'A supportive workshop explaining credit, debt, financial habits, and responsible next steps in plain language for adults, students, families, workers, and entrepreneurs.',
    27,
  ),
  makeClass(
    6,
    'intensive',
    'Tuesday',
    'The 30-Day Financial Reset Workshop',
    'Personal Finance & Household Stability',
    'Budgeting / Financial Reset / 30-Day Planning',
    'A guided reset session focused on reviewing the current financial picture, organizing bills and income, setting priorities, and building a realistic 30-day money plan.',
    16,
  ),

  makeClass(
    7,
    'free',
    'Wednesday',
    'Tax Readiness for Individuals and Families',
    'Tax & Insurance Literacy',
    'Tax Readiness / Document Organization / Family Finance',
    'A free educational class that helps individuals and families understand common tax documents, create a tax folder, and prepare better questions before working with a tax professional.',
    78,
  ),
  makeClass(
    8,
    'workshop',
    'Wednesday',
    'Small Business Tax Organization: Receipts, Income, Mileage, and Deductions',
    'Tax & Insurance Literacy',
    'Small Business Tax Organization / Receipts / Mileage',
    'A practical workshop for freelancers, contractors, service providers, side hustlers, and small business owners who want a clearer system for income, expenses, receipts, and mileage.',
    19,
  ),
  makeClass(
    9,
    'intensive',
    'Wednesday',
    'Bookkeeping Basics for New Entrepreneurs',
    'Tax & Insurance Literacy',
    'Bookkeeping / Business Finance / New Entrepreneurs',
    'A beginner-friendly intensive introducing income, expenses, profit, cash flow, business transaction categories, and monthly bookkeeping routines for new entrepreneurs.',
    12,
  ),

  makeClass(
    10,
    'free',
    'Thursday',
    'Starting Small: Turning a Skill, Service, or Idea into a Real Business',
    'Business Development & Entrepreneurship',
    'Entrepreneurship / First Offer / Business Startup',
    'A free class for aspiring entrepreneurs, creatives, freelancers, students, and service providers who want to move from a vague idea to clear first business steps.',
    63,
  ),
  makeClass(
    11,
    'workshop',
    'Thursday',
    'Pricing Your Services Without Undervaluing Yourself',
    'Business Development & Entrepreneurship',
    'Pricing / Service Businesses / Ethical Communication',
    'A workshop that helps beginners and early-stage service providers understand fair pricing, avoid underpricing mistakes, and communicate prices professionally.',
    24,
  ),
  makeClass(
    12,
    'intensive',
    'Thursday',
    'Business Launch Lab: Offer, Audience, Platform, and First 30 Days',
    'Business Development & Entrepreneurship',
    'Business Launch / Offer Strategy / 30-Day Plan',
    'A hands-on lab for defining a first offer, identifying an audience, choosing a visibility platform, and building a realistic first 30-day launch plan.',
    16,
  ),

  makeClass(
    13,
    'free',
    'Friday',
    'Sales Without Pressure: Ethical Outreach for Beginners',
    'Sales, Marketing & Digital Presence',
    'Sales / Ethical Outreach / Communication',
    'A free class introducing sales as respectful communication, listening, service, and professional follow-up without pressure tactics or exaggerated claims.',
    55,
  ),
  makeClass(
    14,
    'workshop',
    'Friday',
    'Appointment Setting and Client Follow-Up Workshop',
    'Sales, Marketing & Digital Presence',
    'Appointment Setting / Client Follow-Up / Outreach Systems',
    'A workshop focused on scheduling conversations, confirming meetings, writing professional follow-ups, and keeping client or partner communication organized.',
    21,
  ),
  makeClass(
    15,
    'intensive',
    'Friday',
    'CRM and Lead Tracking Basics for Small Teams',
    'Sales, Marketing & Digital Presence',
    'CRM / Lead Tracking / Small Team Systems',
    'An intensive that helps small teams build simple systems for tracking contacts, lead status, notes, follow-up dates, and responsibilities.',
    14,
  ),

  makeClass(
    16,
    'free',
    'Saturday',
    'Building Your Digital Presence: Website, Social Media, and Trust',
    'Sales, Marketing & Digital Presence',
    'Digital Presence / Websites / Social Media / Trust',
    'A free class explaining how websites, social media, professional profiles, and consistent messaging work together to build trust and credibility online.',
    68,
  ),
  makeClass(
    17,
    'workshop',
    'Saturday',
    'Content Planning for Small Businesses and Personal Brands',
    'Sales, Marketing & Digital Presence',
    'Content Strategy / Social Media / Personal Brand',
    'A workshop for turning services, values, audience needs, and experience into practical content pillars, captions, posting ideas, and a simple content plan.',
    17,
  ),
  makeClass(
    18,
    'intensive',
    'Saturday',
    'LinkedIn, Facebook, Instagram, and TikTok Strategy for Beginners',
    'Sales, Marketing & Digital Presence',
    'Platform Strategy / Social Media / Digital Visibility',
    'A platform strategy intensive helping beginners compare major social platforms, choose priorities, and create a simple weekly visibility plan.',
    11,
  ),

  makeClass(
    19,
    'free',
    'Sunday',
    'Weekly Life and Career Reset: Goals, Planning, and Accountability',
    'Professional Growth & Next Steps',
    'Goal Setting / Weekly Planning / Accountability',
    'A free weekly reset class for reviewing the past week, setting realistic priorities, and creating a practical action plan for life, work, career, and business goals.',
    48,
  ),
  makeClass(
    20,
    'workshop',
    'Sunday',
    'Leadership and Communication for Emerging Professionals',
    'Professional Growth & Next Steps',
    'Leadership / Communication / Emerging Professionals',
    'A workshop for interns, students, new employees, team leads, entrepreneurs, and volunteers who want to communicate clearly, take initiative, and build trust through follow-through.',
    13,
  ),
  makeClass(
    21,
    'intensive',
    'Sunday',
    'Professional Development Portfolio Lab',
    'Professional Growth & Next Steps',
    'Portfolio Development / Career Evidence / Professional Growth',
    'A hands-on portfolio lab that helps participants organize projects, certificates, reports, screenshots, writing samples, reflections, skills, and accomplishments into professional evidence.',
    9,
  ),
];
