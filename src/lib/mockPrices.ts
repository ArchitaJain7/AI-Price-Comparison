/**
 * Price comparison data structures and utilities
 * Provides realistic pricing data across multiple e-commerce platforms
 */

export interface PriceData {
    platform: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    inStock: boolean;
    rating: number;
    reviews: number;
    url: string;
}

export interface ProductPricing {
    productName: string;
    image?: string;
    prices: PriceData[];
    lowestPrice: number;
    highestPrice: number;
}

interface Platform {
    name: string;
    url: string;
    priceVariation: number;
}

interface ProductPrice {
    basePrice: number;
    range: number;
}

/** E-commerce platforms with their search URLs and price variations */
const ECOMMERCE_PLATFORMS: Platform[] = [
    { name: 'Amazon', url: 'https://www.amazon.in/s?k=', priceVariation: 0.98 },
    { name: 'Flipkart', url: 'https://www.flipkart.com/search?q=', priceVariation: 0.95 },
    { name: 'eBay', url: 'https://www.ebay.in/sch/i.html?_nkw=', priceVariation: 1.02 },
    { name: 'Meesho', url: 'https://www.meesho.com/search?q=', priceVariation: 0.90 },
    { name: 'Myntra', url: 'https://www.myntra.com/search?q=', priceVariation: 0.97 },
]

/** Platform availability mapping by product category */
const PLATFORM_BY_CATEGORY: Record<string, string[]> = {
    'electronics': ['Amazon', 'Flipkart', 'eBay'],
    'smartphones': ['Amazon', 'Flipkart', 'eBay'],
    'laptops': ['Amazon', 'Flipkart', 'eBay'],
    'headphones': ['Amazon', 'Flipkart', 'eBay', 'Myntra'],
    'monitors': ['Amazon', 'Flipkart', 'eBay'],
    'keyboards': ['Amazon', 'Flipkart', 'eBay'],
    'mouse': ['Amazon', 'Flipkart', 'eBay'],
    'watches': ['Amazon', 'Flipkart', 'eBay', 'Myntra'],
    'cameras': ['Amazon', 'Flipkart', 'eBay'],
    'tablets': ['Amazon', 'Flipkart', 'eBay'],
    'clothing': ['Amazon', 'Myntra', 'Meesho', 'Flipkart'],
    'shoes': ['Amazon', 'Myntra', 'Meesho', 'Flipkart'],
    'bags': ['Amazon', 'Myntra', 'Meesho', 'Flipkart'],
    'books': ['Amazon', 'Flipkart', 'eBay'],
    'chargers': ['Amazon', 'Flipkart', 'eBay', 'Myntra'],
    'cables': ['Amazon', 'Flipkart', 'eBay'],
    'speakers': ['Amazon', 'Flipkart', 'eBay', 'Myntra'],
    'furniture': ['Amazon', 'Flipkart', 'Meesho'],
    'home': ['Amazon', 'Flipkart', 'Meesho'],
    'other': ['Amazon', 'Flipkart', 'eBay'],
};

