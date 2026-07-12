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

Both repository mirrors use a different timestamp for the second migration. The live schema effects appear consistent with the local SQL, but the remote body is not available through the connector. Do not rename history, run migration repair, or push migrations until the remote SQL identity is proven and the drift is reconciled safely.

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

1. Prove and reconcile migration-history identity without changing live history blindly.
2. Harden future default privileges for the known object-creator roles.
3. Enable RLS and revoke browser privileges on the four career tables before any schema exposure.
4. Harden `update_timestamp` with an empty search path and minimum execute privileges.
5. Replace the rate-limit RPC with a serialized/atomic design and add a timestamp-leading cleanup index.
6. Add reviewed foreign-key indexes in lock-safe batches.
7. Add role policies only after the real authentication/ownership mapping and role matrix are approved.
8. Add idempotency and a private notification outbox after request-key, retry, and ownership contracts are approved.

This sequence is prepared guidance only. No database migration, policy, grant, function, or row was changed during the audit.

## Migration requirements

Every production migration must be forward-only, idempotent, non-destructive, advisor-reviewed, paired with verification queries, and accompanied by a compensating migration or operational rollback.
