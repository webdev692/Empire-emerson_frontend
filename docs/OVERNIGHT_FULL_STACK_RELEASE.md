# Overnight full-stack release journal

This journal records the non-sensitive evidence for the July 11, 2026 stabilization and release work. It must never contain secret values, private user records, intern records, or production row contents.

## 2026-10-27 — Verified isolated backend origin pinned for hosted build

The source candidate was committed at
`fd507c6c1053bfc4b5662a86497a1f31fb20d48b` on the existing PR #33 branch;
GitHub CI run `40523303941` passed. The user subsequently approved the isolated
public endpoint and exact private credential destinations. The operator created
and verified `https://epdg-practice-api-synthetic-hosted.up.railway.app` while
the application remained sealed. The frontend profile now pins that exact backend
origin, preserving both verified portal origins and fixed same-origin API paths.

The first actual hosted compilation was correctly rejected by the unchanged
artifact verifier because object-derived mode detection retained inactive local
branches. A literal compile-time flag is now emitted only after profile
validation; corresponding client/configuration tests cover that boundary. Local
branches must be absent from the actual bundle before this candidate is accepted.
The strict verifier was preserved and no failed artifact was deployed.

This bounded source change does not unseal the API, provision a database, deploy
Netlify output, change production, or enable owner/admin controls. Private
synthetic bootstrap and actual hosted login, recovery, cookie/CSRF, learning,
review and CRM handoff acceptance remain separate operator work. Real HR records
and credentials remain excluded from frontend source and artifacts. Fresh
compiled hosted checks and revision-tagged manifests are recorded in workspace
`build-evidence/epdg-synthetic-2026-10-27/frontend-hosted-build/`; those checks
alone do not establish hosted backend or browser acceptance.

## 2026-10-27 — Isolated frontend source release candidate

Prepared `exchange/epdg-frontend-release-20261027` from existing PR #33 base
`2397c6e276e8ce111b70148333cec2682a4d4166`, preserving the original checkout,
public applications and prior root workflow/lockfile fixes. The candidate contains
the complete synthetic frontend security, learning, assignment, mentor, revision
and onboarding-handoff source closure, its tests and non-sensitive documentation.
Private runtime state, environment values, fixture credentials, dependency installs
and generated outputs were not copied into source.

The candidate pins verified portal origins `https://epdg.netlify.app` and
`https://hosted-practice--epdg.netlify.app`. The preview origin currently serves
the closed normal access hold at deploy `6ae0adbbb24754f1503f3bb6`; this does not
establish hosted API or session acceptance. Backend origin remains empty and the
hosted build must reject this incomplete profile. Normal and disconnected design
builds retain their existing boundaries. Owner/admin controls remain closed.

Production remains locked at `9e2bbb0cbae7de3eabc27da0bcea37bebed449a2`.
Publication is authorized only after the secure setup and current hosted testing
are complete. This source-preparation checkpoint does not commit, push, merge,
change provider configuration or publish either application. Current candidate
verification and staged-source review are recorded separately in workspace
`build-evidence/epdg-synthetic-2026-10-27/frontend-release/`. Earlier journal
entries and local browser receipts are historical evidence at their recorded
fingerprints, not current hosted release acceptance.

## 2026-10-27 — Hosted-practice frontend and installed-worker retirement candidate

Prepared a separate explicit hosted-practice entry, reviewed HTTPS profile,
same-origin API proxy and strict hosted response parsing. Normal access-hold and
disconnected design outputs remain separate; the loopback development entry
remains unbuildable. No local alias, fixture mapping, credential or automatic
login is included. Owner/admin controls remain closed. The profile is deliberately
unconfigured until exact provider origins are verified; this entry does not claim
a hosted deployment or production acceptance.

Added a byte-verified retirement script at the prior `/sw.js` path, with no fetch
or cache-serving handler. It removes only the portal scope's Workbox precaches,
unregisters and refreshes known portal windows. Page cleanup now preserves
unrelated workers/caches and closes access on an unexpected controller. Behavioral
tests exercise actual install/activate handlers, cleanup order, unrelated data
preservation, wrong scope and closed windows. A separate loopback browser lab uses
the generated normal PWA to rehearse the upgrade without accounts or CRM data.

Fresh checks passed 87 frontend tests, full lint, TypeScript, normal/design builds,
both compiled artifact guards and smoke. Targeted retirement tests were repeated
after the final portal-path adjustment. Browser lab and actual hosted acceptance
have separate receipts; do not count pending origin/profile or hosted API work as
passed. See `EPDG_HOSTED_PRACTICE_FRONTEND.md` and workspace
`build-evidence/epdg-synthetic-2026-10-27/hosted-frontend/`.

The loopback browser lab subsequently passed: the generated normal PWA served the
cached old document with zero `/dashboard` network responses, then the audited
retirement worker produced a network replacement. The root registration and portal
precache were gone, while one unrelated worker and its comparison cache remained;
the replacement document had no controlling worker. This is mechanism proof only,
not hosted CRM acceptance or provenance for the actual previously published site.

## 2026-10-24 — Synthetic CRM onboarding handoff verified locally

Added a read-only learner onboarding panel with awaiting, ready, held and
withdrawn states. Refresh revalidates session, programs and handoff summary;
unavailable/disabled readiness stays an error. The backend candidate receives
versioned, signed local synthetic decisions for one dedicated fictional program,
without creating identities, credentials, invitations or roles. Applicant,
resume and onboarding records belong to Emerson CRM; real HR records remain in
private review staging pending a verified CRM target and current HR clearance.
EPDG handles learning after that clearance. No deployed real-CRM exporter is
claimed by this local rehearsal.

