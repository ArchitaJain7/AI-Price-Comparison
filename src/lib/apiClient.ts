/**
 * API client for fetching real product prices from e-commerce platforms
 * Includes filter support for refined searches
 */

import type { ProductPricing, PriceData } from './mockPrices';
import { searchProductPrices } from './mockPrices';
import type { ProductFilters } from './analytics';

/**
 * Fetch real prices from e-commerce APIs
 * Currently uses mock data with future support for real APIs
 * @param query - Product search query
 * @returns Promise resolving to ProductPricing or null
 */
export async function fetchRealPrices(query: string): Promise<ProductPricing | null> {
    try {
        const realApiResult = await tryRealApiIntegration(query);
        if (realApiResult) {
            return realApiResult;
        }

        return searchProductPrices(query);
    } catch (err) {
        console.error('API fetch error:', err);
        return searchProductPrices(query);
    }
}

/**
 * Attempt to fetch from real e-commerce APIs
 * Future integration point for services like RapidAPI, Keepa, etc.
 * Placeholder - returns null to use mock data by default
 * @param query - Product search query
 * @returns Promise resolving to ProductPricing or null
 */
async function tryRealApiIntegration(query: string): Promise<ProductPricing | null> {
    try {
        // TODO: Implement real API integrations here
        // Example services to integrate:
        // 1. Amazon Product Advertising API
        // 2. Flipkart Affiliate API
        // 3. RapidAPI aggregators
        // 4. Custom backend scraper

        // For now, return null to use mock data
        return null;
    } catch (err) {
        console.error('Real API integration error:', err);
        return null;
    }
}

/**
 * Example function to integrate Amazon API
 * @param query - Product search query
 * @returns Promise resolving to formatted prices or null
 */
export async function fetchAmazonPrices(query: string): Promise<PriceData[] | null> {
    try {
        const response = await fetch('/api/amazon/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query }),
        });

        if (!response.ok) return null;

        const data = await response.json();
        return data.prices || null;
    } catch (err) {
        console.error('Amazon API error:', err);
        return null;
    }
}

/**
 * Example function to integrate Flipkart API
 * @param query - Product search query
 * @returns Promise resolving to formatted prices or null
 */
export async function fetchFlipkartPrices(query: string): Promise<PriceData[] | null> {
    try {
        const response = await fetch('/api/flipkart/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query }),
        });

        if (!response.ok) return null;

        const data = await response.json();
        return data.prices || null;
    } catch (err) {
        console.error('Flipkart API error:', err);
        return null;
    }
}

/**
 * Apply filters to product prices
 * @param prices - Array of PriceData to filter
 * @param filters - ProductFilters to apply
 * @returns Filtered PriceData array
 */
export function applyFiltersToResults(
    prices: PriceData[],
    filters: ProductFilters
): PriceData[] {
    return prices.filter((price) => {
        if (filters.priceMin && price.price < filters.priceMin) return false;
        if (filters.priceMax && price.price > filters.priceMax) return false;
        if (filters.inStock && !price.inStock) return false;
        if (filters.rating && price.rating < filters.rating) return false;
        return true;
    });
}

/**
 * Format search query with attributes for API
 * @param query - Base product query
 * @param filters - ProductFilters with attributes
 * @returns Formatted query string for API
 */
export function formatQueryWithFilters(query: string, filters: ProductFilters): string {
    const parts = [query];

    if (filters.color) parts.push(filters.color);
    if (filters.size) parts.push(filters.size);
    if (filters.brand) parts.push(filters.brand);

    return parts.join(' ');
}

/**
 * Validate product pricing data
 * @param pricing - ProductPricing to validate
 * @returns Boolean indicating if data is valid
 */
export function isValidPricing(pricing: ProductPricing | null): boolean {
    return (
        pricing !== null &&
        pricing.prices &&
        pricing.prices.length > 0 &&
        pricing.lowestPrice > 0 &&
        pricing.highestPrice >= pricing.lowestPrice
    );
}

/**
 * Format API response for consistency
 * @param apiData - Raw API response
 * @returns Formatted ProductPricing
 */
export function formatApiResponse(apiData: any): ProductPricing | null {
    try {
        if (!apiData || !apiData.products || apiData.products.length === 0) {
            return null;
        }

        const prices: PriceData[] = apiData.products.map((product: any) => ({
            platform: product.platform || 'Unknown',
            price: Number(product.price) || 0,
            originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
            discount: product.discount || undefined,
            inStock: product.inStock !== false,
            rating: Number(product.rating) || 0,
            reviews: Number(product.reviews) || 0,
            url: product.url || '',
        }));

        const lowestPrice = Math.min(...prices.map((p) => p.price));
        const highestPrice = Math.max(...prices.map((p) => p.originalPrice || p.price));

        return {
            productName: apiData.productName || 'Product',
            prices,
            lowestPrice,
            highestPrice,
        };
    } catch (err) {
        console.error('API response formatting error:', err);
        return null;
    }
}
