// Loopback-only browser mechanism test. No CRM, account, session or mail data.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const app = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const workspace = resolve(app, '../../..');
const output = join(workspace, 'build-evidence/epdg-synthetic-2026-10-27/hosted-frontend/worker-lab');
const normal = join(app, 'dist');
const origin = 'http://127.0.0.1:58085';
const retirement = readFileSync(new URL('./hosted-practice-retirement-worker.js', import.meta.url));
assert.ok(existsSync(join(normal, 'sw.js')) && existsSync(join(normal, 'index.html')), 'Build the normal portal artifact first.');
assert.match(readFileSync(join(normal, 'sw.js'), 'utf8'), /precacheAndRoute/);
let phase = 'normal';
const counts = { normalIndexResponses: 0, normalDashboardResponses: 0, upgradedDashboardResponses: 0, normalWorkerResponses: 0, retirementWorkerResponses: 0 };
const receipts = [];
mkdirSync(output, { recursive: true });
const hash = value => createHash('sha256').update(value).digest('hex');
const snapshot = () => ({ at: new Date().toISOString(), purpose: 'Installed generated normal PWA to audited retirement-worker browser mechanism test only',
  origin, phase, counts: { ...counts }, normalWorkerSha256: hash(readFileSync(join(normal, 'sw.js'))), retirementWorkerSha256: hash(retirement), receipts,
  limitations: 'Not a hosted CRM/backend/browser acceptance test. No published-production artifact provenance is claimed.', productionTouched: false });
const save = () => writeFileSync(join(output, 'receipt.json'), JSON.stringify(snapshot(), null, 2));
const controller = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>EPDG worker upgrade laboratory</title></head><body>
<h1>EPDG worker upgrade laboratory</h1><p>Synthetic browser mechanism test only. No accounts or CRM connection.</p>
<button id="install">Install normal portal worker and comparison data</button>
<button id="open" disabled>Open cached normal portal</button>
<button id="retire" disabled>Publish retirement fixture and update worker</button>
<button id="inspect">Refresh verification</button><p id="state" role="status">Not started</p>
<pre id="verification">No upgraded receipt yet.</pre><iframe id="portal" title="Portal worker test window" style="width:100%;height:480px;border:1px solid"></iframe>
<script>
const origin=location.origin, frame=document.getElementById('portal');
const state=document.getElementById('state'), verification=document.getElementById('verification');
let lastReceipt=null;
async function inspect(){const r=await fetch('/api/worker-lab/status',{cache:'no-store'});const server=await r.json();verification.textContent=JSON.stringify({receipt:lastReceipt,server},null,2);}
document.getElementById('install').onclick=async()=>{try{state.textContent='Installing generated normal PWA worker…';
 const other=await navigator.serviceWorker.register('/other/sw.js',{scope:'/other/',updateViaCache:'none'});
 await caches.open('unrelated-app-cache').then(c=>c.put('/comparison.txt',new Response('SYNTHETIC comparison data')));
 const root=await navigator.serviceWorker.register('/sw.js',{scope:'/',updateViaCache:'none'});await navigator.serviceWorker.ready;
 if(!root.active)await new Promise((resolve,reject)=>{const worker=root.installing||root.waiting;if(!worker)return reject(new Error('Missing worker'));worker.addEventListener('statechange',()=>{if(worker.state==='activated')resolve();});});
 document.getElementById('open').disabled=false;state.textContent='Normal PWA worker installed; unrelated worker and cache prepared.';await inspect();
 }catch(e){state.textContent='Install failed: '+e.message;}};
document.getElementById('open').onclick=()=>{frame.src='/dashboard';document.getElementById('retire').disabled=false;state.textContent='Cached normal portal opened below. Verify its secure-access hold before retirement.';};
document.getElementById('retire').onclick=async()=>{try{state.textContent='Offering the audited retirement worker…';
 await fetch('/api/worker-lab/phase',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phase:'retirement'})});
 const root=await navigator.serviceWorker.getRegistration('/');if(!root)throw new Error('Expected installed root worker');await root.update();
 state.textContent='Retirement worker offered; waiting for upgraded window receipt.';await inspect();
 }catch(e){state.textContent='Retirement failed: '+e.message;}};
window.addEventListener('message',async event=>{if(event.origin!==origin||event.source!==frame.contentWindow||event.data?.type!=='epdg-worker-lab-receipt')return;
 lastReceipt=event.data;const passed=event.data.rootRegistrations===0&&event.data.otherRegistrations===1&&event.data.portalPrecaches===0&&event.data.comparisonCacheRetained===true&&event.data.controller===null;
 state.textContent=passed?'PASS: upgraded portal has no root worker; unrelated worker and cache preserved.':'Verification needs review.';
 await fetch('/api/worker-lab/receipt',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(event.data)});await inspect();});
