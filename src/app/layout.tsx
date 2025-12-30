/**
 * Root Layout
 * Server Component - wraps entire application
 *
 * Performance: Fonts loaded via next/font for optimal loading
 * Accessibility: Skip link for keyboard navigation
 * SEO: Semantic HTML structure with header, main, footer
 */

import type { Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { Footer, Header } from '@/components/layout';
import { defaultMetadata } from '@/config/site';

import './globals.css';

// Font optimization via next/font
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = defaultMetadata;

/**
 * Viewport configuration (Next.js 14+ requirement)
 * Separate from metadata for proper mobile rendering
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="flex min-h-screen flex-col bg-background text-foreground antialiased">
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
      </body>
    </html>
  );
}
