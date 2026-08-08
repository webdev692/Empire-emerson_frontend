# Platform audit - 2026-08-08

## Executive status

The July release candidates have moved forward: frontend PR #27 and backend PR
#2 were merged to `main` on July 26, 2026. The recorded merge coordinates are
frontend `bc93411` (reviewed head `11cc79e`) and backend `7bfdb11`. The July 26
backend release record identifies Railway deployment
`cbb535d2-bff0-43af-839b-26e53e5a97dc` and a canonical production API. Those
July results are historical evidence, not a fresh August provider health check.

Overall governance remains **amber**, with a **red public Netlify identity
finding**. No provider setting, environment value, deployment, form, secret, or
database object was changed during this audit.

## Evidence boundaries

This document separates three kinds of evidence:

1. **Repository evidence:** the checked-out frontend `main` tree at `bc93411`.
2. **Public evidence:** read-only GET requests to the four public Netlify roots
   on August 8, 2026.
3. **Provider evidence:** authenticated Netlify, Lovable, GitHub, Railway, and
   Supabase dashboards. These were not available and remain explicitly
   unverified.

A public page can show drift, but it cannot prove which repository, branch,
base directory, or deploy SHA produced it.

## Four-site identity comparison

| Site | Expected identity in `main` | Public observation on 2026-08-08 | Result |
|---|---|---|---|
| Emerson Empire | Title `The Emerson Empire \| Community, Financial & Career Pathways`; canonical `https://theemerson.netlify.app/` | Old title and `og:title`; canonical and `og:url` are `https://emersonempire.com/`; `og:site_name` and release marker absent | Six-field drift |
| Emerson Agency | Title `The Emerson Agency LLC \| Financial Services & Education`; canonical `https://emersonagency.netlify.app/` | Same old Empire title, `og:title`, canonical, and `og:url` as the Empire property; `og:site_name` and release marker absent | **Six-field cross-site identity mismatch** |
| EPDG public landing | Title `Emerson Professional Development Group \| Workforce Development`; canonical `https://emersonprofessionaldevelopment.netlify.app/` | Old title; canonical, Open Graph title/URL/site name, and release marker absent | Six-field drift |
| EPDG platform | Title `Emerson Professional \| EPDG Platform`; canonical `https://epdg.netlify.app/` | Title and `og:title` match; canonical, `og:url`, `og:site_name`, and release marker absent | Four-field metadata drift |

The optional validator reproduced these four drift reports against the public
roots with `--remote --report-only`; report-only exit zero means the audit
completed, not that production passed. The source identities are centralized in
`config/site-identities.json`. The local validator builds and examines each
`dist/index.html`; its optional remote mode fetches only the four root pages and
reports title, canonical, Open Graph site-name, and release-marker drift.

## Netlify configuration inventory

| Configuration | Repository state | Audit conclusion |
|---|---|---|
| Root `netlify.toml` | `base = "Agency_LandingPage"`, build `npm run build`, publish `dist` | An Agency-specific repository default is hazardous in a four-site monorepo. It is preserved because current dashboard overrides are unknown. |
| `Emerson_Empire/netlify.toml` | Toolchain, headers, cache, SPA fallback; no app-local `[build]` stanza | Dashboard base/package settings determine whether this file is applied as intended. |
| `Agency_LandingPage/netlify.toml` | Toolchain, headers, cache, SPA fallback; no app-local `[build]` stanza | Same dashboard dependency; root default happens to point here but must not be assumed for other sites. |
| `EPDG-Landing-Page/netlify.toml` | App-local build/publish, toolchain, preview base override, headers, SPA fallback | Repository configuration is explicit; provider mapping and current deploy still require dashboard proof. |
| `epdg/netlify.toml` | App-local build/publish, toolchain, production-safe mock flag, headers, SPA fallback | Repository configuration is explicit; API value and current deploy remain provider checks. |

