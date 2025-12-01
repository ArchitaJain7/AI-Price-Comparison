import { X } from 'lucide-react';
import type { ProductFilters } from '../lib/analytics';

interface ProductFiltersProps {
    filters: ProductFilters;
    onFiltersChange: (filters: ProductFilters) => void;
    onApply: () => void;
    onClear: () => void;
}

/**
 * Product filter component for refining search results
 */
export default function ProductFiltersComponent({
    filters,
    onFiltersChange,
    onApply,
    onClear,
}: ProductFiltersProps) {
    const handlePriceMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFiltersChange({
            ...filters,
            priceMin: e.target.value ? Number(e.target.value) : undefined,
        });
    };

    const handlePriceMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFiltersChange({
            ...filters,
            priceMax: e.target.value ? Number(e.target.value) : undefined,
        });
    };

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFiltersChange({
            ...filters,
            color: e.target.value || undefined,
        });
    };

    const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFiltersChange({
            ...filters,
            size: e.target.value || undefined,
        });
    };

    const handleBrandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFiltersChange({
            ...filters,
            brand: e.target.value || undefined,
        });
    };

    const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFiltersChange({
            ...filters,
            rating: e.target.value ? Number(e.target.value) : undefined,
        });
    };

    const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFiltersChange({
            ...filters,
            inStock: e.target.checked,
        });
    };

    const hasActiveFilters =
        filters.priceMin ||
        filters.priceMax ||
        filters.color ||
        filters.size ||
        filters.brand ||
        filters.rating ||
        filters.inStock;

    return (
        <div className="max-w-3xl mx-auto mt-8 bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Filter Results</h3>
                {hasActiveFilters && (
                    <button
                        onClick={onClear}
                        className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
                    >
                        <X className="w-4 h-4" />
                        Clear All
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Price Range */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price Range (₹)
                    </label>
                    <div className="flex gap-4">
                        <input
                            type="number"
                            placeholder="Min"
                            value={filters.priceMin || ''}
                            onChange={handlePriceMinChange}
                            className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            value={filters.priceMax || ''}
                            onChange={handlePriceMaxChange}
                            className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Color */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Color
                    </label>
                    <input
                        type="text"
                        placeholder="e.g., Black, White, Blue"
                        value={filters.color || ''}
                        onChange={handleColorChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Size */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Size
                    </label>
                    <input
                        type="text"
                        placeholder="e.g., S, M, L, 256GB"
                        value={filters.size || ''}
                        onChange={handleSizeChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Brand */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Brand
                    </label>
                    <input
                        type="text"
                        placeholder="e.g., Samsung, Sony, Apple"
                        value={filters.brand || ''}
                        onChange={handleBrandChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Min Rating */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Rating
                    </label>
                    <input
                        type="number"
                        min="1"
                        max="5"
                        step="0.5"
                        placeholder="e.g., 4.0"
                        value={filters.rating || ''}
                        onChange={handleRatingChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* In Stock */}
                <div className="flex items-end">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={filters.inStock || false}
                            onChange={handleStockChange}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">In Stock Only</span>
                    </label>
                </div>
            </div>

            <div className="mt-6 flex gap-4">
                <button
                    onClick={onApply}
                    className="flex-1 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                    Apply Filters
                </button>
            </div>
        </div>
    );
}
