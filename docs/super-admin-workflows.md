# EPDG Super Admin — Workflow Audit

**Audited:** 2026-06-21
**Codebase paths:**
- Frontend: `epdg/src/components/admin/`
- Backend: `epdg-backend-core/src/`

---

## Phase 1 — Documented Workflows (Current State)

---

### WF-01 · Platform Overview & Stats

**Trigger:** Admin logs in and lands on `/admin/dashboard`

**Steps:**
1. `AdminDashboard.tsx` mounts and calls `GET /api/admin/stats`
2. Backend aggregates: company count, school count, intern count, active placements, total pending approvals, latest 5 pending companies, latest 5 pending schools, pending intern count
3. Dashboard renders stat cards, a pending approvals panel, quick-action links, and an alerts row

**Files involved:**
- `epdg/src/components/admin/AdminDashboard.tsx`
- `epdg-backend-core/src/controllers/AdminController.ts` → `getStats()`
- `epdg-backend-core/src/services/AdminService.ts` → `getStats()`

**Data touched:** `users`, `companies`, `schools`, `intern_profiles`, `internship_slots`

**Status:** ✅ Fully working — all counts are live. Certificates count shows hardcoded `"—"` (not wired to `certificates` table yet). Activity feed is a placeholder.

---

### WF-02 · Company Onboarding & Approval

**Trigger:** A company self-registers → admin sees it in `CompanyApprovals`

**Steps:**
1. Admin navigates to `/admin/companies`
2. `CompanyApprovals.tsx` calls `GET /api/admin/users?role=company`
3. Admin views company card: name, industry, country, contact, website, employee count, registration date
4. Admin clicks **Approve** → `PATCH /api/admin/users/:id` with `{ status: "approved" }` → backend sends approval email
5. Or admin clicks **Reject** → enters reason → `PATCH /api/admin/users/:id` with `{ status: "rejected", rejection_reason }` → backend sends rejection email

**Files involved:**
- `epdg/src/components/admin/CompanyApprovals.tsx`
- `epdg-backend-core/src/controllers/AdminController.ts` → `updateUser()`
- `epdg-backend-core/src/services/AdminService.ts` → `updateUserStatus()`
- `epdg-backend-core/src/utils/emailService.ts` → `sendApprovalEmail()`, `sendRejectionEmail()`

**Data touched:** `users.status`, `users.rejection_reason`, `companies`

**Status:** ✅ Fully working. Email fires as fire-and-forget. "Add Partner" modal is a placeholder stub.

---

### WF-03 · Institution (School) Onboarding & Approval

**Trigger:** A school/university self-registers → admin sees it in `SchoolApprovals`

**Steps:** Identical flow to WF-02 with `role=school`. School cards additionally show school type (University / College / Polytechnic / TVET) with colour-coded badges.

**Files involved:**
- `epdg/src/components/admin/SchoolApprovals.tsx`
- Same backend as WF-02

**Data touched:** `users.status`, `users.rejection_reason`, `schools`

**Status:** ✅ Fully working.

---

### WF-04 · Intern Application Review & Placement Assignment

**Trigger:** Intern submits application → admin reviews in `ApplicationsReview`

**Steps:**
1. Admin navigates to `/admin/applications`
2. `ApplicationsReview.tsx` calls `GET /api/admin/users?role=intern` and `GET /api/admin/mentors`
3. Admin can filter by status: Pending / Approved / Rejected
4. Admin opens application card → reads name, email, phone, course, dates, cover letter
5. *(Optional)* Admin clicks **Analyse CV** → `GET /api/admin/users/:id/cv-analysis`
   - Backend fetches CV from `intern_profiles.cv_url`, parses skills, scores against open `internship_slots`, returns top recommendations
   - If no open slots exist, backend generates department suggestions from skill categories
6. Admin selects **Department** from dropdown (9 options) and **Mentor** from dropdown (live from DB)
7. Admin clicks **Approve** → `PATCH /api/admin/users/:id` with `{ status: "approved", department, mentor }` → approval email sent to intern
8. Or admin clicks **Reject** → enters reason → rejection email sent
9. Bulk approval: admin can tick multiple cards → click **Approve Selected**

