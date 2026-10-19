# Netlify Agent Runner starter prompts — copy into the correct project

Use each website's **Build with an AI agent → Codex → Ask**. Attach or link only the 2–4 relevant official Agency Agents role instructions listed in ROLE_REGISTRY.json (pinned GitHub source URLs). Paste the applicable **Project context** below into Netlify's persistent project context field (or add it to the task when that field is unavailable). The roles are referenced instructions, **not automatically provisioned simultaneous agents**.

## TEE context — theemerson
\`\`\`text
Repository: webdev692/Empire-emerson_frontend
This project is TEE / Emerson_Empire only. Read AGENTS.md and docs/agency-teams/README.md, then docs/agency-teams/TEE.md and ROLE_REGISTRY.json before work. Protect other app folders. Use selected real Agency Agents Markdown profile(s) from pinned sources; if unavailable disclose that limitation. Execute a short sequence: Project Shepherd scope -> chosen implementer/expert -> Evidence Collector and Reality Checker evidence. Preserve all approved TEE content, branding, links, pricing and existing verified navigation/dialog work. No private records, form submissions or unsolicited outreach. Ask first; Build only on a new reviewable branch with preview and validation. Never publish or merge automatically.
\`\`\`

**First Ask:** Identify current TEE resource-search and program routes. Confirm the requirements against current code. Propose 3 prioritized website improvements with exact affected files, chosen role profiles, acceptance criteria, risk, test plan, and estimated scope. Do not edit or publish.

## TEA context — emersonagency
\`\`\`text
Repository: webdev692/Empire-emerson_frontend
This project is TEA / Agency_LandingPage only. Read AGENTS.md, docs/agency-teams/README.md, docs/agency-teams/TEA.md and ROLE_REGISTRY.json. Use exact upstream Agency Agents profile instructions selected for this assignment. Keep the approved services and pricing, preserve third-party forms, avoid unsupported Project Studio claims. Sequence roles: Project Shepherd -> UX Architect/Content Creator or Frontend Developer -> Code Reviewer/Reality Checker. Draft only for outreach or proposals. Do not access sensitive client data. No cross-app edits, production publish, merge, or external sends without explicit approval.
\`\`\`

**First Ask:** Audit Pathways, services, pricing, Project Studio mentions and contact CTAs in Agency_LandingPage. Return content consistency gaps, broken navigation if any, accessibility risks and the top three scoped changes. No edits or publication.

## EPDG public context — emersonprofessionaldevelopment
\`\`\`text
Repository: webdev692/Empire-emerson_frontend
This project is the public EPDG site / EPDG-Landing-Page ONLY. Follow AGENTS.md and docs/agency-teams/README.md, EPDG.md and ROLE_REGISTRY.json. EPDG means education and professional development, not sales. Use Project Shepherd -> Corporate Training Designer/Product Manager -> Frontend Developer -> Reality Checker roles as needed, loading role profiles explicitly from pinned Agency Agents instructions. Preserve existing approved classes, programs, applications, disclaimers and URLs. Do not claim course credit, licensure or outcomes not verified. Plan in Ask mode first, then use branch/preview for approved Build changes. Do not publish or modify the separate epdg login dashboard without a separate reviewed task.
\`\`\`

**First Ask:** Inventory current EPDG class/program pages, their navigation and existing curriculum references. Propose an information architecture and top three accessible educational-content improvements, with exact file references. No edits or publication.

## Separate EPDG login context — epdg
\`\`\`text
This is the separate EPDG member portal in folder epdg, not the public EPDG landing site. Before any login or school visibility change, read AGENTS.md, docs/agency-teams/README.md, docs/agency-teams/EPDG.md, and existing authorization/RLS docs. In Ask mode, use Product Manager, Identity & Access Engineer and Privacy Engineer reasoning to audit founder/admin, lead, intern, student, client, and school-reviewer role needs. Demand tenant isolation and explicit approval for school/student access. Only fictitious data; never modify production credentials, RLS, migrations or real records in this discovery task.
\`\`\`

**First Ask:** Map the existing authentication implementation and data access policies by role, identify risks, and return a staged implementation proposal. Absolutely no Build in this run.

## Every subsequent Build task
\`\`\`text
Implement ONLY the previously reviewed acceptance criteria for [one specific site/feature]. Load the matching local team guidelines and 2–4 chosen pinned Agency Agents instructions. Do not touch sibling apps. Keep changes reviewable. Run required build, lint, tests and current-source browser checks when available. Return diff summary, verification results, limitations, source commit, Deploy Preview, rollback notes, and credit usage when shown. No publish/merge, no outbound messages and no unapproved sensitive data access.
\`\`\`

Credit-budget action for team owner: Netlify Team settings > AI enablement > AI usage limits > Configure. Set an Agent Runner inference cap for the team, plus member limits if appropriate. AI Gateway inference is not covered by that cap on most non-Enterprise plans. Check Usage & billing after each trial.
