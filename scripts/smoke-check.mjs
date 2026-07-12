import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const app = process.argv[2];

if (!app) {
  throw new Error("Usage: node scripts/smoke-check.mjs <application-directory>");
}

const appRoot = join(repositoryRoot, app);
const read = (relativePath) => readFileSync(join(appRoot, relativePath), "utf8");

assert.ok(existsSync(join(appRoot, "dist", "index.html")), `${app} build output is missing dist/index.html`);
assert.match(read("dist/index.html"), /<script\b[^>]*\bsrc=/i, `${app} build output has no JavaScript entry`);

switch (app) {
  case "Emerson_Empire": {
    const appSource = read("src/App.tsx");
    assert.doesNotMatch(
      appSource,
      /<Route\s+path=["']\/register["']\s+element=\{<Register\s*\/?>\}/,
      "The placeholder Emerson registration component is still routable",
    );
    break;
  }
  case "Agency_LandingPage": {
    assert.match(
      read("src/Components/MainRender/EmpireLanding.tsx"),
      /<GetInTouch\s*\/>/,
      "The verified Agency contact section is not mounted in the active landing page",
    );
    const contactSource = read("src/Components/MainRender/GetInTouch.tsx");
    assert.match(
      contactSource,
      /onClick=\{openRequestForm\}/,
      "The Agency message CTA is not connected to the request modal",
    );
    assert.doesNotMatch(contactSource, /href=["']\/contact["']/, "The Agency contact CTA still points to a nonexistent route");
    break;
  }
  case "EPDG-Landing-Page": {
    assert.match(read("src/App.tsx"), /<Route\s+path=["']\/classes["']/, "The classes route is missing");
    break;
  }
  case "epdg": {
    const appSource = read("src/App.tsx");
    assert.match(
      appSource,
      /<Route\s+path=["']\/school["'][\s\S]*?<ProtectedRoute[\s\S]*?<SchoolDashboard\s*\/>[\s\S]*?<\/ProtectedRoute>/,
      "The school dashboard is not protected by authentication",
    );
    assert.match(
      appSource,
      /<Route\s+path=["']\/school["'][\s\S]*?<DevelopmentFixtureGate\s+feature=["']School dashboard["']>/,
      "The school fixture dashboard is not gated outside development mock mode",
    );
    assert.match(
      appSource,
      /<Route\s+path=["']\/company["'][\s\S]*?<DevelopmentFixtureGate\s+feature=["']Company dashboard["']>/,
      "The company fixture dashboard is not gated outside development mock mode",
    );
    assert.match(
      appSource,
      /<Route\s+path=["']onboarding["'][\s\S]*?<DevelopmentFixtureGate\s+feature=["']Intern onboarding["']>/,
      "The intern onboarding fallback is not gated outside development mock mode",
    );
    assert.match(
      read("src/lib/runtimeFlags.ts"),
      /import\.meta\.env\.DEV\s*&&\s*import\.meta\.env\.VITE_MOCK_AUTH\s*===\s*["']true["']/,
      "Mock authentication and fixture data are not restricted to an explicit development session",
    );
    assert.doesNotMatch(
      read("src/components/school/SchoolDashboard.tsx"),
      /\bisApproved\s*=\s*true\b/,
      "The school dashboard still forces approval",
    );
    const axiosSource = read("src/lib/axios.ts");
    assert.doesNotMatch(
      axiosSource,
      /\.up\.railway\.app/,
      "The API client still contains an unconfirmed production fallback origin",
    );
    assert.match(
      axiosSource,
      /if\s*\(\s*!API_ORIGIN\s*\)\s*\{[\s\S]*?Promise\.reject\(new ApiConfigurationError\(\)\)/,
      "The API client does not fail closed when its origin is unavailable",
    );

    for (const registrationFile of ["RegisterIntern.tsx", "RegisterCompany.tsx", "RegisterSchool.tsx"]) {
      const registrationSource = read(`src/components/Credential/${registrationFile}`);
      assert.match(
        registrationSource,
        /if\s*\(\s*!API_ORIGIN\s*\)\s*\{[\s\S]*?return;[\s\S]*?await api\.post\(["']\/api\/auth\/register["']/,
        `${registrationFile} does not stop before registration when backend configuration is unavailable`,
      );
      assert.match(
        registrationSource,
        /await api\.post\(["']\/api\/auth\/register["'][\s\S]*?navigate\(["']\/pending-approval["']\)/,
        `${registrationFile} can navigate to success before the backend request resolves`,
      );
    }

    const signUpSource = read("src/components/Credential/SignUp.tsx");
    assert.match(
      signUpSource,
      /const res = await fetch[\s\S]*?if\s*\(\s*!res\.ok\s*\)[\s\S]*?setSuccess\(true\)/,
      "Registration can report success before an HTTP-success response",
    );
    break;
  }
  default:
    throw new Error(`Unknown application directory: ${app}`);
}

console.log(`${app}: smoke checks passed`);