**Files involved:**
- `epdg/src/components/admin/ApplicationsReview.tsx`
- `epdg-backend-core/src/controllers/AdminController.ts` → `updateUser()`, `getCvAnalysis()`
- `epdg-backend-core/src/services/AdminService.ts` → `updateUserStatus()`
- `epdg-backend-core/src/utils/cvParser.ts` (skill extraction)
- `epdg-backend-core/src/utils/emailService.ts`

**Data touched:** `users.status`, `intern_profiles.department`, `intern_profiles.mentor`, `internship_slots` (read-only for matching)

**Status:** ⚠️ Partially implemented.
- Approve / Reject with email: ✅ working
- CV analysis & skill extraction: ✅ working
- Slot matching algorithm: ✅ working
- Department suggestion fallback: ✅ working
- **Mentor assignment persists to DB: unconfirmed** — `mentor` field is passed to `updateUser()` but it is unclear from the service whether `intern_profiles.mentor_id` is updated or only `intern_profiles.mentor` (name string). No referential integrity check.
- **Bulk approve: UI only** — each approval fires separately; no atomic batch endpoint.
- Application-to-slot linking (`applications` table): not used in this flow — approval goes directly to `users`/`intern_profiles`, bypassing the `applications` table entirely.

---

### WF-05 · Mentor Account Creation & Credential Delivery

**Trigger:** Admin clicks **Add Mentor** in `MentorManagement`

**Steps:**
1. Admin navigates to `/admin/mentors`
2. `MentorManagement.tsx` calls `GET /api/admin/mentors` → shows mentor grid with capacity bars
3. Admin clicks **Add Mentor** → modal opens
4. Admin fills: name, email, department, max capacity. Frontend auto-generates a temporary password using `crypto.getRandomValues()` (character set excludes ambiguous chars)
5. Admin clicks **Add Mentor** → `POST /api/admin/mentors` with `{ name, email, password, department, max_capacity }`
6. Backend: checks email uniqueness → bcrypt hashes password → creates `users` row (`role="admin"`, `is_verified=true`) → creates `admins` row (`is_mentor=true`, department, max_capacity) → sends mentor welcome email with credentials
7. Frontend shows **Credentials modal** — one-time display of email + password with copy button
8. Mentor logs in at `/login` (admin tab) → if `force_password_change=true`, redirected to `/change-password`

**Files involved:**
- `epdg/src/components/admin/MentorManagement.tsx`
- `epdg-backend-core/src/controllers/AdminController.ts` → `createMentor()`
- `epdg-backend-core/src/services/AdminService.ts` → `createMentor()`
- `epdg-backend-core/src/utils/emailService.ts` → `sendMentorWelcomeEmail()`
- `epdg/src/components/mentor/MentorLayout.tsx`, `MentorDashboard.tsx`, `MentorInterns.tsx`

**Data touched:** `users` (role=admin, is_mentor via admins table), `admins` (is_mentor, department, max_capacity)

**Status:** ✅ Mostly working.
- Account creation + email: ✅
- Credentials modal: ✅
- `force_password_change` flag: set in DB but **not enforced in UI** — intern can skip `/change-password`
- **Password reset flow for existing mentors: not built** — no "Reset Password" button in the mentor card
- **Star ratings on mentor cards are hardcoded 0** — no rating system backend

---

### WF-06 · Internship Slot Creation & Management

**Trigger:** Admin clicks **+ Create Slot** in `SlotManagement`

**Steps:**
1. Admin navigates to `/admin/slots`
2. `SlotManagement.tsx` calls `GET /api/admin/slots` → renders slot cards
3. Admin clicks **+ Create Slot** → modal opens
4. Admin fills: title (required), department, status, description, requirements, skills (comma-separated), slots available, duration, stipend, deadline, county, remote checkbox
5. Admin submits → `POST /api/admin/slots` → backend inserts into `internship_slots` with `skills_required` stored as JSONB
6. Admin can **Edit** an existing slot → same modal pre-filled → `PATCH /api/admin/slots/:id`
7. Admin can **Delete** a slot → `DELETE /api/admin/slots/:id` (hard delete)
8. Admin can change slot status inline via dropdown (draft → open → closed → filled)