/** Real-world product pricing database with base prices in INR */
const PRODUCT_PRICE_DATABASE: Record<string, ProductPrice> = {
    // Electronics & Gadgets
    'iphone 15': { basePrice: 75999, range: 5000 },
    'iphone 14': { basePrice: 59999, range: 5000 },
    'iphone 13': { basePrice: 49999, range: 4000 },
    'samsung galaxy s24': { basePrice: 58999, range: 6000 },
    'samsung galaxy s23': { basePrice: 45999, range: 5000 },
    'oneplus 12': { basePrice: 44999, range: 4000 },
    'realme 12': { basePrice: 22999, range: 2000 },
    'poco x6': { basePrice: 18999, range: 2000 },
    'macbook pro': { basePrice: 139999, range: 10000 },
    'macbook air': { basePrice: 119999, range: 8000 },
    'dell xps 13': { basePrice: 89999, range: 8000 },
    'hp pavilion': { basePrice: 49999, range: 5000 },
    'asus vivobook': { basePrice: 54999, range: 5000 },
    'lenovo thinkpad': { basePrice: 64999, range: 6000 },
    'sony wh-ch720': { basePrice: 7499, range: 1500 },
    'bose quietcomfort': { basePrice: 28999, range: 3000 },
    'airpods pro': { basePrice: 19999, range: 2000 },
    'jbl flip 6': { basePrice: 8999, range: 1000 },
    'samsung monitor 27': { basePrice: 22999, range: 2000 },
    'lg monitor 24': { basePrice: 14999, range: 2000 },
    'mechanical keyboard': { basePrice: 6999, range: 2000 },
    'wireless mouse': { basePrice: 1999, range: 1000 },
    'apple watch series 9': { basePrice: 41999, range: 3000 },
    'fitbit versa': { basePrice: 15999, range: 2000 },
    'canon eos r50': { basePrice: 94999, range: 8000 },
    'sony a6400': { basePrice: 74999, range: 6000 },
    'ipad air': { basePrice: 59999, range: 5000 },
    'samsung galaxy tab': { basePrice: 34999, range: 4000 },
    'tv 55 inch': { basePrice: 49999, range: 8000 },
    'air conditioner': { basePrice: 34999, range: 8000 },

    // Fashion & Accessories
    'men shirt': { basePrice: 999, range: 500 },
    'women shirt': { basePrice: 1299, range: 600 },
    'jeans': { basePrice: 1499, range: 500 },
    'nike shoes': { basePrice: 7999, range: 2000 },
    'adidas shoes': { basePrice: 6999, range: 1500 },
    'puma shoes': { basePrice: 5999, range: 1500 },
    'sports shoes': { basePrice: 4999, range: 1500 },
    'casual shoes': { basePrice: 2999, range: 1000 },
    'formal shoes': { basePrice: 3999, range: 1200 },
    'leather belt': { basePrice: 1499, range: 500 },
    'winter jacket': { basePrice: 4999, range: 1500 },
    'summer dress': { basePrice: 1999, range: 800 },
    'track suit': { basePrice: 2999, range: 1000 },
    'sports t-shirt': { basePrice: 999, range: 400 },
    'cotton socks': { basePrice: 399, range: 150 },

    // Books & Stationery
    'book': { basePrice: 399, range: 200 },
    'novels': { basePrice: 349, range: 150 },
    'self help book': { basePrice: 499, range: 200 },
    'technical books': { basePrice: 799, range: 300 },
    'notebook': { basePrice: 199, range: 100 },
    'pen set': { basePrice: 299, range: 100 },
    'pencil box': { basePrice: 499, range: 200 },
    'sketch pad': { basePrice: 599, range: 200 },
    'markers set': { basePrice: 399, range: 150 },
    'calendar': { basePrice: 249, range: 100 },

    // Home & Kitchen
    'coffee maker': { basePrice: 3999, range: 1500 },
    'blender': { basePrice: 2999, range: 1000 },
    'microwave': { basePrice: 8999, range: 2000 },
    'water heater': { basePrice: 12999, range: 3000 },
    'washing machine': { basePrice: 24999, range: 5000 },
    'refrigerator': { basePrice: 34999, range: 8000 },
    'cooking oil set': { basePrice: 1299, range: 500 },
    'non-stick pan': { basePrice: 1999, range: 800 },
    'utensil set': { basePrice: 1499, range: 600 },
    'plates set': { basePrice: 999, range: 400 },
    'bedsheet': { basePrice: 1299, range: 500 },
    'pillow cover': { basePrice: 499, range: 200 },
    'curtains': { basePrice: 1999, range: 800 },
    'table lamp': { basePrice: 1299, range: 500 },
    'wall clock': { basePrice: 999, range: 400 },

    // Furniture
    'gaming chair': { basePrice: 12999, range: 3000 },
    'office desk': { basePrice: 24999, range: 5000 },
    'wooden chair': { basePrice: 8999, range: 2000 },
    'study table': { basePrice: 15999, range: 3000 },
    'bookshelf': { basePrice: 9999, range: 2000 },
    'shoe rack': { basePrice: 2999, range: 1000 },
    'wardrobe': { basePrice: 19999, range: 5000 },
    'bed frame': { basePrice: 14999, range: 3000 },
    'sofa set': { basePrice: 34999, range: 8000 },
    'dining table': { basePrice: 24999, range: 5000 },

    // Beauty & Personal Care
    'face cream': { basePrice: 599, range: 200 },
    'shampoo': { basePrice: 399, range: 150 },
    'conditioner': { basePrice: 399, range: 150 },
    'body lotion': { basePrice: 499, range: 200 },
    'face wash': { basePrice: 349, range: 150 },
    'lipstick': { basePrice: 499, range: 200 },
    'nail polish': { basePrice: 299, range: 100 },
    'perfume': { basePrice: 1299, range: 500 },
    'deodorant': { basePrice: 299, range: 100 },
    'toothbrush': { basePrice: 149, range: 50 },
    'toothpaste': { basePrice: 199, range: 100 },

    // Sports & Fitness
    'dumbbells': { basePrice: 2999, range: 1000 },
    'yoga mat': { basePrice: 1299, range: 500 },
    'resistance bands': { basePrice: 799, range: 300 },
    'skipping rope': { basePrice: 399, range: 150 },
    'cricket bat': { basePrice: 1999, range: 800 },
    'badminton racket': { basePrice: 1499, range: 600 },
    'football': { basePrice: 999, range: 400 },
    'basketball': { basePrice: 1299, range: 500 },
    'tennis racket': { basePrice: 3999, range: 1500 },
    'gym bag': { basePrice: 1999, range: 800 },

    // Groceries & Food
    'rice': { basePrice: 150, range: 50 },
    'flour': { basePrice: 100, range: 30 },
    'salt': { basePrice: 50, range: 20 },
    'sugar': { basePrice: 100, range: 30 },
    'cooking oil': { basePrice: 200, range: 50 },
    'tea': { basePrice: 299, range: 100 },
    'coffee': { basePrice: 349, range: 150 },
    'milk': { basePrice: 100, range: 30 },
    'eggs': { basePrice: 80, range: 20 },
    'butter': { basePrice: 399, range: 150 },

    // Travel & Bags
    'travel bag': { basePrice: 2999, range: 1000 },
    'backpack': { basePrice: 1999, range: 800 },
    'laptop bag': { basePrice: 1499, range: 600 },
    'suitcase': { basePrice: 3999, range: 1500 },
    'shoulder bag': { basePrice: 1299, range: 500 },
    'crossbody bag': { basePrice: 999, range: 400 },
    'school bag': { basePrice: 1299, range: 500 },
    'hand bag': { basePrice: 1999, range: 800 },

    // Gaming
    'gaming headset': { basePrice: 4999, range: 1500 },
    'gaming mouse': { basePrice: 2999, range: 1000 },
    'ps5': { basePrice: 54999, range: 5000 },
    'xbox series x': { basePrice: 49999, range: 5000 },
    'gaming monitor': { basePrice: 24999, range: 5000 },

    // Cables & Chargers
    'phone charger': { basePrice: 1299, range: 500 },
    'usb-c cable': { basePrice: 499, range: 300 },
    'micro usb cable': { basePrice: 399, range: 150 },
    'lightning cable': { basePrice: 599, range: 200 },
    'hdmi cable': { basePrice: 399, range: 150 },
    'power bank': { basePrice: 1999, range: 800 },
    'wireless charger': { basePrice: 1499, range: 600 },

    // Speakers & Audio
    'bluetooth speaker': { basePrice: 5999, range: 2000 },
    'portable speaker': { basePrice: 3999, range: 1500 },
    'home speaker': { basePrice: 8999, range: 2000 },
    'studio monitor': { basePrice: 19999, range: 5000 },
    'earbuds': { basePrice: 2999, range: 1000 },

    // Miscellaneous
    'watch': { basePrice: 4999, range: 1500 },
    'wall art': { basePrice: 999, range: 400 },
    'photo frame': { basePrice: 599, range: 200 },
    'plant pot': { basePrice: 499, range: 200 },
    'mirror': { basePrice: 1299, range: 500 },
    'canvas': { basePrice: 799, range: 300 },
    'umbrella': { basePrice: 499, range: 200 },
    'water bottle': { basePrice: 599, range: 250 },
    'lunch box': { basePrice: 799, range: 300 },
    'thermometer': { basePrice: 299, range: 100 },
};

