# EPDG Admin Panel — System Documentation

> **Stack:** React 19 + TypeScript + Vite + Tailwind CSS v4 (frontend) · Express + TypeScript + PostgreSQL (backend on Railway)

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Authentication & Role System](#2-authentication--role-system)
3. [Admin Panel Pages](#3-admin-panel-pages)
4. [API Reference](#4-api-reference)
5. [Database Tables](#5-database-tables)
6. [Audit Trail](#6-audit-trail)
7. [Gamification System](#7-gamification-system)
8. [Certificate System](#8-certificate-system)
9. [Appearance & Mood Themes](#9-appearance--mood-themes)
10. [Super Admin Controls](#10-super-admin-controls)

---

## 1. Architecture Overview

```
Browser (React SPA)
       │
       │  JWT in Authorization header
       ▼
Express API  ─────────────────────────────────────────────────────────
  authMiddleware  → validates JWT, attaches req.user { id, email, role, admin_role }
  roleGuard('admin') → blocks non-admin users (403)
  superAdminGuard    → blocks admin users who are not super_admin (403)
       │
       ▼
AdminService / AdminController / CertificateController
       │
       ▼
PostgreSQL (Railway)  ← migrations run automatically on server start
```

**Frontend state** is managed with:
- **Zustand** — `authStore` (user session) and `themeStore` (mood/appearance)
- Both stores persist to `localStorage`

**All API calls** go through `src/lib/axios.ts` which automatically injects the stored JWT token.

---

## 2. Authentication & Role System

### Login flow

1. User submits email + password to `POST /api/auth/login`
2. Backend queries `users` table, verifies bcrypt password
3. If role is `admin`, also queries `admins` table for `admin_role`, `is_mentor`, `force_password_change`
4. JWT is signed with `{ id, email, role, admin_role }` — expires in **30 days**
5. Frontend stores token + user object in `authStore` (localStorage)
6. `ProtectedRoute` reads the store; if `force_password_change = true` it redirects to `/change-password`

### Admin role tiers

| Field | Value | Access |
|---|---|---|
| `users.role` | `admin` | Can access all `/admin/*` routes |
| `admins.admin_role` | `admin` | Standard admin — cannot delete users, slots, mentors, resources, or revoke certificates |
| `admins.admin_role` | `super_admin` | Full access including destructive actions and platform settings write |

### Middleware chain on every admin route

```
authMiddleware  →  roleGuard('admin')  →  [optional superAdminGuard]  →  handler
```

### Mentor sub-role

An admin with `admins.is_mentor = true` also has access to `/mentor/*` routes (separate mentor dashboard).

### Password change enforcement

If `admins.force_password_change = true` the admin is redirected to `/change-password` by `ProtectedRoute`. The flag is cleared automatically when `changePassword()` succeeds.

---

## 3. Admin Panel Pages

The admin panel lives at `/admin/*`. All pages are protected by `ProtectedRoute allowedRoles={["admin"]}`.

### Layout — `AdminLayout.tsx`

- Collapsible sidebar (icon rail on desktop, full-width overlay on mobile)
- Sidebar colour, border, and active nav highlight all respond to the current **mood theme**
- Menu items marked `superOnly: true` are hidden from standard `admin` accounts

---

### 3.1 Dashboard — `/admin/dashboard`

**Component:** `AdminDashboard.tsx`  
**API:** `GET /api/admin/stats`

Displays 6 live stat cards:

| Card | What it counts |
|---|---|
| Companies | Active company accounts |
| Institutions | Active school accounts |
| Interns | Active intern accounts |
| Active Placements | Placements with status `active` |
| Certificates | Active (non-revoked) certificates |
| Pending Approvals | Companies + schools + interns awaiting review |

Also shows a quick-access list of recently registered companies and schools pending approval.

---

### 3.2 User Management — `/admin/users`

**Component:** `UserManagement.tsx`  
**API:** `GET /api/admin/users`, `POST /api/admin/users`, `PATCH /api/admin/users/:id`, `DELETE /api/admin/users/:id` *(super admin)*, `PATCH /api/admin/users/:id/role` *(super admin)*

Features:
- Search by name or email
- Filter by role (`admin`, `company`, `school`, `intern`) and status (`approved`, `pending`, `rejected`, `unverified`)
- **Create User** modal — manually register any role with a temporary password
- **Approve / Reject** any pending user inline
- **Delete** (soft-delete, sets `deleted_at`) — super admin only
- **Make Super** — promote an admin to `super_admin` — super admin only
- Last login shown as relative time ("2h ago", "Just now")

---

### 3.3 Applications — `/admin/applications`

**Component:** `ApplicationsReview.tsx`  
**API:** `GET /api/admin/applications`

Lists all intern applications with:
- Extracted CV skills (AI-parsed)
- Company slot the intern applied to
- Approve / reject controls

---

### 3.4 Company Approvals — `/admin/companies`

**Component:** `CompanyApprovals.tsx`  
**API:** `GET /api/admin/users?role=company`, `PATCH /api/admin/users/:id`

Reviews and approves / rejects company registrations. An approved company can post slots and accept interns.

---

### 3.5 Institution Approvals — `/admin/schools`

**Component:** `SchoolApprovals.tsx`  
**API:** `GET /api/admin/users?role=school`, `PATCH /api/admin/users/:id`

Same flow as Company Approvals but for university/college/TVET accounts.

---

### 3.6 Mentor Management — `/admin/mentors`

**Component:** `MentorManagement.tsx`  
**API:** `GET /api/admin/mentors`, `POST /api/admin/mentors`, `PATCH /api/admin/mentors/:id/reset-password`, `DELETE /api/admin/mentors/:id` *(super admin)*

Mentors are admin accounts with `admins.is_mentor = true`.

- Create mentor — creates an `admin` user + sets `is_mentor = true` and `force_password_change = true`
- A temporary password email is sent via Resend on creation
- **Reset password** sends a new temporary password and re-sets the force-change flag
- **Deactivate** (soft-delete) — super admin only

---

### 3.7 Slot Management — `/admin/slots`

**Component:** `SlotManagement.tsx`  
**API:** `GET /api/admin/slots`, `POST /api/admin/slots`, `PATCH /api/admin/slots/:id`, `DELETE /api/admin/slots/:id` *(super admin)*

Manages internship openings. Each slot links to a company and defines:
- Title, department, number of openings
- Start / end dates
- Status (`open`, `closed`, `filled`)

---

### 3.8 Placement Management — `/admin/placements`

**Component:** `PlacementManagement.tsx`  
**API:** `GET /api/admin/placements`, `PATCH /api/admin/placements/:id/end`

Tracks active intern-to-company assignments:

| Status shown | Meaning |
|---|---|
| `active` | Placement running normally (or previously `on_hold`) |
| `ending_soon` | End date is within 14 days (computed server-side) |
| `completed` | Ended normally |
| `terminated` | Ended early |

- Filter by department, company, or status
- **End Placement** button terminates an active placement
- Progress percentage is calculated from `start_date → end_date` span

---

### 3.9 Analytics — `/admin/analytics`

**Component:** `CohortAnalytics.tsx`  
**API:** `GET /api/admin/cohort-analytics`

Metric cards:
- **Completion rate** — % of placements that reached `completed` status
- **Mentor satisfaction** — average rating from feedback table (1–5)
- **Cohorts active** — count of currently active placements
- **Placement success** — % of placements that were not terminated early

All values show `—` and a "No data yet" note when the database has no records.

---

### 3.10 Certificate Management — `/admin/certificates`

**Component:** `CertificateManagement.tsx`  
**API:** `GET /api/admin/certificates`, `POST /api/admin/certificates`, `PATCH /api/admin/certificates/:id/revoke` *(super admin)*, `GET /api/admin/certificate-templates`

See [Section 8 — Certificate System](#8-certificate-system) for full detail.

---

### 3.11 Resource Management — `/admin/resources`

**Component:** `ResourceManagement.tsx`  
**API:** `GET /api/admin/resources`, `POST /api/admin/resources`, `PATCH /api/admin/resources/:id`, `DELETE /api/admin/resources/:id` *(super admin)*

Manages knowledge assets (guides, tools, templates, videos):
- Filter by status (`published`, `draft`, `archived`)
- Search by title, type, or owner
- Create / Edit modal with fields: title, type, status, owner, URL
- Delete — super admin only

---

### 3.12 Notifications & Announcements — `/admin/notifications`

**Component:** `NotificationsCenter.tsx`  
**API:** `GET /api/admin/announcements`, `POST /api/admin/announcements`, `GET /api/admin/audit-log`

Three panels:

**Compose** — write and send an announcement to a target audience:  
`All Users` · `Interns Only` · `Companies Only` · `Institutions Only` · `Mentors Only`  
500-character limit. Recipient count is calculated at send time from the database.

**Sent History** — all past announcements with audience badge and a read-rate progress bar.

**Notification Log (Audit)** — live feed of the last 30 audit events pulled from the `audit_log` table. Colour-coded:
- Blue `info` — normal admin actions (approve, issue)
- Amber `warning` — reject actions
- Red `error` — delete and revoke actions

---

### 3.13 Feedback — `/admin/feedback`

**Component:** `FeedbackOverview.tsx`  
**API:** `GET /api/admin/feedback`, `PATCH /api/admin/feedback/:id`

Collects sentiment from interns, companies and schools:
- Filter by status: `new` · `reviewed` · `actioned`
- Star rating display (1–5)
- **Mark Actioned** — sets status to `actioned`
- **Defer** — sets status to `reviewed` (moves out of `new` queue)

---

### 3.14 Gamification — `/admin/gamification` *(super admin only)*

**Component:** `GamificationAdmin.tsx`  
**API:** `GET /api/admin/gamification/leaderboard`, `GET /api/admin/gamification/audit`, `GET /api/admin/gamification/badges`, `POST /api/admin/gamification/adjust`, `POST /api/admin/gamification/badges/:id/award`

See [Section 7 — Gamification System](#7-gamification-system) for full detail.

---

### 3.15 Portfolio — `/admin/portfolio`

**Component:** `AdminPortfolioBuilder.tsx`

Admin view of intern portfolio submissions.

---

### 3.16 Settings — `/admin/settings`

**Component:** `PlatformSettings.tsx`  
**API:** `GET /api/admin/settings` (all admins), `PATCH /api/admin/settings` *(super admin)*

See [Section 9 — Appearance & Mood Themes](#9-appearance--mood-themes) and [Section 10 — Super Admin Controls](#10-super-admin-controls).

---

## 4. API Reference

All routes require `Authorization: Bearer <token>`.  
All routes require `role = admin` in the JWT.  
Routes marked **[SA]** additionally require `admin_role = super_admin`.

### Stats & Users

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/stats` | Dashboard summary counters |
| GET | `/api/admin/users` | List users — query params: `role`, `status`, `search` |
| POST | `/api/admin/users` | Manually create a user |
| PATCH | `/api/admin/users/:id` | Approve or reject (`status: approved\|rejected`) |
| DELETE | `/api/admin/users/:id` | Soft-delete a user **[SA]** |
| PATCH | `/api/admin/users/:id/role` | Promote/demote admin (`admin_role`) **[SA]** |
| GET | `/api/admin/users/:id/cv-analysis` | Parse intern CV and return skills |

### Mentors

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/mentors` | List all mentors |
| POST | `/api/admin/mentors` | Create mentor account |
| PATCH | `/api/admin/mentors/:id/reset-password` | Send new temp password |
| DELETE | `/api/admin/mentors/:id` | Deactivate mentor **[SA]** |

### Slots & Applications

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/slots` | List internship slots |
| POST | `/api/admin/slots` | Create slot |
| PATCH | `/api/admin/slots/:id` | Update slot |
| DELETE | `/api/admin/slots/:id` | Delete slot **[SA]** |
| GET | `/api/admin/applications` | List all intern applications |

### Placements

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/placements` | List placements with computed status |
| PATCH | `/api/admin/placements/:id/end` | Terminate a placement |

### Certificates

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/certificates` | List certificates — query: `department`, `status` |
| POST | `/api/admin/certificates` | Issue certificate |
| PATCH | `/api/admin/certificates/:id/revoke` | Revoke certificate **[SA]** |
| GET | `/api/admin/certificate-templates` | List available templates |
| GET | `/api/verify/:certificateId` | Public verification (no auth) |

### Announcements

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/announcements` | List sent announcements |
| POST | `/api/admin/announcements` | Send announcement |

### Gamification

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/gamification/leaderboard` | Monthly + all-time leaderboard |
| GET | `/api/admin/gamification/audit` | Gamification event history |
| GET | `/api/admin/gamification/badges` | List badges with award counts |
| POST | `/api/admin/gamification/adjust` | Award / deduct points |
| POST | `/api/admin/gamification/badges/:id/award` | Award badge to user |

### Analytics, Resources & Feedback

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/cohort-analytics` | Completion rate, satisfaction, active cohorts |
| GET | `/api/admin/resources` | List resources |
| POST | `/api/admin/resources` | Create resource |
| PATCH | `/api/admin/resources/:id` | Update resource |
| DELETE | `/api/admin/resources/:id` | Delete resource **[SA]** |
| GET | `/api/admin/feedback` | List feedback entries |
| POST | `/api/admin/feedback` | Submit feedback |
| PATCH | `/api/admin/feedback/:id` | Update feedback status |

### Settings & Audit

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/settings` | Read all platform settings |
| PATCH | `/api/admin/settings` | Update one or more settings **[SA]** |
| GET | `/api/admin/audit-log` | Paginated audit log — query: `limit`, `offset` |

---

## 5. Database Tables

Migrations run automatically when the backend starts (`postgres-migrations`).

### Core tables (early migrations)

| Table | Purpose |
|---|---|
| `users` | All accounts — role ENUM: `admin`, `company`, `intern`, `school` |
| `admins` | Admin profile — `admin_role` ENUM (`admin`/`super_admin`), `is_mentor`, `force_password_change` |
| `companies` | Company profiles |
| `schools` | School/institution profiles |
| `intern_profiles` | Intern CV, cover letter, approval status |
| `internship_slots` | Available positions posted by companies |
| `placements` | Active intern→company assignments |
| `applications` | Intern applications to slots |
| `certificates` | Issued credentials with HMAC-signed PDF |

### WF-08–15 tables (migration 022)

| Table | Purpose |
|---|---|
| `announcements` | Broadcast messages with target audience and recipient count |
| `point_events` | Every point award or deduction with reason |
| `badges` | Badge definitions (pre-seeded with 6 types) |
| `badge_awards` | Which intern received which badge and when |
| `resources` | Knowledge assets (guides, tools, templates, videos) |
| `feedback` | Stakeholder ratings and comments |
| `platform_settings` | Key-value store for system-wide toggles |

**Pre-seeded badges:** ⭐ Star Performer · 🤝 Team Player · 🚀 Fast Learner · 🔥 Streak Master · 💼 Portfolio Pro · 🏅 Mentor Approved

**Pre-seeded settings:**

| Key | Default |
|---|---|
| `notifications_enabled` | `true` |
| `audit_logs_enabled` | `true` |
| `open_registration` | `true` |
| `data_retention_enabled` | `false` |

### Audit log table (migration 023)

```
audit_log
  id           SERIAL PK
  admin_id     → users.id
  action       VARCHAR(100)   e.g. "user.approved", "certificate.revoke"
  target_type  VARCHAR(50)    e.g. "user", "certificate"
  target_id    VARCHAR(100)   the affected record's ID
  metadata     JSONB          extra context
  created_at   TIMESTAMP
```

Indexed on `admin_id` and `created_at DESC` for fast recent-event queries.

---

## 6. Audit Trail

Every destructive or sensitive action is automatically logged to `audit_log`.

### Events logged automatically

| Action string | Triggered by |
|---|---|
| `user.approved` | Admin approves a user |
| `user.rejected` | Admin rejects a user |
| `user.delete` | Super admin deletes a user |
| `user.role_change` | Super admin promotes/demotes an admin |
| `certificate.issue` | Admin issues a certificate |
| `certificate.revoke` | Super admin revokes a certificate |
| `settings.update` | Super admin saves platform settings |

### Reading the audit log

- **API:** `GET /api/admin/audit-log?limit=50&offset=0`
- **UI:** Notifications → Notification Log panel (last 30 events, auto-loaded)
- Each entry shows: action · target type/ID · admin who triggered it · timestamp

---

## 7. Gamification System

> Accessible to **super admins only** at `/admin/gamification`.

### How points work

Points are stored as individual events in `point_events` — the total is always the sum, never stored directly. This means the history is complete and tamper-evident.

The leaderboard is computed server-side:
- **Monthly** — only `point_events` from the current calendar month
- **All-time** — all events ever
- **Trend** — compares current month total to previous month → `up / down / stable`

### Adjusting points

`POST /api/admin/gamification/adjust`
```json
{ "userId": 42, "action": "Completed onboarding module", "points": 50 }
```
Negative values deduct points. Both positive and negative entries appear in the gamification audit log.

### Badges

Six badge types are pre-seeded. Awarding a badge:

`POST /api/admin/gamification/badges/:id/award`
```json
{ "userId": 42 }
```

The award is recorded in `badge_awards` with a reference to the admin who awarded it.

---

## 8. Certificate System

### Issuing a certificate

1. Admin selects an intern from the live search (by name or email)
2. Optionally picks a template and sets a program name and issue date
3. `POST /api/admin/certificates` — backend generates:
   - A unique `certificate_id` (UUID)
   - A `certificate_number` (e.g. `CERT-2025-000042`)
   - Snapshots of the intern's name and department at the time of issue
   - An HMAC-SHA256 signature using `CERT_SIGNING_SECRET` for tamper detection
   - (Optional) A PDF stored in Supabase Storage

### Public verification

Anyone can verify a certificate at:
```
GET /api/verify/:certificateId
```
or via the public page `/verify/:certificateId` — no login required.

The response includes whether the certificate is `active` or `revoked` and all snapshot data.

### Revoking a certificate

`PATCH /api/admin/certificates/:id/revoke` — **super admin only**

Sets `status = revoked`. The revoke button is hidden in the UI for standard admin accounts.

> **Important:** `CERT_SIGNING_SECRET` must never be rotated after certificates are issued — doing so would invalidate all existing signatures.

---

## 9. Appearance & Mood Themes

The admin panel supports **6 colour themes** stored in `themeStore` (Zustand, persisted to `localStorage`).

| Theme | Emoji | Base colour | Accent |
|---|---|---|---|
| Imperial | 👑 | `#0D0118` deep purple | `#4B1E91` |
| Dusk | 🌆 | `#1E1E2E` blue-gray (lighter) | `#7C6AE0` |
| Midnight | 🌙 | `#050A0F` near-black blue | `#1D4ED8` |
| Forest | 🌿 | `#051A0F` dark green | `#16A34A` |
| Ocean | 🌊 | `#010D18` dark navy | `#0891B2` |
| Crimson | 🔴 | `#0F0505` dark red | `#DC2626` |

### How it works

1. On app boot, `bootTheme()` in `main.tsx` reads `localStorage` and applies CSS custom properties to `document.documentElement` before React renders — no colour flash.
2. Selecting a mood in Settings calls `setMood()` which immediately writes six CSS properties (`--bg-deep`, `--bg-mid`, `--bg-card`, `--bd`, `--ac`, `--gd`) and saves to localStorage.
3. `AdminLayout` reads the active mood from `themeStore` and applies inline styles to the sidebar, topbar, and active nav items — these elements respond instantly.

### Switching themes

Settings → **Mood Theme** section → click any card. The change applies immediately with no page reload.

---

## 10. Super Admin Controls

Super admins are identified by `admins.admin_role = 'super_admin'` in the database. This is embedded in the JWT at login, so the UI and API both enforce it without extra queries.

### Promoting an admin to super admin

In **User Management**, find an admin account. If you are a super admin, you will see a gold **↑ Make Super** button. Clicking it calls `PATCH /api/admin/users/:id/role` with `{ admin_role: "super_admin" }`. The change takes effect on the target admin's next login (their existing JWT reflects their old role until it expires or is refreshed).

### What super admins can do that standard admins cannot

| Action | Standard Admin | Super Admin |
|---|---|---|
| Delete users | No | Yes |
| Promote/demote admins | No | Yes |
| Delete mentors | No | Yes |
| Delete slots | No | Yes |
| Delete resources | No | Yes |
| Revoke certificates | No | Yes |
| Edit platform settings | No | Yes |
| Access Gamification page | No | Yes |
| Read platform settings | Yes | Yes |
| Everything else | Yes | Yes |

### First super admin setup

The very first super admin must be set directly in the database:

```sql
UPDATE admins SET admin_role = 'super_admin'
WHERE user_id = (SELECT id FROM users WHERE email = 'your-admin@email.com');
```

After that, super admins can promote others through the UI.

---

## Quick Reference — Common Workflows

### Onboarding a new company

1. Company registers at `/register/company`
2. Admin sees them in **Companies** with status `pending`
3. Admin clicks **Approve** → company receives access
4. Admin creates an internship **Slot** for that company

### Onboarding an intern

1. Intern registers at `/register/intern` and uploads CV
2. Admin sees them in **Applications**
3. Admin approves → intern is matched to a placement
4. Once placed, a **Placement** record is created with start/end dates

### Issuing a certificate

1. Placement reaches completion date
2. Admin goes to **Certificates** → Issue Certificate
3. Searches intern by name, picks template, sets date → Issue
4. PDF is generated and stored; intern can verify via public URL

### Sending an announcement

1. Go to **Notifications** → Compose panel
2. Select audience, write subject and message
3. Click **Send Announcement**
4. Appears immediately in the Sent History panel with recipient count
