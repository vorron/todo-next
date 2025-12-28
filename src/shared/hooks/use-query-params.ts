'use client';

import { useCallback } from 'react';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';

interface QueryParamsConfig<T extends Record<string, unknown>> {
  defaultState: T;
  serialize?: (state: T) => Record<string, string>;
  deserialize?: (params: URLSearchParams) => T;
}

type FieldConfig<TValue> = {
  paramKey?: string;
  trim?: boolean;
  allowed?: readonly TValue[];
  serialize?: (value: TValue, defaultValue: TValue) => string;
  deserialize?: (value: string | null, defaultValue: TValue) => TValue;
};

type FieldConfigMap<T extends Record<string, unknown>> = {
  [K in keyof T]?: FieldConfig<T[K]>;
};

type SchemaFieldBase<Key extends string, T> = {
  name: Key;
  defaultValue: T;
  paramKey?: string;
  serialize?: (value: T, defaultValue: T) => string;
  deserialize?: (value: string | null, defaultValue: T) => T;
};

type StringField<Key extends string> = SchemaFieldBase<Key, string> & {
  type?: 'string';
  trim?: boolean;
};

type EnumField<Key extends string, T extends readonly string[]> = SchemaFieldBase<
  Key,
  T[number]
> & {
  type?: 'enum';
  values: T;
};

type NumberField<Key extends string> = SchemaFieldBase<Key, number> & {
  type?: 'number';
};

type SchemaField<Key extends string> =
  | StringField<Key>
  | EnumField<Key, readonly string[]>
  | NumberField<Key>;

export type Schema = readonly SchemaField<string>[];

type SchemaValue<F> = F extends { values: readonly (infer V)[] }
  ? V
  : F extends { defaultValue: number }
    ? number
    : string;

type SchemaToState<S extends Schema> = {
  [K in S[number]['name']]: SchemaValue<Extract<S[number], { name: K }>>;
};

function createDefaultSerializer<T extends Record<string, unknown>>(defaultState: T) {
  return {
    serialize: (state: T): Record<string, string> => {
      const result: Record<string, string> = {};
      for (const [key, value] of Object.entries(state)) {
        if (value !== undefined && value !== null && value !== '') {
          result[key] = String(value);
        }
      }
      return result;
    },
    deserialize: (params: URLSearchParams): T => {
      const result: T = { ...defaultState };
      (Object.keys(defaultState) as Array<keyof T>).forEach((key) => {
        const value = params.get(key as string);
        if (value !== null) {
          // Simple type inference - can be enhanced
          const defaultValue = defaultState[key];
          if (typeof defaultValue === 'number') {
            result[key] = (isNaN(Number(value)) ? defaultValue : Number(value)) as T[keyof T];
          } else {
            result[key] = value as T[keyof T];
          }
        }
      });
      return result;
    },
  };
}

export function createQueryParamsMapper<T extends Record<string, unknown>>(
  defaultState: T,
  config: FieldConfigMap<T>,
) {
  const entries = Object.entries(defaultState) as Array<[keyof T, T[keyof T]]>;

  const serialize = (state: T): Record<string, string> => {
    const params: Record<string, string> = {};

    entries.forEach(([key, defaultValue]) => {
      const fieldConfig = config[key] ?? {};
      const paramKey = fieldConfig.paramKey ?? (key as string);
      const value = state[key];

      // custom serializer hook
      if (fieldConfig.serialize) {
        const encoded = fieldConfig.serialize(value, defaultValue);
        if (encoded) params[paramKey] = encoded;
        return;
      }

      // trim support for strings
      if (typeof value === 'string' && fieldConfig.trim) {
        const trimmed = value.trim();
        if (trimmed) params[paramKey] = trimmed;
        return;
      }

      // default suppression for primitive equality
      if (value !== defaultValue) {
        params[paramKey] = String(value);
      }
    });

    return params;
  };

  const deserialize = (params: URLSearchParams): T => {
    const result: Record<keyof T, T[keyof T]> = { ...defaultState };

    entries.forEach(([key, defaultValue]) => {
      const fieldConfig = config[key] ?? {};
      const paramKey = fieldConfig.paramKey ?? (key as string);
      const rawValue = params.get(paramKey);

      // custom deserializer hook
      if (fieldConfig.deserialize) {
        result[key] = fieldConfig.deserialize(rawValue, defaultValue) as T[keyof T];
        return;
      }

      if (rawValue === null) {
        result[key] = defaultValue;
        return;
      }

      const valueToUse =
        fieldConfig.trim && typeof rawValue === 'string' ? rawValue.trim() : rawValue;

      if (fieldConfig.allowed) {
        // ensure exact match with allowed values
        if ((fieldConfig.allowed as readonly unknown[]).includes(valueToUse)) {
          result[key] = valueToUse as T[keyof T];
        } else {
          result[key] = defaultValue;
        }
        return;
      }

      // fallback: keep string or convert number based on default type
      if (typeof defaultValue === 'number') {
        const asNumber = Number(valueToUse);
        result[key] = (Number.isNaN(asNumber) ? defaultValue : asNumber) as T[keyof T];
        return;
      }

      result[key] = valueToUse as T[keyof T];
    });

    return result as T;
  };

  return { serialize, deserialize };
}

