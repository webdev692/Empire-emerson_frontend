import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createServer } from '../Emerson_Empire/node_modules/vite/dist/node/index.js';
import react from '../Emerson_Empire/node_modules/@vitejs/plugin-react/dist/index.js';
import { createElement } from '../node_modules/react/index.js';
import { renderToStaticMarkup } from '../node_modules/react-dom/server.node.js';
import { fileURLToPath } from 'node:url';
const root=fileURLToPath(new URL('..',import.meta.url));
const catalog=JSON.parse(readFileSync(new URL('../shared/services-catalog.public.json',import.meta.url),'utf8'));
test('the new public source manifest binds only the curated customer content',()=>{
 const source=JSON.parse(readFileSync(new URL('../shared/services-sources.json',import.meta.url),'utf8'));
 const text=readFileSync(new URL('../shared/services-catalog.public.json',import.meta.url),'utf8').replaceAll('\r\n','\n');
 assert.equal(createHash('sha256').update(text).digest('hex'),source.catalogSha256);
 assert.deepEqual(source.customerGuides,catalog.guides);
 for(const row of catalog.services) assert.deepEqual(Object.keys(row).sort(),['id','entity','category','name','description','audience','mayInclude','options','access','source','sourcePage','sourcePrepared'].sort());
 for(const row of catalog.classes) assert.deepEqual(Object.keys(row).sort(),['id','entity','series','topic','title','description','audience','learningOutcomes','format','duration','ticketType','price','disclaimer','source','sourceDate','availability'].sort());
});
test('all customer service families and paired price variants are accounted for once',()=>{
  assert.equal(catalog.services.length,36);
  assert.equal(new Set(catalog.services.map(row=>row.id)).size,36);
  assert.equal(catalog.services.reduce((n,row)=>n+row.options.length,0),120);
  for(const [entity,count] of [['TEE',5],['TEA',14],['EPDG',17]]) assert.equal(catalog.services.filter(row=>row.entity===entity).length,count);
  for(const row of catalog.services){assert.ok(row.audience&&row.access&&row.description);assert.ok([1,2].includes(row.sourcePage));assert.equal(row.sourcePrepared,'May 2026');}
  const option=(id,label)=>catalog.services.find(row=>row.id===id).options.find(row=>row.label===label);
  assert.deepEqual(option('tea-individual-tax-preparation','state add-on'),{label:'state add-on',price:'$25-$50/state',basis:'add-on',billingUnit:'state'});
  assert.deepEqual(option('epdg-resume-writing-redesign','rush'),{label:'rush',price:'+$50',basis:'add-on',billingUnit:null});
  assert.equal(option('epdg-resume-writing-redesign','executive/advanced').price,'$200+');
  assert.equal(option('tea-business-operations-support','3-hour package').price,'$200');
  assert.equal(option('tea-business-operations-support','5-hour package').price,'$325');
  assert.equal(option('tea-business-operations-support','monthly support').price,'$300-$750/mo');
  assert.equal(option('tea-self-employed-small-business-tax-preparation','complex').price,'custom');
  assert.equal(option('tea-self-employed-small-business-tax-preparation','bookkeeping cleanup').price,'$50-$75/hr');
  assert.equal(option('epdg-job-search-support-package','weekly check-ins').price,'$50/week');
  assert.equal(option('tee-community-workshops-group-education','low-cost workshop').price,'$10-$25/person');
  assert.equal(option('epdg-internship-leadership-track','Participation').price,'Free for selected interns');
  assert.equal(option('epdg-semester-long-internship-program','Participation').price,'Free');
});
test('only the three exact customer PDFs are downloaded; originals remain byte-identical',()=>{
 const hashes={TEE:'71313eb2fddab63981d0de850c7e31525776454537dfceb87aedfb60b3bc239c',TEA:'500c266d555ac8d4d5bfe50b9846c2bbce91f944bcd8a348ca5d9fff4bc974df',EPDG:'366b65a9a98af6f2c1888aebd914f6f747b9426439a34f655830d27524b27d11'};
 for(const guide of catalog.guides){const app={TEE:'Emerson_Empire',TEA:'Agency_LandingPage',EPDG:'EPDG-Landing-Page'}[guide.entity];const blob=readFileSync(new URL(`../${app}/public${guide.href}`,import.meta.url));assert.equal(blob.subarray(0,5).toString(),'%PDF-');assert.equal(blob.length,guide.bytes);assert.equal(createHash('sha256').update(blob).digest('hex'),hashes[guide.entity]);assert.equal(guide.sha256,hashes[guide.entity]);}
});
test('class availability, pricing gaps and retained topics are explicit without fabricated schedules or capacity',()=>{
 assert.equal(catalog.classes.length,19);assert.equal(catalog.retainedTopics.length,2);
 assert.equal(catalog.classes.filter(row=>row.price==='Free').length,7);
 assert.equal(catalog.classes.filter(row=>row.price===null).length,12);
 for(const row of catalog.classes){assert.equal(row.entity,'TEE');assert.ok(row.title&&row.description&&row.audience&&row.disclaimer);assert.equal(row.sourceDate,null);assert.equal(row.availability,'Dates, capacity and registration not confirmed.');assert.ok(!('spotsTaken' in row));assert.ok(!('schedule' in row));}
 assert.doesNotMatch(JSON.stringify(catalog),/Internal use|Internal Curriculum|compensation|revenue.share|staff instructions|answer.key|drive\.google|forms\.gle|Instructor Guide|NotebookLM/i);
});
test('rendered company catalogs isolate ownership, expose estimates and preserve free internships',async()=>{
 const server=await createServer({root,configFile:false,plugins:[react()],optimizeDeps:{noDiscovery:true,include:[]},define:{'import.meta.env.DEV':'true','import.meta.env.BASE_URL':'"/"'},server:{middlewareMode:true,watch:null,hmr:false},appType:'custom'});
 try{
  const {default:Services}=await server.ssrLoadModule('/shared/ServicesPricing.tsx');
  const {default:Classes}=await server.ssrLoadModule('/shared/ClassOfferings.tsx');
  const {serviceInquiryHref,isServiceInquiryHref}=await server.ssrLoadModule('/shared/service-inquiry.ts');
  for(const entity of ['TEE','TEA','EPDG']){
   const html=renderToStaticMarkup(createElement(Services,{entity}));
   assert.equal((html.match(/class="cp-card sp-service"/g)||[]).length,{TEE:5,TEA:14,EPDG:17}[entity]);
   for(const service of catalog.services) assert.equal(html.includes(`id="${service.id}"`),service.entity===entity);
   assert.match(html,/Planning estimates/);assert.match(html,/No Drive sign-in needed/);assert.match(html,/Registration|registration/);
   const id=catalog.services.find(row=>row.entity===entity).id;
   const url=serviceInquiryHref(entity,id);assert.ok(isServiceInquiryHref(url,entity));assert.ok(!url.includes('+'));assert.ok(url.includes('%20'));
   assert.ok(isServiceInquiryHref(serviceInquiryHref(entity,id,true),entity));
   assert.equal(isServiceInquiryHref(url+'&cc=other@example.com',entity),false);
   assert.equal(isServiceInquiryHref(url.replace('admin@theemersonempire.info','other@example.com'),entity),false);
   assert.equal(isServiceInquiryHref('mailto:admin@theemersonempire.info',entity),false);
   assert.equal(serviceInquiryHref(entity,'unknown'), '#intake-held');
   const parsed=new URL(url);assert.equal(parsed.pathname,'admin@theemersonempire.info');assert.match(parsed.searchParams.get('subject'),new RegExp(`^\\[${entity}\\]`));
  }
  const html=renderToStaticMarkup(createElement(Classes,{entity:'EPDG'}));assert.equal((html.match(/class="cp-card"/g)||[]).length,19);assert.match(html,/Amount not confirmed/);assert.doesNotMatch(html,/\$10|\$20|spots remaining|Register now/i);
 }finally{await server.close();}
});
test('compiled local cross-company navigation stays local while hosted links use the configured companies',async()=>{
 const sites=JSON.parse(readFileSync(new URL('../shared/public-sites.json',import.meta.url),'utf8'));
 const define={'import.meta.env.DEV':'false','import.meta.env.MODE':'"public-release"'};
 for(const [entity,site] of Object.entries(sites)) define[`import.meta.env.VITE_${entity}_PUBLIC_ORIGIN`]=JSON.stringify(site.origin);
 const server=await createServer({root,configFile:false,define,optimizeDeps:{noDiscovery:true,include:[]},server:{middlewareMode:true,watch:null,hmr:false},appType:'custom'});
 const previous=globalThis.window;
 try{
  const {companyHref}=await server.ssrLoadModule('/shared/company-links.ts');
  for(const [entity,port] of [['TEE',5173],['TEA',5174],['EPDG',5175]]){
   globalThis.window={location:{href:'http://127.0.0.1:5173/services-pricing'}};
   assert.equal(companyHref(entity,'/services-pricing'),`http://127.0.0.1:${port}/services-pricing`);
   for(const host of ['https://theemerson.netlify.app/','https://127.0.0.1.example.com:5173/','http://127.0.0.1:9999/']){
    globalThis.window={location:{href:host}};assert.equal(companyHref(entity),sites[entity].origin+'/');
   }
  }
 }finally{globalThis.window=previous;await server.close();}
});
