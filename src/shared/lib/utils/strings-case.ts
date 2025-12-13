export function capitalize(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function splitWords(s: string): string[] {
  return s
    .trim()
    .replace(/[_\-]+/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.toLowerCase());
}

export function camelCase(s: string): string {
  const parts = splitWords(s);
  if (parts.length === 0) return '';
  return parts[0] + parts.slice(1).map(capitalize).join('');
}

export function pascalCase(s: string): string {
  return splitWords(s).map(capitalize).join('');
}

export function kebabCase(s: string): string {
  return splitWords(s).join('-');
}

export function snakeCase(s: string): string {
  return splitWords(s).join('_');
}

export function startCase(s: string): string {
  return splitWords(s).map(capitalize).join(' ');
}
