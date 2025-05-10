import React, { useState, useEffect } from 'react';

interface SearchFilterProps {
  onSearch: (query: string) => void;
  onToggleFilter: (filter: string) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ onSearch, onToggleFilter }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Dietary filters
  const dietaryFilters = [
    { id: 'gluten-free', label: 'Gluten-Free', icon: '🌾' },
    { id: 'vegan', label: 'Vegan', icon: '🌱' },
    { id: 'vegetarian', label: 'Vegetarian', icon: '🥗' },
    { id: 'spicy', label: 'Spicy', icon: '🔥' },
    { id: 'under-10', label: 'Under $10', icon: '💰' },
  ];

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Trigger search when debounced query changes
  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  // Handle filter toggle
  const handleFilterToggle = (filterId: string) => {
    setActiveFilters(prev => {
      if (prev.includes(filterId)) {
        const newFilters = prev.filter(id => id !== filterId);
        onToggleFilter(filterId); // Notify parent
        return newFilters;
      } else {
        onToggleFilter(filterId); // Notify parent
        return [...prev, filterId];
      }
    });
  };

  return (
    <div className="mb-8">
      {/* Search input */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-charcoal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="search"
          className="block w-full pl-10 pr-3 py-3 border border-charcoal-600 rounded-lg bg-charcoal-800 text-white placeholder-charcoal-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="Search for vegan, under $8..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search menu items"
        />
      </div>

      {/* Dietary filters */}
      <div className="flex flex-wrap gap-2">
        {dietaryFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => handleFilterToggle(filter.id)}
            className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors ${activeFilters.includes(filter.id) ? 'bg-teal-500 text-white' : 'bg-charcoal-800 text-charcoal-300 hover:bg-charcoal-700'}`}
            aria-pressed={activeFilters.includes(filter.id)}
          >
            <span>{filter.icon}</span>
            <span>{filter.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchFilter;