import assert from 'node:assert/strict';
import test from 'node:test';

import { normalizeApiOrigin } from './apiConfig.ts';

test('accepts only credential-free HTTP(S) origins', () => {
  assert.equal(normalizeApiOrigin('https://api.example.com/'), 'https://api.example.com');
  assert.equal(normalizeApiOrigin('http://localhost:3000'), 'http://localhost:3000');
  assert.equal(normalizeApiOrigin('https://api.example.com/v1'), null);
  assert.equal(normalizeApiOrigin('https://user:password@api.example.com'), null);
  assert.equal(normalizeApiOrigin('ftp://api.example.com'), null);
});

test('fails closed for missing or malformed configuration', () => {
  assert.equal(normalizeApiOrigin(undefined), null);
  assert.equal(normalizeApiOrigin('   '), null);
  assert.equal(normalizeApiOrigin('not a URL'), null);
});
