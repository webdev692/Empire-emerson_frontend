# Emerson Agency Agents on Netlify — operating playbook

Status: REVIEW-ONLY configuration. These files do NOT install agents, run a paid Netlify task, connect accounts, publish changes, or create scheduled automation.

## Architecture and boundaries

Use **Netlify Agent Runners** (not local Codex credits) for bounded site-code tasks. Each run invokes one supported coding agent (Codex, Claude Code, Gemini, or OpenCode where available) and gives it **selected Agency Agents role instructions** as reference material. Role names alone are not proof of separate autonomous running agents. Treat a "team" as a *disciplined sequence of roles* in a reviewed task unless Netlify demonstrably supports actual delegated subagents in that environment.

This is the source repository for:
- TEE public website: Netlify project **theemerson**, app folder **Emerson_Empire**. Follow [TEE.md](TEE.md).
- TEA public website: Netlify project **emersonagency**, app folder **Agency_LandingPage**. Follow [TEA.md](TEA.md).
- EPDG public website: Netlify project **emersonprofessionaldevelopment**, app folder **EPDG-Landing-Page**. Follow [EPDG.md](EPDG.md).
- EPDG member dashboard: Netlify project **epdg**, separate app folder **epdg**. Handle this separately from the public EPDG site; sensitive login/auth work requires special review under [EPDG.md](EPDG.md).
These Netlify project mappings are observed account/project names plus known repository folders; **verify each site's effective base/publish settings** before a Build run.

Repository-level `AGENTS.md` always takes precedence, including privacy restrictions, intern-authorship protection, validation, and release logging. Public site files must not be treated as permission to view private applicant/student/client data.

## Role selection

See [ROLE_REGISTRY.json](ROLE_REGISTRY.json): 19 **pinned upstream** role-instruction references from the original open-source Agency Agents project. Start with the shared triad **Project Shepherd → Frontend Developer (or task-specific specialist) → Evidence Collector / Reality Checker**, and add a fourth expert only when justified. The Studio Producer and Brand Guardian provide cross-company planning and editorial review as needed; they are not standing, billable processes.

Do not load the entire catalog into one context or call every specialist per task. Limit scope to one site, a small feature set, and only 2–4 role profiles per run. Link or attach the exact source Markdown for chosen roles. Cite role source URLs and the pinned version in the task report. If remote fetching fails, ask for attachment rather than pretending to use the full profile.

## Human approval gates

1. **Ask mode**: read only; understand files, verify current build state, and propose scoped changes. No production data export.
2. **Build mode**, only after an owner requests implementation: branch and preview; verify against exact source commit; use app-defined build/lint/tests, accessibility and privacy checks.
3. **Release**: founder or authorized reviewer checks diff, tests, screenshot evidence, program claims, public content, permissions, forms, and resulting preview before merging or publishing. Never auto-merge/publish.
4. **High-risk changes**: stop and request separate approval before touching auth, RBAC/RLS, database writes/migrations, billing, production environment variables, school/child/student records, client records, external messages, or third-party integrations.

Any agent communication mentioning "done" must separate *proposed*, *changed locally*, *committed*, *build passed*, *preview deployed*, and *published*. No fake QA passes or invented sources.

## Credit controls

All three public projects and the member dashboard are on the same Netlify team. Agent Runner inference draws from that team's Netlify credit pool; compute and other metered features can also consume credits. Set a **team-wide AI Credit Usage Limit** and optional **per-member limits** at Team settings > AI enablement before launching a large batch. This controls Agent Runner inference, **not** ordinary AI Gateway spend on non-Enterprise plans. Avoid automatic recharge without explicit budget approval. Start with one Ask run per site and no more than one active Build run during the initial rollout, despite higher technical concurrency limits.

## Outputs required per task

Site/project, scope, responsible role(s), requested change, files modified, source version, before/after evidence, commands executed with exit status, remaining checks, deploy preview and ID, credit usage if exposed, accessibility/privacy concerns, approval/rollback plan. Update the release log only for relevant app/release changes. Never place personal or sensitive data in logs or source control.

## Getting started

Use [NETLIFY_PROMPTS.md](NETLIFY_PROMPTS.md) to paste each site's compact project context into Netlify. Start with an Ask-mode inventory so the role mappings are validated before Build tasks. This repo's docs are a **team blueprint**; no live agent has been started simply by merging them.
