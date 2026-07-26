import assert from 'node:assert/strict'
import test from 'node:test'

import {
  createLeadStore,
  InvalidJsonBodyError,
  readJsonBodyWithinLimit,
  RequestBodyTooLargeError,
} from './lead-store.mjs'

test('uses one atomic storage RPC without suppressing its state response', async () => {
  /** @type {Array<{ url: RequestInfo | URL, init: RequestInit }>} */
  const requests = []
  /** @type {typeof fetch} */
  const fetcher = (url, init) => {
    if (!init) throw new Error('Expected request initialization')
    requests.push({ url, init })
    return Promise.resolve(
      new Response('"inserted"', { status: 200, headers: { 'Content-Type': 'application/json' } }),
    )
  }
  const store = createLeadStore({
    fetcher,
    supabaseUrl: 'https://example.supabase.co',
    serviceKey: 'fixture',
  })

  const result = await store.storeLeadRequest('request-hash', 'request-key', {
    email: 'person@example.com',
  })

  assert.deepEqual(result, { ok: true, state: 'inserted', status: 200 })
  assert.equal(requests.length, 1)
  assert.equal(
    String(requests[0].url),
    'https://example.supabase.co/rest/v1/rpc/store_lead_request',
  )
  assert.equal(new Headers(requests[0].init.headers).has('Prefer'), false)
  assert.deepEqual(JSON.parse(String(requests[0].init.body)), {
    p_request_hash: 'request-hash',
    p_request_key: 'request-key',
    p_email: 'person@example.com',
    p_max_requests: 5,
    p_window_minutes: 15,
  })
})

test('enforces the observed request-body byte limit even when Content-Length is misleading', async () => {
  const encodedBody = new TextEncoder().encode('{"message":"too large"}')
  const request = new Request('https://example.test/inquiry', {
    method: 'POST',
    headers: new Headers({ 'content-length': '1' }),
    body: encodedBody,
  })

  await assert.rejects(() => readJsonBodyWithinLimit(request, 8), RequestBodyTooLargeError)
})

test('rejects malformed JSON as a client error', async () => {
  const encodedBody = new TextEncoder().encode('{not-json}')
  const request = new Request('https://example.test/inquiry', { method: 'POST', body: encodedBody })

  await assert.rejects(() => readJsonBodyWithinLimit(request, 20_000), InvalidJsonBodyError)
})
