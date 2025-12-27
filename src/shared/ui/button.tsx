'use client';

import * as React from 'react';

import { cn } from '@/shared/lib/utils';

import { Button as ButtonPrimitive, buttonVariants } from './button-primitive';
import { Spinner } from './spinner';

import type { VariantProps } from 'class-variance-authority';

/**
 * Маппинг legacy вариантов на shadcn варианты
 */
const variantMap = {
  primary: 'default',
  danger: 'destructive',
  default: 'default',
  destructive: 'destructive',
  outline: 'outline',
  secondary: 'secondary',
  ghost: 'ghost',
  link: 'link',
} as const;

const sizeMap = {
  sm: 'sm',
  md: 'default',
  lg: 'lg',
  default: 'default',
  icon: 'icon',
  'icon-sm': 'icon-sm',
  'icon-lg': 'icon-lg',
} as const;

type LegacyVariant = keyof typeof variantMap;
type LegacySize = keyof typeof sizeMap;

export interface ButtonProps
  extends
    Omit<React.ComponentProps<'button'>, 'size'>,
    Omit<VariantProps<typeof buttonVariants>, 'variant' | 'size'> {
  variant?: LegacyVariant;
  size?: LegacySize;
  isLoading?: boolean;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'default', size = 'default', isLoading, children, disabled, ...props },
    ref,
  ) => {
    const mappedVariant = variantMap[variant] || 'default';
    const mappedSize = sizeMap[size] || 'default';

    return (
      <ButtonPrimitive
        ref={ref}
        variant={mappedVariant}
        size={mappedSize}
        className={cn(className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Spinner className="size-4" />}
        {children}
      </ButtonPrimitive>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
