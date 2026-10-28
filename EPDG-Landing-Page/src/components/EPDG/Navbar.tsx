import { integratedPreview } from '../../../../shared/development-preview';
import { threeProgramsEnabled } from '../../../../shared/three-programs-mode';
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/EPDG_LOGO.webp";

type NavLink = { label: string; id: string } & (
  | { type: "home" }
  | { type: "route"; to: string }
  | { type: "section" }
);

const navLinks: NavLink[] = [
  { label: "Home", id: "home", type: "home" },
  { label: "Classes", id: "classes", type: "route", to: "/classes" },
  integratedPreview ? { label: "Services & Pricing", id: "services-pricing", type: "route", to: "/services-pricing" } : { label: "Services", id: "services", type: "section" },
  { label: "Internships", id: "internships", type: "section" },
  { label: "Workforce", id: "workforce", type: "section" },
  { label: "Contact", id: "contact", type: "section" },
  ...(integratedPreview ? [{ label: "Resources", id: "resources", type: "route" as const, to: "/resources" }, { label: "Learn", id: "learn", type: "route" as const, to: "/learn" }] : []),
  ...(threeProgramsEnabled ? [{ label: "Global Internship", id: "global-internship-program", type: "route" as const, to: "/global-internship-program" }] : []),
];

const PLATFORM_URL = "https://epdg.netlify.app/";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const [activeId, setActiveId] = useState("home");
  const navigate = useNavigate();
  const location = useLocation();
  const awayFromHome = location.pathname !== "/";
  const visibleActiveId = awayFromHome ? location.pathname.split("/")[1] : activeId;

  useEffect(() => {
    if (awayFromHome) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    ["home", "services", "internships", "workforce", "contact"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [awayFromHome]);

  const handleNav = (link: NavLink) => {
    setMenuOpen(false);
    if (link.type === "route") {
      navigate(link.to);
    } else if (link.type === "home") {
      if (awayFromHome) navigate("/");
      else window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      if (awayFromHome) {
        navigate("/", { state: { scrollTo: link.id } });
      } else {
        document.getElementById(link.id)?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav onKeyDown={event => { if (event.key === 'Escape' && menuOpen) { setMenuOpen(false); menuButton.current?.focus(); } }} aria-label="Main navigation" className="top-0 z-50 sticky bg-[#03140f]/95 backdrop-blur-sm border-white/10 border-b">
      <div className="flex justify-between items-center mx-auto px-4 py-4 max-w-278.5">
        <button
          onClick={() => handleNav(navLinks[0])}
          className="flex items-center gap-3 shrink-0 cursor-pointer"
          aria-label="EPDG home"
        >
          <img src={logo} alt="EPDG logo" className="border border-white/10 rounded-full w-12 h-12" />
          <span className="hidden xl:inline-block font-semibold text-white text-xs uppercase tracking-[0.16em]">
            EPDG
          </span>
        </button>

        <ul className="hidden xl:flex items-center gap-4 font-medium text-white/70 text-xs uppercase tracking-[0.12em]">
          {navLinks.map((link) => (
            <li key={link.id}>
              <button
                onClick={() => handleNav(link)}
                className={`cursor-pointer transition duration-200 ${
                  visibleActiveId === link.id
                    ? "text-[#C9A84C]"
                    : "hover:text-white"
                }`}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        {!integratedPreview && <div className="hidden xl:flex items-center gap-3">
          <a
            href={PLATFORM_URL}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 border border-white/10 hover:border-[#C9A84C] rounded-full font-semibold text-white/70 hover:text-white text-xs uppercase tracking-[0.18em] transition-all duration-200"
          >
            Log In
          </a>
          <a
            href={PLATFORM_URL}
            target="_blank"
            rel="noreferrer"
            className="bg-[#C9A84C] hover:bg-[#BDA55F] px-4 py-2 rounded-full font-semibold text-[#07120f] text-xs uppercase tracking-[0.18em] transition-all duration-200"
          >
            Create Account
          </a>
        </div>}

        <button
          className="xl:hidden flex justify-center items-center bg-[#03140f] border border-white/10 rounded-full w-11 h-11 text-white cursor-pointer"
          ref={menuButton}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          aria-controls="public-mobile-navigation"
        >
          <span className="sr-only">Toggle menu</span>
          <div className="relative w-5 h-5">
            <span className={`absolute left-0 top-0 h-0.5 w-5 rounded-full bg-white transition-transform ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`absolute left-0 top-2 h-0.5 w-5 rounded-full bg-white transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`absolute left-0 top-4 h-0.5 w-5 rounded-full bg-white transition-transform ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </div>
        </button>
      </div>

      {menuOpen && (
        <div id="public-mobile-navigation" className="xl:hidden max-h-[calc(100dvh-81px)] overflow-y-auto space-y-4 bg-[#03140f] px-4 pb-6 border-white/10 border-t">
          <ul className="flex flex-col gap-2 pt-4 text-white/75 text-xs uppercase tracking-[0.12em]">
            {navLinks.map((link) => (
              <li key={link.id}>
                <button
                  onClick={() => handleNav(link)}
                  className={`w-full text-left py-3 transition duration-200 cursor-pointer ${
                    visibleActiveId === link.id ? "text-[#C9A84C]" : "hover:text-white"
                  }`}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
          {!integratedPreview && <div className="flex flex-col gap-3">
            <a
              href={PLATFORM_URL}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-3 border border-white/10 rounded-full font-semibold text-white/80 hover:text-white text-sm text-center uppercase tracking-[0.18em]"
            >
              Log In
            </a>
            <a
              href={PLATFORM_URL}
              target="_blank"
              rel="noreferrer"
              className="bg-[#C9A84C] hover:bg-[#BDA55F] px-4 py-3 rounded-full font-semibold text-[#07120f] text-sm text-center uppercase tracking-[0.18em]"
            >
              Create Account
            </a>
          </div>}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
