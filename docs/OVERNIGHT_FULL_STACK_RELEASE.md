# Overnight full-stack release journal

This journal records the non-sensitive evidence for the July 11, 2026 stabilization and release work. It must never contain secret values, private user records, intern records, or production row contents.

## 2026-10-28 — company public-source alignment preparation

The company source review branch preserves public `origin/main` history and keeps
the earlier private authoring branch recoverable without publishing its private
inputs or evidence. Approved company runtime content, intern contributions and
the original exact-version feature validators are retained. The additive frozen
public boundary binds 23 public payloads and all 217 existing published files;
only fresh `release-build.json` metadata is exempt from the prior output hashes.

See [Public source boundary](PUBLIC_SOURCE_BOUNDARY.md) for the three exact target
mappings, content revisions, local verification recipe, exclusions, operating
holds and fix-forward recovery. Local preparation does not publish, change a
Netlify setting, modify a database, enable intake, send email or alter the EPDG
learner portal. Fresh commit-specific checks and independent diff review are
required before the coordinated remote handoff.

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

## 2026-07-12 - Backend preview and database hardening continuation

- Verified frontend head `afb7afff4669cf55fac9c8a52f89c7a23c0baeff` and backend head `48f6e40a95375532c7194217a7454230f8f8f30d`; both isolated worktrees were clean before this phase.
- Added only the public Netlify production and PR #27 origins to the Railway backend PR environment's `CORS_ORIGINS` variable. No secret value was read or recorded.
- Railway exact-head preview deployment `d568acc8-4eb6-481e-8ede-921ed27132ac` built successfully but failed its `/health` check because the process exited during startup. The provider's automated diagnosis blamed required configuration despite all 16 variable names being present; privacy-safe application logs exposed no values and did not identify the startup stage.
- Backend commit `f6f8670` adds a privacy-safe startup stage (`environment`, `database`, or `application`) plus error type and a focused regression test. Railway started replacement exact-head deployment `88ab1ee3-5606-442e-80e2-f0a3ef973cf1`; it must pass before any backend merge or production deployment.
- Proved the live `20260711212426_reconcile_leads_and_rate_limits` ledger statement matches the tracked SQL and reconciled the two tracked filenames to that existing identity. Live migration history was not edited or rewritten.
- Prepared mirrored `20260712090000_harden_career_data_boundary.sql` migrations: enable RLS and revoke browser roles on four career tables, fix `update_timestamp()` search path/execute grants, and add two catalog-confirmed missing career foreign-key indexes. No end-user policy or data mutation is included.
- Added metadata-only verification SQL and three focused migration regression tests. The combined local Edge/migration suite passed 12/12 on Node.js 22.23.1.
- No merge, production backend deployment, live migration, or Edge Function deployment occurred in this phase.

### Exact-head provider follow-up

- Frontend head `18daad2d0c94c8142349f0cafd742f7cd669c791` passed GitHub Actions run `29218914769` and all four GitHub Netlify contexts.
- Netlify API evidence overruled the context summary for verification purposes: Emerson and Agency produced ready deploys at that head, while EPDG Landing deploy `6a5448d29dca9b00088b80ec` and EPDG platform deploy `6a5448d26c39660008503fdb` were canceled for no content change. The two canceled deploys are not counted as passing previews.
- Added the same app-local deploy-preview evidence comment to all four `netlify.toml` files so each application path changes together and Netlify must evaluate one final shared head. All four local builds, lints, targeted tests, and smoke checks passed with Node.js 22.23.1 and npm 11.17.0.
- Railway production and PR deployments both fail at the database connection boundary. The production deploy log reports PostgreSQL code `28P01` (authentication failed); no credential value was read or printed. Production database credential correction remains blocked on the backend/founder owner, and no database password was changed.
- Because backend connectivity is not proven, the prepared Supabase migrations and Edge Function remain unapplied and undeployed.

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

## 2026-07-25 — final infrastructure sprint reconciliation

This entry supersedes older statements above that the prepared Supabase work was still unapplied. The historical entries remain unchanged as evidence of what was true when each earlier review occurred.

