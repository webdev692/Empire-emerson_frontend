import assert from 'node:assert/strict';
import { before,after,test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { createServer } from './node_modules/vite/dist/node/index.js';
import react from './node_modules/@vitejs/plugin-react/dist/index.js';
import React from './node_modules/react/index.js';
import ReactDOMServer from './node_modules/react-dom/server.node.js';
let server,render;
before(async()=>{
  server=await createServer({root:fileURLToPath(new URL('.',import.meta.url)),configFile:false,plugins:[react()],resolve:{dedupe:['react','react-dom']},server:{middlewareMode:true,hmr:false},appType:'custom',logLevel:'silent'});
  const {default:Library}=await server.ssrLoadModule('/src/components/FreeLearningLibrary.tsx');
  render=dataset=>ReactDOMServer.renderToStaticMarkup(React.createElement(Library,{dataset,today:'2026-10-16'}));
});
after(async()=>{await server?.close();});
// Synthetic UI fixtures do not depend on the private catalog-import workflow.
function record(index,extra={}){
  const nullable=['credentialDetails','ceu','ceDetails','hasCe','duration','durationMinutes','delivery','selfPaced','packageVerifiedOn','enrollmentDeadline','publishedAt','sourceUpdatedAt','prerequisites','parentId','externalDeliveryUrl','courseCode','skillLevel','episodes','expirationDate','startDate','endDate','registrationOpensDate','ceStartDate','ceEndDate','enrollmentStatus'];
  const row={...Object.fromEntries(nullable.map(key=>[key,null])),id:`epdg-free-${createHash('sha256').update(`synthetic-test-${index}`).digest('hex').slice(0,24)}`,providerId:'fema_ndemu',provider:'FEMA / NDEMU',externalId:`TEST-${index}`,title:`Official title ${index}`,program:'Independent Study',category:'Emergency Management',subjects:[],resourceType:'course',description:'Brief synthetic course summary.',costUsd:0,costStatus:'verified-free',credentialLabel:'Free Training / Credential Varies',credentialVerified:false,eligibility:'General public; registration required.',restricted:false,language:'English',url:`https://training.fema.gov/programs/independent-study/?code=TEST-${index}`,linkScope:'resource',sourceUrls:['https://training.fema.gov/ndemu/start/'],verifiedOn:'2026-10-16',availability:'active',accessNotes:[],relatedResources:[]};
  const {cost_status,credential_details,...direct}=extra;
  return {...row,...direct,...(cost_status?{costStatus:cost_status}:{}),...(credential_details?{credentialDetails:credential_details}:{})};
}
const dataset=records=>({schemaVersion:'1.0.0',importedAt:'2026-10-16T00:00:00.000Z',records,providers:[]});
test('the EPDG supplement has a section heading, all requested filters, and only twelve initial cards',()=>{
  const html=render(dataset(Array.from({length:20},(_,i)=>record(i))));
  assert.match(html,/<h2 id="epdg-free-learning-title">Free Learning &amp; Credentials<\/h2>/);assert.doesNotMatch(html,/<h1/);
  assert.equal((html.match(/class="cp-card epdg-learning-card"/g)||[]).length,12);
  for(const label of ['Provider','Category','Credential','CE / CEU','Eligibility','Language','Duration','Self-paced','Availability'])assert.ok(html.includes(`<label>${label}<select`));
  assert.match(html,/Showing 1–12 of 20 resources/);assert.match(html,/Next free-learning page/);
});
test('restricted, expired and unverified-price records cannot leak into the default public-free cards',()=>{
  const html=render(dataset([record(1),record(2,{restricted:true,title:'Restricted source item'}),record(3,{availability:'expired',title:'Expired source item'}),record(4,{cost_status:'unverified',title:'Unknown cost item'})]));
  assert.equal((html.match(/class="cp-card epdg-learning-card"/g)||[]).length,1);assert.match(html,/Official title 1/);assert.doesNotMatch(html,/Restricted source item|Expired source item|Unknown cost item/);assert.doesNotMatch(html,/Enroll now/i);
});
test('source requirements and official links precede provider action without affiliation or credential guarantees',()=>{
  const html=render(dataset([record(1,{credential_details:'Credential terms not independently confirmed.'})]));
  assert.match(html,/Listing does not imply provider endorsement of or affiliation with EPDG/);assert.match(html,/General public; registration required/);assert.match(html,/Credential terms not independently confirmed/);assert.match(html,/target="_blank" rel="noreferrer"/);assert.ok(html.indexOf('General public; registration required')<html.indexOf('epdg-learning-link'));
  assert.match(html,/Source checked/);assert.doesNotMatch(html,/Enroll now|Guaranteed|<img/);
});
test('invalid source metadata fails within the library section',()=>{
  const html=render(dataset([{title:'<script>private</script>'}]));assert.match(html,/role="alert"/);assert.match(html,/existing resource collections remain available/);assert.doesNotMatch(html,/<script>|private/);
});
