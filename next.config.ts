/**
 * Next.js Configuration
 * Performance-optimized settings for production
 *
 * Core Web Vitals targets:
 * - LCP (Largest Contentful Paint): < 2.5s
 * - CLS (Cumulative Layout Shift): < 0.1
 * - INP (Interaction to Next Paint): < 200ms
 */

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable React Compiler (React 19)
  reactCompiler: true,

  // Strict mode for better development experience
  reactStrictMode: true,

  // Optimize images for Core Web Vitals (LCP, CLS)
  images: {
    // Modern formats for better compression (25-35% smaller)
    formats: ['image/avif', 'image/webp'],

    // Remote image patterns (use instead of deprecated 'domains')
    remotePatterns: [
      // Example: Allow images from your CDN
      // {
      //   protocol: 'https',
      //   hostname: 'cdn.webcraft.com',
      //   pathname: '/images/**',
      // },
    ],

    // Device sizes for responsive images (srcset)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],

    // Image sizes for the sizes attribute
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Cache optimized images for 30 days
    minimumCacheTTL: 60 * 60 * 24 * 30,

    // Disable blur placeholder generation for faster builds
    // (use custom blur data URLs instead)
    dangerouslyAllowSVG: false,
    contentDispositionType: 'inline',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Experimental features for performance
  experimental: {
    // Optimize package imports (reduces bundle size)
    optimizePackageImports: [
      '@radix-ui/react-slot',
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
      'schema-dts',
    ],
  },

  // Security and caching headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Security headers
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data:",
              "connect-src 'self' https:",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
          // Prevent clickjacking
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
      {
        // Cache static assets aggressively (1 year)
        source: '/(.*)\\.(ico|png|jpg|jpeg|gif|webp|avif|svg|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache JS/CSS with revalidation
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Redirects (add as needed)
  async redirects() {
    return [
      // Example: Redirect old URLs
      // {
      //   source: '/old-page',
      //   destination: '/new-page',
      //   permanent: true,
      // },
    ];
  },

  // Disable powered-by header (security)
  poweredByHeader: false,

  // Enable compression
  compress: true,

  // Generate ETags for caching
  generateEtags: true,

  // Trailing slash configuration (SEO consistency)
  trailingSlash: false,

  // Skip type checking during build (handled by CI)
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
};

export default nextConfig;