Recorded automated results are 71 frontend, 121 backend core and nine root tests:
**201 passed**. Final backend build/lint and all 121 core tests passed again with
schema/ACL/guard readiness included in startup and health checks. Reviewed local
migration 007 applied with SHA-256
`2f32810a5956999693d98e3ea9f4ca200da53ae6530da3fb1e08c51ff54a75ca`.
Seven dedicated fixture rows were added; all 76 earlier immutable rows retained
digest `7ec347495937fe66af5070c611ce90d80ff01f5a748d9273aa013f9176f4e9a2`.
Accounts, passwords, memberships and roles were preserved.

All 23 live handoff groups passed: the original 17 plus six supplemental checks.
The original groups covered replay/version conflicts, withdrawal
serialization, direct-SQL scope checks, file submissions and mentor feedback,
restored preserved evidence after newer clearance, durable controlled restart
and disabled-feature fail-closed behavior. Supplemental checks covered concurrent
same-version decisions and exact retries, nonce/decision collision rollback,
source-decision freshness and oversized signed-body rejection. Repeated reviewed
setup applied zero migrations and added zero rows, preserving all 112 immutable
rows present at that checkpoint, sessions and event/nonce history. Independent
catalog review found unchanged original 50-table metadata, 22 RLS tables, zero
browser grants and no handoff security-definer functions. Browser acceptance verified held →
ready → withdrawn, an already-open editor save denied with 404 after withdrawal,
keyboard refresh, 390px layout without horizontal overflow, logout and viewport
reset. All five wider regressions passed 71 groups: learner 10, text submissions
15, uploads 17, revisions 12 and mentor review 17. Combined with 23 new handoff
groups, 94 live groups passed. Mentor ran after normal authentication-window
expiry without 429 responses, authentication changes or restart. No rate limit
was relaxed or reset to run the regressions.

Frontend validation at `2026-10-24T18:06:38.663Z` passed tests, full lint, both
no-emit TypeScript checks, fresh normal/design builds, both compiled guards,
smoke and whitespace checks. Its 32-file uncommitted fingerprint is
`6c5751f5f56bc5d3c61177f73cbf976b35d14c9c0c442bf8795aa287a1ac9de1`
on base `2397c6e276e8ce111b70148333cec2682a4d4166`. Source stayed unchanged and
both publishable outputs matched prior artifact bytes, excluding verification
receipts. The final scan at `2026-10-24T18:14:49.240Z` checked 20 artifact files
against onboarding/fixture markers, the private alias and all eight current
private runtime values, including the signing key, without recording values or
their hashes. This supersedes only the initial pending new-key scan; prior
milestone evidence remains historical at its recorded source fingerprint.

See `EPDG_SYNTHETIC_CRM_HANDOFF.md`, backend
`docs/SYNTHETIC_CRM_ONBOARDING_HANDOFF.md` and workspace
`build-evidence/epdg-synthetic-2026-10-24/crm-onboarding-handoff` for contracts,
source/build fingerprints, logs, screenshots and the final isolation receipt.
The handoff live receipts are `backend/handoff-verification.json` and
`backend/handoff-edge-verification.json`; repeat/catalog proof is in
`backend/setup-repeat.json` and `backend/independent-catalog-review.json`. Browser proof
includes `browser/ready-mobile.png` and `browser/withdrawn-desktop.png`.
`regressions/regression-summary.json` records all five passing suites; the final
managed runtime health observation is recorded separately.

Production remains locked and normal builds retain the access hold. Owner/admin
controls remain closed. No real HR import, publication, merge or unlock occurred.
Compensation preserves additive evidence and uses only managed local feature
disablement/service stops; database corrections require reviewed forward changes.
**DO NOT PUBLISH YET.**

## 2026-10-24 — Synthetic assignment revisions verified locally

Added a local revision candidate with explicit start after published feedback on
the latest receipt, a copied text draft without copied files, new receipts and
immutable earlier answer/file/feedback history. Mentor queue/detail labels now
identify each attempt; published feedback remains bound to its original receipt.
Submitted-state recovery resolves an ambiguous start response through an explicit
saved-status read. History refresh preserves the editor; a detected concurrent
submission blocks further writes while retaining typed text until explicit reload.

The five-attempt cap is only a bounded local synthetic practice setting. Each
attempt retains three active/six lifetime uploaded-file records and the existing
1 MiB/type bounds. Historical August 31 HR planning mentions a single revision,
but approved production revision policy is unresolved. This candidate does not
set that policy. Applicant/onboarding work belongs to the CRM; no real HR data,
accounts, mailbox routes, role permissions or owner/admin powers were imported.

Fresh frontend verification at `2026-10-24T16:07:15.009Z` passed all 63 tests,
with no failures/skips, full lint with zero diagnostics, normal/design builds,
both expanded compiled artifact verifiers, smoke and diff checks. Selected
learner/upload/mentor/revision markers, the private alias and seven configured
runtime secret values were absent from 20 scanned artifact files. Frontend
fingerprint `544ca927c1a7efabfbbfbd4fc3590d0d6ac1ab6e753bde8a99030a93168db5f4`
covers 28 files on base `2397c6e276e8ce111b70148333cec2682a4d4166`, with working
changes uncommitted and stable during checks. No app source changed while writing
this documentation.