**Files involved:**
- `epdg/src/components/admin/SlotManagement.tsx`
- `epdg-backend-core/src/controllers/AdminController.ts` → `getSlots()`, `createSlot()`, `updateSlot()`, `deleteSlot()`
- `epdg-backend-core/src/services/AdminService.ts`

**Data touched:** `internship_slots`

**Status:** ✅ Fully working. Delete is hard (no soft-delete / archive). No notification sent to interns when a matching slot opens.

---

### WF-07 · Certificate Issuance & Verification

**Trigger:** Admin clicks **Issue Certificate** in `CertificateManagement`

**Steps:**
1. Admin navigates to `/admin/certificates`
2. Page loads: `GET /api/admin/certificates`, `GET /api/admin/certificate-templates`, `GET /api/admin/users?role=intern`
3. Admin clicks **Issue Certificate** → modal opens
4. Admin searches intern by name/email (live filter against loaded intern list)
5. Admin selects intern → fills programme name (optional — defaults to `{department} Internship Programme`), issue date, template
6. Admin clicks **Issue Certificate** → `POST /api/admin/certificates`
7. Backend:
   - Fetches intern details + department from `users` + `intern_profiles`
   - Generates certificate number: `EPDG-{YEAR}-{DEPTCODE}-{NNNN}`
   - Pre-generates UUID with `crypto.randomUUID()`
   - Computes HMAC-SHA256 integrity hash using `CERT_SIGNING_SECRET`
   - Generates A4 landscape PDF using `pdf-lib` with QR code (via `qrcode` package) pointing to `/verify/{uuid}`
   - Uploads PDF to Supabase Storage (`certificates` bucket) — fire-and-forget
   - Inserts row into `certificates` table
8. Frontend shows success banner with certificate number, PDF download link, Revoke button
9. Admin can **Revoke** any active certificate → `PATCH /api/admin/certificates/:id/revoke` → status set to `revoked` (never deleted)
10. Public verification: anyone visits `/verify/:certificateId` → `GET /api/verify/:certificateId` → backend recomputes HMAC, timing-safe compares, returns public fields

**Files involved:**
- `epdg/src/components/admin/CertificateManagement.tsx`
- `epdg/src/components/CertificateVerify.tsx`
- `epdg-backend-core/src/controllers/CertificateController.ts`
- `epdg-backend-core/src/services/CertificateService.ts`
- `epdg-backend-core/src/utils/certificatePdf.ts`
- `epdg-backend-core/src/routes/verifyRoutes.ts` (public, no auth)
- `epdg-backend-core/src/db/migrations/020-certificates.sql`

**Data touched:** `certificates`, `certificate_templates`, `users`, `intern_profiles`

**Status:** ⚠️ Partially working.
- PDF generation, HMAC hashing, DB insert: ✅
- Public verify page: ✅
- Supabase PDF upload: ✅ (when `CERT_SIGNING_SECRET` + Supabase env vars are set)
- **`CERT_SIGNING_SECRET` must be set in Railway env** — if missing, issue endpoint throws and cert is not created
- **`certificates` table column mismatch**: if migration 020 ran against an older schema, `intern_id` column may be absent → `listCertificates` query fails. Migration 021 patches this with `ALTER TABLE … ADD COLUMN IF NOT EXISTS`.
- **Intern search shows empty if `GET /api/admin/certificates` fails** — `Promise.all` rejection causes all three parallel fetches to fail. Fixed in frontend to use `Promise.allSettled`.
- Certificates count on AdminDashboard: hardcoded `"—"` — not wired to live count.

---

### WF-08 · Broadcast Notifications

**Trigger:** Admin composes a message in `NotificationsCenter`

**Steps:**
1. Admin navigates to `/admin/notifications`
2. Admin selects audience (All / Interns / Companies / Institutions / Mentors), enters subject + message (500 char max)
3. Admin clicks **Send Announcement**

**Files involved:**
- `epdg/src/components/admin/NotificationsCenter.tsx`

**Data touched:** None (no backend connected)

**Status:** ❌ Stubbed — frontend-only. No API endpoint exists. Sent history, read rates, and system events log are all hardcoded mock state. Notification preferences toggles have no backend.

---

### WF-09 · Placement Lifecycle Tracking

**Trigger:** Admin navigates to `/admin/placements`

