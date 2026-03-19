/**
 * Simple in-memory cache for API responses.
 * Data persists across page navigation (same session).
 * Keys auto-expire after TTL milliseconds.
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const store = new Map<string, CacheEntry<unknown>>();

export const cache = {
  get<T>(key: string): T | null {
    const entry = store.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) { store.delete(key); return null; }
    return entry.data;
  },

  set<T>(key: string, data: T, ttlMs = 30_000): void {
    store.set(key, { data, expiresAt: Date.now() + ttlMs });
  },

  invalidate(prefix: string): void {
    for (const key of store.keys()) {
      if (key.startsWith(prefix)) store.delete(key);
    }
  },

  clear(): void { store.clear(); },
};