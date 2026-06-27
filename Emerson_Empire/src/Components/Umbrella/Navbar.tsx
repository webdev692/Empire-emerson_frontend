import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { EmpersonLogo } from '../../assets';
 
const navClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.15em] transition-colors duration-200 ${
    isActive ? 'text-[#C9A84C]' : 'text-white/60 hover:text-white'
  }`;

const NAV_LINKS = [
  { label: 'HOME', href: '/' },
  {
    label: 'Classes', href: '/classes',
    dropdown: [
      { label: 'Weekly Classes',  href: '/classes#weekly-classes'  },
      { label: 'Register Today',  href: '/classes#class-catalog'   },
      { label: 'Free Workshop',   href: '/classes#class-catalog'   },
    ]
  },
  {
    label: 'Services and Packages', href: '/services',
    dropdown: [
      { label: 'Professional Development',     href: '/services#epdg'           },
      { label: 'Organize Individual Services', href: '/services#emerson-empire' },
      { label: 'Business Services',            href: '/services#emerson-agency' },
      { label: 'Consultation Pathway',         href: '/services#emerson-empire' },
      { label: 'Internship Registration',      href: '/services#epdg'           },
    ]
  },
  {
    label: 'Global Internship', href: '/global-internship',
    dropdown: [
      { label: 'Application Form',       href: '/global-internship#application-form'     },
      { label: 'Tracks',                 href: '/global-internship#tracks'               },
      { label: 'Portfolio',              href: '/global-internship#portfolio'             },
      { label: 'Evidence & Certificates',href: '/global-internship#evidence-certificates'},
    ]
  },
  { label: 'About Us', href: '/about' },
 
];

const Navbar: React.FC = () => {
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <nav
      aria-label="Main navigation"
      className="top-0 z-50 fixed bg-[#1C1336] border-[#C9A84C]/20 border-b w-full"
    >
      {/* Main bar */}
      <div className="flex justify-between items-center shadow-md shadow-white mx-auto px-4 sm:px-2 lg:px-10 w-full h-20 sm:h-20">

        {/* Logo */}
          <div className="m-1 w-[80%] sm:w-[20%] h-full">


             <img
              src={EmpersonLogo}
              alt="Emerson Empire Logo"
             
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>
           
         
          
         

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-6 lg:gap-8 m-0 p-0 list-none">
          {NAV_LINKS.map((link) => (
            <li
              key={link.label}
              className="relative"
              onMouseEnter={() => link.dropdown && setOpenDropdown(link.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <NavLink
                to={link.href}
                end={link.href === '/'}
                onClick={() => { if (link.href === '/') window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className={navClass}
              >
                {link.label}
                {link.dropdown && (
                  <FaChevronDown
                    size={9}
                    className={`transition-transform duration-200 ${openDropdown === link.label ? 'rotate-180' : ''}`}
                  />
                )}
              </NavLink>

              {/* Desktop dropdown panel */}
              {link.dropdown && openDropdown === link.label && (
                <div className="top-full left-0 z-50 absolute pt-2 w-56">
                  <div className="bg-[#1C1336] shadow-xl border border-[#C9A84C]/20 rounded-sm">
                    {link.dropdown.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        className="block hover:bg-[#C9A84C]/10 px-4 py-3 border-[#C9A84C]/10 border-b last:border-b-0 font-semibold text-xs text-white/60 hover:text-[#C9A84C] uppercase tracking-[0.15em] transition-colors duration-200"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <NavLink
          to="/contact"
          className="hidden md:inline-flex items-center bg-[#C9A84C] hover:bg-[#E8C97A] px-5 py-2 rounded-sm font-bold text-[#1C1336] text-xs uppercase tracking-[0.2em] transition-colors duration-200 shrink-0"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          Contact Us
        </NavLink>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center gap-1.25 shadow-md shadow-white rounded-b-3xl focus-visible:outline-none focus-visible:ring-[#C9A84C] focus-visible:ring-2 w-10 h-10 shrink-0"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span className={`block w-6 h-0.5 bg-[#C9A84C] transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-1.75' : ''}`} />
          <span className={`block w-6 h-0.5 bg-[#C9A84C] transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-[#C9A84C] transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-1.75' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col bg-[#1C1336] px-4 pb-5 border-[#C9A84C]/15 border-t max-h-[calc(100vh-4rem)] overflow-y-auto">
          {NAV_LINKS.map((link) => (
            <div key={link.label}>

              {/* Main row */}
              <div className="flex justify-between items-center border-[#C9A84C]/10 border-b">
                <NavLink
                  to={link.href}
                  end={link.href === '/'}
                  onClick={() => { setMenuOpen(false); if (link.href === '/') window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={({ isActive }) =>
                    `flex-1 py-3 font-medium text-xs uppercase tracking-[0.2em] transition-colors duration-200 ${
                      isActive ? 'text-[#C9A84C]' : 'text-white/60 hover:text-[#C9A84C]'
                    }`
                  }
                >
                  {link.label}
                </NavLink>

                {/* Arrow — only if has dropdown */}
                {link.dropdown && (
                  <button
                    type="button"
                    onClick={() => setOpenDropdown(openDropdown === link.label ? null : link.label)}
                    className="px-3 py-3 text-[#C9A84C] text-xs"
                  >
                    {openDropdown === link.label ? <FaChevronUp size={9} /> : <FaChevronDown size={9} />}
                  </button>
                )}
              </div>

              {/* Sub-links */}
              {link.dropdown && openDropdown === link.label && (
                <div className="bg-[#C9A84C]/5 pl-4">
                  {link.dropdown.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="block py-2.5 border-[#C9A84C]/10 border-b last:border-b-0 text-xs text-white/50 hover:text-[#C9A84C] uppercase tracking-[0.15em] transition-colors duration-200"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}

          <NavLink
            to="/contact"
            onClick={() => setMenuOpen(false)}
            className="inline-flex justify-center bg-[#C9A84C] hover:bg-[#E8C97A] mt-4 px-5 py-3 rounded-sm font-bold text-[#1C1336] text-xs uppercase tracking-[0.2em] transition-colors duration-200"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Contact Us
          </NavLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
