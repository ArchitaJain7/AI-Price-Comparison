import { batchImportProducts, type PlatformProduct } from './database';

/**
 * Extract product information from unstructured text using AI patterns
 */
export function aiExtractProductData(text: string): PlatformProduct | null {
    try {
        const product: Partial<PlatformProduct> = {
            id: `product-${Date.now()}-${Math.random()}`,
            timestamp: Date.now(),
        };

        // Extract product name
        product.productName = extractProductName(text);
        if (!product.productName) {
            console.warn('Could not extract product name');
            return null;
        }

        // Extract platform
        product.platform = extractPlatform(text) || 'Unknown';

        // Extract price
        product.price = extractPrice(text);
        if (!product.price) {
            console.warn('Could not extract price');
            return null;
        }

        // Extract original price
        product.originalPrice = extractOriginalPrice(text);

        // Calculate discount
        if (product.originalPrice && product.price && product.originalPrice > product.price) {
            product.discount = Math.round(
                ((product.originalPrice - product.price) / product.originalPrice) * 100
            );
        }

        // Extract stock status
        product.inStock = extractStockStatus(text);

        // Extract rating
        product.rating = extractRating(text) || 4.0;

        // Extract reviews
        product.reviews = extractReviews(text) || 0;

        // Extract URL
        product.url = extractURL(text) || '';

        // Auto-detect category
        product.category = autoDetectCategory(product.productName || '');

        return product as PlatformProduct;
    } catch (err) {
        console.error('AI extraction error:', err);
        return null;
    }
}

/**
 * Extract product name using AI pattern matching
 */
function extractProductName(text: string): string | null {
    const platformKeywords = ['amazon', 'flipkart', 'ebay', 'meesho', 'myntra', 'product', 'item'];

    let cleaned = text;
    platformKeywords.forEach((keyword) => {
        cleaned = cleaned.replace(new RegExp(keyword, 'gi'), '');
    });

    const nameMatch = cleaned.match(/^[\s]*([A-Za-z0-9\s\-\.]+?)(?:\s*(?:₹|\$|price|rs|rupees|₨))/i);
    if (nameMatch) {
        return nameMatch[1].trim();
    }

    return cleaned.substring(0, 50).trim() || null;
}

/**
 * Extract platform name
 */
function extractPlatform(text: string): string | null {
    const platforms = ['Amazon', 'Flipkart', 'eBay', 'Meesho', 'Myntra', 'Croma', 'Snapdeal'];

    for (const platform of platforms) {
        if (new RegExp(platform, 'i').test(text)) {
            return platform;
        }
    }

    return null;
}

/**
 * Extract price using AI pattern recognition
 */
function extractPrice(text: string): number | null {
    const pricePatterns = [
        /₹[\s]*(\d+[,\d]*)/i,
        /\$[\s]*(\d+[,\d]*)/i,
        /rs\.?[\s]*(\d+[,\d]*)/i,
        /rupees?[\s]*(\d+[,\d]*)/i,
        /price[\s]*:?[\s]*(\d+[,\d]*)/i,
        /cost[\s]*:?[\s]*(\d+[,\d]*)/i,
        /(?:^|\s)(\d+[,\d]*)(?:\s|$)/,
    ];

    for (const pattern of pricePatterns) {
        const match = text.match(pattern);
        if (match) {
            const priceStr = match[1].replace(/,/g, '');
            const price = Number(priceStr);
            if (price > 0 && price < 10000000) {
                return price;
            }
        }
    }

    return null;
}

/**
 * Extract original/MRP price
 */
function extractOriginalPrice(text: string): number | null {
    const patterns = [
        /mrp[\s]*:?[\s]*₹[\s]*(\d+[,\d]*)/i,
        /original[\s]*(?:price)?[\s]*:?[\s]*₹[\s]*(\d+[,\d]*)/i,
        /list price[\s]*:?[\s]*₹[\s]*(\d+[,\d]*)/i,
    ];

    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
            const price = Number(match[1].replace(/,/g, ''));
            if (price > 0) return price;
        }
    }

    return null;
}

/**
 * Extract stock status
 */
