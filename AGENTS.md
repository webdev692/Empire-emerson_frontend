# Repository operating rules

These rules apply to every contributor and automation agent working in this repository.

## Scope and attribution

- Preserve prior intern contributions and authorship. Make focused changes and do not rewrite unrelated work.
- Keep the frontend and backend as separate sibling Git repositories. Never nest another `.git` directory here.
- The four applications are `Emerson_Empire`, `Agency_LandingPage`, `EPDG-Landing-Page`, and `epdg`.

## Safety

- Never commit environment files, credentials, tokens, private keys, production data, personal records, applications, evaluations, rosters, contracts, or private messages.
- Environment documentation contains variable names and purposes only.
- Never invent production origins, domains, form destinations, recipients, legal text, or role permissions.
- Database work must be forward-only, idempotent, non-destructive, reviewed for RLS/grants, and accompanied by verification and a compensating plan.
- Do not drop or truncate production objects, overwrite real records, rewrite Git history, or force-push protected branches.

## Toolchain and verification

- Use Node.js `22.23.1`, npm `11.17.0`, and Deno `2.8.1` unless a reviewed repository-wide upgrade changes all declarations together.
- Use `npm ci` for deterministic installs. Do not update lockfiles incidentally.
- For each affected application, run build, lint, and its targeted smoke checks.
- Run Supabase Edge Function Node regression tests, `deno lint`, and frozen `deno check` when Edge code changes.
- Browser and deployment evidence must correspond to the current commit. Never count stale, skipped, neutral, or canceled results as passing verification.

## Release discipline

- Keep commits logical and reviewable. Review the complete staged diff before each commit.
- Do not deploy or merge code with failing required checks.
- Record releases, migrations, deployments, verification, blockers, and rollback instructions in `docs/OVERNIGHT_FULL_STACK_RELEASE.md`.
- Public errors and logs must be privacy-safe and must never include secret values or private record contents.