Root reported reviewed local migration 006 applied with SHA-256
`cfa51624a3c7e8e3b552f12cb5dc6c2a5769fa78fd64258da4e62151f6c92b0b`;
37 frozen old rows retained identical before/after digest
`9dcb73a4ba522625a599a9bae649eb9e80badaa1353365979aa7be62a52081a2`.
Read-only Netlify inspection at `2026-10-24T16:10:45Z`, reported by root, confirmed
production locked at original commit `9e2bbb0cbae7de3eabc27da0bcea37bebed449a2`.
Fresh backend validation passed 101 core and nine root tests, making 173 combined
automated tests with the frontend. All 72 fresh live groups passed: 13 revision
including restart, 17 mentor, 17 uploads, 15 text submissions and ten learner.
The first learner attempt reached the normal login throttle; its unchanged
rerun passed after normal expiry. The limiter stayed intact and no service was
restarted to bypass it. Independent review confirmed original 50-table parity,
all six ledgers, 19 security/learning RLS tables, no browser grants/policies and
the current 125-file backend application fingerprint
`15b3fefb5a827d37d1e86a35c8da6064aeb2cc5551d3618d31532f92d7f9d0cc`.

Browser checks passed copied-text/file-free start, hidden offline retention and
recheck, save/upload/reload, mobile keyboard review/submit, a separate new receipt,
preserved original answer/file/feedback and verified historical downloads. New
feedback was empty and another revision unavailable until latest feedback.
Mentor queue and detail distinguished both attempts, and the new file downloaded
with integrity verification. A fresh post-regression mentor fixture sign-in left
attempt two awaiting review. No human learner password was read or changed, and
no browser session cookie was exported. Earlier mentor evidence and its 162 tests/60 live
groups remain historical, not current revision acceptance. See
`SYNTHETIC_ASSIGNMENT_REVISIONS.md`, `ASSIGNMENT_REVISIONS_EVIDENCE_2026-10-24.json`
and workspace `build-evidence/epdg-synthetic-2026-10-24/revisions-resubmissions`.

Normal builds still retain the portal hold and design preview remains
disconnected. Production stays locked by instruction; owner/admin controls,
grading, certificates and other privileged areas remain closed. Compensation is
to stop only managed local services while retaining additive attempts and
receipts; database corrections must be reviewed forward changes. No publication
or production unlock is authorized by this local receipt. **DO NOT PUBLISH YET.**

## 2026-10-24 — Synthetic mentor review verified locally

Connected a local mentor review queue, frozen learner answer/file detail,
private versioned feedback drafts, explicit one-time publication and learner
published feedback. The existing two school fixture accounts retain their
accounts, passwords, legacy roles and empty permissions. Three explicit
same-school enrollment mappings authorize only synthetic review. No grades,
outcomes, awards, reopening, enrollment administration or owner/admin powers
were added. Normal builds retain the portal hold and design preview remains
disconnected.

Reviewed forward backend migration 005, SHA-256
`1af6773a8c6b1c30c705032fe9d5f656bdd75027a70830a6812c3361004ded1e`,
adds three RLS tables for thirteen learning tables total, with zero browser
policies/grants. Applied 001–004 and submitted learner answers/files remain
unchanged. Guarded mentor seed created three explicit mappings; repeat applied
no SQL and added no mapping. Runtime mappings remain read-only, while scoped
invoker guards serialize revocation, review revisions and immutable publication.
Mentor reads/writes/downloads require both current mentor and learner scope;
already-published learner feedback survives mentor revocation through the
learner's own current enrollment/membership and receipt. Private drafts never
appear in learner responses. This is an explicit local test policy only.

Recorded validation passed 56 frontend tests, 97 core backend tests and nine
root tests (162 total), with no failures or skips. Frontend lint, normal/design
builds, both artifact verifiers, smoke and compiled isolation checks passed.
Backend build/lint passed with zero errors and the existing 161 warnings.
Independent live validation passed 18 mentor groups with full backend/database
restart, 17 upload, 15 text-submission and ten learner groups (60 total), plus
original 50-table metadata parity and all five reviewed ledger hashes. Multer
remains 2.5.0; no dependency/install-policy change belongs to this milestone.

Browser acceptance passed: learner draft privacy and published receipt/dashboard
feedback; mentor queue, frozen submission/PDF download, private draft save/reload,
explicit publication and read-only reload; mobile layout and keyboard focus.
After loading the current code, an unsaved 174-character comment remained hidden
offline and survived same-scope access revalidation. An initial development page
lost synthetic text; the evidence records that failure separately and the likely
but unproven stale hot-reloaded handler. No source fix was required. Screenshots
and browser observations are linked from the combined receipt. The learner was
signed out through the normal UI before existing school-A fixture sign-in. No
human learner password was read, reset or exported, and no cookie was exported.
A separate synthetic practice submission remains open awaiting mentor feedback.

Recorded frontend fingerprint:
`c0e66636a09eaa1bf6b613abc16cccc5c009860f3cb1b1985393a963b4b467dd`
(25 files). Backend full working-tree fingerprint:
`ff97cb608201f977df884c9c477be0b11b377646e409daa19507b46a48157bb6`
(181 files); tested app fingerprint:
`3b2ce1013d76be7934e87cf48049e7543ec52240f30de34315d5cb589c34bf0d`
(122 files). See `MENTOR_REVIEW_EVIDENCE_2026-10-24.json`,
`SYNTHETIC_MENTOR_REVIEW.md` and workspace
`build-evidence/epdg-synthetic-2026-10-24/mentor-reviews`.

