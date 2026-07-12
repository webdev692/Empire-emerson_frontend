import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import logo from '../../assets/LogoAgency.png'
import { openRequestForm } from './RequestFormEvents'

const NAV_LINKS = [
  { label: 'Home', href: '#' },
  { label: 'Our Values', href: '#our-values' },
  { label: 'Services', href: '#services' },
  { label: 'Individuals & Families', href: '#individuals' },
  { label: 'Small Business', href: '#small-business' },
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
              href={link.href}
              className="transition hover:text-[#c9a24c]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA and Mobile Menu */}
        <div className="flex items-center gap-4">
          <a
            href="https://forms.gle/VSCGHQEJSdKhYizKA"
            onClick={(e) => { e.preventDefault(); openRequestForm() }}
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
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block py-3 transition hover:text-[#c9a24c]"
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://forms.gle/VSCGHQEJSdKhYizKA"
            onClick={(e) => { e.preventDefault(); setMenuOpen(false); openRequestForm() }}
            className="mt-2 block py-3 font-bold text-[#c9a24c]"
          >
            Contact Us
          </a>
        </nav>
      )}
    </header>
  )
}
