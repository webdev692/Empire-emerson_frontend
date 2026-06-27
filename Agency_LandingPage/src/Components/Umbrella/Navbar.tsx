import { useState } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'
import logo from '../../assets/LogoAgency.png'

const NAV_LINKS = [
  { label: 'Home', dropdown: false },
  { label: 'Classes', dropdown: true },
  { label: 'Services and Packages', dropdown: true },
  { label: 'Global Internship', dropdown: true },
  { label: 'About Us', dropdown: false },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-[#0A1128] shadow-lg">
      <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-6 px-5 py-2.5 lg:px-8">
        {/* Logo */}
        <a href="#" className="flex items-center" aria-label="The Emerson Agency home">
          <img src={logo} alt="The Emerson Agency" className="h-14 w-14 object-contain" />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-10 text-[11px] font-medium uppercase tracking-[0.2em] text-white/80 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href="#"
              className="flex items-center gap-1 transition hover:text-[#c9a24c]"
            >
              {link.label}
              {link.dropdown && <ChevronDown size={12} className="text-white/60" />}
            </a>
          ))}
        </nav>

        {/* CTA and Mobile Menu */}
        <div className="flex items-center gap-4">
          <a
            href="#"
            className="hidden rounded-md bg-[#c9a24c] px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0A1128] shadow-md transition hover:bg-[#b8923f] lg:inline-flex"
          >
            Contact Us
          </a>
          <button
            className="p-2 text-[#c9a24c] lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <nav className="border-t border-white/10 bg-[#0A1128] px-5 py-4 text-xs uppercase tracking-[0.2em] text-white/80 lg:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href="#"
              className="flex items-center justify-between py-3 transition hover:text-[#c9a24c]"
            >
              {link.label}
              {link.dropdown && <ChevronDown size={14} className="text-white/50" />}
            </a>
          ))}
          <a href="#" className="mt-2 block py-3 font-bold text-[#c9a24c]">Contact Us</a>
        </nav>
      )}
    </header>
  )
}
