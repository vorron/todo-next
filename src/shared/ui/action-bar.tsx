'use client';

import React from 'react';

import { cn } from '@/shared/lib/utils';

import { getIconByName, type IconName } from './icon-registry';

type ActionVariant = 'default' | 'muted' | 'danger';
type ActionSize = 'sm' | 'md';
type ConfirmVariant = 'danger' | 'warning' | 'info';

export type ConfirmConfigObject = {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
};

export type ConfirmConfig =
  | ConfirmConfigObject
  | (() => ConfirmConfigObject | Promise<ConfirmConfigObject>);

export interface ActionBarItem {
  key: string;
  icon?: React.ReactNode | IconName;
  /**
   * Optional text label rendered next to the icon for richer bars.
   */
  label?: React.ReactNode;
  title?: string;
  /**
   * Accessible name. If omitted, aria-label won't be set.
   */
  ariaLabel?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  hidden?: boolean;
  /**
   * Stops propagation by default to avoid parent click handlers.
   */
  stopPropagation?: boolean;
  variant?: ActionVariant;
  className?: string;
  /**
   * Optional confirmation step before onClick.
   */
  confirm?: ConfirmConfig;
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
   * Allow items to wrap for responsive toolbars.
   */
  wrap?: boolean;
  /**
   * Optional container tone.
   */
  surface?: 'none' | 'muted';
  /**
   * Optional padding for the container.
   */
  padding?: 'none' | 'sm' | 'md';
  /**
   * Confirmation handler. If provided and an action has `confirm`,
   * ActionBar will call it before onClick.
   */
  confirmDialog?: (config: ConfirmConfigObject) => Promise<boolean> | boolean;
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

const labelSizeClasses: Record<ActionSize, string> = {
  sm: 'h-9 px-3',
  md: 'h-10 px-3',
};

const surfaceClasses = {
  none: '',
  muted: 'rounded-md border border-slate-200 bg-slate-50/70',
};

const paddingClasses = {
  none: '',
  sm: 'px-3 py-2',
  md: 'px-4 py-3',
};

const variantClasses: Record<ActionVariant, string> = {
  default: 'text-gray-600 hover:text-blue-600 hover:bg-blue-50/70',
  muted: 'text-gray-400 hover:text-blue-600 hover:bg-blue-50/60',
  danger: 'text-gray-400 hover:text-red-600 hover:bg-red-50/70',
};

export function ActionBar({
  actions,
  className,
  size = 'sm',
  align = 'start',
  wrap = false,
  surface = 'none',
  padding = 'none',
  confirmDialog,
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
        wrap && 'flex-wrap',
        align === 'center' && 'justify-center',
        align === 'end' && 'justify-end',
        surfaceClasses[surface],
        paddingClasses[padding],
        className,
      )}
    >
      {visibleActions.map((action) => {
        const {
          key,
          icon,
          label,
          title,
          ariaLabel,
          onClick,
          disabled,
          confirm,
          stopPropagation = true,
          variant = 'default',
          className: itemClassName,
        } = action;

        const isIconOnly = !!icon && !label;
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
            aria-label={ariaLabel}
            disabled={disabled}
            onClick={async (event) => {
              if (stopPropagation) event.stopPropagation();

              if (confirm && confirmDialog) {
                const cfg = typeof confirm === 'function' ? await confirm() : confirm;
                const ok = await confirmDialog(cfg);
                if (!ok) return;
              }

              onClick?.(event);
            }}
            className={cn(
              'flex items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 focus-visible:ring-offset-white disabled:opacity-40 disabled:cursor-not-allowed',
              isIconOnly ? sizeClasses[size] : labelSizeClasses[size],
              variantClasses[variant],
              itemClassName,
            )}
          >
            {iconNode}
            {label && (
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">{label}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
