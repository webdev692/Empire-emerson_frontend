import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, isAbsolute, join, posix, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const manifestPath = join(repositoryRoot, "config", "site-identities.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const args = new Set(process.argv.slice(2));
const siteArgumentIndex = process.argv.indexOf("--site");
const selectedSite = siteArgumentIndex === -1 ? null : process.argv[siteArgumentIndex + 1];
const remoteMode = args.has("--remote");
const skipBuild = args.has("--no-build");
const reportOnly = args.has("--report-only");
const manifestOnly = args.has("--manifest-only");

if (siteArgumentIndex !== -1 && (!selectedSite || selectedSite.startsWith("--"))) {
  throw new Error("--site requires a site id or source directory from config/site-identities.json");
}

if (remoteMode && skipBuild) {
  throw new Error("--no-build applies only to local verification");
}

if (reportOnly && !remoteMode) {
  throw new Error("--report-only is permitted only with the read-only --remote audit");
}

assert.equal(manifest.schemaVersion, 1, "Unsupported site identity manifest schema");
assert.match(manifest.releaseMarker, /^\d{4}-\d{2}-\d{2}-[a-z0-9-]+$/i, "Invalid release marker");
assert.equal(manifest.sites.length, 4, "The identity manifest must contain exactly four sites");

const selectedSites = selectedSite
  ? manifest.sites.filter(
      (site) => site.id === selectedSite || site.sourceDirectory === selectedSite,
    )
  : manifest.sites;

if (selectedSites.length === 0) {
  throw new Error(`Unknown site: ${selectedSite}`);
}

const seenIds = new Set();
const seenDirectories = new Set();
const seenProjects = new Set();
const seenProductionUrls = new Set();

for (const site of manifest.sites) {
  for (const [label, value, seen] of [
    ["site id", site.id, seenIds],
    ["source directory", site.sourceDirectory, seenDirectories],
    ["Netlify project", site.netlifyProject, seenProjects],
    ["production URL", site.productionUrl, seenProductionUrls],
  ]) {
    assert.equal(typeof value, "string", `${label} must be a string`);
    assert.ok(!seen.has(value), `Duplicate ${label}: ${value}`);
    seen.add(value);
  }

  assert.equal(site.outputDirectory, "dist", `${site.id} must publish the reviewed dist directory`);
  assert.equal(
    site.netlifyConfigPath,
    `${site.sourceDirectory}/netlify.toml`,
    `${site.id} must use its app-local Netlify config path`,
  );
  assertSafeRepositoryPath(site.sourceDirectory, `${site.id} sourceDirectory`);
  assertSafeRepositoryPath(site.outputDirectory, `${site.id} outputDirectory`);
  assertSafeRepositoryPath(site.netlifyConfigPath, `${site.id} netlifyConfigPath`);

  for (const field of ["displayName", "title", "openGraphTitle", "openGraphSiteName"]) {
    assert.equal(typeof site[field], "string", `${site.id} ${field} must be a string`);
    assert.ok(site[field].trim().length > 0, `${site.id} ${field} must not be empty`);
  }

  const productionUrl = new URL(site.productionUrl);
  const canonicalUrl = new URL(site.canonicalUrl);
  const openGraphUrl = new URL(site.openGraphUrl);
  for (const [label, url] of [
    ["production URL", productionUrl],
    ["canonical URL", canonicalUrl],
    ["Open Graph URL", openGraphUrl],
  ]) {
    assert.equal(url.protocol, "https:", `${site.id} ${label} must use HTTPS`);
    assert.equal(url.username, "", `${site.id} ${label} must not contain credentials`);
    assert.equal(url.password, "", `${site.id} ${label} must not contain credentials`);
  }
}

function assertSafeRepositoryPath(value, label) {
  assert.equal(typeof value, "string", `${label} must be a string`);
  assert.ok(value.length > 0, `${label} must not be empty`);
  assert.ok(!isAbsolute(value), `${label} must be relative to the repository`);
  const resolved = resolve(repositoryRoot, value);
  const fromRoot = relative(repositoryRoot, resolved);
  assert.ok(fromRoot && !fromRoot.startsWith("..") && !isAbsolute(fromRoot), `${label} escapes the repository`);
  assert.ok(!value.includes("\\"), `${label} must use portable forward slashes`);
  assert.equal(posix.normalize(value), value, `${label} is not normalized`);
}

if (manifestOnly) {
  console.log("Site identity manifest verified (4 unique, portable site mappings).");
  process.exit(0);
}

function decodeHtml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function normalizeText(value) {
  return decodeHtml(value).replace(/\s+/g, " ").trim();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function readElementText(html, element) {
  const match = html.match(new RegExp(`<${element}\\b[^>]*>([\\s\\S]*?)<\\/${element}>`, "i"));
  return match ? normalizeText(match[1]) : null;
}

function readAttribute(html, selectorAttribute, selectorValue, targetAttribute) {
  const tags = html.match(/<(?:meta|link)\b[^>]*>/gi) ?? [];
  for (const tag of tags) {
    const selector = tag.match(new RegExp(`\\b${escapeRegExp(selectorAttribute)}=["']([^"']*)["']`, "i"));
    if (!selector || selector[1].toLowerCase() !== selectorValue.toLowerCase()) continue;
    const target = tag.match(new RegExp(`\\b${escapeRegExp(targetAttribute)}=["']([^"']*)["']`, "i"));
    return target ? normalizeText(target[1]) : null;
  }
  return null;
}

function extractIdentity(html) {
  return {
    title: readElementText(html, "title"),
    canonicalUrl: readAttribute(html, "rel", "canonical", "href"),
    openGraphTitle: readAttribute(html, "property", "og:title", "content"),
    openGraphUrl: readAttribute(html, "property", "og:url", "content"),
    openGraphSiteName: readAttribute(html, "property", "og:site_name", "content"),
    releaseMarker: readAttribute(html, "name", "emerson-release", "content"),
  };
}

function expectedIdentity(site) {
  return {
    title: site.title,
    canonicalUrl: site.canonicalUrl,
    openGraphTitle: site.openGraphTitle,
    openGraphUrl: site.openGraphUrl,
    openGraphSiteName: site.openGraphSiteName,
    releaseMarker: manifest.releaseMarker,
  };
}

class IdentityDriftError extends Error {}

function compareIdentity(site, actual, sourceLabel) {
  const expected = expectedIdentity(site);
  const drift = [];
  for (const key of Object.keys(expected)) {
    if (actual[key] !== expected[key]) {
      drift.push(`${key}: expected ${JSON.stringify(expected[key])}, received ${JSON.stringify(actual[key])}`);
    }
  }
  if (drift.length > 0) {
    throw new IdentityDriftError(`${site.sourceDirectory} identity drift in ${sourceLabel}:\n  - ${drift.join("\n  - ")}`);
  }
}

function runBuild(site) {
  const command = process.platform === "win32" ? (process.env.ComSpec ?? "cmd.exe") : "npm";
  const commandArguments = process.platform === "win32"
    ? ["/d", "/s", "/c", "npm.cmd run build"]
    : ["run", "build"];
  const result = spawnSync(command, commandArguments, {
    cwd: join(repositoryRoot, site.sourceDirectory),
    encoding: "utf8",
    stdio: "inherit",
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${site.sourceDirectory} build failed with exit code ${result.status}`);
  }
}

function verifyLocal(site) {
  const appRoot = join(repositoryRoot, site.sourceDirectory);
  const outputRoot = join(appRoot, site.outputDirectory);
  const sourceIndexPath = join(appRoot, "index.html");
  const builtIndexPath = join(outputRoot, "index.html");

  assert.ok(existsSync(appRoot), `${site.sourceDirectory} source directory is missing`);
  assert.ok(existsSync(join(appRoot, "package.json")), `${site.sourceDirectory} package.json is missing`);
  assert.ok(existsSync(join(repositoryRoot, site.netlifyConfigPath)), `${site.netlifyConfigPath} is missing`);
  if (!skipBuild) runBuild(site);
  assert.ok(existsSync(outputRoot), `${site.sourceDirectory} output directory is missing: ${site.outputDirectory}`);
  assert.ok(existsSync(builtIndexPath), `${site.sourceDirectory} build output is missing index.html`);

  compareIdentity(site, extractIdentity(readFileSync(sourceIndexPath, "utf8")), "source index.html");
  const builtHtml = readFileSync(builtIndexPath, "utf8");
  compareIdentity(site, extractIdentity(builtHtml), `${site.outputDirectory}/index.html`);
  assert.match(builtHtml, /<script\b[^>]*\bsrc=["'][^"']+["']/i, `${site.sourceDirectory} build has no script entry`);
  console.log(`${site.sourceDirectory}: local identity verified`);
}

async function verifyRemote(site) {
  const response = await fetch(site.productionUrl, {
    method: "GET",
    redirect: "follow",
    cache: "no-store",
    headers: { "user-agent": "emerson-read-only-identity-audit/1.0" },
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) {
    throw new Error(`${site.productionUrl} returned HTTP ${response.status}`);
  }
  const html = await response.text();
  compareIdentity(site, extractIdentity(html), `remote page ${site.productionUrl}`);
  console.log(`${site.sourceDirectory}: remote identity verified (${response.url})`);
}

const failures = [];
for (const site of selectedSites) {
  try {
    if (remoteMode) await verifyRemote(site);
    else verifyLocal(site);
  } catch (error) {
    failures.push({
      message: error instanceof Error ? error.message : String(error),
      isIdentityDrift: error instanceof IdentityDriftError,
    });
  }
}

if (failures.length > 0) {
  console.error(`Site identity verification found ${failures.length} failure(s):`);
  for (const failure of failures) console.error(`\n- ${failure.message}`);
  if (!reportOnly || failures.some((failure) => !failure.isIdentityDrift)) process.exitCode = 1;
} else {
  console.log(`Verified ${selectedSites.length} site identit${selectedSites.length === 1 ? "y" : "ies"}.`);
}
