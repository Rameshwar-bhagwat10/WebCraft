/**
 * Root Layout
 * Server Component - wraps entire application
 *
 * Performance:
 * - Fonts loaded via next/font (self-hosted, no CLS)
 * - Server Component by default (minimal JS)
 * - Optimized for Core Web Vitals (LCP < 2.5s, CLS < 0.1, INP < 200ms)
 *
 * Accessibility:
 * - Skip link for keyboard navigation
 * - Semantic HTML structure
 *
 * SEO:
 * - Proper document structure
 * - JSON-LD structured data (sanitized for XSS prevention)
 */

import type { Viewport } from 'next';
import { DM_Sans, Geist_Mono, Great_Vibes, Ubuntu } from 'next/font/google';
import { headers } from 'next/headers';

import { ChatTrigger } from '@/components/chat';
import { Footer, Header } from '@/components/layout';
import { JsonLd } from '@/components/shared';
import { defaultMetadata, viewportConfig } from '@/config/site';
import { generateOrganizationSchema, generateWebSiteSchema } from '@/lib/seo';

import './globals.css';

/**
 * Font optimization via next/font
 * - Self-hosted (no external requests, better privacy)
 * - Subset to reduce file size
 * - display: swap prevents FOIT (Flash of Invisible Text)
 * - preload for critical fonts
 */

// Ubuntu Bold - for logotype/brand (distinctive, friendly, modern)
const ubuntu = Ubuntu({
  variable: '--font-ubuntu',
  subsets: ['latin'],
  weight: ['700'],
  display: 'swap',
  preload: true,
});

// DM Sans - for body text and navigation (clean, readable, modern)
const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

// Geist Mono - for code blocks
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

// Great Vibes - elegant calligraphic script for logo icon
const greatVibes = Great_Vibes({
  variable: '--font-script',
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  preload: true,
});

// Export metadata and viewport
export const metadata = defaultMetadata;
export const viewport: Viewport = viewportConfig;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): Promise<React.ReactElement> {
  // Generate structured data schemas
  const organizationSchema = generateOrganizationSchema();
  const webSiteSchema = generateWebSiteSchema();

  // Check if current route is admin
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') ?? '';
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <html
      lang="en"
      className={`${ubuntu.variable} ${dmSans.variable} ${geistMono.variable} ${greatVibes.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* JSON-LD Structured Data - sanitized for XSS prevention */}
        {!isAdminRoute && <JsonLd data={organizationSchema} />}
        {!isAdminRoute && <JsonLd data={webSiteSchema} />}
      </head>
      <body className="bg-background text-foreground flex min-h-screen flex-col overflow-x-hidden antialiased">
        {/* Skip link for keyboard accessibility */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        {/* Header - hidden on admin routes */}
        {!isAdminRoute && <Header />}

        {/* Main content area */}
        <main id="main-content" className="flex-1">
          {children}
        </main>

        {/* Footer - hidden on admin routes */}
        {!isAdminRoute && <Footer />}

        {/* Chat Widget - hidden on admin routes */}
        {!isAdminRoute && <ChatTrigger />}
      </body>
    </html>
  );
}
