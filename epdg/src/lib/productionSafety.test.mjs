import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function read(relativePath) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

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
