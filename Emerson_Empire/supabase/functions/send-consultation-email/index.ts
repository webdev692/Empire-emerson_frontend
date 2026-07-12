import { Resend } from 'resend'

import {
  createLeadStore,
  InvalidJsonBodyError,
  readJsonBodyWithinLimit,
  RequestBodyTooLargeError,
} from './lead-store.mjs'

declare const Deno: {
  env: { get(key: string): string | undefined }
  serve(handler: (req: Request) => Response | Promise<Response>): void
}
declare const EdgeRuntime: { waitUntil(promise: Promise<unknown>): void }

type LeadPayload = {
  firstName?: unknown
  lastName?: unknown
  fullName?: unknown
  email?: unknown
  phone?: unknown
  message?: unknown
  serviceInterest?: unknown
  urgency?: unknown
  intentDescription?: unknown
  trackInterest?: unknown
  division?: unknown
  divisionLabel?: unknown
  website?: unknown
}

const requireEnv = (name: string): string => {
  const value = Deno.env.get(name)?.trim()
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}

const RESEND_API_KEY = requireEnv('RESEND_API_KEY')
const SUPABASE_URL = requireEnv('SUPABASE_URL')
const SUPABASE_SERVICE_KEY = requireEnv('SUPABASE_SERVICE_ROLE_KEY')
const ADMIN_EMAIL = Deno.env.get('LEAD_NOTIFICATION_EMAIL')?.trim() || 'webdev@theemersonempire.info'
const resend = new Resend(RESEND_API_KEY)
const leadStore = createLeadStore({
  fetcher: fetch,
  supabaseUrl: SUPABASE_URL,
  serviceKey: SUPABASE_SERVICE_KEY,
})
const MAX_REQUEST_BYTES = 20_000

const DEFAULT_ORIGINS = [
  'https://theemerson.netlify.app',
  'https://emersonagency.netlify.app',
  'https://emersonprofessionaldevelopment.netlify.app',
  'https://epdg.netlify.app',
  'https://theemersonempire.info',
  'https://www.theemersonempire.info',
  'http://localhost:5173',
  'http://localhost:3000',
]

const ALLOWED_ORIGINS = new Set(
  (Deno.env.get('ALLOWED_ORIGINS') || DEFAULT_ORIGINS.join(','))
    .split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean),
)

const isAllowedOrigin = (origin: string | null): boolean =>
  !origin || ALLOWED_ORIGINS.has(origin.replace(/\/$/, ''))

const corsHeaders = (origin: string | null): Record<string, string> => {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    Vary: 'Origin',
  }
  if (origin && isAllowedOrigin(origin)) headers['Access-Control-Allow-Origin'] = origin
  return headers
}

const jsonResponse = (body: Record<string, unknown>, status: number, origin: string | null): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), 'Content-Type': 'application/json; charset=utf-8' },
  })

const cleanText = (value: unknown, maxLength: number): string | null => {
  if (typeof value !== 'string') return null
  const cleaned = value.split('\u0000').join('').trim()
  return cleaned ? cleaned.slice(0, maxLength) : null
}

