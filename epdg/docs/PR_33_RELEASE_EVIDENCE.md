# PR #33 review deployment and validation repair

Requested review title: **Add EPDG access hold and disconnected dashboard design preview**.

## Revision and current provider evidence

Read-only GitHub inspection confirmed PR #33 at `ccc3b70517efdb445df1960498e85124f3cf1b9e`, branch `agent-secure-access-and-dashboard-shells-1bcd`, base `3fbfafc95e9f2656b7fd314077d97c862790484e`. It was not in draft. This runner's local snapshot was `a0662a1f2a9ea31c626202c4284e47bbd6a79ae8`; byte comparisons confirmed its EPDG Vite configuration, presentation module, Agency lockfile, and CI workflow matched those files at the remote PR head before edits. New changes remained workspace changes awaiting platform submission; no new remote head was asserted.

GitHub reported EPDG, both other passing application jobs, and Edge checks successful at the reviewed remote head, with Agency and the aggregate build failing. The job log download endpoint returned 403. The exact reported Agency failure was independently reproduced locally with Node `22.23.1` and npm `11.17.0`: `npm ci` rejected missing runtime/core `1.11.3` and wasi-threads `1.2.3` entries.

Read-only Netlify inspection confirmed deploy `6ad687ac7776a34e2973e009` was ready for that remote head and context `deploy-preview`. Its URL, `https://deploy-preview-33--epdg.netlify.app`, returned HTTP 200 but still served the **normal access hold**, not the designs. The served entry matched the existing local compiled entry exactly (SHA-256 `8bed2d87d01a3adb36b63161ac8d901a7384ac359b36549467493329c68023e9`). The hold marker was present and the design notice absent. That is baseline normal-artifact evidence, not evidence of a newly deployed design mode.

## Submitted-change intent

- `epdg/netlify.toml`: select design mode only for `deploy-preview`; retain production `npm run build` and `dist`.
- `.github/workflows/epdg-build-check.yml`: clean both EPDG output directories, retain normal build/lint/tests/smoke, add a separate design build and compiled artifact checks, upload both modes with revision metadata. No required job was removed, ignored, or weakened; installation remained `npm ci`.
- `epdg/scripts/verify-portal-build.mjs`: inspect real compiled files for required hold/design states, normal exclusion, preview absence of service-worker files/registration, sampled legacy fixture/API markers and credential-shaped strings; write file checksums and checkout/PR-head metadata.
- `Agency_LandingPage/package-lock.json`: add exactly three missing lock entries and preserve every existing entry and top-level metadata.
- `epdg/.gitignore`: ignore the separate design artifact directory.
- `epdg/docs/PORTAL_DESIGN_PREVIEW.md`, this evidence file, and `docs/OVERNIGHT_FULL_STACK_RELEASE.md`: update review instructions and verification evidence. The app-local evidence file accompanies the portal changes; reviewers must confirm the platform commit includes the root workflow, Agency lockfile, and root release log as well.

These were workspace changes prepared for the platform, not a claim that the remote PR already included them. No product component or public content changed in this repair run.

## Lockfile reasoning and verification

The lock already contained `@napi-rs/wasm-runtime@1.1.6`, whose peer ranges required `@emnapi/core` and `@emnapi/runtime`. Sharp's optional WASM dependency also referenced runtime, and Rolldown's WASM binding retained its own exact nested core/runtime `1.11.1` entries. The missing top-level resolution was satisfied by runtime/core `1.11.3`; core required exact wasi-threads `1.2.3`, so that version was added nested under core. Existing wasi-threads `1.2.2` remained unchanged for the older exact dependency.

npm `11.17.0` generated candidate lock metadata using `install --package-lock-only --ignore-scripts`; unrelated peer-flag normalization and extra bundled-package metadata were discarded. The final diff added only the three missing entries (33 lines), with registry-provided integrity values. No existing versions, dependencies, flags, package manifest, or application files changed. A structural assertion verified all original lock entries and top-level metadata were identical. `npm ci --no-audit --no-fund` then succeeded (283 packages) without lockfile changes. npm's default allow-scripts warning for sharp was not overridden and no install policy was changed.

Local toolchain was Node `22.23.1` and an isolated npm `11.17.0` installation outside the repository. Agency lint and both TypeScript no-emit checks passed; no Agency test script was configured. Agency smoke failed because `dist/index.html` was absent. Running its production build was prohibited, so fresh build/smoke acceptance remains assigned to CI rather than reported passing.

## EPDG verification

The 16 existing source/configuration tests, full EPDG lint, both TypeScript no-emit checks, verifier syntax check, and four-app manifest/lockfile parity check passed. The new normal artifact verifier passed against the existing compiled files tied above to the old remote deployment. A negative check using a temporary copy of that compiled output rejected an injected design marker, demonstrating contamination detection. These did not create a fresh build or establish a result for the pending changes.

CI was configured to build both modes into separate, freshly cleaned directories, validate them before upload, and record both the checkout SHA (which may be a GitHub merge revision) and PR head. New CI outcomes and design artifacts remained pending submission. Terminal `npm run build` and `npm run build -- --mode design-preview --outDir dist-design-preview` were prohibited and were not executed or bypassed. No new deployment was initiated directly.

Browser tools remained unavailable. All four views, profile/support navigation, mobile menu, keyboard operation, display-state transitions, network absence, generated-worker behavior, and upgraded-browser caches remained untested in a browser. A working new design-preview URL/revision could only be confirmed after the platform submitted and deployed these changes; the existing alias above must not be described as a working design preview until then.

## Review workflow and safety

The platform handles source submission and review updates. Direct PR/Git mutations were prohibited in this run. The requested title and updated description were prepared in the results materials; live GitHub title/body updates were not asserted. Because PR #33 was not draft, use the platform draft control if available, otherwise a human must click **Convert to draft** on the existing PR. Do not create a replacement PR.

Live Netlify metadata confirmed production publishing remained locked at `9e2bbb0cbae7de3eabc27da0bcea37bebed449a2`. No production configuration/secrets, public application source/content/branding, backend connections, database settings, storage visibility, or live records changed. The only Agency change was the explicitly allowed lockfile repair. No mail or infrastructure action occurred.

Backend authentication, token revocation, invitation/recovery, owner bootstrap, scoped permissions, and institution isolation remain incomplete. The presentation selector grants nothing. Do not reopen legacy authentication. After isolated backend acceptance, replace the hold through a focused server-derived session/profile/access integration while keeping future features closed. If preview validation fails, revert only the preview-context selection/check changes while preserving the production access hold and a valid lockfile. Retain evidence of failed checks; do not unlock or publish production as a workaround.

Recommendation: **DO NOT PUBLISH YET**. Phase 1 remains incomplete.
