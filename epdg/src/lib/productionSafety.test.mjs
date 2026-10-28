import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { portalAvailability } from './portalAvailability.ts';
import { roleLayouts, previewNotice } from '../design-preview/layouts.ts';
import { readdirSync } from 'node:fs';

function read(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

test('design preview is a separate opt-in build entry, never a normal route', () => {
  const config = read('../../vite.config.ts');
  assert.match(config, /order: 'pre'/);
  assert.match(config, /mode === 'design-preview'[\s\S]*?html\.replace\('\/src\/main\.tsx', '\/src\/design-preview\/main\.tsx'\)[\s\S]*?: html/);
  assert.match(config, /disable: mode === 'design-preview'/);
  assert.doesNotMatch(read('../main.tsx'), /design-preview|Presentation|import\(/);
  assert.match(read('../../index.html'), /src="\/src\/main.tsx"/);
});

test('design layouts contain required areas without participant records', () => {
  assert.equal(Object.keys(roleLayouts).length, 4);
  assert.deepEqual([...roleLayouts.learner.sections], ['Active programs', 'Upcoming work', 'Feedback', 'Progress', 'Resources']);
  assert.ok(roleLayouts.school.sections.includes('Authorized-student reporting'));
  assert.equal(previewNotice, 'Design preview — authentication and participant data are not connected.');
});

test('preview module boundary has no authentication, network, storage, or legacy fixture dependencies', () => {
  const directory = new URL('../design-preview/', import.meta.url);
  for (const file of readdirSync(directory).filter(file => /\.tsx?$/.test(file))) {
    const source = readFileSync(new URL(file, directory), 'utf8');
    assert.doesNotMatch(source, /\b(?:fetch|XMLHttpRequest|WebSocket|localStorage|sessionStorage|indexedDB)\b|axios|mockAuth|authStore|supabase|@netlify\//i, file);
    const imports = [...source.matchAll(/from ['"]([^'"]+)['"]/g)].map(match => match[1]);
    assert.ok(imports.every(name => name === 'react' || name === 'react-dom/client' || name.startsWith('./') || name === '../assets/epd_logo.png'), file);
  }
  const presentation = read('../design-preview/Presentation.tsx');
  assert.match(presentation, /<fieldset disabled/);
  assert.doesNotMatch(presentation, /type="password"|onSubmit|mailto:/);
});

test('blocked entry point cannot load legacy authentication or dashboards', () => {
  const entry = read('../main.tsx');
  const screen = read('../components/PortalAccessHold.tsx');
  assert.match(entry, /import PortalAccessHold from/);
  assert.match(entry, /<PortalAccessHold\s*\/>/);
  assert.doesNotMatch(entry, /import App|<App\b/);
  assert.doesNotMatch(screen, /import.*(?:authStore|axios|App|Dashboard|mockAuth)/);
  assert.doesNotMatch(screen, /localStorage|sessionStorage|fetch\(|<form|<input/);
});

test('all historical private routes resolve to a closed state without role input', () => {
  for (const path of ['/school', '/company', '/admin/users', '/mentor', '/dashboard/profile', '/dashboard/tasks', '/verify/example', '/portfolio/example', '/unknown']) {
    assert.equal(portalAvailability(path).title, 'Secure access is being prepared');
  }
  for (const path of ['/register', '/register/intern', '/register/company', '/register/school', '/signup']) {
    assert.equal(portalAvailability(path).title, 'An invitation is required');
  }
  for (const path of ['/forgot-password', '/reset-password', '/change-password', '/verify-email', '/callback']) {
    assert.equal(portalAvailability(path).title, 'Account recovery is unavailable');
  }
});

test('private API paths bypass service-worker caching and navigation fallback', () => {
  const config = read('../../vite.config.ts');
  assert.match(config, /navigateFallbackDenylist:/);
  assert.match(config, /urlPattern: \(\{ url \}\) =>[^\n]+\n\s*handler: 'NetworkOnly'/);
});

test("production dashboards do not present fixture notifications or session history", () => {
  const navbar = read("../components/Navbar.tsx");
  const progress = read("../components/Progress.tsx");

  assert.equal(navbar.includes("Nova Studio"), false);
  assert.equal(navbar.includes("AI Research Program"), false);
  assert.match(navbar, /useState<NotificationItem\[]>\(\[]\)/);
  assert.equal(progress.includes("sessionRatingData"), false);
  assert.match(progress, /Individual session history is unavailable/);
});

test("role and unavailable-feature boundaries fail closed in production", () => {
  const app = read("../App.tsx");
  const login = read("../components/Credential/Login.tsx");
  const protectedRoute = read("../components/ProtectedRoute.tsx");
  const companyDashboard = read("../components/company/CompanyDashboard.tsx");

  assert.match(app, /<ProtectedRoute allowedRoles=\{\["intern"\]\}>/);
  assert.match(app, /<ProtectedRoute allowedRoles=\{\["school"\]\}>/);
  assert.ok((app.match(/DevelopmentFixtureGate feature="Portfolio publishing"/g) ?? []).length >= 3);
  assert.match(app, /DevelopmentFixtureGate feature="Certificate issuance"/);
  assert.match(app, /DevelopmentFixtureGate feature="Submission Hub"/);
  assert.match(login, /school:\s+"\/school"/);
  assert.equal(login.includes('school:  "/dashboard"'), false);
  assert.match(protectedRoute, /school:\s+['"]\/school['"]/);
  assert.doesNotMatch(protectedRoute, /school:\s+['"]\/dashboard['"]/);
  assert.doesNotMatch(companyDashboard, /\bisApproved\s*=\s*true\b/);
});

test("production auth excludes mock credentials and preserves meaningful auth errors", () => {
  const login = read("../components/Credential/Login.tsx");
  const axios = read("./axios.ts");

  assert.doesNotMatch(login, /from ["']\.\.\/\.\.\/lib\/mockAuth["']/);
  assert.match(login, /await import\(["']\.\.\/\.\.\/lib\/mockAuth["']\)/);
  assert.match(login, /if \(user\.status === "rejected"\)[\s\S]*?clearAuth\(\)[\s\S]*?return;[\s\S]*?setAuth\(user, data\.token\)/);
  assert.match(login, /err instanceof ApiConfigurationError/);
  assert.doesNotMatch(axios, /import \{ mockLogin/);
  assert.match(axios, /return import\(['"]\.\/mockAuth['"]\)/);
  assert.match(axios, /['"]\/api\/auth\/verify-email['"]/);
});

test("school registration and mentor approval use backend-owned field contracts", () => {
  const school = read("../components/Credential/RegisterSchool.tsx");
  const applications = read("../components/admin/ApplicationsReview.tsx");

  assert.match(school, /contact_phone:\s+data\.phone/);
  for (const schoolType of ["university", "college", "polytechnic", "tvet"]) {
    assert.match(school, new RegExp(`value: ["']${schoolType}["']`));
  }
  assert.equal(school.includes('value: "High School"'), false);
  assert.equal(school.includes('value: "Other"'), false);
  assert.equal(applications.includes("mentor: app.mentor"), false);
  assert.match(applications, /mentor_id: app\.mentor_id/);
  assert.match(applications, /value=\{m\.id\}/);
  assert.equal(applications.includes("invite sent"), false);
});

test("intern account approval copy does not claim application transitions or invitation delivery", () => {
  const approvals = read("../components/admin/ApplicationsReview.tsx");

  assert.match(approvals, /Intern Account Approvals/);
  assert.match(approvals, /Approve Intern Account/);
  assert.equal(approvals.includes("Applications Review"), false);
  assert.equal(approvals.includes("Approve & Send Invite"), false);
  assert.equal(approvals.includes("/api/admin/applications"), false);
});

test("mentor session topics use the backend notes field", () => {
  const mentors = read("../components/Mentors.tsx");
  assert.match(mentors, /notes: formData\.topic/);
  assert.equal(mentors.includes('api.post<{ success: boolean; data: Session }>("/api/intern/mentor/sessions", formData)'), false);
  assert.equal(mentors.includes("/api/intern/mentor/sessions/${ratingTarget}/rate"), false);
  assert.match(mentors, /Session feedback is temporarily unavailable/);
});

test("intern registration does not offer the unowned CV upload workflow", () => {
  const registration = read("../components/Credential/RegisterIntern.tsx");
  assert.equal(registration.includes("/api/upload/cv"), false);
  assert.equal(registration.includes('type="file"'), false);
  assert.match(registration, /Private CV upload is temporarily unavailable/);
});

test("the frontend does not extend bearer-token lifetime through the disabled refresh route", () => {
  const adminLayout = read("../components/admin/AdminLayout.tsx");
  assert.equal(adminLayout.includes("/api/auth/refresh"), false);
  assert.equal(adminLayout.includes("setToken"), false);
  assert.match(adminLayout, /api\.get<CurrentUserResponse>\('\/api\/auth\/me'\)/);
});
