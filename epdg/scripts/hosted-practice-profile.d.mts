export interface HostedPracticeBuildProfile {
  readonly version: 1;
  readonly environment: 'synthetic-hosted';
  readonly portalOrigins: readonly string[];
  readonly backendOrigin: string;
}
export const HOSTED_PRACTICE_MODE: 'hosted-practice';
export const HOSTED_PRACTICE_OUTPUT: 'dist-hosted-practice';
export function validateHostedPracticeProfile(value: unknown, env?: NodeJS.ProcessEnv): HostedPracticeBuildProfile;
export function hostedPracticeRedirects(profile: HostedPracticeBuildProfile): string;
export const hostedPracticeHeaders: string;
