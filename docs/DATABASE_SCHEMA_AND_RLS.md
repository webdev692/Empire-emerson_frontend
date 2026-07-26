# Database schema and RLS

Supabase project: `gqlyofoazfkumirhbnmc`

This document is schema-only. It must not contain row contents, private user information, credentials, or secret values.

## Security baseline

- Deny access by default.
- Enable RLS on every exposed table.
- Treat grants and RLS as separate controls; both must be intentional.
- Never use user-editable metadata for authorization.
- Authenticated access must include ownership, assignment, or verified administrative predicates.
- Update policies require both `USING` and `WITH CHECK` predicates.
- Privileged functions require explicit execute grants, a fixed search path, and an internal authorization check.
- Browser roles must not access leads or privileged notification/audit data.
- Public certificate and portfolio access must expose only explicitly public fields.

## Live inventory — 2026-07-25

- PostgreSQL: `17.6.1`.
- Schemas reviewed: `public`, `epdg`, `private`, and `core`.
- Tables: 50 total (`public`: 9; `epdg`: 37; `private`: 1; `core`: 3).
- RLS policies: none on any of the 50 reviewed tables.
- RLS enabled: 47 tables.
- RLS disabled: only the three `core` tables.

The forward career-boundary migration enabled RLS on
`epdg.career_files`, `epdg.career_experiences`,
`epdg.career_projects`, and `epdg.career_skills`; revoked their browser-role
grants; and retained minimum service-role CRUD. Metadata verification confirmed
all four results.

`anon` and `authenticated` retain blanket table privileges on 33 of 37 EPDG
tables and 8 of 9 public tables, plus broad sequence privileges. They currently
lack `USAGE` on the `epdg` schema, and there are no public views or EPDG RPCs
exposing those tables, so an active public disclosure was not proven. This is
latent critical access and must be removed before the schema is exposed. The
provider connector did not expose the configured Data API schema list, so that
setting remains unresolved.

`public.leads` is the positive exception: RLS is enabled and browser roles have no table privileges.

The complete table-by-table classification, owner/controller, role access, policy-readiness, and fail-closed decision is in [SUPABASE_ROLE_POLICY_MATRIX.md](./SUPABASE_ROLE_POLICY_MATRIX.md).

## Migration history

Two distinct migration ledgers were observed and must not be conflated.

Supabase-managed remote history contains:

- `20260518000000_create_leads`
- `20260711212426_reconcile_leads_and_rate_limits`
- `20260725225312_serialize_lead_rate_limit_and_index_cleanup`
- `20260725225336_harden_career_data_boundary`
- `20260725230658_add_lead_idempotency_contract`

The provider migration ledger exposed the complete stored statements needed for
reconciliation. The repository mirrors now use the existing remote identities
for all five Supabase-managed migrations without modifying the live ledger or
rewriting applied history.

The application-managed `public.migrations` ledger contains bootstrap `000` and migrations `001` through `033` as applied. That history includes `011-create_admins_table.sql` and `024-fix-certificates-table.sql`, both of which contain destructive `DROP TABLE` behavior in the historical backend source. They are evidence of already-applied application history only. Do not replay them, copy them into Supabase-managed history, rename them, or use them as production remediation. Any correction must be a new forward-only migration.

## Applied forward reconciliation — 2026-07-25

The two repository mirrors contain byte-identical copies of all three new
forward migrations. No existing migration file or stored migration identity
was rewritten.

- `20260725225312_serialize_lead_rate_limit_and_index_cleanup.sql` adds the
  cleanup index and serializes each requester's count-and-insert decision with
  a transaction advisory lock. Live verification confirmed the index, fixed
  search path, lock-bearing function, and service-role-only execute boundary.
- `20260725225336_harden_career_data_boundary.sql` enables RLS and revokes
  browser access on the four career tables, fixes
  `public.update_timestamp()`, and adds two verified foreign-key indexes. Live
  verification confirmed RLS, grants, function settings, and index readiness.
- `20260725230658_add_lead_idempotency_contract.sql` adds a nullable
  server-digest column, a validated format constraint, a unique partial index,
  and service-role-only `store_lead_request`. The RPC checks duplicate retries
  before rate limiting and stores the request key and lead atomically.

The idempotency contract passed an explicit transaction-only live test: the
first synthetic call returned `inserted`, an identical retry returned
`duplicate`, the whole test was rolled back, and a follow-up count confirmed
zero residual rows. `scripts/verify-lead-rate-limit.sql`,
`scripts/verify-database-boundary.sql`, and
`scripts/verify-lead-idempotency.sql` are metadata-only checks.

Compensation remains forward-only. If a regression is found, ship a new
minimum-scope function or grant correction. Do not disable RLS, restore browser
grants, remove the additive indexes, rewrite migration history, or replay
historical destructive migrations.

## Live `core` schema boundary

The metadata-only audit found three `core` tables (`branches`, `users`, and `user_branch_roles`), two enums, two foreign keys, and eight expected primary/unique/partial/foreign-key indexes. The live columns, enum values, constraints, and indexes match the tracked backend contract.

