/**
 * Analytics tracking for PriceScout
 * Tracks user searches, filters, and interactions
 */

export interface SearchAnalytics {
    query: string;
    timestamp: number;
    duration: number; // in milliseconds
    resultCount: number;
    filters: ProductFilters;
    platform?: string;
    success: boolean;
}

export interface ProductFilters {
    priceMin?: number;
    priceMax?: number;
    color?: string;
    size?: string;
    brand?: string;
    rating?: number;
    inStock?: boolean;
}

export interface AnalyticsData {
    totalSearches: number;
    averageSearchTime: number;
    topSearches: string[];
    topFilters: ProductFilters[];
    successRate: number;
    lastUpdated: number;
}

const ANALYTICS_KEY = 'pricescout_analytics';
const MAX_ANALYTICS_ENTRIES = 1000;

/**
 * Track a search event
 * @param analytics - SearchAnalytics object to track
 */
export function trackSearch(analytics: SearchAnalytics): void {
    try {
        const existing = getAnalyticsData();
        const entries = existing.searches || [];

        entries.push(analytics);

        // Keep only latest entries
        if (entries.length > MAX_ANALYTICS_ENTRIES) {
            entries.shift();
        }

        localStorage.setItem(
            ANALYTICS_KEY,
            JSON.stringify({
                searches: entries,
                lastUpdated: Date.now(),
            })
        );
    } catch (err) {
        console.error('Analytics tracking error:', err);
    }
}

/**
 * Get aggregated analytics data
 * @returns AnalyticsData object with statistics
 */
export function getAnalyticsData(): any {
    try {
        const data = localStorage.getItem(ANALYTICS_KEY);
        return data ? JSON.parse(data) : { searches: [] };
    } catch (err) {
        console.error('Analytics retrieval error:', err);
        return { searches: [] };
    }
}

/**
 * Get top searches from analytics
 * @param limit - Number of top searches to return
 * @returns Array of top search queries
 */
export function getTopSearches(limit: number = 10): string[] {
    try {
        const data = getAnalyticsData();
        const searches = data.searches || [];

        const searchMap: Record<string, number> = {};
        searches.forEach((s: SearchAnalytics) => {
            searchMap[s.query] = (searchMap[s.query] || 0) + 1;
        });

        return Object.entries(searchMap)
            .sort(([, a], [, b]) => b - a)
            .slice(0, limit)
            .map(([query]) => query);
    } catch (err) {
        console.error('Top searches error:', err);
        return [];
    }
}

/**
 * Get search success rate
 * @returns Percentage of successful searches (0-100)
 */
export function getSearchSuccessRate(): number {
    try {
        const data = getAnalyticsData();
        const searches = data.searches || [];

        if (searches.length === 0) return 0;

        const successful = searches.filter((s: SearchAnalytics) => s.success).length;
        return Math.round((successful / searches.length) * 100);
    } catch (err) {
        console.error('Success rate error:', err);
        return 0;
    }
}

/**
 * Clear all analytics data
 */
export function clearAnalytics(): void {
    try {
        localStorage.removeItem(ANALYTICS_KEY);
    } catch (err) {
        console.error('Analytics clear error:', err);
    }
}

/**
 * Export analytics as JSON
 * @returns JSON string of analytics data
 */
export function exportAnalytics(): string {
    try {
        const data = getAnalyticsData();
        return JSON.stringify(data, null, 2);
    } catch (err) {
        console.error('Analytics export error:', err);
        return '{}';
    }
}
