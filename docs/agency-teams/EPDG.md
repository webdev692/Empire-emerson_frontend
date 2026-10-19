# EPDG — Emerson Professional Development Group

**Public project:** Netlify \`emersonprofessionaldevelopment\`, folder \`EPDG-Landing-Page\`.
**Separate login/dashboard project:** Netlify \`epdg\`, folder \`epdg\`.
Motto: **Education Without Borders**. Educational, workforce and professional-development focus; **do not add sales pipelines here**.

## Priorities
1. Public catalog of classes, educational programs, certificates and clearly stated eligibility/outcomes.
2. GIP educational materials and student pathways where approved; avoid promises of automatic academic credit/certification.
3. Member dashboard design for founder/admin, team leads, instructors, interns, students, clients and partnering-school reviewers — design permissions based on verified requirements, not assumptions.
4. Learning experience features: curricula, 18-week course sequences, assignments, due dates, attendance, submissions, feedback, progress, school-approved views and accessible communications.
5. Enrollment and records: separate public information from authenticated data and conduct a privacy impact and role/permission review before any implementation.

## Suggested role chain
- Product Manager — personas, functional and nonfunctional requirements.
- Corporate Training Designer — curriculum/course structure and evidence of learning.
- UX Researcher — role-specific learner and school journeys.
- Backend Architect — data model and secure boundaries.
- Identity & Access Engineer + Privacy Engineer — least privilege, consent, auditing, applicant/student/child data minimization.
- Frontend Developer — reviewed user interface only.
- Evidence Collector + Reality Checker — permissions and accessibility test evidence.

## Mandatory access and privacy rules

Use fictitious test records; never ingest real school, minor, intern, applicant or client files into a public repo or AI task prompt. Require separate founder sign-off on real authentication, role definitions, school visibility, parental consent requirements where relevant, RLS/database policies, invitations, integrations, migrations or real student records. A school must see only explicitly authorized records of its own students, with consent and verified institutional authorization; no cross-school browse/search. Do not claim FERPA, COPPA, GDPR or WCAG compliance absent formal review and evidence.

**Recommended first Ask task — public EPDG:** Inventory existing public program/class pages and draft an accurate hierarchy, navigation plan and content gaps; no edits.

**Recommended separate Ask task — EPDG login:** Audit the existing \`epdg\` app's auth, roles, RLS, least-privilege data flows and UI states. Propose a phased blueprint for school reviewers and student submissions with threat model and privacy controls. NO implementation, database writes, permission changes or test accounts until reviewed.
