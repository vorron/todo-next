import type { Session } from "@/features/auth/model/auth-schema";

const SESSION_KEY = "app_session";

/**
 * Mock хранилище сессий (заменится на реальное API)
 */

export const sessionStorage = {
  /**
   * Сохранить сессию
   */
  save(session: Session): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  },

  /**
   * Получить сессию
   */
  get(): Session | null {
    if (typeof window === "undefined") return null;

    const data = localStorage.getItem(SESSION_KEY);
    if (!data) return null;

    try {
      const session = JSON.parse(data) as Session;

      // Проверяем срок действия
      if (new Date(session.expiresAt) < new Date()) {
        this.clear();
        return null;
      }

      return session;
    } catch {
      return null;
    }
  },

  /**
   * Удалить сессию
   */
  clear(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(SESSION_KEY);
  },

  /**
   * Проверить валидность сессии
   */
  isValid(): boolean {
    const session = this.get();
    return session !== null;
  },
};

/**
 * Создать mock сессию
 */
export function createMockSession(
  userId: string,
  username: string,
  name: string
): Session {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24); // 24 часа

  return {
    userId,
    username,
    name,
    expiresAt: expiresAt.toISOString(),
  };
}
