import { useState, useRef } from 'react';
import { Search, Upload, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string, imageFile?: File) => void;
  loading: boolean;
}

export default function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() || selectedImage) {
      onSearch(query.trim(), selectedImage || undefined);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products (e.g., iPhone 15, Nike shoes, Samsung TV...)"
              className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading || (!query.trim() && !selectedImage)}
            className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Search
          </button>
        </div>

        <div className="flex items-center gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
            id="image-upload"
            disabled={loading}
          />
          <label
            htmlFor="image-upload"
            className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 cursor-pointer transition-colors"
          >
            <Upload className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-600">
              {selectedImage ? 'Change Image' : 'Upload Product Image'}
            </span>
          </label>

          {imagePreview && (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Selected product"
                className="h-16 w-16 object-cover rounded-lg border-2 border-gray-200"
              />
              <button
                type="button"
                onClick={clearImage}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="text-xs text-gray-600 mt-3 space-y-1">
          <p className="font-medium">Search Tips:</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li>Type the exact product name (e.g., "iPhone 15 Pro", "Sony WH1000XM5")</li>
            <li>Include brand and model for accurate pricing</li>
            <li>Our system automatically searches across Amazon, Flipkart, Meesho, Myntra, and Snapdeal</li>
          </ul>
        </div>
      </form>
    </div>
  );
}
