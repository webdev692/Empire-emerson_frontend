import React from 'react';
import { Link } from 'react-router-dom';

// â”€â”€ Disclaimer sections â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const SECTIONS = [
  {
    id: 'general',
    title: 'General Purpose',
    body: `This website is operated by The Emerson Empire and its affiliated companies â€” The Emerson Agency LLC and Emerson Professional Development Group. The content, services, classes, forms, and resources presented on this site are provided for informational and service-access purposes only. Nothing on this site constitutes legal, financial, tax, investment, employment, or professional advice of any kind. Visitors and clients are encouraged to seek licensed professionals for matters requiring professional licensure.`,
  },
  {
    id: 'no-license',
    title: 'No Professional License Implied',
    body: `The Emerson Empire, The Emerson Agency LLC, and Emerson Professional Development Group are not law firms, licensed financial advisory firms, certified public accounting firms, or licensed insurance agencies. Services described on this site are education-centered, organizational, and support-based in nature. Any reference to tax preparation, insurance review, financial education, or related support does not imply the provision of licensed professional services unless explicitly stated and verified. Clients should confirm the scope of any service before proceeding.`,
  },
  {
    id: 'educational',
    title: 'Educational Services',
    body: `Classes, workshops, group sessions, and educational consultations offered through The Emerson Empire, The Emerson Agency LLC, and Emerson Professional Development Group are educational in nature. Participation in any class or workshop does not constitute professional advice, does not create a client-professional relationship, and does not guarantee any specific knowledge outcome. Educational content is provided for general learning purposes and is subject to change without notice.`,
  },
  {
    id: 'career',
    title: 'Career and Employment Outcomes',
    body: `Resume support, LinkedIn services, interview preparation, career coaching, job search packages, and related professional development services are designed to support and strengthen a client's job readiness. These services do not guarantee employment, job placement, salary outcomes, interview invitations, promotions, career advancement, or any specific professional result. Individual outcomes depend on many factors outside of our control, including employer decisions, market conditions, and individual effort.`,
  },
  {
    id: 'financial',
    title: 'Financial and Tax Outcomes',
    body: `Financial education sessions, tax preparation intake reviews, household financial organization support, and related services are educational and organizational in nature. These services do not guarantee tax refunds, specific tax outcomes, debt reduction, savings amounts, income increases, or any financial result. Tax preparation support is subject to document review, service availability, and client eligibility. Clients with complex tax situations are encouraged to consult a licensed CPA or enrolled agent.`,
  },
  {
    id: 'credit',
    title: 'Credit and Debt Education',
    body: `Credit and debt education sessions are educational support only. These services do not guarantee improvements to credit scores, removal of negative items from credit reports, debt elimination, loan approval, or any credit-related outcome. No representations are made regarding the accuracy of credit-related information as it applies to any individual's specific financial situation. Clients are encouraged to work directly with their creditors and to consult licensed financial professionals when needed.`,
  },
  {
    id: 'business',
    title: 'Business and Revenue Outcomes',
    body: `Business direction consultations, startup organization support, brand intake sessions, operations support, and related business services are designed to help entrepreneurs and small businesses organize and clarify their direction. These services do not guarantee revenue, business growth, sales results, client acquisition, brand visibility, website traffic, or any business outcome. Business results depend on many factors outside of our control, including market conditions, execution, and individual effort.`,
  },
  {
    id: 'internship',
    title: 'Internship Program',
    body: `The Emerson Professional Development Group internship program is an educational and skills-based experience. Completion of the internship program does not guarantee employment, job placement, a formal certification recognized by any licensing body, academic credit (unless independently arranged with an educational institution), or any professional credential. Completion documentation is issued at the discretion of program staff and is contingent on meeting all stated program requirements. Intern names and personal information are not published publicly without explicit consent.`,
  },
  {
    id: 'fee-waiver',
    title: 'Fee Waivers and Sliding-Scale Access',
    body: `Fee waivers and sliding-scale pricing options are available for many services and classes based on financial need and program capacity. The availability of fee waivers is not guaranteed and is subject to review on a case-by-case basis. Requesting a fee waiver does not automatically guarantee approval. We are committed to ensuring that financial barriers do not prevent access to our services and will make reasonable efforts to accommodate those in need within our operational capacity.`,
  },
  {
    id: 'sensitive-info',
    title: 'Sensitive Information',
    body: `When completing any form, registration, or inquiry through this website, clients and visitors are advised not to submit sensitive personal information that is not required for the specific service request. This includes but is not limited to Social Security numbers, full financial account details, medical records, immigration documents, or other personally identifying information beyond what is clearly requested. If a service requires the review of sensitive documents, those documents should be shared only through a secure and agreed-upon process â€” not through general contact forms.`,
  },
  {
    id: 'third-party',
    title: 'Third-Party Platforms',
    body: `This website uses third-party platforms including Google Forms, Google Meet, and Google Sheets for registration, scheduling, and communication purposes. The Emerson Empire is not responsible for the privacy practices, data handling, availability, or functionality of these third-party platforms. By submitting a form or joining a session through a third-party platform, users are subject to that platform's own terms of service and privacy policy. We encourage all users to review the relevant platform policies.`,
  },
  {
    id: 'accuracy',
    title: 'Content and Pricing Accuracy',
    body: `Service descriptions, class schedules, pricing, availability, and other content on this site are subject to change without prior notice. We make reasonable efforts to keep information current and accurate, but we do not warrant that all content is complete, error-free, or up to date at the time of access. Visitors are encouraged to confirm current pricing, availability, and service details by contacting us directly before making decisions based solely on information found on this website.`,
  },
];

