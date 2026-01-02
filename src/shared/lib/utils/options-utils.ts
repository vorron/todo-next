export type Option<T = string> = {
  value: T;
  label: string;
};

export function createOptions<T extends string | number>(record: Record<T, string>): Option<T>[] {
  return Object.entries(record).map(([value, label]) => ({
    value: value as T,
    label: label as string,
  }));
}