document.getElementById('inspect').onclick=inspect;
</script></body></html>`;
const upgraded = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Upgraded portal worker proof</title></head><body>
<h1>Upgraded portal reached network</h1><p>No account, CRM or backend request is made by this test document.</p><pre id="result">Checking browser worker state…</pre>
<script>(async()=>{const origin=location.origin,regs=await navigator.serviceWorker.getRegistrations(),keys=await caches.keys();
const receipt={type:'epdg-worker-lab-receipt',rootRegistrations:regs.filter(r=>r.scope===origin+'/').length,otherRegistrations:regs.filter(r=>r.scope===origin+'/other/').length,
portalPrecaches:keys.filter(k=>/^workbox-precache-v[0-9]+-(.*)$/.exec(k)?.[1]===origin+'/').length,comparisonCacheRetained:keys.includes('unrelated-app-cache'),controller:navigator.serviceWorker.controller?.scriptURL??null};
document.getElementById('result').textContent=JSON.stringify(receipt,null,2);parent.postMessage(receipt,origin);})()</script></body></html>`;
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
const server = createServer(async (req, res) => {
  if (req.socket.remoteAddress !== '127.0.0.1' || req.headers.host !== '127.0.0.1:58085') { res.writeHead(403); res.end(); return; }
  const pathname = new URL(req.url, origin).pathname;
  res.setHeader('Cache-Control', 'no-store'); res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method === 'POST') {
    if (req.headers.origin !== origin || req.headers['content-type'] !== 'application/json') { res.writeHead(403); res.end(); return; }
    const chunks = []; let bytes = 0;
    for await (const chunk of req) { bytes += chunk.length; if (bytes > 4096) { res.writeHead(413); res.end(); return; } chunks.push(chunk); }
    let body; try { body = JSON.parse(Buffer.concat(chunks).toString()); } catch { res.writeHead(400); res.end(); return; }
    if (pathname === '/api/worker-lab/phase' && body.phase === 'retirement') phase = 'retirement';
    else if (pathname === '/api/worker-lab/receipt' && body.type === 'epdg-worker-lab-receipt') receipts.push({ rootRegistrations:body.rootRegistrations,otherRegistrations:body.otherRegistrations,portalPrecaches:body.portalPrecaches,comparisonCacheRetained:body.comparisonCacheRetained,controller:body.controller });
    else { res.writeHead(400); res.end(); return; }
    save(); res.setHeader('Content-Type', 'application/json'); res.end('{"success":true}'); return;
  }
  if (req.method !== 'GET') { res.writeHead(405); res.end(); return; }
  if (pathname === '/api/worker-lab') { res.setHeader('Content-Type', 'text/html; charset=utf-8'); res.end(controller); return; }
  if (pathname === '/api/worker-lab/status') { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(snapshot())); return; }
  if (pathname === '/other/sw.js') { res.setHeader('Content-Type', 'text/javascript; charset=utf-8'); res.end("self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));"); return; }
  if (pathname === '/sw.js') {
    res.setHeader('Content-Type', 'text/javascript; charset=utf-8'); res.setHeader('Service-Worker-Allowed', '/');
    if (phase === 'retirement') { counts.retirementWorkerResponses++; res.end(retirement); }
    else { counts.normalWorkerResponses++; res.end(readFileSync(join(normal, 'sw.js'))); } save(); return;
  }
  if (phase === 'retirement' && ['/', '/index.html', '/dashboard', '/login'].includes(pathname)) { counts.upgradedDashboardResponses++; save(); res.setHeader('Content-Type', 'text/html; charset=utf-8'); res.end(upgraded); return; }
  const name = ['/', '/dashboard', '/login'].includes(pathname) ? 'index.html' : pathname.slice(1);
  const file = resolve(normal, name);
  if (!file.startsWith(`${resolve(normal)}${sep}`)) { res.writeHead(403); res.end(); return; }
  if (!existsSync(file)) { res.writeHead(404); res.end(); return; }
  if (name === 'index.html') { counts.normalIndexResponses++; if (pathname === '/dashboard') counts.normalDashboardResponses++; save(); }
  res.setHeader('Content-Type', types[extname(file)] ?? 'application/octet-stream'); res.end(readFileSync(file));
});
server.on('error', () => { console.error('Worker laboratory failed to bind its fixed loopback port; no unrelated process was changed.'); process.exitCode = 1; });
server.listen(58085, '127.0.0.1', () => { save(); console.log('Worker laboratory ready at http://127.0.0.1:58085/api/worker-lab'); });
