# Phase 1 continuation and isolated test setup proposal

Status: proposed only. No resource creation, deployment, invitation, production query, or migration application was authorized or performed. Backend-dependent implementation remains blocked. This proposal preserves the existing custom accounts and Supabase/Postgres architecture; it does not introduce another identity system or an application database replacement.

## Access required

Provide an authorized writable checkout of `THE-EMERSON-EMPIRE/THE-EMERSON-EMPIRE_Backend` alongside the frontend repository, outside its Git root. Confirm its starting commit and applicable operating instructions. Provide read access to backend deployment metadata and schema/migration metadata, plus explicitly authorized access to the isolated resources below. Supply credentials through provider secret settings or a secure runtime secret manager, never through issues, reports, browser variables, or chat. No production write permission is needed.

## Resources and costs requiring approval

| Resource | Proposed setup | Cost boundary |
| --- | --- | --- |
| Test database | Separate non-production Supabase project with the required `core`, `epdg`, `public`, and `private` schema contract; never a data-copy branch | Free project allocation may be available subject to current account limits. Otherwise a paid project incurs provider compute/storage charges. Confirm current provider quote and budget before creation. |
| Test backend | Dedicated Railway test service/environment running only the sibling backend's reviewed commit | Separate service uses metered compute, memory, and networking; existing account credit does not guarantee zero incremental cost. Obtain a current estimate and spending limit before creation. |
| Mail sink | Private Mailpit instance reachable only by the test backend and authorized reviewers, with SMTP forwarding/relay disabled | Local execution on existing approved hardware has no new provider charge; hosted execution adds compute/storage usage. No real mail provider credential is required. |
| Frontend evidence | Unique Netlify deploy preview for the resulting frontend revision, linked only to the test backend after review | Uses account build and transfer allowances; overages depend on the account plan. No production publication or unlock. |

No exact dollar price was asserted without a current provider quote. A reproducible local backend/Postgres/Mailpit setup may be considered after the backend's schema/extensions and operating requirements are inspected, but is not a verified substitute for deployment acceptance. Do not provision any option until resources and budget are approved.

## Ordered setup and isolation proof

1. Inspect backend authentication, authorization middleware, identity mirroring, route audit, deployment manifest, dependencies, connection role, and both migration ledgers. Record actual commits. Treat historical documents as evidence to reconcile, not startup instructions. Never run historical migration scripts or application startup against production to discover schema.
2. Establish a reviewed schema-only baseline from tracked definitions reconciled with metadata-only production inspection. Include required types, constraints, functions, grants, RLS flags, and extensions; omit table data, auth users, storage objects, secrets, mail settings, and production integrations. Do not replay historical destructive migrations. Validate the baseline on the new empty database and record its checksum and migration ledger strategy.
3. Create only approved isolated resources. Use separate credentials and database roles. Set the backend's migration opt-in off initially. Verify database project identifier, endpoint, database name, current connection role, and role privileges against an explicit test allowlist using a preflight that fails closed. A name containing `test` alone is insufficient proof of isolation. Record sanitized identifiers, never connection strings or secrets.
4. Verify there are zero application accounts, organizations, records, and storage objects before seeding. Review baseline functions/triggers for webhooks or side effects and disable external integrations in the test configuration. Seed only reviewed synthetic accounts and institutions A/B; use reserved `.invalid` recipient domains. Keep fixture provenance and teardown instructions. Never restore a production backup, copy participant rows, or reuse account/password hashes.
5. Deploy the test backend at a recorded commit, with network/database access limited to the test database. Remove all production credentials from that service. Restrict ingress to controlled reviewers where supported. Verify deployment settings, database preflight, and outbound rules before enabling endpoints or migrations. Do not run this work in Railway `production` or `production_epdg`.
6. Run Mailpit privately with authentication/access restrictions, no public SMTP ingress, no relay, and short message retention. Configure only its internal SMTP endpoint. Block outbound SMTP and real email-provider API access from the test service. Test synthetic recovery/invitation capture and inspect sink metadata; verify no forwarding configuration and no delivery network route. Never provide a production mail API key to this deployment.
7. After backend inspection, prepare idempotent, forward-only migrations for only missing foundations. Review connection-role/RLS/grant behavior and apply only after the test database identity check. Record old/new ledgers and verification queries. Do not broaden browser grants, activate blanket authenticated policies, auto-backfill permissions, or modify bucket visibility.
8. Link the review-only frontend preview to the exact test backend commit. Review same-origin proxy/cookie/CSRF behavior before enabling login. Use a cookie restricted to that preview host and a strict configured origin allowlist, without wildcard credentials. Assert private/auth responses use `Cache-Control: no-store`; verify generated service worker and an upgraded browser profile as well as a fresh one.
9. Run the synthetic denial matrix: anonymous, forged browser roles/identifiers, own-profile field allowlist, cross-user access, institution A/B separation, inactive memberships, technical staff without educational access, and unauthorized invitation/role/owner operations. Verify expiry, replay, reset/deactivation/logout invalidation, revoked-session reuse, and reload persistence. Test concurrent invitation acceptance and one-time bootstrap. Capture privacy-safe statuses and commit/deployment identifiers, not tokens or private response bodies.
10. Review keyboard navigation, accessible errors, desktop and narrow mobile layouts. Record exact build/lint/smoke/integration results at the deployed revisions. Disable the test deployment when review ends; expire synthetic sessions/invitations and clear sink messages. Do not promote production.