- Applied `20260725225312_serialize_lead_rate_limit_and_index_cleanup`, `20260725225336_harden_career_data_boundary`, and `20260725230658_add_lead_idempotency_contract` to project `gqlyofoazfkumirhbnmc`.
- Verified the atomic lead RPC with a transaction-only first-write/retry contract test; the transaction rolled back and left zero synthetic rows.
- Deployed active `send-consultation-email` Edge Function version 13 and verified preflight, honeypot, malformed payload, invalid email, size limit, missing/disallowed origins, and method handling without submitting a real lead or sending an email.
- Verified that all tracked backend migrations `001`–`033` match the live `public.migrations` ledger by identity and normalized content hash.
- Enabled RLS and revoked browser access on the four career tables, hardened `update_timestamp()`, and added the catalog-confirmed foreign-key indexes. End-user RLS policies remain intentionally blocked until the custom integer identity model is mapped safely to Supabase Auth UUIDs.
- Railway remains blocked at PostgreSQL authentication with code `28P01`; no database credential value was read, printed, or changed. The backend PR remains draft and unmerged.


## 2026-10-28 — Three public website repairs

- Scope: Emerson_Empire, Agency_LandingPage and EPDG-Landing-Page. No portal, CRM, media studio, database, authentication or role changes. The epdg tree and shared/emerson-design-system.css match main.
- Repairs build on the public-only source boundary in PR #34; private authoring history and inputs remain local. Approved data payloads, original intern contributions, Studio implementation and historical publication receipts are preserved.
- Add the founder-confirmed existing Google Forms, functional contact mailboxes and daily Eastern schedule: 10 AM/free/60 minutes, 2 PM/$10 USD or fee waiver/90 minutes, 7 PM/$20 USD or fee waiver/two hours. No application or registration test submission was created.
- Repair legal links, mobile dialog layout, CSP-blocked inline font loading, obsolete automatic GitHub Pages deployment and restore code, loading contrast and offline recovery messaging. Resource directories load only on resource routes.
- Legal pages are exact-wording review drafts adapted from the company Privacy and Terms drafts. Publication approval is pending. Figma is last at the user's request.
- Final clean-commit checks, protected preview deployment IDs and public release receipts must be recorded before publication. Earlier working-tree checks do not certify this source revision.
- Correct defects forward with a reviewed commit and fresh three-website builds. Never restore an older deploy or change the excluded applications' release settings.

The October 28 content follow-up removes unverified achievement counters and student totals from public presentation, normalizes visible response-time wording, labels service prices in USD without changing approved amounts, gives the class menu distinct schedule/free-class anchors and replaces the legacy TEE Agency route with the current approved TEA service catalog. Visitor loading wording is consistent. Public data payloads and protected projects remain unchanged.

The founder approved the exact Privacy Policy, Terms of Use and Disclaimer wording on October 28: SHA-256 (LF) 3b48c6c45da2dba8f5db119716c2575d86eef857d5dfcd79c1dd204bb501f134, reviewed on protected TEE deploy 6ae226d8dac0500318ccc883. This approval applies only to the three public company websites. Unconfirmed legacy request links now lead to the functional contact page; historical protected-review builds retain their hold. Current Netlify credit balance was 2,873.4/3,000 with auto recharge disabled before this release.


### Published website release — October 28, 2026

Source eb7b03ebe385710518a3a70c59d8e7a970bab467 was merged by PR #35 (main ef970929ae7af4cd6c2ef33080babee9c762c99b). Both required GitHub workflows pass at the source revision; the public suite has 63 regressions. All three clean source builds, lints, smoke checks and current artifact-integrity scans pass.

Fresh production deploys: TEE 6ae22a3191e71a912b2ab143; TEA 6ae22a3e9c64dda512c59e74; EPDG public 6ae22a4da3b3e859abfefa06. Provider readback marks each current/ready. Anonymous HTTP verification matches all three live release manifests exactly and verifies 8 key file hashes plus 9 routes per site. Browser checks confirm the release ID, published policies without draft banners, functional contact choices and all three daily sessions. EPDG and Agency dialogs fit 375px; Escape restores trigger focus. Offline and reconnection notices work. A controlled 400ms/200,000-byte-per-second local class-page load reached its heading in 5.563 seconds; this is not a like-for-like comparison with the audit's 41-second field result. No form was submitted.

