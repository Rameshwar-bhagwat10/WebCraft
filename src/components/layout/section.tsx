/**
 * Section Component
 * Layout wrapper for page sections with consistent spacing
 *
 * @example
 * <Section>Content with default spacing</Section>
 * <Section size="lg" background="secondary">Large section with gray bg</Section>
 */

import { cn } from '@/lib/utils';

export type SectionSize = 'sm' | 'md' | 'lg';
export type SectionBackground = 'primary' | 'secondary' | 'tertiary';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Vertical padding size */
  size?: SectionSize;
  /** Background color */
  background?: SectionBackground;
}

const sizeStyles: Record<SectionSize, string> = {
  sm: 'py-12 sm:py-16',
  md: 'py-16 sm:py-20',
  lg: 'py-20 sm:py-28',
};

const backgroundStyles: Record<SectionBackground, string> = {
  primary: 'bg-background',
  secondary: 'bg-background-secondary',
  tertiary: 'bg-background-tertiary',
};

export function Section({
  className,
  size = 'md',
  background = 'primary',
  ...props
}: SectionProps): React.ReactElement {
  return (
    <section
      className={cn(sizeStyles[size], backgroundStyles[background], className)}
      {...props}
    />
  );
}
