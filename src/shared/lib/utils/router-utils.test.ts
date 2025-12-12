import { describe, expect, it } from 'vitest';
import { getRouteConfig, getRouteMetadata } from './router-utils';
import { ROUTE_CONFIG } from '@/shared/config/router-config';

describe('router-utils', () => {
  it('getRouteConfig returns config for known route', () => {
    const knownPath = Object.keys(ROUTE_CONFIG)[0];
    if (!knownPath) {
      throw new Error('ROUTE_CONFIG is empty');
    }

    const cfg = getRouteConfig(knownPath);
    expect(cfg).toEqual(ROUTE_CONFIG[knownPath as keyof typeof ROUTE_CONFIG]);
  });

  it('getRouteMetadata returns metadata for known route', () => {
    const knownPath = Object.keys(ROUTE_CONFIG)[0];
    if (!knownPath) {
      throw new Error('ROUTE_CONFIG is empty');
    }
    const md = getRouteMetadata(knownPath);

    expect(md).toEqual(ROUTE_CONFIG[knownPath as keyof typeof ROUTE_CONFIG]?.metadata);
  });
});
