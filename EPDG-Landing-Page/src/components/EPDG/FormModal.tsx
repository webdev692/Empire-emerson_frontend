import React, { useCallback, useEffect, useRef, useState } from "react";
import { FormModalContext } from "./FormModalContext";

export const FormModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [formUrl, setFormUrl]       = useState<string | null>(null);
  const [title, setTitle]           = useState("");
  const [subtitle, setSubtitle]     = useState("");
  const [loadCount, setLoadCount]   = useState(0);
  const dialogRef                   = useRef<HTMLDivElement>(null);
  const closeButtonRef              = useRef<HTMLButtonElement>(null);
  const doneButtonRef               = useRef<HTMLButtonElement>(null);
  const iframeRef                   = useRef<HTMLIFrameElement>(null);
  const previousFocusRef            = useRef<HTMLElement | null>(null);

  const submitted = loadCount >= 2;

  const openForm = (url: string, t = "", s = "") => {
    previousFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    setFormUrl(url);
    setTitle(t);
    setSubtitle(s);
    setLoadCount(0);
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
        (iframeRef.current ?? last)?.focus();
      } else if (!e.shiftKey && !iframeRef.current && document.activeElement === last) {
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

  useEffect(() => {
    if (submitted) doneButtonRef.current?.focus();
  }, [submitted]);

  return (
    <FormModalContext.Provider value={{ openForm }}>
      {children}

      {formUrl && (
        <div
          className="fixed inset-0 z-999 flex items-end sm:items-center justify-center bg-[#022B1F]/80 backdrop-blur-sm p-0 sm:p-4"
          onClick={close}
        >
          <div
            ref={dialogRef}
            className="bg-white w-full sm:max-w-2xl h-[92vh] sm:h-[88vh] flex flex-col shadow-2xl overflow-hidden rounded-2xl"
            style={{ borderTop: "4px solid #C9A84C" }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="epdg-form-dialog-title"
            aria-describedby={subtitle ? "epdg-form-dialog-description" : undefined}
          >
            {/* Header */}
            <div className="flex items-start justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <div>
                <p id="epdg-form-dialog-title" className="text-sm font-bold uppercase tracking-wider text-[#044E37] mb-0.5">
                  {submitted ? "Submitted Successfully" : "Emerson Professional Development Group"}
                </p>
                {title && (
                  <h3 className="text-sm font-bold text-[#0A1F17]">{title}</h3>
                )}
                {subtitle && (
                  <p id="epdg-form-dialog-description" className="text-sm text-gray-500 mt-0.5 tracking-wide">{subtitle}</p>
                )}
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={close}
                aria-label="Close form"
                className="inline-flex h-11 w-11 items-center justify-center text-gray-500 hover:text-[#0A1F17] text-xl ml-4 shrink-0 leading-none transition-colors rounded-full"
              >
                ✕
              </button>
            </div>

            {/* Submitted state */}
            {submitted ? (
              <div
                className="flex flex-col items-center justify-center flex-1 px-8 py-12 text-center"
                role="status"
                aria-live="polite"
                aria-atomic="true"
              >
                <div
                  className="w-14 h-14 flex items-center justify-center text-white text-2xl font-bold mb-5 bg-[#044E37]"
                >
                  ✓
                </div>
                <h3 className="text-xl font-bold text-[#0A1F17] mb-3">Submitted!</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-sm mb-8">
                  Thank you for reaching out to EPDG. A member of our team will follow up with you
                  shortly at the contact information you provided.
                </p>
                <button
                  ref={doneButtonRef}
                  onClick={close}
                  className="border border-[#044E37] text-[#044E37] font-bold text-sm uppercase tracking-wider py-3 px-8 hover:bg-[#044E37] hover:text-white transition-all duration-200"
                >
                  Done
                </button>
              </div>
            ) : (
              <iframe
                ref={iframeRef}
                src={`${formUrl}?embedded=true`}
                onLoad={() => setLoadCount((n) => n + 1)}
                title={title || "EPDG Form"}
                className="flex-1 w-full border-none"
                allow="camera; microphone"
              />
            )}
            {!submitted && (
              <span
                data-focus-guard
                tabIndex={0}
                className="sr-only"
                onFocus={() => closeButtonRef.current?.focus()}
              >
                End of form dialog
              </span>
            )}
          </div>
        </div>
      )}
    </FormModalContext.Provider>
  );
};
