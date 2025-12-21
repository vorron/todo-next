'use client';

import React from 'react';
import { cn } from '@/shared/lib/utils';
import { getIconByName, type IconName } from './icon-registry';

type ActionVariant = 'default' | 'muted' | 'danger';
type ActionSize = 'sm' | 'md';

export interface ActionBarItem {
  key: string;
  icon: React.ReactNode | IconName;
  title?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  hidden?: boolean;
  /**
   * Stops propagation by default to avoid parent click handlers.
   */
  stopPropagation?: boolean;
  variant?: ActionVariant;
  className?: string;
}

export interface ActionBarProps {
  actions: ActionBarItem[];
  className?: string;
  /**
   * Overall size of action buttons.
   */
  size?: ActionSize;
  /**
   * Horizontal alignment when the bar is used in flexible layouts.
   */
  align?: 'start' | 'center' | 'end';
  /**
   * Optional ARIA label for accessibility.
   */
  ariaLabel?: string;
}

const sizeClasses: Record<ActionSize, string> = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
};

const iconSizeClasses: Record<ActionSize, string> = {
  sm: 'h-5 w-5',
  md: 'h-5 w-5',
};

const variantClasses: Record<ActionVariant, string> = {
  default: 'text-gray-500 hover:text-blue-500',
  muted: 'text-gray-400 hover:text-blue-500',
  danger: 'text-gray-400 hover:text-red-500',
};

export function ActionBar({
  actions,
  className,
  size = 'sm',
  align = 'start',
  ariaLabel,
}: ActionBarProps) {
  const visibleActions = actions.filter((action) => !action.hidden);

  if (visibleActions.length === 0) return null;

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn(
        'flex items-center gap-2',
        align === 'center' && 'justify-center',
        align === 'end' && 'justify-end',
        className,
      )}
    >
      {visibleActions.map((action) => {
        const {
          key,
          icon,
          title,
          onClick,
          disabled,
          stopPropagation = true,
          variant = 'default',
          className: itemClassName,
        } = action;

        const iconNode = (() => {
          if (typeof icon !== 'string') return icon;
          const IconComponent = getIconByName(icon as IconName);
          if (!IconComponent) {
            if (process.env.NODE_ENV !== 'production') {
              console.warn(`ActionBar: icon "${icon}" is not registered`);
            }
            return null;
          }
          return <IconComponent className={iconSizeClasses[size]} aria-hidden />;
        })();

        return (
          <button
            key={key}
            type="button"
            title={title}
            aria-label={title}
            disabled={disabled}
            onClick={(event) => {
              if (stopPropagation) event.stopPropagation();
              onClick?.(event);
            }}
            className={cn(
              'flex items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 focus-visible:ring-offset-white disabled:opacity-40 disabled:cursor-not-allowed',
              sizeClasses[size],
              variantClasses[variant],
              itemClassName,
            )}
          >
            {iconNode}
          </button>
        );
      })}
    </div>
  );
}