**Steps:**
1. Admin views placements with stats: active, ending soon, completed, terminated
2. Admin filters by status / department / company
3. Admin views a placement detail modal (start date, end date, mentor, progress bar)
4. Admin can **End Placement Early** → enters termination reason

**Files involved:**
- `epdg/src/components/admin/PlacementManagement.tsx`

**Data touched:** None (no backend connected)

**Status:** ❌ Stubbed — `placements` array is hardcoded as `[]`. No API endpoint. No `placements` table in any migration file. The end-early action and detail modal are fully built in UI but call no API.

---

### WF-10 · Gamification — Points, Badges & Leaderboard

**Trigger:** Admin navigates to `/admin/gamification`

**Steps:**
1. Admin views leaderboard (month / all-time toggle), top 3 podium, rank 4-10 table
2. Admin searches intern name in Manual Adjustment panel → applies point delta with reason
3. Adjustment updates local leaderboard state and local audit log
4. Admin awards a badge from the badge grid → searches intern → confirms

**Files involved:**
- `epdg/src/components/admin/GamificationAdmin.tsx`

**Data touched:** None (no backend connected)

**Status:** ❌ Stubbed — all data is React state seeded from hardcoded arrays. No API endpoints. No gamification table in any migration. Point rules, badge definitions, and leaderboard data are all static.

---

### WF-11 · User Management (Direct CRUD)

**Trigger:** Admin navigates to `/admin/users`

**Steps:**
1. Admin calls `GET /api/admin/users` with optional filters (role, status, search)
2. Admin views table: name, email, role badge, status badge, last login
3. Admin clicks **+ Create User** → modal → fills name, email, password, role → `POST /api/admin/users`
4. Admin clicks **Delete** on a user → confirmation modal → `DELETE /api/admin/users/:id` (soft delete: sets `deleted_at`)

**Files involved:**
- `epdg/src/components/admin/UserManagement.tsx`
- `epdg-backend-core/src/controllers/AdminController.ts` → `getUsers()`, `createUser()`, `deleteUser()`

**Data touched:** `users`, `intern_profiles`, `companies`, `schools`

**Status:** ✅ Mostly working.
- List, create, soft-delete: ✅
- **No edit user form** — `PATCH /api/admin/users/:id` endpoint exists but is not exposed in the UI (no edit button in the table)
- **No role change UI** — admins cannot change a user's role from the dashboard
- **No password reset for regular users** — only mentors get an auto-generated password at creation

---

### WF-12 · Cohort Analytics

**Trigger:** Admin navigates to `/admin/analytics`

**Files involved:**
- `epdg/src/components/admin/CohortAnalytics.tsx`

**Status:** ❌ Stubbed — metric cards show `—`. No API endpoint. No cohort data model in migrations.

---

### WF-13 · Resource Management

**Trigger:** Admin navigates to `/admin/resources`

**Files involved:**
- `epdg/src/components/admin/ResourceManagement.tsx`

**Status:** ❌ Stubbed — empty state. No API. No resources table in migrations.

---

### WF-14 · Feedback Overview

**Trigger:** Admin navigates to `/admin/feedback`

**Files involved:**
- `epdg/src/components/admin/FeedbackOverview.tsx`

**Status:** ❌ Stubbed — empty state. No API. No feedback table linked to admin review workflow.

---

### WF-15 · Platform Settings

**Trigger:** Admin navigates to `/admin/settings`

**Files involved:**
- `epdg/src/components/admin/PlatformSettings.tsx`

**Status:** ❌ Stubbed — all toggles are local React state. No API. No settings table.

---

### Role & Permission Architecture — Current State

| Layer | Mechanism | Notes |
|---|---|---|
| JWT auth | `authMiddleware` on all `/api/admin/*` routes | Validates token, extracts `user.id` + `user.role` |
| Role guard | `roleGuard('admin')` | Checks `user.role === 'admin'` — **no super_admin distinction in route guards** |
| DB distinction | `admins.admin_role` ENUM (`admin`, `super_admin`) | Exists in schema but **never read in any controller** |
| Mentor sub-role | `admins.is_mentor = true` | Used to populate mentor dropdown; mentor UI gated by `ProtectedRoute mentorOnly` prop |
| Force password change | `users.force_password_change` | Set on mentor creation but **not enforced by any redirect in the UI** |

