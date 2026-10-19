import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

export type ServiceForm = { title: string; formUrl: string };

export default function ServiceFormDialog({ modal, onClose }: {
  modal: ServiceForm;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const separateFormRef = useRef<HTMLAnchorElement>(null);
  const titleId = useId();
  useBodyScrollLock(true);

  useEffect(() => {
    const trigger = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current!;
    dialog.showModal();
    closeRef.current?.focus();
    return () => {
      dialog.close();
      if (trigger?.isConnected) trigger.focus();
    };
  }, []);

  return createPortal(
    <dialog ref={dialogRef} aria-modal="true" aria-labelledby={titleId} className="service-dialog"
      onKeyDown={(event) => {
        // Native modality also contains focus inside the cross-origin iframe.
        // Explicitly wrap the parent controls without relying on a browser-chrome stop.
        if (event.key !== 'Tab') return;
        if (event.shiftKey && document.activeElement === closeRef.current) {
          event.preventDefault();
          separateFormRef.current?.focus();
        } else if (!event.shiftKey && document.activeElement === separateFormRef.current) {
          event.preventDefault();
          closeRef.current?.focus();
        }
      }}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          const rect = event.currentTarget.getBoundingClientRect();
          if (event.clientX < rect.left || event.clientX > rect.right ||
              event.clientY < rect.top || event.clientY > rect.bottom) onClose();
        }
      }}>
      <div className="service-dialog-layout">
        <header className="flex items-start justify-between gap-3 border-b border-neutral-100 px-4 py-3">
          <div className="min-w-0">
            <p className="font-mono text-xs uppercase tracking-widest text-gold-on-light">Service Request</p>
            <h2 id={titleId} className="text-base font-bold text-[#1C1336]">{modal.title}</h2>
          </div>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close service request"
            className="shrink-0 flex items-center justify-center text-[#4B1E91]">
            <X aria-hidden="true" size={22} />
          </button>
        </header>
        <div className="service-dialog-form">
          <iframe src={modal.formUrl} title={`${modal.title} — service request form`} />
        </div>
        <footer className="border-t border-neutral-100 px-4 py-3 text-sm">
          <a ref={separateFormRef} href={modal.formUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center text-[#4B1E91] underline underline-offset-4">
            Open this form in a new tab
          </a>
        </footer>
      </div>
    </dialog>, document.body,
  );
}
