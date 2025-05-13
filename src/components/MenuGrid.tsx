import React, { useState, useEffect } from 'react';
import MenuItemCard from './MenuItemCard';
import { MenuItem } from '../lib/menuService';

// Using MenuItem from menuService

interface MenuGridProps {
  items: MenuItem[];
  category?: string;
  searchQuery?: string;
  activeFilters?: string[];
  onAddToCart: (item: MenuItem, selectedOptions?: any[], specialInstructions?: string) => void;
}

const MenuGrid: React.FC<MenuGridProps> = ({ 
  items, 
  category = 'all', 
  searchQuery = '', 
  activeFilters = [],
  onAddToCart 
}) => {
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);

  // Filter items based on category, search query, and active filters
  useEffect(() => {
    // Create a stable reference to the items array to prevent infinite loops
    const filterItems = () => {
      let result = [...items];
      
      // Filter by category
      if (category && category !== 'all') {
        result = result.filter(item => item.category === category);
      }
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter(item => {
          return (
            item.name.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query) ||
            item.tags.some(tag => tag.toLowerCase().includes(query))
          );
        });
      }
      
      // Filter by dietary preferences
      if (activeFilters.length > 0) {
        result = result.filter(item => {
          // Check if item has all the active filters
          return activeFilters.every(filter => {
            // Special case for price filter
            if (filter === 'under-10') {
              return item.price < 10;
            }
            // For other filters, check if the tag exists
            return item.tags.includes(filter);
          });
        });
      }
      
      return result;
    };
    
    // Update filtered items
    setFilteredItems(filterItems());
    
    // This effect should only run when the dependencies actually change
    // Using JSON.stringify to create a stable reference for comparison
  }, [JSON.stringify(items), category, searchQuery, JSON.stringify(activeFilters)]);
  

  if (filteredItems.length === 0) {
    return (
      <div className="text-center py-12 bg-charcoal-800 rounded-lg">
        <svg className="w-16 h-16 mx-auto text-charcoal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="mt-4 text-xl font-semibold">No items found</h3>
        <p className="mt-2 text-charcoal-400">Try adjusting your filters or search query</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {filteredItems.map(item => (
        <MenuItemCard 
          key={item.id} 
          item={item} 
          menuItems={items}
          onAddToCart={(item, selectedOptions, specialInstructions) => 
            onAddToCart(item, selectedOptions, specialInstructions)
          } 
        />
      ))}
    </div>
  );
};

export default MenuGrid;