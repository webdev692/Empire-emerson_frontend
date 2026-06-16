import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Clock, Send, ExternalLink, Check } from "lucide-react";

// ── Data ──────────────────────────────────────────────────────────────────────

const CONTACT_CHANNELS = [
  {
    icon: Mail,
    label: "Email",
    value: "webdev@theemersonempire.info",
    href: "mailto:webdev@theemersonempire.info",
    description: "For general inquiries, program questions, and partnership requests.",
  },
  {
    icon: Clock,
    label: "Response Time",
    value: "24–48 Business Hours",
    href: null,
    description: "We respond to all inquiries within one to two business days, Monday through Saturday.",
  },
];

const QUICK_LINKS = [
  { label: "Register for a Class", href: "/classes" },
  { label: "Book a Free Call",     href: "/about#apply" },
  { label: "Apply Now",            href: "/about#apply" },
  { label: "Global Internship",    href: "/global-internship" },
];

// ── Input / Textarea shared style ─────────────────────────────────────────────

const fieldCls =
  "w-full px-4 py-3 border border-neutral-200 bg-white font-mono text-[14px] focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-[#C9A84C] placeholder-neutral-300 transition-colors";

// ── Component ─────────────────────────────────────────────────────────────────

const Contact: React.FC = () => {
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading,   setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error,     setError]     = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("https://formsubmit.co/ajax/webdev@theemersonempire.info", {
        method:  "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body:    JSON.stringify({ name, email, _subject: subject || "New Contact Form Message", message }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError("Something went wrong. Please try again or email us directly.");
      }
    } catch {
      setError("Something went wrong. Please try again or email us directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="contact" className="bg-white pt-16 sm:pt-20 min-h-screen font-sans antialiased">

      {/* ── Hero ── */}
      <div className="bg-[#12022A] px-6 sm:px-10 lg:px-16 py-24">
        <div className="mx-auto max-w-7xl">
          <motion.p
            whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.45 }}
            className="mb-4 font-semibold text-[#C9A84C] text-[16px] uppercase tracking-[4px]"
          >
            Contact Us
          </motion.p>
          <motion.h1
            whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.5, delay: 0.07 }}
            className="font-bold text-[44px] text-white sm:text-[64px] lg:text-[72px] uppercase leading-none tracking-tight heading"
          >
            Let's Talk.
          </motion.h1>
          <motion.div
            whileInView={{ scaleX: 1 }} initial={{ scaleX: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            style={{ originX: 0 }}
            className="bg-[#C9A84C] mt-8 w-24 h-0.75"
          />
          <motion.p
            whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.5, delay: 0.22 }}
            className="mt-8 max-w-2xl text-[16px] text-white/55 text-lg sm:text-xl leading-[1.9]"
          >
            Have a question about our programs, classes, or services? We'd love to hear from you.
          </motion.p>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="mx-auto px-6 sm:px-10 lg:px-16 py-20 max-w-7xl">
        <div className="gap-16 grid lg:grid-cols-2">

          {/* ── Left: Info ── */}
          <div>
            <h2 className="mb-4 font-bold text-[#12022A] text-[28px] sm:text-[36px] uppercase leading-tight heading">
              We're Here to Help.
            </h2>
            <p className="mb-10 text-[#12022A]/55 text-[16px] sm:text-lg leading-[1.9]">
              Whether you have questions about our classes, services, internship program, fee waivers, or partnerships — fill out the form and our team will follow up promptly.
            </p>

            {/* Contact channels */}
            <div className="space-y-4 mb-10">
              {CONTACT_CHANNELS.map((ch) => {
                const Icon = ch.icon;
                return (
                  <motion.div
                    key={ch.label}
                    whileInView={{ opacity: 1, x: 0 }} initial={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.4 }}
                    className="flex gap-4 p-5 border border-neutral-100 hover:border-[#C9A84C]/40 transition-colors duration-200"
                  >
                    <div className="flex justify-center items-center bg-[#4B1E91]/10 rounded-xl w-10 h-10 shrink-0">
                      <Icon size={18} className="text-[#4B1E91]" />
                    </div>
                    <div>
                      <p className="mb-0.5 font-mono text-[#C9A84C] text-[16px] uppercase tracking-widest">{ch.label}</p>
                      {ch.href ? (
                        <a href={ch.href} className="font-bold text-[#12022A] text-[13px] hover:text-[#4B1E91] transition-colors">
                          {ch.value}
                        </a>
                      ) : (
                        <p className="font-bold text-[#12022A] text-[13px]">{ch.value}</p>
                      )}
                      <p className="mt-1 text-[#12022A]/45 text-[13px] leading-relaxed">{ch.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Quick links */}
            <div className="mb-10">
              <p className="mb-4 font-mono text-[#4B1E91] text-[16px] uppercase tracking-widest">Quick Links</p>
              <div className="gap-2 grid grid-cols-2">
                {QUICK_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="px-4 py-3 border border-neutral-100 hover:border-[#4B1E91] font-mono text-neutral-500 hover:text-[#4B1E91] text-xs text-center uppercase tracking-wider transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Social */}
            <div>
              <p className="mb-4 font-mono text-[#4B1E91] text-[13px] uppercase tracking-widest">Follow The Emerson Empire</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Instagram", href: "https://www.instagram.com/theemersonempire/" },
                  { label: "Facebook",  href: "https://www.facebook.com/profile.php?id=61589315787826" },
                  { label: "LinkedIn",  href: "https://www.linkedin.com/company/the-emerson-empire/?viewAsMember=true" },
                  { label: "TikTok",    href: "https://www.tiktok.com/@theemersonempire?_r=1&_t=ZP-96Pc5JkxqYh" },
                ].map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 border border-neutral-500 hover:border-[#C9A84C] font-mono text-neutral-700 hover:text-[#C9A84C] text-xs uppercase tracking-wider transition-colors duration-200"
                  >
                    {label}
                    <ExternalLink size={10} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Form ── */}
          <div>
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="flex flex-col justify-center items-center py-20 h-full text-center"
              >
                <div className="flex justify-center items-center bg-[#C9A84C] mb-6 w-16 h-16">
                  <Check size={28} className="text-[#12022A]" strokeWidth={3} />
                </div>
                <h3 className="mb-3 font-bold text-[#12022A] text-2xl uppercase heading">Message Sent!</h3>
                <p className="mb-8 max-w-sm text-[#12022A]/55 text-[14px] leading-relaxed">
                  Thank you for reaching out to The Emerson Empire. Our team will follow up within 24–48 business hours.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setName(""); setEmail(""); setSubject(""); setMessage(""); }}
                  className="hover:bg-[#4B1E91] px-8 py-3 border border-[#4B1E91] font-mono text-[#4B1E91] hover:text-white text-xs uppercase tracking-wider transition-colors duration-200"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <div className="bg-neutral-50 p-8 sm:p-10 border-[#4B1E91] border-t-4">
                <p className="mb-8 font-mono text-[#4B1E91] text-[14px] uppercase tracking-widest">Send a Message</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="gap-5 grid sm:grid-cols-2">
                    <div>
                      <label className="block mb-1.5 font-mono text-[#4B1E91] text-[14px] uppercase tracking-wider">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        className={fieldCls}
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1.5 font-mono text-[#4B1E91] text-[14px] uppercase tracking-wider">
                        Email Address <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className={fieldCls}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1.5 font-mono text-[#4B1E91] text-[14px] uppercase tracking-wider">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="What is this about?"
                      className={fieldCls}
                    />
                  </div>

                  <div>
                    <label className="block mb-1.5 font-mono text-[#4B1E91] text-[14px] uppercase tracking-wider">
                      Message <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us how we can help you..."
                      rows={6}
                      className={`${fieldCls} resize-none`}
                      required
                    />
                  </div>

                  {error && (
                    <p className="font-mono text-[14px] text-red-500">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex justify-center items-center gap-2 bg-[#4B1E91] hover:bg-[#3d1778] disabled:opacity-60 py-4 w-full font-mono text-white text-xs uppercase tracking-wider transition-colors duration-200"
                  >
                    {loading ? "Sending..." : (
                      <>Send Message <Send size={13} /></>
                    )}
                  </button>

                  <p className="font-mono text-neutral-400 text-xs text-center">
                    Or email us at{" "}
                    <a href="mailto:webdev@theemersonempire.info" className="text-[#C9A84C] hover:underline">
                      webdev@theemersonempire.info
                    </a>
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;