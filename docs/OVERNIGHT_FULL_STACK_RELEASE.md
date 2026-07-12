# Overnight full-stack release journal

This journal records the non-sensitive evidence for the July 11, 2026 stabilization and release work. It must never contain secret values, private user records, intern records, or production row contents.

## 2026-07-11 20:21 EDT — Phase 1: preserve frontend remediation

- Confirmed repository: `webdev692/Empire-emerson_frontend`.
- Confirmed branch: `founder-support/platform-stabilization-2026-07-11`.
- Confirmed the existing audited remediation remains present and uncommitted.
- Confirmed ignored categories cover dependency directories, build output, environment files, logs, local caches, and local Netlify state.
- Ran `git diff --check`: passed; only line-ending notices were emitted.
- Added permanent repository rules in `AGENTS.md`.
- Release state at phase start: no new commit, push, merge, migration, environment update, or deployment performed.

### Previously completed local verification being preserved

- All four applications: deterministic install, build, lint, and smoke checks passed.
- Edge Function regression tests: 6 passed, 0 failed.
- Deno lint and frozen type checks: passed for both mirrored copies.
- Direct dependencies and lockfiles: exact and in parity; no package version, resolution, or integrity drift.
- Secret-pattern and production-artifact scans: passed.
- Browser-level verification remained unavailable in the earlier local run because the desktop browser runtime could not start inside the sandbox; no result was misreported as passing.

### Rollback at this phase

- Work is still only in the local working tree. Before publication, rollback is omission from staging or a focused reverse patch; Git history has not been rewritten.

## 2026-07-11 20:27 EDT — Phase 1 verification rerun

- `Emerson_Empire`: build passed; lint passed with zero findings; smoke passed.
- `Agency_LandingPage`: build passed; lint passed with zero findings; smoke passed.
- `EPDG-Landing-Page`: build passed; lint passed with zero findings; smoke passed.
- `epdg`: build passed; lint passed with zero findings; API-origin tests passed 2/2; smoke passed.
- Mirrored Edge Function Node regression tests passed 6/6.
- Deno lint passed for six Edge files; frozen Deno type checks passed for both copies.
- Edge mirrors were identical across six reviewed artifacts.
- Manifest/lock parity passed for all applications with no remaining direct dependency ranges.
- Redacted credential-pattern scan passed.
- `git diff --check` passed.

## 2026-07-11 20:34 EDT — Frontend branch publication

- Created commit `ebe4ddc` (`fix: stabilize lead intake and platform access`).
- Created commit `f23aab8` (`chore: pin toolchains and expand release checks`).
- Pushed branch `founder-support/platform-stabilization-2026-07-11` to `origin`.
- Updated frontend PR #27 with the implementation scope, exact local verification, and intentionally unresolved production decisions.
- No merge or production deployment occurred in this phase. Netlify later generated deploy previews from the pushed branch.

### Rollback

- Before merge: revert either focused commit on the feature branch and rerun the full matrix.
- After merge but before deployment: revert the PR through a normal forward commit; do not rewrite protected-branch history.

## 2026-07-11 20:43 EDT — Current application-head checks and previews

- Verified PR #27 application head `f23aab8f188b17e52715528ddd86627978943107`.
- GitHub Actions run `29173793728` passed Emerson Empire, Agency Landing Page, EPDG Landing Page, EPDG Platform, Supabase Edge Functions, and the compatibility build summary.
- Netlify generated ready deploy previews for Emerson Empire, Emerson Agency, and the EPDG platform from that same application commit.
- No PR preview exists for the mapped EPDG public landing project; the attempted deploy-preview alias returned `404` and is not counted as passing.
- Static preview checks passed for application shells, active Agency navigation targets, absence of the placeholder form ID, and public-bundle secret indicators.
- Browser interaction, private-route redirect, responsive, console, and network checks remain blocked because the available browser runtime could not start. They are not recorded as passing.
- Preview QA found missing image paths being rewritten to HTML, an inaccessible internship form, unresolved canonical domains, public label-association gaps, and incomplete baseline security headers. Founder-controlled destinations were not replaced.

Preview evidence belongs to the application commit above. The documentation-only follow-up commit must receive its own current-head status review before release acceptance.

## 2026-07-11 20:48 EDT — Supabase schema-only audit

- Inspected migration metadata, schemas, tables, keys, indexes, grants, policies, functions, and advisors without reading application rows or secret values.
- Confirmed migration timestamp drift between remote history and both repository mirrors; no history repair or migration push was attempted.
- Confirmed four EPDG career tables have RLS disabled, no reviewed table has an RLS policy, and browser-role privileges are broader than required.
- Confirmed `public.leads` remains service-role-only, while the rate-limit RPC still has a concurrency race and the lead pipeline lacks database idempotency and a durable notification outbox.
- No live migration, Edge Function deployment, provider configuration change, or private-data query occurred.

## 2026-07-11 20:51 EDT — Backend and Railway boundary

- Continued backend work on the separate branch `codex/full-stack-release-2026-07-11` in a sibling worktree; no backend merge or deployment is claimed.
- The repository contains a limited root service and a broader nested EPDG core. Their Railway source mapping is not yet proven.
- Railway CLI identity is not authenticated in this environment, so service ownership, deployed revision, environment mapping, and production deployment remain blocked rather than guessed.
- Public route behavior can narrow candidates but cannot by itself establish the authoritative service or intended database.

