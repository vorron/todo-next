/**
 * Slugify utility - преобразует строку в URL-safe формат
 * Пример: "My Workspace!" → "my-workspace"
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // пробелы в дефисы
    .replace(/[^\w\s\-]/g, '') // удаляем спецсимволы кроме пробелов
    .replace(/[\u0400-\u044f]/g, (match) => {
      const cyrillicMap: Record<string, string> = {
        а: 'a',
        б: 'b',
        в: 'v',
        г: 'g',
        д: 'd',
        е: 'e',
        ё: 'yo',
        ж: 'zh',
        з: 'z',
        и: 'i',
        й: 'y',
        к: 'k',
        л: 'l',
        м: 'm',
        н: 'n',
        о: 'o',
        п: 'p',
        р: 'r',
        с: 's',
        т: 't',
        у: 'u',
        ф: 'f',
        х: 'h',
        ц: 'ts',
        ч: 'ch',
        ш: 'sh',
        щ: 'shch',
        ъ: '',
        ы: 'y',
        ь: '',
        э: 'e',
        ю: 'yu',
        я: 'ya',
      };
      return cyrillicMap[match] || match;
    })
    .replace(/[^\w\-]+/g, '') // удаляем оставшиеся спецсимволы
    .replace(/^[\-]+/g, '') // удаляем дефисы в начале
    .replace(/[\-]+$/g, '') // удаляем дефисы в конце
    .replace(/\-+/g, '-'); // множественные дефисы в один
}
