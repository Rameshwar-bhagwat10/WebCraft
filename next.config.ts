/**
 * Next.js Configuration
 * Performance-optimized settings for production
 */

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable React Compiler (React 19)
  reactCompiler: true,

  // Strict mode for better development experience
  reactStrictMode: true,

  // Optimize images
  images: {
    // Modern formats for better compression
    formats: ['image/avif', 'image/webp'],

    // Remote image domains (add as needed)
    remotePatterns: [
      // Example: Allow images from your CDN
      // {
      //   protocol: 'https',
      //   hostname: 'cdn.webcraft.com',
      //   pathname: '/images/**',
      // },
    ],

    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],

    // Image sizes for the sizes attribute
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Minimize image size
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },

  // Experimental features
  experimental: {
    // Optimize package imports
    optimizePackageImports: [
      '@radix-ui/react-slot',
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
    ],
  },

  // Headers for security and caching
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
        ],
      },
      {
        // Cache static assets
        source: '/(.*)\\.(ico|png|jpg|jpeg|gif|webp|avif|svg|woff|woff2)',
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

  // Powered by header (disable for security)
  poweredByHeader: false,

  // Compress responses
  compress: true,

  // Generate ETags for caching
  generateEtags: true,
};

export default nextConfig;
