'use client';

import { type ReactNode } from 'react';

interface TrackerShellProps {
  children: ReactNode;
}

/**
 * Shell для tracker секции
 * Общая разметка для всех страниц tracker
 */
export function TrackerShell({ children }: TrackerShellProps) {
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="space-y-6">{children}</div>
    </div>
  );
}
