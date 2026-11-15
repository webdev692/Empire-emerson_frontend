/** Verify reviewed media bytes, permission scope, responsive markup and private-source isolation. */
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { attributes, visibleText } from './verify-modern-public.mjs';
import { validatePhotographyAssignments, validateLeadershipPhotography } from './leadership-photography-checks.mjs';
const root=fileURLToPath(new URL('..',import.meta.url));
const require=createRequire(import.meta.url), sharp=require('../Agency_LandingPage/node_modules/sharp');
const read=path=>readFileSync(resolve(root,path),'utf8');
const raw=read('shared/public-media.json').replaceAll('\r\n','\n'),media=JSON.parse(raw),approval=JSON.parse(read('docs/PUBLIC_MEDIA_PHASE_TWO_APPROVAL.json')),sites=JSON.parse(read('shared/public-sites.json'));
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
assert.equal(approval.permission,'APPROVED_BY_FOUNDER');
assert.equal(digest(raw),approval.manifestSha256,'Media changed after approval record');
assert.deepEqual(media.assets.map(a=>a.id),approval.assets);
assert.equal(media.assets.length,20);assert.equal(new Set(approval.assets).size,20);
assert.equal(media.assets.filter(a=>a.kind==='portrait').length,4);
const photography=validatePhotographyAssignments(media);
assert.ok(!/drive\.google|googleDrive|sourceSha|permissions|@gmail|localSourcePath|C:\\/i.test(raw),'Private source metadata must remain outside public bundles');
const roles={'lyric-helena-emerson':new Set(['lyric-helena-emerson-executive','lyric-helena-emerson-plum']),'darin-latrelle-james':new Set(['darin-latrelle-james-option-b'])};
let verifiedFiles=0,renderedPlacements=0;
for(const asset of media.assets){
 assert.ok(['brand','editorial','portrait'].includes(asset.kind));
 assert.ok(asset.alt.trim() && asset.title.trim());
 assert.ok(asset.width>0 && asset.height>0);
 assert.ok(asset.files.some(f=>f.format==='webp') && asset.files.some(f=>f.format==='jpeg'));
 if(asset.kind==='portrait')assert.equal(asset.caption,'','No visible portrait caption authorized');
 assert.ok(new Set(asset.files.filter(f=>f.format==='webp').map(f=>f.width)).size>=2);
}
for(const [entity,site] of Object.entries(sites)){
 const placements=media.placements.filter(p=>p.entity===entity),manifest=JSON.parse(read(`${site.app}/dist/public-routes.json`));
 const expectedFiles=new Set();
 const retained=media.retainedAssets.filter(item=>item.entities.includes(entity));
 for(const assetId of new Set([...placements,...retained].map(item=>item.assetId))){
  const asset=media.assets.find(a=>a.id===assetId);assert.ok(asset,'Reference has no reviewed asset');
  for(const file of asset.files){
   assert.match(file.src,/^\/media\/[a-z0-9-]+\.(webp|avif|jpg)$/);
   assert.ok(file.bytes<200000,'Public image exceeds the 200 KB variant budget');
   assert.ok(Math.abs(file.width/file.height-asset.width/asset.height)<.003,'Image distorted or cropped');
   expectedFiles.add(basename(file.src));
   for(const folder of ['public','dist']){const bytes=readFileSync(resolve(root,site.app,folder,file.src.slice(1)));assert.equal(bytes.length,file.bytes);assert.equal(digest(bytes),file.sha256,'Public asset differs from reviewed bytes');}
   const meta=await sharp(resolve(root,site.app,'dist',file.src.slice(1))).metadata();
   assert.equal(meta.width,file.width);assert.equal(meta.height,file.height);
   assert.ok(!meta.exif && !meta.xmp && !meta.iptc,'Private metadata must not be bundled');verifiedFiles++;
  }
 }
 for(const placement of placements){
  const asset=media.assets.find(a=>a.id===placement.assetId);
  assert.equal(placement.role,asset.kind);
  if(placement.role==='portrait')assert.ok(roles[placement.subject]?.has(asset.id),'Wrong or unidentified subject');
  if(placement.role!=='brand')assert.ok(manifest.routes.some(r=>r.path===placement.path),'Unknown placement page');
  const html=read(`${site.app}/dist/${placement.role==='brand'?'':placement.path.slice(1)+'/'}index.html`);
  const files=asset.files.map(f=>f.src),picture=[...html.matchAll(/<picture\b[^>]*>([\s\S]*?)<\/picture>/gi)].find(m=>files.some(src=>m[1].includes(src)));
  assert.ok(picture,`Missing rendered media: ${entity} ${asset.id}`);
  assert.match(picture[1],/type="image\/webp"/i);assert.match(picture[1],/srcset="/i);assert.match(picture[1],/sizes="/i);
  const img=attributes(picture[1].match(/<img\b([^>]*)>/i)[1]);assert.equal(img.alt,asset.kind==='brand'?'':asset.alt);
  if(placement.role==='editorial'){assert.equal(img.loading,'lazy');assert.ok(visibleText(html).includes(asset.title));assert.ok(visibleText(html).includes(asset.caption));}
  if(placement.role==='portrait'){
   const figure=[...html.matchAll(/<figure\b[^>]*>([\s\S]*?)<\/figure>/gi)].find(m=>files.some(src=>m[1].includes(src)));
   assert.ok(figure && !/<figcaption\b/i.test(figure[1]),'Portrait must have no visible caption');
  }
  renderedPlacements++;
 }
 for(const route of manifest.routes.filter(item=>item.path==='/leadership'||item.path.startsWith('/leadership/'))){
  validateLeadershipPhotography(read(`${site.app}/dist/${route.path.slice(1)}/index.html`),{entity,path:route.path,media});
 }
 assert.deepEqual(readdirSync(resolve(root,site.app,'public/media')).sort(),[...expectedFiles].sort(),'Unreviewed media file in public source');
}
console.log(JSON.stringify({passed:true,assets:media.assets.length,photography,verifiedFiles,renderedPlacements,maximumVariantBytes:Math.max(...media.assets.flatMap(a=>a.files).map(f=>f.bytes))},null,2));