Read-only Netlify inspection at `2026-10-24T15:46:43.344Z` confirmed the current
published deployment `6a385b7fac8ea70008ef72d6` is ready and locked at unchanged
commit `9e2bbb0cbae7de3eabc27da0bcea37bebed449a2`. Previous upload evidence
remains preserved. Production stays locked and privileged controls closed. Changes remain
local and uncommitted. No push, PR mutation, merge, deployment, hosted resource,
production write or real mail sending occurred. Stop only owned local services
or revoke a synthetic mapping to compensate, retaining additive drafts/files/
published history; use reviewed forward corrections rather than deletion or
applied-history rewriting. **DO NOT PUBLISH YET.**

## 2026-10-24 — Private synthetic assignment file uploads verified locally

Added explicit practice file selection/upload, reversible removal/restoration,
saved-file review, verified downloads and immutable final receipt file sets.
TXT/PDF/PNG/JPEG files are limited to 1 MiB each, three active and six lifetime
records per assignment. Existing saved text is required; file changes advance
the same optimistic draft revision. A reviewed forward migration 004 adds one
private BYTEA table with generated hashes/size, server IDs/timestamps, serialized
quotas and receipt manifests. Prior migration checksums and text-only receipts
are preserved. Ten learning tables have RLS with no browser policies/grants;
original 50-table metadata parity had zero differences.

The exact multipart route authenticates and checks Origin/CSRF/synthetic scope
before bounded memory parsing; other mutations retain their JSON contract.
Downloads recheck current scope and use attachment disposition, octet-stream,
nosniff, sandbox and no-store. The client verifies byte count and SHA-256 before
preparing a temporary download URL. No public/cloud storage or inline preview
was added. Signature checks do not scan for malware.

Security review justified a focused Multer 2.1.1 to 2.5.0 update. Its manifest
and lock changed only that version and removed six unused stream dependencies;
other package versions and install protections were preserved. Deterministic
install passed. The actual pinned multipart header bound is 16 KiB; the ignored
header-pair hint is not claimed as an enforced bound. Existing dependency audit
findings (19) and backend lint warnings (161) remain recorded for follow-up.

Passed 47 frontend tests, 91 backend core tests and nine root tests (147 total).
Frontend lint, normal/design builds, both artifact verifiers and smoke passed.
A final same-length corrupted-download negative case reran all 47 frontend tests;
the receipt proves only the test file changed, application source was unchanged,
and 18 payload hashes/isolation scans still matched the verified builds. Backend
build/lint passed. Eighteen live upload groups, 15 text-assignment groups and ten
learner groups passed (43 total), including full backend/database restart,
malformed fields, exact bounds, rollback, scope denial, races and immutable data.

Browser acceptance passed invalid-PDF rejection, explicit TXT/PDF upload,
remove/restore, private pending selection through offline/recheck, saved-file
reload, byte-identical TXT download, mobile/keyboard review and final submit,
receipt reload and verified final PDF download. The prior text receipt remained
unchanged. Lesson progress remained 3/5 (60%). Browser temporary network/viewport
overrides were reset; no human credential or active cookie was read/exported.

For a usable handoff, the guarded local operator idempotently added one empty
`SYNTHETIC Upload Practice` assignment to the learner's existing Career Readiness
program. The browser verified its empty answer and saved-draft prerequisite and
was left there. No account, enrollment, membership or permission changed; no new
DDL, ledger entry or service restart was needed. The submitted test receipt is
retained with its two practice files for inspection.

Current frontend fingerprint is
`97fa069452c16f4d1861ee6e62dd11a8e66c715099537a14c0eb355f61b50f9a`
over 20 files; backend full working-tree fingerprint is
`5d0fcf5f5201634a7ca98faee540dde602b62615099465619b24f21f96cc5194`
over 175 files, with live app fingerprint
`8e380f1b55aa4cad0eab982fa77c5d512332e186529c50392b5ebe5b0ba2722f`.
See `ASSIGNMENT_UPLOADS_EVIDENCE_2026-10-24.json`, the upload guide and workspace
`build-evidence/epdg-synthetic-2026-10-24/assignment-uploads`.

Read-only Netlify observation at 2026-10-24T15:17:05.352Z confirmed published deploy
`6a385b7fac8ea70008ef72d6`, ready and locked, at commit
`9e2bbb0cbae7de3eabc27da0bcea37bebed449a2`. No commit, push, PR mutation, deployment,
production configuration change or unlock occurred. Owner/admin controls,
invitations, portfolio uploads, grading, credit and certificates remain closed.
Normal production retains the access hold and design preview is disconnected.
Compensation is to stop the managed local services and retain files/receipts;
database corrections must be forward-only. Hosted/production file delivery and
malware scanning acceptance remain pending. **DO NOT PUBLISH YET.**

## 2026-10-24 — Synthetic learner assignment submissions verified locally

