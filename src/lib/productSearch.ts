import { searchProductPrices, ProductPricing } from './mockPrices';
import { getCachedPrice, setCachePrice, addToSearchHistory } from './cacheManager';
import { fetchRealPrices, isValidPricing } from './apiClient';
import { searchProductDatabase, PlatformProduct } from './database';

/**
 * Convert database products to ProductPricing format
 */
function convertDatabaseToProductPricing(
    query: string,
    dbProducts: PlatformProduct[]
): ProductPricing | null {
    if (dbProducts.length === 0) return null;

    const prices = dbProducts.map((p) => ({
        platform: p.platform,
        price: p.price,
        originalPrice: p.originalPrice,
        discount: p.discount,
        inStock: p.inStock,
        rating: p.rating,
        reviews: p.reviews,
        url: p.url,
    }));

    const lowestPrice = Math.min(...prices.map((p) => p.price));
    const highestPrice = Math.max(...prices.map((p) => p.originalPrice || p.price));

    return {
        productName: query.charAt(0).toUpperCase() + query.slice(1),
        prices: prices.sort((a, b) => a.price - b.price),
        lowestPrice,
        highestPrice,
    };
}

/**
 * Search for product pricing with database, caching, and API fallback
 */
export async function searchProduct(
    query: string,
    imageData?: string
): Promise<ProductPricing | null> {
    if (!query.trim()) {
        throw new Error('Please enter a product name');
    }

    // Check cache first
    const cachedResult = getCachedPrice(query);
    if (cachedResult && isValidPricing(cachedResult)) {
        console.log('Using cached results for:', query);
        addToSearchHistory(query);
        return cachedResult;
    }

    // Check database next
    const dbProducts = searchProductDatabase(query);
    if (dbProducts.length > 0) {
        const dbResult = convertDatabaseToProductPricing(query, dbProducts);
        if (dbResult && isValidPricing(dbResult)) {
            console.log('Using database results for:', query);
            setCachePrice(query, dbResult);
            addToSearchHistory(query);
            return dbResult;
        }
    }

    // Simulate realistic API response time
    const apiDelayMs = 1200 + Math.random() * 800;
    await new Promise((resolve) => setTimeout(resolve, apiDelayMs));

    try {
        // Try real API
        let result = await fetchRealPrices(query);

        // Fallback to mock data if API fails
        if (!result || !isValidPricing(result)) {
            result = searchProductPrices(query);
        }

        if (!result || !isValidPricing(result)) {
            throw new Error(`No products found for "${query}". Try another search.`);
        }

        // Cache the result
        setCachePrice(query, result);
        addToSearchHistory(query);

        return result;
    } catch (err) {
        console.error('Search error:', err);
        throw err;
    }
}
