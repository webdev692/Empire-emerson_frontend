import { spawnSync } from 'node:child_process';
import { resolve, basename } from 'node:path';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { validateStudioPublication } from './project-studio-release.mjs';
import { validateThreeProgramsPublication } from './three-programs-release.mjs';
import { validateResearchPublication } from './tee-research-release.mjs';
import { validateFrozenExports } from './public-source-boundary.mjs';
// Both advertised production build commands must use the same frozen gate.
const action = ['build', 'build-live'].includes(process.argv[2]) ? 'build-website' : process.argv[2];
const liveBuild = action === 'build-website';
const websiteApproval = JSON.parse(readFileSync(new URL('../docs/PUBLIC_WEBSITE_REPAIR_2026-10-28.json', import.meta.url), 'utf8'));
if (liveBuild) assert.equal(createHash('sha256').update(readFileSync(new URL('../' + websiteApproval.legal_source_path, import.meta.url), 'utf8').replaceAll('\r\n', '\n')).digest('hex'), websiteApproval.legal_source_sha256_lf, 'Legal text changed; refresh the exact wording review.');
if (!['dev','build','build-review','build-live','build-website','preview'].includes(action)) throw new Error('Use dev, build, build-review, build-live, build-website, or preview');
if (['dev','build-review'].includes(action)) throw new Error('Private content authoring/review is unavailable in this public checkout. Run the frozen public build and preview.');
const port = { Emerson_Empire: '5173', Agency_LandingPage: '5174', 'EPDG-Landing-Page': '5175' }[basename(process.cwd())];
if (!port) throw new Error('Run from one of the three company app directories');
const repository = resolve('..').replaceAll('\\','/');
const git = args => spawnSync('git', ['-c',`safe.directory=${repository}`,'-C',repository,...args], {encoding:'utf8'});
const head = git(['rev-parse','--short=12','HEAD']);
const sourceStatus = git(['status','--porcelain']);
const buildId = head.status === 0 ? `${head.stdout.trim()}${sourceStatus.stdout.trim() ? ' + working tree' : ''}` : 'unrecorded working tree';
const env = { ...process.env, VITE_COMPANY_PLATFORM: 'true', VITE_PUBLIC_INTAKE_RELEASE: liveBuild ? 'true' : 'false', VITE_PUBLIC_LEGAL_APPROVED: websiteApproval.legal_publication_approved === true ? 'true' : 'false', VITE_BUILD_ID: buildId, VITE_PROJECT_STUDIO_RELEASE: 'false', VITE_THREE_PROGRAMS_PREVIEW: 'false', VITE_THREE_PROGRAMS_RELEASE: 'false', VITE_TEE_RESEARCH_PREVIEW: 'false', VITE_TEE_RESEARCH_RELEASE: 'false' };
if (action === 'build-review') {
  const sites = JSON.parse(readFileSync(new URL('../shared/review-sites.json',import.meta.url),'utf8'));
  for (const [entity,site] of Object.entries(sites)) env[`VITE_${entity}_PREVIEW_ORIGIN`] = site.origin;
}
if (liveBuild) {
  const boundary = validateFrozenExports(repository);
  const release = Object.values(boundary.published).find(site => site.app === basename(process.cwd()));
  if (!release) throw new Error('Unknown public content release');
  // Current source revision is visible; historical content receipts remain in the manifest.
  const sites = JSON.parse(readFileSync(new URL('../shared/public-sites.json',import.meta.url),'utf8'));
  for (const [entity,site] of Object.entries(sites)) env[`VITE_${entity}_PUBLIC_ORIGIN`] = site.origin;
  env.VITE_PUBLIC_SITE_ORIGIN = Object.values(sites).find(site=>site.app===basename(process.cwd())).origin;
  const studio = validateStudioPublication(repository);
  env.VITE_PROJECT_STUDIO_RELEASE = studio.destinations.includes(env.VITE_PUBLIC_SITE_ORIGIN) ? 'true' : 'false';
  const programs = validateThreeProgramsPublication(repository);
  env.VITE_THREE_PROGRAMS_RELEASE = programs.destinations.includes(env.VITE_PUBLIC_SITE_ORIGIN) ? 'true' : 'false';
  if (basename(process.cwd()) === 'Emerson_Empire') {
    const research = validateResearchPublication(repository);
    env.VITE_TEE_RESEARCH_RELEASE = research.destination === env.VITE_PUBLIC_SITE_ORIGIN ? 'true' : 'false';
  }
}
const run = (file, args) => {
  const result = spawnSync(process.execPath, [resolve('node_modules', file), ...args], { stdio:'inherit', env });
  if (result.status !== 0) process.exit(result.status || 1);
};
if (['build','build-review','build-live','build-website'].includes(action)) {
  if (liveBuild) {
    const approved = spawnSync(process.execPath, ['--experimental-strip-types', resolve('../scripts/validate-frozen-public-content.mjs')], {stdio:'inherit',env});
    if (approved.status !== 0) process.exit(approved.status || 1);
  }
  if (action === 'build-review') {
    const exportReview = spawnSync(process.execPath, ['--experimental-strip-types', resolve('../scripts/export-review-content.mjs')], {stdio:'inherit',env});
    if (exportReview.status !== 0) process.exit(exportReview.status || 1);
  }
  const gate = spawnSync(process.execPath, ['--experimental-strip-types', resolve('../scripts/validate-public-content.mjs')], { stdio:'inherit', env });
  if (gate.status !== 0) process.exit(gate.status || 1);
  run('typescript/bin/tsc', ['-b']);
}
run('vite/bin/vite.js', action === 'build-review' ? ['build','--mode','protected-review','--outDir','dist-review'] : liveBuild ? ['build','--mode','public-release'] : action === 'build' ? ['build'] : [ ...(action === 'preview' ? ['preview'] : []), '--host','127.0.0.1','--port',port,'--strictPort']);
if (action === 'build-review') {
  const prepare = spawnSync(process.execPath, [resolve('../scripts/prepare-review-artifacts.mjs'), process.cwd()], {stdio:'inherit',env});
  if (prepare.status !== 0) process.exit(prepare.status || 1);
}
if (liveBuild) {
  const prepare = spawnSync(process.execPath, [resolve('../scripts/prepare-live-artifacts.mjs'), process.cwd()], {stdio:'inherit',env});
  if (prepare.status !== 0) process.exit(prepare.status || 1);
}
