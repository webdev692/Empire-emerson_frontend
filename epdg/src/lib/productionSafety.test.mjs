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

  assert.match(app, /<ProtectedRoute allowedRoles=\{\["intern"\]\}>/);
  assert.match(app, /<ProtectedRoute allowedRoles=\{\["school"\]\}>/);
  assert.ok((app.match(/DevelopmentFixtureGate feature="Portfolio publishing"/g) ?? []).length >= 3);
  assert.match(app, /DevelopmentFixtureGate feature="Certificate issuance"/);
  assert.match(login, /school:\s+"\/school"/);
  assert.equal(login.includes('school:  "/dashboard"'), false);
});

test("school registration and mentor approval use backend-owned field contracts", () => {
  const school = read("../components/Credential/RegisterSchool.tsx");
  const applications = read("../components/admin/ApplicationsReview.tsx");

  assert.match(school, /contact_phone:\s+data\.phone/);
  assert.equal(applications.includes("mentor: app.mentor"), false);
  assert.match(applications, /mentor_id: app\.mentor_id/);
  assert.match(applications, /value=\{m\.id\}/);
  assert.equal(applications.includes("invite sent"), false);
});

test("mentor session topics use the backend notes field", () => {
  const mentors = read("../components/Mentors.tsx");
  assert.match(mentors, /notes: formData\.topic/);
  assert.equal(mentors.includes('api.post<{ success: boolean; data: Session }>("/api/intern/mentor/sessions", formData)'), false);
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
