'use client';

/**
 * reCAPTCHA v3 Hook
 * Provides invisible CAPTCHA protection for forms
 *
 * PERFORMANCE OPTIMIZED:
 * - Lazy loads script only when executeRecaptcha is called
 * - Does not load on component mount
 *
 * Usage:
 * const { executeRecaptcha, isReady } = useRecaptcha();
 * const token = await executeRecaptcha('contact_form');
 */

import { useCallback, useRef, useState } from 'react';

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
  const loadPromiseRef = useRef<Promise<void> | null>(null);

  /**
   * Lazy load reCAPTCHA script
   * Only called when executeRecaptcha is invoked
   */
  const loadScript = useCallback((): Promise<void> => {
    // Return existing promise if already loading
    if (loadPromiseRef.current) {
      return loadPromiseRef.current;
    }

    // Skip if no site key
    if (!RECAPTCHA_SITE_KEY) {
      setIsReady(true);
      return Promise.resolve();
    }

    // Check if already loaded
    if (window.grecaptcha) {
      return new Promise((resolve) => {
        window.grecaptcha.ready(() => {
          setIsReady(true);
          resolve();
        });
      });
    }

    // Load script lazily
    loadPromiseRef.current = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        window.grecaptcha.ready(() => {
          setIsReady(true);
          resolve();
        });
      };

      script.onerror = () => {
        console.error('[reCAPTCHA] Failed to load script');
        setIsReady(true); // Allow forms to work
        reject(new Error('Failed to load reCAPTCHA'));
      };

      document.head.appendChild(script);
    });

    return loadPromiseRef.current;
  }, []);

  const executeRecaptcha = useCallback(
    async (action: string): Promise<string | null> => {
      // Return null if not configured (dev mode)
      if (!RECAPTCHA_SITE_KEY) {
        return null;
      }

      setIsLoading(true);

      try {
        // Lazy load script if not ready
        if (!isReady) {
          await loadScript();
        }

        if (!window.grecaptcha) {
          console.warn('[reCAPTCHA] Not available');
          return null;
        }

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
    [isReady, loadScript]
  );

  return {
    executeRecaptcha,
    isReady,
    isLoading,
    isEnabled: Boolean(RECAPTCHA_SITE_KEY),
  };
}
