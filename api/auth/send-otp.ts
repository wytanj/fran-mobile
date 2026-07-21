import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  isTwilioLive,
  isValidSingaporeE164,
  readJsonBody,
  twilioFormPost,
  verifyServiceUrl,
} from './_twilio';

/**
 * POST /api/auth/send-otp
 * Body: { phone: "+65XXXXXXXX", mode?: "login"|"signup", channel?: "sms" }
 *
 * When TWILIO_AUTH_ENABLED is false (default), returns demo success (no SMS).
 * When live, starts Twilio Verify SMS for Singapore numbers.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const body = readJsonBody(req);
  const phone = String(body.phone ?? '').replace(/\s/g, '');
  const channel = String(body.channel ?? 'sms');

  if (!isValidSingaporeE164(phone)) {
    return res.status(400).json({
      ok: false,
      error: 'Invalid Singapore mobile. Use E.164 like +6591234567.',
    });
  }

  if (channel !== 'sms') {
    return res.status(400).json({
      ok: false,
      error: 'Only SMS is supported for Singapore launch.',
    });
  }

  // Demo / pre-launch: no Twilio call
  if (!isTwilioLive()) {
    return res.status(200).json({
      ok: true,
      demo: true,
      phone,
      message: 'Demo mode — OTP not sent. Client accepts 1234.',
    });
  }

  try {
    const { ok, status, body: twilio } = await twilioFormPost(verifyServiceUrl('/Verifications'), {
      To: phone,
      Channel: 'sms',
      // Locale hint for SG English templates when configured on the service
      Locale: 'en',
    });

    if (!ok) {
      const msg =
        typeof twilio.message === 'string'
          ? twilio.message
          : 'Twilio could not send the verification SMS';
      return res.status(status >= 400 && status < 600 ? status : 502).json({
        ok: false,
        error: msg,
        twilioStatus: twilio.status,
      });
    }

    return res.status(200).json({
      ok: true,
      demo: false,
      phone,
      verificationSid: twilio.sid,
      status: twilio.status,
    });
  } catch (e) {
    return res.status(502).json({
      ok: false,
      error: e instanceof Error ? e.message : 'Twilio request failed',
    });
  }
}
