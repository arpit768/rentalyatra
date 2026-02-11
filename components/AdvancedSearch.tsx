import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import type { VehicleType } from '../types';

export interface SearchFilters {
  query: string;
  location: string;
  type: string;
  minPrice: number;
  maxPrice: number;
  sortBy: 'price-asc' | 'price-desc' | 'rating' | 'popularity';
  available: boolean;
}

interface AdvancedSearchProps {
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
  locations: string[];
  types: VehicleType[];
}

export default function AdvancedSearch({
  filters,
  onFilterChange,
  locations,
  types,
}: AdvancedSearchProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (key: keyof SearchFilters, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    onFilterChange({
      query: '',
      location: 'all',
      type: 'all',
      minPrice: 0,
      maxPrice: 50000,
      sortBy: 'popularity',
      available: true,
    });
  };

  const activeFiltersCount = [
    filters.query,
    filters.location !== 'all',
    filters.type !== 'all',
    filters.minPrice > 0,
    filters.maxPrice < 50000,
    filters.sortBy !== 'popularity',
  ].filter(Boolean).length;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={filters.query}
            onChange={(e) => handleChange('query', e.target.value)}
            placeholder="Search vehicles by name, features..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
            showAdvanced || activeFiltersCount > 0
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="bg-white text-blue-600 px-2 py-0.5 rounded-full text-xs font-bold">
              {activeFiltersCount}
            </span>
          )}
        </button>
        {activeFiltersCount > 0 && (
          <button
            onClick={resetFilters}
            className="px-4 py-3 text-gray-600 hover:text-gray-900 transition-colors"
            title="Reset filters"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="pt-4 border-t border-gray-200 space-y-4 animate-slideDown">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <select
                value={filters.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Locations</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleChange('sortBy', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="popularity">Popularity</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability
              </label>
              <div className="flex items-center h-[42px]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.available}
                    onChange={(e) => handleChange('available', e.target.checked)}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Available only</span>
                </label>
              </div>
            </div>
          </div>

          {/* Price Range Slider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Price Range (NPR per day)
            </label>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-xs text-gray-600 mb-1">Min Price</label>
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    step="500"
                    value={filters.minPrice}
                    onChange={(e) => handleChange('minPrice', Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-600 mb-1">Max Price</label>
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    step="500"
                    value={filters.maxPrice}
                    onChange={(e) => handleChange('maxPrice', Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => handleChange('minPrice', Number(e.target.value))}
                    min="0"
                    max={filters.maxPrice}
                    className="w-24 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-600">to</span>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => handleChange('maxPrice', Number(e.target.value))}
                    min={filters.minPrice}
                    max="50000"
                    className="w-24 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <span className="text-gray-600 font-medium">
                  NPR {filters.minPrice.toLocaleString()} - {filters.maxPrice.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Hook for managing search filters
export function useSearchFilters(initialFilters?: Partial<SearchFilters>) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    location: 'all',
    type: 'all',
    minPrice: 0,
    maxPrice: 50000,
    sortBy: 'popularity',
    available: true,
    ...initialFilters,
  });

  return { filters, setFilters };
}
