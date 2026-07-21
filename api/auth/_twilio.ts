/**
 * Shared Twilio Verify helpers for Vercel serverless routes.
 * Secrets stay server-side only — never EXPO_PUBLIC_*.
 *
 * Enable when ready:
 *   TWILIO_AUTH_ENABLED=true
 *   TWILIO_ACCOUNT_SID=ACxxx
 *   TWILIO_AUTH_TOKEN=xxx
 *   TWILIO_VERIFY_SERVICE_SID=VAxxx  (configure service for 4-digit codes + SMS)
 *
 * Market: Singapore first (+65). Channel: SMS first.
 */

export const DEMO_OTP_CODE = '1234';

export function isTwilioLive(): boolean {
  const flag = process.env.TWILIO_AUTH_ENABLED;
  const enabled = flag === '1' || flag?.toLowerCase() === 'true' || flag === 'yes';
  if (!enabled) return false;
  return !!(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_VERIFY_SERVICE_SID
  );
}

export function twilioAuthHeader(): string {
  const sid = process.env.TWILIO_ACCOUNT_SID!;
  const token = process.env.TWILIO_AUTH_TOKEN!;
  const raw = `${sid}:${token}`;
  return `Basic ${Buffer.from(raw).toString('base64')}`;
}

export function verifyServiceUrl(path: string): string {
  const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID!;
  return `https://verify.twilio.com/v2/Services/${serviceSid}${path}`;
}

/** Minimal E.164 check for SG mobiles (+658… / +659…) */
export function isValidSingaporeE164(phone: string): boolean {
  return /^\+65[89]\d{7}$/.test(phone);
}

export type TwilioJson = Record<string, unknown>;

export async function twilioFormPost(
  url: string,
  fields: Record<string, string>,
): Promise<{ ok: boolean; status: number; body: TwilioJson }> {
  const body = new URLSearchParams(fields);
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: twilioAuthHeader(),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  let json: TwilioJson = {};
  try {
    json = (await res.json()) as TwilioJson;
  } catch {
    json = {};
  }

  return { ok: res.ok, status: res.status, body: json };
}

export function readJsonBody(req: { body?: unknown }): Record<string, unknown> {
  if (req.body == null) return {};
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  if (typeof req.body === 'object') return req.body as Record<string, unknown>;
  return {};
}
