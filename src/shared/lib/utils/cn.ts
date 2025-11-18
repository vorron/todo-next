import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility для объединения классов Tailwind
 * Решает проблему конфликтующих классов
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
