export type AuthMode = 'signup' | 'login';

export type SendOtpRequest = {
  phoneE164: string;
  /** login | signup — stored for analytics / future risk checks */
  mode: AuthMode;
  channel?: 'sms';
};

export type SendOtpResult =
  | {
      ok: true;
      /** demo | twilio */
      provider: 'demo' | 'twilio';
      phoneE164: string;
      /** Twilio verification SID when live; undefined in demo */
      verificationSid?: string;
      /** True when no real SMS was sent */
      demo: boolean;
      message?: string;
    }
  | { ok: false; error: string; code?: string };

export type VerifyOtpRequest = {
  phoneE164: string;
  code: string;
  mode: AuthMode;
};

export type VerifyOtpResult =
  | {
      ok: true;
      provider: 'demo' | 'twilio';
      phoneE164: string;
      demo: boolean;
    }
  | { ok: false; error: string; code?: string };
