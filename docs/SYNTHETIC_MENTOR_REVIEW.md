# Local synthetic mentor review and learner feedback

The connected local portal now supports reviewing submitted learner work,
saving private feedback drafts, explicitly publishing feedback once and showing
published feedback to the matching learner. This is a synthetic test milestone;
production publication stays locked and owner/admin controls remain closed.
No account, password, role, permission or enrollment is created by the frontend.

## Trying the flow

Use only the existing authorized local fixtures at
`http://127.0.0.1:58080`. The existing school A/B test accounts act as mentors
through explicit same-school enrollment mappings. They retain their legacy
school role and empty permissions; no role name alone grants review access.
The private preferred learner login alias still resolves to the existing learner
fixture and does not create a mentor/admin identity. Keep all credentials in
their private runtime or with their human test owner.

The mentor queue contains only submitted assignment receipts within current
authorized scope. Open a review to read the frozen answer and saved file list.
Downloads verify file size and SHA-256 and use protected attachment responses;
there is no public URL or inline preview. Removed files are unavailable.

Write a fictional, constructive plain-text comment and choose **Save private
draft**. The draft remains private. After saving, review the exact saved comment
and choose **Publish feedback** explicitly. Publishing makes the comment visible
to the learner and freezes it. Blank drafts can be saved, but publication needs
a nonblank saved comment. Comments are limited to 4000 JavaScript characters
and 12000 UTF-8 bytes. There are no scores, pass/fail outcomes, grades, credit,
awards, reopening or learner administration controls.

Learners open their matching submitted assignment and use **Refresh feedback**
to read published comments. Private mentor drafts never appear there or in the
learner dashboard. Published rows also appear in dashboard feedback with the
assignment title; earlier clearly synthetic example feedback remains preserved.

## Access, revisions and uncertain requests

The backend rechecks current mentor identity/account, own-school membership,
explicit mentor mapping, learner eligibility/membership/enrollment and approved
school for every mentor read, save, publish and download. Foreign, unsubmitted,
withdrawn or unauthorized records are hidden. Client selectors cannot broaden
scope. Session permissions remain empty and privileged controls false.

Review drafts use expected revisions. Concurrent saves have one winner; stale
requests cannot overwrite newer work. Published feedback is immutable, and
same-revision publish retries return the original result. An uncertain publish
must be resolved by reloading saved review status before retrying.

The frontend keeps typed draft text in memory during temporary failures and
access rechecks, while hiding records until the current scope is confirmed.
Access denial removes the record view. Unsaved comments are lost when leaving
the review or reloading the page; navigation/mutation locks prevent overlapping
actions. Download URLs are temporary and revoked when no longer needed.

For this explicitly authorized synthetic test, published learner feedback
survives a later mentor mapping/account revocation. Future mentor access closes,
while the learner can still read the immutable published comment through their
own current enrollment/membership and receipt. Learner withdrawal hides the
history until their own current scope is restored. This is a local test policy,
not a production mentor permission decision.

## Backend and isolation

The sibling backend's reviewed forward migration 005 adds explicit mentor
mappings, review drafts and append-only published feedback. All thirteen
learning tables have RLS with zero browser policies/grants. Existing submitted
answers/files and applied migration hashes 001–004 are unchanged. A guarded
operator seed adds only three mappings for the two existing school fixtures;
repeating it adds none and never reactivates an existing inactive mapping.
Startup never migrates or seeds.

Mapping revocation serializes against shared transaction locks held by mentor
operations, followed by current scope rechecks. Runtime mappings are read-only.
Feedback IDs, timestamps and synthetic mentor labels come from database guards;
the client cannot forge them. Cookie sessions, CSRF and exact local Origin
requirements remain enforced. Normal builds retain the access hold, and the
design preview remains disconnected. Multer stays pinned to the reviewed 2.5.0
release; no dependency change is part of this mentor milestone.

## Recorded local verification

Recorded checks passed 56 frontend tests, 97 backend core tests and nine root
tests: 162 automated tests total, with no failures or skips. Frontend lint,
normal/design builds, both artifact verifiers, smoke and isolation checks
passed; backend build/lint passed with zero errors and the existing 161 lint
warnings. Independent live checks passed 18 mentor groups including a full
backend/database restart, 17 upload groups, 15 text-submission groups and ten
learner groups: 60 groups total. Original 50-table metadata parity had zero
differences and all five reviewed learning ledgers matched.

Browser acceptance passed against the same application fingerprints. The learner
view hid private drafts and displayed published feedback on the matching receipt
and dashboard. The mentor view showed only assigned submissions, verified a PDF
download, saved a private draft across reload, and published read-only feedback.
At 390-pixel mobile width, review/edit/publish keyboard focus and layout passed.
Unsaved feedback remained hidden offline and returned after current access was
verified. An initial already-running development page lost synthetic text;
reloading the current unchanged code resolved that test. A stale hot-reloaded
handler is likely, but not proven; the separate evidence preserves both results.

The learner was signed out normally before signing in through the existing
synthetic school-A fixture. No human learner password was read or changed, and
no session cookie was exported. The browser is left in that mentor workspace
with a separate text-only SYNTHETIC Upload Practice receipt awaiting review and
a blank feedback editor. The private preferred learner login alias is unchanged.

A read-only Netlify check at `2026-10-24T15:46:43.344Z` confirmed the published
deployment is still locked at commit
`9e2bbb0cbae7de3eabc27da0bcea37bebed449a2`. Local acceptance does not authorize
production publishing. Owner/admin controls remain closed.

See `MENTOR_REVIEW_EVIDENCE_2026-10-24.json`, the sibling backend guide/evidence
and workspace `build-evidence/epdg-synthetic-2026-10-24/mentor-reviews` (plural).
Earlier upload evidence remains unchanged and historical at its fingerprint.
Existing dependency-audit findings remain outside this focused milestone. File
signature checks are not malware scanning. No hosted or production acceptance
is claimed.

## Compensation

Stop only the documented owned local services, or explicitly revoke a synthetic
mentor mapping, retaining additive drafts, files and published feedback. Correct
schema/source through reviewed forward changes. Do not delete published history,
rewrite applied checksums, restore legacy bearer authentication or unlock
production as a rollback. All work remains local and uncommitted.
