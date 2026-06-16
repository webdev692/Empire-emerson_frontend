import React from "react";
import { logo } from "../../assets";

const navigateLinks = [
  { label: "Weekly Classes", href: "#classes" },
  { label: "Career Services", href: "#services" },
  { label: "Internship Program", href: "#internships" },
  { label: "Workforce Training", href: "#workforce" },
  { label: "Partnership", href: "#contact" },
];

const formsLinks = [
  { label: "Register for Classes", href: "#contact" },
  { label: "Request Services", href: "#contact" },
  { label: "Internship Application", href: "#contact" },
  { label: "Business Consultation", href: "#contact" },
  { label: "Fee Waiver Request", href: "#contact" },
];

const iconProps = {
  className: "w-4 h-4",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

const socialIcons = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/theemersonempire/",
    svg: (
      <svg {...iconProps}>
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/the-emerson-empire/?viewAsMember=true",
    svg: (
      <svg {...iconProps}>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4V8h4v1.5" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61589410794050",
    svg: (
      <svg {...iconProps}>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@theemersonempire?_r=1&_t=ZP-96Pc5JkxqYh",
    svg: (
      <svg {...iconProps}>
        <path d="M14 3v9.5a3.5 3.5 0 1 1-3.5-3.5" />
        <path d="M14 5a5 5 0 0 0 5 5" />
      </svg>
    ),
  },
  {
    name: "Email",
    href: "mailto:admin@theemersonempire.info",
    svg: (
      <svg {...iconProps}>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-10 7L2 7" />
      </svg>
    ),
  },
];

const EPDGFooter: React.FC = () => {
  return (
    <footer className="bg-[#022B1F] px-4 pt-16 border-[#C9A84C]/15 border-t text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <img src={logo} alt="EPDG logo" className="w-auto h-32" />
        </div>

        <div className="gap-12 grid grid-cols-1 md:grid-cols-3 pb-14">
          {/* Brand + contact */}
          <div>
            <p className="mb-5 font-bold text-[#C9A84C] text-[10px] uppercase tracking-[0.2em]">
              Contact
            </p>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3 text-white/65 hover:text-white transition-colors">
                <span className="text-[#C9A84C] shrink-0">
                  <svg {...iconProps}>
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-10 7L2 7" />
                  </svg>
                </span>
                <a href="mailto:admin@theemersonempire.info" className="hover:text-[#C9A84C] transition-colors">
                  admin@theemersonempire.info
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/65">
                <span className="text-[#C9A84C] shrink-0">
                  <svg {...iconProps}>
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </span>
                <a href="tel:+18034794492" className="hover:text-[#C9A84C] transition-colors">
                  +1 (803) 479-4492
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/65">
                <span className="text-[#C9A84C] shrink-0">
                  <svg {...iconProps}>
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </span>
                <span>Columbia, SC United States</span>
              </li>
            </ul>

            {/* Social icons */}
            <div className="flex gap-2.5 mt-8">
              {socialIcons.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target={s.href.startsWith("mailto") ? undefined : "_blank"}
                  rel={s.href.startsWith("mailto") ? undefined : "noreferrer"}
                  aria-label={s.name}
                  className="flex justify-center items-center border border-white/15 hover:border-[#C9A84C] w-9 h-9 text-white/50 hover:text-[#C9A84C] transition-all duration-200"
                >
                  {s.svg}
                </a>
              ))}
            </div>
          </div>

          {/* Navigate */}
          <div>
            <p className="mb-6 font-bold text-[#C9A84C] text-[10px] uppercase tracking-[0.2em]">
              Navigate
            </p>
            <ul className="space-y-4 text-sm">
              {navigateLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-white/60 hover:text-[#C9A84C] transition-colors duration-200">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Forms & Access */}
          <div>
            <p className="mb-6 font-bold text-[#C9A84C] text-[10px] uppercase tracking-[0.2em]">
              Forms &amp; Access
            </p>
            <ul className="space-y-4 text-sm">
              {formsLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-white/60 hover:text-[#C9A84C] transition-colors duration-200">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex sm:flex-row flex-col justify-between items-center gap-4 py-6 border-white/10 border-t">
          <p className="text-white/35 text-xs tracking-wide">
            &copy; {new Date().getFullYear()} The Emerson Empire. All rights reserved.
          </p>
          <div className="flex gap-8 text-xs">
            <a href="mailto:admin@theemersonempire.info" className="text-white/35 hover:text-[#C9A84C] transition-colors duration-200">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default EPDGFooter;
