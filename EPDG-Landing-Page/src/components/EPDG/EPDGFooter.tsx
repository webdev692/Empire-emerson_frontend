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
  { label: "Business Consultation", href: "#contact" },
];

const iconProps = {
  className: "w-[18px] h-[18px]",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

const MailIcon: React.FC = () => (
  <svg {...iconProps}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-10 7L2 7" />
  </svg>
);

const PhoneIcon: React.FC = () => (
  <svg {...iconProps}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const PinIcon: React.FC = () => (
  <svg {...iconProps}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

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
    <footer className="bg-[#0C2117] px-4 pt-16 pb-8 text-white">
      <div className="mx-auto max-w-278.5">
        <div className="gap-10 lg:gap-8 grid lg:grid-cols-[1.6fr_1fr_1fr]">
          {/* Brand + contact + social */}
          <div>
            <div className="flex items-center gap-4 mb-9">
              <img
                src={logo}
                alt="EPDG logo"
                className="rounded-full w-16 h-16 object-cover shrink-0"
              />
              <p className="max-w-[17rem] font-bold text-white text-2xl sm:text-3xl leading-[1.1] heading">
                Emerson Professional Development Group
              </p>
            </div>

            <p className="mb-4 font-bold text-[#C9A84C] text-base uppercase tracking-[0.1em]">
              Contact
            </p>
            <div className="space-y-3.5 text-white/85 text-[15px]">
              <a
                href="mailto:admin@theemersonempire.info"
                className="flex items-center gap-2.5 hover:text-[#C9A84C] transition-colors"
              >
                <span className="text-[#C9A84C]"><MailIcon /></span>
                admin@theemersonempire.info
              </a>
              <a
                href="tel:+18034794492"
                className="flex items-center gap-2.5 hover:text-[#C9A84C] transition-colors"
              >
                <span className="text-[#C9A84C]"><PhoneIcon /></span>
                +1 (803) 479-4492
              </a>
              <p className="flex items-center gap-2.5">
                <span className="text-[#C9A84C]"><PinIcon /></span>
                Columbia, SC United States
              </p>
            </div>

            <div className="flex gap-3 mt-7">
              {socialIcons.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target={s.href.startsWith("mailto") ? undefined : "_blank"}
                  rel={s.href.startsWith("mailto") ? undefined : "noreferrer"}
                  aria-label={s.name}
                  className="flex justify-center items-center border border-white/15 hover:border-[#C9A84C] rounded-xl w-11 h-11 text-white hover:text-[#C9A84C] transition"
                >
                  {s.svg}
                </a>
              ))}
            </div>
          </div>

          {/* Navigate */}
          <div>
            <p className="mb-5 font-bold text-[#C9A84C] text-base uppercase tracking-[0.1em]">
              Navigate
            </p>
            <ul className="space-y-3.5 text-white/85 text-[15px]">
              {navigateLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="hover:text-[#C9A84C] transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Forms & Access */}
          <div>
            <p className="mb-5 font-bold text-[#C9A84C] text-base uppercase tracking-[0.1em]">
              Forms &amp; Access
            </p>
            <ul className="space-y-3.5 text-white/85 text-[15px]">
              {formsLinks.map((l, i) => (
                <li key={`${l.label}-${i}`}>
                  <a href={l.href} className="hover:text-[#C9A84C] transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-4 mt-14 pt-6 border-white/10 border-t text-white/60 text-sm">
          <p>© {new Date().getFullYear()} The Emerson Empire. All rights reserved.</p>
          <div className="flex gap-10">
            <a href="#" className="hover:text-[#C9A84C] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#C9A84C] transition-colors">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default EPDGFooter;
