export const PORTAL_RELEASE_OUTPUT: string;
export interface PortalReleaseProfile { environment: 'portal-release-candidate'; portalOrigin: string; apiOrigin: string; targetReview: string; releaseAuthorized: false }
export function validatePortalReleaseProfile(env: Record<string, string | undefined>): PortalReleaseProfile;
export function portalReleaseRedirects(profile: PortalReleaseProfile): string;
export const portalReleaseHeaders: string;
