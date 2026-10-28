# Local synthetic CRM-to-EPDG onboarding handoff

This candidate tests a fictional onboarding clearance reaching EPDG and governing
one dedicated practice program. Production stays locked and owner/admin controls
stay closed. Changes are local and uncommitted; this is not production acceptance.

## Application boundary

Emerson CRM owns applicants, resumes, identity reconciliation and onboarding.
Real HR records remain in private review staging until the exact CRM real-data
target, HR permissions and individual clearance are verified. EPDG owns learning,
submissions, revisions and mentor feedback after current onboarding clearance.
A CRM stage label, staff training assignment or mailbox route grants no learner
access. This candidate does not implement or claim a deployed CRM exporter.

The rehearsal uses existing `.invalid` learner/mentor fixtures and the dedicated
**SYNTHETIC CRM Onboarding Practice** program. Other practice programs remain
separate. It creates no real accounts, passwords, invitations or staff membership.
The server-side producer, operator seed and receiver are local synthetic tools;
they contain no audited HR records and perform no Workspace export.

## Learner interface

The learner dashboard adds **Onboarding handoff** with four verified states:

- **Awaiting synthetic handoff:** no handoff received.
- **Ready for practice learning:** current synthetic clearance makes the dedicated
  practice program available.
- **Practice onboarding on hold:** the dedicated program is unavailable.
- **Practice enrollment withdrawn:** the dedicated program is unavailable;
  earlier learning evidence is preserved.

**Refresh onboarding status** rechecks the session, program summary and handoff
summary together. A changed session hides the previous summary until verified.
Authentication, disabled-feature, missing-readiness and connection errors remain
errors; they never become an awaiting or denied-clearance result. Program access
is enforced by the backend, including direct activity requests. Live and browser
checks verified the held, ready and withdrawn transitions for the dedicated
program while existing practice programs stayed available.

## Contracts and isolation

`GET /api/learner/onboarding` uses the current cookie session and accepts no
learner selector. It returns `success`, `environment: synthetic-local`, the own
numeric `learner_id`, canonical UTC `generated_at`,
`privileged_controls_available: false`, and `onboarding` containing only status,
program ID/title and update time. `not_received` requires all three program/update
fields to be null; the other states require a synthetic title, UUID and timestamp.
The frontend retains only those documented fields. It receives no CRM person,
application, reviewer or decision IDs, evidence, emails or signing material.

The internal `POST /internal/crm/onboarding-handoffs` receiver uses a separate
server signature, bounded request freshness, retained nonces, immutable events
and decision versions. Synthetic identity/program mappings are operator seeded;
the receiver does not create accounts or expand roles. Local feature enablement
and reviewed database readiness are required. Exact request fields and signing
rules live in the backend contract rather than the learner interface.

See [the frontend parser](../epdg/src/synthetic/onboardingClient.ts),
[backend handoff documentation](../../THE-EMERSON-EMPIRE_Backend/docs/SYNTHETIC_CRM_ONBOARDING_HANDOFF.md),
[receiver contract](../../THE-EMERSON-EMPIRE_Backend/epdg-backend-core/src/handoff/contract.ts)
and [local seed](../../THE-EMERSON-EMPIRE_Backend/epdg-backend-core/scripts/local-synthetic/handoff-seed.cjs).

## Recorded local validation

Recorded automated results total **201 passed tests**: 71 frontend, 121 backend
core and nine backend-root tests. The final backend build, lint and all 121 core
tests passed again with schema/ACL/guard readiness included in startup and health
checks. These are local synthetic results; production acceptance remains closed.

Reviewed migration 007 applied only to the identity-checked loopback synthetic
database at `2026-10-24T18:14:39.580Z`, with SHA-256
`2f32810a5956999693d98e3ea9f4ca200da53ae6530da3fb1e08c51ff54a75ca`.
The seed inserted seven dedicated fixture rows. All 76 pre-existing immutable
rows retained digest
`7ec347495937fe66af5070c611ce90d80ff01f5a748d9273aa013f9176f4e9a2`;
accounts, passwords, memberships and roles were preserved.

All **23 live handoff groups passed**. The first 17 included unsigned/wrong-key/stale request
rejection, nonce replay and decision-version conflicts, lock-serialized
withdrawal, direct-SQL scope enforcement, assignment files and published feedback,
newer clearance restoring preserved evidence, durable controlled-restart checks
and feature-disabled fail-closed behavior. The API harness returned its fixture
to held before the separate browser run.

Six supplemental groups verified concurrent same-version decisions, exact-event
retries with independent nonces, reused-nonce rollback, decision-identity
collision rollback, expired/future source decisions despite fresh transport and
oversized signed-body rejection before ledger mutation.

