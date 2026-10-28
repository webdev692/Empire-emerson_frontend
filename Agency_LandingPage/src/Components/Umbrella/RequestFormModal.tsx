import { intakeHref } from '../../../../shared/development-preview';
import { localHref } from '../../../../shared/platform-format';
import { integratedPreview, intakeHoldMessage } from '../../../../shared/development-preview';
import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { OPEN_REQUEST_FORM_EVENT } from './RequestFormEvents'
import { contactMailboxes, publicIntakeEnabled } from '../../../../shared/public-intake';
import { CollectionNotice } from '../../../../shared/PublicAccess';

const FORM_URL =
  intakeHref('https://docs.google.com/forms/d/e/1FAIpQLSe1vxhxD7fpf3-_blUZ6xRaTIGzyeRLSLztwSD0y4S-zP56kg/viewform')
const FORM_EMBED_URL = `${FORM_URL}?embedded=true`

export default function RequestFormModal() {
  const [open, setOpen] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const openFormLinkRef = useRef<HTMLAnchorElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const onOpen = () => {
      previousFocusRef.current = document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
      setOpen(true)
    }
    window.addEventListener(OPEN_REQUEST_FORM_EVENT, onOpen)
    return () => window.removeEventListener(OPEN_REQUEST_FORM_EVENT, onOpen)
  }, [])

  useEffect(() => {
    if (!open) return
    closeButtonRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
      if (e.key !== 'Tab') return
      if (e.shiftKey && document.activeElement === closeButtonRef.current) {
        e.preventDefault()
        openFormLinkRef.current?.focus()
      } else if (!e.shiftKey && document.activeElement === openFormLinkRef.current) {
        e.preventDefault()
        closeButtonRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      previousFocusRef.current?.focus()
      previousFocusRef.current = null
    }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false)
      }}
    >
      <div
        className="relative flex h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-[0_40px_120px_rgba(0,0,0,0.5)]"
        role="dialog"
        aria-modal="true"
        aria-label="Request services form"
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close form"
          className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-[#0A1128] text-white shadow-md transition hover:bg-[#1b2547]"
        >
          <X size={18} />
        </button>
        <div className="flex shrink-0 flex-col gap-2 border-b border-neutral-200 bg-white p-4 pr-16 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#0A1128]/70">
            {publicIntakeEnabled ? "Service questions open an email draft for you to review and send." : integratedPreview ? "Live request forms are held in the local preview." : "The embedded form is available for pointer users."}
          </p>
          <a
            ref={openFormLinkRef}
            href={publicIntakeEnabled ? `mailto:${contactMailboxes.sales}` : integratedPreview ? localHref("/inquiry") : FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#0A1128] px-4 py-2 text-center text-xs font-bold uppercase tracking-[0.12em] text-[#0A1128] transition hover:bg-[#0A1128] hover:text-white"
          >
            {publicIntakeEnabled ? "Email the service team" : integratedPreview ? "Check support availability" : "Open form in new tab"}
          </a>
        </div>
        {publicIntakeEnabled ? <div className="p-6 text-[#0A1128]"><p><a href={`mailto:${contactMailboxes.sales}`}>{contactMailboxes.sales}</a></p><p>No request has been sent. Class registration and internship applications are linked from the Contact & next steps page.</p><a href={localHref('/inquiry')}>Contact & next steps</a><CollectionNotice /></div> : integratedPreview ? <p role="status" className="p-6 text-[#1c1336]">{intakeHoldMessage}</p> : (<iframe
          src={FORM_EMBED_URL}
          title="Request Services Form"
          tabIndex={-1}
          aria-hidden="true"
          className="min-h-0 flex-1 w-full border-0"
        >
          Loading…
        </iframe>)}
        <span
          data-focus-guard
          tabIndex={0}
          className="sr-only"
          onFocus={() => closeButtonRef.current?.focus()}
        >
          End of request form dialog
        </span>
      </div>
    </div>
  )
}
