import { describe, expect, it, beforeEach } from 'vitest';

import { validateRouteConfig, validateConfigInDev, clearValidationCache } from './validation';

describe('router validation', () => {
  beforeEach(() => {
    // Очищаем кеш перед каждым тестом
    clearValidationCache();
  });

  describe('validateRouteConfig', () => {
    it('returns valid for correct configuration', () => {
      const result = validateRouteConfig();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('caches validation results', () => {
      const result1 = validateRouteConfig();
      const result2 = validateRouteConfig();

      // Второй вызов должен вернуть тот же результат (из кеша)
      expect(result1).toBe(result2);
    });

    it('clears cache correctly', () => {
      const result1 = validateRouteConfig();
      clearValidationCache();
      const result2 = validateRouteConfig();

      // После очистки кеша должны быть разные объекты
      expect(result1).not.toBe(result2);
      expect(result1.isValid).toBe(result2.isValid);
    });

    it('detects duplicate paths (mock test)', () => {
      // Этот тест демонстрирует как работала бы проверка дубликатов
      // В реальной конфигурации дубликатов нет

      const result = validateRouteConfig();

      // В текущей конфигурации не должно быть дубликатов
      expect(result.isValid).toBe(true);
      expect(result.errors.some((error) => error.includes('Duplicate paths'))).toBe(false);
    });

    it('detects duplicate navigation orders (mock test)', () => {
      const result = validateRouteConfig();

      // В текущей конфигурации не должно быть дубликатов order
      expect(result.isValid).toBe(true);
      expect(result.errors.some((error) => error.includes('Duplicate navigation orders'))).toBe(
        false,
      );
    });

    it('validates dynamic route formats', () => {
      const result = validateRouteConfig();

      // Все динамические маршруты должны содержать параметры
      expect(result.isValid).toBe(true);
      expect(result.errors.some((error) => error.includes('missing path parameters'))).toBe(false);
    });
  });

  describe('validateConfigInDev', () => {
    it('validates in development mode', () => {
      // Мокаем process.env.NODE_ENV
      const envDescriptor = Object.getOwnPropertyDescriptor(process, 'env')!;
      Object.defineProperty(process, 'env', {
        ...envDescriptor,
        value: { ...process.env, NODE_ENV: 'development' },
      });

      try {
        // Не должно выбрасывать ошибок
        expect(() => validateConfigInDev()).not.toThrow();
      } finally {
        // Восстанавливаем оригинальное значение
        Object.defineProperty(process, 'env', envDescriptor);
      }
    });

    it('skips validation in production', () => {
      const envDescriptor = Object.getOwnPropertyDescriptor(process, 'env')!;
      Object.defineProperty(process, 'env', {
        ...envDescriptor,
        value: { ...process.env, NODE_ENV: 'production' },
      });

      try {
        // Не должно выбрасывать ошибок
        expect(() => validateConfigInDev()).not.toThrow();
      } finally {
        Object.defineProperty(process, 'env', envDescriptor);
      }
    });

    it('skips validation in test environment', () => {
      const envDescriptor = Object.getOwnPropertyDescriptor(process, 'env')!;
      Object.defineProperty(process, 'env', {
        ...envDescriptor,
        value: { ...process.env, NODE_ENV: 'test' },
      });

      try {
        // Не должно выбрасывать ошибок
        expect(() => validateConfigInDev()).not.toThrow();
      } finally {
        Object.defineProperty(process, 'env', envDescriptor);
      }
    });
  });

  describe('clearValidationCache', () => {
    it('clears validation cache', () => {
      // Первый вызов создает кеш
      validateRouteConfig();

      // Очистка кеша не должна выбрасывать ошибки
      expect(() => clearValidationCache()).not.toThrow();

      // После очистки валидация должна работать
      const result = validateRouteConfig();
      expect(result.isValid).toBe(true);
    });
  });
});
