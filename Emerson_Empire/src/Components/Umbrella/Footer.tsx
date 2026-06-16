import React from 'react';
import { Link } from 'react-router-dom';
import { EmpersonLogo } from '../../assets';

const NAVIGATE = [
  { label: 'Home',      href: '/' },
  { label: 'Classes',   href: '/classes' },
  { label: 'About Us',  href: '/about' },
  { label: 'Contact',   href: '/contact' },
];

const SERVICES = [
  { label: 'Internships',     href: '/global-internship' },
  { label: 'Tax Preparation', href: '/classes' },
  { label: 'Consultation',    href: '/contact' },
  { label: 'Coaching',        href: '/classes' },
];

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0D0118] text-white">

      {/* â”€â”€ Main content â”€â”€ */}
      <div className="mx-auto px-6 sm:px-10 lg:px-16 pt-14 pb-10 max-w-7xl">
        <div className="gap-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">

          {/* Brand column */}
          <div className="flex flex-col items-center sm:items-start sm:text-left text-center">
            {/* EE text logo */}
            <div className="flex items-center gap-3 mb-2 w-[50%]">
  <img 
    src={EmpersonLogo} 
    alt="Emerson logo" 
    className="w-40 h-auto object-contain"
  />
</div>

            {/* Description */}
            <p className="mb-7 max-w-55 text-xs text-white/45 italic leading-[1.85]">
              We turn potential into proof by giving you the skills, experience, and support to move forward.
            </p>

            {/* Social icons */}
            <div className="flex justify-center sm:justify-start gap-2.5">
              {/* Instagram */}
              <a href="https://www.instagram.com/theemersonempire/" aria-label="Instagram" className="flex justify-center items-center bg-white/8 hover:bg-[#C9A84C]/20 border border-white/10 hover:border-[#C9A84C]/30 rounded-md w-9 h-9 transition-colors duration-200">
                <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/60">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="https://www.linkedin.com/company/the-emerson-empire/?viewAsMember=true" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="flex justify-center items-center bg-white/8 hover:bg-[#C9A84C]/20 border border-white/10 hover:border-[#C9A84C]/30 rounded-md w-9 h-9 transition-colors duration-200">
                <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/60">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              {/* Facebook */}
              <a href="https://www.facebook.com/profile.php?id=61589410794050" target="_blank" rel="noreferrer" aria-label="Facebook" className="flex justify-center items-center bg-white/8 hover:bg-[#C9A84C]/20 border border-white/10 hover:border-[#C9A84C]/30 rounded-md w-9 h-9 transition-colors duration-200">
                <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/60">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              {/* Email */}
              <a href="mailto:admin@theemersonempire.info" aria-label="Email" className="flex justify-center items-center bg-white/8 hover:bg-[#C9A84C]/20 border border-white/10 hover:border-[#C9A84C]/30 rounded-md w-9 h-9 transition-colors duration-200">
                <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/60">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigate */}
          <div className="flex flex-col items-center sm:items-start sm:text-left text-center">
            <p className="mb-0 font-bold text-[#C9A84C] text-xs uppercase tracking-[0.2em]">Navigate</p>
            <ul className="flex flex-col items-center sm:items-start gap-0">
              {NAVIGATE.map(l => (
                <li key={l.label}>
                  <Link to={l.href} className="text-sm text-white/45 hover:text-[#C9A84C] tracking-wide transition-colors duration-200">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="flex flex-col items-center sm:items-start sm:text-left text-center">
            <p className="mb-0 font-bold text-[#C9A84C] text-xs uppercase tracking-[0.2em]">Services</p>
            <ul className="flex flex-col items-center sm:items-start gap-0">
              {SERVICES.map(l => (
                <li key={l.label}>
                  <Link to={l.href} className="text-sm text-white/45 hover:text-[#C9A84C] tracking-wide transition-colors duration-200">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col items-center sm:items-start sm:text-left text-center">
            <p className="mb-5 font-bold text-[#C9A84C] text-xs uppercase tracking-[0.2em]">Contact</p>
            <ul className="flex flex-col items-center sm:items-start gap-0">
              <li className="flex items-start gap-2.5">
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <a href="mailto:admin@theemersonempire.info" className="text-sm text-white/45 hover:text-[#C9A84C] break-all tracking-wide transition-colors duration-200">
                 admin@theemersonempire.info
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.08 6.08l1.27-.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span className="text-sm text-white/45 tracking-wide">+1 803 479-4492</span>
              </li>
              <li className="flex items-start gap-2.5">
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span className="text-sm text-white/45 tracking-wide">United States</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* â”€â”€ Disclaimer strip â”€â”€ */}
      <div className="bg-black/20 border-white/8 border-t">
        <div className="mx-auto px-6 sm:px-10 lg:px-16 py-5 max-w-7xl">
          <p className="text-xs text-white/30 leading-relaxed">
            <span className="font-semibold text-white/40">Disclaimer: </span>
            The Emerson Empire, The Emerson Agency LLC, and Emerson Professional Development Group
            are not law firms, licensed financial advisors, or certified public accounting firms.
            All classes, workshops, and sessions are educational in nature. No outcomes are
            guaranteed â€” including employment, revenue, tax results, credit improvement, or business
            success. Fee waivers are subject to availability. Do not submit sensitive personal or
            financial information through general contact forms.{' '}
            <Link to="/disclaimer" className="text-white/40 hover:text-[#C9A84C] underline transition-colors duration-200">
              Read full disclaimer.
            </Link>
          </p>
        </div>
      </div>

      {/* â”€â”€ Bottom bar â”€â”€ */}
      <div className="border-white/8 border-t">
        <div className="flex sm:flex-row flex-col justify-between items-center gap-3 mx-auto px-6 sm:px-10 lg:px-16 py-5 max-w-7xl sm:text-left text-center">
          <p className="text-xs text-white/30 tracking-wide">
            Â© {year} The Emerson Empire. All rights reserved.
          </p>
          <div className="flex gap-5">
            <Link to="/disclaimer" className="text-xs text-white/30 hover:text-[#C9A84C] tracking-wide transition-colors duration-200">
              Disclaimer
            </Link>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
