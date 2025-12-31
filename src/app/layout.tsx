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
import { DM_Sans, Geist_Mono, Ubuntu } from 'next/font/google';

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

// Export metadata and viewport
export const metadata = defaultMetadata;
export const viewport: Viewport = viewportConfig;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  // Generate structured data schemas
  const organizationSchema = generateOrganizationSchema();
  const webSiteSchema = generateWebSiteSchema();

  return (
    <html
      lang="en"
      className={`${ubuntu.variable} ${dmSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* JSON-LD Structured Data - sanitized for XSS prevention */}
        <JsonLd data={organizationSchema} />
        <JsonLd data={webSiteSchema} />
      </head>
      <body className="bg-background text-foreground flex min-h-screen flex-col overflow-x-hidden antialiased">
        {/* Skip link for keyboard accessibility */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        {/* Header */}
        <Header />

        {/* Main content area */}
        <main id="main-content" className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <Footer />

        {/* Chat Widget - lazy loaded */}
        <ChatTrigger />
      </body>
    </html>
  );
}
