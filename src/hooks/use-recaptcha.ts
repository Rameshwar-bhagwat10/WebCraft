'use client';

/**
 * reCAPTCHA v3 Hook
 * Provides invisible CAPTCHA protection for forms
 *
 * Usage:
 * const { executeRecaptcha, isReady } = useRecaptcha();
 * const token = await executeRecaptcha('contact_form');
 */

import { useCallback, useEffect, useState } from 'react';

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

export function useRecaptcha() {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Debug log
    console.warn('[reCAPTCHA] Site key configured:', Boolean(RECAPTCHA_SITE_KEY));
    
    // Skip if no site key configured
    if (!RECAPTCHA_SITE_KEY) {
      console.warn('[reCAPTCHA] No site key found, skipping CAPTCHA');
      setIsReady(true); // Allow forms to work without CAPTCHA in dev
      return;
    }

    // Check if already loaded
    if (window.grecaptcha) {
      window.grecaptcha.ready(() => setIsReady(true));
      return;
    }

    // Load reCAPTCHA script
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      window.grecaptcha.ready(() => setIsReady(true));
    };

    script.onerror = () => {
      console.error('[reCAPTCHA] Failed to load script');
      setIsReady(true); // Allow forms to work even if CAPTCHA fails
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup not needed - script stays loaded
    };
  }, []);

  const executeRecaptcha = useCallback(
    async (action: string): Promise<string | null> => {
      // Return null if not configured (dev mode)
      if (!RECAPTCHA_SITE_KEY) {
        return null;
      }

      if (!isReady || !window.grecaptcha) {
        console.warn('[reCAPTCHA] Not ready yet');
        return null;
      }

      setIsLoading(true);

      try {
        const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, {
          action,
        });
        return token;
      } catch (error) {
        console.error('[reCAPTCHA] Execute error:', error);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [isReady]
  );

  return {
    executeRecaptcha,
    isReady,
    isLoading,
    isEnabled: Boolean(RECAPTCHA_SITE_KEY),
  };
}
