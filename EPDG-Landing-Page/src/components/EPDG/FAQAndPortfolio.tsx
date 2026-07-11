import React, { useState } from "react";

const faqs = [
  {
    question: "I have no prior experience. Can I really build a portfolio?",
    answer:
      "Absolutely. EPDG classes and internships are designed specifically for beginners. You'll complete real projects and build a portfolio from day one, regardless of prior experience.",
  },
  {
    question: "How does EPDG prepare my path to a leadership role?",
    answer:
      "EPDG offers dedicated tracks for leadership readiness including executive presence coaching, mentorship, and strategic career planning sessions tailored to your goals.",
  },
  {
    question: "Will I be able to earn a JOB after completing the program?",
    answer:
      "Many EPDG participants pursue new opportunities within weeks of completing the program. We provide job search support, employer connections, and ongoing coaching to maximize your placement chances.",
  },
  {
    question: "What makes EPDG different from other professional development programs?",
    answer:
      "EPDG combines live weekly classes, personalized coaching, real internship experiences, and a global mentorship network — all at free or low cost, with fee waivers available.",
  },
];

const FAQAndPortfolio: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-white py-20 px-4">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16">

        {/* LEFT — FAQ */}
        <div className="flex-1">
          <p className="text-[#C9A84C] text-xs font-bold tracking-[0.25em] uppercase mb-2">
            Have Questions?
          </p>
          <h2 className="text-3xl font-bold text-[#0A1F17] mb-3 tracking-tight">FAQs</h2>
          <div className="w-12 h-0.5 bg-[#044E37] mb-8" />

          <div className="flex flex-col gap-2">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-gray-100 overflow-hidden">
                <button
                  className="cursor-pointer w-full text-left px-5 py-4 flex items-center justify-between bg-white hover:bg-[#F9F7F2] transition-colors duration-200"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                >
                  <span className="text-sm font-semibold text-[#0A1F17] pr-4 leading-snug">
                    {faq.question}
                  </span>
                  <span
                    className={`shrink-0 w-6 h-6 flex items-center justify-center border transition-all duration-200 ${
                      openIndex === i
                        ? "border-[#044E37] bg-[#044E37] text-white"
                        : "border-gray-200 text-gray-400"
                    }`}
                  >
                    <span className="text-sm leading-none font-bold">
                      {openIndex === i ? "−" : "+"}
                    </span>
                  </span>
                </button>
                {openIndex === i && (
                  <div className="px-5 pb-5 text-sm text-gray-500 bg-[#F9F7F2] leading-relaxed border-t border-gray-100">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Portfolio */}
        <div className="flex-1">
          <p className="text-[#C9A84C] text-xs font-bold tracking-[0.25em] uppercase mb-2">
            Your Work, Showcased
          </p>
          <h2 className="text-3xl font-bold text-[#0A1F17] mb-3 tracking-tight">Portfolio</h2>
          <div className="w-12 h-0.5 bg-[#044E37] mb-5" />
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            Every EPDG participant builds a real portfolio of work through classes, internships, and
            projects. Your portfolio becomes your proof of skills — tangible, employer-ready, and
            uniquely yours.
          </p>

          {/* 2x2 grid */}
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-[#044E37]/8 border border-[#044E37]/10 h-32 flex items-center justify-center"
              >
                <div className="text-center">
                  <div className="w-6 h-0.5 bg-[#C9A84C] mx-auto mb-2" />
                  <p className="text-[#044E37]/60 text-sm uppercase tracking-widest">
                    Item {n}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default FAQAndPortfolio;
