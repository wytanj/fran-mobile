import {
  AUTH_API_BASE_URL,
  DEMO_OTP_CODE,
  OTP_LENGTH,
  TWILIO_AUTH_ENABLED,
  TWILIO_VERIFY_CHANNEL,
} from '../../config/auth';
import type { SendOtpRequest, SendOtpResult, VerifyOtpRequest, VerifyOtpResult } from './types';

function apiUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${AUTH_API_BASE_URL}${p}`;
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(apiUrl(path), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  });

  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const err =
      data && typeof data === 'object' && 'error' in data
        ? String((data as { error: unknown }).error)
        : `Request failed (${res.status})`;
    throw new Error(err);
  }

  return data as T;
}

/**
 * Start OTP verification.
 * Demo (default): no SMS; client will accept DEMO_OTP_CODE only.
 * Live: Twilio Verify SMS via /api/auth/send-otp (Singapore E.164).
 */
export async function sendOtp(req: SendOtpRequest): Promise<SendOtpResult> {
  if (!TWILIO_AUTH_ENABLED) {
    // Simulate network latency slightly for realistic UX
    await delay(250);
    return {
      ok: true,
      provider: 'demo',
      phoneE164: req.phoneE164,
      demo: true,
      message: `Demo mode — use code ${DEMO_OTP_CODE}`,
    };
  }

  try {
    const data = await postJson<{
      ok: boolean;
      verificationSid?: string;
      error?: string;
      demo?: boolean;
    }>('/api/auth/send-otp', {
      phone: req.phoneE164,
      mode: req.mode,
      channel: req.channel ?? TWILIO_VERIFY_CHANNEL,
    });

    if (!data.ok) {
      return { ok: false, error: data.error ?? 'Could not send code' };
    }

    return {
      ok: true,
      provider: data.demo ? 'demo' : 'twilio',
      phoneE164: req.phoneE164,
      verificationSid: data.verificationSid,
      demo: !!data.demo,
    };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : 'Could not send code',
      code: 'SEND_FAILED',
    };
  }
}

/**
 * Check OTP.
 * Demo: only DEMO_OTP_CODE (1234) succeeds.
 * Live: Twilio Verify check; demo code still works if server allows (dev only).
 */
export async function verifyOtp(req: VerifyOtpRequest): Promise<VerifyOtpResult> {
  const code = req.code.replace(/\D/g, '').slice(0, OTP_LENGTH);

  if (code.length !== OTP_LENGTH) {
    return { ok: false, error: `Enter the ${OTP_LENGTH}-digit code`, code: 'INVALID_LENGTH' };
  }

  if (!TWILIO_AUTH_ENABLED) {
    await delay(200);
    if (code !== DEMO_OTP_CODE) {
      return { ok: false, error: 'Invalid code. Demo mode accepts 1234 only.', code: 'DEMO_MISMATCH' };
    }
    return {
      ok: true,
      provider: 'demo',
      phoneE164: req.phoneE164,
      demo: true,
    };
  }

  try {
    const data = await postJson<{
      ok: boolean;
      error?: string;
      demo?: boolean;
    }>('/api/auth/verify-otp', {
      phone: req.phoneE164,
      code,
      mode: req.mode,
    });

    if (!data.ok) {
      return { ok: false, error: data.error ?? 'Invalid or expired code', code: 'VERIFY_FAILED' };
    }

    return {
      ok: true,
      provider: data.demo ? 'demo' : 'twilio',
      phoneE164: req.phoneE164,
      demo: !!data.demo,
    };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : 'Could not verify code',
      code: 'VERIFY_FAILED',
    };
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export type { SendOtpRequest, SendOtpResult, VerifyOtpRequest, VerifyOtpResult, AuthMode } from './types';
export { parseSingaporeMobile, formatPhoneDisplay } from './phone';
export { DEMO_OTP_CODE, OTP_LENGTH, OTP_RESEND_SECONDS, TWILIO_AUTH_ENABLED } from '../../config/auth';
