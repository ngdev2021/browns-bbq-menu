import React, { useState, useEffect } from 'react';
import { getMenuItemsSync, getDigitalMenuSettingsSync, getFeaturedMenuItemsSync, MenuItem } from '../lib/menuService';
import { getMenuItemImagePath, getCacheBustedImageUrl } from '../lib/imageUtils';

interface DigitalMenuBoardProps {
  view?: 'menu' | 'specials' | 'combos';
}

const DigitalMenuBoard: React.FC<DigitalMenuBoardProps> = ({ view = 'menu' }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentSpecialIndex, setCurrentSpecialIndex] = useState(0);
  
  // Featured items for rotating specials - use sync versions for initial render
  const [menuItems, setMenuItems] = useState<MenuItem[]>(getMenuItemsSync());
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>(getFeaturedMenuItemsSync());
  const [settings, setSettings] = useState(getDigitalMenuSettingsSync());
  
  // Refresh menu data when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch data from the server
        const fetchMenuItems = import('../lib/menuService').then(module => module.getMenuItems());
        const fetchFeaturedItems = import('../lib/menuService').then(module => module.getFeaturedMenuItems());
        const fetchSettings = import('../lib/menuService').then(module => module.getDigitalMenuSettings());
        
        const [menuItemsData, featuredItemsData, settingsData] = await Promise.all([
          fetchMenuItems,
          fetchFeaturedItems,
          fetchSettings
        ]);
        
        setMenuItems(menuItemsData);
        setFeaturedItems(featuredItemsData);
        setSettings(settingsData);
      } catch (error) {
        console.error('Failed to load data from server:', error);
      }
    };
    
    loadData();
  }, []);
  
  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Rotate through specials based on settings
  useEffect(() => {
    const specialsTimer = setInterval(() => {
      setCurrentSpecialIndex(prevIndex => 
        prevIndex === featuredItems.length - 1 ? 0 : prevIndex + 1
      );
    }, settings.rotationInterval * 1000);
    
    return () => clearInterval(specialsTimer);
  }, [featuredItems.length, settings.rotationInterval]);
  
  // Group menu items by category
  const categories = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);
  
  // Format categories for display
  const formatCategory = (category: string): string => {
    switch(category) {
      case 'plates': return 'BBQ Plates';
      case 'sandwiches': return 'BBQ Sandwiches';
      case 'sides': return 'Side Items';
      case 'combos': return 'Combo Specials';
      default: return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };
  
  // Get day of week for daily special
  const getDayOfWeek = (): string => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[currentTime.getDay()];
  };
  
  // Current special
  const currentSpecial = featuredItems[currentSpecialIndex] || (featuredItems.length > 0 ? featuredItems[0] : null);

  // Helper function to render today's special
  const renderTodaySpecial = (): JSX.Element | null => {
    if (!currentSpecial) return null;
    
    return (
      <div className="mb-8 bg-gradient-to-r from-amber-900 to-amber-800 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-3xl font-bold text-white">{getDayOfWeek()} Special</h2>
          <div className="animate-pulse bg-red-600 text-white px-3 py-1 rounded-full font-bold">
            TODAY ONLY
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="relative w-32 h-32 rounded-lg overflow-hidden mr-4">
            <img 
              src={getCacheBustedImageUrl(getMenuItemImagePath(currentSpecial.image_url))} 
              alt={currentSpecial.name}
              onError={(e) => {
                // Fall back to placeholder if image fails to load
                (e.target as HTMLImageElement).src = '/images/placeholder-food.jpg';
              }}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-amber-300">{currentSpecial.name}</h3>
            <p className="text-gray-300">{currentSpecial.description}</p>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-3xl font-bold text-amber-300">
                ${currentSpecial.price.toFixed(2)}
              </span>
              <div className="bg-amber-700 text-white px-3 py-1 rounded-lg">
                Limited Time
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render the full menu view with all categories
  const renderFullMenuView = (): JSX.Element => (
    <>
      {/* Today's Special */}
      {currentSpecial && renderTodaySpecial()}
      
      {/* Menu Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(categories).map(([category, items]) => (
          <div key={category} className="bg-gray-900 p-4 rounded-lg">
            <h2 className="text-2xl font-bold text-amber-500 mb-3 border-b border-amber-700 pb-2">
              {formatCategory(category)}
            </h2>
            <div className="space-y-4">
              {items.map((item: MenuItem) => (
                <div key={item.id} className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-white">{item.name}</h3>
                    <p className="text-gray-300 text-sm">{item.description}</p>
                  </div>
                  <div className="text-2xl font-bold text-amber-500">
                    ${item.price.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );

  // Render just the specials view
  const renderSpecialsView = (): JSX.Element => {
    // Get all featured items
    const specialItems = menuItems.filter(item => item.featured);
    
    return (
      <>
        {/* Today's Featured Special */}
        {currentSpecial && renderTodaySpecial()}
        
        {/* All Specials */}
        <div className="mt-8">
          <h2 className="text-3xl font-bold text-amber-500 mb-6 text-center">All Current Specials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {specialItems.map((special: MenuItem) => (
              <div key={special.id} className="bg-gradient-to-r from-amber-900 to-amber-800 p-4 rounded-lg flex">
                <div className="relative w-32 h-32 rounded-lg overflow-hidden mr-4 flex-shrink-0">
                  <img 
                    src={getCacheBustedImageUrl(getMenuItemImagePath(special.image_url))} 
                    alt={special.name}
                    onError={(e) => {
                      // Fall back to placeholder if image fails to load
                      (e.target as HTMLImageElement).src = '/images/placeholder-food.jpg';
                    }}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-amber-300">{special.name}</h3>
                  <p className="text-gray-300 text-sm">{special.description}</p>
                  <div className="mt-2">
                    <span className="text-2xl font-bold text-amber-300">
                      ${special.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  // Render just the combos view
  const renderCombosView = (): JSX.Element => {
    // Get all combo items
    const comboItems = menuItems.filter(item => item.category === 'combos');
    
    return (
      <>
        <div className="bg-gradient-to-r from-red-900 to-amber-900 p-6 rounded-lg mb-8">
          <h2 className="text-3xl font-bold text-white mb-2 text-center">BBQ Combo Deals</h2>
          <p className="text-amber-300 text-xl text-center mb-6">Mix & Match Your Favorites</p>
          
          <div className="space-y-6">
            {comboItems.map((combo: MenuItem) => (
              <div key={combo.id} className="bg-black bg-opacity-50 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-amber-300">{combo.name}</h3>
                    <p className="text-gray-300">{combo.description}</p>
                  </div>
                  <div className="text-3xl font-bold text-amber-300">
                    ${combo.price.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-900 p-4 rounded-lg">
          <h2 className="text-2xl font-bold text-amber-500 mb-3 text-center">
            All Combo Meals Include
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-gray-800 p-3 rounded-lg">
              <p className="text-white">Two 5 oz. Sides</p>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg">
              <p className="text-white">Cornbread or Roll</p>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg">
              <p className="text-white">BBQ Sauce</p>
            </div>
          </div>
        </div>
      </>
    );
  };

  // Render different content based on the selected view
  const renderContent = (): JSX.Element => {
    switch(view) {
      case 'specials':
        return renderSpecialsView();
      case 'combos':
        return renderCombosView();
      case 'menu':
      default:
        return renderFullMenuView();
    }
  };

  return (
    <div className="w-full bg-black text-white p-6 rounded-lg shadow-lg border-2 border-amber-600">
      {/* Header */}
      <div className="flex justify-between items-center border-b-4 border-amber-600 pb-3 mb-6">
        <div>
          <h1 className="text-5xl font-bold text-amber-500 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            Brown's Bar-B-Cue
          </h1>
          <p className="text-amber-300 text-xl">Authentic BBQ Since 1985</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-mono bg-amber-800 inline-block px-3 py-1 rounded-lg">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
          <p className="text-amber-300 text-xl mt-1">Order at Counter</p>
        </div>
      </div>
      
      {/* Dynamic Content Based on View */}
      {renderContent()}
      
      {/* Footer */}
      <div className="mt-8 border-t-4 border-amber-600 pt-4 text-center">
        <div className="flex justify-center space-x-4 mb-3">
          <div className="bg-amber-800 px-3 py-1 rounded-full text-white font-bold">🔥 SPICY</div>
          <div className="bg-amber-800 px-3 py-1 rounded-full text-white font-bold">🥜 CONTAINS NUTS</div>
          <div className="bg-amber-800 px-3 py-1 rounded-full text-white font-bold">🌱 VEGETARIAN OPTION</div>
        </div>
        <p className="text-amber-300 text-lg">All plates come with your choice of two sides (5 oz. serving)</p>
        <p className="text-amber-300 text-lg">Beans • Potato Salad • Dirty Rice</p>
        <div className="mt-3 flex flex-wrap justify-center gap-4">
          <p className="text-white">📱 Website: brownsbarbcue.com</p>
          <p className="text-white">☎️ Call: (682) 352-8545</p>
          <p className="text-white">💳 CashApp: $brownroscoe</p>
        </div>
        <p className="text-sm mt-2 text-gray-400">*Prices subject to change without notice</p>
      </div>
    </div>
  );
};

export default DigitalMenuBoard;
