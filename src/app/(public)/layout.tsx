/**
 * Public Routes Layout
 * Wraps all public-facing pages
 *
 * Header and Footer are now in root layout.
 * This layout can be used for public-route-specific wrappers if needed.
 */

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return <>{children}</>;
}
