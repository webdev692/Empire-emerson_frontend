import React from "react";
import {
  FaArrowDown,
  FaCalendarAlt,
  FaClock,
  FaDollarSign,
  FaExternalLinkAlt,
  FaHandsHelping,
  FaLaptopHouse,
} from "react-icons/fa";
import { classes } from "../data/classData";
import ClassSearch from "./ClassSearch";

const REGISTRATION_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfOGM0MZ05Em3O502rC9HxvK5qzW06ATQMcMX2Fgcn9xBpncQ/viewform";
const FEE_WAIVER_URL = "https://forms.gle/fWm9gHownQeorkNn7";

const CLASS_TIERS = [
  {
    title: "Free Morning Classes",
    time: "10:00 AM EDT",
    price: "Free",
    duration: "60 minutes",
    description: "Open-access classes designed to introduce practical foundations in career readiness, finance, tax readiness, entrepreneurship, digital presence, and weekly planning.",
    icon: FaLaptopHouse,
  },
  {
    title: "Afternoon Workshops",
    time: "2:00 PM EDT",
    price: "$10",
    duration: "90 minutes",
    description: "Hands-on sessions with guided practice, examples, and structured support. Fee waivers are available for participants who need assistance.",
    icon: FaHandsHelping,
  },
  {
    title: "Evening Intensives",
    time: "7:00 PM EDT",
    price: "$20",
    duration: "2 hours",
    description: "Deeper working sessions for participants who want more time, more structure, and implementation-focused learning. Fee waivers are available.",
    icon: FaClock,
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Choose Your Session",
    body: "Browse the weekly schedule by day, access tier, or learning theme. Each day includes one free class, one workshop, and one intensive.",
  },
  {
    step: "02",
    title: "Register or Request Support",
    body: "Use the registration form for any class. Paid workshops are $10 and paid intensives are $20. The fee waiver form is available and does not ask for sensitive documents.",
  },
  {
    step: "03",
    title: "Join Online in EDT",
    body: "All sessions are held online. Participants receive class details and next steps after registration.",
  },
];