const escapeHtml = (value: string | null | undefined): string =>
  (value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')

const sha256 = async (value: string): Promise<string> => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

async function enforceRateLimit(requestHash: string): Promise<boolean> {
  const decision = await leadStore.checkRateLimit(requestHash)
  if (!decision.ok) {
    console.error('Lead rate-limit check failed', { status: decision.status })
    return false
  }
  return decision.allowed
}

async function insertLead(data: Record<string, string | null>): Promise<void> {
  const response = await leadStore.insertLead(data)
  if (!response.ok) {
    console.error('Lead insert failed', { status: response.status })
    throw new Error('Unable to store inquiry')
  }
}

async function sendEmail(input: Parameters<typeof resend.emails.send>[0]): Promise<void> {
  const result = await resend.emails.send(input)
  if (result.error) {
    console.error('Email delivery failed', { name: result.error.name, message: result.error.message })
    throw new Error('Unable to send email')
  }
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get('origin')
  const requestId = crypto.randomUUID()

  if (!isAllowedOrigin(origin)) return jsonResponse({ error: 'Origin not allowed', requestId }, 403, origin)
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(origin) })
  if (req.method !== 'POST') return jsonResponse({ error: 'Method not allowed', requestId }, 405, origin)

  try {
    const payload = (await readJsonBodyWithinLimit(req, MAX_REQUEST_BYTES)) as LeadPayload

    // Honeypot field: silently accept bot submissions without storing or emailing them.
    if (cleanText(payload.website, 200)) return jsonResponse({ success: true, requestId }, 200, origin)

    const firstName = cleanText(payload.firstName, 80)
    const lastName = cleanText(payload.lastName, 80)
    const fullName = cleanText(payload.fullName, 160)
    const email = cleanText(payload.email, 254)?.toLowerCase() || null
    const phone = cleanText(payload.phone, 40)
    const message = cleanText(payload.message, 4000)
    const serviceInterest = cleanText(payload.serviceInterest, 200)
    const urgency = cleanText(payload.urgency, 100)
    const intentDescription = cleanText(payload.intentDescription, 2000)
    const trackInterest = cleanText(payload.trackInterest, 200)
    const requestedDivision = cleanText(payload.division, 40)?.toLowerCase() || ''
    const division = ['agency', 'epdg', 'empire'].includes(requestedDivision) ? requestedDivision : null
    const divisionLabel = cleanText(payload.divisionLabel, 120)
    const displayName = fullName || `${firstName || ''} ${lastName || ''}`.trim() || 'Website visitor'

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonResponse({ error: 'Please provide a valid email address', requestId }, 400, origin)
    }
    if (!message && !intentDescription && !serviceInterest && !trackInterest) {
      return jsonResponse({ error: 'Please describe how we can assist you', requestId }, 400, origin)
    }

    const forwardedFor = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    const requesterHash = await sha256(`${SUPABASE_SERVICE_KEY.slice(-24)}:${forwardedFor || email}`)
    if (!(await enforceRateLimit(requesterHash))) {
      return jsonResponse({ error: 'Too many submissions. Please try again later.', requestId }, 429, origin)
    }

    await insertLead({
      first_name: firstName,
      last_name: lastName,
      full_name: fullName,
      email,
      phone,
      message,
      service_interest: serviceInterest,
      urgency,
      intent_description: intentDescription,
      track_interest: trackInterest,
      division,
      division_label: divisionLabel,
    })

    const safeName = escapeHtml(displayName)
    const safeFirstName = escapeHtml(firstName || displayName.split(' ')[0] || 'there')
    const safeEmail = escapeHtml(email)
    const safePhone = escapeHtml(phone)
    const safeDivision = escapeHtml(divisionLabel || division || 'General inquiry')
    const safeMessage = escapeHtml(intentDescription || message || serviceInterest || trackInterest)

    let adminNotificationSent = true
    try {
      await sendEmail({
        from: 'The Emerson Empire <noreply@theemersonempire.info>',
        to: ADMIN_EMAIL,
        subject: `New website inquiry — ${safeDivision} — ${safeName}`,
        html: `<div style="font-family:Arial,sans-serif;max-width:620px"><h2 style="color:#12022A">New Website Inquiry</h2><p><strong>Name:</strong> ${safeName}</p><p><strong>Email:</strong> ${safeEmail}</p>${safePhone ? `<p><strong>Phone:</strong> ${safePhone}</p>` : ''}<p><strong>Division:</strong> ${safeDivision}</p><p style="white-space:pre-wrap"><strong>Message:</strong><br>${safeMessage}</p><hr><p style="font-size:12px;color:#777">Request ID: ${requestId}</p></div>`,
      })
    } catch (error) {
      adminNotificationSent = false
      console.error('Lead stored but admin notification failed', {
        requestId,
        message: (error as Error).message,
      })
    }

    EdgeRuntime.waitUntil(
      sendEmail({
        from: 'The Emerson Empire <noreply@theemersonempire.info>',
        to: email,
        subject: `We received your message — ${safeDivision}`,
        html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto"><div style="background:#12022A;color:#fff;padding:28px"><small style="letter-spacing:3px">THE EMERSON EMPIRE</small><h2 style="margin-bottom:0">${safeDivision}</h2></div><div style="padding:30px;border:1px solid #eee"><h1 style="color:#12022A">Thank you, ${safeFirstName}.</h1><p style="line-height:1.7;color:#555">We received your inquiry. A team member will review it and follow up using the contact information you provided.</p><p style="font-size:12px;color:#777">Please do not send sensitive financial, tax, insurance, identity, or employment documents by reply.</p></div></div>`,
      }).catch((error) => console.error('Visitor confirmation failed', { requestId, message: (error as Error).message })),
    )

    if (!adminNotificationSent) {
      return jsonResponse({ success: true, requestId, notificationStatus: 'unavailable' }, 200, origin)
    }
    return jsonResponse({ success: true, requestId }, 200, origin)
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return jsonResponse({ error: 'Submission is too large', requestId }, 413, origin)
    }
    if (error instanceof InvalidJsonBodyError) {
      return jsonResponse({ error: 'Submission must be valid JSON', requestId }, 400, origin)
    }
    console.error('Lead function error', { requestId, message: (error as Error).message })
    return jsonResponse({ error: 'We could not process your inquiry. Please try again later.', requestId }, 500, origin)
  }
})
