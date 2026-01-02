/**
 * CAPTCHA Verification
 * Server-side reCAPTCHA v3 / hCaptcha verification
 */

export interface CaptchaResult {
  success: boolean;
  score?: number;
  error?: string;
}

const MIN_SCORE_THRESHOLD = 0.5;

export function isCaptchaEnabled(): boolean {
  return Boolean(process.env.RECAPTCHA_SECRET_KEY);
}


export async function verifyCaptcha(
  token: string | null | undefined
): Promise<CaptchaResult> {
  if (!process.env.RECAPTCHA_SECRET_KEY) {
    if (process.env.NODE_ENV === 'development') {
      return { success: true, score: 1.0 };
    }
    console.error('[Captcha] RECAPTCHA_SECRET_KEY not configured');
    return { success: false, error: 'Captcha not configured' };
  }

  if (!token || typeof token !== 'string' || token.length < 20) {
    return { success: false, error: 'Invalid captcha token' };
  }

  try {
    const response = await fetch(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: token,
        }),
      }
    );

    if (!response.ok) {
      console.error('[Captcha] Google API error:', response.status);
      return { success: false, error: 'Captcha verification failed' };
    }

    const data = (await response.json()) as {
      success: boolean;
      score?: number;
      'error-codes'?: string[];
    };

    if (!data.success) {
      // Verification failed - logged for security monitoring
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[Captcha] Verification failed:', data['error-codes']);
      }
      return { success: false, error: 'Captcha verification failed' };
    }

    const score = data.score ?? 1.0;
    if (score < MIN_SCORE_THRESHOLD) {
      // Low score indicates potential bot - logged for security monitoring
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[Captcha] Low score detected:', score);
      }
      return { success: false, score, error: 'Suspicious activity detected' };
    }

    return { success: true, score };
  } catch (error) {
    console.error('[Captcha] Verification error:', error);
    return { success: false, error: 'Captcha verification error' };
  }
}


export async function verifyHCaptcha(
  token: string | null | undefined
): Promise<CaptchaResult> {
  if (!process.env.HCAPTCHA_SECRET_KEY) {
    if (process.env.NODE_ENV === 'development') {
      return { success: true };
    }
    return { success: false, error: 'hCaptcha not configured' };
  }

  if (!token || typeof token !== 'string') {
    return { success: false, error: 'Invalid captcha token' };
  }

  try {
    const response = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: process.env.HCAPTCHA_SECRET_KEY,
        response: token,
      }),
    });

    if (!response.ok) {
      return { success: false, error: 'hCaptcha verification failed' };
    }

    const data = (await response.json()) as { success: boolean };
    return { success: data.success };
  } catch (error) {
    console.error('[hCaptcha] Verification error:', error);
    return { success: false, error: 'hCaptcha verification error' };
  }
}
