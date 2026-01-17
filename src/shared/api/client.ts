import { env } from '@/shared/config/env';

/**
 * Centralized API client with enterprise-grade features
 * Provides type-safe, cached, and resilient API calls
 */

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Timeout with AbortController
async function fetchWithTimeout(url: string, options: RequestInit = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError(408, 'Request timeout');
    }
    throw error;
  }
}

// Type-safe fetch wrapper
async function safeFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  try {
    const response = await fetchWithTimeout(url, options);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(response.status, response.statusText, errorData);
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, 'Network error occurred');
  }
}

// Main API client class
class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl: string = env.API_URL) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'User-Agent': 'Todo-Next/1.0',
    };
  }

  private mergeHeaders(headers: Record<string, string> = {}) {
    return { ...this.defaultHeaders, ...headers };
  }

  // GET request with caching support
  async get<T>(
    endpoint: string,
    options: {
      cache?: RequestCache;
      next?: { revalidate?: number | false; tags?: string[] };
      headers?: Record<string, string>;
    } = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    return safeFetch<T>(url, {
      method: 'GET',
      headers: this.mergeHeaders(options.headers),
      cache: options.cache,
      next: options.next,
    });
  }

  // POST request
  async post<T>(
    endpoint: string,
    data?: unknown,
    options: {
      headers?: Record<string, string>;
      cache?: RequestCache;
    } = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    return safeFetch<T>(url, {
      method: 'POST',
      headers: this.mergeHeaders(options.headers),
      body: data ? JSON.stringify(data) : undefined,
      cache: options.cache || 'no-store',
    });
  }

  // PUT request
  async put<T>(
    endpoint: string,
    data?: unknown,
    options: {
      headers?: Record<string, string>;
      cache?: RequestCache;
    } = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    return safeFetch<T>(url, {
      method: 'PUT',
      headers: this.mergeHeaders(options.headers),
      body: data ? JSON.stringify(data) : undefined,
      cache: options.cache || 'no-store',
    });
  }

  // DELETE request
  async delete<T>(
    endpoint: string,
    options: {
      headers?: Record<string, string>;
      cache?: RequestCache;
    } = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    return safeFetch<T>(url, {
      method: 'DELETE',
      headers: this.mergeHeaders(options.headers),
      cache: options.cache || 'no-store',
    });
  }
}

// Singleton instance
export const apiClient = new ApiClient();

// Convenience exports for common patterns
export const api = {
  // Cached GET requests (for data that changes infrequently)
  cached: {
    get: <T>(endpoint: string, revalidate = 300) =>
      apiClient.get<T>(endpoint, {
        cache: 'force-cache',
        next: { revalidate },
      }),

    tagged: <T>(endpoint: string, tags: string[]) =>
      apiClient.get<T>(endpoint, {
        cache: 'force-cache',
        next: { tags },
      }),
  },

  // Fresh GET requests (for real-time data)
  fresh: {
    get: <T>(endpoint: string) =>
      apiClient.get<T>(endpoint, {
        cache: 'no-store',
      }),
  },

  // Mutations
  create: <T>(endpoint: string, data: unknown) => apiClient.post<T>(endpoint, data),

  update: <T>(endpoint: string, data: unknown) => apiClient.put<T>(endpoint, data),

  remove: <T>(endpoint: string) => apiClient.delete<T>(endpoint),
};

// Type shortcuts
export type ApiResponse<T> = Promise<T>;
export type CachedApiResponse<T> = Promise<T>;

export default apiClient;
