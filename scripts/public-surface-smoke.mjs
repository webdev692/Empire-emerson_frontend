import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = dirname(dirname(fileURLToPath(import.meta.url)));

const checks = {
  Emerson_Empire: {
    routeSource: "src/App.tsx",
    requiredRoutes: [
      "/",
      "/services",
      "/register",
      "/about",
      "/classes",
      "/contact",
      "/disclaimer",
      "/global-internship",
      "/epdg",
      "/agency",
    ],
    responsiveSource: "src/Components/Umbrella/Navbar.tsx",
    responsiveTokens: ["md:hidden", "md:flex"],
    linkSources: [
      { path: "src/Components/MainRender/EmpireLanding.tsx", route: "/" },
      { path: "src/Components/Umbrella/Navbar.tsx", route: "/" },
      { path: "src/Components/Umbrella/Footer.tsx", route: "/" },
    ],
    fragmentSources: {
      "/": ["src/Components/MainRender/EmpireLanding.tsx"],
      "/classes": ["src/Components/Umbrella/Classes.tsx"],
      "/global-internship": ["src/Components/Umbrella/GlobalInternship.tsx"],
      "/services": ["src/Components/Umbrella/Services.tsx"],
    },
  },
  Agency_LandingPage: {
    routeSource: null,
    requiredRoutes: ["/"],
    responsiveSource: "src/Components/Umbrella/Navbar.tsx",
    responsiveTokens: ["lg:hidden", "lg:flex"],
    linkSources: [
      { path: "src/Components/MainRender/EmpireLanding.tsx", route: "/" },
      { path: "src/Components/Umbrella/Navbar.tsx", route: "/" },
      { path: "src/Components/Umbrella/Footer.tsx", route: "/" },
    ],
    fragmentSources: {
      "/": [
        "src/Components/MainRender/EmpireLanding.tsx",
        "src/Components/MainRender/ValuesSection.tsx",
        "src/Components/MainRender/ServicesSection.tsx",
        "src/Components/MainRender/SupportSection.tsx",
        "src/Components/MainRender/GetInTouch.tsx",
      ],
    },
  },
  "EPDG-Landing-Page": {
    routeSource: "src/App.tsx",
    requiredRoutes: ["/", "/classes"],
    responsiveSource: "src/components/EPDG/Navbar.tsx",
    responsiveTokens: ["xl:hidden", "xl:flex"],
    linkSources: [
      { path: "src/components/EPDG/LandingPage.tsx", route: "/" },
      { path: "src/components/EPDG/Navbar.tsx", route: "/" },
      { path: "src/components/EPDG/EPDGFooter.tsx", route: "/" },
      { path: "src/components/EPDG/ClassesPage.tsx", route: "/classes" },
    ],
    fragmentSources: {
      "/": [
        "src/components/EPDG/LandingPage.tsx",
        "src/components/EPDG/Hero.tsx",
        "src/components/EPDG/ClassHighlight.tsx",
        "src/components/EPDG/CareerServices.tsx",
        "src/components/EPDG/Internship.tsx",
        "src/components/EPDG/WorkforceTraining.tsx",
        "src/components/EPDG/CTASection.tsx",
      ],
      "/classes": ["src/components/EPDG/ClassesPage.tsx"],
    },
  },
  epdg: {
    routeSource: "src/App.tsx",
    requiredRoutes: [
      "/",
      "/login",
      "/register",
      "/register/intern",
      "/register/company",
      "/register/school",
      "/forgot-password",
      "/reset-password",
      "/change-password",
      "/verify-email",
      "/verify/:certificateId",
      "/pending-approval",
    ],
    responsiveSource: "src/components/Credential/Login.tsx",
    responsiveTokens: ["lg:hidden", "lg:flex"],
    linkSources: [{ path: "src/components/Credential/Login.tsx", route: "/" }],
    fragmentSources: {
      "/": ["src/components/Credential/Login.tsx"],
    },
  },
};

function read(appRoot, path) {
  return readFileSync(join(appRoot, path), "utf8");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractStaticLinks(source) {
  const links = new Set();
  const patterns = [
    /\b(?:href|to)\s*=\s*["']([^"']+)["']/g,
    /\bhref\s*:\s*["']([^"']+)["']/g,
    /\b[A-Z][A-Z0-9_]*_URL\s*=\s*["']([^"']+)["']/g,
  ];
  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) links.add(match[1]);
  }
  return [...links];
}

