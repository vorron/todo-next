import { describe, expect, it } from 'vitest';

import { metadataConfig, paths } from '@/shared/config/routes';

import { getRouteConfig, getRouteMetadata } from './router-utils';

describe('router-utils', () => {
  it('getRouteConfig returns config for known route', () => {
    const cfg = getRouteConfig(paths.about);
    expect(cfg).toEqual({ metadata: metadataConfig[paths.about] });
  });

  it('getRouteMetadata returns metadata for known route', () => {
    const md = getRouteMetadata(paths.todos);
    expect(md).toEqual(metadataConfig[paths.todos]);
  });

  it('getRouteConfig returns undefined for unknown route', () => {
    expect(getRouteConfig('/__unknown__')).toBeUndefined();
  });

  it('getRouteMetadata returns empty object for unknown route', () => {
    expect(getRouteMetadata('/__unknown__')).toEqual({});
  });
});
