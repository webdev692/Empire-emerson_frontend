const RETURN_MINIMAL = 'return=minimal'

export class RequestBodyTooLargeError extends Error {
  constructor() {
    super('Request body exceeds the allowed size')
    this.name = 'RequestBodyTooLargeError'
  }
}

export class InvalidJsonBodyError extends Error {
  constructor() {
    super('Request body must contain valid JSON')
    this.name = 'InvalidJsonBodyError'
  }
}

/**
 * Create the small PostgREST surface used by the lead function.
 * Preferences are deliberately supplied per request so RPC responses keep
 * their JSON bodies while inserts can opt into an empty response.
 *
 * @param {{
 *   fetcher: typeof fetch,
 *   supabaseUrl: string,
 *   serviceKey: string,
 * }} options
 */
export function createLeadStore({ fetcher, supabaseUrl, serviceKey }) {
  /**
   * @param {string} path
   * @param {Record<string, unknown>} body
   * @param {{ prefer?: string }} [options]
   */
  const post = (path, body, options = {}) => {
    const headers = new Headers({
      'Content-Type': 'application/json',
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
    })
    if (options.prefer) headers.set('Prefer', options.prefer)

    return fetcher(`${supabaseUrl}/rest/v1/${path}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })
  }

  return {
    /** @param {string} requestHash */
    async checkRateLimit(requestHash) {
      const response = await post('rpc/check_lead_rate_limit', {
        request_hash: requestHash,
        max_requests: 5,
        window_minutes: 15,
      })

      if (!response.ok) {
        return { ok: false, allowed: false, status: response.status }
      }

      const result = await response.json()
      return { ok: true, allowed: result === true, status: response.status }
    },

    /** @param {Record<string, string | null>} data */
    insertLead(data) {
      return post('leads', data, { prefer: RETURN_MINIMAL })
    },
  }
}

/**
 * Parse a JSON request without trusting Content-Length as the size boundary.
 * The stream is canceled as soon as the observed body exceeds maxBytes.
 *
 * @param {Request} request
 * @param {number} maxBytes
 * @returns {Promise<unknown>}
 */
export async function readJsonBodyWithinLimit(request, maxBytes) {
  const declaredLength = request.headers.get('content-length')
  if (declaredLength) {
    const parsedLength = Number(declaredLength)
    if (Number.isFinite(parsedLength) && parsedLength > maxBytes) {
      throw new RequestBodyTooLargeError()
    }
  }

  if (!request.body) throw new InvalidJsonBodyError()

  const reader = request.body.getReader()
  const chunks = []
  let totalBytes = 0

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      if (!value) continue

      totalBytes += value.byteLength
      if (totalBytes > maxBytes) {
        await reader.cancel()
        throw new RequestBodyTooLargeError()
      }
      chunks.push(value)
    }
  } finally {
    reader.releaseLock()
  }

  const bodyBytes = new Uint8Array(totalBytes)
  let offset = 0
  for (const chunk of chunks) {
    bodyBytes.set(chunk, offset)
    offset += chunk.byteLength
  }

  try {
    const text = new TextDecoder('utf-8', { fatal: true }).decode(bodyBytes)
    return JSON.parse(text)
  } catch {
    throw new InvalidJsonBodyError()
  }
}
