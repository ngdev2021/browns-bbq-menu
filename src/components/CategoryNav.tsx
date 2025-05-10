import React, { useState, useEffect } from 'react';

interface CategoryNavProps {
  menuItems: any[];
  onSelectCategory: (category: string) => void;
}

interface CategoryIcon {
  [key: string]: JSX.Element;
}

const CategoryNav: React.FC<CategoryNavProps> = ({ menuItems, onSelectCategory }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>(['all']);

  // Extract unique categories from menu items
  useEffect(() => {
    if (menuItems && menuItems.length > 0) {
      // Create a unique list of categories without using Set spread operator
      const categorySet = new Set(menuItems.map(item => item.category));
      const uniqueCategories = ['all', ...Array.from(categorySet)];
      setCategories(uniqueCategories);
    }
  }, [menuItems]);

  // Category icons - simplified for now, can be replaced with proper SVG icons
  const categoryIcons: CategoryIcon = {
    all: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    burgers: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 6a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 6a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
      </svg>
    ),
    tacos: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
      </svg>
    ),
    drinks: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.707.293l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 8l-3.293-3.293A1 1 0 0112 4z" clipRule="evenodd" />
      </svg>
    ),
    sides: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
      </svg>
    ),
    desserts: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
      </svg>
    ),
  };

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    onSelectCategory(category);
  };

  return (
    <div className="py-6">
      <h2 className="text-xl font-bold mb-4">Categories</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`w-full aspect-square rounded-xl flex flex-col items-center justify-center transition-all ${activeCategory === category ? 'bg-teal-500 ring-4 ring-teal-400' : 'bg-charcoal-800 hover:bg-charcoal-700'}`}
          >
            <div className="mb-2">
              {categoryIcons[category] || categoryIcons.all}
            </div>
            <span className="capitalize">{category}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryNav;