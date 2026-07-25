# Supabase table role and policy matrix

Supabase project: `gqlyofoazfkumirhbnmc`

Evidence date: 2026-07-25. This is a metadata-only security design artifact. It contains no row contents, private user information, credentials, or secret values, and it does not authorize a live migration or grant change.

## Evidence and interpretation

- The live inventory contains 50 tables: `public` 9, `epdg` 37, `private` 1, and `core` 3. No live `agency` schema was found, so an agency matrix must not be invented from repository migrations.
- No RLS policies exist on any of the 50 tables.
- RLS is enabled on 47 tables. It remains disabled only on the three `core` tables.
- `anon` and `authenticated` retain blanket table privileges on 33 of 37 `epdg` tables, but neither role has `USAGE` on the `epdg` schema. The reviewed career-boundary migration removed their privileges from the other four EPDG tables and enabled RLS there. The remaining blanket grants are latent critical access and must not be activated through schema exposure.
- `anon` and `authenticated` have `USAGE` on `public` and broad table privileges on eight of nine public tables. RLS with no policies currently denies rows. `public.leads` additionally has no browser-role table grant.
- `anon`, `authenticated`, `service_role`, and `authenticator` have no effective access to `core`. Browser roles have no effective access to `private`.
- The live Railway database connection role was not available for inspection. The “service/backend” column is the intended minimum boundary, not proof that a currently deployed backend has that access.
- “Owner/controller” is the proposed business owner of a row or configuration, not the PostgreSQL object owner. Every proposed classification requires founder/backend approval.

`service_role` and a direct database connection are server credentials. They must never be placed in a browser bundle. RLS is not an authorization boundary for a role that bypasses RLS, so server code must still enforce the scope shown below.

Three reviewed forward migrations were applied and verified on 2026-07-25:
serialized lead rate limiting, the fail-closed career-data boundary, and atomic
lead retry idempotency. `public.update_timestamp()` now has an empty
`search_path`; browser execute is revoked and service-role execute remains.
Security advisors now report 47 informational `RLS enabled, no policy`
findings and no warning-level mutable-search-path finding. Those information
notices are expected while the identity-mapping gate below remains unresolved;
they must not be silenced with permissive policies.

## Identity-mapping gate

`epdg.users.id` is a custom integer identity. No verified mapping exists between that value and the Supabase Auth UUID returned by `auth.uid()`. The same audit could not verify backend JWT/session claims, administrator claims, organization membership, or the live Railway connection role.

Therefore every owner-, organization-, membership-, assignment-, or administrator-scoped browser policy is blocked. The fail-closed rule is:

1. deny direct `anon` and `authenticated` table access;
2. use only a reviewed server operation whose connection role and authorization checks are known;
3. do not create a generic `TO authenticated` policy;
4. do not authorize from user-editable metadata;
5. when updates are eventually approved, require both a matching `SELECT` policy and explicit `USING` and `WITH CHECK` predicates.

## `core` schema

| Table | Classification | Owner/controller | `anon` | `authenticated` | Service/backend | Policy readiness | Fail-closed decision |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `core.branches` | Administrator only | Founder/system administrator | Denied: no schema or table grant; RLS off | Denied: no schema or table grant; RLS off | Backend contract only; live `service_role` access is also absent | Blocked on connection role and branch-admin contract | Keep outside the Data API; deny until a reviewed backend role is granted minimum access |
| `core.user_branch_roles` | Organization-scoped; administrator write | Founder/system administrator | Denied: no schema or table grant; RLS off | Denied: no schema or table grant; RLS off | Backend contract only; live `service_role` access is also absent | Blocked on UUID-to-integer identity and branch-role mapping | Keep outside the Data API; no browser role-assignment path |
| `core.users` | Administrator only; identity master | Founder/system identity administrator | Denied: no schema or table grant; RLS off | Denied: no schema or table grant; RLS off | Backend contract only; live `service_role` access is also absent | Blocked on identity synchronization, password handling, and connection role | Keep outside the Data API; never expose password or session fields |

## `epdg` schema

For 33 RLS-enabled EPDG tables, “denied now” means the missing schema
`USAGE` and absence of a policy currently prevent browser reads despite latent
blanket table grants. The four career tables have the stronger applied
boundary: RLS/no policy plus explicit browser-role grant revocation.