Repeating reviewed setup applied zero migrations and inserted zero rows, retaining
all 112 immutable rows present at that later checkpoint. Sessions, decision/nonce
history, accounts, credentials, memberships, enrollments and roles stayed
unchanged. Independent catalog review confirmed the original 50-table metadata
was unchanged, with 22 security/learning/handoff tables using RLS, zero browser
grants and no handoff security-definer functions.

Browser acceptance verified held → ready → withdrawn, keyboard status refresh,
390px viewport layout without horizontal overflow and a save from an already-open
editor returning 404 after withdrawal. Refresh showed the withdrawal and removed
the dedicated program. Sign-out and viewport reset were completed. The browser
checks used fictional accounts; no human learner password or session cookie was
exported. See [ready on mobile](../../../build-evidence/epdg-synthetic-2026-10-24/crm-onboarding-handoff/browser/ready-mobile.png)
and [withdrawn on desktop](../../../build-evidence/epdg-synthetic-2026-10-24/crm-onboarding-handoff/browser/withdrawn-desktop.png).

All five wider regression suites passed **71 live groups**: learner 10, text
submissions 15, uploads 17, revisions 12 and mentor review 17. Together with the
23 new handoff groups, this is **94 passed live groups**. The mentor suite ran
after normal authentication-window expiry and passed without 429 responses,
authentication changes or a restart. No limiter was relaxed or reset to run the
regressions.

Frontend verification at `2026-10-24T18:06:38.663Z` passed all 71 tests, full lint,
both no-emit TypeScript checks, fresh normal/design builds, both compiled artifact
verifiers, smoke and whitespace checks. The 32-file working-tree fingerprint is
`6c5751f5f56bc5d3c61177f73cbf976b35d14c9c0c442bf8795aa287a1ac9de1`
on base `2397c6e276e8ce111b70148333cec2682a4d4166`. Source stayed unchanged during
verification. Both publishable outputs matched their prior artifacts byte for
byte, excluding the verification receipts.

The final isolation scan at `2026-10-24T18:14:49.240Z` confirmed unchanged source
and build hashes, and scanned 20 artifact files for synthetic onboarding markers,
the private alias and all eight current private runtime values, including the
new signing key. Values and value hashes were not recorded. These are selected
marker/current-value checks, not comprehensive secret detection.

Evidence is in workspace
[`build-evidence/epdg-synthetic-2026-10-24/crm-onboarding-handoff`](../../../build-evidence/epdg-synthetic-2026-10-24/crm-onboarding-handoff),
including [frontend verification](../../../build-evidence/epdg-synthetic-2026-10-24/crm-onboarding-handoff/frontend/verification.json),
[final compiled isolation](../../../build-evidence/epdg-synthetic-2026-10-24/crm-onboarding-handoff/frontend/compiled-isolation-final.json),
[backend verification](../../../build-evidence/epdg-synthetic-2026-10-24/crm-onboarding-handoff/backend/backend-agent-verification.json),
[live handoff receipt](../../../build-evidence/epdg-synthetic-2026-10-24/crm-onboarding-handoff/backend/handoff-verification.json),
[supplemental handoff checks](../../../build-evidence/epdg-synthetic-2026-10-24/crm-onboarding-handoff/backend/handoff-edge-verification.json),
[repeat setup](../../../build-evidence/epdg-synthetic-2026-10-24/crm-onboarding-handoff/backend/setup-repeat.json),
[independent catalog review](../../../build-evidence/epdg-synthetic-2026-10-24/crm-onboarding-handoff/backend/independent-catalog-review.json)
and [regression checkpoint](../../../build-evidence/epdg-synthetic-2026-10-24/crm-onboarding-handoff/regressions/regression-summary.json).
Source fingerprints, artifact manifests, logs and browser screenshots remain
separate inspectable evidence. The regression receipt records all five completed
suites; final managed runtime health observation is recorded separately.

## Compensation and release gate

Final controlled restart activated the tested health validation. Read-only checks
at `2026-10-24T18:36:45.813Z` verified the local database, backend, frontend and mail
sink. The dedicated program remained held at decision version 9 and inaccessible;
the browser's denied draft was absent, and all four existing fictional accounts
remained. See workspace `crm-onboarding-handoff/final-runtime.json` within the
evidence directory linked above. No production or privileged control was opened.

Retain additive learning receipts and handoff history. Disable the local handoff
feature through the managed configuration or stop only identity-checked local
services; do not reset accounts or erase records. Database corrections require
reviewed forward changes. No deployment, merge, real HR import or production
unlock is authorized. **DO NOT PUBLISH YET.**