function routeWithoutFragment(value) {
  return value.split(/[?#]/, 1)[0] || "/";
}

function fragmentFromLink(value) {
  const hashIndex = value.indexOf("#");
  return hashIndex === -1 ? null : value.slice(hashIndex + 1);
}

function assertSafeLink(app, value) {
  assert.ok(value.trim().length > 0, `${app} contains an empty static link`);
  assert.doesNotMatch(value, /(?:YOUR_|PLACEHOLDER|example\.com)/i, `${app} contains a placeholder link: ${value}`);
  assert.doesNotMatch(value, /^(?:javascript|data|file):/i, `${app} contains an unsafe link scheme: ${value}`);
  if (/^https?:/i.test(value)) {
    const url = new URL(value);
    assert.equal(url.protocol, "https:", `${app} public link must use HTTPS: ${value}`);
    assert.equal(url.username, "", `${app} public link must not contain credentials: ${value}`);
    assert.equal(url.password, "", `${app} public link must not contain credentials: ${value}`);
  } else {
    assert.match(value, /^(?:\/|#|mailto:|tel:)/, `${app} contains an unsupported static link: ${value}`);
  }
}

export function verifyPublicSurface(app) {
  const config = checks[app];
  if (!config) throw new Error(`Unknown application directory: ${app}`);
  const appRoot = join(repositoryRoot, app);
  const sourceIndex = read(appRoot, "index.html");
  const builtIndex = read(appRoot, "dist/index.html");

  for (const [label, html] of [["source", sourceIndex], ["build", builtIndex]]) {
    const viewport = html.match(/<meta\s+name=["']viewport["']\s+content=["']([^"']+)["']/i)?.[1];
    assert.ok(viewport, `${app} ${label} index is missing a viewport declaration`);
    assert.match(viewport, /(?:^|,)\s*width=device-width(?:,|$)/i, `${app} ${label} viewport is not device-width responsive`);
    assert.match(viewport, /(?:^|,)\s*initial-scale=1(?:\.0)?(?:,|$)/i, `${app} ${label} viewport has no initial scale`);
  }

  const routeSource = config.routeSource ? read(appRoot, config.routeSource) : "";
  const declaredRoutes = new Set(["/"]);
  for (const match of routeSource.matchAll(/<Route\b[^>]*\bpath=["']([^"']+)["']/g)) {
    if (match[1].startsWith("/")) declaredRoutes.add(match[1]);
  }
  for (const route of config.requiredRoutes) {
    assert.ok(declaredRoutes.has(route), `${app} is missing required route ${route}`);
  }

  const responsiveSource = read(appRoot, config.responsiveSource);
  for (const token of config.responsiveTokens) {
    assert.ok(responsiveSource.includes(token), `${app} responsive source is missing ${token}`);
  }

  const fragmentContent = new Map(
    Object.entries(config.fragmentSources).map(([route, sources]) => [
      route,
      sources.map((source) => read(appRoot, source)).join("\n"),
    ]),
  );

  let staticLinkCount = 0;
  for (const linkSource of config.linkSources) {
    const links = extractStaticLinks(read(appRoot, linkSource.path));
    for (const link of links) {
      staticLinkCount += 1;
      assertSafeLink(app, link);
      if (link.startsWith("/")) {
        const targetRoute = routeWithoutFragment(link);
        assert.ok(declaredRoutes.has(targetRoute), `${app} link targets undeclared route ${targetRoute} in ${linkSource.path}`);
      }
      const fragment = fragmentFromLink(link);
      if (fragment) {
        const targetRoute = link.startsWith("/") ? routeWithoutFragment(link) : linkSource.route;
        const sources = fragmentContent.get(targetRoute) ?? "";
        assert.match(
          sources,
          new RegExp(`\\bid=["']${escapeRegExp(fragment)}["']`),
          `${app} link targets missing fragment #${fragment} on ${targetRoute}`,
        );
      }
    }
  }

  assert.ok(staticLinkCount > 0, `${app} public-surface smoke did not inspect any static links`);
  console.log(`${app}: public-surface smoke passed (${staticLinkCount} static links; no requests or submissions)`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const app = process.argv[2];
  if (!app) throw new Error("Usage: node scripts/public-surface-smoke.mjs <application-directory>");
  verifyPublicSurface(app);
}
