import { type ReactNode, type ComponentType, createElement } from 'react';

/**
 * Utility to combine multiple React providers into a single component
 * Follows 2024-2025 best practices for provider composition
 */
export const combineProviders = (...providers: ComponentType<{ children: ReactNode }>[]) => {
  return ({ children }: { children: ReactNode }) => {
    return providers.reduceRight((acc, Provider) => createElement(Provider, null, acc), children);
  };
};
