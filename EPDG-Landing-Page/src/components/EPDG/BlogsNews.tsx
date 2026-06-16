import React from "react";

const posts = [
  {
    tag: "Career Tips",
    date: "May 12, 2025",
    title: "5 Reasons Including Building Your Career Foundation",
    excerpt:
      "Discover the key pillars of a strong professional foundation and how EPDG classes help you build them step by step.",
  },
  {
    tag: "Strategy",
    date: "May 8, 2025",
    title: "Beyond Basics: Mastering Executive Presence & LinkedIn Growth",
    excerpt:
      "Learn how top professionals leverage executive presence and LinkedIn strategy to unlock new levels of opportunity.",
  },
  {
    tag: "Success Stories",
    date: "Apr 30, 2025",
    title: "The Data Science Side in a Month: How Students Launch Tech Careers",
    excerpt:
      "Real stories from EPDG participants who pivoted into tech roles within weeks of completing the program.",
  },
];

const BlogsNews: React.FC = () => {
  return (
    <section className="bg-[#F9F7F2] py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <p className="text-[#C9A84C] text-xs font-bold tracking-[0.25em] uppercase mb-2">
          Resources
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-[#0A1F17] mb-3 tracking-tight">
          Blogs and News
        </h2>
        <div className="w-12 h-0.5 bg-[#044E37] mb-5" />
        <p className="text-gray-500 text-sm max-w-xl mb-12 leading-relaxed">
          Discover tips, stories, and professional development resources covering career readiness,
          workplace strategy, and EPDG community updates.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((p) => (
            <div
              key={p.title}
              className="bg-white shadow-sm overflow-hidden flex flex-col group cursor-pointer"
            >
              {/* Image placeholder */}
              <div className="bg-[#044E37]/10 h-48 flex items-center justify-center relative overflow-hidden">
                <div className="text-center">
                  <div className="w-8 h-0.5 bg-[#C9A84C] mx-auto mb-2" />
                  <p className="text-[#044E37]/60 text-sm uppercase tracking-[0.15em]">EPDG</p>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-[#044E37] text-white text-sm font-bold px-2.5 py-1 uppercase tracking-wider">
                    {p.tag}
                  </span>
                  <span className="text-gray-400 text-sm">{p.date}</span>
                </div>
                <h3 className="font-bold text-[#0A1F17] text-sm mb-3 leading-snug group-hover:text-[#044E37] transition-colors">
                  {p.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed flex-1">{p.excerpt}</p>
                <div className="mt-5 pt-4 border-t border-gray-100">
                  <span className="text-[#044E37] text-sm font-bold uppercase tracking-wider group-hover:text-[#C9A84C] transition-colors">
                    Read More →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogsNews;
