import { DEFAULT_COUNTRY_CALLING_CODE, DEFAULT_COUNTRY_ISO } from '../../config/auth';

export type PhoneParseResult =
  | { ok: true; e164: string; display: string; national: string; country: string }
  | { ok: false; error: string };

/**
 * Normalize user input to Singapore E.164 (+65XXXXXXXX).
 * Accepts: 91234567, 89123456, +6591234567, +65 9123 4567, 65 91234567.
 */
export function parseSingaporeMobile(input: string): PhoneParseResult {
  const raw = input.trim();
  if (!raw) {
    return { ok: false, error: 'Enter your mobile number' };
  }

  let digits = raw.replace(/\D/g, '');

  // Strip leading country code if present
  if (digits.startsWith(DEFAULT_COUNTRY_CALLING_CODE) && digits.length >= 10) {
    digits = digits.slice(DEFAULT_COUNTRY_CALLING_CODE.length);
  }

  // SG mobiles are 8 digits, typically starting with 8 or 9
  if (digits.length !== 8) {
    return { ok: false, error: 'Enter an 8-digit Singapore mobile number' };
  }
  if (!/^[89]\d{7}$/.test(digits)) {
    return { ok: false, error: 'Singapore mobiles start with 8 or 9' };
  }

  const e164 = `+${DEFAULT_COUNTRY_CALLING_CODE}${digits}`;
  const display = `+${DEFAULT_COUNTRY_CALLING_CODE} ${digits.slice(0, 4)} ${digits.slice(4)}`;

  return {
    ok: true,
    e164,
    display,
    national: digits,
    country: DEFAULT_COUNTRY_ISO,
  };
}

/** Display helper for already-stored E.164 or loose strings */
export function formatPhoneDisplay(phone: string): string {
  const parsed = parseSingaporeMobile(phone);
  return parsed.ok ? parsed.display : phone;
}
