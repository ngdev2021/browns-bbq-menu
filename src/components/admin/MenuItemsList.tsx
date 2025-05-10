import React, { useState } from 'react';

interface MenuItemsListProps {
  items: any[];
  onEditItem: (item: any) => void;
  onDeleteItem: (id: string) => void;
}

const MenuItemsList: React.FC<MenuItemsListProps> = ({ items, onEditItem, onDeleteItem }) => {
  const [filter, setFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Get unique categories
  const categories = ['all', ...new Set(items.map(item => item.category))];

  // Filter items based on search and category
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(filter.toLowerCase()) || 
                          item.description.toLowerCase().includes(filter.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search items..."
          className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white mb-2"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        
        <select
          className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>
      
      <div className="space-y-2">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <div 
              key={item.id} 
              className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 cursor-pointer flex justify-between items-center"
            >
              <div className="flex items-center" onClick={() => onEditItem(item)}>
                {item.image_url && (
                  <div className="w-10 h-10 rounded overflow-hidden mr-3 bg-gray-600 flex-shrink-0">
                    <img 
                      src={item.image_url} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                      }}
                    />
                  </div>
                )}
                <div>
                  <h3 className="font-medium text-white">{item.name}</h3>
                  <p className="text-xs text-gray-400">
                    ${item.price.toFixed(2)} • {item.category}
                    {item.featured && <span className="ml-2 text-amber-500">★ Featured</span>}
                  </p>
                </div>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteItem(item.id);
                }}
                className="text-red-500 hover:text-red-400 p-1"
                title="Delete Item"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-400">
            No items found
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuItemsList;
