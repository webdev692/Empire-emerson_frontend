import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Phone, Users } from "lucide-react";

const BOOK_CALL_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSeOuU4WXCF8Vy9XrQYRmh9CfH-xnmRToV2qxOfaRMBfFFhfsg/viewform?embedded=true";
const APPLY_FORM_URL     = "https://docs.google.com/forms/d/e/1FAIpQLSct0beq8VHPv9zhRreBFv8fK8HWGIGNp2YmuRGiOiL7RPoGFQ/viewform?embedded=true";

type ModalType = "call" | "apply" | null;

//  Form Modal 

interface FormModalProps {
  title: string;
  subtitle: string;
  formUrl: string;
  accentColor: string;
  onClose: () => void;
}

function FormModal({ title, subtitle, formUrl, accentColor, onClose }: FormModalProps) {
  const [loadCount, setLoadCount] = useState(0);
  const submitted = loadCount >= 2;
  const handleLoad = () => setLoadCount((n) => n + 1);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#0A1128]/80 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-2xl h-[92vh] sm:h-[88vh] flex flex-col shadow-2xl overflow-hidden sm:rounded-sm"
        style={{ borderTop: `4px solid ${accentColor}` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-neutral-100 shrink-0">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-[#4B1E91] mb-0.5">
              {submitted ? "Submitted Successfully" : "The Emerson Empire"}
            </p>
            <h3 className="text-sm font-bold text-[#0A1128]">{title}</h3>
            <p className="text-xs font-mono text-neutral-400 mt-0.5">{subtitle}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-neutral-300 hover:text-[#0A1128] text-xl ml-4 shrink-0 leading-none transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Submitted state */}
        {submitted ? (
          <div className="flex flex-col items-center justify-center flex-1 px-8 py-12 text-center">
            <div
              className="w-14 h-14 flex items-center justify-center text-[#0A1128] text-2xl font-bold mb-5"
              style={{ background: accentColor }}
            >
              ✓
            </div>
            <h3 className="text-xl font-bold text-[#0A1128] mb-3">Submitted!</h3>
            <p className="text-sm text-neutral-500 leading-relaxed max-w-sm mb-8">
              Thank you for reaching out to The Emerson Empire. A member of our team will follow up with you shortly at the contact information you provided.
            </p>
            <button
              onClick={onClose}
              className="border font-mono text-xs uppercase tracking-wider py-3 px-8 hover:opacity-80 transition-opacity"
              style={{ borderColor: accentColor, color: accentColor }}
            >
              Done
            </button>
          </div>
        ) : (
          /* Embedded Google Form */
          <iframe
            src={formUrl}
            onLoad={handleLoad}
            title={title}
            className="flex-1 w-full border-none"
            allow="camera; microphone"
          />
        )}
      </div>
    </div>
  );
}

//  Call Section 

const Call: React.FC = () => {
  const [openModal, setOpenModal] = useState<ModalType>(null);

  return (
    <>
      <section
        id="apply"
        className="relative bg-[#0A1128] px-6 sm:px-10 lg:px-16 py-28 lg:py-40 overflow-hidden"
      >
        {/* Decorative rings */}
        <div aria-hidden="true" className="-bottom-40 -left-40 absolute border border-[#C9A84C]/08 rounded-full w-140 h-140 pointer-events-none" />
        <div aria-hidden="true" className="-bottom-20 -left-20 absolute border border-[#C9A84C]/10 w-90 h-90 rounded-full pointer-events-none" />
        <div aria-hidden="true" className="-top-40 -right-40 absolute border border-[#4B1E91]/30 rounded-full w-120 h-120 pointer-events-none" />

        {/* Gold top border accent */}
        <div className="top-0 right-0 left-0 absolute bg-[#C9A84C] h-0.75" />

        <div className="relative flex flex-col items-center mx-auto max-w-5xl text-center">
          {/* Label */}
          <motion.p
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.45 }}
            className="mb-6 font-semibold text-[#C9A84C] text-sm sm:text-base uppercase tracking-[4px]"
          >
            Ready to Move Forward?
          </motion.p>

          {/* Headline */}
          <motion.h2
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="mb-8 font-bold text-[40px] text-white sm:text-[60px] lg:text-[76px] uppercase leading-none tracking-tight heading"
          >
            Your Next Step <br className="hidden sm:block" />
            Starts Here.
          </motion.h2>

          {/* Divider */}
          <motion.div
            whileInView={{ scaleX: 1 }}
            initial={{ scaleX: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="bg-[#C9A84C] mb-10 w-24 h-0.75"
          />

          {/* Supporting copy */}
          <motion.p
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-14 max-w-2xl text-[#F5F0E8]/60 text-lg sm:text-2xl leading-[1.9]"
          >
            Whether you're looking to launch a career, grow a business, or get your
            finances in order — we're here to help you do it right. Apply today and
            take the first real step.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex sm:flex-row flex-col items-center gap-4"
          >
            <button
              onClick={() => setOpenModal("apply")}
              className="group inline-flex items-center gap-3 bg-[#C9A84C] hover:bg-[#b8943d] px-10 py-5 rounded-full font-bold text-[#0A1128] text-base sm:text-lg uppercase tracking-[3px] active:scale-95 transition-all duration-200"
            >
              Apply Now
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-1 duration-200" />
            </button>

            <button
              onClick={() => setOpenModal("call")}
              className="group inline-flex items-center gap-3 px-10 py-5 border border-[#F5F0E8]/20 hover:border-[#C9A84C]/60 rounded-full font-bold text-[#F5F0E8]/70 text-base sm:text-lg hover:text-[#C9A84C] uppercase tracking-[3px] active:scale-95 transition-all duration-200"
            >
              <Phone size={18} className="group-hover:scale-110 transition-transform duration-200" />
              Book a Free Call
            </button>
          </motion.div>

          {/* Trust signal */}
          <motion.div
            whileInView={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="flex flex-col items-center gap-2 mt-10"
          >
            <div className="flex items-center gap-2 text-[#F5F0E8]/40">
              <Users size={14} />
              <p className="text-sm uppercase tracking-[2px]">
                Join 500+ students already building their future
              </p>
            </div>
            <p className="text-[#F5F0E8]/25 text-xs uppercase tracking-[2px]">
              No commitment required — just a conversation.
            </p>
          </motion.div>
        </div>
      </section>

      {/*  Modals  */}
      {openModal === "call" && (
        <FormModal
          title="Book a Free Call"
          subtitle="Schedule a free consultation with The Emerson Empire"
          formUrl={BOOK_CALL_FORM_URL}
          accentColor="#C9A84C"
          onClose={() => setOpenModal(null)}
        />
      )}

      {openModal === "apply" && (
        <FormModal
          title="Apply Now"
          subtitle="Submit your application to The Emerson Empire"
          formUrl={APPLY_FORM_URL}
          accentColor="#4B1E91"
          onClose={() => setOpenModal(null)}
        />
      )}
    </>
  );
};

export default Call;
