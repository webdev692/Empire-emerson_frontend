# Frontend issue comment drafts - 2026-08-08

These are drafts only. They do not close issues, change checkboxes, assign
people, or claim provider checks that were not performed.

## Issue #20 - Backend API and Environment Variable Verification

```markdown
Read-only governance evidence from the frontend deployment-identity PR:

- Frontend PR #27 and backend PR #2 are recorded as merged on July 26 (`bc93411` and `7bfdb11`). July release evidence identifies `epdg-backend-core` and a canonical production API.
- The current repository keeps `VITE_API_URL` provider-owned and contains no Railway fallback/proxy. Missing or invalid configuration fails closed; the EPDG API/auth/production-safety suite passed 10/10.
- Only `.env.example` files are tracked. The environment inventory documents variable names/purposes without copying provider values. Production mock authentication remains forbidden.
- A high-confidence credential-pattern scan found no real credential. Its only match was the existing synthetic credential-bearing `api.example.com` rejection fixture.
- At about 12:07 EDT on August 8, three read-only requests to the recorded canonical `/health` endpoint returned application-level HTTP 503. The response identified `epdg-backend-core` with status `unavailable` but no cause.

Repository verification passed: 4 locked installs, 4 builds, 4 lints, 13 application tests, 31 shared Edge/migration/accessibility tests, mirror parity, Deno lint (14 files), and both frozen Deno checks.

This issue should remain open. Authenticated checks are still required for current Railway deploy/source/runtime/log/database cause, CORS, the Netlify `VITE_API_URL` value presence, frontend-to-backend production behavior, Supabase browser-key configuration, and provider secret separation. No environment value or provider setting was read or changed.
```

## Issue #21 - Netlify Project Mapping and Deployment QA

```markdown
The PR adds a machine-readable expected map and deterministic local identity validation:

- `Emerson_Empire` -> `theemerson`
- `Agency_LandingPage` -> `emersonagency`
- `EPDG-Landing-Page` -> `emersonprofessionaldevelopment`
- `epdg` -> `epdg`

All four locked installs/builds/lints/smokes passed, and all four built outputs match current `main` for title, canonical, `og:title`, `og:url`, `og:site_name`, release marker, source folder, and `dist` output.

The optional read-only production audit found drift on all four roots:

- Empire: 6 identity fields drift (old title/OG title, different canonical/OG URL, missing OG site name and release marker).
- Agency: 6 fields drift and carry the same Empire identity/canonical (urgent cross-site mismatch).
- EPDG landing: 6 fields drift (old title and missing canonical/OG/release metadata).
- EPDG platform: title and OG title match, but canonical, OG URL/site name, and release marker are missing.

The root `netlify.toml` still defaults to `Agency_LandingPage`. It is documented as a monorepo hazard but was not changed because public output cannot prove dashboard base/package overrides. Existing issue checkmarks are not being rewritten automatically; the current environment-variable inventory, exact production deploy SHAs, forms state, public-link use, custom-domain plan, and authenticated repository/branch/base/build/publish mappings still need provider review. This issue should remain open. No deployment or Netlify setting changed.
```

## Issue #22 - Website Link, CTA, and Mobile QA

```markdown
Automated, non-submitting QA added in the deployment-identity PR:

- All 4 production builds, lints, and enhanced smoke suites passed.
- Static smoke inspected 64 literal public links across the four active surfaces (Empire 28, Agency 17, EPDG landing 15, platform login 4).
- It rejects unsafe/placeholder schemes, verifies declared route targets and same-page fragments, checks responsive viewport metadata and desktop/mobile breakpoint pairs, and validates built identity metadata.
- The EPDG footer's `#classes` target had no matching home-page ID; the PR adds the missing `id="classes"` without changing the link destination or copy.
- The smoke runner reads source/build files only. It does not open destinations, execute frontends, click CTAs, submit forms, send email, authenticate, or write production data.
- Read-only GETs to the four public roots were used only for metadata drift reporting. They are not desktop/mobile/browser interaction evidence.

Manual acceptance work remains open: desktop/mobile/tablet rendering, every dynamic CTA and form destination, browser console/network, images, contrast/heading review, public content/privacy accuracy, and screenshots. Recommended priority is urgent for the Agency cross-site identity/provenance defect; other interactive findings should be prioritized after real browser evidence. Keep this issue open for the requested consolidated human QA report.
```
