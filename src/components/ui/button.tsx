/**
 * Button Component
 * Accessible, keyboard-navigable button with variants
 * Uses CVA (Class Variance Authority) for type-safe variants
 *
 * @example
 * <Button variant="primary" size="md">Click me</Button>
 * <Button variant="outline" size="sm" asChild><Link href="/">Home</Link></Button>
 */

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

/**
 * Button variants using CVA
 * Industry-standard approach for managing Tailwind variants
 */
const buttonVariants = cva(
  // Base styles
  [
    'inline-flex items-center justify-center font-medium',
    'rounded-lg transition-colors duration-200',
    // WCAG 2.2 compliant focus ring (2px, 3:1 contrast)
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        primary:
          'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500',
        secondary:
          'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 focus-visible:ring-neutral-500',
        outline:
          'border border-border bg-transparent text-foreground hover:bg-neutral-50 focus-visible:ring-primary-500',
        ghost:
          'bg-transparent text-foreground hover:bg-neutral-100 focus-visible:ring-neutral-500',
        destructive:
          'bg-error-600 text-white hover:bg-error-700 focus-visible:ring-error-500',
      },
      size: {
        sm: 'h-8 px-3 text-sm gap-1.5',
        md: 'h-10 px-4 text-sm gap-2',
        lg: 'h-12 px-6 text-base gap-2',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render as child element (useful for Link components) */
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      asChild = false,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : type}
        disabled={disabled}
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

// Export variants for external use
export { buttonVariants };
