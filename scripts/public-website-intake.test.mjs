import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from '../Emerson_Empire/node_modules/vite/dist/node/index.js';
import { fileURLToPath } from 'node:url';

async function policy(mode, enabled, run) {
  const server = await createServer({root:fileURLToPath(new URL('..',import.meta.url)),configFile:false,optimizeDeps:{noDiscovery:true,include:[]},define:{'import.meta.env.MODE':JSON.stringify(mode),'import.meta.env.VITE_PUBLIC_INTAKE_RELEASE':JSON.stringify(enabled),'import.meta.env.VITE_PUBLIC_LEGAL_APPROVED':'"false"'},server:{middlewareMode:true,watch:null,hmr:false},appType:'custom'});
  try { await run(await server.ssrLoadModule('/shared/public-intake.ts')); } finally { await server.close(); }
}
test('registration authorization never enables a protected review or a normal build', async () => {
  for (const mode of ['protected-review','development','production']) await policy(mode,'true', p => {
    assert.equal(p.publicIntakeEnabled,false);
    assert.equal(p.isApprovedPublicDestination(p.publicForms.internship),false);
  });
  await policy('public-release','false',p => assert.equal(p.publicIntakeEnabled,false));
});
test('public release opens only the founder-confirmed form paths and functional email recipients', async () => {
  await policy('public-release','true',p => {
    assert.equal(p.publicIntakeEnabled,true);
    assert.equal(p.publicLegalApproved,false);
    for(const url of Object.values(p.publicForms)) assert.equal(p.isApprovedPublicDestination(url),true);
    assert.equal(p.isApprovedPublicDestination(`mailto:${p.contactMailboxes.hr}?subject=Internship&body=Question`),true);
    for(const url of [
      p.publicForms.internship.replace('docs.google.com','docs.google.com.example.org'),
      p.publicForms.internship.replace('/viewform','/edit'),
      p.publicForms.internship+'?continue=https://example.org',
      'https://docs.google.com/forms/d/e/another-form/viewform',
      'mailto:unverified@theemersonempire.info',
      `mailto:${p.contactMailboxes.hr}?bcc=outside@example.org`,
      `mailto:${p.contactMailboxes.hr}?subject=Hello%0d%0aBcc:outside@example.org`,
      'javascript:alert(1)',
    ]) assert.equal(p.isApprovedPublicDestination(url),false,url);
  });
});
test('the public schedule has exactly the three confirmed daily sessions', async () => {
  await policy('public-release','true',p => assert.deepEqual(p.dailySessions.map(s=>[s.time,s.minutes,s.price]),[['10:00 AM',60,0],['2:00 PM',90,10],['7:00 PM',120,20]]));
});
