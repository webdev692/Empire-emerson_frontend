import assert from 'node:assert/strict'
import test from 'node:test'

import { resolveDeploymentBase } from './deploymentBase.ts'

test('uses the site root for Netlify and local builds', () => {
  assert.equal(resolveDeploymentBase(undefined), '/')
  assert.equal(resolveDeploymentBase('  '), '/')
})

test('uses the repository subpath supplied by the GitHub Pages workflow', () => {
  assert.equal(resolveDeploymentBase('/Empire-emerson_frontend/'), '/Empire-emerson_frontend/')
})

test('rejects ambiguous deployment base paths', () => {
  assert.throws(() => resolveDeploymentBase('Empire-emerson_frontend/'), /must start and end/)
  assert.throws(() => resolveDeploymentBase('/Empire-emerson_frontend'), /must start and end/)
})