Added explicit text draft saves, review/edit, one final submission and persistent
read-only receipts in the existing local synthetic portal. Expected revisions
prevent stale overwrites; transaction locks, server-generated receipts and database
guards protect concurrent saves and idempotent submissions. Scoped reads/writes
require the active learner enrollment and membership; final answers cannot be
edited. Submitted assignments leave upcoming work and do not alter lesson progress.
Forward learning migrations 002/003 add two RLS tables and correct known fixture
prompts while preserving migration 001 and all existing answers. Nine learning
tables have no browser policies/grants; original 50-table metadata parity passed.

Pinned-toolchain results: 41 frontend tests, 82 backend core tests and nine backend
root tests passed, plus 16 live assignment and ten learner regression scenario
groups. Backend/database restart persistence passed. Frontend lint, normal/design
builds, both artifact verifiers and smoke passed; backend build/lint passed with
161 existing lint warnings. Compiled scans excluded the synthetic entry, private
alias and seven runtime secrets. Artifact deltas against the earlier learner build
are recorded without a historical byte-identical claim.

Browser checks passed for unsaved offline recovery with hidden account details,
saved draft reload, a second saved revision, keyboard review/edit/submit, mobile
layout, final receipt reload and unchanged lesson progress (3/5, 60%). The human's
session was used through the normal UI only; no active cookie or human password
was read, exported or changed. Temporary viewport/offline overrides were reset.

Current uncommitted frontend fingerprint is
`4a4a7a60155027cb209889341ecf6bf75b505c0b57ba6ded1daef61f38a473e5`
over 20 source files; backend fingerprint is
`08693bfa1956d95780d761716078943354ddd02595303e4d77529744fb7bc040`
over 170 files. See `ASSIGNMENT_SUBMISSIONS_EVIDENCE_2026-10-24.json`, the assignment
guide and workspace `build-evidence/epdg-synthetic-2026-10-24/assignment-submissions`.
Earlier receipts remain historical and are not relabeled as this working tree.

A fresh read-only Netlify observation at 2026-10-24T14:41:30.529Z confirmed published
deploy `6a385b7fac8ea70008ef72d6`, ready and locked, at commit
`9e2bbb0cbae7de3eabc27da0bcea37bebed449a2`. No commit, push, PR mutation, merge,
deployment, hosted configuration change or production unlock occurred. Normal
production retains the access hold and the design preview stays disconnected.
Owner/admin controls, invitations, uploads, grading, credit and certificates stay
closed. Compensation is to stop the managed local services while retaining drafts
and immutable receipts; correct schema problems with reviewed forward migrations.
Hosted/backend production acceptance remains pending. **DO NOT PUBLISH YET.**

## 2026-10-24 — Synthetic learner program dashboard verified locally

Connected the development-only learner dashboard to authenticated local APIs for
own assigned programs, lesson content/progress, upcoming work, example mentor
feedback and text-only resources. Lesson completion requires session CSRF and
exact origin, is persisted before the interface updates, and is idempotent.
Programs count lessons only; assignments stay read-only, with no submission,
grade, credit, qualification or certificate action. The normal production build
keeps its access hold; the design preview remains disconnected. No production
role/permission rules are implied by the synthetic fixture allowlist.

The backend added a separate, explicitly applied `synthetic_learning` schema and
ledger, seven RLS tables with no browser grants, three fictional programs across
two existing learners/institutions, seven lessons, three read-only assignments,
two example feedback entries and three plain-text resources. It checks the exact
local instance, active own enrollment and current institution membership. Runtime
grants allow content reads and only completion identifiers to be inserted, with
server timestamps. Both insertion and the duplicate-completion lookup recheck
current scope. Original 50-table schema parity was rechecked with no differences;
no passwords, accounts, memberships or owner/admin permissions were changed.

Fresh validation: 34 frontend tests, 76 core backend tests, 9 root tests, normal
and design builds/verifiers/smoke, and 11 live HTTP/SQL scenario groups all passed.
Frontend lint is clean; backend lint has zero errors and 161 existing warnings.
Live checks include cross-learner/institution denial, school-account denial,
CSRF, read-only assignments, an empty enrollment, idempotency, logout revocation
and persistence across a full backend/Postgres restart of the final build.
The portable backend npm wrapper failed to invoke its nested script; equivalent
pinned Node build/test commands passed from the required core working directory.

Actual browser checks covered assigned program/detail views, lesson completion,
server progress from 20% to 40% and then 60% overall, reload persistence, a
100%-lessons-complete card with its continue action removed, feedback/resources,
keyboard operation and narrow/wide responsive layouts without horizontal overflow.
An attempted active-cookie export was automatically rejected; no token file was
created. Browser tests used the existing session normally; independent API tests
used a disposable learner credential only in memory. See the learner guide and
`LEARNER_DASHBOARD_EVIDENCE_2026-10-24.json` for scope, source hashes and limits.

Frontend source fingerprint:
`d0503cfc881bfc9f086acdace21685f7e9cc90650f2338d2254f4c43c6c61108`.
Backend working-source fingerprint:
`a2904fb333cd142846bdff12d1701ae94a8ca0c0138454a6e2017a74f12538e7`.
Bases remain `2397c6e276e8ce111b70148333cec2682a4d4166` and
`7bfdb114363147ec2998d151dff22a786b2122ba`; changes are local and uncommitted.
Workspace evidence/screenshots are under
`build-evidence/epdg-synthetic-2026-10-24/learner-dashboard`.

