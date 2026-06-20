import React from "react";

/** Stylised Emerson tree-growing-from-an-open-book emblem (uses currentColor). */
export const TreeBookLogo: React.FC<{ className?: string; spineColor?: string }> = ({
  className,
  spineColor = "#0A3324",
}) => (
  <svg viewBox="0 0 64 64" className={className} fill="currentColor" aria-hidden="true">
    {/* canopy */}
    <circle cx="32" cy="15" r="8.5" />
    <circle cx="22" cy="21" r="6.5" />
    <circle cx="42" cy="21" r="6.5" />
    <circle cx="27" cy="13" r="5" />
    <circle cx="37" cy="13" r="5" />
    {/* trunk */}
    <rect x="30" y="20" width="4" height="18" rx="1.5" />
    {/* open book */}
    <path d="M9 39c7.5-4.2 16-4.2 23 0 7-4.2 15.5-4.2 23 0v8.5c-7.5-4.2-16-4.2-23 0-7-4.2-15.5-4.2-23 0z" />
    <path d="M32 39v8.5" stroke={spineColor} strokeWidth="1.6" fill="none" />
  </svg>
);

/** Circular framed version of the emblem used on the Values banner. */
export const CircleTreeLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
    <circle cx="40" cy="40" r="37" fill="none" stroke="currentColor" strokeWidth="2" />
    <circle cx="40" cy="40" r="32" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
    <g fill="currentColor">
      {/* canopy */}
      <circle cx="40" cy="26" r="9" />
      <circle cx="30" cy="32" r="6.5" />
      <circle cx="50" cy="32" r="6.5" />
      <circle cx="35" cy="24" r="5" />
      <circle cx="45" cy="24" r="5" />
      {/* trunk */}
      <rect x="37.7" y="31" width="4.6" height="18" rx="1.6" />
      {/* roots / ground */}
      <path d="M22 52c8-4 12-4 18 0 6-4 10-4 18 0v3c-8-4-12-4-18 0-6-4-10-4-18 0z" />
    </g>
  </svg>
);
