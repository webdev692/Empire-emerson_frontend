import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

const FORM_EMBED_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSe1vxhxD7fpf3-_blUZ6xRaTIGzyeRLSLztwSD0y4S-zP56kg/viewform?embedded=true'

const OPEN_EVENT = 'open-request-form'

/** Call from any button to open the request form modal. */
export function openRequestForm() {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT))
}

export default function RequestFormModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onOpen = () => setOpen(true)
    window.addEventListener(OPEN_EVENT, onOpen)
    return () => window.removeEventListener(OPEN_EVENT, onOpen)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false)
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Request services form"
    >
      <div className="relative flex h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-[0_40px_120px_rgba(0,0,0,0.5)]">
        <button
          onClick={() => setOpen(false)}
          aria-label="Close form"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#0A1128] text-white shadow-md transition hover:bg-[#1b2547]"
        >
          <X size={18} />
        </button>
        <iframe
          src={FORM_EMBED_URL}
          title="Request Services Form"
          className="h-full w-full border-0"
        >
          Loading…
        </iframe>
      </div>
    </div>
  )
}