| Table | Classification | Owner/controller | `anon` | `authenticated` | Service/backend | Policy readiness | Fail-closed decision |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `epdg.admins` | Administrator only | Founder/system administrator | Denied now; latent blanket grant | Denied now; latent blanket grant | Administrator backend only; role unverified | Blocked on trusted administrator identity mapping | No direct browser access; deny all until administrator claims are server-verified |
| `epdg.announcements` | Authenticated read; administrator write | Administrator/mentor publisher | Denied now; latent blanket grant | Denied now; latent blanket grant | Reviewed publisher backend only | Blocked on authenticated-user and publisher mapping | Deny direct access until a reviewed read projection and publisher predicate exist |
| `epdg.applications` | Owner-scoped; administrator review | Applicant and admissions administrator | Denied now; latent blanket grant | Denied now; latent blanket grant | Reviewed admissions backend only | Blocked on applicant identity and reviewer mapping | Deny; expose only the applicant’s row or an authorized review queue through a verified server path |
| `epdg.audit_log` | Administrator only | Security/operations administrator | Denied now; latent blanket grant | Denied now; latent blanket grant | Append/read through audited backend only | Service-only design is possible after connection-role review | No browser access and no client-controlled inserts |
| `epdg.badge_awards` | Owner-scoped; administrator write | Intern recipient and program administrator | Denied now; latent blanket grant | Denied now; latent blanket grant | Awarding backend only | Blocked on recipient identity and award authority | Deny; owner read and system/admin award must be separate predicates |
| `epdg.badges` | Authenticated read; administrator write | Program administrator | Denied now; latent blanket grant | Denied now; latent blanket grant | Catalog administration backend | Blocked on approved catalog projection and admin mapping | Deny direct access until public fields and write authority are approved |
| `epdg.career_experiences` | Owner-scoped | Intern | Denied by revoked grants plus RLS/no policy | Denied by revoked grants plus RLS/no policy | `service_role` has minimum CRUD; direct backend role still unverified | Boundary applied; owner policy remains blocked on identity mapping | Keep rows denied until owner mapping exists |
| `epdg.career_files` | Owner-scoped; public read by explicit projection only | Intern | Denied by revoked grants plus RLS/no policy | Denied by revoked grants plus RLS/no policy | `service_role` has minimum CRUD; direct backend role still unverified | Boundary applied; owner and public-column contracts unresolved | Never expose the raw table; public portfolio access must use an approved column-limited projection |
| `epdg.career_projects` | Owner-scoped | Intern | Denied by revoked grants plus RLS/no policy | Denied by revoked grants plus RLS/no policy | `service_role` has minimum CRUD; direct backend role still unverified | Boundary applied; owner policy remains blocked on identity mapping | Keep rows denied until owner mapping exists |
| `epdg.career_skills` | Owner-scoped | Intern | Denied by revoked grants plus RLS/no policy | Denied by revoked grants plus RLS/no policy | `service_role` has minimum CRUD; direct backend role still unverified | Boundary applied; owner policy remains blocked on identity mapping | Keep rows denied until owner mapping exists |
| `epdg.certificate_templates` | Administrator only | Program administrator | Denied now; latent blanket grant | Denied now; latent blanket grant | Certificate-issuing backend only | Service/admin hardening possible after role review | No browser access; template mutation remains server-only |
| `epdg.certificates` | Public read by explicit projection only; administrator write | Recipient and program administrator | Denied now; latent blanket grant | Denied now; latent blanket grant | Issuance and verification backend only | Public verification fields and revocation behavior need approval | Never expose the raw table; use a minimal verification RPC/view or server response |
| `epdg.companies` | Organization-scoped; authenticated read candidate | Company representative and administrator | Denied now; latent blanket grant | Denied now; latent blanket grant | Reviewed company/admin backend | Blocked on company membership and approved directory fields | Deny; organization writes and any directory read require separate policies/projections |
| `epdg.feedback` | Owner- and assignment-scoped | Intern, assigned mentor, and administrator | Denied now; latent blanket grant | Denied now; latent blanket grant | Reviewed feedback backend only | Blocked on intern/mentor assignment mapping | Deny; only participants and authorized reviewers may access a row |
| `epdg.intern_level_progress` | Owner-scoped; administrator write | Intern and program administrator | Denied now; latent blanket grant | Denied now; latent blanket grant | Progress-calculation backend only | Blocked on intern identity and progress authority | Deny; owner read and system/admin mutation must be separate |
| `epdg.intern_profiles` | Owner-scoped; administrator review | Intern | Denied now; latent blanket grant | Denied now; latent blanket grant | Reviewed profile backend only | Blocked on UUID-to-integer owner mapping | Deny; no broad authenticated profile directory |
| `epdg.intern_roadmap_progress` | Owner-scoped; administrator write | Intern and program administrator | Denied now; latent blanket grant | Denied now; latent blanket grant | Progress backend only | Blocked on intern identity and roadmap assignment | Deny; owner read and system/admin mutation must be separate |
| `epdg.intern_skills` | Owner-scoped | Intern | Denied now; latent blanket grant | Denied now; latent blanket grant | Reviewed profile backend only | Blocked on UUID-to-integer owner mapping | Deny; expose only the verified owner’s rows |
| `epdg.internship_slots` | Authenticated read; organization-scoped write | Company representative and administrator | Denied now; latent blanket grant | Denied now; latent blanket grant | Reviewed company/admin backend | Blocked on company membership and approved listing fields | Deny; read and organization write need separate reviewed contracts |
| `epdg.mentor_sessions` | Owner- and assignment-scoped | Assigned intern and mentor | Denied now; latent blanket grant | Denied now; latent blanket grant | Reviewed mentoring backend only | Blocked on participant identity and assignment mapping | Deny; only verified session participants and administrators may access |
| `epdg.milestones` | Owner- and assignment-scoped | Intern, assigned mentor, and administrator | Denied now; latent blanket grant | Denied now; latent blanket grant | Progress backend only | Blocked on intern identity and assignment mapping | Deny; owner read and authorized evaluator write must be separate |
| `epdg.module_completions` | Owner-scoped; administrator write | Intern and program administrator | Denied now; latent blanket grant | Denied now; latent blanket grant | Progress backend only | Blocked on intern identity and completion authority | Deny; clients must not award their own completion without an approved rule |
| `epdg.onboarding_agreements` | Owner-scoped; administrator audit | Intern and compliance administrator | Denied now; latent blanket grant | Denied now; latent blanket grant | Reviewed onboarding backend only | Blocked on signer identity, versioning, and audit contract | Deny; signature/acceptance evidence remains server-controlled |
| `epdg.opportunities` | Authenticated read; organization-scoped write | Company representative and administrator | Denied now; latent blanket grant | Denied now; latent blanket grant | Reviewed company/admin backend | Blocked on company membership and listing projection | Deny; publish/read and organization mutation require separate predicates |
| `epdg.opportunity_applications` | Owner- and organization-scoped | Applicant and opportunity-owning company | Denied now; latent blanket grant | Denied now; latent blanket grant | Reviewed opportunity backend only | Blocked on applicant identity and company ownership mapping | Deny; applicants see their rows and owning organizations see their queue only |
| `epdg.placements` | Owner- and organization-scoped; administrator write | Intern, company/school representatives, and administrator | Denied now; latent blanket grant | Denied now; latent blanket grant | Placement backend only | Blocked on all participant and organization mappings | Deny; access only after verified placement membership |
| `epdg.platform_settings` | Authenticated read by explicit projection; administrator write | Founder/system administrator | Denied now; latent blanket grant | Denied now; latent blanket grant | Configuration backend only | Blocked on a safe-key allowlist and admin mapping | Never expose secret or operational settings; approved public values need a projection |
| `epdg.point_events` | Owner-scoped; administrator/system write | Intern recipient and program system | Denied now; latent blanket grant | Denied now; latent blanket grant | Points-calculation backend only | Blocked on recipient identity and award authority | Deny; clients must not create or alter their own awards |
| `epdg.readiness_score_history` | Owner-scoped; administrator write | Intern and program administrator | Denied now; latent blanket grant | Denied now; latent blanket grant | Scoring backend only | Blocked on intern identity and scoring authority | Deny; owner read only after mapping, server-only score mutation |
| `epdg.resources` | Authenticated read; administrator write | Program administrator/mentor publisher | Denied now; latent blanket grant | Denied now; latent blanket grant | Resource administration backend | Blocked on approved resource projection and publisher mapping | Deny direct access until read fields and write authority are approved |
| `epdg.roadmap_modules` | Authenticated read; administrator write | Program administrator | Denied now; latent blanket grant | Denied now; latent blanket grant | Curriculum backend only | Blocked on approved curriculum projection and admin mapping | Deny direct access until read fields and write authority are approved |
| `epdg.roadmap_weeks` | Authenticated read; administrator write | Program administrator | Denied now; latent blanket grant | Denied now; latent blanket grant | Curriculum backend only | Blocked on approved curriculum projection and admin mapping | Deny direct access until read fields and write authority are approved |
| `epdg.schools` | Organization-scoped; authenticated read candidate | School representative and administrator | Denied now; latent blanket grant | Denied now; latent blanket grant | Reviewed school/admin backend | Blocked on school membership and approved directory fields | Deny; organization writes and any directory read require separate policies/projections |
| `epdg.submissions` | Owner- and assignment-scoped | Intern, assigned reviewer, and administrator | Denied now; latent blanket grant | Denied now; latent blanket grant | Reviewed submission backend only | Blocked on submitter identity and reviewer assignment | Deny; only submitter and assigned reviewers may access, with storage access aligned separately |
| `epdg.tasks` | Owner- and assignment-scoped | Assigned intern, mentor/company, and administrator | Denied now; latent blanket grant | Denied now; latent blanket grant | Reviewed task backend only | Blocked on assignee and assigner mapping | Deny; assignment membership must be proven for each operation |
| `epdg.tracks` | Authenticated read; administrator write | Program administrator | Denied now; latent blanket grant | Denied now; latent blanket grant | Curriculum backend only | Blocked on approved catalog projection and admin mapping | Deny direct access until read fields and write authority are approved |
| `epdg.users` | Owner-scoped; administrator write | User and identity administrator | Denied now; latent blanket grant | Denied now; latent blanket grant | Identity backend only | Blocked on Supabase Auth UUID-to-custom-integer mapping | Deny all direct browser access; never expose password, reset, or session material |

