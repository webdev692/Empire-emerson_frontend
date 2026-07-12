# Production verification

No production result is recorded as passing until it corresponds to the released commit and verified provider configuration. No merge or production deployment has been performed during this release work.

## Application-commit evidence

The application commit reviewed before this documentation-only update is `f23aab8f188b17e52715528ddd86627978943107`.

- GitHub Actions run `29173793728`: 6 passed, 0 failed, 0 canceled for Emerson Empire, Emerson Agency, EPDG Landing Page, EPDG Platform, Supabase Edge Functions, and the compatibility build summary.
- The three available Netlify deploy records and preview aliases matched that application commit.
- A new release decision requires checks and previews to be re-associated with the latest PR head; older success is retained as evidence, not treated as a substitute.

## Frontend applications

| Application | Preview evidence for `f23aab8` | Production root | Browser/private-route verification | Release status |
|---|---|---|---|---|
| Emerson Empire | [Ready preview](https://deploy-preview-27--theemerson.netlify.app/) | Responded, but PR code is not released | Browser runtime unavailable | Blocked |
| Emerson Agency | [Ready preview](https://deploy-preview-27--emersonagency.netlify.app/) | Responded, but PR code is not released | Browser runtime unavailable | Blocked |
| EPDG landing | No PR deploy record; expected mapped preview alias returned `404` | Responded, but PR code is not released | No current preview | Failed preview gate |
| EPDG platform | [Ready preview](https://deploy-preview-27--epdg.netlify.app/) | Responded, but PR code is not released | Logged-out route behavior not interactively verified | Blocked |

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

## Blocked interactive matrix

The following remain unverified: Emerson registration redirect, logged-out EPDG private routes, Agency request-modal focus/close behavior, desktop/mobile layout, keyboard traversal, contrast, browser console, and browser network behavior. No authenticated account or private record was used.

## Release acceptance

Stale, old-head, neutral, skipped, canceled, or superseded checks are not accepted as successful verification. Missing preview coverage, an unverified backend owner, unresolved migration drift, or absent role authorization evidence stops release progression.
