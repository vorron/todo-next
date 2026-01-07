import { ChevronRightIcon } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center space-x-2 text-sm text-muted-foreground', className)}
    >
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {item.href && !item.current ? (
            <a
              href={item.href}
              className={cn(
                'hover:text-foreground transition-colors',
                item.current && 'text-foreground',
              )}
            >
              {item.label}
            </a>
          ) : (
            <span className={cn(item.current && 'text-foreground')}>{item.label}</span>
          )}
          {index < items.length - 1 && <ChevronRightIcon className="h-4 w-4" />}
        </div>
      ))}
    </nav>
  );
}
