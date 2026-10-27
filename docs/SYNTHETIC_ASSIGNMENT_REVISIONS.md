# Local synthetic assignment revisions and resubmissions

This milestone extends the local synthetic assignment workflow after published
mentor feedback. Production stays locked, normal builds retain the access hold,
and owner/admin controls remain closed. Frontend, backend and browser acceptance
passed against the recorded working-tree fingerprints. This document does not
establish production readiness.

## Scope and practice limits

The portal handles learning after onboarding: programs, progress, submissions,
feedback and revised attempts. Applicant records and onboarding belong to the
CRM. This milestone imports no real HR data, accounts, employee records, mailbox
routes or contacts. Existing fictional `.invalid` accounts and explicit synthetic
program assignments remain the access boundary. A preferred private login alias
does not create another identity or grant administrative access.

The five-attempt cap is an engineering bound for this local synthetic practice
environment only. Historical HR planning notes from August 31 mention a single
revision; those notes do not establish approved production portal policy. The
practice cap does not replace those notes or authorize production revision rules.
Production policy remains a separate unresolved decision.

Each practice attempt allows three active files and six uploaded file records in
total, including removed files. The existing nonempty TXT/PDF/PNG/JPEG and 1 MiB
per-file limits remain. Removing a file does not reset that attempt's quota.
Starting a new attempt does not move, modify or remove an earlier attempt's files.

## Learner workflow

1. Open the latest submitted assignment and read its published mentor feedback.
   Private mentor drafts are never shown to the learner.
2. Use **Check revision availability** if feedback was published after the page
   loaded. The server-provided `can_start_revision` value controls the action.
   Feedback on an earlier receipt cannot authorize another revision of a newer
   attempt that has not yet received published feedback.
3. Choose **Start a revision**. The request binds the expected latest receipt and
   saved revision. The new draft copies the preceding frozen answer, advances the
   attempt number and saved revision, and contains no copied files. Choose and
   explicitly upload any practice files wanted in the new attempt.
4. Edit and save the text draft, manage files, and review the saved answer and
   exact saved file set. No automatic save or upload occurs.
5. Submit the new attempt explicitly. Its new receipt freezes that answer and
   file set. Earlier receipts and published feedback stay read-only.

The UI labels the current practice attempt separately from the saved revision.
The saved revision advances across text/file changes and attempt creation; it is
an optimistic concurrency version, not a grade or attempt count.

**Earlier submitted attempts** shows only lower attempt numbers, since the
current submitted receipt is already displayed in the main section. Expand an
attempt to read its frozen answer, receipt, submitted files and published
feedback. Feedback is displayed with its original attempt; current feedback is
requested with the current receipt ID. A new draft has no current receipt or
current published feedback. Earlier feedback remains available through history.

Mentor queue cards and detail records label each attempt. A new receipt is a new
review target; it does not reopen or overwrite previously published feedback.
No grades, credit, outcomes, certificates, enrollment administration or owner/admin
powers are added.

## Local API contract

All requests use the fixed local backend, cookie sessions and current account/
program scope. Mutations retain the exact Origin, JSON/custom-header and
session-bound CSRF checks. A client role label chooses presentation only; the
server authorizes explicit synthetic learner and mentor assignments.

- Current `submission` adds `attempt_number`, `previous_receipt_id` and
  authoritative `can_start_revision`.
- `POST /api/learner/assignments/:itemId/start-revision` accepts only
  `expected_receipt_id` and `expected_revision`. Eligibility requires published
  feedback on the latest receipt, no current editable attempt and room under the
  local practice cap. A start copies text, copies no files and advances the saved
  revision once. An uncertain response must be resolved by reading saved status.
- `GET /api/learner/assignments/:itemId/attempts` returns up to five submitted
  snapshots in attempt order, scoped to the current learner, item and program.
  Each snapshot contains its receipt, frozen answer/files and only its published
  feedback. Draft mentor comments are excluded.
- Historical downloads use the fixed receipt-scoped route
  `/api/learner/assignments/:itemId/attempts/:receiptId/attachments/:attachmentId/download`.
  The client validates metadata, byte count and SHA-256 before creating a
  temporary download URL. No public URL or inline file preview is created.

