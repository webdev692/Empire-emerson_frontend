# Deployment source of truth

## Governing order

Use the following order when deployment evidence conflicts:

1. Reviewed GitHub `main` is the code source of truth.
2. `config/site-identities.json` is the expected four-site identity and mapping
   contract.
3. A current-commit local build and CI run prove what the repository produces.
4. Authenticated provider settings prove what Netlify is configured to build.
5. A read-only public check proves what a visitor currently receives.

Neither a green deploy context nor a responding public URL alone proves the
repository, branch, directory, configuration file, or commit behind it.

## Expected Netlify map

| Source directory | Netlify project | Expected production root | Build output |
|---|---|---|---|
| `Emerson_Empire` | `theemerson` | `https://theemerson.netlify.app/` | `dist` |
| `Agency_LandingPage` | `emersonagency` | `https://emersonagency.netlify.app/` | `dist` |
| `EPDG-Landing-Page` | `emersonprofessionaldevelopment` | `https://emersonprofessionaldevelopment.netlify.app/` | `dist` |
| `epdg` | `epdg` | `https://epdg.netlify.app/` | `dist` |

All four applications use `npm run build`. These values are existing repository
and release coordinates, not newly selected destinations.

## Root configuration risk and proposed correction

The root `netlify.toml` sets `base = "Agency_LandingPage"`. That can be a valid
single-site default, but it is unsafe as an implicit default for four projects.
The public Agency identity mismatch makes provenance review urgent; it does not
prove the root file caused the defect.

The smallest explicit correction is:

1. In each authenticated Netlify project, record and verify the repository,
   production branch, and an explicit base/package directory matching the table
   above.
2. Verify that the intended app-local `netlify.toml`, build command, and `dist`
   publish directory resolve for an exact reviewed commit.
3. Generate and inspect one non-production preview per site.
4. If all four projects are explicit, follow up with a separate reviewed change
   to remove the Agency-only root `[build]` default or document it as an
   intentional Agency-only entrypoint.

This repository change preserves every Netlify setting because the dashboard
evidence required by step 1 is not available.

## Identity verification

With locked dependencies already installed, build and validate every app:

```text
node scripts/verify-site-identity.mjs
```

Validate a build already produced by the application matrix:

```text
node scripts/verify-site-identity.mjs --site Emerson_Empire --no-build
```

Optionally inspect public roots with read-only GET requests:

```text
node scripts/verify-site-identity.mjs --remote
```

Remote drift causes a nonzero exit. The comparison covers title, canonical URL,
Open Graph title, URL, site name, and release marker. Add `--report-only` only
when collecting an audit without treating known drift as success. Remote mode
fetches only the four manifest roots; it does not follow page links, execute
JavaScript, submit forms, authenticate, or change provider state. It is
intentionally not a required CI step because production availability must not
make deterministic source checks flaky.

## GitHub Pages

`deploy-epdg.yml` is a second deployment path for `EPDG-Landing-Page`. It uses
`DEPLOY_BASE_PATH=/Empire-emerson_frontend/`, creates an SPA `404.html`, and
deploys on qualifying `main` pushes. Its governance status is **awaiting founder
decision**. Until that decision is recorded, do not call it canonical, remove
the workflow, or publish its URL as an official replacement for Netlify.

## Release and rollback evidence

For each production change, retain the reviewed commit, CI run, exact provider
deploy identifier, mapping evidence, public identity result, browser QA, and
rollback target. Roll back code with a revert PR and providers through their
verified deployment history; never rewrite Git history or guess environment
values.