// â”€â”€ Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const Disclaimer: React.FC = () => (
  <div className="pt-16 sm:pt-20 min-h-screen bg-white font-sans antialiased">

    {/* Hero */}
    <div className="bg-[#0A1128] px-6 sm:px-10 lg:px-16 py-20">
      <div className="mx-auto max-w-4xl">
        <p className="mb-3 font-mono text-[#C9A84C] text-xs uppercase tracking-[4px]">
          Legal
        </p>
        <h1 className="font-black text-white text-4xl sm:text-5xl uppercase leading-none tracking-tight mb-6">
          Disclaimer
        </h1>
        <div className="bg-[#C9A84C] w-16 h-0.5 mb-6" />
        <p className="text-white/55 text-sm leading-relaxed max-w-2xl">
          Please read the following information carefully. By accessing or using any service, class, form, or resource provided by The Emerson Empire ecosystem, you acknowledge and agree to the terms described below.
        </p>
        <p className="mt-4 font-mono text-white/30 text-xs">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
    </div>

    {/* Content */}
    <div className="mx-auto px-6 sm:px-10 lg:px-16 py-16 max-w-4xl">

      {/* Quick nav */}
      <div className="bg-[#FAFAF9] border border-neutral-100 p-6 mb-12">
        <p className="font-mono text-[#4B1E91] text-xs uppercase tracking-widest mb-4">
          Sections
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="flex items-center gap-2 py-1.5 text-xs text-neutral-500 hover:text-[#4B1E91] transition-colors duration-150"
            >
              <span className="text-[#C9A84C] text-xs">â†’</span>
              {s.title}
            </a>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-12">
        {SECTIONS.map((s, i) => (
          <div key={s.id} id={s.id} className="scroll-mt-24">
            <div className="flex items-start gap-4 mb-3">
              <span className="font-mono text-[#C9A84C]/50 text-xs pt-1 shrink-0 w-6">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h2 className="font-bold text-[#0A1128] text-lg sm:text-xl uppercase tracking-tight">
                {s.title}
              </h2>
            </div>
            <div className="pl-10">
              <p className="text-neutral-600 text-sm leading-[1.9]">{s.body}</p>
            </div>
            {i < SECTIONS.length - 1 && (
              <div className="mt-12 border-b border-neutral-100" />
            )}
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div className="mt-16 bg-[#4B1E91]/5 border border-[#4B1E91]/15 px-6 py-5">
        <p className="font-mono text-[#4B1E91] text-xs uppercase tracking-widest mb-2">
          Questions About This Disclaimer
        </p>
        <p className="text-neutral-600 text-sm leading-relaxed mb-4">
          If you have questions about any section of this disclaimer or how it applies to a specific service, please reach out to us before proceeding.
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 bg-[#4B1E91] hover:bg-[#3d1778] px-6 py-3 font-mono text-white text-xs uppercase tracking-wider transition-colors duration-200"
        >
          Contact Us
        </Link>
      </div>
    </div>
  </div>
);

export default Disclaimer;
