import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  DEMO_OTP_CODE,
  isTwilioLive,
  isValidSingaporeE164,
  readJsonBody,
  twilioFormPost,
  verifyServiceUrl,
} from './_twilio';

/**
 * POST /api/auth/verify-otp
 * Body: { phone: "+65XXXXXXXX", code: "1234", mode?: "login"|"signup" }
 *
 * When TWILIO_AUTH_ENABLED is false (default), only DEMO_OTP_CODE (1234) succeeds.
 * When live, checks code with Twilio Verify (optionally still allows demo code if
 * ALLOW_DEMO_OTP_WHEN_LIVE=true for staging).
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const body = readJsonBody(req);
  const phone = String(body.phone ?? '').replace(/\s/g, '');
  const code = String(body.code ?? '').replace(/\D/g, '');

  if (!isValidSingaporeE164(phone)) {
    return res.status(400).json({
      ok: false,
      error: 'Invalid Singapore mobile. Use E.164 like +6591234567.',
    });
  }

  if (code.length < 4 || code.length > 10) {
    return res.status(400).json({ ok: false, error: 'Invalid code length' });
  }

  // Demo / pre-launch
  if (!isTwilioLive()) {
    if (code !== DEMO_OTP_CODE) {
      return res.status(401).json({
        ok: false,
        error: 'Invalid code. Demo mode accepts 1234 only.',
        demo: true,
      });
    }
    return res.status(200).json({
      ok: true,
      demo: true,
      phone,
      status: 'approved',
    });
  }

  // Staging escape hatch (never enable in true production)
  const allowDemoLive =
    process.env.ALLOW_DEMO_OTP_WHEN_LIVE === '1' ||
    process.env.ALLOW_DEMO_OTP_WHEN_LIVE?.toLowerCase() === 'true';
  if (allowDemoLive && code === DEMO_OTP_CODE) {
    return res.status(200).json({
      ok: true,
      demo: true,
      phone,
      status: 'approved',
      note: 'Demo code accepted while ALLOW_DEMO_OTP_WHEN_LIVE is set',
    });
  }

  try {
    const { ok, status, body: twilio } = await twilioFormPost(
      verifyServiceUrl('/VerificationCheck'),
      {
        To: phone,
        Code: code,
      },
    );

    const twilioStatus = String(twilio.status ?? '');
    const approved = ok && twilioStatus === 'approved';

    if (!approved) {
      const msg =
        typeof twilio.message === 'string'
          ? twilio.message
          : twilioStatus === 'pending'
            ? 'Incorrect code. Try again.'
            : 'Invalid or expired code';
      return res.status(401).json({
        ok: false,
        error: msg,
        twilioStatus,
      });
    }

    return res.status(200).json({
      ok: true,
      demo: false,
      phone,
      status: 'approved',
    });
  } catch (e) {
    return res.status(502).json({
      ok: false,
      error: e instanceof Error ? e.message : 'Twilio verification failed',
    });
  }
}