## Proposed environment-variable contract

These names are a proposed contract, not a claim about the unavailable backend source. Reconcile existing names before implementation. Documentation lists names and purposes only.

| Names | Purpose and secure location |
| --- | --- |
| `DATABASE_URL` | Isolated database connection secret; test backend provider secret store only, never a Vite variable |
| `TEST_DATABASE_PROJECT_ID`, `TEST_DATABASE_NAME`, `TEST_DATABASE_ROLE` | Explicit isolated-target assertions for startup/test/migration preflight; backend test configuration |
| `NODE_ENV`, `PORT`, `ALLOW_DATABASE_MIGRATIONS` | Runtime and explicit migration gate; test backend settings; no automatic historical replay |
| `PORTAL_ORIGIN`, `ALLOWED_ORIGINS`, `SESSION_COOKIE_NAME`, `SESSION_TTL_SECONDS` | Exact reviewed preview origin and session policy; test backend configuration |
| `CSRF_SECRET`, `TOKEN_HASH_KEY` | Only if the reviewed session/CSRF implementation needs keyed secrets; backend secret store, separately generated for tests |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `MAIL_FROM`, `MAIL_DELIVERY_MODE` | Private sink transport and synthetic sender configuration; credentials in backend secrets, delivery mode constrained to sink |
| `OWNER_BOOTSTRAP_IDENTITY_ID`, `OWNER_BOOTSTRAP_VERIFIED`, `OWNER_BOOTSTRAP_SECRET` | Explicit reviewed identity proof and restricted bootstrap authorization; backend secret configuration; absent means unavailable. Synthetic owner only in tests |
| `VITE_API_URL` | Existing frontend origin configuration; only the approved test backend's public origin, never credentials. Review migration to same-origin proxy before session integration |

Never copy production environment files. Do not define production origins or recipients by inference. Do not enable Netlify Identity, Supabase Auth, or Netlify Database.

## Backend changes still required before portal access can open

Exact files cannot be identified without the checkout. Required changes are bounded to these server contracts:

- Map existing `core` and EPDG account IDs transactionally and preserve historical IDs; inspect existing session/profile/organization structures before adding any tables.
- Replace legacy bearer authorization with server-managed revocable sessions; hash opaque identifiers, enforce expiry and current account/membership state on every protected request, and invalidate on logout, reset, and deactivation. Do not leave a bearer bypass or enable incomplete refresh behavior.
- Implement strict origin/CSRF validation for cookie mutations, host-only Secure/HttpOnly cookies, input/body limits, abuse controls, no-store responses, and privacy-safe errors/audits. Resolve cookie rewriting and proxy trust from real Netlify/Railway configuration before selecting SameSite policy.
- Restrict registration server-side to scoped, expiring, single-use invitations. Accept invitations atomically; prevent replay and unauthorized role escalation. Hash invitation/recovery secrets and implement bounded recovery/callback flows through the sink in tests.
- Add restricted, auditable, non-repeatable owner bootstrap using explicit verified configuration. No inferred owner; no ordinary-user owner creation.
- Enforce current account, active membership, approved server-owned permission, requested action, and organization/resource scope. Unknown permissions deny. Separate platform privileges from educational permissions; mentors receive no blanket administration. No automatic permission backfill.
- Expose minimal server-derived session/effective-access and own-profile contracts with a reviewed editable-field allowlist. Provide invitation/membership controls only when an explicitly approved permission supports them; no invented role powers or student-record APIs.
- Prepare only missing relational foundations with foreign keys, scope relationships, uniqueness, appropriate indexes and server-only access. Verify grants and any RLS bypass role. Test inactive/unrelated memberships and concurrent single-use operations.

After these contracts pass integration testing, replace the frontend hold with session loading, safe profile editing, server-derived access summaries, and role-appropriate empty dashboard shells. Do not connect the old feature router wholesale. Unimplemented program features remain closed.

## Compensation and remaining decisions

Keep additive records and audit history. If a migration fails, stop traffic and prepare a new forward-only correction; never drop/truncate data, disable RLS, or restore broad browser grants. Because a frontend hold is not server revocation, do not roll back a security backend to an exploitable bearer path. Preserve production configuration and locked publication throughout.

Still required: verified owner identity/proof procedure, approved role/permission/scope matrix, editable profile fields, audit/session/invitation retention, recovery identity policy, authorized test reviewers, current cost approval, and test resource lifecycle ownership. No real personal information belongs in the proposal or synthetic fixtures.