## 2026-07-11 21:20 EDT — Logged-out browser verification

- Emerson `/register` redirected to `/` without showing the removed placeholder form or internal instructions.
- Logged-out EPDG `/school`, `/dashboard`, `/company`, and `/admin` requests all resolved to `/login`; no private dashboard content appeared.
- The Agency contact section was visible, and `Send a Message` opened and closed the intended existing request-form modal without submitting data.
- The live preview exposed a modal focus defect: focus remained on the background trigger and was not restored on close. A local follow-up moves focus to the close control, supports Escape, and restores the trigger; current-head preview verification is still required.
- At a 390 by 844 viewport, Emerson, Agency, and the EPDG login had no horizontal document overflow. The EPDG public landing page remains untested because it has no PR preview.
- The inspected Agency page emitted no console warnings/errors and no failed initial network requests.
- No account was created, no form was submitted, and no private/authenticated page was opened.

## 2026-07-11 21:36 EDT — Safe frontend and database follow-up

- Created local commit `432ce17` (`fix: harden previews and public accessibility`).
- Removed invalid image metadata/preloads, added public form label associations and EPDG auth landmarks, fixed Agency modal focus lifecycle, added conservative non-CSP headers, and added EPDG landing file-based Netlify configuration.
- Removed the unverified hard-coded EPDG Railway origin and `/api` proxy without inventing a replacement.
- All four local builds passed; all four lints passed; all four smoke checks passed; EPDG API-origin tests passed 2/2.
- Created local commit `3b700bc` (`fix: serialize lead rate limiting`).
- Prepared byte-identical forward-only rate-limit migrations, a metadata-only verification query, and CI regression coverage. The combined Edge/migration Node suite passed 9/9.
- Metadata-only `core` audit completed without reading rows; no live migration, Edge deployment, environment update, merge, or production deployment occurred.

These local commits are not release evidence until pushed and associated with fresh current-head GitHub and Netlify results.

## 2026-07-12 — PR #27 technical handoff verification

### Authoritative workspace and review state

- Created a clean dedicated worktree from exact remote head `7590df7`; the preserved working directory and its local documentation/migration status were not modified or discarded.
- Confirmed `origin/main` is already an ancestor of the PR branch, so no merge from main was necessary.
- Confirmed PR #27 has 118 changed files, no submitted reviews, and no unresolved inline review threads.
- Confirmed the existing root `package.json` is unchanged from main and did not add or use Freebuff preview scripts.

### Confirmed follow-up fixes

- Disproved the Vite-starter finding: both Agency and EPDG landing `App.tsx` files already mount their completed application components.
- Replaced the landing page's unconditional GitHub Pages base with a validated deployment-specific base. Netlify/local builds use `/`; the main-only GitHub Pages workflow supplies `/Empire-emerson_frontend/` and publishes `404.html` for SPA deep links.
- Changed production `epdg` imports so development-only company, school, onboarding, portfolio, and certificate fixture modules are not emitted in production chunks.
- Changed mock authentication to a development-only dynamic import. Production artifacts no longer contain the known mock accounts or token marker.
- Removed the remaining company `isApproved = true` bypass, corrected the school role redirect to `/school`, and prevented rejected login responses from being persisted as authenticated state.
- Preserved login, registration, and email-verification errors by exempting verification from global 401 redirection and using encoded request parameters.
- Removed the iframe reload-count heuristic that claimed a Google Form submission without authoritative confirmation. Google now owns validation and success/failure rendering inside the embedded form.

### Exact local verification

- Toolchain: Node `22.23.1`, npm `11.17.0`, Deno `2.8.1`.
- All four `npm ci --no-audit --no-fund` commands passed without lockfile changes.
- All four application lint, build, `npm test --if-present`, and smoke commands exited `0`.
- EPDG landing deployment-base tests passed `3/3`; `epdg` API/auth/production-safety tests passed `10/10`.
- A separate GitHub Pages build emitted `/Empire-emerson_frontend/assets/`; the normal landing build emitted root `/assets/` paths.
- Edge and migration regression tests passed `9/9`; Deno lint checked six files; both frozen Deno checks passed.
- Seven requested Edge/migration mirror pairs were byte-identical by SHA-256.
- Manifest/lockfile parity passed for all four applications; the high-confidence names-only credential scan and `git diff --check` passed.

### Netlify evidence and external boundary

- Exact head `7590df7` has a ready `epdg` preview at `https://deploy-preview-27--epdg.netlify.app`.
- `theemerson` deploy `6a53a74494c10100082a0870` and `emersonagency` deploy `6a53a743b6b5a700083fe3fe` both report `state: error`, no publication time, and no provider summary message even though the GitHub deploy-preview contexts are green.
- The associated detailed Netlify build API returned `Unauthorized`; the repository has no evidence proving whether cancellation was deduplication, path filtering, supersession, or another provider setting.
- The EPDG landing site still has no PR #27 Netlify context. Its repository build/base configuration is now verified, but provider Git integration remains external.
- No Netlify production setting, environment variable, domain, form permission, deployment, Supabase function, or database migration was changed. PR #27 remains unmerged.
