import { useState, useEffect } from 'react';
import { Search, AlertCircle, Upload, TrendingDown } from 'lucide-react';
import SearchBar from './components/SearchBar';
import ComparisonResults from './components/ComparisonResults';
import RecentSearches from './components/RecentSearches';
import ProductFiltersComponent from './components/ProductFilters';
import { searchProduct } from './lib/productSearch';
import { clearExpiredCache } from './lib/cacheManager';
import { trackSearch, type ProductFilters } from './lib/analytics';
import { applyFiltersToResults } from './lib/apiClient';
import type { ProductPricing } from './lib/mockPrices';

function App() {
  const [searchResults, setSearchResults] = useState<ProductPricing | null>(null);
  const [filteredResults, setFilteredResults] = useState<ProductPricing | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProductFilters>({});
  const [searchStartTime, setSearchStartTime] = useState<number>(0);

  useEffect(() => {
    clearExpiredCache();
  }, []);

  /**
   * Handle product search with text query or image upload
   */
  const handleProductSearch = async (query: string, imageFile?: File) => {
    if (!query.trim() && !imageFile) {
      setErrorMessage('Please enter a product name or upload an image');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSearchStartTime(Date.now());
    setFilters({}); // Reset filters for new search

    try {
      let imageDataUrl: string | undefined = undefined;

      if (imageFile) {
        try {
          imageDataUrl = await convertImageToBase64(imageFile);
        } catch (err) {
          console.warn('Image conversion failed, proceeding with text search:', err);
        }
      }

      // Use query directly, filters will be applied after search
      const results = await searchProduct(query.trim(), imageDataUrl);
      setSearchResults(results);
      setFilteredResults(results);

      // Track analytics
      const duration = Date.now() - searchStartTime;
      trackSearch({
        query: query.trim(),
        timestamp: Date.now(),
        duration,
        resultCount: results?.prices.length || 0,
        filters: {},
        success: true,
      });
    } catch (err) {
      console.error('Search error:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to search products. Please try again.';
      setErrorMessage(errorMsg);
      setSearchResults(null);
      setFilteredResults(null);

      // Track failed search
      trackSearch({
        query: query.trim(),
        timestamp: Date.now(),
        duration: Date.now() - searchStartTime,
        resultCount: 0,
        filters: {},
        success: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle filter application
   */
  const handleApplyFilters = () => {
    if (!searchResults) return;

    const filtered = {
      ...searchResults,
      prices: applyFiltersToResults(searchResults.prices, filters),
    };

    setFilteredResults(filtered);
  };

  /**
   * Clear filters
   */
  const handleClearFilters = () => {
    setFilters({});
    setFilteredResults(searchResults);
  };

  /**
   * Convert image file to base64 data URL
   */
  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('Please upload a valid image file'));
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        reject(new Error('Image file is too large. Max size: 5MB'));
        return;
      }

      const fileReader = new FileReader();

      fileReader.onload = () => {
        resolve(fileReader.result as string);
      };

      fileReader.onerror = () => {
        reject(new Error('Failed to read image file'));
      };

      try {
        fileReader.readAsDataURL(file);
      } catch (err) {
        reject(new Error('Error processing image'));
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Search className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            PriceScout
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Scan or search for any product and instantly compare prices across Amazon, Flipkart, Meesho, and more
          </p>
        </header>

        {/* Search Bar */}
        <SearchBar onSearch={handleProductSearch} loading={isLoading} />

        {/* Error Alert */}
        {errorMessage && (
          <div className="mt-6 max-w-3xl mx-auto bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-700 text-sm">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="mt-12 text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
            <p className="mt-4 text-gray-600 text-lg">Scanning product across platforms...</p>
          </div>
        )}

        {/* Filters - Show after search */}
        {!isLoading && searchResults && (
          <ProductFiltersComponent
            filters={filters}
            onFiltersChange={setFilters}
            onApply={handleApplyFilters}
            onClear={handleClearFilters}
          />
        )}

        {/* Results Section */}
        {!isLoading && filteredResults && (
          <ComparisonResults results={filteredResults} />
        )}

        {/* Recent Searches */}
        {!isLoading && !searchResults && (
          <RecentSearches onSearchSelect={(productName) => handleProductSearch(productName)} />
        )}

        {/* Feature Cards */}
        {!isLoading && !searchResults && (
          <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <FeatureCard
              icon={<Search className="w-8 h-8 text-blue-600" />}
              title="Search Products"
              description="Type any product name to find the best deals"
              bgColor="bg-blue-100"
            />
            <FeatureCard
              icon={<Upload className="w-8 h-8 text-green-600" />}
              title="Scan Products"
              description="Upload an image to identify and compare prices"
              bgColor="bg-green-100"
            />
            <FeatureCard
              icon={<TrendingDown className="w-8 h-8 text-purple-600" />}
              title="Compare & Save"
              description="Get instant price comparisons and deals"
              bgColor="bg-purple-100"
            />
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Feature Card Component
 */
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
}

function FeatureCard({ icon, title, description, bgColor }: FeatureCardProps) {
  return (
    <div className="text-center p-6 bg-white rounded-xl shadow-sm">
      <div className={`w-16 h-16 ${bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
        {icon}
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}

export default App;
