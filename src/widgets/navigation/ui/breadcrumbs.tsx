'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navigation, ROUTES } from '@/shared/config/routes';
import { cn } from '@/shared/lib/utils';
import { useHeader } from '@/shared/ui';

const SEGMENT_LABELS: Record<string, string> = {
  todos: 'Todos',
  profile: 'Profile',
  settings: 'Settings',
  about: 'About',
};

function formatCrumbLabel(label: string) {
  if (/^\d+$/.test(label)) return 'Todo';
  return SEGMENT_LABELS[label] ?? label;
}

function getPageTitle(pathname: string) {
  if (pathname.startsWith(ROUTES.TODOS + '/')) return 'Todo';

  const match = navigation.main.find((item) => item.href === pathname);
  if (match) return match.name;

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

  const crumbs = (overrideCrumbs ?? navigation.getBreadcrumbs(pathname)).map(
    (crumb, index, arr) => {
      const isLast = index === arr.length - 1;

      return {
        ...crumb,
        label: formatCrumbLabel(crumb.label),
        isLast,
      };
    },
  );

  const title = overrideTitle ?? getPageTitle(pathname);

  if (!title) return null;

  return (
    <div className={cn('hidden md:flex flex-col items-end justify-center', className)}>
      {crumbs.length > 1 && (
        <nav aria-label="Breadcrumbs" className="text-xs text-gray-500">
          <ol className="flex items-center gap-1">
            {crumbs.map((crumb) => (
              <li key={crumb.href} className="flex items-center gap-1">
                {crumb.isLast ? (
                  <span className="max-w-48 truncate text-gray-500">{crumb.label}</span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="max-w-40 truncate hover:text-gray-700 transition-colors"
                  >
                    {crumb.label}
                  </Link>
                )}
                {!crumb.isLast && <span className="text-gray-400">/</span>}
              </li>
            ))}
          </ol>
        </nav>
      )}
      <div className="max-w-64 truncate text-sm font-semibold text-gray-900 leading-tight">
        {title}
      </div>
    </div>
  );
}