Ignored `.netlify/` directories are machine-local/provider-generated state. Two
were present in the local checkout with stale absolute paths and historical
settings. They are ignored, untracked, and are not a source of truth or a
candidate for commit.

The smallest safe correction is an authenticated dashboard review that gives
each Netlify project an explicit source directory from the expected map and
then proves a preview from the reviewed commit. Only after that evidence exists
should a follow-up remove or relocate the Agency-specific root build default.
This PR intentionally does neither.

## GitHub and release governance

- The frontend validation workflow covered four application builds, lints,
  tests, smoke checks, Edge Function tests, migration tests, mirror parity,
  Deno lint, and frozen Deno checks, but previously ran only for pull requests
  and manual dispatch. This PR adds a `push` trigger for `main` and expands path
  coverage to root configuration, lockfiles, scripts, shared files, docs, and
  workflows.
- Neither repository had a detected security policy at audit time. This PR adds
  the frontend `SECURITY.md`; backend policy belongs in the backend governance
  PR.
- Current branch protection, required checks, approvals, force-push controls,
  deletion controls, and bypass authority require authenticated GitHub review.

## GitHub Pages inventory

`.github/workflows/deploy-epdg.yml` builds `EPDG-Landing-Page` with the
repository base path and deploys it to GitHub Pages after qualifying pushes to
`main`. The repository deployment map names Netlify as the public production
host. The Pages surface is therefore classified **awaiting founder decision**;
it is not removed, renamed, or represented as canonical by this audit.

## Lovable, Railway, and Supabase boundaries

- The public Lovable projects do not establish their authenticated repository,
  sync branch, owner, collaborators, connectors, secrets, or published snapshot.
  See `LOVABLE_GIT_GOVERNANCE.md` for the required review.
- July 26 Railway evidence records a healthy production deployment and the
  `epdg-backend-core` entrypoint. At approximately 12:07 EDT on August 8, three
  read-only requests to the recorded canonical `/health` endpoint returned
  application-level HTTP `503`; the response identified `epdg-backend-core` and
  status `unavailable` without exposing a cause. This proves public reachability
  but failed readiness at that time. It does not identify the current deploy
  SHA, source, runtime, log state, database cause, or provider configuration;
  those dashboard checks are unresolved and urgent.
- Known Supabase RLS/policy gaps remain a separate security workstream. No SQL,
  policy, grant, migration, Edge deployment, or data write was performed here.

## Decision register

| Decision | Current state | Evidence needed before action |
|---|---|---|
| Remove or relocate root Agency Netlify build default | Open | All four dashboard base/package directories, config-file resolution, deploy SHAs, and successful exact-head previews |
| Classify GitHub Pages as secondary or retire it | Awaiting founder decision | Intended audience, public URL use, ownership, and rollback requirement |
| Change any Netlify project mapping | Blocked | Authenticated project/repository/branch/base/build/publish evidence |
| Change `VITE_API_URL` or other provider values | Blocked | Current names-only inventory plus authenticated value-presence and deploy verification; never copy values into Git |
| Treat a Lovable project as production source | Blocked | Repository, branch, owner, collaborators, connectors, and publication snapshot |
| Close Issues #20, #21, or #22 | Not authorized | Provider checks and consolidated manual browser evidence requested by each issue |

## Dashboard-only follow-up

- Confirm every Netlify repository, branch, base/package directory, config path,
  build command, publish directory, environment-name inventory, forms state,
  production deploy SHA, and public-link use.
- Confirm Lovable Git sync, branches, ownership, collaborators, connectors,
  publication snapshots, duplicates, and custom domains.
- Confirm GitHub branch protection and required current check names.
- Diagnose the repeated canonical Railway `/health` `503` through the current
  deploy/source/runtime/log/database/CORS dashboard evidence.
- Complete the separate Supabase Security Advisor, RLS/policy/grant, Auth URL,
  Edge version, SSL, network, and backup review.
