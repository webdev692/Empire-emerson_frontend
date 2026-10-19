# Apply the omitted repository-level repair to existing PR #33

The reviewable [patch](./PR_33_REPOSITORY_FIXES.patch) contains exactly:

- `.github/workflows/epdg-build-check.yml`
- `Agency_LandingPage/package-lock.json`
- `docs/OVERNIGHT_FULL_STACK_RELEASE.md`

It was checked against the exact remote baseline `454e1fa27c62e0e7d819a97c8dbd551b09b63138` using `patch --dry-run` in a separate temporary directory. No branch was switched and no remote change was made. The three root files are also repaired in the runner workspace, but this platform has previously submitted only `epdg/` files. Merely submitting this handoff does **not** put the three root changes into the PR diff.

## Repository-capable handoff

A human or repository-capable runner must recheck PR #33's head and use an isolated checkout/worktree of `agent-secure-access-and-dashboard-shells-1bcd`, preserving existing local work. From that checkout's repository root, review the patch, then run:

```sh
git apply --check epdg/docs/PR_33_REPOSITORY_FIXES.patch
git apply epdg/docs/PR_33_REPOSITORY_FIXES.patch
```

If the check fails, stop and reconcile against the current files; do not force application or overwrite unrelated work. Stage and commit only the three named files, review their staged diff, and push that focused commit to the **existing** PR branch. Do not create a replacement PR, force-push, merge, or publish. These are handoff instructions, not commands executed by this agent.

Use Node `22.23.1` and npm `11.17.0` for Agency and EPDG deterministic installs and checks. The amended CI workflow retains all required jobs, lint/tests/smoke, and `npm ci`. It adds fresh, separate normal/design artifacts and executes the existing verifier against both, uploading checksums and checkout/PR-head provenance. Attach actual new CI results; previous checks do not verify the repair commit. Confirm all three filenames appear in the remote PR diff and inspect their remote contents. The workflow change must be present before claiming dual-mode CI acceptance.

Update the existing PR title to **Add EPDG access hold and disconnected dashboard design preview**. Convert PR #33 to draft while required checks remain unresolved. Its description should say that normal production retains the access hold; the design preview is disconnected and does not authenticate accounts or grant permissions; this repair restores the omitted lockfile/CI/release changes. Backend authentication/revocation, invitations/recovery, verified owner configuration, scoped permissions, and institution isolation remain incomplete. Preserve the complete existing isolated-test proposal and link the new CI evidence. Do not describe this work as Phase 1 completion.

## Evidence from the preparation run

- Current remote PR head was `454e1fa27c62e0e7d819a97c8dbd551b09b63138`; all three root files were absent from its diff. Agency and aggregate CI failed in run `39327003644`. Log download returned 403; local `npm ci` reproduced the exact three missing entries.
- Exactly three lock entries were added: core/runtime `1.11.3` and core's nested wasi-threads `1.2.3`. All existing records and metadata, versions, and package.json were preserved. The optional WASM runtime peer dependencies and core's exact thread dependency explain the additions.
- Both Agency and EPDG `npm ci` passed with the required toolchain. EPDG's 16 tests, lint, both TypeScript checks, smoke on existing design artifacts, and four-app manifest parity passed. Agency lint/type checks passed; it had no configured test script. Agency smoke failed because no build output existed.
- The existing design verifier passed; the local compiled entry matched the live design preview at https://deploy-preview-33--epdg.netlify.app, tied by provider metadata to `454e1fa`. This was existing-artifact evidence, not a fresh build of the root fixes.
- Terminal builds were prohibited and not bypassed. Fresh normal/design builds, normal artifact verification, new CI, and remote submission remained pending. Browser/network/keyboard/mobile/installed-worker and backend security acceptance remained unverified.
- Direct Git/PR mutations were prohibited in this environment. No commit, push, title edit, or draft conversion occurred. Production publishing was confirmed locked at `9e2bbb0cbae7de3eabc27da0bcea37bebed449a2`; public content/designs, provider/backend configuration, database/storage permissions, and live records were untouched. No infrastructure or mail action occurred.

**DO NOT PUBLISH YET.** Phase 1 remains incomplete.
