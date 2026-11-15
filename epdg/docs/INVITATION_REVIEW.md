# EPDG invitation review candidate

This change continues the existing EPDG frontend on the hosted administrator
preparation branch from PR #46 (`edd9ad82101cf7c6a860141bba6f06643df08967`).
Prior contributor history and separate public applications are preserved.

## Implemented behavior

- The local synthetic portal accepts `/accept-invitation#token=...`. It captures
  a strict single-use fragment at startup or same-document navigation, removes
  it from the address bar before rendering, and keeps it in memory only.
- Password setup uses the existing backend password rules. Acceptance submits
  only the token and password, confirms the synthetic email through the server,
  and returns to sign-in. It never claims that acceptance proves a successful
  login or authorizes learning access. Password form fields are cleared before
  requests. Invalid, expired, already-used and disabled flows show safe errors.
- The existing local administrator interface lists server-eligible identities,
  server-approved role choices, delivery/acceptance/confirmation status, expiry
  and verified last sign-in. Creation and resend use authenticated cookie and
  CSRF requests. No raw invitation token is returned to this interface.
- The current server proof permits the participant role only. Other requested
  scopes remain explicit review requirements; selecting an option cannot grant
  a privileged role. The backend owns idempotency and scope enforcement.
- Administrator sessions now reject malformed, expired or non-synthetic data,
  retain only documented account fields, expire in the UI, hide data immediately
  on sign-out, and reject a late session restore after logout. Failed logout
  retains the in-memory CSRF token solely for an explicit retry.

## Runtime and release boundaries

The backend candidate requires its documented local invitation review flag plus
the validated synthetic test environment. The frontend normal entry remains
the access hold. Hosted practice cannot submit invitation acceptance, and the
hosted administrator bundle excludes the invitation review component. No
provider setting, Netlify SSO restriction, production account, migration or
delivery service is changed by this frontend PR.

The existing local UI modes share the fixed loopback origin and must be run one
at a time. Use `npm run dev:synthetic` for recipient acceptance and learning;
use `npm run dev:admin-staging` and `/admin-staging.html` for administrator review.
Do not broaden the fixed origin or weaken the backend's cookie/origin/CSRF checks.
The backend must be running the matching reviewed candidate for these flows.

Applicants, resumes and onboarding belong in the CRM. Account acceptance does
not transfer those records or substitute for verified onboarding. Historical
team names do not organize the learning portal.

## Validation and remaining acceptance

Local verification uses Node 22.23.1 and npm 11.17.0. The frontend test suite
includes invitation payloads, invalid/expired links, hosted denial, safe errors,
synthetic-only records, status integrity, and the session restore/logout race.
Existing tests retain learning-record isolation, recovery, CSRF, runtime
isolation and production-hold checks. See the release journal for the final
test/build results; browser observations are recorded separately and must match
the final source.

## Dependency security review

The affected EPDG application pins axios 1.21.1, react-router-dom 7.18.5,
eslint 10.15.0, postcss 8.5.33, vite 8.3.8 and sharp 0.35.5, with a reviewed
upstream-compatible dependency refresh. The toolchain versions are unchanged.
Vite's HMR compatibility getters required a guard update that still rejects
configured HMR and WebSocket overrides; negative tests cover the new options.
The [sharp 0.35.0 changes](https://sharp.pixelplumbing.com/changelog/v0.35.0/)
were checked against the existing image script, and synthetic WebP/AVIF encode
and metadata checks pass. Existing assets were not regenerated.

The November 14 audit falls from 31 findings (13 high, 14 moderate, 4 low) to
12 (0 critical/high, 10 moderate, 2 low). `npm audit --omit=dev` reports zero.
The full audit remains open: TypeScript ESLint uses affected minimatch versions;
Workbox uses affected glob versions; its resolver uses deepmerge with no patched
release. These nodes are all development dependencies. The non-forced dry run
proposed no changes for the pinned manifest; this does not rule out alternative
remediation. Forced major overrides and suggested downgrades were not applied.
See `DEPENDENCY_SECURITY_REVIEW.md` for the phase-three call-site and policy review.
Their impact must be resolved or explicitly
reviewed before production release. Passing application tests is not a clean
full dependency-security result.

Before real use, the founder must approve the verified production architecture,
role scopes, migration/environment plan and specific invitation batch after
readiness review. Current synthetic proof is not a production release. The
actual supported production email provider, public authenticated entrypoint,
verified onboarding handoff and intended account identities remain release
gates. No email roster or private register belongs in this public repository.

Rollback for this source-only candidate is to stop the local preview and return
to the existing reviewed branch. Do not reset or delete participant records;
any future deployed correction must use a reviewed forward change. Backend
migrations and compensating actions are documented with the backend candidate.