Read-only Netlify metadata again confirmed current deploy
`6a385b7fac8ea70008ef72d6`, locked=true, at commit
`9e2bbb0cbae7de3eabc27da0bcea37bebed449a2`. No commit, push, PR mutation, merge,
deploy, production unlock, production record access or real mail action occurred.
Owner/admin controls remain closed. Compensation: stop the managed local stack
and preserve synthetic data; use forward corrections rather than destructive
schema rollback or legacy bearer authentication. Hosted and full production
learning-portal acceptance remain pending. Do not publish this candidate.

## 2026-10-24 — Private local login preference

At the user's request, saved their preferred login email in workspace instructions
and a Git-ignored private alias file. The synthetic development configuration
alone reads that non-secret preference and prefills the local account forms.
Login/recovery translate only the exact alias to the user's existing learner A
test identity. No database identity, password, account state, membership, role,
recipient restriction, provider setting or production account changed. Recovery
still goes only to the local `.invalid` Mailpit recipient. Account screens retain
the backend's synthetic address; the preferred real address is a local alias.

Fresh frontend checks passed: 28 tests, clean lint, both normal/design builds,
both artifact verifiers and smoke. Both publishable modes omit the alias define
and actual preferred email. Source fingerprint is
`a2a3d449044f4781025006831f129e17b95c6c5977624bbb471432d6ef290e6c`;
base remains `2397c6e276e8ce111b70148333cec2682a4d4166` with uncommitted changes.
Receipts/logs are retained separately under workspace
`build-evidence/epdg-synthetic-2026-10-24/login-alias`.

Observed the populated alias form and its explicit local-only explanation. The
browser adapter redacted the email value; exact private configuration and live
Vite definitions were checked using boolean results without printing the value.
The user's recovered account was also observed authenticated after their private
sign-in, resolving the earlier pending recovery reauthentication step. No new
mail or password action was performed for this preference change. See
`LOCAL_LOGIN_ALIAS_EVIDENCE_2026-10-24.json`. Production remains locked and
owner/admin controls remain closed. No remote mutation or publication occurred.

## 2026-10-24 — Connect the local synthetic portal

Added a separate development-only `synthetic-local` entry with cookie/CSRF login,
session restoration, logout, password recovery/change screens, read-only account
details and a server-derived membership summary. Account and recovery secrets are
memory-only; the recovery fragment is captured once and removed from history.
The normal entry continues to render its access hold and the design preview stays
disconnected. Owner/admin controls, invitations, registration, profile writes and
all educational-record workflows remain closed. No role permissions were invented.

The local runner fixes the frontend to `127.0.0.1:58080` and backend requests to
`127.0.0.1:58000`, strips inherited VITE settings, blocks broader host/proxy/fs
configuration, external connections and private sibling files, and disables PWA.
Synthetic build/preview commands are rejected. Publishable artifact checks now
also reject synthetic integration markers; collected paths are normalized so
the existing verifier works on Windows and Linux.

Fresh pinned frontend checks passed: lint with zero errors/warnings, 26 tests,
normal/design TypeScript and Vite builds, both artifact verifiers, EPDG smoke and
diff checks. Frontend base is `2397c6e276e8ce111b70148333cec2682a4d4166`;
the 12 changed implementation/test/config files have working-source fingerprint
`f19069171730b637f397db924c5b4aab3c761aad76c78c9a077a0e06398db8ad`.
Changes are local and uncommitted; this fingerprint is not a new Git revision.
Build receipts/log hashes are retained in the workspace's
`build-evidence/epdg-synthetic-2026-10-24/frontend-final` directory.

The unchanged backend security source was separately revalidated today: 67 core
and 9 root tests, all 17 HTTP/SQL/Mailpit scenario groups, original schema parity
and lint with zero errors / 161 existing warnings. Those checks preceded the
human's browser password reset; a human-managed fixture credential may now differ
from the scripted fixture default. See the backend revalidation receipt and
`LOCAL_SYNTHETIC_FRONTEND.md` for the fixture lifecycle constraint.

Browser observations include wrong-password denial, learner A/B self-scope
dashboards, session restoration after reload, read-only account, successful
sign-out, signed-out dashboard denial, closed admin navigation, generic recovery
responses, local sink delivery and immediate fragment removal. Automatic approval
review required human handoff for new-password entry/submission; the user completed
that step and its successful reset confirmation was observed. Remaining browser
results are recorded in the separate local browser evidence receipt.

Read-only Netlify site metadata and deploy metadata were checked today: the current
published deploy is `6a385b7fac8ea70008ef72d6`, locked=true, commit
`9e2bbb0cbae7de3eabc27da0bcea37bebed449a2`. The sanitized receipt is
`EPDG_PRODUCTION_LOCK_2026-10-24.json`. No push, PR update, merge, deploy, production
unlock, provider configuration change or production record access was performed.

Local browser success does not establish hosted synthetic isolation, HTTPS/proxy
acceptance, distributed abuse controls, durable recovery delivery or installed
worker upgrades. This is a local account-access milestone, not full learning
portal or production acceptance. Compensation: stop the managed local frontend
and backend, preserve test data, and keep the normal access hold. Do not publish.

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

## 2026-10-19 — Restore omitted PR #33 repository-level fixes