**Summary:** The platform currently has no functional super_admin tier. All `role=admin` users have identical access. The DB column exists but the application ignores it.

---

## Phase 2 — Gap Analysis & Strategic Recommendations

---

### REC-01 · Activate the Super Admin Tier

**Why this matters:** Every admin today has identical god-mode access. A branch lead can delete another branch lead's placements. A mentor who was elevated to admin can revoke certificates or delete users. There is no separation of concern, no accountability, and no way to delegate safely.

**Proposed workflow design:**
- Read `admins.admin_role` in `roleGuard` → create a new `superAdminGuard` middleware
- Protect destructive/financial endpoints (DELETE users, revoke certificates, bulk approve, settings) behind `superAdminGuard`
- Add `admin_role` field to the JWT payload so the frontend can conditionally render elevated controls
- In `AdminLayout.tsx`, hide Settings, GamificationAdmin, and CertificateManagement revoke actions from non-super admins
- Add a **Promote / Demote** control in `UserManagement.tsx` restricted to super admins only

**Data model implications:** `admins.admin_role` already exists. No migration needed — only route guards and JWT claim changes.

**Who it touches:** All admin users, especially mentor-admins who should not have cross-platform delete access.

**Trust & defensibility:** Creates a clear audit trail of who can do what. A spreadsheet or generic SaaS tool cannot replicate tiered permission chains tied to real operational roles.

---

### REC-02 · Placement Lifecycle — Full Backend Implementation

**Why this matters:** Placements are the core product. The admin currently has zero visibility into which interns are placed, how long they have been running, who their mentor is, and whether anything is at risk. Everything is hardcoded `[]` in the UI.

**Proposed workflow design:**
- New migration: `placements` table
  ```sql
  CREATE TABLE placements (
    id SERIAL PRIMARY KEY,
    intern_id INTEGER REFERENCES users(id),
    slot_id INTEGER REFERENCES internship_slots(id),
    mentor_id INTEGER REFERENCES users(id),
    company_id INTEGER REFERENCES companies(id),
    department VARCHAR(100),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','ending_soon','completed','terminated')),
    termination_reason TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  ```
- When admin approves an intern application (WF-04), auto-insert a `placements` row using the assigned slot, mentor, and department
- `GET /api/admin/placements` → join placements → users, companies, internship_slots, admins (mentor)
- `PATCH /api/admin/placements/:id` → update status or termination_reason
- Wire `PlacementManagement.tsx` to these endpoints (UI is already fully built)

**Who it touches:** Interns (visible on their dashboard), mentors (see their assigned interns), companies (visibility into who is placed with them).

**Trust & defensibility:** A placement history that spans cohorts becomes an irreplaceable record of outcomes — no spreadsheet can replicate a live timeline with termination reasons, mentor changes, and completion dates tied to real user accounts. Over time this data powers outcome reporting to institutional partners.

---

### REC-03 · Broadcast Notifications — Backend & Read Tracking

**Why this matters:** Admins currently compose messages that go nowhere. There is no way to communicate platform-wide announcements, deadline reminders, or policy changes to any user group. This is a critical operational gap — without it, EPDG relies on external email or WhatsApp to communicate with its own platform users.

**Proposed workflow design:**
- New migration: `announcements` table + `announcement_reads` table
  ```sql
  CREATE TABLE announcements (
    id SERIAL PRIMARY KEY,
    subject VARCHAR(200) NOT NULL,
    body TEXT NOT NULL,
    audience VARCHAR(20) NOT NULL CHECK (audience IN ('all','intern','company','school','mentor')),
    sent_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE announcement_reads (
    announcement_id INTEGER REFERENCES announcements(id),
    user_id INTEGER REFERENCES users(id),
    read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (announcement_id, user_id)
  );
  ```
- `POST /api/admin/announcements` → insert row + fan-out in-app notifications (or trigger email batch)
- `GET /api/admin/announcements` → list with read counts (LEFT JOIN announcement_reads)
- On intern/company/mentor dashboard mount, call `GET /api/notifications/unread` → show badge count
- Wire `NotificationsCenter.tsx` to real API (UI is fully built)

**Who it touches:** All user roles — each sees their unread announcement count and message list.

