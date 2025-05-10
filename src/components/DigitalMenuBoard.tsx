import React, { useState, useEffect } from 'react';
import { SAMPLE_MENU_ITEMS } from '../data/sampleData';
import Image from 'next/image';

const DigitalMenuBoard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentSpecialIndex, setCurrentSpecialIndex] = useState(0);
  
  // Featured items for rotating specials
  const featuredItems = SAMPLE_MENU_ITEMS.filter(item => item.featured);
  
  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Rotate through specials every 8 seconds
  useEffect(() => {
    const specialsTimer = setInterval(() => {
      setCurrentSpecialIndex(prevIndex => 
        prevIndex === featuredItems.length - 1 ? 0 : prevIndex + 1
      );
    }, 8000);
    
    return () => clearInterval(specialsTimer);
  }, [featuredItems.length]);
  
  // Group menu items by category
  const categories = SAMPLE_MENU_ITEMS.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof SAMPLE_MENU_ITEMS>);
  
  // Format categories for display
  const formatCategory = (category: string) => {
    switch(category) {
      case 'plates': return 'BBQ Plates';
      case 'sandwiches': return 'BBQ Sandwiches';
      case 'sides': return 'Side Items';
      case 'combos': return 'Combo Specials';
      default: return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };
  
  // Get day of week for daily special
  const getDayOfWeek = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[currentTime.getDay()];
  };
  
  // Current special
  const currentSpecial = featuredItems[currentSpecialIndex];
  
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
      
      {/* Today's Special */}
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
              src={currentSpecial.image_url} 
              alt={currentSpecial.name}
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
              <span className="bg-amber-600 text-white px-3 py-1 rounded-lg font-bold">
                SAVE $2.00
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Menu Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {Object.keys(categories).map((category) => (
          <div key={category} className="mb-6">
            <h2 className="text-2xl font-bold mb-3 bg-amber-700 text-white py-2 px-3 rounded-md shadow-md">
              {formatCategory(category)}
            </h2>
            
            {/* Special rendering for sides category with portion sizes */}
            {category === 'sides' ? (
              <div className="space-y-5">
                <div className="bg-amber-900/50 p-3 rounded-md">
                  <h3 className="text-xl font-bold text-amber-300 mb-2">SIDES</h3>
                  <div className="text-center text-white font-bold mb-2">
                    5 OZ. $4.25 | PINT $9.00 | QUART $17.00 | GALLON $45.00
                  </div>
                  <div className="grid grid-cols-1 gap-3 mt-3">
                    {categories[category].map((item) => (
                      <div key={item.id} className="flex items-center border-b border-amber-700 pb-2 hover:bg-amber-900/50 px-2 rounded transition-colors">
                        <span className="text-amber-400 mr-2 font-mono">{item.id}.</span>
                        <span className="font-medium text-lg flex-grow">{item.name}</span>
                        <div className="flex items-center">
                          <img 
                            src={item.image_url} 
                            alt={item.name}
                            className="w-12 h-12 rounded-full object-cover mr-2 border border-amber-600"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {categories[category].map((item) => (
                  <div key={item.id} className="flex justify-between border-b border-amber-900 pb-2 hover:bg-amber-900/30 px-2 rounded transition-colors">
                    <div className="flex items-center">
                      <span className="text-amber-400 mr-2 font-mono">{item.id}.</span>
                      <span className="font-medium text-lg">{item.name}</span>
                    </div>
                    <span className="text-amber-400 font-bold text-xl">${item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
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
