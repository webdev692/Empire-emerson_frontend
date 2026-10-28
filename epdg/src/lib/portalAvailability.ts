/** No browser state or role selection can enable this temporary access hold. */
export function portalAvailability(pathname: string) {
  if (/^\/(register|signup)(\/|$)/.test(pathname)) {
    return {
      title: 'An invitation is required',
      description: 'Portal access is individual and invitation only. Registration is currently unavailable while secure access is prepared.',
    };
  }
  if (/^\/(forgot-password|reset-password|change-password|verify-email|callback)(\/|$)/.test(pathname)) {
    return {
      title: 'Account recovery is unavailable',
      description: 'Recovery and verification links cannot be processed here yet. No password or account information has been changed.',
    };
  }
  return {
    title: 'Secure access is being prepared',
    description: 'Sign-in and account access are temporarily unavailable. Profiles, dashboards, and program features remain closed.',
  };
}
