import assert from 'node:assert/strict'
import test from 'node:test'

import {
  createLeadStore,
  InvalidJsonBodyError,
  readJsonBodyWithinLimit,
  RequestBodyTooLargeError,
} from './lead-store.mjs'

test('keeps the RPC boolean body and applies return=minimal only to lead inserts', async () => {
  /** @type {Array<{ url: RequestInfo | URL, init: RequestInit }>} */
  const requests = []
  /** @type {typeof fetch} */
  const fetcher = (url, init) => {
    if (!init) throw new Error('Expected request initialization')
    requests.push({ url, init })
    if (String(url).endsWith('/rpc/check_lead_rate_limit')) {
      return Promise.resolve(
        new Response('true', { status: 200, headers: { 'Content-Type': 'application/json' } }),
      )
    }
    return Promise.resolve(new Response(null, { status: 201 }))
  }
  const store = createLeadStore({
    fetcher,
    supabaseUrl: 'https://example.supabase.co',
    serviceKey: 'fixture',
  })

  const decision = await store.checkRateLimit('request-hash')
  const insertResponse = await store.insertLead({ email: 'person@example.com' })

  assert.deepEqual(decision, { ok: true, allowed: true, status: 200 })
  assert.equal(insertResponse.status, 201)
  assert.equal(requests.length, 2)
  assert.equal(new Headers(requests[0].init.headers).has('Prefer'), false)
  assert.equal(new Headers(requests[1].init.headers).get('Prefer'), 'return=minimal')
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
