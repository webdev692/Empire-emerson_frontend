# Lovable and Git governance

## Role of each system

- **GitHub `main`:** reviewed source of truth.
- **Pull requests and CI:** the approval and verification boundary.
- **Netlify:** the documented public production host for the four applications.
- **Lovable:** a design, prototype, or feature-development environment until a
  founder-approved project classification says otherwise.

Lovable Git synchronization can move changes in both directions, while a
published Lovable site can remain a snapshot until it is updated. Therefore a
public Lovable page is not proof that its current repository or production
state matches GitHub.

## Required operating model

1. Connect a Lovable project only to the intended repository and a dedicated
   feature branch.
2. Do not permit unattended direct synchronization into `main`.
3. Review generated changes in a pull request and run the same application and
   security checks as hand-authored changes.
4. Merge only reviewed work with preserved contributor attribution.
5. Treat Lovable publication and Netlify production as separate actions with
   separate evidence and rollback records.
6. Never place provider secrets, service-role keys, private records, intern
   data, applications, evaluations, or private messages into prompts, source,
   screenshots, or published projects.

## Authenticated inventory per project

Record names and identifiers only; never copy secret values.

| Field | Required evidence |
|---|---|
| Project purpose | Canonical, prototype, feature branch, event microsite, or archive |
| Repository | Exact owner and repository |
| Sync branch | Named feature branch; direct-to-`main` requires an explicit exception |
| Ownership | Current founder/admin workspace |
| Collaborators | Current authorized contributors only |
| Connectors | GitHub, Supabase, forms, email, and other integrations by name |
| Secrets | Variable names, owning provider, and rotation owner only |
| Published snapshot | Publication date and source revision if available |
| Custom domain | Whether it competes with a documented Netlify production property |
| Duplicate status | Active, superseded, or awaiting founder decision |

## Current decision register

The public Empire and Hub projects are observable, but their authenticated Git
repository, branch, ownership, collaborators, connectors, secrets, snapshot,
and domain mappings are unverified. Agency and EPDG Lovable states are also
unverified. Do not infer that an unverified project is broken, canonical, or
safe to delete.

Public Hub contact pathways also require an intentional founder privacy and
communications review. This repository work does not remove, replace, or invent
any contact destination.

## Drift response

If Lovable and GitHub differ, preserve both revisions, identify their source
commits/snapshots, and open a focused pull request that reconciles only reviewed
changes. Do not overwrite `main`, force-push, publish a snapshot, or repoint a
domain as a shortcut.
