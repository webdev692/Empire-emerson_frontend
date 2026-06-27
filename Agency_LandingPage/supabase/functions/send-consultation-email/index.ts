import { Resend } from 'resend'

declare const Deno: { env: { get(key: string): string | undefined }; serve(handler: (req: Request) => Response | Promise<Response>): void }
declare const EdgeRuntime: { waitUntil(promise: Promise<unknown>): void }

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function insertLead(data: Record<string, string | null>) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`DB insert failed: ${text}`)
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS })
  }

  try {
    const {
      firstName,
      lastName,
      fullName,
      email,
      phone,
      message,
      serviceInterest,
      urgency,
      intentDescription,
      trackInterest,
      division,
      divisionLabel,
    } = await req.json()

    const displayName = fullName || `${firstName ?? ''} ${lastName ?? ''}`.trim() || 'Unknown'

    // 1. Store lead in database
    await insertLead({
      first_name: firstName ?? null,
      last_name: lastName ?? null,
      full_name: fullName ?? null,
      email,
      phone: phone ?? null,
      message: message ?? null,
      service_interest: serviceInterest ?? null,
      urgency: urgency ?? null,
      intent_description: intentDescription ?? null,
      track_interest: trackInterest ?? null,
      division: division ?? null,
      division_label: divisionLabel ?? null,
    })

    const firstName_ = firstName ?? displayName.split(' ')[0]

    const divisionTagline: Record<string, string> = {
      agency: 'Tax preparation, insurance education &amp; business consulting built for results.',
      epdg: 'Internship tracks and career development that get you hired.',
    }
    const tagline = divisionTagline[division ?? ''] ?? 'Building legacies across business, finance, and professional development.'

    const divisionUrl: Record<string, string> = {
      agency: 'https://theemersonempire.info/agency',
      epdg: 'https://theemersonempire.info/epdg',
    }
    const ctaUrl = divisionUrl[division ?? ''] ?? 'https://theemersonempire.info'

    const submissionRows = [
      serviceInterest && `<tr><td style="padding:10px 0;color:#888;font-size:13px;width:140px;border-bottom:1px solid #f0f0f0">Service</td><td style="padding:10px 0;font-size:13px;color:#12022A;border-bottom:1px solid #f0f0f0">${serviceInterest}</td></tr>`,
      trackInterest && `<tr><td style="padding:10px 0;color:#888;font-size:13px;width:140px;border-bottom:1px solid #f0f0f0">Track</td><td style="padding:10px 0;font-size:13px;color:#12022A;border-bottom:1px solid #f0f0f0">${trackInterest}</td></tr>`,
      urgency && `<tr><td style="padding:10px 0;color:#888;font-size:13px;width:140px;border-bottom:1px solid #f0f0f0">Urgency</td><td style="padding:10px 0;font-size:13px;color:#12022A;border-bottom:1px solid #f0f0f0">${urgency}</td></tr>`,
      (intentDescription || message) && `<tr><td style="padding:10px 0;color:#888;font-size:13px;width:140px">Your message</td><td style="padding:10px 0;font-size:13px;color:#12022A">${intentDescription ?? message}</td></tr>`,
    ].filter(Boolean).join('')

    const confirmationHtml = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 20px">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:4px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.06)">

        <!-- Header -->
        <tr>
          <td style="background:#12022A;padding:32px 40px 28px">
            <p style="margin:0;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:rgba(255,255,255,.5);margin-bottom:6px">THE EMERSON EMPIRE</p>
            <p style="margin:0;font-size:22px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#ffffff">${divisionLabel ?? 'The Emerson Empire'}</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 40px 0">
            <p style="margin:0 0 6px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#888">Message received</p>
            <h1 style="margin:0 0 20px;font-size:28px;font-weight:700;color:#12022A;line-height:1.2">Thank you, ${firstName_}.</h1>
            <p style="margin:0 0 28px;font-size:15px;color:#555;line-height:1.8">
              We've received your inquiry and one of our team members will be in touch within <strong style="color:#12022A">24 hours</strong>.
            </p>

            <!-- Divider -->
            <div style="height:1px;background:#f0f0f0;margin-bottom:28px"></div>

            <!-- Submission summary -->
            ${submissionRows ? `
            <p style="margin:0 0 12px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#888">Your submission</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px">
              ${submissionRows}
            </table>` : ''}

            <!-- Tagline -->
            <p style="margin:0 0 32px;font-size:14px;color:#888;line-height:1.8;border-left:3px solid #12022A;padding-left:16px">
              ${tagline}
            </p>

            <!-- CTA -->
            <table cellpadding="0" cellspacing="0" style="margin-bottom:36px">
              <tr>
                <td style="background:#12022A;border-radius:3px">
                  <a href="${ctaUrl}" style="display:inline-block;padding:14px 28px;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#ffffff;text-decoration:none">
                    Learn More
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#fafafa;border-top:1px solid #f0f0f0;padding:24px 40px">
            <p style="margin:0 0 4px;font-size:12px;color:#12022A;font-weight:600;letter-spacing:1px">THE EMERSON EMPIRE</p>
            <p style="margin:0;font-size:11px;color:#aaa;line-height:1.6">
              This is a confirmation of your inquiry. Please do not reply to this email.<br>
              &copy; ${new Date().getFullYear()} The Emerson Empire. All rights reserved.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`

    // 2. Admin notification
    await resend.emails.send({
      from: 'The Emerson Empire <noreply@theemersonempire.info>',
      to: 'webdev@theemersonempire.info',
      subject: `New lead — ${divisionLabel ?? division ?? 'Contact'} — ${displayName}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
          <h2 style="color:#12022A">New Lead Received</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:6px 0;color:#555;width:160px">Name</td><td style="padding:6px 0;font-weight:600">${displayName}</td></tr>
            <tr><td style="padding:6px 0;color:#555">Email</td><td style="padding:6px 0;font-weight:600">${email}</td></tr>
            ${phone ? `<tr><td style="padding:6px 0;color:#555">Phone</td><td style="padding:6px 0">${phone}</td></tr>` : ''}
            <tr><td style="padding:6px 0;color:#555">Division</td><td style="padding:6px 0">${divisionLabel ?? division ?? 'N/A'}</td></tr>
            ${serviceInterest ? `<tr><td style="padding:6px 0;color:#555">Service Interest</td><td style="padding:6px 0">${serviceInterest}</td></tr>` : ''}
            ${trackInterest ? `<tr><td style="padding:6px 0;color:#555">Track Interest</td><td style="padding:6px 0">${trackInterest}</td></tr>` : ''}
            ${urgency ? `<tr><td style="padding:6px 0;color:#555">Urgency</td><td style="padding:6px 0">${urgency}</td></tr>` : ''}
            ${intentDescription ? `<tr><td style="padding:6px 0;color:#555">Intent</td><td style="padding:6px 0">${intentDescription}</td></tr>` : ''}
            ${message ? `<tr><td style="padding:6px 0;color:#555">Message</td><td style="padding:6px 0">${message}</td></tr>` : ''}
          </table>
          <hr style="margin:20px 0;border:none;border-top:1px solid #eee"/>
          <p style="color:#999;font-size:12px">The Emerson Empire — Lead Management</p>
        </div>
      `,
    })

    // 3. Branded visitor confirmation — fire-and-forget so it never blocks the response
    EdgeRuntime.waitUntil(
      resend.emails.send({
        from: 'The Emerson Empire <noreply@theemersonempire.info>',
        to: email,
        subject: `We received your message — ${divisionLabel ?? 'The Emerson Empire'}`,
        html: confirmationHtml,
      })
    )

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }
})
