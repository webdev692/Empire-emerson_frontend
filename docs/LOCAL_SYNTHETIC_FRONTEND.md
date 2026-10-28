# Connected local synthetic portal

This integration is for local development only. The normal production build
still renders `PortalAccessHold`; design-preview remains disconnected. No
production provider settings, data, access grants or published files change.
Owner/admin controls, invitations, registration and profile editing stay closed.

The local portal connects learner programs, practice lessons, saved lesson
progress and assignment submissions. See `SYNTHETIC_LEARNER_DASHBOARD.md`
and `SYNTHETIC_ASSIGNMENT_SUBMISSIONS.md`, with private practice files documented
in `SYNTHETIC_ASSIGNMENT_UPLOADS.md`. Earlier milestone evidence remains
historical at its recorded source fingerprint.

The later mentor review milestone connects explicit same-school synthetic mentor
queues, private feedback drafts, one-time publication and learner-visible
published feedback. See `SYNTHETIC_MENTOR_REVIEW.md` and
`MENTOR_REVIEW_EVIDENCE_2026-10-24.json`. Mentor browser acceptance passed,
including private draft save/reload, explicit publication, learner visibility,
offline recovery, mobile layout and keyboard focus. Prior upload evidence is
preserved at its historical fingerprint.

The revision/resubmission candidate adds explicit new practice attempts after
published feedback, immutable earlier receipts/files/feedback, separate current
feedback and mentor attempt labels. See
[the revision guide](SYNTHETIC_ASSIGNMENT_REVISIONS.md) and
[the current candidate receipt](ASSIGNMENT_REVISIONS_EVIDENCE_2026-10-24.json).
Its 173 combined automated tests, 72 fresh live groups and browser acceptance
passed. The five-attempt cap is only a local synthetic practice setting,
not an approved production HR or education policy. No real HR records/accounts
are imported and production remains locked.

## Start and stop

Use Node 22.23.1 and npm 11.17.0 from the workspace `.tools` directory. From the
backend sibling, run its existing `manage.cjs status` / `start` workflow first.
Do not substitute production endpoints or load production environment files.
Then from this repository's `epdg` directory, with the pinned Node on PATH:

```text
npm run synthetic:start
npm run synthetic:status
npm run synthetic:stop
```

The app is available only at `http://127.0.0.1:58080`. Backend traffic goes
directly to `http://127.0.0.1:58000/api`, exercising real browser CORS/cookies.
Mail is captured in the authenticated local sink at `http://127.0.0.1:58025`.
The frontend launcher reads no credentials. It uses the backend's excluded,
user-restricted `.local-synthetic` directory for process metadata and logs.

Use authorized `.invalid` synthetic accounts only. Credential values remain in
the private runtime or with their human test owner, never in source, examples,
screenshots, chat, URLs or logs. A human-owned password reset can change a fixture's
password: the scripted API suite's shared fixture credential may then no longer
apply to that account. Do not silently reset a human-managed credential to make
the suite pass; record the test state and arrange the next fixture lifecycle.

The user may configure a private preferred login alias in the excluded
`.local-synthetic/frontend-login-alias.json` file. It contains only `loginEmail`
and `fixtureEmail`; the target is restricted to the existing learner A fixture.
Only the local dev configuration reads this file. The form prefills the preferred
email and explains the alias. Login/recovery requests translate that exact email
to the same `.invalid` identity before contacting the API. Passwords, database
identity, memberships and permissions are unchanged; recovery stays in Mailpit.
Unmatched real addresses are rejected. Normal/design builds do not read or emit
the alias. Do not commit the private file or include its value in build receipts.

## Available flows

- Login, cookie-backed session restoration and logout with server CSRF checks.
- Generic recovery requests, fragment-only reset links, user-completed password
  reset and reauthentication; password change with current-password verification.
- Dashboard and read-only account fields from the current session response.
- Server-derived own membership references, empty feature permissions and closed
  privileged controls. Membership is never interpreted as a feature permission.
- Synthetic learner program/lesson views and self-reported completion, documented
  in the learner dashboard guide; assignment draft, review, final submission and
  read-only receipt flows are documented in the assignment guide. Private practice
  files are supported within those assignments. Reporting, portfolio uploads,
  portfolios, certificates, invitations and privileged operations stay unavailable.
- A candidate revision flow copies the last submitted answer into a new draft
  after its published feedback, with no copied files; earlier submitted attempts
  remain read-only. Per-attempt file quotas and the five-attempt practice cap are
  local-only. Current backend/browser acceptance is tracked separately above.
- Explicitly mapped school fixture accounts can review submitted learner work,
  save private feedback drafts and publish feedback once; the owning learner
  sees only published comments through their current assignment/receipt scope.
  This local test access does not create production mentor permissions or grades.

Session identifiers stay in HttpOnly cookies. The client stores no authentication
or account state in localStorage/sessionStorage. CSRF and recovery tokens stay in
memory. The entry captures a reset fragment once before React mounts and removes
the query/fragment from that history entry. Reloading a reset page needs a fresh
link. Session checks hide account details on failure and tab return. An assignment
editor retains unsaved text in memory while hidden during temporary connection
failures or access checks; the same session and scope must be verified before
showing it again. Invalidated sessions clear the editor. Public password forms
retain typed input when returning from a password manager. Absolute expiry clears
the displayed account. Idle revocation is enforced by the backend on requests;
the frontend does not claim a precise idle countdown.

On a logout network failure, account details disappear but the page explicitly
reports that server revocation is unconfirmed and provides a retry. It does not
claim sign-out succeeded. Passwords are removed from form fields before awaiting
requests and are never retained in React state.

## Isolation and verification

`synthetic-local` mode is restricted to a fixed loopback development server;
build and preview commands reject this mode. Host/origin/port/proxy/HMR changes
that widen the boundary fail closed. The document omits production canonical
metadata, remote fonts, analytics and PWA registration. CSP permits only local
assets, the pinned backend and local HMR. `VITE_` variables are not exposed.
Private sibling runtime files cannot be served through Vite. Publishable artifact
guards reject synthetic entry/backend markers.

Run `npm test`, `npm run lint`, normal/design builds, the existing two artifact
verifiers and `npm run smoke`. Client tests exercise cookie/CSRF request contracts,
strict synthetic response parsing, redacted errors, recovery shape and UTF-8
password bounds. Mode tests exercise Vite configuration/build rejection and
host/CORS/environment guards; live HTTP checks also confirm listener and private
filesystem boundaries. Browser acceptance is documented separately
with exact source fingerprints; local working changes are uncommitted.

This local mode has no service worker. It cannot establish hosted preview access,
HTTPS/proxy behavior, distributed throttling, durable mail delivery, installed
worker upgrades or production acceptance. Do not publish this candidate.

## Compensation

Stop the frontend using `synthetic:stop` and the backend using its documented stop
command. The launcher verifies process identity before stopping it. Retain local
synthetic data for review. Normal/design entrypoints continue their existing
behavior. Do not roll back to legacy bearer authentication or change production.