## `private` schema

| Table | Classification | Owner/controller | `anon` | `authenticated` | Service/backend | Policy readiness | Fail-closed decision |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `private.lead_rate_limits` | Service-role only | Lead-intake security service | Denied: no schema access and no policy | Denied: no schema access and no policy | Edge Function through the restricted, serialized rate-limit RPC only | Applied and verified: advisory locking, cleanup index, fixed search path, service-only execute | Keep the table private; no browser grant, policy, or direct table call |

## `public` schema

For these RLS-enabled tables, no-policy RLS currently denies rows. Broad browser table grants remain unnecessary attack surface and should be revoked in reviewed forward migrations. `public.leads` is the exception with no browser table grant.

| Table | Classification | Owner/controller | `anon` | `authenticated` | Service/backend | Policy readiness | Fail-closed decision |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `public.leaderboard_points` | Authenticated read by explicit projection; owner-scoped detail | Intern recipient and program system | Denied by RLS/no policy; latent grant | Denied by RLS/no policy; latent grant | Points backend only | Blocked on identity mapping and leaderboard privacy fields | Deny raw-table access; publish only an approved minimal leaderboard projection |
| `public.leads` | Service-role only | Lead-intake service and authorized follow-up staff | Denied by no grant plus RLS/no policy | Denied by no grant plus RLS/no policy | `send-consultation-email` Edge Function through `store_lead_request` only | Atomic rate-limit, insert, and retry idempotency are applied and verified; a durable notification outbox remains separate | Keep all direct table access denied; public form submission goes through the reviewed Edge endpoint |
| `public.messages` | Organization/membership-scoped | Message author and room members | Denied by RLS/no policy; latent grant | Denied by RLS/no policy; latent grant | Reviewed messaging backend only | Blocked on user identity and room-membership mapping | Deny; author and active room membership must be proven per operation |
| `public.migrations` | Administrator only; service-role only | Database migration operator | Denied by RLS/no policy; latent grant | Denied by RLS/no policy; latent grant | Migration tooling/operator only | Ready for explicit grant revocation after creator-role review | No application or browser access; never use it as an end-user API |
| `public.notifications` | Owner-scoped; administrator/system write | Recipient and notification service | Denied by RLS/no policy; latent grant | Denied by RLS/no policy; latent grant | Notification backend only | Blocked on recipient identity and delivery contract | Deny; owner read only after mapping, server-only creation and delivery updates |
| `public.resource_saves` | Owner-scoped | Authenticated user | Denied by RLS/no policy; latent grant | Denied by RLS/no policy; latent grant | Reviewed resource backend only | Blocked on user identity and referenced-resource contract | Deny; expose only the verified owner’s rows |
| `public.room_members` | Organization/membership-scoped; administrator write | Room administrator and member | Denied by RLS/no policy; latent grant | Denied by RLS/no policy; latent grant | Reviewed messaging backend only | Blocked on user identity, room ownership, and invitation rules | Deny; membership cannot be self-granted without an approved invitation predicate |
| `public.rooms` | Organization/membership-scoped | Room owner/administrator and members | Denied by RLS/no policy; latent grant | Denied by RLS/no policy; latent grant | Reviewed messaging backend only | Blocked on user identity and membership mapping | Deny; only verified members see a room and only authorized owners mutate it |
| `public.sessions` | Service-role only; owner security metadata at most | Authentication service and security administrator | Denied by RLS/no policy; latent grant | Denied by RLS/no policy; latent grant | Authentication backend only | Server-only hardening requires session/token field review | No direct browser table access; never expose token, hash, or revocation material |

## Approval gates before any policy migration

1. Document the canonical mapping from Supabase Auth UUID to the custom EPDG/core integer user identity.
2. Document server-verifiable administrator, intern, mentor, company, school, and branch membership.
3. Identify the exact Railway connection role and its current schema/table/function grants.
4. Approve explicit column sets for certificate verification, portfolio publication, leaderboards, directories, curriculum, resources, settings, and announcements.
5. Separate read, insert, update, and delete requirements. Avoid `FOR ALL`; update policies require `SELECT`, `USING`, and `WITH CHECK`.
6. Test `anon`, ordinary authenticated owner, authenticated non-owner, organization member, administrator, and backend/service cases in a non-production environment.
7. Re-run Supabase security and performance advisors and preserve metadata-only evidence.

Until all relevant gates are met, every unclear permission in this matrix remains denied.