Read-only GitHub inspection confirmed remote head `454e1fa27c62e0e7d819a97c8dbd551b09b63138` on `agent-secure-access-and-dashboard-shells-1bcd`, with Agency and aggregate CI failing in run `39327003644`. The workflow, Agency lockfile, and this release log were absent from the remote PR diff and matched the runner's unmodified copies. Local snapshot `ccf75f8f4b94f8fc4559745a89a98dea974c5645` and its development branch were preserved; no checkout, commit, push, or history change was performed. Direct Git/PR mutation and terminal builds were prohibited in this environment. The job-log endpoint returned 403, so the actual missing-lock dependency failure was reproduced with the required local toolchain rather than inferred from an inaccessible log.

Restored the focused root workflow additions for clean separate normal/design output directories, both compiled-artifact verifications, and checksum/revision-tagged uploads, preserving all required jobs, npm ci, lint, tests, and smoke. Added exactly three missing Agency lock records: core/runtime `1.11.3` and core's nested wasi-threads `1.2.3`. Existing records, package versions/metadata, and package.json were unchanged. The WASM runtime peer requirements and exact core-to-threads dependency explained the missing resolutions; existing older exact nested versions were retained. No application or design code changed.

Using Node `22.23.1` and isolated npm `11.17.0`, reproduced the original Agency ci failure, then passed Agency ci (283 packages) and EPDG ci (471 packages). EPDG's 16 tests, lint, both no-emit TypeScript checks, artifact-dependent smoke, and the four-app manifest/lockfile parity check passed. Agency lint and both TypeScript checks passed; no Agency test script existed. Agency smoke failed because no dist/index.html was available. Fresh production/design builds and a fresh normal artifact check remained unexecuted because terminal builds were prohibited. npm's default sharp install-script warning was not overridden.

The existing design artifact verifier passed against seven files. Its JavaScript entry matched the live PR #33 design preview byte-for-byte, and provider metadata tied deploy `6ad68a2017faa794e8e4d0b0` to remote head `454e1fa27c62e0e7d819a97c8dbd551b09b63138`. This established existing design-artifact evidence, not a new build of the pending repository fixes. Browser/keyboard/mobile/request/installed-worker behavior and backend security acceptance remained pending. Production stayed locked at `9e2bbb0cbae7de3eabc27da0bcea37bebed449a2`.

Because prior platform submissions omitted root files, a reviewable patch containing exactly these three repository-level diffs was also prepared under epdg/docs for handoff. It was dry-run checked against a separate directory containing the exact remote baseline files. This did not apply or push the patch remotely. A repository-capable workflow must apply and submit those three files to the existing PR branch, confirm the remote diff, rerun CI, update the title/description, and convert the existing PR to draft. No new remote commit was claimed. Compensation is a focused revert of the CI changes while preserving a valid lockfile and the existing production access hold. Public content/designs, backend/provider configuration, database/storage permissions, and live records were preserved; no infrastructure or email action occurred. Phase 1 remained incomplete. Recommendation: **DO NOT PUBLISH YET**.

## 2026-10-19 — Repository-capable PR #33 validation

Applied the reviewed three-file handoff patch in a separate shallow checkout of `agent-secure-access-and-dashboard-shells-1bcd` at `3e990e7411a532f8f4f06488e760c661b34b0de6`. The original frontend development checkout and its work were preserved. The submission changes only the CI workflow, Agency lockfile, and this release log; portal application code, provider settings, database/storage access, and production publishing are unchanged.

Fresh local verification used Node `22.23.1` and npm `11.17.0`: Agency and EPDG deterministic installs passed; Agency production build/lint/smoke passed; EPDG normal build/lint/16 tests/smoke and the separate design-preview build passed. All four manifest/lockfile parity checks and diff whitespace checks passed. Structural lockfile comparison confirmed exactly three additions, with all 346 original package records and top-level metadata preserved. Default npm install-script protections were retained.

Independent inspection of the newly generated Windows artifacts verified all required normal hold states, design-marker exclusion from normal output, all four design views and the preview notice in design output, absence of preview PWA files/registration and sampled legacy API/authentication/credential markers. The committed verifier uses POSIX-style relative path checks; its unchanged execution is assigned to the Ubuntu CI job. The fresh local normal output contained 11 files; design output contained 7. These artifact checks do not establish browser, cache-upgrade, or backend authorization acceptance.

Remote commit, exact-head CI, and artifact uploads remain pending this submission; prior runs are not relabeled as verification of the repair. No merge or production publication is authorized. Backend session/invitation/recovery/owner/membership work remains incomplete. Compensating action is a focused forward correction or revert of the added CI wiring while preserving the valid lockfile and production access hold.

## 2026-10-28 — Add hosted synthetic frontend CI coverage

The required EPDG application job now cleans a third isolated output directory and runs the existing `npm run build:hosted-practice` with the reviewed build flag. That command builds the pinned synthetic hosted profile and runs its unchanged strict artifact verifier. GitHub's automatic `GITHUB_SHA` records the checked-out revision in `verification.json`, alongside each artifact file's SHA-256. A separate revision-named upload retains this output without combining it with the normal access-hold or disconnected design artifacts. All application/Edge jobs, deterministic installs, lint, tests, normal/design verifiers, smoke checks and aggregate requirements remain present.

Scope is limited to CI wiring and this release entry. No application, design, dependency, lockfile, build policy or artifact-verifier code changed. Local checks passed with Node `22.23.1` and npm `11.17.0`: workflow YAML syntax and preservation of all existing jobs/steps, fresh normal/design builds and strict artifact guards, lint, 88 tests, smoke, and the exact hosted build/verifier command. Exact-head GitHub CI and its artifact uploads remain pending the push and must pass independently. This entry makes no deployment, browser, cookie, backend isolation or production publication claim. Owner/admin controls remain closed. Compensation is a focused revert of these workflow additions while preserving existing required checks and the production access hold.

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

