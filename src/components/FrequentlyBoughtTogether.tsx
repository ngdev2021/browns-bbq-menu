import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { MenuItem } from '../lib/menuService';

// Using MenuItem from menuService

interface FrequentlyBoughtTogetherProps {
  mainItem: MenuItem;
  suggestedItems: MenuItem[];
  onAddToCart: (items: MenuItem[]) => void;
}

const FrequentlyBoughtTogether: React.FC<FrequentlyBoughtTogetherProps> = ({
  mainItem,
  suggestedItems,
  onAddToCart
}) => {
  const [selectedItems, setSelectedItems] = useState<string[]>(suggestedItems.map(item => item.id));
  
  const toggleItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };
  
  const calculateTotalPrice = () => {
    const selectedSuggestedItems = suggestedItems.filter(item => selectedItems.includes(item.id));
    return mainItem.price + selectedSuggestedItems.reduce((sum, item) => sum + item.price, 0);
  };
  
  const calculateSavings = () => {
    // Calculate a 10% discount when buying together
    return calculateTotalPrice() * 0.1;
  };
  
  const handleAddAll = () => {
    const itemsToAdd = [
      mainItem,
      ...suggestedItems.filter(item => selectedItems.includes(item.id))
    ];
    onAddToCart(itemsToAdd);
  };
  
  return (
    <div className="mt-8 card shadow-premium p-4 rounded-lg">
      <h3 className="text-xl font-bold text-amber-500 mb-3">Frequently Bought Together</h3>
      <p className="text-gray-300 mb-4">Add these popular items and save 10%</p>
      
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
        {/* Main Item */}
        <div className="relative w-full md:w-1/4">
          <div className="bg-charcoal-700 rounded-lg p-3 flex flex-col items-center">
            <div className="w-24 h-24 rounded-md overflow-hidden bg-charcoal-600 mb-2">
              {mainItem.image_url ? (
                <img 
                  src={mainItem.image_url} 
                  alt={mainItem.name}
                  className="w-full h-full object-cover"
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    (e.target as HTMLImageElement).src = '/images/placeholder-food.jpg';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-charcoal-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <h4 className="font-medium text-center">{mainItem.name}</h4>
            <span className="text-amber-500 font-medium">${mainItem.price.toFixed(2)}</span>
          </div>
          <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 hidden md:block">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        </div>
        
        {/* Suggested Items */}
        {suggestedItems.map((item, index) => (
          <div key={item.id} className="relative w-full md:w-1/4">
            <div 
              className={`bg-charcoal-700 rounded-lg p-3 flex flex-col items-center cursor-pointer transition-all ${
                selectedItems.includes(item.id) 
                  ? 'ring-2 ring-amber-500' 
                  : 'opacity-70 hover:opacity-100'
              }`}
              onClick={() => toggleItem(item.id)}
            >
              <div className="w-24 h-24 rounded-md overflow-hidden bg-charcoal-600 mb-2">
                {item.image_url ? (
                  <img 
                    src={item.image_url} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      (e.target as HTMLImageElement).src = '/images/placeholder-food.jpg';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-charcoal-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                
                {/* Checkbox */}
                <div className="absolute top-2 right-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    selectedItems.includes(item.id) 
                      ? 'bg-amber-500' 
                      : 'bg-charcoal-600 border border-gray-500'
                  }`}>
                    {selectedItems.includes(item.id) && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
              <h4 className="font-medium text-center">{item.name}</h4>
              <span className="text-amber-500 font-medium">${item.price.toFixed(2)}</span>
            </div>
            {index < suggestedItems.length - 1 && (
              <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 hidden md:block">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Price Summary */}
      <div className="bg-charcoal-600 rounded-lg p-4 mb-4">
        <div className="flex justify-between mb-2">
          <span>Price for all:</span>
          <span>${calculateTotalPrice().toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2 text-green-400">
          <span>You save:</span>
          <span>-${calculateSavings().toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg">
          <span>Bundle price:</span>
          <span className="text-amber-500">${(calculateTotalPrice() - calculateSavings()).toFixed(2)}</span>
        </div>
      </div>
      
      <button 
        onClick={handleAddAll}
        className="w-full btn-primary py-3 flex items-center justify-center"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        Add All to Cart
      </button>
    </div>
  );
};

export default FrequentlyBoughtTogether;
