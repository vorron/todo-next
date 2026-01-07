'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { getBreadcrumbs } from '@/shared/lib/router';
import { cn } from '@/shared/lib/utils';
import { useHeader } from '@/shared/ui';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

const SEGMENT_LABELS: Record<string, string> = {
  todos: 'Todos',
  profile: 'Profile',
  settings: 'Settings',
  about: 'About',
  edit: 'Edit',
  workspace: 'Tracker',
  manage: 'Manage',
  select: 'Select',
  create: 'Create',
  reports: 'Reports',
  projects: 'Projects',
  'time-entry': 'Time Entry',
};

function formatCrumbLabel(label: string): string {
  if (/^\d+$/.test(label)) return label; // Keep workspace ID as is for now
  return SEGMENT_LABELS[label] ?? label;
}

export function HeaderBreadcrumbs({ className }: { className?: string }) {
  const pathname = usePathname();
  const { state } = useHeader();

  const isOverrideForCurrentPath = state.forPath === pathname;

  const overrideTitle = isOverrideForCurrentPath ? state.title : undefined;
  const overrideCrumbs = isOverrideForCurrentPath ? state.breadcrumbs : undefined;

  const title =
    overrideTitle ??
    (pathname === '/'
      ? 'Home'
      : pathname
          .split('/')
          .filter(Boolean)
          .pop()
          ?.split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '));

  const allCrumbs = (overrideCrumbs ?? getBreadcrumbs(pathname)).map((crumb) => ({
    ...crumb,
    label: formatCrumbLabel(crumb.label),
  }));

  const crumbs = allCrumbs.at(-1)?.href === pathname ? allCrumbs.slice(0, -1) : allCrumbs;

  if (!title) return null;

  return (
    <div className={cn('hidden md:flex flex-col items-end justify-center', className)}>
      {crumbs.length > 0 && (
        <nav aria-label="Breadcrumbs" className="text-xs text-gray-500">
          <ol className="flex items-center space-x-1">
            {crumbs.map((crumb: BreadcrumbItem, index: number) => (
              <li key={index} className="flex items-center">
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className={cn(
                      'hover:text-gray-700 transition-colors',
                      crumb.current && 'text-gray-900 font-medium',
                    )}
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className={cn(crumb.current && 'text-gray-900 font-medium')}>
                    {crumb.label}
                  </span>
                )}
                {index !== crumbs.length - 1 && <span className="text-gray-400">/</span>}
              </li>
            ))}
          </ol>
        </nav>
      )}
      <div
        className="max-w-64 truncate text-sm font-semibold text-gray-900 leading-tight"
        title={title}
      >
        {title}
      </div>
    </div>
  );
}
