import React, { useEffect, useState } from "react";
import logo from "../../assets/EPDG_LOGO.webp";

type NavLink = { label: string; id: string };

const navLinks: NavLink[] = [
  { label: "Home", id: "home" },
  { label: "Classes", id: "classes" },
  { label: "Services", id: "services" },
  { label: "Internships", id: "internships" },
  { label: "Workforce", id: "workforce" },
  { label: "Contact", id: "contact" },
];

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState("home");

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-35% 0px -45% 0px" },
    );

    navLinks.forEach((link) => {
      const el = document.getElementById(link.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleNav = (link: NavLink) => {
    setMenuOpen(false);
    setActiveId(link.id);

    if (link.id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const targetElement = document.getElementById(link.id);
      if (targetElement) {
        const yOffset = -80;
        const y =
          targetElement.getBoundingClientRect().top +
          window.pageYOffset +
          yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  };

  return (
    <>
      <nav className="top-0 z-50 sticky border-white/10 bg-[#03140f]/95 backdrop-blur-sm border-b">
        <div className="flex justify-between items-center mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl h-20">
          <button
            onClick={() => handleNav(navLinks[0])}
            className="flex items-center gap-3 shrink-0 cursor-pointer"
            aria-label="Home"
          >
            <img
              src={logo}
              alt="EPDG logo"
              className="border border-white/10 rounded-full w-12 h-12"
            />
          </button>

          <ul className="hidden md:flex items-center gap-6 lg:gap-8 font-medium text-white/70 text-xs lg:text-sm uppercase tracking-[0.15em] lg:tracking-[0.18em]">
            {navLinks.map((link) => (
              <li key={link.id}>
                <button
                  onClick={() => handleNav(link)}
                  className={`cursor-pointer transition duration-200 ${
                    activeId === link.id ? "text-[#C9A84C]" : "hover:text-white"
                  }`}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://emersonproffesionaldevelopment.netlify.app/"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 border border-white/10 hover:border-[#C9A84C] rounded-full font-semibold text-white/70 hover:text-white text-xs uppercase tracking-[0.12em] transition-all duration-200"
            >
              Log In
            </a>
            <a
              href="https://emersonproffesionaldevelopment.netlify.app/"
              target="_blank"
              rel="noreferrer"
              className="bg-[#C9A84C] hover:bg-[#BDA55F] px-4 py-2 rounded-full font-semibold text-[#07120f] text-xs uppercase tracking-[0.12em] transition-all duration-200"
            >
              Create Account
            </a>
          </div>

          <button
            className="md:hidden flex justify-center items-center z-50 bg-[#03140f] border border-white/10 rounded-full w-11 h-11 text-white cursor-pointer select-none"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className="sr-only">Toggle menu</span>
            <div className="relative w-5 h-5">
              <span
                className={`absolute left-0 top-1 h-0.5 w-5 rounded-full bg-white transition-all duration-300 ${menuOpen ? "translate-y-1.5 rotate-45" : ""}`}
              />
              <span
                className={`absolute left-0 top-2.5 h-0.5 w-5 rounded-full bg-white transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`absolute left-0 top-4 h-0.5 w-5 rounded-full bg-white transition-all duration-300 ${menuOpen ? "-translate-y-1.5 -rotate-45" : ""}`}
              />
            </div>
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 bg-[#03140f] md:hidden transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full pt-24 px-6 pb-8 overflow-y-auto">
          <ul className="flex flex-col gap-1 text-white/75 text-base font-medium uppercase tracking-[0.18em]">
            {navLinks.map((link) => (
              <li key={link.id} className="border-b border-white/5">
                <button
                  onClick={() => handleNav(link)}
                  className={`w-full text-left py-4 transition duration-200 cursor-pointer ${
                    activeId === link.id
                      ? "text-[#C9A84C] font-bold"
                      : "hover:text-white"
                  }`}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-3 mt-auto pt-8">
            <a
              href="https://emersonproffesionaldevelopment.netlify.app/"
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 border border-white/10 rounded-full font-semibold text-white/80 hover:text-white text-sm text-center uppercase tracking-[0.15em] active:bg-white/5 transition-all"
            >
              Log In
            </a>
            <a
              href="https://emersonproffesionaldevelopment.netlify.app/"
              target="_blank"
              rel="noreferrer"
              className="bg-[#C9A84C] hover:bg-[#BDA55F] w-full py-3.5 rounded-full font-semibold text-[#07120f] text-sm text-center uppercase tracking-[0.15em] active:scale-[0.98] transition-all"
            >
              Create Account
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
