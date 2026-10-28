import { localHref } from '../../../../shared/platform-format';
import { integratedPreview, intakeHoldMessage } from '../../../../shared/development-preview';
import { isApprovedPublicDestination, publicIntakeEnabled } from '../../../../shared/public-intake';
import { CollectionNotice } from '../../../../shared/PublicAccess';
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FormModalContext } from "./FormModalContext";

export const FormModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [formUrl, setFormUrl]       = useState<string | null>(null);
  const [title, setTitle]           = useState("");
  const [subtitle, setSubtitle]     = useState("");
  const dialogRef                   = useRef<HTMLDivElement>(null);
  const closeButtonRef              = useRef<HTMLButtonElement>(null);
  const openFormLinkRef             = useRef<HTMLAnchorElement>(null);
  const previousFocusRef            = useRef<HTMLElement | null>(null);
  const publicFormAvailable = !!formUrl && publicIntakeEnabled && isApprovedPublicDestination(formUrl);

  const openForm = (url: string, t = "", s = "") => {
    previousFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    setFormUrl(url);
    setTitle(t);
    setSubtitle(s);
  };

  const close = useCallback(() => setFormUrl(null), []);

  // Lock body scroll, establish initial focus, and restore focus on close.
  useEffect(() => {
    if (!formUrl) return;

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }

      if (e.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([data-focus-guard])'
        )
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previousFocusRef.current?.focus();
      previousFocusRef.current = null;
    };
  }, [close, formUrl]);

  return (
    <FormModalContext.Provider value={{ openForm }}>
      {children}

      {formUrl && (
        <div
          className="fixed inset-0 z-999 flex items-center justify-center bg-[#022B1F]/80 backdrop-blur-sm p-4"
          onClick={close}
        >
          <div
            ref={dialogRef}
            className="bg-white w-full min-w-0 sm:max-w-2xl max-h-[88dvh] flex flex-col shadow-2xl overflow-auto rounded-2xl"
            style={{ borderTop: "4px solid #C9A84C" }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="epdg-form-dialog-title"
            aria-describedby={subtitle ? "epdg-form-dialog-description" : undefined}
          >
            {/* Header */}
            <div className="flex flex-wrap items-start gap-3 justify-between px-4 py-4 border-b border-gray-100 shrink-0">
              <div className="min-w-0 basis-full sm:basis-auto sm:flex-1">
                <p id="epdg-form-dialog-title" className="text-sm font-bold uppercase tracking-wider text-[#044E37] mb-0.5">
                  Emerson Professional Development Group
                </p>
                {title && (
                  <h3 className="text-sm font-bold text-[#0A1F17]">{title}</h3>
                )}
                {subtitle && (
                  <p id="epdg-form-dialog-description" className="text-sm text-gray-500 mt-0.5 tracking-wide">{subtitle}</p>
                )}
              </div>
              <a
                ref={openFormLinkRef}
                href={publicFormAvailable ? formUrl : integratedPreview ? localHref("/inquiry") : formUrl}
                target="_blank"
                rel="noreferrer"
                className="ml-auto inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl border border-[#044E37] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#044E37] transition hover:bg-[#044E37] hover:text-white"
                aria-label={publicFormAvailable ? `Open Google Form for ${title || "EPDG"} in a new tab` : integratedPreview ? "Contact the team in a new tab" : `Open form in new tab: ${title || "EPDG"}`}
              >
                {publicFormAvailable ? "Open Google Form" : integratedPreview ? "Contact the team" : "Open form in new tab"}
              </a>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={close}
                aria-label="Close form"
                className="ml-2 inline-flex h-11 w-11 items-center justify-center text-gray-500 hover:text-[#0A1F17] text-xl shrink-0 leading-none transition-colors rounded-full"
              >
                ✕
              </button>
            </div>

            {publicFormAvailable ? <div className="p-6 text-[#1c1336]"><p>Continue in Google Forms to complete this request. No information has been sent by this website.</p><CollectionNotice /></div> : publicIntakeEnabled ? <div className="p-6 text-[#1c1336]"><p>Use the contact page to choose the right team for a service or partnership inquiry. No information has been sent.</p><a href={localHref('/inquiry')}>Contact & next steps</a><CollectionNotice /></div> : integratedPreview ? <p role="status" className="p-6 text-[#1c1336]">{intakeHoldMessage}</p> : (<iframe
              src={`${formUrl}?embedded=true`}
              title={title || "EPDG Form"}
              tabIndex={-1}
              aria-hidden="true"
              className="flex-1 w-full border-none"
            />)}
            <span
              data-focus-guard
              tabIndex={0}
              className="sr-only"
              onFocus={() => closeButtonRef.current?.focus()}
            >
              End of form dialog
            </span>
          </div>
        </div>
      )}
    </FormModalContext.Provider>
  );
};
