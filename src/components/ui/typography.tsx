/**
 * Typography Components
 * Semantic text elements with consistent styling
 *
 * @example
 * <Heading level={1}>Page Title</Heading>
 * <Text variant="body">Body text content</Text>
 * <Text variant="muted" size="sm">Small muted text</Text>
 */

import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

/* =========================================
 * TEXT COMPONENT
 * ========================================= */

export type TextVariant = 'body' | 'secondary' | 'muted';
export type TextSize = 'xs' | 'sm' | 'base' | 'lg';

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: TextVariant;
  size?: TextSize;
  as?: 'p' | 'span' | 'div';
}

const textVariantStyles: Record<TextVariant, string> = {
  body: 'text-foreground',
  secondary: 'text-foreground-secondary',
  muted: 'text-foreground-muted',
};

const textSizeStyles: Record<TextSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
};

export const Text = forwardRef<HTMLParagraphElement, TextProps>(
  (
    {
      className,
      variant = 'body',
      size = 'base',
      as: Component = 'p',
      ...props
    },
    ref
  ) => (
    <Component
      ref={ref}
      className={cn(
        'leading-relaxed',
        textVariantStyles[variant],
        textSizeStyles[size],
        className
      )}
      {...props}
    />
  )
);
Text.displayName = 'Text';

/* =========================================
 * HEADING COMPONENT
 * ========================================= */

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level: HeadingLevel;
  /** Override visual size (for SEO flexibility) */
  visualLevel?: HeadingLevel;
}

const headingStyles: Record<HeadingLevel, string> = {
  1: 'text-4xl sm:text-5xl font-bold tracking-tight',
  2: 'text-3xl sm:text-4xl font-bold tracking-tight',
  3: 'text-2xl sm:text-3xl font-semibold',
  4: 'text-xl sm:text-2xl font-semibold',
  5: 'text-lg sm:text-xl font-medium',
  6: 'text-base sm:text-lg font-medium',
};

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level, visualLevel, ...props }, ref) => {
    const Tag = `h${level}` as const;
    const visualStyles = headingStyles[visualLevel ?? level];

    return (
      <Tag
        ref={ref}
        className={cn('text-foreground', visualStyles, className)}
        {...props}
      />
    );
  }
);
Heading.displayName = 'Heading';