**Trust & defensibility:** In-platform messaging creates a communication record tied to accounts. External WhatsApp threads cannot be audited, tracked for read rates, or linked to specific cohort actions. An admin who can prove 94% of interns read a policy update has a defensible compliance paper trail.

---

### REC-04 · Gamification — Points Engine & Badge System Backend

**Why this matters:** The leaderboard, point rules, and badge awards are fully built in the UI but fire against no database. Every page refresh resets all data. This means no intern retention incentive is actually working.

**Proposed workflow design:**
- New migration: `point_events` and `badges` tables
  ```sql
  CREATE TABLE point_events (
    id SERIAL PRIMARY KEY,
    intern_id INTEGER REFERENCES users(id),
    points INTEGER NOT NULL,
    reason VARCHAR(200),
    event_type VARCHAR(50),
    awarded_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE badges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100), description TEXT, emoji VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE badge_awards (
    id SERIAL PRIMARY KEY,
    badge_id INTEGER REFERENCES badges(id),
    intern_id INTEGER REFERENCES users(id),
    awarded_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  ```
- `GET /api/admin/leaderboard` → aggregate `SUM(points)` per intern, support month/all-time filter
- `POST /api/admin/point-events` → manual admin adjustment (already in UI)
- `POST /api/admin/badge-awards` → award badge to intern
- Auto-award points from existing events: task submission, mentor session booking, portfolio upload (hook into existing controllers)

**Who it touches:** Interns (leaderboard on their dashboard), mentors (can award points per session), admins (audit trail of all point events).

**Trust & defensibility:** A leaderboard with 6 months of real point history tied to verifiable task completions creates an engagement layer no competitor can replicate instantly. Intern rankings become a proxy for employer recommendations — a company that used EPDG once and saw top-ranked interns outperform has a reason to return.

---

### REC-05 · Audit Trail — Admin Action Log

**Why this matters:** Currently there is no record of which admin approved which intern, who issued which certificate, who deleted a user, or who changed a slot status. If a disputed action occurs (wrongful rejection, revoked cert, deleted account), there is no way to reconstruct what happened or hold anyone accountable.

**Proposed workflow design:**
- New migration: `audit_log` table
  ```sql
  CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50),
    target_id VARCHAR(100),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  ```
- Middleware or service-layer helper: `logAuditEvent(adminId, action, targetType, targetId, metadata)`
- Hook into: `updateUserStatus`, `deleteUser`, `issueCertificate`, `revokeCertificate`, `createMentor`, `deactivateMentor`, `createSlot`, `deleteSlot`
- `GET /api/admin/audit-log` → paginated, filterable by admin, action type, date range
- Wire `NotificationsCenter.tsx` System Events table to this endpoint (UI already has the table structure)

**Who it touches:** Super admins (read access), individual admins (their own log), external compliance if required.

**Trust & defensibility:** An audit log that spans months and years becomes the platform's most defensible asset. No SaaS alternative can import historical accountability records. Institutional partners (schools, government programmes) increasingly require audit trails for accreditation.

---

### REC-06 · Enforce Force-Password-Change for Mentors

**Why this matters:** Every mentor is created with an auto-generated temporary password visible in the credentials modal. The `force_password_change` flag is set in the database but the application never acts on it — mentors can use the temporary password indefinitely, which is a security risk.

**Proposed workflow design:**
- In `ProtectedRoute.tsx` (or `App.tsx` route guard): after login, check `user.force_password_change === true` → redirect to `/change-password` regardless of intended destination
- `ChangePassword.tsx` already exists — on successful password change, `PATCH /api/auth/change-password` should set `force_password_change = false` in the DB
- Confirm the backend `changePassword` handler clears this flag (verify `adminRoutes` or `authRoutes`)

**Data model implications:** `users.force_password_change` column already exists. No migration needed.

**Who it touches:** Only newly created mentor accounts on first login.

---

### REC-07 · Cohort Analytics — Live Metrics Backend

**Why this matters:** The analytics page is the most visible proof of platform value to institutional partners and funders. Currently it shows `—` for every metric. A partner asking "how many interns completed their programme this cohort?" cannot be answered from the platform.

