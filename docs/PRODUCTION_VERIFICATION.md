# Production verification

No production result is recorded as passing until it corresponds to the released commit and verified provider configuration. No merge or production deployment has been performed during this release work.

## Application-commit evidence

The application commit reviewed before this documentation-only update is `f23aab8f188b17e52715528ddd86627978943107`.

- GitHub Actions run `29173793728`: 6 passed, 0 failed, 0 canceled for Emerson Empire, Emerson Agency, EPDG Landing Page, EPDG Platform, Supabase Edge Functions, and the compatibility build summary.
- The three available Netlify deploy records and preview aliases matched that application commit.
- A new release decision requires checks and previews to be re-associated with the latest PR head; older success is retained as evidence, not treated as a substitute.

Follow-up commits `432ce17` and `3b700bc` pass local verification for all four builds, lints, and smoke checks plus 9/9 combined Edge/migration regressions. They are not accepted as release evidence until verified at the new PR head.

## Frontend applications

| Application | Preview evidence for `f23aab8` | Production root | Browser/private-route verification | Release status |
|---|---|---|---|---|
| Emerson Empire | [Ready preview](https://deploy-preview-27--theemerson.netlify.app/) | Responded, but PR code is not released | `/register` redirect and mobile overflow checked on `f23aab8`; follow-up head pending | Blocked |
| Emerson Agency | [Ready preview](https://deploy-preview-27--emersonagency.netlify.app/) | Responded, but PR code is not released | Contact/modal/mobile checked on `f23aab8`; focus fix pending current-head preview | Blocked |
| EPDG landing | No PR deploy record; expected mapped preview alias returned `404` | Responded, but PR code is not released | No current preview | Failed preview gate |
| EPDG platform | [Ready preview](https://deploy-preview-27--epdg.netlify.app/) | Responded, but PR code is not released | Logged-out private routes and mobile overflow checked on `f23aab8`; follow-up head pending | Blocked |

Static route and bundle checks passed for the three available previews. They do not replace interactive verification.

## Preview findings still open

- Emerson and Agency reference `/your-poster.webp`, `/og-image.jpg`, and `/logo.png`, but the preview serves the SPA HTML fallback at those paths.
- The EPDG platform references `/icons/pwa-192.png`, but its preview also serves the HTML fallback at that path.
- The active internship application form returned `401`; its URL or Google permissions require founder action.
- Advertised canonical domains failed resolution during the audit. Replacements require founder confirmation.
- Public form label associations and EPDG auth landmarks need accessibility remediation.
- The previews have HSTS but lack the reviewed baseline for CSP, `X-Content-Type-Options`, framing, referrer, and permissions policies.

## Backend and Railway

- Authoritative Railway service: unverified; CLI identity is not authenticated in this environment.
- One observed candidate answered health and protected-route probes plausibly, but route behavior alone does not prove repository linkage, deployed revision, environment, or database ownership.
- Required route inventory, explicit production CORS allowlist, privacy-safe errors, backend test results, and deployment evidence remain pending.
- No frontend API origin or production environment variable was changed.

## Supabase

- Schema-only inventory completed: 46 tables, 81 foreign keys, 136 valid indexes, no reviewed RLS policies, and four EPDG career tables with RLS disabled.
- Migration history contains a timestamp mismatch with the two repository mirrors. Identity must be proven before any reconciliation.
- Live Edge Function version was inventoried, but the corrected local function has not been deployed or live-tested.
- No migration, policy, grant, function, or production data was changed.

## Browser evidence on the ready `f23aab8` previews

- Emerson `/register` redirected to `/` without exposing the removed placeholder form.
- EPDG `/school`, `/dashboard`, `/company`, and `/admin` redirected logged-out visitors to `/login`; no private content was visible.
- Agency contact information was visible and the existing request modal opened, loaded, and closed without submission.
- The preview modal failed initial/return focus behavior. Commit `432ce17` contains the fix; a current-head preview must verify it.
- Emerson, Agency, and EPDG login showed no horizontal document overflow at a 390 by 844 viewport.
- The inspected Agency page showed no console warnings/errors and no failed initial network requests.

Still unverified: EPDG landing browser behavior, current-head modal focus, full keyboard traversal, contrast, and console/network behavior across every route. No authenticated account, private record, or form submission was used.

## Release acceptance

Stale, old-head, neutral, skipped, canceled, or superseded checks are not accepted as successful verification. Missing preview coverage, an unverified backend owner, unresolved migration drift, or absent role authorization evidence stops release progression.
