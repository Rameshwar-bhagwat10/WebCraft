/**
 * Public Routes Layout
 * Wraps all public-facing pages
 *
 * This layout will contain shared elements like Header/Footer
 * once they are built in Phase 2+
 */

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return (
    <>
      {/* Header will go here in Phase 2 */}
      {children}
      {/* Footer will go here in Phase 2 */}
    </>
  );
}
