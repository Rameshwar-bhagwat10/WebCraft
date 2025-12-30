/**
 * Runtime-safe environment configuration
 * Single source of truth for all environment variables
 * Validates required variables at runtime
 */

type EnvConfig = {
  // App
  appEnv: 'development' | 'staging' | 'production';
  appUrl: string;

  // Supabase (optional until Phase 2)
  supabaseUrl: string | undefined;
  supabaseAnonKey: string | undefined;
  supabaseServiceRoleKey: string | undefined;

  // Email (optional until future phase)
  emailServiceApiKey: string | undefined;
  emailFromAddress: string | undefined;

  // Analytics (optional)
  analyticsId: string | undefined;

  // Computed
  isDevelopment: boolean;
  isProduction: boolean;
};

function getEnvVar(key: string, required = false): string | undefined {
  const value = process.env[key];

  if (required && !value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

function createEnvConfig(): EnvConfig {
  const appEnv =
    (getEnvVar('NEXT_PUBLIC_APP_ENV') as EnvConfig['appEnv']) || 'development';

  return {
    // App
    appEnv,
    appUrl: getEnvVar('NEXT_PUBLIC_APP_URL') ?? 'http://localhost:3000',

    // Supabase
    supabaseUrl: getEnvVar('NEXT_PUBLIC_SUPABASE_URL'),
    supabaseAnonKey: getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    supabaseServiceRoleKey: getEnvVar('SUPABASE_SERVICE_ROLE_KEY'),

    // Email
    emailServiceApiKey: getEnvVar('EMAIL_SERVICE_API_KEY'),
    emailFromAddress: getEnvVar('EMAIL_FROM_ADDRESS'),

    // Analytics
    analyticsId: getEnvVar('NEXT_PUBLIC_ANALYTICS_ID'),

    // Computed
    isDevelopment: appEnv === 'development',
    isProduction: appEnv === 'production',
  };
}

// Singleton instance
export const env = createEnvConfig();
