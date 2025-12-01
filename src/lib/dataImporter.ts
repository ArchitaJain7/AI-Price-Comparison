/**
 * Data importer for loading real-world e-commerce data
 * Supports CSV, JSON, and API imports
 */

import { PlatformProduct, batchImportProducts } from './database';

/**
 * Import products from JSON file
 * @param jsonData - JSON array of products
 */
export function importFromJSON(jsonData: string): void {
    try {
        const products = JSON.parse(jsonData) as PlatformProduct[];
        batchImportProducts(products);
        console.log(`Successfully imported ${products.length} products from JSON`);
    } catch (err) {
        console.error('JSON import error:', err);
        throw new Error('Invalid JSON format');
    }
}

/**
 * Import products from CSV
 * CSV format: productName,platform,price,originalPrice,discount,inStock,rating,reviews,url,category
 * @param csvData - CSV string
 */
export function importFromCSV(csvData: string): void {
    try {
        const lines = csvData.split('\n').filter((line) => line.trim());
        const products: PlatformProduct[] = [];

        // Skip header if present
        const startIndex = lines[0].includes('productName') ? 1 : 0;

        for (let i = startIndex; i < lines.length; i++) {
            const parts = lines[i].split(',');
            if (parts.length < 9) continue;

            const product: PlatformProduct = {
                id: `${Date.now()}-${i}`,
                productName: parts[0].trim(),
                platform: parts[1].trim(),
                price: Number(parts[2].trim()),
                originalPrice: parts[3].trim() ? Number(parts[3].trim()) : undefined,
                discount: parts[4].trim() ? Number(parts[4].trim()) : undefined,
                inStock: parts[5].trim().toLowerCase() === 'true',
                rating: Number(parts[6].trim()),
                reviews: Number(parts[7].trim()),
                url: parts[8].trim(),
                category: parts[9]?.trim() || 'other',
                timestamp: Date.now(),
            };

            products.push(product);
        }

        batchImportProducts(products);
        console.log(`Successfully imported ${products.length} products from CSV`);
    } catch (err) {
        console.error('CSV import error:', err);
        throw new Error('Invalid CSV format');
    }
}

/**
 * Create sample product data for testing
 */
export function generateSampleData(): PlatformProduct[] {
    const platforms = ['Amazon', 'Flipkart', 'eBay', 'Meesho', 'Myntra'];
    const products = [
        { name: 'iPhone 15', category: 'smartphones', basePrice: 75999 },
        { name: 'Samsung Galaxy S24', category: 'smartphones', basePrice: 58999 },
        { name: 'MacBook Pro', category: 'laptops', basePrice: 139999 },
        { name: 'Nike Shoes', category: 'shoes', basePrice: 7999 },
        { name: 'Coffee Maker', category: 'home', basePrice: 3999 },
    ];

    const sampleData: PlatformProduct[] = [];

    for (const product of products) {
        for (const platform of platforms) {
            const discount = Math.floor(Math.random() * 15) + 3;
            const price = Math.round(product.basePrice * (0.85 + Math.random() * 0.2));

            sampleData.push({
                id: `${product.name}-${platform}-${Date.now()}`,
                productName: product.name,
                platform,
                price,
                originalPrice: Math.round(price / (1 - discount / 100)),
                discount: Math.random() > 0.3 ? discount : undefined,
                inStock: Math.random() > 0.15,
                rating: parseFloat((Math.random() * 0.8 + 4.0).toFixed(1)),
                reviews: Math.floor(Math.random() * 8000) + 150,
                url: `https://${platform.toLowerCase()}.com/search?q=${product.name}`,
                category: product.category,
                timestamp: Date.now(),
            });
        }
    }

    return sampleData;
}

/**
 * Load sample data into database
 */
export function loadSampleData(): void {
    try {
        const sampleData = generateSampleData();
        batchImportProducts(sampleData);
        console.log('Sample data loaded successfully');
    } catch (err) {
        console.error('Sample data load error:', err);
    }
}
