import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, extname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const privateKeyHeader = ["-----BEGIN", "(?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----"].join(" ");
const patterns = [
  ["private key", new RegExp(privateKeyHeader)],
  ["GitHub token", /(?:github_pat_[A-Za-z0-9_]{20,}|gh[pousr]_[A-Za-z0-9]{30,})/],
  ["AWS access key", /(?:AKIA|ASIA)[0-9A-Z]{16}/],
  ["Google API key", /AIza[0-9A-Za-z_-]{30,}/],
  ["Stripe live secret", /sk_live_[0-9A-Za-z]{16,}/],
  ["Slack token", /xox[baprs]-[0-9A-Za-z-]{10,}/],
  ["JWT", /eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/],
  ["credential-bearing URL", /https?:\/\/[^/\s:@]+:[^/\s@]+@/],
];

const approvedSyntheticMatches = new Map([
  [
    "epdg/src/lib/apiConfig.test.mjs",
    new Set([["https://user", "password@"].join(":")]),
  ],
]);

const binaryExtensions = new Set([
  ".avif", ".gif", ".ico", ".jpeg", ".jpg", ".mp4", ".png", ".webp", ".woff", ".woff2",
]);

const listing = spawnSync(
  "git",
  ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
  { cwd: repositoryRoot, encoding: "utf8" },
);
if (listing.error) throw listing.error;
if (listing.status !== 0) throw new Error(`git ls-files failed with exit code ${listing.status}`);

const files = listing.stdout.split("\0").filter(Boolean);
const findings = [];
let scannedFiles = 0;
let syntheticMatches = 0;

for (const repositoryPath of files) {
  if (binaryExtensions.has(extname(repositoryPath).toLowerCase())) continue;
  const absolutePath = resolve(repositoryRoot, repositoryPath);
  const normalizedPath = relative(repositoryRoot, absolutePath).replaceAll("\\", "/");
  const buffer = readFileSync(absolutePath);
  if (buffer.includes(0)) continue;
  const source = buffer.toString("utf8");
  scannedFiles += 1;

  for (const [patternName, pattern] of patterns) {
    const globalPattern = new RegExp(pattern.source, `${pattern.flags}g`);
    for (const match of source.matchAll(globalPattern)) {
      if (approvedSyntheticMatches.get(normalizedPath)?.has(match[0])) {
        syntheticMatches += 1;
        continue;
      }
      const line = source.slice(0, match.index).split(/\r?\n/).length;
      findings.push(`${normalizedPath}:${line}: ${patternName}`);
    }
  }
}

if (findings.length > 0) {
  console.error("Potential credential patterns found (values suppressed):");
  for (const finding of findings) console.error(`- ${finding}`);
  process.exitCode = 1;
} else {
  console.log(
    `Credential-pattern scan passed (${scannedFiles} text files; ${syntheticMatches} approved synthetic rejection fixture).`,
  );
}
