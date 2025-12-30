/**
 * Root Layout
 * Server Component - wraps entire application
 *
 * Performance: Fonts loaded via next/font for optimal loading
 */

import { Geist, Geist_Mono } from 'next/font/google';

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-background text-foreground min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
