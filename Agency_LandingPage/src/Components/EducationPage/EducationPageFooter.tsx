import { Mail, Camera, BriefcaseBusiness, Users, Music2 } from 'lucide-react'
import logo from '../../assets/LogoAgency.png'

const socials = [
  { Icon: Camera, label: 'Instagram', href: 'https://www.instagram.com/theemersonagency' },
  { Icon: BriefcaseBusiness, label: 'LinkedIn', href: 'https://www.linkedin.com/company/the-emerson-empire/' },
  { Icon: Users, label: 'Facebook', href: 'https://www.facebook.com/share/1S3XPRXg21/?mibextid=wwXIfr' },
  { Icon: Music2, label: 'TikTok', href: 'https://www.tiktok.com/@theemersonempire' },
  { Icon: Mail, label: 'Email', href: 'mailto:admin@theemersonempire.info' },
]

const navLinks = [
  { label: 'About Us', href: '#' },
  { label: 'Contact', href: '#' },
  { label: 'Privacy', href: '#' },
  { label: 'Accessibility', href: '#' },
 
]

export default function EducationFooter() {
  return (
    <footer className="bg-[#0A1128] text-white py-6">
      <div className="mx-auto flex max-w-[1320px] flex-col items-center justify-between gap-6 px-5 sm:flex-row lg:px-8">
        
        {/* Brand Section */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="The Emerson Agency" className="h-10 w-10 shrink-0 object-contain" />
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-none tracking-wide text-white">TEA</span>
            <span className="mt-1 text-[10px] uppercase tracking-wider text-slate-400">The Emerson Agency</span>
          </div>
        </div>

        {/*Navigation Links */}
        <nav className="flex flex-wrap items-center gap-6 text-xs font-semibold text-white/90 sm:gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="transition hover:text-[#d4af37]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/*Socials */}
        <div className="flex items-center gap-4 text-white/80">
          {socials.map(({ Icon, label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="transition hover:text-[#d4af37]"
            >
              <Icon size={18} />
            </a>
          ))}
        </div>

      </div>
    </footer>
  )
}
