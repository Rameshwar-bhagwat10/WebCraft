/**
 * Container Component
 * Constrains content width with responsive padding
 *
 * @example
 * <Container>Centered content</Container>
 * <Container size="sm">Narrow content</Container>
 */

import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Max width constraint */
  size?: ContainerSize;
  /** Center content horizontally */
  centered?: boolean;
}

const sizeStyles: Record<ContainerSize, string> = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-full',
};

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = 'xl', centered = true, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'w-full px-4 sm:px-6 lg:px-8',
        sizeStyles[size],
        centered && 'mx-auto',
        className
      )}
      {...props}
    />
  )
);
Container.displayName = 'Container';
