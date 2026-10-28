/** Public-only reproduction checks. The private authoring pipeline is separate. */
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('..', import.meta.url));
const npm = process.env.npm_execpath;
assert.equal(process.version, 'v22.23.1', 'Use the pinned Node.js version');
assert.ok(npm, 'Run npm run check:public with npm 11.17.0');
assert.equal(spawnSync(process.execPath, [npm, '--version'], { encoding: 'utf8' }).stdout.trim(), '11.17.0');
const evidence = resolve(root, process.env.EMERSON_EVIDENCE_DIR || '../build-evidence/company-public/working');
mkdirSync(evidence, { recursive: true });
const checks = [];
function run(name, args, cwd = root) {
  const result = spawnSync(process.execPath, args, { cwd, env: { ...process.env, NO_COLOR: '1' }, encoding: 'utf8' });
  writeFileSync(resolve(evidence, name.replaceAll(':', '-') + '.txt'), (result.stdout || '') + (result.stderr || ''));
  checks.push({ name, exit_code: result.status });
  console.log(`${name}: ${result.status === 0 ? 'PASS' : 'FAIL'}`);
  if (result.status !== 0) console.error((result.stdout || '') + (result.stderr || ''));
}
run('public-regression', ['--experimental-strip-types', '--test', '--test-concurrency=1', 'shared/content.test.mjs', 'shared/inquiry.test.mjs', 'shared/lesson-blocks.test.mjs', 'scripts/route-links.test.mjs', 'scripts/public-website-intake.test.mjs', 'scripts/public-source-boundary.test.mjs', 'scripts/services-catalog.test.mjs', 'scripts/project-studio.test.mjs', 'Emerson_Empire/scCommunityDirectory.test.mjs', 'EPDG-Landing-Page/collegesDirectory.test.mjs', 'EPDG-Landing-Page/freeLearningLibrary.test.mjs']);
run('public-shared-lint', ['Emerson_Empire/node_modules/eslint/bin/eslint.js', '--config', 'Emerson_Empire/eslint.config.js', 'shared/**/*.ts', 'shared/**/*.tsx', '--max-warnings', '0']);
for (const app of ['Emerson_Empire', 'Agency_LandingPage', 'EPDG-Landing-Page']) {
  for (const action of ['build:website', 'lint', 'smoke']) run(app + '-' + action, [npm, 'run', action], resolve(root, app));
}
run('website-artifact-integrity', ['--experimental-strip-types', 'scripts/scan-website-artifacts.mjs']);
const git = args => spawnSync('git', ['-c', `safe.directory=${root.replaceAll('\\', '/').replace(/\/$/, '')}`, '-C', root, ...args], { encoding: 'utf8' });
writeFileSync(resolve(evidence, 'public-verification.json'), JSON.stringify({ scope: 'Three public websites with founder-confirmed intake and schedule; private authoring unavailable', checked_out_revision: git(['rev-parse', 'HEAD']).stdout.trim(), working_tree_dirty: !!git(['status', '--porcelain']).stdout.trim(), observed_at: new Date().toISOString(), node: process.version, result: checks.every(check => check.exit_code === 0) ? 'PASS' : 'FAIL', checks }, null, 2) + '\n');
process.exitCode = checks.every(check => check.exit_code === 0) ? 0 : 1;
