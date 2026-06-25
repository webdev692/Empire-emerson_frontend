import React from 'react';
import { Link } from 'react-router-dom';
import { EmpersonLogo } from '../../assets';

const NAVIGATE = [
  { label: 'Home',        href: '/' },
  { label: 'Classes',     href: '/classes' },
  { label: 'Services',    href: '/services' },
  { label: 'Internship',  href: '/global-internship' },
  { label: 'About Us',    href: '/about' },
];

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0D0118] text-white">

      {/* ── Main content ── */}
      <div className="mx-auto px-6 sm:px-10 lg:px-16 pt-14 pb-10 max-w-7xl">
        <div className="gap-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1.4fr]">

          {/* Brand column */}
          <div className="flex flex-col items-center sm:items-start sm:text-left text-center">
            {/* EE text logo */}
            <div className="flex items-center gap-3 mb-2 w-[50%]">
              <img
                src={EmpersonLogo}
                alt="Emerson logo"
                className="w-75 h-auto object-contain"
              />
            </div>

            {/* Description */}
            <p className="mb-7 max-w-85 text-xs text-white/90 leading-[1.85]">
              The Emerson Empire is a resource, education, and community guidance hub. Information provided through this website is for educational and general resource navigation purposes only. Services, referrals, partnerships, and reduced cost options are subject to availability and review.
            </p>

            {/* Social icons */}
            <div className="flex justify-center sm:justify-start gap-2.5">
              {/* Instagram */}
              <a href="https://www.instagram.com/theemersonempire/" target="_blank" rel="noreferrer" aria-label="Instagram" className="flex justify-center items-center bg-white/8 hover:bg-[#C9A84C]/20 border border-white/30 hover:border-[#C9A84C]/30 rounded-md w-9 h-9 transition-colors duration-200">
                <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/60">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="https://www.linkedin.com/company/the-emerson-empire/?viewAsMember=true" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="flex justify-center items-center bg-white/8 hover:bg-[#C9A84C]/20 border border-white/30 hover:border-[#C9A84C]/30 rounded-md w-9 h-9 transition-colors duration-200">
                <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/60">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              {/* Facebook */}
              <a href="https://www.facebook.com/profile.php?id=61589410794050" target="_blank" rel="noreferrer" aria-label="Facebook" className="flex justify-center items-center bg-white/8 hover:bg-[#C9A84C]/20 border border-white/30 hover:border-[#C9A84C]/30 rounded-md w-9 h-9 transition-colors duration-200">
                <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/60">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              {/* TikTok */}
              <a href="https://www.tiktok.com/@theemersonempire" target="_blank" rel="noreferrer" aria-label="TikTok" className="flex justify-center items-center bg-white/8 hover:bg-[#C9A84C]/20 border border-white/30 hover:border-[#C9A84C]/30 rounded-md w-9 h-9 transition-colors duration-200">
                <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="text-white/60">
                  <path d="M16.5 2h-2.9v12.4a2.6 2.6 0 1 1-2.2-2.56V8.9a5.5 5.5 0 1 0 5.1 5.48V8.66a6.6 6.6 0 0 0 3.9 1.26V7a3.7 3.7 0 0 1-3.9-3.6c0-.13 0-.27.01-.4z" />
                </svg>
              </a>
              {/* Email */}
              <a href="mailto:admin@theemersonempire.info" aria-label="Email" className="flex justify-center items-center bg-white/8 hover:bg-[#C9A84C]/20 border border-white/30 hover:border-[#C9A84C]/30 rounded-md w-9 h-9 transition-colors duration-200">
                <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/60">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigate */}
          <div className="flex flex-col items-center sm:items-start sm:text-left text-center">
            <p className="mb-3 font-bold text-[#C9A84C] text-xs uppercase tracking-[0.2em]">Navigate</p>
            <ul className="flex flex-col items-center sm:items-start">
              {NAVIGATE.map(l => (
                <li key={l.label}>
                  <Link to={l.href} className="text-sm text-white/90 hover:text-[#C9A84C] tracking-wide transition-colors duration-200">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col items-center sm:items-start sm:text-left text-center">
            <p className="mb-3 font-bold text-[#C9A84C] text-xs uppercase tracking-[0.2em]">Contact</p>
            <ul className="flex flex-col items-center sm:items-start gap-2.5">
              <li className="flex items-start gap-2.5">
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <a href="mailto:admin@theemersonempire.info" className="text-sm text-white/90 hover:text-[#C9A84C] break-all tracking-wide transition-colors duration-200">
                  admin@theemersonempire.info
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.08 6.08l1.27-.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <a href="tel:+18034794492" className="text-sm text-white/90 hover:text-[#C9A84C] tracking-wide transition-colors duration-200">+1 (803) 479-4492</a>
              </li>
              <li className="flex items-start gap-2.5">
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span className="text-sm text-white/90 tracking-wide">Columbia, SC United States</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      

      {/* ── Bottom bar ── */}
      <div className="border-white/40 border-t max-w-6xl mx-auto px-4">
        <div className="flex sm:flex-row flex-col justify-between items-center gap-3 mx-auto px-6 sm:px-10 lg:px-16 py-5 max-w-7xl sm:text-left text-center">
          <p className="text-sm text-white/90 tracking-wide">
            © {year} The Emerson Empire. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/disclaimer" className="text-sm text-white/90 hover:text-[#C9A84C] tracking-wide transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link to="/disclaimer" className="text-sm text-white/90 hover:text-[#C9A84C] tracking-wide transition-colors duration-200">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