**Proposed workflow design:**
- Define cohort as a time-bounded group: add `cohort_id` or `cohort_name` field to `placements` table (from REC-02)
- `GET /api/admin/analytics` → compute:
  - Completion rate: `placements WHERE status='completed' / total placements`
  - Placement success: interns with placement / total approved interns
  - Mentor satisfaction: average from future feedback table
  - Cohorts active: distinct cohort values where any placement is active
- Wire `CohortAnalytics.tsx` cards to this endpoint
- Add a time-range filter (current cohort / last 3 months / all time)

**Data model implications:** Requires `placements` table (REC-02) and optionally a `cohorts` reference table.

**Who it touches:** Admins, institutional partners (via exported reports), funders.

**Trust & defensibility:** Live cohort metrics tied to real placements and completions are impossible to fake and impossible to replicate in a spreadsheet at scale. Each cohort's data permanently compounds the platform's institutional credibility.

---

### REC-08 · Feedback Collection & Admin Review Pipeline

**Why this matters:** The `FeedbackOverview` page exists with a full UI (status filters, mark-actioned buttons, star ratings) but receives no data. There is no mechanism for interns, mentors, or companies to submit feedback that admins can act on.

**Proposed workflow design:**
- New migration: `feedback` table
  ```sql
  CREATE TABLE feedback (
    id SERIAL PRIMARY KEY,
    from_user_id INTEGER REFERENCES users(id),
    category VARCHAR(50) CHECK (category IN ('platform','mentor','placement','general')),
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new','reviewed','actioned')),
    reviewed_by INTEGER REFERENCES users(id),
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  ```
- `POST /api/feedback` (authenticated, any role) → submit feedback
- `GET /api/admin/feedback` → admin list with filters
- `PATCH /api/admin/feedback/:id` → mark reviewed / actioned
- Add a feedback button to intern dashboard, mentor dashboard, and company dashboard
- Wire `FeedbackOverview.tsx` to these endpoints (UI is already built)

**Who it touches:** All roles (submit), admins (review and action).

**Trust & defensibility:** A feedback history linked to real user accounts — with response rates, resolution times, and rating trends over cohorts — gives EPDG operational data no competitor starting from scratch can acquire. It also creates a virtuous loop: interns who see their feedback actioned engage more.

---

### REC-09 · Resource Library — Backend & Content Pipeline

**Why this matters:** The `ResourceManagement` page exists with a full UI but no data. Interns currently receive no structured learning resources through the platform. Every guide, template, and tool has to be shared externally (WhatsApp, Google Drive), which means the platform adds no retention value between sessions.

**Proposed workflow design:**
- New migration: `resources` table
  ```sql
  CREATE TABLE resources (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    type VARCHAR(20) CHECK (type IN ('guide','tool','template','video')),
    url TEXT,
    description TEXT,
    target_role VARCHAR(20),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
    created_by INTEGER REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  ```
- `GET /api/admin/resources` + `POST` + `PATCH` + `DELETE`
- `GET /api/resources` (intern-facing, returns published only)
- Wire `ResourceManagement.tsx` to these endpoints
- Surface resources in intern dashboard as a "Library" section

**Trust & defensibility:** A curated, version-controlled resource library tied to departments and cohort stages creates a proprietary content layer. Interns who find value in the library return to the platform even outside of active tasks.

---

### REC-10 · Platform Settings — Persistence Layer

**Why this matters:** All settings toggles (open registration, data retention, session limits, notification preferences) are local React state that reset on every page load. Changing a setting has no effect on the platform's actual behaviour.

**Proposed workflow design:**
- New migration: `platform_settings` table (key-value store)
  ```sql
  CREATE TABLE platform_settings (
    key VARCHAR(100) PRIMARY KEY,
    value TEXT NOT NULL,
    updated_by INTEGER REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  ```
- Seed with defaults: `open_registration=true`, `data_retention_months=12`, `platform_alerts=true`
- `GET /api/admin/settings` → return all keys as object
- `PATCH /api/admin/settings` → upsert key-value pairs (super admin only per REC-01)
- Backend reads `open_registration` in `POST /api/auth/register` to block new signups if false
- Wire `PlatformSettings.tsx` toggles to the API

**Trust & defensibility:** Settings persistence means EPDG can operate as a real software product with controlled rollouts, maintenance windows, and policy enforcement — not a prototype that resets state on refresh.
