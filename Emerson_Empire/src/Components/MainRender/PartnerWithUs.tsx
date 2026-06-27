import React from 'react';
import { motion } from 'framer-motion';

const PartnerWithUs: React.FC = () => (
  <div className="bg-[#1C1336] px-6 sm:px-10 lg:px-16 py-16 lg:py-24">
    <div className="items-center gap-10 lg:gap-16 grid lg:grid-cols-2 mx-auto max-w-7xl">
      {/* Left — copy */}
      <motion.div
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.55 }}
        viewport={{ once: true }}
      >
        <p
          className="mb-4 font-semibold text-[#C9A84C] text-xs sm:text-sm uppercase tracking-[0.3em]"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          Collaboration
        </p>

        <h2
          className="mb-6 font-medium text-white text-4xl sm:text-5xl"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Partner With Us
        </h2>

        <p
          className="max-w-xl text-white/70 text-base sm:text-lg leading-[1.8]"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Organizations, schools, libraries, community groups, and mission-aligned
          partners can request collaboration or workshops. We work with partners to
          expand access to education, professional development, and community
          resources.
        </p>
      </motion.div>

      {/* Right — conversation card */}
      <motion.div
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.55, delay: 0.08 }}
        viewport={{ once: true }}
        className="bg-white/[0.04] p-8 sm:p-10 border border-white/10 rounded-2xl"
      >
        <h3
          className="mb-3 font-semibold text-white text-2xl"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Start a conversation
        </h3>
        <p
          className="mb-7 text-white/60 text-sm sm:text-base leading-[1.7]"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Share a little about your organization and what you are looking to build
          together.
        </p>
        <a
          href="/contact"
          className="inline-flex items-center gap-2 bg-[#C9A84C] hover:bg-[#D4B56A] px-7 py-3.5 rounded-sm font-bold text-[#1C1336] text-sm transition-colors duration-200"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          Request Partnership <span aria-hidden="true">→</span>
        </a>
      </motion.div>
    </div>
  </div>
);

export default PartnerWithUs;
