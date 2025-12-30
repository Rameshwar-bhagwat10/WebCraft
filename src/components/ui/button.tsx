/**
 * Button Component
 * Accessible, keyboard-navigable button with variants
 *
 * @example
 * <Button variant="primary" size="md">Click me</Button>
 * <Button variant="outline" size="sm" asChild><Link href="/">Home</Link></Button>
 */

import { Slot } from '@radix-ui/react-slot';
import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Render as child element (useful for Link components) */
  asChild?: boolean;
  /** Full width button */
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
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
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      asChild = false,
      fullWidth = false,
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
        className={cn(
          // Base styles
          'inline-flex items-center justify-center font-medium',
          'rounded-lg transition-colors duration-200',
          // Focus ring for accessibility
          'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
          // Disabled state
          'disabled:pointer-events-none disabled:opacity-50',
          // Variant & size
          variantStyles[variant],
          sizeStyles[size],
          // Full width
          fullWidth && 'w-full',
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
