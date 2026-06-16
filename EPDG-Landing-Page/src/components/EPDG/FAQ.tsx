import React, { useState } from "react";

const faqs = [
  {
    question: "Are all classes free?",
    answer:
      "Some classes are free. Some workshops and intensives are low-cost paid sessions. Each class is clearly labeled on the website.",
  },
  {
    question: "How do I register for a class?",
    answer:
      "Registration is available through Eventbrite. Each class card on the website has a direct registration link.",
  },
  {
    question: "What if I can't afford the class fee?",
    answer:
      "Free or reduced-cost support may be available for students, active interns, low-income individuals, unemployed job seekers, single parents, caregivers, and individuals experiencing hardship. Use the fee waiver request form on this page.",
  },
  {
    question: "Do the classes provide financial, tax, legal, or insurance advice?",
    answer:
      "No. All classes are for general educational purposes only. Individualized support may be requested separately through a consultation.",
  },
  {
    question: "Is the internship program free?",
    answer:
      "Yes. Internship participation is free whenever possible. Participation does not guarantee employment, compensation, academic credit, or future placement.",
  },
  {
    question: "Can my school, library, or organization partner with EPDG?",
    answer:
      "Yes. EPDG works with schools, libraries, workforce programs, and community organizations. Submit a partnership inquiry using the contact form on this page.",
  },
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <p className="text-yellow-600 text-xs font-bold tracking-widest uppercase mb-1">
          Have Questions?
        </p>
        <h2 className="text-3xl font-bold text-gray-900 mb-8">FAQs</h2>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                className="cursor-pointer w-full text-left px-5 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="text-sm font-medium text-gray-800">{faq.question}</span>
                <span className="text-gray-400 text-xl ml-4 leading-none">
                  {openIndex === i ? "−" : "+"}
                </span>
              </button>
              {openIndex === i && (
                <div className="px-5 pb-4 text-sm text-gray-600 bg-white">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
