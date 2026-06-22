# EPDG Intern Dashboard — Full System Document

> **Stack:** React 19 + TypeScript + Vite + Tailwind CSS v4 (frontend) · Express + TypeScript + PostgreSQL (backend)  
> **Base route:** `/dashboard` — protected, `role = intern` only

---

## Table of Contents

1. [Architecture & Layout](#1-architecture--layout)
2. [Auth & Session](#2-auth--session)
3. [Page Inventory — What Works vs What is Mocked](#3-page-inventory)
4. [Implemented Pages (Real Data)](#4-implemented-pages-real-data)
5. [Mocked Pages (Needs Wiring)](#5-mocked-pages-needs-wiring)
6. [Missing Backend APIs](#6-missing-backend-apis)
7. [Database Tables](#7-database-tables)
8. [Implementation Roadmap](#8-implementation-roadmap)

---

## 1. Architecture & Layout

```
/dashboard  (ProtectedRoute — role: intern)
    └── Dashboard.tsx  (layout shell: sidebar + topbar)
            ├── /overview          DailyOverview.tsx
            ├── /onboarding        Onboarding.tsx
            ├── /roadmap           Roadmap.tsx
            ├── /tasks             Tasks.tsx
            ├── /task-tracker      TaskTracker.tsx
            ├── /mentors           Mentors.tsx
            ├── /leaderboard       Leaderboard.tsx
            ├── /progress          Progress.tsx
            ├── /feedback          Feedback.tsx
            ├── /submission-hub    SubmissionHub.tsx
            ├── /portfolio         PortfolioSubmit.tsx
            ├── /profile           InternProfile.tsx
            ├── /discovery         DiscoveryDashboard.tsx   (placeholder)
            ├── /community         Placeholder
            ├── /career            Placeholder
            ├── /certificates      Placeholder
            └── /checkins          Placeholder
```

**All API calls** go through `src/lib/axios.ts` which auto-injects the stored JWT.  
**All intern routes** require `Authorization: Bearer <token>` with `role = intern`.

---

## 2. Auth & Session

**Store:** `src/store/authStore.ts` (Zustand, persisted to localStorage)

```typescript
interface AuthUser {
  id:                    number;
  name:                  string;
  email:                 string;
  role:                  'admin' | 'company' | 'intern' | 'school';
  status:                'pending' | 'approved' | 'rejected';
  is_mentor?:            boolean;
  force_password_change?: boolean;
  admin_role?:           'admin' | 'super_admin';
}
```

**Login flow:**
1. Intern submits email + password → `POST /api/auth/login`
2. Backend queries `users` + `intern_profiles`, checks approval status
3. JWT signed with `{ id, email, role }` — 30-day expiry
4. Frontend stores in `authStore` + `localStorage`
5. `ProtectedRoute` guards `/dashboard/*` — redirects to `/login` if no token

**Intern approval states:**
- `pending` → sees `/pending-approval` page, cannot access dashboard
- `rejected` → sees rejection notice
- `approved` → full dashboard access

---

## 3. Page Inventory

| # | Page | Route | Real API? | Status |
|---|------|-------|-----------|--------|
| 1 | Daily Overview | `/dashboard/overview` | ✅ Yes | **Live** |
| 2 | Onboarding | `/dashboard/onboarding` | ✅ Yes | **Live** |
| 3 | Intern Profile | `/dashboard/profile` | ✅ Yes | **Live** |
| 4 | Portfolio Submit | `/dashboard/portfolio` | ✅ Partial | **Partial** |
| 5 | Roadmap | `/dashboard/roadmap` | ❌ Mock | Needs wiring |
| 6 | Tasks | `/dashboard/tasks` | ❌ Mock | Needs wiring |
| 7 | Task Tracker | `/dashboard/task-tracker` | ❌ Mock | Needs wiring |
| 8 | Mentors | `/dashboard/mentors` | ❌ Mock | Needs wiring |
| 9 | Leaderboard | `/dashboard/leaderboard` | ❌ Mock | Needs wiring |
| 10 | Progress | `/dashboard/progress` | ❌ Mock | Needs wiring |
| 11 | Feedback | `/dashboard/feedback` | ❌ Mock | Needs wiring |
| 12 | Submission Hub | `/dashboard/submission-hub` | ❌ Mock | Needs wiring |
| 13 | Discovery | `/dashboard/discovery` | — | Placeholder |
| 14 | Community | `/dashboard/community` | — | Placeholder |
| 15 | Career | `/dashboard/career` | — | Placeholder |
| 16 | Certificates | `/dashboard/certificates` | — | Placeholder |
| 17 | Check-ins | `/dashboard/checkins` | — | Placeholder |

---

## 4. Implemented Pages (Real Data)

### 4.1 Daily Overview — `/dashboard/overview`

**Component:** `DailyOverview.tsx`  
**API:** `GET /api/intern/dashboard`

**What it shows:**
- Intern name, department, mentor, track, cohort year
- Onboarding complete status
- Placement status
- Stats: tasks done / total, on-time %, current points, days remaining
- Last 5 tasks (title, status, priority, due date, points)
- Last 5 announcements from admins

**Response shape:**
```json
{
  "profile": {
    "name": "...", "department": "...", "mentor_name": "...",
    "track": "...", "cohort_year": 2026,
    "onboarding_complete": true, "is_approved": true,
    "placement_status": "active"
  },
  "stats": {
    "tasks_done": 4, "tasks_total": 10,
    "on_time_pct": 87, "points": 340, "days_remaining": 42
  },
  "tasks": [ { "id", "title", "status", "priority", "due_date", "points" } ],
  "announcements": [ { "id", "subject", "message", "created_at" } ]
}
```

**Database tables used:** `users`, `intern_profiles`, `placements`, `tasks`, `announcements`

---

### 4.2 Onboarding — `/dashboard/onboarding`

**Component:** `Onboarding.tsx`  
**APIs:**
- `GET /api/intern/onboarding` — fetch 6-step progress
- `PATCH /api/intern/onboarding/:stepId/complete` — mark step done

**6 steps:**
1. Profile Setup
2. Email Verification
3. Track Selection
4. Workspace Setup
5. First Task Submission
6. Onboarding Sign-off

Each step has: `id`, `title`, `description`, `status` (`completed` / `current` / `locked`), `completed_at`.

The component shows a progress bar and locks future steps until the current one is done.

**Database tables used:** `intern_profiles` (`onboarding_step`, `onboarding_complete`)

---

### 4.3 Intern Profile — `/dashboard/profile`

**Component:** `InternProfile.tsx`  
**APIs:**
- `GET /api/intern/profile` — load profile
- `PATCH /api/intern/profile` — save changes

**Editable fields:**
- Bio, department, track, contact phone, course, year of study
- Skills (add / remove as tags)
- Links: LinkedIn, GitHub, Portfolio URL
- Location: city, country
- Agreements: NDA signed, disclaimer accepted

**Database tables used:** `users`, `intern_profiles`

---

### 4.4 Portfolio — `/dashboard/portfolio`

**Component:** `portfolio/PortfolioSubmit.tsx`  
**APIs (partially wired):**
- `GET /api/portfolio/submissions/my`
- `POST /api/portfolio/upload`
- `POST /api/portfolio/submissions`
- `PATCH /api/portfolio/submissions/:id`
- `DELETE /api/portfolio/submissions/:id`

**What it does:**
- Track selector (Web Design, Sales & Marketing, Social Media, Digital Marketing)
- Submission form: title, task description, contribution, outcome, tools used
- Submission type: Code editor / File upload / Link (GitHub + Live URL)
- Save Draft / Submit for Review
- Submission history table with status and admin notes

> **Note:** These portfolio routes exist in a separate route file and are not declared in `internRoutes.ts`. Verify they are registered in `app.ts`.

---

## 5. Mocked Pages (Needs Wiring)

### 5.1 Roadmap — `/dashboard/roadmap`

**Component:** `Roadmap.tsx`  
**Current state:** Hardcoded 12-week timeline (`MOCK_WEEKS_DATA`)

**What it shows:**
- Week-by-week progress through the programme
- Skills introduced each week
- Status per week: `completed` / `current` / `locked`
- Overall completion percentage

**Needs:**
```
GET /api/intern/roadmap
```
Response: array of weeks `{ week_number, title, description, skills[], status, completed_at }`

**Database tables needed:**  
`roadmap_weeks` — does not yet exist (needs migration)

---

### 5.2 Tasks — `/dashboard/tasks`

**Component:** `Tasks.tsx`  
**Current state:** 6 hardcoded tasks (`MOCK_TASKS_DATA`)

**What it shows:**
- Task list filterable by status and priority
- Status transitions: `pending → in_progress → review → done`
- Points per task, overdue flag

**Needs:**
```
GET  /api/intern/tasks              — list tasks (filter: status, priority)
PATCH /api/intern/tasks/:id         — update status
POST  /api/intern/tasks/:id/submit  — submit work link/notes
```

**Database table:** `tasks` ✅ already exists  
Schema: `id, placement_id, assigned_by, title, description, priority, status, due_date, points, created_at, completed_at`

---

### 5.3 Task Tracker (Kanban) — `/dashboard/task-tracker`

**Component:** `TaskTracker.tsx`  
**Current state:** Hardcoded Kanban columns + chart (`MOCK_KANBAN_DATA`, `MOCK_CHART_DATA`)

**What it shows:**
- Kanban board: To Do / In Progress / Under Review / Completed columns
- Weekly bar chart (tasks completed per week)
- Drag-drop is visual only — no persistence

**Needs:**
```
GET /api/intern/tasks  (same endpoint as Tasks page, different view)
```
Weekly chart data can be derived client-side by grouping `completed_at` by week.

**Database table:** `tasks` ✅

---

### 5.4 Mentors — `/dashboard/mentors`

**Component:** `Mentors.tsx`  
**Current state:** Hardcoded mentor "Sanjiv Kumar" + sessions

**What it shows:**
- Assigned mentor profile (name, title, photo)
- Upcoming sessions (date, time, status: confirmed / pending)
- Request new session form (date + message)
- Past sessions with rating given + mentor notes

**Needs:**
```
GET   /api/intern/mentor                   — get assigned mentor details
GET   /api/intern/mentor/sessions          — upcoming sessions
GET   /api/intern/mentor/sessions/past     — completed sessions
POST  /api/intern/mentor/sessions          — request a session
PATCH /api/intern/mentor/sessions/:id/rate — submit star rating
```

**Database tables needed:**
- `mentor_sessions` — does not yet exist (needs migration)
  - `id, placement_id, mentor_id, intern_id, scheduled_at, status, notes, rating, created_at`

---

### 5.5 Progress — `/dashboard/progress`

**Component:** `Progress.tsx`  
**Current state:** All hardcoded (`MOCK_WEEKLY_DATA`, `MOCK_SKILLS_DATA`, `MOCK_RATINGS_DATA`, `MOCK_MILESTONES`)

**What it shows:**
- Task completion count + on-time percentage
- Weekly performance bar chart (4 weeks)
- Punctuality matrix (on-time / late / pending)
- Skills progress bars (6 skills with % proficiency)
- Mentor evaluation average rating
- Milestone progress (X of 12 completed)

**Needs:**
```
GET /api/intern/progress/stats       — task counts, on-time %, weekly breakdown
GET /api/intern/progress/skills      — skill name + proficiency %
GET /api/intern/progress/milestones  — milestone list with completion status
```

**Data sources for stats:** can be derived from `tasks`, `point_events`, `feedback`  
**Database tables needed:**
- `intern_skills` — skill name + proficiency per intern (new migration)
- `milestones` — programme milestone definitions (new migration)

---

### 5.6 Leaderboard — `/dashboard/leaderboard`

**Component:** `Leaderboard.tsx`  
**Current state:** Hardcoded 10 interns + badges (`MOCK_INTERNS_DATA`, `MOCK_BADGES_DATA`)

**What it shows:**
- Current intern's rank, points, trend (up/down/stable)
- Points to next rank
- Points breakdown (Tasks / Streak / Syncs)
- Top 3 podium with emoji medals
- Full ranked list (filterable by department)
- Earned badge display

**Needs:**
```
GET /api/intern/leaderboard      — ranked list of all interns with points
GET /api/intern/leaderboard/me   — current intern's rank + breakdown
GET /api/intern/badges           — earned badges for this intern
```

**Database tables:** `point_events` ✅ `badges` ✅ `badge_awards` ✅ — all exist, just need the API endpoints

---

### 5.7 Feedback & Evaluations — `/dashboard/feedback`

**Component:** `Feedback.tsx`  
**Current state:** Hardcoded mentor feedback cards (`MOCK_MENTOR_FEEDBACK`)

**What it shows:**
- Weekly programme rating form (1–5 stars)
- Mentor evaluation form (1–5 stars + written notes)
- Feedback received from mentor (list of cards with rating + comment)
- Anonymous suggestion box (500-char limit)

**Needs:**
```
POST /api/intern/feedback/programme    — submit programme rating + comment
POST /api/intern/feedback/mentor       — submit mentor rating + notes
GET  /api/intern/feedback/received     — feedback given TO this intern by mentor
POST /api/intern/feedback/suggestion   — anonymous suggestion (no user link stored)
```

**Database table:** `feedback` ✅ exists (migration 022)  
Schema: `id, from_name, role, category, comment, rating, status, user_id, created_at`  
Can reuse this table — `user_id = null` for anonymous suggestions, `category = 'programme'` or `'mentor'`

---

### 5.8 Submission Hub — `/dashboard/submission-hub`

**Component:** `SubmissionHub.tsx`  
**Current state:** 4 hardcoded submissions (`MOCK_SUBMISSIONS_DATA`)

**What it shows:**
- Stat cards: Submitted / Under Review / Approved / Rejected
- Upload form: select task, file drop zone, notes field, deadline countdown
- Submission history table with status, reviewer comment, developer notes
- Resubmit button for rejected items

**Needs:**
```
GET   /api/intern/submissions          — list all submissions for this intern
POST  /api/intern/submissions          — submit (multipart: task_id, file, notes)
PATCH /api/intern/submissions/:id      — resubmit rejected (new file / notes)
```

**Database table:** `submissions` ✅ exists (migration 009)  
Schema: `id, task_id, placement_id, intern_id, file_url, file_name, file_size_kb, notes, status, reviewer_comment, reviewed_by, submitted_at, reviewed_at`

---

## 6. Missing Backend APIs

All routes go under `GET/POST/PATCH /api/intern/*` with `authMiddleware + roleGuard('intern')`.

### Group A — Use existing tables, just need the endpoint

| Endpoint | Method | Table | Notes |
|----------|--------|-------|-------|
| `/api/intern/tasks` | GET | `tasks` | Filter by `placement_id` of intern |
| `/api/intern/tasks/:id` | PATCH | `tasks` | Update `status` field |
| `/api/intern/submissions` | GET | `submissions` | Filter by `intern_id` |
| `/api/intern/submissions` | POST | `submissions` | Upload file to Supabase, insert row |
| `/api/intern/submissions/:id` | PATCH | `submissions` | Resubmit — reset status to `submitted` |
| `/api/intern/leaderboard` | GET | `point_events` | GROUP BY user_id, SUM(points), rank |
| `/api/intern/leaderboard/me` | GET | `point_events` | Current intern's rank + breakdown |
| `/api/intern/badges` | GET | `badge_awards`, `badges` | Badges earned by this intern |
| `/api/intern/feedback/programme` | POST | `feedback` | category = 'programme' |
| `/api/intern/feedback/mentor` | POST | `feedback` | category = 'mentor' |
| `/api/intern/feedback/received` | GET | `feedback` | Where `target_user_id = intern_id` |
| `/api/intern/feedback/suggestion` | POST | `feedback` | user_id = NULL |

### Group B — Need new database tables first

| Endpoint | Method | New Table Needed |
|----------|--------|-----------------|
| `/api/intern/roadmap` | GET | `roadmap_weeks` |
| `/api/intern/progress/skills` | GET | `intern_skills` |
| `/api/intern/progress/milestones` | GET | `milestones`, `milestone_completions` |
| `/api/intern/mentor` | GET | (join `placements → admins` — may not need new table) |
| `/api/intern/mentor/sessions` | GET | `mentor_sessions` |
| `/api/intern/mentor/sessions` | POST | `mentor_sessions` |
| `/api/intern/mentor/sessions/:id/rate` | PATCH | `mentor_sessions` |
| `/api/intern/progress/stats` | GET | Derived from `tasks` — no new table |

---

## 7. Database Tables

### Tables that EXIST and are used by the intern dashboard

| Table | Migration | Purpose |
|-------|-----------|---------|
| `users` | 001 | Core account — id, email, name, role, is_verified |
| `intern_profiles` | 004 | Department, track, mentor, skills (JSONB), onboarding_step, cv_url, bio, links |
| `placements` | 007 | Intern ↔ company assignment — start/end dates, status, mentor_id |
| `tasks` | 008 | Tasks assigned per placement — priority, status, due_date, points |
| `submissions` | 009 | Task file submissions — status, reviewer_comment, file_url |
| `internship_slots` | 006 | Available positions to apply for |
| `applications` | 005 | Intern applications to slots |
| `certificates` | 020 | Issued credentials — UUID, PDF, HMAC signature |
| `point_events` | 022 | Every point award — action, points, awarded_by |
| `badges` | 022 | Badge definitions (6 pre-seeded) |
| `badge_awards` | 022 | Which intern earned which badge |
| `feedback` | 022 | Ratings + comments — can store programme, mentor, anonymous |
| `announcements` | 022 | Admin broadcasts shown on overview |

### Tables that NEED to be created (new migrations)

#### `roadmap_weeks` (migration 024)
```sql
CREATE TABLE roadmap_weeks (
  id           SERIAL PRIMARY KEY,
  week_number  SMALLINT NOT NULL,
  title        VARCHAR(200) NOT NULL,
  description  TEXT,
  skills       TEXT[] DEFAULT '{}',
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE intern_roadmap_progress (
  id              SERIAL PRIMARY KEY,
  intern_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  week_id         INTEGER NOT NULL REFERENCES roadmap_weeks(id) ON DELETE CASCADE,
  status          VARCHAR(20) NOT NULL DEFAULT 'locked',
  completed_at    TIMESTAMP,
  UNIQUE(intern_id, week_id)
);
```

#### `mentor_sessions` (migration 025)
```sql
CREATE TABLE mentor_sessions (
  id             SERIAL PRIMARY KEY,
  placement_id   INTEGER NOT NULL REFERENCES placements(id) ON DELETE CASCADE,
  mentor_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  intern_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scheduled_at   TIMESTAMP NOT NULL,
  status         VARCHAR(20) NOT NULL DEFAULT 'pending',
  notes          TEXT,
  intern_rating  SMALLINT,
  mentor_notes   TEXT,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `intern_skills` (migration 026)
```sql
CREATE TABLE intern_skills (
  id           SERIAL PRIMARY KEY,
  intern_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill_name   VARCHAR(100) NOT NULL,
  proficiency  SMALLINT NOT NULL DEFAULT 0,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(intern_id, skill_name)
);
```

#### `milestones` + `milestone_completions` (migration 026)
```sql
CREATE TABLE milestones (
  id           SERIAL PRIMARY KEY,
  title        VARCHAR(200) NOT NULL,
  description  TEXT,
  order_index  SMALLINT NOT NULL DEFAULT 0
);

CREATE TABLE milestone_completions (
  id           SERIAL PRIMARY KEY,
  milestone_id INTEGER NOT NULL REFERENCES milestones(id) ON DELETE CASCADE,
  intern_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(milestone_id, intern_id)
);
```

---

## 8. Implementation Roadmap

Work is ordered so each phase has no blockers from the next.

### Phase 1 — Quick Wins (existing tables, just wire the API)

These pages just need a backend endpoint — the database is ready.

| Page | What to build |
|------|--------------|
| **Tasks** | `GET /api/intern/tasks` + `PATCH /api/intern/tasks/:id` — query `tasks` by `placement_id` |
| **Task Tracker** | Same endpoint — kanban view is just a different grouping on the frontend |
| **Leaderboard** | `GET /api/intern/leaderboard` — `SUM(points)` from `point_events`, rank with window function |
| **Leaderboard Me** | `GET /api/intern/leaderboard/me` — same query, filter by intern's user_id |
| **Badges** | `GET /api/intern/badges` — join `badge_awards → badges` for this intern |
| **Submission Hub** | `GET /api/intern/submissions` + `POST /api/intern/submissions` + `PATCH /:id` |
| **Feedback** | `POST /api/intern/feedback/programme` + `/mentor` + `/suggestion` — insert into `feedback` |

### Phase 2 — New tables needed

| Page | What to build |
|------|--------------|
| **Roadmap** | Migration 024 → seed 12 weeks → `GET /api/intern/roadmap` |
| **Mentors** | Migration 025 → `GET /api/intern/mentor` + session endpoints |
| **Progress** | Migration 026 → `intern_skills`, `milestones` → 3 progress endpoints |

### Phase 3 — Placeholder pages

These exist as routes but show nothing yet:

| Route | Suggested content |
|-------|------------------|
| `/dashboard/certificates` | List intern's own certificates — call `GET /api/intern/certificates` |
| `/dashboard/checkins` | Daily check-in form — needs new table or links to `tasks` |
| `/dashboard/discovery` | Browse open slots + career opportunities |
| `/dashboard/community` | Feed of intern activity / announcements |
| `/dashboard/career` | Resources + job board (links to `resources` table) |

---

## Quick Reference — Intern API Endpoints

### Already live
```
GET   /api/intern/dashboard
GET   /api/intern/profile
PATCH /api/intern/profile
GET   /api/intern/onboarding
PATCH /api/intern/onboarding/:stepId/complete
GET   /api/intern/slots
POST  /api/intern/apply
GET   /api/intern/applications
GET   /api/portfolio/submissions/my
POST  /api/portfolio/upload
POST  /api/portfolio/submissions
PATCH /api/portfolio/submissions/:id
DELETE /api/portfolio/submissions/:id
```

### Missing — Phase 1 (no new tables needed)
```
GET   /api/intern/tasks
PATCH /api/intern/tasks/:id
GET   /api/intern/submissions
POST  /api/intern/submissions
PATCH /api/intern/submissions/:id
GET   /api/intern/leaderboard
GET   /api/intern/leaderboard/me
GET   /api/intern/badges
POST  /api/intern/feedback/programme
POST  /api/intern/feedback/mentor
GET   /api/intern/feedback/received
POST  /api/intern/feedback/suggestion
```

### Missing — Phase 2 (new tables required)
```
GET   /api/intern/roadmap
PATCH /api/intern/roadmap/:weekId/complete
GET   /api/intern/mentor
GET   /api/intern/mentor/sessions
POST  /api/intern/mentor/sessions
PATCH /api/intern/mentor/sessions/:id/rate
GET   /api/intern/progress/stats
GET   /api/intern/progress/skills
GET   /api/intern/progress/milestones
```
