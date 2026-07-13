# Deployment and rollback

## Dependency-safe release order

1. If required, apply only verified database-compatible, forward-only migrations.
2. Merge and deploy the backend after backend tests and route/security checks pass.
3. Update frontend configuration only to a verified backend origin.
4. Generate current-head frontend previews and complete browser checks.
5. Merge and deploy frontend applications after all gates pass.

## GitHub

- Never force-push protected branches.
- Before merge, rollback with focused follow-up commits on the feature branch.
- After merge, use a normal revert PR; do not rewrite history.

## Netlify

- Validate a unique deploy preview before production.
- Roll back by publishing the last verified deploy through Netlify deployment history.
- Restore configuration by variable name from provider history; never copy values into this repository.

## Railway

- Record the verified service, deployment identifier, health result, and protected-route result.
- Roll back to the last healthy Railway deployment if health, CORS, startup, or route verification fails.
- Do not change the frontend API origin until the replacement backend is healthy and verified.

## Supabase migrations

- Use forward-only, idempotent migrations with verification queries.
- Prefer a compensating migration that restores prior behavior without dropping data.
- Never reset, truncate, or overwrite production data as rollback.

## Supabase Edge Functions

- Retain the last verified function version identifier and the exact saved source artifact that produced it.
- If verification fails, redeploy the last verified saved source artifact and rerun method, origin, validation, storage, and notification checks.

## Stop conditions

Stop a release step when a required check fails, provider identity is unverified, a migration would destroy data, authorization behavior is unclear, or rollback cannot be stated safely. Migration identity drift, unverified Railway source linkage, absent EPDG landing preview coverage, incomplete browser QA, and unresolved authentication/role mapping are explicit stop gates. Continue independent workstreams.
