'use client';

import { useRouter } from 'next/navigation';

import { ArrowLeft, type LucideIcon } from 'lucide-react';

import { Button } from '@/shared/ui';

interface NavigationButtonProps {
  href: string;
  children?: React.ReactNode;
  variant?: 'default' | 'secondary' | 'ghost' | 'outline' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg';
  className?: string;
  disabled?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  showIconOnly?: boolean;
}

export function NavigationButton({
  href,
  children,
  variant = 'default',
  size = 'default',
  className,
  disabled,
  icon,
  iconPosition = 'left',
  showIconOnly = false,
}: NavigationButtonProps) {
  const router = useRouter();

  const Icon = icon;
  const iconElement = Icon ? <Icon className="w-4 h-4" aria-hidden="true" /> : null;
  const content = showIconOnly ? (
    iconElement
  ) : (
    <>
      {iconPosition === 'left' && iconElement && <span className="mr-2">{iconElement}</span>}
      {children}
      {iconPosition === 'right' && iconElement && <span className="ml-2">{iconElement}</span>}
    </>
  );

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      disabled={disabled}
      onClick={() => router.push(href)}
      aria-label={typeof children === 'string' ? `Navigate to ${children}` : undefined}
    >
      {content}
    </Button>
  );
}

// Back button as a specialized variant
export function BackButton({
  href,
  label = 'Back',
  className,
}: {
  href: string;
  label?: string;
  className?: string;
}) {
  return (
    <NavigationButton
      href={href}
      variant="ghost"
      icon={ArrowLeft}
      iconPosition="left"
      className={className}
    >
      {label}
    </NavigationButton>
  );
}
