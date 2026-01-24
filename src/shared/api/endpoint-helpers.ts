import { type z } from 'zod';

/**
 * Higher-order function для автоматической валидации ответов API
 * Улучшает DX путем устранения дублирования transformResponse
 */
export function createValidatedEndpoint<TSchema extends z.ZodTypeAny>(schema: TSchema) {
  return {
    transformResponse: (response: unknown): z.infer<TSchema> => schema.parse(response),
  };
}

/**
 * Создает endpoint с автоматической валидацией query параметров
 */
export function createValidatedQueryEndpoint<
  TQuerySchema extends z.ZodTypeAny,
  TResponseSchema extends z.ZodTypeAny,
>(querySchema: TQuerySchema, responseSchema: TResponseSchema) {
  return {
    query: (params: unknown) => {
      const validatedParams = querySchema.parse(params);
      return validatedParams;
    },
    transformResponse: (response: unknown) => responseSchema.parse(response),
  };
}

/**
 * Создает mutation endpoint с валидацией body и ответа
 */
export function createValidatedMutationEndpoint<
  TBodySchema extends z.ZodTypeAny,
  TResponseSchema extends z.ZodTypeAny,
>(bodySchema: TBodySchema, responseSchema: TResponseSchema) {
  return {
    query: (data: unknown) => {
      const validatedData = bodySchema.parse(data);
      return {
        body: validatedData,
      };
    },
    transformResponse: (response: unknown) => responseSchema.parse(response),
  };
}

/**
 * Типизированный helper для создания cache tags
 */
export function createEntityTags<T extends string>(entityType: T) {
  return {
    provideListTags: <TItem extends { id: string }>(result: TItem[] | undefined) =>
      result
        ? [...result.map(({ id }) => ({ type: entityType, id })), { type: entityType, id: 'LIST' }]
        : [{ type: entityType, id: 'LIST' }],

    provideSingleTag: (id: string) => ({ type: entityType, id }),

    invalidateListTags: [{ type: entityType, id: 'LIST' }],

    invalidateSingleAndListTags: (id: string) => [
      { type: entityType, id },
      { type: entityType, id: 'LIST' },
    ],
  };
}