RLS is disabled on all three tables, but `anon`, `authenticated`, `service_role`, and `authenticator` currently have no effective schema, table, sequence, or column access. No `core` policies, functions, triggers, column grants, or custom default ACLs were found. This is not a demonstrated Data API exposure, but it is a latent boundary that must not be expanded without the real database connection role and authorization model.

Because there are no database triggers, `core.users` and `epdg.users` identity synchronization is application-managed. Metadata-only inspection cannot prove the required EPDG branch row, sequence position, migration-ledger state, or row-by-row ID/password-hash parity. Those checks remain blocked because they require approved private row-level verification.

## Role and policy decision

No EPDG end-user ownership or role policy can be written safely yet. `epdg.users.id` uses a custom integer identity and has no verified mapping to Supabase Auth UUIDs. Backend JWT/session claims, database connection role, password hashing, ownership fields, and the final founder-approved role matrix must be confirmed first. Service-only hardening, deny-by-default RLS, and privilege revocation can be prepared independently but still require review before live application.

The reviewed service-only hardening is now live; end-user policies remain
blocked. Until the identity mapping is approved, unclear permissions stay
denied. Do not add generic `TO authenticated` policies.

The role test cases and all 50 table decisions are defined in [SUPABASE_ROLE_POLICY_MATRIX.md](./SUPABASE_ROLE_POLICY_MATRIX.md). The minimum future test set is `anon`, authenticated owner, authenticated non-owner, organization member, administrator, and backend/service access.

## Generated database types

Current Supabase TypeScript types were generated after the live reconciliation.
They include the new `public.leads.idempotency_key` field, expose only the
`public` schema through this provider operation, and contain neither `epdg` nor
`private` schema definitions. No generated database type file is committed to
a browser application because none of the four applications directly uses the
Data API. Keep that boundary.

Generated types may be created only as server-side schema evidence in a reviewed backend workstream. They must remain outside Vite/browser source trees, must not introduce direct browser `from(...)` or table RPC access, and must not be treated as authorization. Type generation proves names and shapes, not grants, RLS behavior, ownership, or administrator authority. Until the Data API schema list, custom user mapping, and backend role are approved, do not generate or publish a broad client database contract for `public`, `epdg`, `private`, or `core`. Browser lead submission may continue to invoke the reviewed Edge endpoint; it must not write `public.leads` directly.

## Advisor results

- Security notices: 47 informational RLS-enabled-without-policy notices and
  zero warning-level mutable-search-path notices.
- Performance notices: 46 (25 unindexed foreign keys and 21 unused-index
  notices). Three of the unused-index notices are newly created, verified
  indexes on empty tables and are expected before traffic.
- Unused indexes must not be dropped based on a single statistics snapshot.

The missing foreign-key indexes cover announcements, badges, career data, certificates, feedback, intern progress/profile/roadmap, slots, onboarding modules, opportunities/applications, points, resources, leaderboard points, messages, and rooms. Additive indexes may be prepared in reviewed batches after table-size and lock-duration review.

## `public.update_timestamp()` remediation

Live metadata now shows `public.update_timestamp()` with an explicit empty
search path. Execute is revoked from `public`, `anon`, `authenticated`, and
`authenticator`, while `service_role` retains execute. The warning-level
advisor finding is cleared. `scripts/verify-database-boundary.sql` verifies
those settings without reading application rows. If a verified backend role
needs a narrower grant, ship a new minimum-grant compensating migration rather
than weakening the search path or restoring browser execute.

## Edge and lead pipeline

- Live `send-consultation-email` is active at version 13 with
  `verify_jwt=false`, which is intentional for the public inquiry endpoint.
- Its five deployed files, including `request-security.mjs`, are byte-identical
  to the reviewed repository source.
- The endpoint enforces a strict origin allowlist, POST/OPTIONS only, schema
  checks, a streamed 20,000-byte limit, a honeypot, serialized server-side rate
  limiting, atomic idempotent insertion, privacy-safe errors, and stored-success
  behavior when administrator notification delivery fails. Missing origins are
  rejected, and user-controlled email-subject labels cannot inject header lines.
- Live smoke results: preflight `204`, honeypot `200`, malformed JSON `400`,
  invalid email `400`, oversized body `413`, rejected origin `403`, and wrong
  method `405`; a missing origin is rejected with `403`.
- A durable notification outbox is still not present. Stored leads survive
  notification failure, but operations must monitor and reconcile failed
  notifications separately.

## Prepared safe sequence

1. Reconcile the tracked migration filename with the proven live identity
   without changing live history. Completed.
2. Enable RLS/revoke browser privileges on the four career tables and harden
   `update_timestamp`. Completed and verified.
3. Serialize rate limiting and add the cleanup index. Completed and verified.
4. Add atomic lead retry idempotency. Completed and rollback-tested.
5. Harden remaining future default privileges for known object-creator roles.
6. Add reviewed foreign-key indexes in lock-safe batches.
7. Add end-user role policies only after the real authentication/ownership
   mapping and role matrix are approved.
8. Add a durable notification outbox after delivery/operations ownership is
   approved.

## Migration requirements

Every production migration must be forward-only, idempotent, non-destructive, advisor-reviewed, paired with verification queries, and accompanied by a compensating migration or operational rollback.
