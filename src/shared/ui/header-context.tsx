'use client';

import { usePathname } from 'next/navigation';
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export type HeaderBreadcrumb = {
  href: string;
  label: string;
};

type HeaderState = {
  forPath?: string;
  title?: string;
  breadcrumbs?: HeaderBreadcrumb[];
};

type HeaderContextValue = {
  state: HeaderState;
  setHeader: (next: HeaderState) => void;
  resetHeader: () => void;
};

const HeaderContext = createContext<HeaderContextValue | null>(null);

export function HeaderProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [state, setState] = useState<HeaderState>({});

  const setHeader = useCallback(
    (next: HeaderState) => {
      setState({
        ...next,
        forPath: next.forPath ?? pathname,
      });
    },
    [pathname],
  );

  const resetHeader = useCallback(() => {
    setState({});
  }, []);

  const value = useMemo<HeaderContextValue>(
    () => ({ state, setHeader, resetHeader }),
    [state, setHeader, resetHeader],
  );

  return <HeaderContext.Provider value={value}>{children}</HeaderContext.Provider>;
}

export function useHeader() {
  const ctx = useContext(HeaderContext);
  if (!ctx) {
    throw new Error('useHeader must be used within HeaderProvider');
  }

  return ctx;
}
