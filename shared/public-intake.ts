// Public website routes confirmed by the founder on October 28, 2026.
// This module is not imported by the EPDG portal.
export const publicIntakeEnabled = import.meta.env.MODE === 'public-release' && import.meta.env.VITE_PUBLIC_INTAKE_RELEASE === 'true';
export const publicLegalApproved = import.meta.env.VITE_PUBLIC_LEGAL_APPROVED === 'true';
export const publicForms = {
  internship: 'https://docs.google.com/forms/d/e/1FAIpQLSct0beq8VHPv9zhRreBFv8fK8HWGIGNp2YmuRGiOiL7RPoGFQ/viewform',
  classes: 'https://docs.google.com/forms/d/e/1FAIpQLSfOGM0MZ05Em3O502rC9HxvK5qzW06ATQMcMX2Fgcn9xBpncQ/viewform',
  feeWaiver: 'https://forms.gle/fWm9gHownQeorkNn7',
} as const;
export const contactMailboxes = {
  admin: 'admin@theemersonempire.info',
  hr: 'humanresources@theemersonempire.info',
  sales: 'sales@theemersonempire.info',
  technical: 'webdev@theemersonempire.info',
  marketing: 'social@theemersonempire.info',
  outreach: 'globaloutreach@theemersonempire.info',
} as const;
export const dailySessions = [
  { id: 'free', time: '10:00 AM', minutes: 60, duration: '60 minutes', price: 0 },
  { id: 'workshop', time: '2:00 PM', minutes: 90, duration: '90 minutes', price: 10 },
  { id: 'intensive', time: '7:00 PM', minutes: 120, duration: '2 hours', price: 20 },
] as const;
export function isApprovedPublicDestination(value: string) {
  if (!publicIntakeEnabled) return false;
  try {
    const url = new URL(value);
    if (url.protocol === 'mailto:') return Object.values(contactMailboxes).some(mailbox => url.pathname === mailbox) && [...url.searchParams.keys()].every(key => ['subject', 'body'].includes(key)) && !/[\r\n]/.test(url.searchParams.get('subject') || '');
    return Object.values(publicForms).some(destination => {
      const approved = new URL(destination);
      return url.origin === approved.origin && url.pathname === approved.pathname && !url.username && !url.password && [...url.searchParams.entries()].every(([key, value]) => key === 'embedded' && value === 'true');
    });
  } catch { return false; }
}

export function sessionForClassType(value: string) {
  return value === 'Free General Admission' ? dailySessions[0] : value === 'Low-Cost Workshop' ? dailySessions[1] : value === 'Low-Cost Intensive' ? dailySessions[2] : null;
}
