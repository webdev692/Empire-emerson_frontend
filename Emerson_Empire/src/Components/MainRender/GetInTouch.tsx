import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { EmpersonLogo } from '../../assets';

const GetInTouch: React.FC = () => {
  return (
    <section className="bg-white px-6 sm:px-10 lg:px-16 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] items-center">
          <div className="rounded-3xl overflow-hidden shadow-[0_60px_120px_rgba(18,2,42,0.12)]">
            <img
              src={EmpersonLogo}
              alt="Emerson Empire contact"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-8">
            <div>
              <p className="mb-4 font-semibold text-[#C9A84C] text-xs uppercase tracking-[0.35em]">
                CONTACT
              </p>
              <h2 className="font-semibold text-[#12022A] text-5xl md:text-[3.5rem] leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Get in Touch
              </h2>
              <p className="mt-6 max-w-xl text-[#12022A]/75 text-lg leading-[1.85]">
                The fastest way to reach us is through one of the forms below. Each one routes to the right part of the Emerson ecosystem.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <a
                href="/contact"
                className="rounded-[28px] border border-[#12022A]/10 bg-[#12022A] px-8 py-6 text-white transition-shadow duration-200 hover:shadow-[0_16px_40px_rgba(18,2,42,0.12)]"
              >
                <p className="font-semibold uppercase tracking-[0.18em] text-sm">Request Services</p>
              </a>
              <a
                href="/classes"
                className="rounded-[28px] border border-[#12022A]/10 bg-[#12022A] px-8 py-6 text-white transition-shadow duration-200 hover:shadow-[0_16px_40px_rgba(18,2,42,0.12)]"
              >
                <p className="font-semibold uppercase tracking-[0.18em] text-sm">Register for Classes</p>
              </a>
              <a
                href="/contact"
                className="rounded-[28px] border border-[#12022A]/10 bg-[#12022A] px-8 py-6 text-white transition-shadow duration-200 hover:shadow-[0_16px_40px_rgba(18,2,42,0.12)]"
              >
                <p className="font-semibold uppercase tracking-[0.18em] text-sm">Partnership Inquiry</p>
              </a>
              <a
                href="/global-internship"
                className="rounded-[28px] border border-[#12022A]/10 bg-[#12022A] px-8 py-6 text-white transition-shadow duration-200 hover:shadow-[0_16px_40px_rgba(18,2,42,0.12)]"
              >
                <p className="font-semibold uppercase tracking-[0.18em] text-sm">Apply for Internship</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetInTouch;
