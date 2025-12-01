import { TrendingDown, Star, ShoppingCart, ExternalLink } from 'lucide-react';
import { formatPrice, ProductPricing } from '../lib/mockPrices';

interface ComparisonResultsProps {
  results: ProductPricing;
}

/**
 * Displays price comparison results across multiple platforms
 * Shows best deals, savings, and platform-specific pricing
 */
export default function ComparisonResults({ results }: ComparisonResultsProps) {
  if (!results?.prices?.length) {
    return (
      <div className="max-w-4xl mx-auto mt-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <p className="text-yellow-800">No pricing data available for this product.</p>
      </div>
    );
  }

  const savingsAmount = results.highestPrice - results.lowestPrice;
  const savingsPercent = Math.round((savingsAmount / results.highestPrice) * 100);
  const bestDealPlatform = results.prices[0];

  return (
    <div className="max-w-4xl mx-auto mt-12">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header with Best Price */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 px-6 py-8">
          <h2 className="text-3xl font-bold text-white mb-2">{results.productName}</h2>
          <div className="flex items-baseline gap-4 flex-wrap">
            <div>
              <p className="text-blue-100 text-sm">Best Price</p>
              <p className="text-4xl font-bold text-white">{formatPrice(results.lowestPrice)}</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
              <p className="text-blue-100 text-sm">Potential Savings</p>
              <p className="text-2xl font-bold text-white">{formatPrice(savingsAmount)} ({savingsPercent}%)</p>
            </div>
          </div>
        </div>

        {/* Platform Prices */}
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-6 text-gray-800">Price Comparison Across Platforms</h3>
          <div className="space-y-4">
            {results.prices.map((priceData, index) => (
              <PlatformPriceCard key={index} priceData={priceData} />
            ))}
          </div>

          {/* Best Deal Summary */}
          <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-semibold flex items-center gap-2">
              <TrendingDown className="w-5 h-5" />
              Best Deal: {bestDealPlatform.platform} at {formatPrice(results.lowestPrice)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Individual platform price card component
 */
interface PlatformPriceCardProps {
  priceData: any;
}

function PlatformPriceCard({ priceData }: PlatformPriceCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-lg text-gray-900">{priceData.platform}</h4>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-gray-600">{priceData.rating}</span>
            </div>
            <span className="text-sm text-gray-500">({priceData.reviews.toLocaleString()} reviews)</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">{formatPrice(priceData.price)}</p>
          {priceData.originalPrice && priceData.originalPrice > priceData.price && (
            <p className="text-sm text-gray-500 line-through">{formatPrice(priceData.originalPrice)}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {priceData.discount && (
            <span className="bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
              {priceData.discount}% OFF
            </span>
          )}
          <span className={`text-sm font-medium px-3 py-1 rounded-full ${priceData.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {priceData.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
        <a 
          href={priceData.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
        >
          <ShoppingCart className="w-4 h-4" />
          View Deal
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
