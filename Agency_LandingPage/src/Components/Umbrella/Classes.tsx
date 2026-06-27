import React, { useState } from "react";
import { ArrowDown, ArrowRight, Calendar, Clock } from "lucide-react";
import { classes } from "../data/classData";
import ClassSearch from "./ClassSearch";

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Pick a Class",
    body: "Browse the weekly schedule. Filter by topic, access tier, or day of the week to find the session that fits your goals.",
  },
  {
    step: "02",
    title: "Register",
    body: "Enter your name and email. Free classes are always free. Paid workshops run $10-$25 and intensives run $25-$50. Fee waivers are available - no one is turned away.",
  },
  {
    step: "03",
    title: "Join via Google Meet",
    body: "A Google Meet link is emailed to you before the session. Join from any device, anywhere in the world.",
  },
];

type TabId = "ongoing" | "upcoming";

const ClassCatalog: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>("ongoing");

  const ongoingClasses  = classes.filter((c) => c.status === "ongoing");
  const upcomingClasses = classes.filter((c) => c.status === "upcoming");
  const featuredClass   = classes.find((c) => c.featured);

  const scrollToCatalog = (tab: TabId) => {
    setActiveTab(tab);
    setTimeout(() => {
      document.getElementById("class-catalog")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <div className="bg-white selection:bg-[#4B1E91] pt-16 sm:pt-20 min-h-screen font-body text-black selection:text-white antialiased">

      {/* ──────────────────────────────────────────────────────────── */}
      <div id="weekly-classes" className="bg-[#0A1128] text-white">
        <section className="mx-auto px-4 sm:px-6 lg:px-8 py-20 max-w-4xl text-center">
          <span className="inline-block mb-4 font-mono text-[#C9A84C] text-xs uppercase tracking-[4px]">
            Weekly Class Series
          </span>
          <h1 className="mt-2 mb-6 font-heading font-black text-white text-4xl sm:text-5xl lg:text-6xl uppercase leading-none tracking-tight">
            Free &amp; Low-Cost<br />
            <span className="text-[#C9A84C]">Weekly Classes</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl font-body text-white/65 text-base text-center leading-relaxed">
         The Emerson Empire classes series offer 21 free & low-cost online classes every week covering career readiness, financial literacy, tax readiness,
            entrepreneurship, sales, digital presence, leadership, and professional development.
            Held via Google Meet — open to anyone, no experience required.
          </p>
          <div className="flex sm:flex-row flex-col justify-center items-center gap-4">
            <button
              onClick={() => scrollToCatalog("ongoing")}
              className="bg-[#C9A84C] hover:bg-[#b8933e] px-8 py-3.5 w-full sm:w-auto font-mono font-bold text-[#0A1128] text-xs uppercase tracking-wider transition-colors duration-200"
            >
              Explore All {ongoingClasses.length} Classes <ArrowDown className="inline ml-1" size={16} />
            </button>
            <button
              onClick={() => scrollToCatalog("upcoming")}
              className="bg-transparent hover:bg-[#C9A84C]/10 px-8 py-3.5 border border-[#C9A84C] w-full sm:w-auto font-mono text-[#C9A84C] text-xs uppercase tracking-wider transition-colors duration-200"
            >
              View Upcoming ({upcomingClasses.length})
            </button>
          </div>
        </section>

        {/* Access Tiers */}
        <section className="mx-auto px-4 sm:px-6 lg:px-8 pb-16 max-w-7xl">
          <div className="bg-white/4 p-6 md:p-8 border border-[#C9A84C]/20">
            <h2 className="mb-6 font-mono text-[#C9A84C]/60 text-xs uppercase tracking-widest">
              Core Learning Tracks & Access Tiers
            </h2>
            <div className="gap-8 grid grid-cols-1 md:grid-cols-3">
              <div className="pl-4 border-[#C9A84C] border-l-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="bg-[#C9A84C] px-2 py-0.5 font-mono font-bold text-[#0A1128] text-xs uppercase">Free Classes</span>
                  <span className="font-bold text-[#C9A84C] text-sm">FREE</span>
                </div>
                <h3 className="mb-1 font-heading font-bold text-white text-base">Free General Admission</h3>
                <p className="font-body text-white/60 text-sm leading-relaxed">
                  Foundational sessions open to everyone — no cost, no barrier. Covers career readiness, budgeting, tax readiness, insurance literacy, and professional growth basics.
                </p>
              </div>
              <div className="pl-4 border-[#4B1E91] border-l-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="bg-[#4B1E91] px-2 py-0.5 font-mono text-white text-xs uppercase">Paid Workshops</span>
                  <span className="font-heading font-bold text-white text-sm">$10—$25</span>
                </div>
                <h3 className="mb-1 font-heading font-bold text-white text-base">Workshop Access</h3>
                <p className="font-body text-white/60 text-sm leading-relaxed">
                  Hands-on, skill-focused workshops covering resumes, interviews, job search strategy, credit, communication, and client relations. Fee waiver available.
                </p>
              </div>
              <div className="pl-4 border-white/20 border-l-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="bg-white/10 px-2 py-0.5 border border-white/20 font-mono text-white/80 text-xs uppercase">Paid Intensives</span>
                  <span className="font-heading font-bold text-white text-sm">$25—$50</span>
                </div>
                <h3 className="mb-1 font-heading font-bold text-white text-base">Intensive Workshop</h3>
                <p className="font-body text-white/60 text-sm leading-relaxed">
                  Deep-dive sessions for business startup, sales, digital marketing, content strategy, and digital presence. Built for execution, not just overview. Fee waiver available.
                </p>
              </div>
            </div>
            <div className="mt-8 pt-6 border-[#C9A84C]/20 border-t text-center">
              <p className="mx-auto max-w-3xl font-mono text-[#C9A84C]/50 text-xs italic">
                "Fee waivers are available for all paid classes. No one is turned away for financial reasons — register and we'll work it out."
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      <section className="bg-white border-[#4B1E91]/10 border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-7xl">
          <p className="mb-2 font-mono text-[#4B1E91] text-xs uppercase tracking-widest">How It Works</p>
          <div className="bg-[#C9A84C] mb-10 w-12 h-0.5" />
          <div className="grid grid-cols-1 md:grid-cols-3 md:divide-x divide-y md:divide-y-0 divide-[#4B1E91]/10">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="md:px-10 py-8 md:py-0 last:pr-0 first:pl-0">
                <span className="block mb-4 font-black text-[#4B1E91]/10 text-[56px] leading-none select-none">
                  {step.step}
                </span>
                <h3 className="mb-2 font-heading font-bold text-[#0A1128] text-[24px]">{step.title}</h3>
                <p className="font-body text-neutral-500 text-sm leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {featuredClass && (
        <section className="bg-[#4B1E91] text-white">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl">
            <p className="mb-6 font-mono text-[#C9A84C] text-xs uppercase tracking-widest">
              This Week's Featured Class
            </p>
            <div className="flex lg:flex-row flex-col justify-between lg:items-end gap-8">
              <div className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="px-2 py-0.5 border border-[#C9A84C]/50 font-mono text-[#C9A84C] text-xs uppercase tracking-wider">
                    {featuredClass.ticketType}
                  </span>
                  <span className="font-mono text-white/40 text-xs uppercase tracking-wider">
                    {featuredClass.theme}
                  </span>
                </div>
                <h2 className="mb-4 font-heading font-black text-white text-2xl sm:text-3xl lg:text-4xl tracking-tight">
                  {featuredClass.title}
                </h2>
                <div className="flex flex-wrap gap-6 mb-4 font-mono text-white/50 text-xs">
                  <span className="flex items-center gap-1"><Calendar className="inline" size={16} /> {featuredClass.day}</span>
                  <span className="flex items-center gap-1"><Clock className="inline" size={16} /> {featuredClass.time}</span>
                  <span className="font-heading font-bold text-[#C9A84C]">
                    {featuredClass.price === 0 ? "FREE" : `$${featuredClass.price}`}
                  </span>
                </div>
                <p className="font-body text-white/70 text-sm leading-relaxed">{featuredClass.description}</p>
              </div>

              <div className="lg:text-right shrink-0">
                <p className="mb-3 font-body text-white/40 text-xs">
                  {featuredClass.spotsTotal - featuredClass.spotsTaken} of {featuredClass.spotsTotal} spots remaining
                </p>
                <div className="bg-white/10 mb-4 rounded-full lg:w-48 h-1 overflow-hidden">
                  <div
                    className="bg-[#C9A84C] rounded-full h-full"
                    style={{ width: `${Math.round((featuredClass.spotsTaken / featuredClass.spotsTotal) * 100)}%` }}
                  />
                </div>
                <button
                  onClick={() => scrollToCatalog("ongoing")}
                  className="inline-flex items-center gap-2 bg-[#C9A84C] hover:bg-[#b8933e] px-8 py-3.5 font-mono font-bold text-[#0A1128] text-xs uppercase tracking-wider transition-colors duration-200"
                >
                  Register for This Class <ArrowRight className="inline ml-1" size={16} />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      <div id="class-catalog" className="mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-7xl scroll-mt-24">

        {/* Tab navigation */}
        <div className="flex gap-0 mb-10 border-[#4B1E91]/15 border-b">
          {(
            [
              { id: "ongoing",  label: "Ongoing Classes",  count: ongoingClasses.length  },
              { id: "upcoming", label: "Upcoming Classes", count: upcomingClasses.length },
            ] as { id: TabId; label: string; count: number }[]
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 font-mono text-xs uppercase tracking-wider border-b-2 transition-colors duration-150 ${
                activeTab === tab.id
                  ? "border-[#C9A84C] text-[#4B1E91] font-bold"
                  : "border-transparent text-neutral-400 hover:text-[#4B1E91]"
              }`}
            >
              {tab.label}
              <span
                className={`text-xs px-1.5 py-0.5 rounded font-bold ${
                  activeTab === tab.id
                    ? "bg-[#C9A84C] text-[#0A1128]"
                    : "bg-neutral-100 text-neutral-500"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {activeTab === "ongoing" && (
          <ClassSearch classes={ongoingClasses} showTodayFilter />
        )}

        {activeTab === "upcoming" && (
          <div>
            <div className="bg-[#4B1E91]/5 mb-8 px-6 py-4 border border-[#4B1E91]/20 font-mono text-[#4B1E91] text-xs">
              These classes are launching soon. Register now to secure your spot and be first to receive the Google Meet link when the session goes live.
            </div>
            <ClassSearch classes={upcomingClasses} showTodayFilter={false} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassCatalog;
