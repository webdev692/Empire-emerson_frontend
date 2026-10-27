# Local learner program dashboard

This milestone adds individual learning records to the existing isolated local
portal. Production remains locked, its normal build still shows the access hold,
and the design preview stays disconnected. Owner/admin controls, invitations,
registration, profile editing and production learning permissions remain closed.

## What works locally

- Assigned synthetic programs, date ranges and lesson-based progress.
- Program detail, practice lesson content and the next available lesson.
- Explicit self-reported lesson completion, saved by the API and reloaded before
  displaying the resulting progress. Repeat requests are idempotent.
- Upcoming lessons and assignment briefs, sorted by their due dates; saved drafts
  remain upcoming and final submissions leave this list.
- Synthetic mentor feedback for the current enrollment, plus plain-text local
  resources that can be opened with mouse or keyboard.
- Loading, empty, unavailable and retry states. Records disappear on session
  invalidation; an assignment editor is retained in memory while hidden during
  temporary connection failures and account rechecks.

Your existing review account has two synthetic programs. A separate learner in
another synthetic school has different content for isolation testing. The private
preferred login alias continues to select the same existing test identity; it
does not grant owner/admin access or change the account's scope.

Progress counts completed **lessons only**. Text-only assignment submissions are
now available locally; see `SYNTHETIC_ASSIGNMENT_SUBMISSIONS.md`. Optional private
practice files are documented in `SYNTHETIC_ASSIGNMENT_UPLOADS.md`. Portfolio uploads,
grading, credit, qualifications and certificates remain unavailable. The program
card says “Lessons complete” when every lesson is done; this is self-reported
practice progress, not an assessed program award. Dates use the device time zone.

## Runtime and data boundary

Continue using `http://127.0.0.1:58080` and the existing synthetic runner documented
in `LOCAL_SYNTHETIC_FRONTEND.md`. Programs load directly from the loopback backend
at `http://127.0.0.1:58000/api/learner`. No fixture data is embedded in the frontend,
and no external resource URLs, cloud storage or email actions are added. Private
practice files use the local synthetic assignment API described in the upload guide.

The backend uses a new `synthetic_learning` schema with a separate local ledger.
Its explicit `learning-migrate` / `learning-seed` operator commands verify the
exact local database/instance/directory/checksums and do not run at startup.
Original application tables, historical migrations and security state are
preserved. Seed repeats preserve passwords, account state, memberships and saved
completions. See the backend's `docs/SYNTHETIC_LEARNER_DASHBOARD.md` for details.

The three routes are authenticated and enabled only for the exact local synthetic
environment and known learner fixtures:

| Route | Behavior |
| --- | --- |
| GET `/api/learner/dashboard` | Own current enrollments, upcoming work, feedback and resources |
| GET `/api/learner/programs/:id` | Own assigned program and activity details |
| POST `/api/learner/items/:id/complete` | Own lesson only; exact origin, JSON and session CSRF required |

Requests cannot select a user or institution. Each query checks the current
individual enrollment and institution membership. Completion INSERT and conflict
lookup both recheck current scope. Foreign/unassigned program or item identifiers
return 404; school accounts cannot use learner routes. Assignments cannot be marked
complete. The client also rejects another learner's response, invalid references
and inconsistent progress, and retains only documented display fields.

The runtime can read local learning content and insert only the necessary
completion identifiers, using a server-generated timestamp. It cannot edit
curriculum, enrollments, feedback, resources, historical completions or access
grants. The original seven learning tables, two additive assignment tables and
private attachment table
have RLS and no browser policies/grants. The existing
server BYPASSRLS role still relies on explicit server scope checks; it is never
provided to the browser.

## Verification and limits

Fresh checks and source fingerprints are in the milestone evidence receipt and
workspace `build-evidence/epdg-synthetic-2026-10-24/learner-dashboard` directory.
Browser tests use the existing user's session normally; no active HttpOnly token
was copied into a test file. Separate API tests sign in to a disposable synthetic
learner in memory and exercise isolation, invalid inputs, CSRF, empty enrollment,
completion idempotency and persistence across backend/database restart.

Local success does not establish hosted preview isolation, production role
policies, real educational-record access, production deployment readiness or
installed-worker upgrades. No code has been pushed or published for this milestone.
To stop reviewing, use the existing managed frontend/backend stop commands and
retain synthetic data. Corrections must be forward-only; do not replay legacy
migrations, reset passwords automatically or reconnect the legacy bearer router.
