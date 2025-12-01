import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface RecentSearch {
  id: string;
  product_name: string;
  category: string;
  created_at: string;
  lowestPrice?: number;
}

interface RecentSearchesProps {
  onSearchSelect: (productName: string) => void;
}

const popularProducts = [
  'iPhone 15',
  'Samsung Galaxy S24',
  'Sony Headphones',
  'MacBook Pro',
  'Gaming Laptop',
  'Wireless Mouse',
  'Mechanical Keyboard',
  'Smart Watch',
  'USB-C Cable',
  'Portable Speaker',
];

export default function RecentSearches({ onSearchSelect }: RecentSearchesProps) {
  const [searches, setSearches] = useState<RecentSearch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = async () => {
    try {
      const { data: searchData, error } = await supabase
        .from('product_searches')
        .select('id, product_name, category, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      if (searchData) {
        const searchesWithPrices = await Promise.all(
          searchData.map(async (search) => {
            const { data: priceData } = await supabase
              .from('price_comparisons')
              .select('price')
              .eq('search_id', search.id)
              .eq('available', true)
              .order('price', { ascending: true })
              .limit(1)
              .maybeSingle();

            return {
              ...search,
              lowestPrice: priceData?.price,
            };
          })
        );

        setSearches(searchesWithPrices);
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || searches.length === 0) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Recent Searches</h3>
        </div>
        <div className="space-y-2">
          {searches.map((search) => (
            <button
              key={search.id}
              onClick={() => onSearchSelect(search.product_name)}
              className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{search.product_name}</p>
                  <p className="text-sm text-gray-600">{search.category}</p>
                </div>
                {search.lowestPrice && (
                  <div className="text-right">
                    <p className="text-sm text-gray-500">from</p>
                    <p className="font-semibold text-green-600">
                      ₹{search.lowestPrice.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Clock className="w-6 h-6 text-blue-600" />
          Popular Products
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {popularProducts.map((product, idx) => (
            <button
              key={idx}
              onClick={() => onSearchSelect(product)}
              className="p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              {product}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
