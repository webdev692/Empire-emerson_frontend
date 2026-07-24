import React from 'react';
import { motion } from 'framer-motion';
import { ResourceImg } from '../../assets';

const ResourceHub: React.FC = () => (
  <div className="bg-white px-6 sm:px-10 lg:px-16 py-16 lg:py-24">
    <div className="items-center gap-10 lg:gap-16 grid lg:grid-cols-2 mx-auto max-w-7xl">
      {/* Left — image */}
      <motion.div
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.55 }}
        viewport={{ once: true }}
      >
        <img
          src={ResourceImg}
          alt="Emerson team reviewing educational and community resources"
          className="block w-full h-auto"
        />
      </motion.div>

      {/* Right — copy */}
      <motion.div
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.55, delay: 0.08 }}
        viewport={{ once: true }}
      >
        <p
          className="mb-4 font-semibold text-[#C9A84C] text-xs sm:text-sm uppercase tracking-[0.3em]"
          style={{ fontFamily: "var(--font-label)" }}
        >
          Resources
        </p>

        <h2
          className="mb-6 font-medium text-[#1C1336] text-4xl sm:text-5xl leading-[1.1]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          A growing public resource hub
        </h2>

        <p
          className="mb-8 max-w-xl text-[#1C1336]/70 text-base sm:text-lg leading-[1.8]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          The Emerson Empire is building a growing public resource hub to help
          people find educational, professional, financial, and community support
          resources. New resources are added as they are reviewed and organized.
          If you are looking for guidance, use the forms below to tell us what you
          need and we will help point you in the right direction.
        </p>

        <a
          href="/contact"
          className="inline-flex items-center gap-2 bg-[#1C1336] hover:bg-[#1E0A4A] px-7 py-3.5 rounded-sm font-bold text-white text-sm transition-colors duration-200"
          style={{ fontFamily: "var(--font-label)" }}
        >
          Request Guidance <span aria-hidden="true">→</span>
        </a>
      </motion.div>
    </div>
  </div>
);

export default ResourceHub;
