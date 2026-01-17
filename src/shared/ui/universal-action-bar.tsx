'use client';

import React from 'react';

import { ChevronDown, ArrowLeftRight } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';

import { ActionBar, type ActionBarItem } from './action-bar';
import { getIconByName, type IconName } from './icon-registry';

export const ACTION_DIVIDER = {
  key: '__divider__',
  divider: true,
  hidden: false,
  type: 'divider' as const,
} as const;

type ActionType = 'button' | 'dropdown' | 'switcher' | 'divider';

export interface UniversalActionItem extends ActionBarItem {
  type?: ActionType;
  items?: UniversalActionItem[];
  dropdownAlign?: 'start' | 'end';
  switcherConfig?: SwitcherConfig;
  divider?: boolean;
}

export type UniversalActionConfig = UniversalActionItem | typeof ACTION_DIVIDER;

export interface SwitcherConfig {
  items: Array<Record<string, unknown>>;
  idField: string;
  labelField: string;
  onSelect: (item: { id: string; label: string }) => void;
  actions: Array<{
    key: string;
    label: string;
    icon?: string | React.ReactNode;
    onClick: () => void;
    divider?: boolean;
  }>;
}

type SwitcherAction = SwitcherConfig['actions'][0];

export interface UniversalActionBarProps {
  actions: UniversalActionConfig[];
  size?: 'sm' | 'md';
  align?: 'start' | 'center' | 'end';
  wrap?: boolean;
  onItemClick?: (item: UniversalActionItem) => Promise<void> | void;
  ariaLabel?: string;
  className?: string;
}

const iconSizeClasses: Record<'sm' | 'md', string> = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
};

export function UniversalActionBar({
  actions,
  size = 'sm',
  align = 'start',
  wrap = false,
  onItemClick,
  ariaLabel,
  className,
}: UniversalActionBarProps) {
  // Filter and normalize actions
  const visibleActions = actions
    .filter((action) => {
      if (action === ACTION_DIVIDER) return true; // divider всегда видимый
      return !action.hidden;
    })
    .map((action) => {
      if (action === ACTION_DIVIDER) return action; // divider не меняем
      return action; // обычные действия
    });

  if (visibleActions.length === 0) return null;

  const renderIcon = (icon: React.ReactNode | IconName | undefined) => {
    if (!icon) return null;
    if (typeof icon !== 'string') return icon;

    const IconComponent = getIconByName(icon as IconName);
    if (!IconComponent) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`UniversalActionBar: icon "${icon}" is not registered`);
      }
      return null;
    }
    return <IconComponent className={iconSizeClasses[size]} aria-hidden />;
  };

  const handleItemClick = async (item: UniversalActionItem) => {
    await item.onClick?.(undefined as unknown as React.MouseEvent<HTMLButtonElement>);
    await onItemClick?.(item);
  };

  const renderDropdownItem = (item: UniversalActionItem) => {
    const { key, icon, label, disabled, variant = 'default', className: itemClassName } = item;

    return (
      <DropdownMenuItem
        key={key}
        disabled={disabled}
        onClick={() => handleItemClick(item)}
        className={cn(
          'flex items-center gap-2 py-2',
          variant === 'danger' && 'text-destructive focus:text-destructive',
          itemClassName,
        )}
      >
        {renderIcon(icon)}
        <span className="truncate">{label}</span>
      </DropdownMenuItem>
    );
  };

  const renderDropdown = (item: UniversalActionItem) => {
    const {
      key,
      icon,
      label,
      disabled,
      variant = 'default',
      items = [],
      dropdownAlign = 'end',
    } = item;

    if (items.length === 0) return null;

    const isIconOnly = !!icon && !label;

    return (
      <DropdownMenu key={key}>
        <DropdownMenuTrigger asChild disabled={disabled}>
          <Button
            variant="ghost"
            size={size === 'sm' ? 'icon-sm' : 'icon-lg'}
            disabled={disabled}
            className={cn(
              'hover:bg-accent hover:text-accent-foreground',
              variant === 'danger' && 'hover:bg-destructive/10 hover:text-destructive',
            )}
          >
            {renderIcon(icon)}
            {label && <span className="text-sm">{label}</span>}
            {!isIconOnly && <ChevronDown className="h-4 w-4" />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={dropdownAlign} className="w-48">
          {items.map((subItem, index) => (
            <React.Fragment key={subItem.key}>
              {subItem.divider && index > 0 && <DropdownMenuSeparator />}
              {renderDropdownItem(subItem)}
            </React.Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const renderSwitcher = (item: UniversalActionItem) => {
    const { switcherConfig } = item;

    if (!switcherConfig) return null;

    const { items, idField, labelField, onSelect, actions } = switcherConfig;

    const mappedItems = items.map((item) => {
      const id = item[idField];
      const label = item[labelField];

      return {
        id: typeof id === 'string' || typeof id === 'number' ? String(id) : '',
        label: typeof label === 'string' || typeof label === 'number' ? String(label) : '',
      };
    });

    return (
      <DropdownMenu key={item.key}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="w-40 justify-between">
            <span className="truncate">Switch Workspace</span>
            <ArrowLeftRight className="h-4 w-4 ml-2 shrink-0" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-56">
          {mappedItems.map((switcherItem) => (
            <DropdownMenuItem
              key={switcherItem.id}
              onClick={() => onSelect(switcherItem)}
              className="cursor-pointer"
            >
              <span className="truncate">{switcherItem.label}</span>
            </DropdownMenuItem>
          ))}

          {actions.length > 0 && mappedItems.length > 0 && <DropdownMenuSeparator />}

          {actions.map((action: SwitcherAction, index: number) => (
            <React.Fragment key={action.key}>
              {action.divider && index > 0 && <DropdownMenuSeparator />}
              <DropdownMenuItem onClick={action.onClick} className="cursor-pointer">
                {renderIcon(action.icon)}
                {action.label}
              </DropdownMenuItem>
            </React.Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn(
        'flex items-center gap-2',
        wrap && 'flex-wrap',
        align === 'center' && 'justify-center',
        align === 'end' && 'justify-end',
        className,
      )}
    >
      {visibleActions.map((item, index) => (
        <React.Fragment key={item.key}>
          {item === ACTION_DIVIDER ? (
            <div className="h-6 w-px bg-border" />
          ) : item.divider && index > 0 ? (
            <div className="h-6 w-px bg-border" />
          ) : null}

          {item === ACTION_DIVIDER ? null : item.type === 'dropdown' ? (
            renderDropdown(item as UniversalActionItem)
          ) : item.type === 'switcher' ? (
            renderSwitcher(item as UniversalActionItem)
          ) : (
            <ActionBar
              key={item.key}
              actions={[item as UniversalActionItem]}
              size={size}
              surface="none"
              padding="none"
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export type { ActionType };
export { type ActionBarItem } from './action-bar';