const ClassCatalog: React.FC = () => {
  const freeCount = classes.filter((item) => item.price === 0).length;
  const workshopCount = classes.filter((item) => item.price === 10).length;
  const intensiveCount = classes.filter((item) => item.price === 20).length;

  const scrollToCatalog = () => {
    document.getElementById("class-catalog")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#F8F5EE] pt-16 font-body text-[#1C1336] antialiased selection:bg-[#4B1E91] selection:text-white sm:pt-20">
      <section id="weekly-classes" className="relative overflow-hidden bg-[#1C1336] text-white">
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#C9A84C]/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-[#4B1E91]/40 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
          <div>
            <span className="mb-5 inline-flex rounded-full border border-[#C9A84C]/40 bg-white/5 px-4 py-2 font-mono text-xs uppercase tracking-[0.24em] text-[#C9A84C]">
              Weekly online class series
            </span>
            <h1 className="font-heading text-5xl font-black uppercase leading-none tracking-tight text-white sm:text-6xl lg:text-7xl">
              Practical Classes for
              <span className="mt-2 block text-[#C9A84C]">Career, Money & Business</span>
            </h1>
            <p className="mt-7 max-w-3xl text-base leading-8 text-white/72 sm:text-lg">
              The Emerson Empire weekly class series offers 21 online classes every week across career readiness, financial literacy, tax readiness, entrepreneurship, ethical sales, digital presence, leadership, and professional development.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="font-heading text-3xl font-black text-[#C9A84C]">{freeCount}</p>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55">Free 10 AM Classes</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="font-heading text-3xl font-black text-[#C9A84C]">{workshopCount}</p>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55">$10 Workshops</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="font-heading text-3xl font-black text-[#C9A84C]">{intensiveCount}</p>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55">$20 Intensives</p>
              </div>
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href={REGISTRATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#C9A84C] px-7 py-4 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#1C1336] transition-colors hover:bg-[#b8933e]"
              >
                Register for Weekly Classes <FaExternalLinkAlt size={11} />
              </a>
              <a
                href={FEE_WAIVER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#C9A84C]/60 px-7 py-4 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#C9A84C] transition-colors hover:bg-[#C9A84C]/10"
              >
                Request a Fee Waiver <FaExternalLinkAlt size={11} />
              </a>
              <button
                type="button"
                onClick={scrollToCatalog}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-7 py-4 font-mono text-xs font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-white/10"
              >
                Browse Schedule <FaArrowDown size={11} />
              </button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#C9A84C]/25 bg-white p-4 text-[#1C1336] shadow-2xl lg:p-5">
            <div className="rounded-[1.5rem] bg-[#F8F5EE] p-5">
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.22em] text-[#4B1E91]">Correct weekly schedule</p>
              <div className="space-y-3">
                {CLASS_TIERS.map((tier) => {
                  const Icon = tier.icon;
                  return (
                    <div key={tier.title} className="rounded-3xl border border-[#4B1E91]/10 bg-white p-5">
                      <div className="mb-3 flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#1C1336] text-[#C9A84C]">
                          <Icon />
                        </div>
                        <div>
                          <h2 className="font-heading text-xl font-black text-[#1C1336]">{tier.title}</h2>
                          <div className="mt-2 flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-[0.14em]">
                            <span className="rounded-full bg-[#C9A84C] px-3 py-1 font-bold text-[#1C1336]">{tier.price}</span>
                            <span className="rounded-full bg-[#4B1E91]/8 px-3 py-1 text-[#4B1E91]">{tier.time}</span>
                            <span className="rounded-full bg-[#4B1E91]/8 px-3 py-1 text-[#4B1E91]">{tier.duration}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm leading-7 text-neutral-600">{tier.description}</p>
                    </div>
                  );
                })}
              </div>
              <p className="mt-5 rounded-2xl border border-[#C9A84C]/40 bg-[#FFF9E8] p-4 text-sm leading-7 text-neutral-700">
                Paid classes include fee waiver access. The waiver request is simple and does not ask for sensitive documents.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.22em] text-[#4B1E91]">How it works</p>
            <h2 className="font-heading text-4xl font-black text-[#1C1336]">Simple, clear, and accessible.</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="rounded-3xl border border-[#4B1E91]/10 bg-[#F8F5EE] p-7">
                <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#4B1E91] font-heading text-lg font-black text-white">
                  {step.step}
                </span>
                <h3 className="mb-3 font-heading text-2xl font-bold text-[#1C1336]">{step.title}</h3>
                <p className="text-sm leading-7 text-neutral-600">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#4B1E91]/10 bg-[#1C1336] text-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
          <div className="lg:col-span-1">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#C9A84C]">At a glance</p>
            <h2 className="mt-3 font-heading text-3xl font-black">Weekly rhythm</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:col-span-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <FaCalendarAlt className="mb-3 text-[#C9A84C]" />
              <p className="font-heading text-xl font-bold">7 days each week</p>
              <p className="mt-2 text-sm leading-6 text-white/60">Monday through Sunday recurring online sessions.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <FaClock className="mb-3 text-[#C9A84C]" />
              <p className="font-heading text-xl font-bold">Three time blocks</p>
              <p className="mt-2 text-sm leading-6 text-white/60">10 AM, 2 PM, and 7 PM EDT every day.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <FaDollarSign className="mb-3 text-[#C9A84C]" />
              <p className="font-heading text-xl font-bold">Free to $20</p>
              <p className="mt-2 text-sm leading-6 text-white/60">Free morning classes, $10 workshops, and $20 intensives.</p>
            </div>
          </div>
        </div>
      </section>

      <main id="class-catalog" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
        <ClassSearch classes={classes} />
      </main>
    </div>
  );
};

export default ClassCatalog;