The contract preserves earlier receipts and files across new drafts. It does not
authorize production migrations or reuse of hosted production credentials.
Files are not scanned for malware. Backend application, migration/ledger, grants,
scope-revocation, concurrency and restart acceptance must be recorded from the
actual backend validation; frontend mock tests do not establish those results.

## Offline, stale and uncertain state

The editor and revision-start recovery controls remain in memory while hidden
during temporary connection failures or access rechecks. The same identity,
session and scope must be verified before records are revealed again. A denied
session or assignment scope clears/hides the relevant records. No answers,
feedback, files or authentication state are persisted in browser storage.

An ambiguous start/save/submit or a conflict keeps typed text and requires an
explicit saved-status reload. The submitted view provides that recovery action,
so a lost start response cannot leave the learner with only a disabled button.
If history discovers another browser already submitted the same or a newer
attempt, further writes pause until the learner reloads current saved status.
The reload action states that unsaved text will be replaced.

History refreshes retain the current form. Downloads use the existing single
assignment busy lock and abort controller. Navigation is disabled during requests;
scope denial aborts pending downloads and clears pending file selections.
Temporary object URLs are revoked after use and on unmount. File selections are
not durable and may need to be chosen again after a reload.

## Recorded local validation

Frontend verification completed at `2026-10-24T16:07:15.009Z`, using Node
`22.23.1` and npm `11.17.0`, on base commit
`2397c6e276e8ce111b70148333cec2682a4d4166` with uncommitted working changes.
All 63 frontend tests passed, with no failures or skips. Full lint reported zero
errors/warnings. Normal/design builds, both compiled artifact verifiers, targeted
smoke and Git diff checks passed. Scans checked 20 artifact files for selected
learner/upload/mentor/revision markers, the private login alias and seven
configured runtime secret values without recording those private values.

The 28-file frontend fingerprint is:

```text
544ca927c1a7efabfbbfbd4fc3590d0d6ac1ab6e753bde8a99030a93168db5f4
```

See [the combined receipt](ASSIGNMENT_REVISIONS_EVIDENCE_2026-10-24.json) and
workspace `build-evidence/epdg-synthetic-2026-10-24/revisions-resubmissions/frontend`.
The source fingerprint excludes this documentation; prior mentor/upload evidence
remains historical at its recorded fingerprint. Backend validation passed 101
core tests and nine root tests, for 173 automated tests including the frontend.
Fresh live checks passed 13 revision, 17 mentor, 17 upload, 15 text-submission and
ten learner groups: 72 total, including a full restart in the revision suite.
The initial learner regression hit the normal login throttle; the unchanged
suite passed after its window expired. No limiter was changed or service restarted
to bypass that protection. Independent review found no blocker, confirmed the
125-file backend application fingerprint and compiled outputs, all six ledgers,
19 security/learning tables with RLS, zero browser grants and original 50-table
metadata parity. Reviewed local migration 006 applied with SHA-256
`cfa51624a3c7e8e3b552f12cb5dc6c2a5769fa78fd64258da4e62151f6c92b0b`;
all 37 frozen old rows had the same before/after digest. Root's read-only Netlify
inspection at `2026-10-24T16:10:45Z` reported production still locked at the
original published commit.

Browser acceptance covered explicit revision start, copied text without copied
files, 234-character offline draft retention/recheck, draft and file persistence,
mobile keyboard review/submission, immutable earlier file downloads and separate
mentor queue entries. Attempt two created a new receipt and did not inherit
feedback. The new receipt survived reload and remained read-only. After all
regressions, a fresh normal synthetic mentor sign-in reopened attempt two with
blank feedback awaiting review. No human learner password was read or changed,
and no session cookie was exported. Browser and screenshot evidence is in the
combined receipt. The final backend application fingerprint is
`15b3fefb5a827d37d1e86a35c8da6064aeb2cc5551d3618d31532f92d7f9d0cc`.

## Compensation

Stop only the managed local frontend/backend services using their documented
identity-checked launchers. Retain synthetic drafts, receipts, files and feedback
for review. Database corrections must be reviewed forward changes, preserving
already applied migration history. Do not delete attempts, overwrite frozen
receipts, point the frontend at production, restore legacy bearer authentication,
unlock publication or deploy this candidate. **DO NOT PUBLISH YET.**
