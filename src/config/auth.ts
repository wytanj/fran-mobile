/**
 * Auth / OTP configuration.
 *
 * Twilio Verify (SMS-first, Singapore first market) is scaffolded but OFF by default.
 * Flip EXPO_PUBLIC_TWILIO_AUTH_ENABLED=true and set server secrets when ready to go live.
 *
 * Until then every flow uses demo mode: OTP always accepts DEMO_OTP_CODE (1234).
 */

const envFlag = (value: string | undefined, fallback = false): boolean => {
  if (value == null || value === '') return fallback;
  return value === '1' || value.toLowerCase() === 'true' || value === 'yes';
};

/** 4-digit demo OTP — always accepted while Twilio is off (and as a dev escape hatch). */
export const DEMO_OTP_CODE = '1234';

export const OTP_LENGTH = DEMO_OTP_CODE.length; // 4

/** Primary market: Singapore */
export const DEFAULT_COUNTRY_ISO = 'SG';
export const DEFAULT_COUNTRY_CALLING_CODE = '65';

/**
 * Client flag — must match server TWILIO_AUTH_ENABLED for live SMS.
 * Safe default: false (no Twilio calls; demo OTP only).
 */
export const TWILIO_AUTH_ENABLED = envFlag(
  typeof process !== 'undefined' ? process.env.EXPO_PUBLIC_TWILIO_AUTH_ENABLED : undefined,
  false,
);

/**
 * Backend base URL for /api/auth/* (Vercel serverless).
 * Empty = same origin (web) or must be set for native builds when live.
 */
export const AUTH_API_BASE_URL = (
  (typeof process !== 'undefined' && process.env.EXPO_PUBLIC_AUTH_API_URL) ||
  ''
).replace(/\/$/, '');

/** Resend cooldown (seconds) */
export const OTP_RESEND_SECONDS = 30;

/** Primary Twilio Verify channel for SG launch */
export const TWILIO_VERIFY_CHANNEL = 'sms' as const;
