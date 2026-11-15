# Held portal release candidate

This extends the existing portal and administrator workspace. The normal build
still renders `PortalAccessHold`; neither hosted synthetic profile is replaced.
No provider access protection, live routing, database, mailbox or release setting
is changed by this code. Building an artifact does not authorize deployment.

## Explicit build boundary

`npm run build:portal-release` fails unless all four non-secret inputs are set:

- `EPDG_PORTAL_RELEASE_BUILD`: explicit candidate-build acknowledgement.
- `EPDG_PORTAL_RELEASE_ORIGIN`: the reviewed exact HTTPS portal origin.
- `EPDG_PORTAL_RELEASE_API_ORIGIN`: the reviewed exact HTTPS Railway API origin.
- `EPDG_PORTAL_TARGET_REVIEW`: a non-secret target-review reference.

The validator documents the accepted acknowledgement. Do not place credentials,
personal records or private review evidence in these inputs. Output is isolated
in `dist-portal-release` and marked `releaseAuthorized: false`. The generated
same-origin `/api` proxy precedes the SPA deep-link fallback. Browser requests
never receive the upstream origin as an API setting. CSP permits same-origin
requests only; all pages are no-store/no-referrer and have no analytics, external
fonts or service-worker cache. The reviewed old root worker is retired before
session access. Unknown workers fail closed. If retirement requires a reload,
the consumed invitation/recovery link must be reopened from the original message.

`npm run dev:portal-review` serves this same application on the fixed loopback
review origin against the synthetic backend. Build and preview are prohibited
for that mode. It accepts only `.invalid` identities. No real credentials or
HR records belong in this runtime.

## Native HTTPS artifact review

`npm run preview:portal-https` is an isolated native-test harness, not a Vite
server, hosting replacement or deployment command. Build the existing
`portal-release` profile with the reserved test origin
`https://epdg-review.localhost`, the documented fictional Railway upstream and
an explicit test review reference. Keep a separate actual-target artifact built
from the same reviewed commit; the two configurations are not byte-identical.
Neither artifact grants release authorization.

The harness requires `EPDG_PREVIEW_ACK`, `EPDG_PREVIEW_ARTIFACT`,
`EPDG_PREVIEW_MANIFEST`, `EPDG_PREVIEW_KEY` and `EPDG_PREVIEW_CERTIFICATE`.
The acknowledgement is `local-synthetic-only`. The external manifest records
`sourceCommit`, profile `portal-release` and every artifact file's relative
`path`/`sha256`. The certificate and key must be outside the artifact. All bytes
are verified and loaded into memory before serving, so later filesystem changes
cannot silently change the tested artifact.

The listener is fixed to loopback port 443 and the reserved host; `/api` proxies
only to the separately prepared disposable production-profile API on loopback
58001. It strips incoming forwarded headers, supplies fixed local proxy metadata,
preserves the API's cookie headers, refuses redirects and bounds requests.
Static responses use the artifact's reviewed security headers. Private paths,
traversal, foreign hosts/origins and static mutations are denied. The harness
does not execute the artifact's proposed provider routing rules.

Generate a short-lived local test certificate in memory and export only to a
private task directory; do not import it into an OS/browser trust store. The
native test client supplies that fixture certificate explicitly as `ca`, keeps
`rejectUnauthorized: true`, checks the reserved hostname and resolves only that
test hostname to loopback. Missing trust and a different hostname must fail.
Never bypass a browser TLS warning or override the real portal hostname.

Use only synthetic identities/database/mail fixtures. Stop the recorded server
and remove its private key when the review ends; retain the certificate's
non-secret fingerprint, artifact hashes and sanitized results. Native HTTPS
checks prove the exercised cookie/origin/CSRF behavior, not browser acceptance
of a public certificate or the actual Netlify/Railway ingress. Browser desktop
and responsive checks use the separate fixed HTTP review mode. Actual provider
TLS, forwarding/rate-limit behavior and public entry remain live release gates.

## Authentication and routes

The existing sign-in, invitation acceptance, recovery, reset and change-password
forms use server-issued HttpOnly cookie sessions. Mutation requests send the
existing same-origin verification header and, when authenticated, CSRF token.
No bearer token, password or account record is saved in browser storage.
Invitation and recovery fragments are consumed in memory and scrubbed before
bootstrap requests. Same-document token links work; ordinary skip-link anchors
preserve the in-memory token. Public registration remains unavailable.

Protected deep links restore a session before fetching private content and return
to a bounded internal path after sign-in. Expired/revoked sessions hide records;
failed logout hides records and requires a retry. The profile permits only a
display-name update. Email, roles, scopes and onboarding cannot be self-edited.

The eleven canonical roles are validated in explicit server assignments. Opaque composite scope versions are retained so assignment and scope revisions invalidate the displayed session boundary.
Navigation uses server permissions, never the legacy profile. `/learning` uses
the existing program/submission/revision screens for `learning.participate`;
`/reviews` uses the existing reviewer queue for `learning.review`. `/resources`
and individual resource links use the scoped workspace API. Resource draft,
review and publish controls require current server capabilities and revision
checks. The server remains authoritative on every request.

## Account management

`/admin/accounts` extends the existing administrator workspace after the same
verified portal session. It lists authorized accounts, scoped role plans,
onboarding eligibility, invitations and audit events. Search/status filters act
only on the authorized response. Each mutation requires both a server capability
and the row's `allowed_actions`; stale/conflicting records require refresh.
Proposal, CRM verification, founder role approval, provisioning, invitation
preparation and transport are separate actions. The confirmation step names the
account and operation. CRM evidence is a reference only, never an uploaded HR file.

Invitation preparation is not transport. Provider acceptance is not delivery.
Email confirmation, invitation acceptance, enabled account access and successful
sign-in have separate fields. Raw invitation tokens are never part of admin
responses. Unknown transport results are shown honestly and are not inferred
from the presence of an invitation row. Disabling access and audit retrieval are
server-authorized actions. Public profile editing cannot grant a role.

## Release prerequisites and rollback

Review the exact frontend/backend commits, additive schema changes, verified
database identity, mail provider, origin/cookie/proxy behavior and access matrix
before founder release approval. Current production remains locked and hosted
administrator staging retains provider SSO. Public auth-page behavior must be
tested behind the proposed route only after release approval; private content
still requires a valid app session. No source edit removes provider SSO.

Rollback means retaining/restoring the existing locked artifact and disabling
backend account management/delivery flags. Do not reverse migrations or delete
accounts. Pending invitations can be revoked through reviewed backend controls.
Final synthetic validation and remaining dependency advisories are recorded in
the repository release log and private build evidence. No live account status
or roster is included in this document.