export function createQueryParamsMapperFromSchema<const S extends Schema>(schema: S) {
  const defaultState = schema.reduce<SchemaToState<S>>((acc, field) => {
    const name = field.name as keyof SchemaToState<S>;
    acc[name] = field.defaultValue as SchemaToState<S>[typeof name];
    return acc;
  }, {} as SchemaToState<S>);

  const fieldConfigMap = schema.reduce(
    (acc, field) => {
      const name = field.name as keyof SchemaToState<S>;
      const paramKey = field.paramKey ?? field.name;
      const common: FieldConfig<SchemaToState<S>[typeof name]> = {
        paramKey,
        serialize: field.serialize as FieldConfig<SchemaToState<S>[typeof name]>['serialize'],
        deserialize: field.deserialize as FieldConfig<SchemaToState<S>[typeof name]>['deserialize'],
      };

      const kind: 'enum' | 'string' | 'number' =
        (field as EnumField<string, readonly string[]>).values !== undefined
          ? 'enum'
          : (field.type ?? 'string');

      if (kind === 'enum') {
        acc[name] = {
          ...common,
          allowed: (field as EnumField<string, readonly string[]>)
            .values as unknown as readonly SchemaToState<S>[typeof name][],
        };
      } else if (kind === 'number') {
        acc[name] = { ...common };
      } else {
        const stringField = field as StringField<string>;
        acc[name] = { ...common, trim: stringField.trim };
      }

      return acc;
    },
    {} as FieldConfigMap<SchemaToState<S>>,
  );

  const { serialize, deserialize } = createQueryParamsMapper(defaultState, fieldConfigMap);
  return { serialize, deserialize, defaultState };
}

export function useQueryParams<T extends Record<string, unknown>>(config: QueryParamsConfig<T>) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const { defaultState, serialize, deserialize } = {
    ...createDefaultSerializer(config.defaultState),
    ...config,
  };

  const parseQuery = useCallback((): T => {
    return deserialize!(searchParams);
  }, [searchParams, deserialize]);

  const buildQuery = useCallback(
    (state: Partial<T>) => {
      const currentState = parseQuery();
      const newState = { ...currentState, ...state };
      const serialized = serialize!(newState);

      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(serialized)) {
        if (value) {
          params.set(key, value);
        }
      }

      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

      router.push(newUrl);
    },
    [parseQuery, serialize, pathname, router],
  );

  const resetQuery = useCallback(() => {
    buildQuery(defaultState);
  }, [buildQuery, defaultState]);

  return {
    state: parseQuery(),
    parseQuery,
    buildQuery,
    resetQuery,
  };
}

export function useSchemaQueryParams<const S extends Schema>(schema: S) {
  type State = SchemaToState<S>;
  const mapper = createQueryParamsMapperFromSchema(schema);

  return useQueryParams<State>({
    defaultState: mapper.defaultState as State,
    serialize: mapper.serialize as (state: State) => Record<string, string>,
    deserialize: mapper.deserialize as (params: URLSearchParams) => State,
  });
}
