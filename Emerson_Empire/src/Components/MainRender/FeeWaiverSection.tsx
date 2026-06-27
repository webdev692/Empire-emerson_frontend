import React from 'react';
import { motion } from 'framer-motion';
import { HeartHandshake } from 'lucide-react';

const FeeWaiverSection: React.FC = () => (
  <div className="bg-[#12022A] px-6 sm:px-10 lg:px-16 py-16 lg:py-20">
    <motion.div
      whileInView={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.55 }}
      viewport={{ once: true }}
      className="mx-auto px-6 sm:px-10 lg:px-16 py-14 border border-white/10 rounded-2xl max-w-4xl text-center"
    >
      {/* Icon */}
      <div className="flex justify-center items-center bg-white/[0.06] mx-auto mb-7 rounded-full w-12 h-12">
        <HeartHandshake className="text-[#C9A84C]" size={22} strokeWidth={1.75} />
      </div>

      <h2
        className="mb-5 font-medium text-white text-3xl sm:text-4xl lg:text-[2.6rem] leading-[1.15]"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        Fee Waiver And Reduced-Cost Support
      </h2>

      <p
        className="mx-auto mb-9 max-w-2xl text-white/70 text-base sm:text-lg leading-[1.8]"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        We believe access matters. Some classes, services, and support options may
        have fee waiver or reduced-cost pathways available for people who cannot
        afford the full cost.
      </p>

      <a
        href="/contact"
        className="inline-flex items-center bg-[#C9A84C] hover:bg-[#D4B56A] px-7 py-3.5 rounded-sm font-bold text-[#12022A] text-sm transition-colors duration-200"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        Request Services
      </a>
    </motion.div>
  </div>
);

export default FeeWaiverSection;
