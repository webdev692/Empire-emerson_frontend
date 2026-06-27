import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const TIMELINE = [
  {
    num: '01',
    year: '2018',
    title: 'Where It All Began',
    body: 'The Emerson Empire was born out of a simple frustration: too many talented people were being left behind not because of lack of ability, but lack of access. What started as informal coaching sessions grew into something much larger.',
  },
  {
    num: '02',
    year: '2020',
    title: 'Expanding the Vision',
    body: 'Amid one of the most challenging periods in recent history, the need for accessible professional development became undeniable. We formalized our programs and began serving communities that traditional institutions had overlooked.',
  },
  {
    num: '03',
    year: '2022',
    title: 'Building the Infrastructure',
    body: 'We launched our business support division — tax preparation, consulting, and professional writing — to ensure that the people we train had the back-end support to actually build and sustain something real.',
  },
  {
    num: '04',
    year: 'Today',
    title: 'A Growing Empire',
    body: 'With hundreds of students trained, partnerships across multiple sectors, and a team built on lived experience, The Emerson Empire continues to close the gap — one person, one business, one community at a time.',
  },
];

const PROBLEMS = [
  'Millions are stuck due to lack of access to quality training — not lack of talent.',
  'Traditional institutions are expensive, slow, and disconnected from real-world demands.',
  'Without professional back-end support, even skilled individuals can\'t sustain growth.',
  'We remove the barriers — no gatekeeping, no debt, no prerequisite pedigree.',
];

const OurStory: React.FC = () => (
  <section id="our-story" className="bg-white px-6 sm:px-10 lg:px-16 py-24 lg:py-32">
    <div className="mx-auto max-w-7xl">

      {/* HEADER */}
      <div className="flex lg:flex-row flex-col lg:justify-between lg:items-end gap-10 mb-20">
        <div className="lg:max-w-2xl">
          <motion.p
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.45 }}
            className="mb-5 font-semibold text-[#4B1E91] text-sm sm:text-base uppercase tracking-[4px]"
          >
            Our Story
          </motion.p>
          <motion.h2
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="font-bold text-[#0A1128] text-[36px] sm:text-[52px] lg:text-[64px] uppercase leading-none tracking-tight heading"
          >
            Built From{' '}
            <span className="text-[#4B1E91]">Experience,</span>
            <br />
            Not Just Ambition.
          </motion.h2>
        </div>
        <motion.p
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:max-w-sm text-[#0A1128]/55 text-lg sm:text-xl leading-[1.9]"
        >
          The Emerson Empire didn't start in a boardroom. It started with a
          problem — and a refusal to accept that nothing could be done about it.
        </motion.p>
      </div>

      {/* Divider */}
      <motion.div
        whileInView={{ scaleX: 1 }}
        initial={{ scaleX: 0 }}
        transition={{ duration: 0.6 }}
        style={{ originX: 0 }}
        className="bg-[#C9A84C] mb-20 w-24 h-0.75"
      />

      {/* TIMELINE */}
      <div className="relative">
        <div
          aria-hidden="true"
          className="hidden lg:block top-0 bottom-0 left-1/2 absolute bg-[#0A1128]/10 w-px -translate-x-1/2"
        />

        <div className="flex flex-col gap-16">
          {TIMELINE.map((item, i) => {
            const isEven = i % 2 === 0;
            return (
              <motion.div
                key={item.year}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 28 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`relative flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-0 ${
                  isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Content block */}
                <div className={`lg:w-[calc(50%-48px)] ${isEven ? 'lg:pr-10' : 'lg:pl-10'}`}>
                  <div className="pl-6 border-[#C9A84C] border-l-2 hover:border-[#4B1E91] transition-colors duration-300">
                    {/* Numbered badge */}
                    <span className="block mb-1 font-bold text-[#C9A84C]/30 text-[52px] sm:text-[60px] leading-none select-none heading">
                      {item.num}
                    </span>
                    <p className="mb-2 font-bold text-[#C9A84C] text-sm uppercase tracking-[3px]">
                      {item.year}
                    </p>
                    <h3 className="mb-3 font-bold text-[#0A1128] text-2xl sm:text-[26px] leading-tight heading">
                      {item.title}
                    </h3>
                    <p className="text-[#0A1128]/55 text-base sm:text-lg leading-[1.9]">
                      {item.body}
                    </p>
                  </div>
                </div>

                {/* Center dot */}
                <div className="hidden left-1/2 z-10 absolute lg:flex bg-[#4B1E91] shadow-md border-4 border-white rounded-full w-6 h-6 -translate-x-1/2" />

                {/* Spacer */}
                <div className="hidden lg:block lg:w-[calc(50%-48px)]" />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* PROBLEM BLOCK */}
      <motion.div
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.55 }}
        className="relative bg-[#0A1128] mt-24 px-8 sm:px-14 py-14 lg:py-20 rounded-2xl overflow-hidden"
      >
        <div
          aria-hidden="true"
          className="-right-20 -bottom-20 absolute border border-[#C9A84C]/10 rounded-full w-[320px] h-80 pointer-events-none"
        />

        <p className="mb-5 font-semibold text-[#C9A84C] text-sm uppercase tracking-[4px]">
          The Problem We Solve
        </p>

        <h3 className="mb-10 max-w-3xl font-bold text-[28px] text-white sm:text-[40px] lg:text-[48px] uppercase leading-none tracking-tight heading">
          The Gap Is Real — And It's Costing People Everything.
        </h3>

        <ul className="gap-5 grid sm:grid-cols-2">
          {PROBLEMS.map((point, i) => (
            <motion.li
              key={i}
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.4, delay: i * 0.09 }}
              className="flex items-start gap-4"
            >
              <CheckCircle size={22} className="text-[#C9A84C] mt-0.5 shrink-0" />
              <p className="text-[#F5F0E8]/70 text-base sm:text-lg leading-[1.8]">
                {point}
              </p>
            </motion.li>
          ))}
        </ul>
      </motion.div>

    </div>
  </section>
);

export default OurStory;
