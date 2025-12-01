/**
 * Cache management for product prices
 * Stores search results with timestamps for efficient retrieval
 */

import type { ProductPricing } from './mockPrices';

interface CachedResult {
    data: ProductPricing;
    timestamp: number;
}

const CACHE_DURATION_MS = 30 * 60 * 1000; // 30 minutes
const CACHE_KEY_PREFIX = 'pricescout_cache_';
const SEARCH_HISTORY_KEY = 'pricescout_search_history';

/**
 * Get cached product pricing if available and not expired
 * @param query - Product search query
 * @returns Cached ProductPricing or null if expired/not found
 */
export function getCachedPrice(query: string): ProductPricing | null {
    try {
        const normalizedQuery = query.toLowerCase().trim();
        const cacheKey = CACHE_KEY_PREFIX + normalizedQuery;
        const cached = localStorage.getItem(cacheKey);

        if (!cached) return null;

        const cachedResult: CachedResult = JSON.parse(cached);
        const isExpired = Date.now() - cachedResult.timestamp > CACHE_DURATION_MS;

        if (isExpired) {
            localStorage.removeItem(cacheKey);
            return null;
        }

        return cachedResult.data;
    } catch (err) {
        console.error('Cache retrieval error:', err);
        return null;
    }
}

/**
 * Store product pricing in cache
 * @param query - Product search query
 * @param data - ProductPricing data to cache
 */
export function setCachePrice(query: string, data: ProductPricing): void {
    try {
        const normalizedQuery = query.toLowerCase().trim();
        const cacheKey = CACHE_KEY_PREFIX + normalizedQuery;

        const cachedResult: CachedResult = {
            data,
            timestamp: Date.now(),
        };

        localStorage.setItem(cacheKey, JSON.stringify(cachedResult));
    } catch (err) {
        console.error('Cache storage error:', err);
    }
}

/**
 * Clear expired cache entries
 */
export function clearExpiredCache(): void {
    try {
        const keys = Object.keys(localStorage);
        const now = Date.now();

        keys.forEach((key) => {
            if (key.startsWith(CACHE_KEY_PREFIX)) {
                const cached = localStorage.getItem(key);
                if (cached) {
                    try {
                        const cachedResult: CachedResult = JSON.parse(cached);
                        if (now - cachedResult.timestamp > CACHE_DURATION_MS) {
                            localStorage.removeItem(key);
                        }
                    } catch {
                        localStorage.removeItem(key);
                    }
                }
            }
        });
    } catch (err) {
        console.error('Cache cleanup error:', err);
    }
}

/**
 * Add search to history
 * @param query - Product search query
 */
export function addToSearchHistory(query: string): void {
    try {
        const normalizedQuery = query.toLowerCase().trim();
        const history = getSearchHistory();

        // Remove duplicate if exists
        const filtered = history.filter((q) => q.toLowerCase() !== normalizedQuery);

        // Add to front and keep only last 10
        const updated = [query, ...filtered].slice(0, 10);

        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
    } catch (err) {
        console.error('Search history error:', err);
    }
}

/**
 * Get search history
 * @returns Array of recent search queries
 */
export function getSearchHistory(): string[] {
    try {
        const history = localStorage.getItem(SEARCH_HISTORY_KEY);
        return history ? JSON.parse(history) : [];
    } catch (err) {
        console.error('Search history retrieval error:', err);
        return [];
    }
}

/**
 * Clear all cache and history
 */
export function clearAllCache(): void {
    try {
        const keys = Object.keys(localStorage);
        keys.forEach((key) => {
            if (key.startsWith(CACHE_KEY_PREFIX) || key === SEARCH_HISTORY_KEY) {
                localStorage.removeItem(key);
            }
        });
    } catch (err) {
        console.error('Cache clear error:', err);
    }
}
