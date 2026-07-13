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

## Live inventory — 2026-07-11

- PostgreSQL: `17.6.1`.
- Schemas reviewed: `public` and `epdg`.
- Tables: 46 total (`public`: 9; `epdg`: 37).
- Primary keys: present on all 46 tables.
- Foreign keys: 81.
- Indexes inspected: 136; all valid.
- Views/materialized views: none in the reviewed schemas.
- Non-internal triggers: none.
- RLS policies: none on any reviewed table.
- RLS enabled: 42 tables; four EPDG career tables remain disabled.

The four RLS-disabled tables are `epdg.career_files`, `epdg.career_experiences`, `epdg.career_projects`, and `epdg.career_skills`.

`anon` and `authenticated` hold blanket table privileges on 37 of 37 EPDG tables and 8 of 9 public tables, plus broad sequence privileges. They currently lack `USAGE` on the `epdg` schema, and there are no public views or EPDG RPCs exposing those tables, so an active public disclosure was not proven. This is a latent critical exposure and must be removed before the schema is exposed. The provider connector did not expose the configured Data API schema list, so that setting remains unresolved.

`public.leads` is the positive exception: RLS is enabled and browser roles have no table privileges.

## Migration history

Remote history contains:

- `20260518000000_create_leads`
- `20260711212426_reconcile_leads_and_rate_limits`

The provider migration ledger exposed the complete stored statement for the second migration. It matches the tracked SQL body; only the tracked filename timestamp differed. Both repository mirrors now use the existing remote identity `20260711212426` without modifying the live ledger or rewriting applied history.

## Prepared but not applied — 2026-07-12

Both repository mirrors now contain the new, byte-identical forward migration `20260712012321_serialize_lead_rate_limit_and_index_cleanup.sql`. It was generated with Supabase CLI 2.101.0 and does not modify either existing migration file.

The prepared migration adds a `requested_at` cleanup index and takes a transaction-scoped, requester-specific advisory lock before the rate-limit count and insert. It preserves the existing RPC signature, defaults, boolean response, `SECURITY DEFINER` setting, empty search path, and service-role-only execute boundary.

`scripts/verify-lead-rate-limit.sql` is a metadata-only post-deployment check for the index, function settings, lock call, and execute privileges. It does not read lead or rate-limit rows. The Edge and migration regression suite passes 9/9. The migration has not been applied, and live metadata still shows the pre-migration function without the advisory lock and without the new cleanup index.

The compensating plan is forward-only: if the lock causes an unexpected regression after a reviewed deployment, create a new migration restoring the prior function body while leaving the additive index in place. Do not place an automatic reversion after the forward migration or rewrite migration history.

Both mirrors also contain the byte-identical forward migration `20260712090000_harden_career_data_boundary.sql`. It enables RLS and revokes browser-role privileges on the four career tables, fixes the `public.update_timestamp()` search path and execute boundary, and adds the two missing indexes confirmed on career-data foreign keys. It adds no end-user policies and changes no application rows. `scripts/verify-database-boundary.sql` is metadata-only verification. If a verified backend operation loses access, the compensating action is a new migration granting only that operation to `service_role`; browser grants and disabled RLS must not be restored.

## Live `core` schema boundary

The metadata-only audit found three `core` tables (`branches`, `users`, and `user_branch_roles`), two enums, two foreign keys, and eight expected primary/unique/partial/foreign-key indexes. The live columns, enum values, constraints, and indexes match the tracked backend contract.

RLS is disabled on all three tables, but `anon`, `authenticated`, `service_role`, and `authenticator` currently have no effective schema, table, sequence, or column access. No `core` policies, functions, triggers, column grants, or custom default ACLs were found. This is not a demonstrated Data API exposure, but it is a latent boundary that must not be expanded without the real database connection role and authorization model.

Because there are no database triggers, `core.users` and `epdg.users` identity synchronization is application-managed. Metadata-only inspection cannot prove the required EPDG branch row, sequence position, migration-ledger state, or row-by-row ID/password-hash parity. Those checks remain blocked because they require approved private row-level verification.

## Role test matrix

No EPDG end-user ownership or role policy can be written safely yet. `epdg.users.id` uses a custom integer identity and has no verified mapping to Supabase Auth UUIDs. Backend JWT/session claims, database connection role, password hashing, ownership fields, and the final founder-approved role matrix must be confirmed first. Service-only hardening, deny-by-default RLS, and privilege revocation can be prepared independently but still require review before live application.

Until that mapping is approved, unclear permissions remain denied. Do not add generic `TO authenticated` policies.

## Advisor results

- Security notices: 44 (43 RLS-enabled-without-policy notices and one mutable function search-path notice).
- Performance notices: 45 (27 unindexed foreign keys and 18 unused-index notices).
- Unused indexes must not be dropped based on a single statistics snapshot.

The missing foreign-key indexes cover announcements, badges, career data, certificates, feedback, intern progress/profile/roadmap, slots, onboarding modules, opportunities/applications, points, resources, leaderboard points, messages, and rooms. Additive indexes may be prepared in reviewed batches after table-size and lock-duration review.

## Edge and lead pipeline

- One live `send-consultation-email` Edge Function exists at version 8 with `verify_jwt=false`; the local remediation has not yet been deployed or live-tested.
- The rate-limit RPC is restricted to the service role and uses a fixed empty search path.
- The current count-then-insert rate-limit algorithm has a concurrency race.
- No lead idempotency constraint or durable notification outbox exists.
- The `update_timestamp` function has a mutable search path and unnecessary browser-role execute grants, although no trigger currently uses it.

## Prepared safe sequence

1. Reconcile the tracked migration filename with the proven live identity without changing live history. Completed in the prepared branch.
2. Harden future default privileges for the known object-creator roles.
3. Enable RLS and revoke browser privileges on the four career tables before any schema exposure.
4. Harden `update_timestamp` with an empty search path and minimum execute privileges.
5. Replace the rate-limit RPC with a serialized/atomic design and add a timestamp-leading cleanup index.
6. Add reviewed foreign-key indexes in lock-safe batches.
7. Add role policies only after the real authentication/ownership mapping and role matrix are approved.
8. Add idempotency and a private notification outbox after request-key, retry, and ownership contracts are approved.

This sequence is prepared guidance only. A new migration file is committed for review, but no live database migration, policy, grant, function, or row was changed during the audit.

## Migration requirements

Every production migration must be forward-only, idempotent, non-destructive, advisor-reviewed, paired with verification queries, and accompanied by a compensating migration or operational rollback.
