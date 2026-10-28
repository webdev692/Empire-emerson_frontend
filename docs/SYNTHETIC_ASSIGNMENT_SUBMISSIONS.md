# Local synthetic learner assignment submissions

The following milestone now also supports optional private practice files. See
`SYNTHETIC_ASSIGNMENT_UPLOADS.md` for current file limits and verification; the
text-only evidence below remains historical at its recorded source fingerprint.

Learners can save a fictional text answer, review the exact saved version, then
submit it once and return to a read-only receipt. This works only in the existing
loopback synthetic environment at `http://127.0.0.1:58080`. Production stays locked;
the normal build retains its access hold and the design preview stays disconnected.
Owner/admin controls, invitations, grading, credit and certificates remain
closed. Assignment submission does not change lesson progress.

## Review workflow

Open a program or an upcoming assignment, enter practice text, and choose **Save
draft**. Saving is explicit: unsaved text does not survive a page reload or leaving
the program. A successfully saved draft does survive reloads. Answers are limited
to 4,000 JavaScript characters and 12,000 UTF-8 bytes; malformed Unicode and NUL
are rejected. A blank draft can be saved but cannot be submitted.

Choose **Review saved answer**, inspect the saved copy, then **Submit assignment**.
The final answer becomes read-only with a database-generated receipt reference,
timestamp and saved revision. Repeated final requests at that revision return the
same receipt. A stale draft produces a conflict instead of overwriting another
save. The UI keeps the typed answer and requires an explicit saved-status reload
before another attempt when a save or submission cannot be confirmed. That reload
clearly warns that it will replace unsaved form text.

An offline event hides account details and keeps unsaved assignment text only in
this tab's memory. Reconnecting requires **Try again** and a successful account and
program check. Tab return also rechecks access while retaining the hidden editor.
A changed session identity, CSRF binding or membership scope clears the old editor;
401/absolute expiry removes the session. No answer or token is written to browser
storage. Definite access denials hide the assignment; transient server failures
offer retry without treating the answer as saved.

## Backend contract and isolation

`GET /api/learner/assignments/:id/submission` loads only the current learner's
answer. `POST .../:id/draft` sends the text and expected revision; `POST
.../:id/submit` sends only the saved revision. Cookie credentials, exact Origin,
JSON, custom request header and session CSRF are required. Requests cannot select
a learner, school, role or receipt. The client checks the synthetic environment,
current learner, program/item identities and coherent response state before
displaying success. Program/dashboard collections contain status only, not answers.

The sibling backend applies reviewed forward migrations 002/003 after unchanged
learning migration 001. Nine learning tables have RLS with no browser grants or
policies. Server scope checks enforce active individual enrollment and school
membership on reads and writes. Transaction locks serialize reads/saves/submits;
revision checks and database guards protect immutable final receipts. See the
backend's `docs/SYNTHETIC_ASSIGNMENT_SUBMISSIONS.md` for grants, migration hashes,
runtime identity checks and compensating actions. No startup migration is added.

## Current verification

October 24 local working-tree results: 41 frontend tests, 82 backend core tests and
nine backend root tests passed. Frontend lint, normal/design builds, both artifact
verifiers and smoke passed. Backend build and lint passed with 161 existing lint
warnings. Sixteen live assignment scenario groups and ten learner regression
groups passed, including scoped denial, CSRF, concurrent draft saves, idempotent
submission, immutable receipts and full backend/database restart persistence.
Original 50-table metadata parity had zero differences.

Browser acceptance used the existing human-managed learner A session normally:
unsaved offline recovery, saved draft persistence, revision-two save, keyboard
review/edit/submit, mobile layout, final receipt persistence and unchanged overall
lesson progress (3/5, 60%). No active cookie was exported and no human password
was read or changed. A synthetic submitted answer is retained for review. The
second program's assignment remains available for further practice.

Source fingerprints and individual checks are recorded in
`ASSIGNMENT_SUBMISSIONS_EVIDENCE_2026-10-24.json` and the workspace's
`build-evidence/epdg-synthetic-2026-10-24/assignment-submissions` directory. This is
uncommitted local evidence, not remote CI or hosted-production acceptance. Normal
and design artifacts exclude the synthetic assignment entry, private alias and
seven configured runtime secrets. CSS/asset hashes changed from the earlier
learner build; the per-file deltas are documented and no byte-identical claim is
made against that historical build.

Netlify's read-only October 24 observation confirmed the same locked, ready
production deploy and published commit. No commit, push, PR, deployment, production
unlock or hosted configuration change was performed. Stop the managed local
services to suspend review; preserve drafts and receipts and correct database
issues with reviewed forward changes.
