import React from 'react';
import { motion } from 'framer-motion';
import { HeartHandshake } from 'lucide-react';

const FeeWaiverSection: React.FC = () => (
  <div className="bg-[#1C1336] px-6 sm:px-10 lg:px-16 py-16 lg:py-20">
    <motion.div
      whileInView={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.55 }}
      viewport={{ once: true }}
      className="bg-[#2A1C45] mx-auto px-6 sm:px-12 py-16 border border-white/[0.06] rounded-3xl max-w-5xl text-center"
    >
      {/* Icon */}
      <div className="flex justify-center items-center bg-white/[0.06] mx-auto mb-8 rounded-full w-14 h-14">
        <HeartHandshake className="text-[#C9A84C]" size={24} strokeWidth={1.75} />
      </div>

      <h2
        className="mb-6 font-medium text-white text-4xl sm:text-5xl leading-[1.15]"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        Fee Waiver And Reduced-Cost Support
      </h2>

      <p
        className="mx-auto mb-10 max-w-2xl text-white/65 text-base sm:text-lg leading-[1.7]"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        We believe access matters. Some classes, services, and support options may
        have fee waiver or reduced-cost pathways available for people who cannot
        afford the full cost.
      </p>

      <a
        href="/contact"
        className="inline-flex items-center bg-[#B8954A] hover:bg-[#C9A84C] px-8 py-3.5 rounded-md font-semibold text-white text-sm transition-colors duration-200"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        Request Services
      </a>
    </motion.div>
  </div>
);

export default FeeWaiverSection;
