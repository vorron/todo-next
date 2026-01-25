/**
 * Утилиты для работы с query параметрами
 * Консистентное построение URL query strings во всем приложении
 */

export function buildQuery(params: Record<string, string | number | boolean | undefined>) {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value !== undefined),
  );
  return new URLSearchParams(cleanParams as Record<string, string>);
}

export function buildUrlWithQuery(
  baseUrl: string,
  params: Record<string, string | number | boolean | undefined>,
) {
  const query = buildQuery(params);
  return query.toString() ? `${baseUrl}?${query}` : baseUrl;
}
