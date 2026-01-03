'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { getBreadcrumbs, mainNavigation, ROUTES } from '@/shared/lib/router';
import { cn } from '@/shared/lib/utils';
import { useHeader } from '@/shared/ui';

const SEGMENT_LABELS: Record<string, string> = {
  todos: 'Todos',
  profile: 'Profile',
  settings: 'Settings',
  about: 'About',
  edit: 'Edit',
};

function formatCrumbLabel(label: string) {
  if (/^\d+$/.test(label)) return 'Todo';
  return SEGMENT_LABELS[label] ?? label;
}

function getPageTitle(pathname: string) {
  if (pathname.endsWith('/edit')) return 'Edit';
  if (pathname.startsWith(ROUTES.TODOS + '/')) return 'Todo';

  const match = mainNavigation.find((item) => item.href === pathname);
  if (match) return match.label;

  const last = pathname.split('/').filter(Boolean).at(-1);
  if (!last) return '';

  return formatCrumbLabel(last);
}

export function HeaderBreadcrumbs({ className }: { className?: string }) {
  const pathname = usePathname();
  const { state } = useHeader();

  const isOverrideForCurrentPath = state.forPath === pathname;

  const overrideTitle = isOverrideForCurrentPath ? state.title : undefined;
  const overrideCrumbs = isOverrideForCurrentPath ? state.breadcrumbs : undefined;

  const title = overrideTitle ?? getPageTitle(pathname);

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
          <ol className="flex items-center gap-1">
            {crumbs.map((crumb, index) => (
              <li key={crumb.href} className="flex items-center gap-1">
                <Link
                  href={crumb.href}
                  title={crumb.label}
                  className="max-w-40 truncate hover:text-gray-700 transition-colors"
                >
                  {crumb.label}
                </Link>
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
