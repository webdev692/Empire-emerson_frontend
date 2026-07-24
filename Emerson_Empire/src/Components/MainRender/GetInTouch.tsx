import React from 'react';
import { motion } from 'framer-motion';
import { GetInTouchImg } from '../../assets';

const CONTACT_LINKS = [
  { label: 'Request Services', href: '/contact' },
  { label: 'Register for Classes', href: '/classes' },
  { label: 'Partnership Inquiry', href: '/contact' },
  { label: 'Apply for Internship', href: '/global-internship' },
];

const GetInTouch: React.FC = () => (
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
          src={GetInTouchImg}
          alt="Emerson team connecting with the community over a video call"
          className="block w-full h-auto"
        />
      </motion.div>

      {/* Right — copy + buttons */}
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
          Contact
        </p>

        <h2
          className="mb-6 font-medium text-[#1C1336] text-4xl sm:text-5xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Get in Touch
        </h2>

        <p
          className="mb-9 max-w-xl text-[#1C1336]/70 text-base sm:text-lg leading-[1.8]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          The fastest way to reach us is through one of the forms below. Each one
          routes to the right part of the Emerson ecosystem.
        </p>

        <div className="gap-4 grid sm:grid-cols-2 max-w-md">
          {CONTACT_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="inline-flex justify-center items-center bg-[#1C1336] hover:bg-[#1E0A4A] px-5 py-3.5 rounded-sm font-semibold text-white text-sm text-center transition-colors duration-200"
              style={{ fontFamily: "var(--font-label)" }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  </div>
);

export default GetInTouch;
