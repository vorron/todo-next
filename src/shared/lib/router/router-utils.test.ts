import { describe, expect, it } from 'vitest';

import { metadataConfig, paths } from './index';

describe('router metadata access', () => {
  it('metadataConfig provides metadata for known route', () => {
    const metadata = metadataConfig[paths.about];
    expect(metadata).toBeDefined();
  });

  it('metadataConfig provides metadata for todos route', () => {
    const metadata = metadataConfig[paths.todos];
    expect(metadata).toBeDefined();
  });

  it('metadataConfig returns undefined for unknown route', () => {
    expect(metadataConfig['/__unknown__' as keyof typeof metadataConfig]).toBeUndefined();
  });
});
