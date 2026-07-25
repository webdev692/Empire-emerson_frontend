import assert from 'node:assert/strict'
import test from 'node:test'

import { attemptNotification } from './notification.mjs'

test('reports successful notification delivery', async () => {
  let calls = 0
  const sent = await attemptNotification(() => {
    calls += 1
    return Promise.resolve()
  }, () => {
    throw new Error('Failure callback must not run')
  })

  assert.equal(sent, true)
  assert.equal(calls, 1)
})

test('keeps a stored lead successful when notification delivery fails', async () => {
  const deliveryError = new Error('fixture delivery failure')
  let observedError
  const sent = await attemptNotification(
    () => Promise.reject(deliveryError),
    (error) => {
      observedError = error
    },
  )

  assert.equal(sent, false)
  assert.equal(observedError, deliveryError)
})