The app-local Netlify build commands now explicitly install the root locked shared dependencies before building. This prevents reliance on an existing cache when TypeScript resolves imports from shared/. This configuration-only follow-up does not change the deployed website implementation; current application artifacts retain source eb7b03e. Provider bases remain Emerson_Empire, Agency_LandingPage and EPDG-Landing-Page on main, with app-local configurations taking precedence. The root configuration and excluded project settings are unchanged.

Figma target selection was pending at website publication; the completed alignment is recorded below. Shared-account credential/MFA work and the excluded Studio backlog are not performed in this website release. Railway and Supabase were not changed: the three public sites use static content, external Google Forms and email drafts rather than those runtimes. The full detailed content/accessibility/cross-browser audit inputs remain needed for broader certification; targeted checks above do not establish full WCAG or device coverage. Correct future defects forward through a reviewed change and fresh bundles; do not restore old deploys or change portal, CRM or media studio state.


### Figma reference alignment — October 28, 2026

The founder selected the existing Ecosystem Modernization System file for the release references. Its previously empty Page 1 is now Public websites • 2026-10-28. The editable reference board is [Public websites • Approved release 2026-10-28](https://www.figma.com/design/rZdhlpba7FM2Rw1QwJcf1A/The-Emerson-Empire-%E2%80%94-Ecosystem-Modernization-System?node-id=6-27).

The board records each public site's navigation, footer labels, canonical page registry and deployment/source identity; the shared daily schedule, Google Form destinations and five functional contact channels; all 17 exact approved policy sections; and the released typography, palette, radius and mobile reference values. It contains 211 editable text layers, 127 component instances and four local source-aligned components. All 113 hyperlink destinations pass the approved public/mailbox allowlist, all policy paragraphs match the approved source exactly, and structural checks find no text overflow. The navigation overview, schedule and full policy columns were visually inspected. Full-page artwork remains in the original website source.

Figma source identity is the published website implementation eb7b03e and legal source SHA-256 3b48c6c45da2dba8f5db119716c2575d86eef857d5dfcd79c1dd204bb501f134. File sharing, account seats and permissions were not changed. The board covers only the three public websites; portal, CRM and media studio project designs and runtimes were not edited. Screenshots and validation receipts remain in the local release evidence folder.

### Public website accessibility follow-up — October 28, 2026

The founder requested the remaining accessibility/browser checks and an owner account-security walkthrough, retaining the portal, CRM and media studio exclusions. The baseline axe-core 4.14.0 WCAG A/AA through 2.2 and best-practice scans found small-label contrast failures, unnamed navigation landmarks, a footer heading jump and an EPDG logo-button accessible-name mismatch. Narrow-screen checks also found long email text overflowing at 320px; manual keyboard testing found mobile navigation did not close with Escape.

Focused public website corrections darken only affected labels, name navigation landmarks, repair footer/route heading structure, put one keyboard skip link before site navigation, focus the new page after client-side route changes, preserve focus when closing mobile navigation, and allow long public contact/policy text to reflow. Reduced-motion preferences and visible keyboard focus receive public-site styles. The new shared keyboard component receives its route from each application's own router so distinct package resolutions cannot create an invalid router context. Project Studio and assignment routes are excluded from that helper. No account, database, intake destination, approved policy wording or protected application source is changed.

The first repaired desktop matrix covers home, classes, inquiry, privacy, services/pricing, resources and each main public program across all three sites (21 pages) with zero automated violations. This working-tree observation is not the final release receipt. Fresh clean-commit builds/lints/smokes, CI, mobile and keyboard evidence, production IDs and browser results must be recorded before marking publication complete. Automated incomplete contrast results require manual review; this is not a blanket WCAG conformance certification.

The owner confirmed no Mac/iPhone is available, so Safari and real iPhone/VoiceOver checks remain explicit device gaps. A signed Mozilla Firefox 159 build was extracted only into the local QA tools directory, but desktop application approval timed out before it could run; Firefox must not be listed as passed. No default browser, system installation, browser account, extension or security setting was changed. Personal MFA setup is provided as an owner walkthrough; organization enforcement, credential rotation and shared access changes remain separate because they can affect excluded projects. Correct defects forward with a reviewed commit and freshly validated public bundles; do not restore old deploys or alter excluded project configuration.
