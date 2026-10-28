import { reviewHeaders } from './review-policy.mjs';
// Public informational pages retain the submission boundary used in review.
// These headers do not enable a registration service or a form destination.
export const liveHeaders = Object.fromEntries(Object.entries(reviewHeaders).filter(([key])=>!['X-Robots-Tag','Cache-Control'].includes(key)));
