import { describe, expect, it } from 'vitest';

import { metadataConfig } from './generators';

describe('router metadata access', () => {
  it('metadataConfig provides metadata for known routes', () => {
    const routes = Object.keys(metadataConfig);
    expect(routes.length).toBeGreaterThan(0);

    // Проверяем что у каждого маршрута есть метаданные
    routes.forEach((path) => {
      const metadata = metadataConfig[path];
      expect(metadata).toBeDefined();
      expect(typeof metadata).toBe('object');
    });
  });

  it('metadataConfig returns undefined for unknown route', () => {
    expect(metadataConfig['/__unknown__' as keyof typeof metadataConfig]).toBeUndefined();
  });

  it('metadataConfig structure is consistent', () => {
    const routes = Object.keys(metadataConfig);
    expect(routes.length).toBeGreaterThan(0);

    const firstPath = routes[0];
    if (firstPath) {
      const metadata = metadataConfig[firstPath];

      // Проверяем базовую структуру метаданных
      expect(metadata).toHaveProperty('title');
      expect(metadata).toHaveProperty('description');
    }
  });
});
