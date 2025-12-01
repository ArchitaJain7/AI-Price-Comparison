/**
 * Product database management system
 * Stores and retrieves product data from e-commerce platforms
 */

export interface PlatformProduct {
    id: string;
    productName: string;
    platform: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    inStock: boolean;
    rating: number;
    reviews: number;
    url: string;
    category: string;
    timestamp: number;
}

export interface ProductDatabase {
    [productKey: string]: PlatformProduct[];
}

const DB_KEY = 'pricescout_product_db';

/**
 * Initialize database with default structure
 */
function initializeDatabase(): ProductDatabase {
    return {};
}

/**
 * Get all products from database
 */
export function getDatabase(): ProductDatabase {
    try {
        const data = localStorage.getItem(DB_KEY);
        if (data) {
            return JSON.parse(data);
        }
        return initializeDatabase();
    } catch (err) {
        console.error('Database retrieval error:', err);
        return initializeDatabase();
    }
}

/**
 * Save product to database
 */
export function saveProductToDatabase(
    productKey: string,
    products: PlatformProduct[]
): void {
    try {
        const db = getDatabase();
        db[productKey] = products;
        localStorage.setItem(DB_KEY, JSON.stringify(db));
        console.log(`Saved ${products.length} products for: ${productKey}`);
    } catch (err) {
        console.error('Database save error:', err);
    }
}

/**
 * Get product by key from database
 */
export function getProductFromDatabase(productKey: string): PlatformProduct[] | null {
    try {
        const db = getDatabase();
        const key = productKey.toLowerCase().replace(/\s+/g, '');
        return db[key] || null;
    } catch (err) {
        console.error('Database get error:', err);
        return null;
    }
}

/**
 * Search products in database by query
 */
export function searchProductDatabase(query: string): PlatformProduct[] {
    try {
        const db = getDatabase();
        const queryLower = query.toLowerCase();
        const results: PlatformProduct[] = [];

        for (const products of Object.values(db)) {
            for (const product of products) {
                if (
                    product.productName.toLowerCase().includes(queryLower) ||
                    product.category.toLowerCase().includes(queryLower)
                ) {
                    results.push(product);
                }
            }
        }

        return results;
    } catch (err) {
        console.error('Database search error:', err);
        return [];
    }
}

/**
 * Get products by category
 */
export function getProductsByCategory(category: string): PlatformProduct[] {
    try {
        const db = getDatabase();
        const results: PlatformProduct[] = [];

        for (const products of Object.values(db)) {
            for (const product of products) {
                if (product.category.toLowerCase() === category.toLowerCase()) {
                    results.push(product);
                }
            }
        }

        return results;
    } catch (err) {
        console.error('Category search error:', err);
        return [];
    }
}

/**
 * Get products by platform
 */
export function getProductsByPlatform(platform: string): PlatformProduct[] {
    try {
        const db = getDatabase();
        const results: PlatformProduct[] = [];

        for (const products of Object.values(db)) {
            for (const product of products) {
                if (product.platform.toLowerCase() === platform.toLowerCase()) {
                    results.push(product);
                }
            }
        }

        return results;
    } catch (err) {
        console.error('Platform search error:', err);
        return [];
    }
}

/**
 * Batch import products
 */
export function batchImportProducts(productsData: PlatformProduct[]): void {
    try {
        const db = getDatabase();

        for (const product of productsData) {
            const key = product.productName.toLowerCase().replace(/\s+/g, '');
            if (!db[key]) {
                db[key] = [];
            }
            db[key].push(product);
        }

        localStorage.setItem(DB_KEY, JSON.stringify(db));
        console.log(`Imported ${productsData.length} products into database`);
    } catch (err) {
        console.error('Batch import error:', err);
    }
}

/**
 * Export database
 */
export function exportDatabase(): string {
    try {
        const db = getDatabase();
        return JSON.stringify(db, null, 2);
    } catch (err) {
        console.error('Database export error:', err);
        return '{}';
    }
}

/**
 * Clear database
 */
export function clearDatabase(): void {
    try {
        localStorage.removeItem(DB_KEY);
        console.log('Database cleared');
    } catch (err) {
        console.error('Database clear error:', err);
    }
}

/**
 * Get database stats
 */
export function getDatabaseStats(): {
    totalProducts: number;
    totalEntries: number;
    platforms: string[];
    categories: string[];
} {
    try {
        const db = getDatabase();
        const platforms = new Set<string>();
        const categories = new Set<string>();
        let totalEntries = 0;

        for (const products of Object.values(db)) {
            totalEntries += products.length;
            for (const product of products) {
                platforms.add(product.platform);
                categories.add(product.category);
            }
        }

        return {
            totalProducts: Object.keys(db).length,
            totalEntries,
            platforms: Array.from(platforms),
            categories: Array.from(categories),
        };
    } catch (err) {
        console.error('Stats error:', err);
        return {
            totalProducts: 0,
            totalEntries: 0,
            platforms: [],
            categories: [],
        };
    }
}
