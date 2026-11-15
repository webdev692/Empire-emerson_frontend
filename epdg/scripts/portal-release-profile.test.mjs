import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {validatePortalReleaseProfile,portalReleaseRedirects,portalReleaseHeaders,PORTAL_RELEASE_OUTPUT} from './portal-release-profile.mjs';
const fixture=()=>({EPDG_PORTAL_RELEASE_BUILD:'reviewed-candidate',EPDG_PORTAL_RELEASE_ORIGIN:'https://portal.example.invalid',EPDG_PORTAL_RELEASE_API_ORIGIN:'https://fixture.up.railway.app',EPDG_PORTAL_TARGET_REVIEW:'synthetic-test-review'});
test('release build defaults to held and requires explicit exact targets and review reference',()=>{
  assert.throws(()=>validatePortalReleaseProfile({}));const f=fixture();assert.equal(validatePortalReleaseProfile(f).releaseAuthorized,false);
  for(const key of Object.keys(f)){const v={...f};delete v[key];assert.throws(()=>validatePortalReleaseProfile(v));}
  for(const origin of ['http://portal.example.invalid','https://portal.example.invalid/','https://portal.example.invalid/path','https://a:b@portal.example.invalid','https://portal.example.invalid:443','https://127.0.0.1'])assert.throws(()=>validatePortalReleaseProfile({...f,EPDG_PORTAL_RELEASE_ORIGIN:origin}));
});
test('release artifact isolates output, serves deep links and proxies API before SPA fallback',()=>{
  assert.equal(PORTAL_RELEASE_OUTPUT,'dist-portal-release');assert.equal(portalReleaseRedirects(validatePortalReleaseProfile(fixture())),'/api/* https://fixture.up.railway.app/api/:splat 200!\n/* /index.html 200\n');
  assert.match(portalReleaseHeaders,/connect-src 'self'/);assert.match(portalReleaseHeaders,/Cache-Control: no-store/);assert.match(portalReleaseHeaders,/Referrer-Policy: no-referrer/);
  const main=readFileSync(new URL('../src/main.tsx',import.meta.url),'utf8');assert.match(main,/PortalAccessHold/);assert.doesNotMatch(main,/release-main|SyntheticPortal/);
});