/** Default price ranges by product category - starting from ₹100 */
const DEFAULT_CATEGORY_PRICES: Record<string, number> = {
    'mobilephones': 10000,
    'smartphones': 10000,
    'laptops': 30000,
    'headphones': 2000,
    'monitors': 10000,
    'keyboards': 1000,
    'mouse': 1000,
    'watches': 1000,
    'cameras': 5000,
    'tablets': 14000,
    'clothing': 500,
    'shoes': 1000,
    'bags': 100,
    'books': 100,
    'chargers': 100,
    'cables': 100,
    'speakers': 1000,
    'furniture': 1000,
    'electronics': 15000,
};

/**
 * Detect product category from search query
 * @param query - User's product search query
 * @returns Product category string
 */
function detectProductCategory(query: string): string {
    const queryLower = query.toLowerCase();

    if (/iphone|samsung galaxy|oneplus|realme|poco/.test(queryLower)) {
        return 'smartphones';
    }
    if (/laptop|macbook|dell|hp|asus|lenovo|thinkpad/.test(queryLower)) {
        return 'laptops';
    }
    if (/headphones|earbuds|airpods|jbl|bose|sony wh/.test(queryLower)) {
        return 'headphones';
    }
    if (/monitor|display/.test(queryLower)) {
        return 'monitors';
    }
    if (/keyboard/.test(queryLower)) {
        return 'keyboards';
    }
    if (/mouse/.test(queryLower)) {
        return 'mouse';
    }
    if (/watch|smartwatch|apple watch|fitbit/.test(queryLower)) {
        return 'watches';
    }
    if (/camera|dslr|eos|sony a/.test(queryLower)) {
        return 'cameras';
    }
    if (/tablet|ipad/.test(queryLower)) {
        return 'tablets';
    }
    if (/shirt|pants|dress|top|jacket|jeans/.test(queryLower)) {
        return 'clothing';
    }
    if (/shoe|sneaker|boot|nike|adidas/.test(queryLower)) {
        return 'shoes';
    }
    if (/bag|backpack/.test(queryLower)) {
        return 'bags';
    }
    if (/book/.test(queryLower)) {
        return 'books';
    }
    if (/charger|charging/.test(queryLower)) {
        return 'chargers';
    }
    if (/cable|cord|usb/.test(queryLower)) {
        return 'cables';
    }
    if (/speaker|bluetooth/.test(queryLower)) {
        return 'speakers';
    }
    if (/chair|table|desk/.test(queryLower)) {
        return 'furniture';
    }
    if (/lamp|pillow|bed/.test(queryLower)) {
        return 'home';
    }
    if (/tv|television|projector|ac|refrigerator/.test(queryLower)) {
        return 'electronics';
    }

    return 'other';
}