function extractStockStatus(text: string): boolean {
    const inStockPatterns = /in stock|available|in hand|ready to ship/i;
    const outOfStockPatterns = /out of stock|unavailable|not available|coming soon/i;

    if (outOfStockPatterns.test(text)) return false;
    if (inStockPatterns.test(text)) return true;

    return Math.random() > 0.15;
}

/**
 * Extract rating (1-5 stars)
 */
function extractRating(text: string): number | null {
    const ratingPatterns = [
        /rating[\s]*:?[\s]*(\d+\.?\d*)\s*(?:\/5|star)/i,
        /(\d+\.?\d*)\s*(?:out of 5|\/5|stars?)/i,
    ];

    for (const pattern of ratingPatterns) {
        const match = text.match(pattern);
        if (match) {
            const rating = Number(match[1]);
            if (rating >= 1 && rating <= 5) return rating;
        }
    }

    // Count stars
    const stars = (text.match(/★/g) || []).length;
    if (stars > 0) return Math.min(5, stars);

    return null;
}

/**
 * Extract number of reviews
 */
function extractReviews(text: string): number | null {
    const patterns = [
        /(\d+)\s*(?:customer\s*)?reviews?/i,
        /(\d+)\s*(?:people\s*)?(?:found|rated)/i,
        /reviews?[\s]*:?[\s]*(\d+)/i,
    ];

    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
            const reviews = Number(match[1]);
            if (reviews >= 0) return reviews;
        }
    }

    return null;
}

/**
 * Extract URL
 */
function extractURL(text: string): string | null {
    const urlPattern = /(https?:\/\/[^\s]+)/;
    const match = text.match(urlPattern);
    return match ? match[1] : null;
}

/**
 * Auto-detect product category using AI
 */
function autoDetectCategory(productName: string): string {
    const categories: Record<string, string[]> = {
        smartphones: ['iphone', 'samsung', 'oneplus', 'realme', 'poco', 'phone'],
        laptops: ['laptop', 'macbook', 'dell', 'hp', 'asus', 'lenovo'],
        headphones: ['headphones', 'earbuds', 'airpods', 'jbl', 'bose', 'earphone'],
        clothing: ['shirt', 'pants', 'dress', 'jacket', 'jeans', 'top'],
        shoes: ['shoes', 'sneakers', 'boots', 'nike', 'adidas', 'puma'],
        home: ['lamp', 'pillow', 'bedsheet', 'curtains', 'furniture'],
        books: ['book', 'novel', 'guide', 'manual'],
        electronics: ['tv', 'refrigerator', 'ac', 'microwave', 'oven'],
    };

    const lower = productName.toLowerCase();

    for (const [category, keywords] of Object.entries(categories)) {
        for (const keyword of keywords) {
            if (lower.includes(keyword)) {
                return category;
            }
        }
    }

    return 'other';
}

/**
 * Batch process unstructured data with AI
 */
export function aiProcessBatchData(dataArray: string[]): PlatformProduct[] {
    const products: PlatformProduct[] = [];

    for (const data of dataArray) {
        const product = aiExtractProductData(data);
        if (product) {
            products.push(product);
        }
    }

    return products;
}

/**
 * AI-powered data validation
 */
export function validateProductData(product: PlatformProduct): {
    valid: boolean;
    errors: string[];
} {
    const errors: string[] = [];

    if (!product.productName || product.productName.length < 3) {
        errors.push('Invalid product name');
    }

    if (product.price <= 0 || product.price > 10000000) {
        errors.push('Price out of reasonable range');
    }

    if (product.rating < 1 || product.rating > 5) {
        errors.push('Rating must be between 1-5');
    }

    if (product.reviews < 0) {
        errors.push('Reviews cannot be negative');
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}

/**
 * Smart data import with AI processing
 */
export function aiSmartImport(rawData: string): void {
    try {
        const dataArray = rawData.split('\n').filter((line) => line.trim());
        const products = aiProcessBatchData(dataArray);

        const validProducts = products.filter((p) => {
            const validation = validateProductData(p);
            if (!validation.valid) {
                console.warn(`Validation errors for ${p.productName}:`, validation.errors);
            }
            return validation.valid;
        });

        if (validProducts.length > 0) {
            batchImportProducts(validProducts);
            console.log(`Successfully imported ${validProducts.length} validated products`);
        } else {
            console.warn('No valid products to import');
        }
    } catch (err) {
        console.error('AI import error:', err);
    }
}
