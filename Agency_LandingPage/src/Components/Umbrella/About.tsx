import React from "react";
import { motion } from "framer-motion";
import { empire, empireWebp, empireAvif } from "../../assets";
import {
  Settings2, Scale, GraduationCap, Coins,
  Users, BarChart2, Briefcase, CheckCircle2,
} from "lucide-react";


const values = [
  { icon: Settings2, title: "Service",     description: "We believe business should serve people, not simply profit from them." },
  { icon: Scale,     title: "Integrity",   description: "We value honesty, transparency, and ethical leadership." },
  { icon: GraduationCap, title: "Education", description: "Growth begins with learning, guidance, and access to practical knowledge." },
  { icon: Coins,     title: "Opportunity", description: "Everyone deserves the chance to build, improve, and move forward." },
  { icon: Users,     title: "Leadership",  description: "Strong leadership is built through service, consistency, and responsibility." },
  { icon: BarChart2, title: "Dignity",     description: "Every individual deserves respect, fairness, and support." },
];

const visionPillars = [
  {
    number: "01",
    title: "Access for All",
    description: "A world where zip code or background never determines who gets to build a meaningful career.",
  },
  {
    number: "02",
    title: "Thriving Communities",
    description: "Neighborhoods strengthened by financially literate, professionally equipped individuals who reinvest in those around them.",
  },
  {
    number: "03",
    title: "Systemic Change",
    description: "Institutions and systems redesigned from the ground up to serve people  not the other way around.",
  },
];

const AUDIENCES = [
  {
    tag: "Individual & Professional",
    icon: GraduationCap,
    bg: "dark",
    accentColor: "#C9A84C",
    headline: "Career & Personal Growth",
    body: "Whether you're just starting out or leveling up, we give you the real skills, tools, and systems to move forward — professionally and financially.",
    highlights: [
      "Career readiness and resume building",
      "Financial literacy and budgeting",
      "Tax preparation and planning",
      "Job search strategy and interview prep",
      "Leadership and professional communication",
    ],
    pricing: "Free workshops · Low-cost intensives",
    ctaPrimary:   { href: "/classes",  label: "Browse Classes" },
    ctaSecondary: { href: "/about",    label: "Learn More" },
  },
  {
    tag: "Business & Entrepreneur",
    icon: Briefcase,
    bg: "light",
    accentColor: "#4B1E91",
    headline: "Business & Growth Support",
    body: "From your first offer to full business infrastructure, we help entrepreneurs build, price, launch, and sustain real businesses — without the guesswork.",
    highlights: [
      "Business launch planning and strategy",
      "Pricing and service packaging",
      "Bookkeeping and small business tax",
      "Digital presence and content strategy",
      "Sales outreach and client communication",
    ],
    pricing: "Consultation available · Package pricing",
    ctaPrimary:   { href: "/services", label: "View Services" },
    ctaSecondary: { href: "/classes",  label: "Start with Classes" },
  },
];

// 

