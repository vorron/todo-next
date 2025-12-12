import type { ReactNode } from 'react';

interface AppShellProps {
  header?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

export function AppShell({ header, children, footer }: AppShellProps) {
  return (
    <div className="min-h-full flex flex-col">
      {header}
      <main className="flex-1">{children}</main>
      {footer ?? (
        <footer className="border-t border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-gray-500 sm:px-6 lg:px-8">
            TodoApp
          </div>
        </footer>
      )}
    </div>
  );
}
