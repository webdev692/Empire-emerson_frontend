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
    <footer className="bg-[#03140f] px-4 pt-16 border-t border-white/10 text-white">
      <div className="mx-auto max-w-[1114px]">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <img src={logo} alt="EPDG logo" className="h-16 w-16 rounded-full border border-white/10 object-cover" />
            <div>
              <p className="font-semibold uppercase tracking-[0.24em] text-[#C9A84C] text-xs">EPDG</p>
              <p className="text-sm text-white/70">Professional development for learners, leaders, and teams.</p>
            </div>
          </div>
          <div className="flex gap-3">
            {socialIcons.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target={s.href.startsWith("mailto") ? undefined : "_blank"}
                rel={s.href.startsWith("mailto") ? undefined : "noreferrer"}
                aria-label={s.name}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:border-[#C9A84C] hover:text-[#C9A84C]"
              >
                {s.svg}
              </a>
            ))}
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3 mb-14 text-sm text-white/70">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.24em] text-[#C9A84C]">Contact</p>
            <div className="space-y-3">
              <a href="mailto:admin@theemersonempire.info" className="block hover:text-[#C9A84C]">admin@theemersonempire.info</a>
              <a href="tel:+18034794492" className="block hover:text-[#C9A84C]">+1 (803) 479-4492</a>
              <p>Columbia, SC United States</p>
            </div>
          </div>

          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.24em] text-[#C9A84C]">Navigate</p>
            <ul className="space-y-3">
              {navigateLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="hover:text-[#C9A84C]">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.24em] text-[#C9A84C]">Forms</p>
            <ul className="space-y-3">
              {formsLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="hover:text-[#C9A84C]">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Emerson Professional Development Group</p>
          <a href="mailto:admin@theemersonempire.info" className="hover:text-[#C9A84C]">Contact Us</a>
        </div>
      </div>
    </footer>
  );
};

export default EPDGFooter;