const About: React.FC = () => (
  <section id="about" className="mt-20 sm:mt-24 w-full">

    {/* HERO */}
    <div className="relative bg-[#12022A] mt-20 px-6 sm:px-10 lg:px-16 py-24">
      <div className="absolute inset-0 bg-[#12022A]/70 pointer-events-none" />
      <div className="relative flex flex-col justify-center items-center mx-auto max-w-7xl text-center">
        <p className="mb-6 font-semibold text-[#C9A84C] text-2xl uppercase tracking-[4px]">
          About The Emerson Empire
        </p>
        <h2 className="mx-auto max-w-3xl font-bold text-[44px] text-white sm:text-[64px] lg:text-[72px] uppercase leading-none tracking-tight heading">
          Built to Bridge Your Professional Gap.
        </h2>
      </div>
    </div>

    {/* TWO COLUMN */}
    <div className="flex lg:flex-row flex-col bg-white mt-24 p-3">
      {/* LEFT — image */}
      <div className="relative shadow-[#4B1E91] shadow-md border-2 rounded-2xl lg:w-1/2 h-96 overflow-hidden">
        <picture>
          <source srcSet={empireAvif} type="image/avif" />
          <source srcSet={empireWebp} type="image/webp" />
          <img src={empire} alt="Emerson Empire" className="absolute inset-0 w-full h-full object-contain" />
        </picture>
        <div className="absolute inset-0 bg-[#12022A]/40" />
      </div>

      {/* RIGHT — What We Do */}
      <div className="bg-white px-6 sm:px-10 lg:px-16 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16">
            <motion.p
              whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.45 }}
              className="mb-4 font-semibold text-[#4B1E91] text-sm sm:text-base uppercase tracking-[4px]"
            >
              What We Do
            </motion.p>
            <motion.h2
              whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.5, delay: 0.07 }}
              className="max-w-2xl font-bold text-[#12022A] text-[36px] sm:text-[52px] lg:text-[60px] uppercase leading-none tracking-tight heading"
            >
              Two Paths.<br />One Mission.
            </motion.h2>
            <motion.div
              whileInView={{ scaleX: 1 }} initial={{ scaleX: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              style={{ originX: 0 }}
              className="bg-[#C9A84C] mt-8 w-24 h-0.75"
            />
          </div>

          <div className="gap-6 grid lg:grid-cols-2">
            {AUDIENCES.map((audience, i) => {
              const Icon = audience.icon;
              const isDark = audience.bg === "dark";
              return (
                <motion.div
                  key={audience.tag}
                  whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 28 }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className={`flex flex-col rounded-2xl overflow-hidden shadow-md ${isDark ? "bg-[#12022A]" : "bg-white"}`}
                  style={{ borderTop: `4px solid ${audience.accentColor}` }}
                >
                  <div className="px-8 pt-10 pb-8">
                    <p className="mb-5 font-semibold text-sm uppercase tracking-[3px]" style={{ color: audience.accentColor }}>
                      {audience.tag}
                    </p>
                    <div className="flex items-start gap-4 mb-6">
                      <div className="flex justify-center items-center rounded-xl w-12 h-12 shrink-0" style={{ background: `${audience.accentColor}20` }}>
                        <Icon size={24} style={{ color: audience.accentColor }} />
                      </div>
                      <h3 className={`font-bold text-[28px] sm:text-[36px] leading-tight heading ${isDark ? "text-white" : "text-[#12022A]"}`}>
                        {audience.headline}
                      </h3>
                    </div>
                    <p className={`text-base sm:text-lg leading-[1.9] ${isDark ? "text-[#F5F0E8]/65" : "text-[#12022A]/55"}`}>
                      {audience.body}
                    </p>
                  </div>

                  <div className={`flex-1 px-8 py-8 flex flex-col ${isDark ? "bg-white/40" : "bg-[#4B1E91]/4"}`}>
                    <ul className="flex flex-col gap-3 mb-6">
                      {audience.highlights.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <CheckCircle2 size={18} className="mt-0.5 shrink-0" style={{ color: audience.accentColor }} />
                          <span className={`text-sm leading-[1.7] ${isDark ? "text-[#F5F0E8]/65" : "text-[#12022A]/60"}`}>
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <p className="opacity-50 mb-6 text-xs uppercase tracking-[1.5px]" style={{ color: isDark ? "#F5F0E8" : "#12022A" }}>
                      {audience.pricing}
                    </p>
                    <div className="flex sm:flex-row flex-col gap-3 mt-auto">
                      <a
                        href={audience.ctaPrimary.href}
                        className="inline-flex justify-center items-center hover:opacity-80 px-6 py-4 rounded-full font-bold text-xs uppercase tracking-[2px] transition-opacity duration-200"
                        style={{ background: audience.accentColor, color: isDark ? "#12022A" : "#FFFFFF" }}
                      >
                        {audience.ctaPrimary.label}
                      </a>
                      <a
                        href={audience.ctaSecondary.href}
                        className="inline-flex justify-center items-center hover:opacity-70 px-6 py-4 border-2 rounded-full font-bold text-xs uppercase tracking-[2px] transition-all duration-200"
                        style={{ borderColor: audience.accentColor, color: audience.accentColor }}
                      >
                        {audience.ctaSecondary.label}
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>

    {/* VALUES */}
    <div className="bg-white px-6 sm:px-10 lg:px-16 pt-6 pb-20">
      <h2 className="mb-12 font-bold text-[#12022A] text-[48px] text-center uppercase tracking-[0.12em] heading">
        Our Commitment and Values
      </h2>
      <div className="gap-5 grid sm:grid-cols-2 lg:grid-cols-3 mx-auto max-w-7xl">
        {values.map((value, i) => {
          const Icon = value.icon;
          return (
            <motion.div
              key={i}
              whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="bg-[#4B1E91] shadow-black shadow-md px-6 py-7 rounded-2xl"
            >
              <div className="flex justify-center items-center bg-[#C9A84C]/15 mb-5 rounded-xl w-10 h-10">
                <Icon size={20} className="text-[#C9A84C]" />
              </div>
              <h3 className="mb-2 font-bold text-white text-sm uppercase tracking-[0.15em]">{value.title}</h3>
              <p className="text-[#F5F0E8]/65 text-sm leading-[1.8]">{value.description}</p>
            </motion.div>
          );
        })}
      </div>
    </div>

    {/* MISSION */}
    <div className="relative bg-[#12022A] px-6 sm:px-10 lg:px-16 py-24 lg:py-32 overflow-hidden">
      <div aria-hidden="true" className="-top-32 -right-32 absolute border border-[#C9A84C]/10 rounded-full w-120 h-120 pointer-events-none" />
      <div aria-hidden="true" className="-top-16 -right-16 absolute border border-[#C9A84C]/10 rounded-full w-80 h-80 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl">
        <motion.p
          whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.5 }}
          className="mb-6 font-semibold text-[#C9A84C] text-sm sm:text-base uppercase tracking-[4px]"
        >
          Our Mission
        </motion.p>
        <motion.h2
          whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="mb-10 max-w-4xl font-bold text-[36px] text-white sm:text-[52px] lg:text-[64px] uppercase leading-none tracking-tight heading"
        >
          We Exist to Close the Gap.
        </motion.h2>
        <motion.div
          whileInView={{ scaleX: 1 }} initial={{ scaleX: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          style={{ originX: 0 }}
          className="bg-[#C9A84C] mb-10 w-24 h-0.75"
        />
        <div className="gap-10 lg:gap-20 grid lg:grid-cols-2">
          <motion.p
            whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.5 }}
            className="text-[#F5F0E8]/75 text-lg sm:text-xl leading-[1.9]"
          >
            The Emerson Empire exists to eliminate the professional gap that
            leaves talented, driven people without the tools, guidance, or
            opportunity to succeed.
          </motion.p>
          <motion.p
            whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[#F5F0E8]/55 text-lg sm:text-xl leading-[1.9]"
          >
            We do this by combining real-world professional training with
            accessible business support giving individuals and communities a
            genuine path forward, not just a promise of one.
          </motion.p>
        </div>
      </div>
    </div>

    {/* VISION */}
    <div className="bg-white px-6 sm:px-10 lg:px-16 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex lg:flex-row flex-col lg:justify-between lg:items-end gap-8 mb-16">
          <div className="lg:max-w-xl">
            <motion.p
              whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.45 }}
              className="mb-4 font-semibold text-[#4B1E91] text-sm sm:text-base uppercase tracking-[4px]"
            >
              Our Vision
            </motion.p>
            <motion.h2
              whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.5, delay: 0.07 }}
              className="font-bold text-[#12022A] text-[36px] sm:text-[52px] lg:text-[60px] uppercase leading-none tracking-tight heading"
            >
              Where We're Going.
            </motion.h2>
          </div>
          <motion.p
            whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:max-w-sm text-[#12022A]/55 text-lg sm:text-2xl leading-[1.9]"
          >
            We're working toward a world where your background is a foundation,
            not a ceiling — and where professional success is truly within reach
            for every person willing to pursue it.
          </motion.p>
        </div>

        <div className="gap-5 grid sm:grid-cols-2 lg:grid-cols-3">
          {visionPillars.map((pillar, i) => (
            <motion.div
              key={pillar.number}
              whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className="relative bg-white shadow-[#4B1E91]/10 shadow-md px-6 pt-8 pb-10 border-[#C9A84C] border-t-2 rounded-b-2xl"
            >
              <span aria-hidden="true" className="top-4 right-5 absolute font-bold text-[#12022A]/05 text-[72px] leading-none select-none heading">
                {pillar.number}
              </span>
              <p className="mb-3 font-bold text-[#C9A84C] text-sm uppercase tracking-[3px]">{pillar.number}</p>
              <h3 className="mb-4 font-bold text-[#12022A] sm:text-[26px] text-2xl leading-tight heading">{pillar.title}</h3>
              <p className="text-[#12022A]/60 text-base sm:text-lg leading-[1.8]">{pillar.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>

  </section>
);

export default About;
