import test from 'node:test';
import assert from 'node:assert/strict';
import { contractHref, localHref } from '../shared/platform-format.ts';
test('company routes and approved local CTA/support paths retain the deployment base', () => {
  assert.equal(localHref('/resources/local-sc-career-navigation','/'),'/resources/local-sc-career-navigation');
  assert.equal(contractHref('/inquiry?topic=PROGRAM','/epdg/'),'/epdg/inquiry?topic=PROGRAM');
  assert.equal(contractHref('https://example.org/info','/epdg/'),'https://example.org/info');
  assert.equal(localHref('/resources/local-sc-career-navigation','/epdg/',true),'/epdg/resources/local-sc-career-navigation?__fixtures=1');
  assert.equal(localHref('/resources?q=cost','/',true),'/resources?q=cost&__fixtures=1');
});
