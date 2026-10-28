import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { liveHeaders } from './live-policy.mjs';
import { validateStudioPublication } from './project-studio-release.mjs';
import { validateThreeProgramsPublication } from './three-programs-release.mjs';
import { validateResearchPublication } from './tee-research-release.mjs';
import { validateFrozenExports, publicBoundarySha256 } from './public-source-boundary.mjs';

const root = fileURLToPath(new URL('..',import.meta.url));
const appRoot = resolve(process.argv[2] || '.');
const app = relative(root,appRoot).replaceAll('\\','/');
const sites = JSON.parse(readFileSync(resolve(root,'shared/public-sites.json'),'utf8'));
const entry = Object.entries(sites).find(([,site])=>site.app===app);
assert.ok(entry,'Unknown public application');
const [entity,site] = entry;
const publicBoundary = validateFrozenExports(root);
assert.equal(new URL(site.origin).protocol,'https:');
const out = resolve(appRoot,'dist');
const files = dir=>readdirSync(dir).flatMap(name=>{const path=resolve(dir,name);return statSync(path).isDirectory()?files(path):[path];});
let html=readFileSync(resolve(out,'index.html'),'utf8');
html=html.replace(/<link\b[^>]*rel=["']canonical["'][^>]*>/gi,'').replace(/<meta\b[^>]*property=["']og:url["'][^>]*>/gi,'').replace(/<meta\b[^>]*name=["']robots["'][^>]*>/gi,'')
  .replace('</head>',`<link rel="canonical" href="${site.origin}/" />\n<meta property="og:url" content="${site.origin}/" />\n</head>`);
writeFileSync(resolve(out,'index.html'),html);
writeFileSync(resolve(out,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${site.origin}/sitemap.xml\n`);
const catalog=JSON.parse(readFileSync(resolve(root,'shared/catalog.public.json'),'utf8'));
const common=['/','/services-pricing','/classes','/resources','/learn','/programs','/founder','/leadership','/research','/coverage','/privacy','/terms','/disclaimer','/inquiry','/contact'];
const studio = validateStudioPublication(root);
const studioEnabled = studio.entities.includes(entity);
if (studioEnabled) common.push('/project-studio');
const programApproval = validateThreeProgramsPublication(root);
const primaryProgram = programApproval.programs.find(program=>program.entity===entity);
assert.ok(primaryProgram);
common.push(primaryProgram.route);
const research = entity === 'TEE' ? validateResearchPublication(root) : null;
if (research) common.push(...research.work_ids.map(id=>`/research/${id}`));
const paths=[...common,...catalog.resources.filter(row=>entity==='TEE'||row.entity===entity).map(row=>`/resources/${row.id}`),...catalog.lessons.filter(row=>row.entity===entity).map(row=>`/learn/${row.id}`),...catalog.programs.filter(row=>!['EPDG-PATHWAYS','EPDG-SC-CAREER','EPDG-GLOBAL-INTERNSHIP'].includes(row.id)).map(row=>`/programs/${row.id}`)];
writeFileSync(resolve(out,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+paths.map(path=>`  <url><loc>${site.origin}${path}</loc></url>`).join('\n')+'\n</urlset>\n');
writeFileSync(resolve(out,'_headers'),'/*\n'+Object.entries(liveHeaders).map(([key,value])=>`  ${key}: ${value}`).join('\n')+'\n');
writeFileSync(resolve(out,'_redirects'),'/* /index.html 200\n');
const git=args=>spawnSync('git',['-c',`safe.directory=${root.replaceAll('\\','/').replace(/\/$/,'')}`,'-C',root,...args],{encoding:'utf8'});
const commit=git(['rev-parse','HEAD']); const status=git(['status','--porcelain']);
assert.equal(commit.status,0); assert.equal(status.status,0);
const manifest={schema_version:'1.0.0',entity,app,site_id:site.site_id,origin:site.origin,commit:commit.stdout.trim(),working_tree_dirty:!!status.stdout.trim(),mode:'public-release',content_revision:publicBoundary.published[entity].content_revision,public_boundary_sha256:publicBoundarySha256,built_at:new Date().toISOString(),node:process.version,public_release_approved:true,approval_record:'shared/release-approval.json',registration_enabled:process.env.VITE_PUBLIC_INTAKE_RELEASE === 'true',live_intake_enabled:process.env.VITE_PUBLIC_INTAKE_RELEASE === 'true',
  website_repair:process.env.VITE_PUBLIC_INTAKE_RELEASE === 'true' ? {authorization_record:'docs/PUBLIC_WEBSITE_REPAIR_2026-10-28.json',legal_approved:process.env.VITE_PUBLIC_LEGAL_APPROVED === 'true',forms:'External Google Forms only',portal_changed:false,crm_changed:false,media_studio_changed:false} : null,
  project_studio:studioEnabled ? {approval_record:'docs/PROJECT_STUDIO_PUBLICATION_APPROVAL.json',example_ids:studio.example_ids,data_sha256_lf:studio.data_sha256_lf,planning_only:true} : null,
  three_programs:{approval_record:'docs/THREE_PROGRAMS_PUBLICATION_APPROVAL.json',data_sha256_lf:programApproval.data_sha256_lf,primary_route:primaryProgram.route,program_ids:programApproval.programs.map(program=>program.id),email_drafts_only:process.env.VITE_PUBLIC_INTAKE_RELEASE !== 'true'},
  research:research ? {approval_record:'docs/TEE_RESEARCH_PUBLICATION_APPROVAL.json',reviewed_commit:research.reviewed_commit,data_sha256_lf:research.public_data_sha256_lf,work_ids:research.work_ids,conference_summaries_only:true} : null,
  files:files(out).map(path=>({path:relative(out,path).replaceAll('\\','/'),bytes:statSync(path).size,sha256:createHash('sha256').update(readFileSync(path)).digest('hex')}))};
writeFileSync(resolve(out,'release-build.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(`${entity}: approved public artifacts prepared; current website intake state recorded.`);
