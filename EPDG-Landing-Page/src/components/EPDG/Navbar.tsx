import React, { useEffect, useState } from "react";
import logo from "../../assets/EPDG_LOGO.webp";

const navLinks = [
  { label: "HOME", id: "home" },
  { label: "Classes", id: "classes" },
  { label: "Services", id: "services" },
  { label: "Internships", id: "internships" },
  { label: "Partnerships", id: "partnerships" },
  { label: "Contact", id: "contact" },
];

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    navLinks.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`sticky right-0 left-0 top-0 z-50 backdrop-blur-3xl border-b border-[#C9A84C]/20 transition-all duration-300 ${
        scrolled ? "bg-[#022B1F] shadow-lg" : "bg-[#022B1F]"
      }`}
    >
      <div className="flex justify-between items-center mx-auto px-6 max-w-7xl h-18">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-3 shrink-0">
          <img
            src={logo}
            alt="Emerson Professional Development Group"
            className="rounded-full ring-[#C9A84C]/30 ring-2 w-12 h-12"
          />
          <span className="hidden lg:block max-w-30 font-bold text-[#C9A84C] text-xs uppercase leading-tight tracking-[0.2em]">
The Emerson Professional
          </span>
        </a>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-8 font-bold text-xs uppercase tracking-[0.18em]">
          {navLinks.map(({ label, id }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={`relative pb-1 transition-colors duration-200 ${
                  activeId === id
                    ? "text-[#C9A84C]"
                    : "text-white/85 hover:text-white"
                }`}
              >
                {label}
                {activeId === id && (
                  <span className="right-0 -bottom-0.5 left-0 absolute bg-[#C9A84C] h-px" />
                )}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://emersonproffesionaldevelopment.netlify.app/"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 border border-white/35 hover:border-[#C9A84C]/60 rounded-md font-bold text-white/85 hover:text-[#C9A84C] text-xs uppercase tracking-[0.15em] transition-all duration-200 cursor-pointer"
          >
            Log In
          </a>
          <button className="bg-[#C9A84C] hover:bg-[#b8943d] px-5 py-2.5 rounded-md font-bold text-[#022B1F] text-xs uppercase tracking-[0.15em] transition-all duration-200 cursor-pointer">
            Create Account
          </button>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center gap-1.5 shadow-amber-500 shadow-md rounded-b-full w-9 h-9 shrink-0"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span className={`block w-6 h-0.5 bg-[#C9A84C] transition-all duration-300 origin-center ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-[#C9A84C] transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-[#C9A84C] transition-all duration-300 origin-center ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#022B1F] px-6 pb-6 border-[#C9A84C]/15 border-t">
          <ul className="flex flex-col gap-1 mt-4">
            {navLinks.map(({ label, id }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={`block py-3 text-xs font-bold uppercase tracking-[0.18em] border-b border-white/5 transition-colors duration-200 ${
                    activeId === id ? "text-[#C9A84C]" : "text-white/85 hover:text-white"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3 mt-6">
            <a
              href="https://emersonproffesionaldevelopment.netlify.app/"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-3 border border-white/35 hover:border-[#C9A84C]/60 font-bold text-white/85 hover:text-[#C9A84C] text-xs uppercase tracking-[0.15em] transition-all cursor-pointer"
            >
              Log In
            </a>
            <button className="bg-[#C9A84C] hover:bg-[#b8943d] px-4 py-3 font-bold text-[#022B1F] text-xs uppercase tracking-[0.15em] transition-all cursor-pointer">
              Create Account
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