## 2026-10-28 — Reconcile portal PR #33 with approved company main

Merged approved frontend main `d7d169fcfa030ce39996472bb73b93c7df1f7074` into the existing portal branch at `f822784dd4d4c75358a83985f60810f7ecd918e0` using an ordinary two-parent merge. Missing shallow ancestry was fetched normally; history was not rewritten. The sole conflict was this journal, resolved by retaining both complete histories. The three public application trees, shared sources, scripts, approved legal/forms/schedule content, root manifests/configuration and company workflows exactly match main. The portal application tree exactly matches its prior reviewed source; no independent design or dependency edit was made.

The combined EPDG workflow retains main's root dependency install for company jobs and every per-app install, while preserving all normal/design/hosted builds, strict unchanged artifact verifiers, separate revision/checksum uploads, four required application jobs, Edge checks and aggregate gate. Both main and portal workflow structures were independently reviewed.

Fresh local combined-source verification passed all five Node `22.23.1`/npm `11.17.0` deterministic installs; 63 public regressions, shared lint, three approved website builds/lints/smokes and artifact-integrity checks; per-app test commands; portal normal/design/hosted builds, strict guards, lint, 88 tests and smoke; 31 Edge/migration regressions, mirrors, Deno `2.8.1` lint and both frozen checks. Main advanced from `2cba7a0` to `d7d169f` during verification with journal-only Figma documentation; exact tree comparison confirms all tested runtime, package and CI files are unchanged at the final merge target. These working-tree results do not assert the future merge SHA's GitHub CI or a hosted deployment. Fresh committed hosted output and exact-head CI are recorded separately after the merge commit.

This reconciliation changes only the PR branch. It does not merge to main, publish a site, change Netlify settings, configure credentials, submit forms or enable owner/admin controls. Any correction must preserve the approved public website trees and use a focused forward change; do not restore older public content or artifacts.

## 2026-10-28 — Stamp hosted Git builds with their actual revision

The separate hosted Netlify configuration now requires `COMMIT_REF` and maps it to the unchanged artifact verifier's `GITHUB_SHA` input for the build command. Netlify Git continuous deployment provides the former variable; leaving it unmapped would produce a null verification revision. Missing `COMMIT_REF` now stops before the build instead of emitting unstamped output. This changes only the hosted configuration and this journal; application source, dependencies, artifact-verifier policy, normal/design holds and all required CI jobs remain unchanged.

Official `@netlify/config` 25.2.6 offline resolution with the observed UI defaults (base `epdg`, base-relative paths, normal command and `dist` publish) selected `epdg/netlify.hosted-practice.toml` in production context, the guarded hosted command, `epdg/dist-hosted-practice`, its single generated secure header rule and two generated rewrites. No legacy TOML rule was inherited. Executing that exact Bash command locally with the verified public commit reference passed the strict hosted verifier and stamped the manifest correctly. The missing-reference case stopped before invoking npm. Both application JavaScript and the retirement worker match the reviewed `d234920` output byte-for-byte.

GitHub workflows for `d234920` passed all seven jobs. Its later standalone preview attempt stopped before upload because the files were packaged at the wrong folder level; it is not counted as deployment acceptance. The final package must retain root config/ignore sidecars and the twelve verified files inside `dist-hosted-practice/`. Fresh output at the new configuration commit and exact-head CI are recorded separately. No provider setting, deployment, runtime credential or privileged control was changed by this source correction.

## 2026-10-28 — Select hosted production from the standard portal configuration

The standard `epdg/netlify.toml`, discovered through the existing `epdg` site base, now selects the reviewed hosted synthetic build in production context. It requires `COMMIT_REF`, maps that exact revision into the artifact verifier, enables the isolated hosted profile, and publishes `dist-hosted-practice`. Ordinary `npm run build` retains the access hold; deploy previews retain the disconnected design entry and existing command.

Netlify headers and redirects are global TOML rules. Those legacy rules now emit from Vite into the actual ordinary/design output directory, preserving their order and values even with a custom output path. Hosted and local synthetic modes skip this generator. The hosted output keeps its existing generated-only no-store/security headers and pinned API proxy without inheriting legacy immutable caching. Application UI/runtime source, package scripts, dependencies, lockfiles, other applications and hosted profile generation are unchanged.

Local checks passed using Node `22.23.1` and npm `11.17.0`: deterministic portal install, ordinary access-hold build and strict verifier, disconnected design build with the CI custom output directory, the exact deploy-preview command, hosted build and strict verifier, lint, the existing test suite, and smoke. Offline official `@netlify/config` resolution with observed UI defaults automatically discovered the standard file for production, deploy-preview and branch-deploy, selecting the expected commands, publish paths, environment flag and generated HTTP rules. The missing-reference command stopped before npm. Hosted application JavaScript and the retirement worker match the reviewed artifact; Windows evidence uses the worker's unchanged canonical Git blob bytes to match Linux output.

Fresh committed-revision hosted output, exact-head GitHub checks and provider deployment acceptance are recorded separately. Production remains on the existing locked deployment while those gates run; owner/admin controls stay closed. Correct any defect with a focused forward source change and fresh verification before a new Git build/publication.
