import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa';
import { Menu, X } from 'lucide-react';
import { EmpersonLogo } from '../../assets';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

const navClass = ({ isActive }: { isActive: boolean }) =>
  `nav-link ${isActive ? 'text-[#C9A84C]' : 'text-white/75 hover:text-white'}`;

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

// Keep this query aligned with the desktop navigation media query in index.css.
const DESKTOP_QUERY = '(min-width: 80rem)';

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const menuTrigger = useRef<HTMLButtonElement>(null);
  const pointerDown = useRef(false);
  useBodyScrollLock(menuOpen);

  // Pointer clicks finish before collapsing an accordion, so lower links do not move under the pointer.
  const closeMenus = () => { setMenuOpen(false); setOpenDropdown(null); };

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_QUERY);
    const reset = () => { setMenuOpen(false); setOpenDropdown(null); };
    const releasePointer = () => { pointerDown.current = false; };
    const outside = (event: PointerEvent) => {
      pointerDown.current = true;
      if (!navRef.current?.contains(event.target as Node)) reset();
    };
    media.addEventListener('change', reset);
    document.addEventListener('pointerdown', outside);
    document.addEventListener('click', releasePointer);
    document.addEventListener('keydown', releasePointer, true);
    document.addEventListener('pointercancel', releasePointer);
    return () => {
      media.removeEventListener('change', reset);
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('click', releasePointer);
      document.removeEventListener('keydown', releasePointer, true);
      document.removeEventListener('pointercancel', releasePointer);
    };
  }, []);

  return (
    <nav ref={navRef} aria-label="Main navigation" className="site-navigation"
      onBlur={(event) => {
        if (!pointerDown.current && !event.currentTarget.contains(event.relatedTarget as Node | null)) closeMenus();
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && menuOpen && !openDropdown) {
          event.preventDefault();
          closeMenus();
          menuTrigger.current?.focus();
        }
      }}
    >
      <div className="nav-bar">
        <NavLink to="/" aria-label="The Emerson Empire home" className="nav-logo" onClick={closeMenus}>
          <img src={EmpersonLogo} alt="Emerson Empire Logo" className="h-full w-full object-contain" />
        </NavLink>
        <button ref={menuTrigger} type="button" className="nav-menu-trigger"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen} aria-controls="primary-navigation"
          onClick={() => { setMenuOpen(!menuOpen); setOpenDropdown(null); }}>
          <span aria-hidden="true">{menuOpen ? <X size={24} /> : <Menu size={24} />}</span>
        </button>
        <div id="primary-navigation" className={`nav-panel ${menuOpen ? 'is-open' : ''}`}>
          <ul className="nav-list">
            {NAV_LINKS.map((link, index) => {
              const expanded = openDropdown === link.label;
              const panelId = `nav-dropdown-${index}`;
              return (
                <li key={link.label} className="nav-group"
                  onBlur={(event) => {
                    if (!pointerDown.current && !event.currentTarget.contains(event.relatedTarget as Node | null)) {
                      setOpenDropdown((current) => current === link.label ? null : current);
                    }
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Escape' && expanded) {
                      event.preventDefault();
                      event.stopPropagation();
                      setOpenDropdown(null);
                      event.currentTarget.querySelector<HTMLButtonElement>('button')?.focus();
                    }
                  }}>
                  <div className="nav-row">
                    <NavLink to={link.href} end={link.href === '/'} className={navClass}
                      onClick={() => { closeMenus(); if (link.href === '/') window.scrollTo(0, 0); }}>
                      {link.label}
                    </NavLink>
                    {link.dropdown && (
                      <button type="button" className="nav-disclosure" aria-label={`${link.label} submenu`}
                        aria-expanded={expanded} aria-controls={panelId}
                        onClick={() => setOpenDropdown(expanded ? null : link.label)}>
                        <FaChevronDown aria-hidden="true" size={12} className={expanded ? 'rotate-180' : ''} />
                      </button>
                    )}
                  </div>
                  {link.dropdown && (
                    <ul id={panelId} hidden={!expanded} className="nav-dropdown">
                      {link.dropdown.map((item) => (
                        <li key={item.label}><NavLink to={item.href} onClick={closeMenus}>{item.label}</NavLink></li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
          <NavLink to="/contact" onClick={closeMenus} className="nav-contact">Contact Us</NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