/**
 * Get the base price for a product based on exact match or category
 * @param query - Product search query
 * @returns Base price in INR (minimum ₹100)
 */
function getProductBasePrice(query: string): number {
    const queryLower = query.toLowerCase();

    // Try exact product match first
    for (const [product, priceData] of Object.entries(PRODUCT_PRICE_DATABASE)) {
        if (queryLower.includes(product)) {
            return priceData.basePrice;
        }
    }

    // Fallback to category-based pricing
    const category = detectProductCategory(query);
    return Math.max(100, DEFAULT_CATEGORY_PRICES[category] || 100);
}

/**
 * Get available platforms for a product category
 * @param category - Product category
 * @returns Filtered list of available platforms
 */
function getAvailablePlatformsForCategory(category: string): Platform[] {
    const platformNames = PLATFORM_BY_CATEGORY[category] || PLATFORM_BY_CATEGORY['other'];
    return ECOMMERCE_PLATFORMS.filter(p => platformNames.includes(p.name));
}

/**
 * Generate realistic prices across available platforms
 * @param basePrice - Base product price
 * @param category - Product category
 * @param searchQuery - Original search query for URL encoding
 * @returns Array of platform prices
 */
function generatePlatformPrices(basePrice: number, category: string, searchQuery: string): PriceData[] {
    const availablePlatforms = getAvailablePlatformsForCategory(category);
    const platformPrices: PriceData[] = [];

    availablePlatforms.forEach((platform) => {
        // Apply platform-specific price variation
        const platformPrice = Math.round(basePrice * platform.priceVariation);

        // Generate realistic discount (3-15%)
        const shouldHaveDiscount = Math.random() > 0.4;
        const discountPercent = shouldHaveDiscount ? Math.floor(Math.random() * 12) + 3 : 0;
        const originalPrice = shouldHaveDiscount ? Math.round(platformPrice / (1 - discountPercent / 100)) : undefined;

        const encodedSearchQuery = encodeURIComponent(searchQuery);

        platformPrices.push({
            platform: platform.name,
            price: platformPrice,
            originalPrice: originalPrice,
            discount: discountPercent > 0 ? discountPercent : undefined,
            inStock: Math.random() > 0.12,
            rating: parseFloat((Math.random() * 0.8 + 4.0).toFixed(1)),
            reviews: Math.floor(Math.random() * 8000) + 150,
            url: platform.url + encodedSearchQuery,
        });
    });

    return platformPrices.sort((a, b) => a.price - b.price);
}

/**
 * Search for product pricing across platforms
 * @param query - Product search query
 * @returns Product pricing data or null if not found
 */
export function searchProductPrices(query: string): ProductPricing | null {
    if (!query || query.trim().length === 0) {
        return null;
    }

    const category = detectProductCategory(query);
    const basePrice = getProductBasePrice(query);
    const platformPrices = generatePlatformPrices(basePrice, category, query);

    if (platformPrices.length === 0) {
        return null;
    }

    const lowestPrice = platformPrices[0].price;
    const highestPrice = Math.max(...platformPrices.map(p => p.originalPrice || p.price));

    return {
        productName: query.charAt(0).toUpperCase() + query.slice(1),
        prices: platformPrices,
        lowestPrice: lowestPrice,
        highestPrice: highestPrice,
    };
}

/**
 * Format price as Indian Rupees currency
 * @param price - Price in paisa
 * @returns Formatted price string (e.g., "₹1,234")
 */
export function formatPrice(price: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
    }).format(price);
}
