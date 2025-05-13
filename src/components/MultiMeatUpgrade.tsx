import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MenuItem } from '../lib/menuService';

interface MultiMeatUpgradeProps {
  baseItem?: MenuItem;
  availableMeats: MenuItem[];
  onUpgradeSelect: (selectedMeat: MenuItem) => void;
  onDecline: () => void;
}

const MultiMeatUpgrade: React.FC<MultiMeatUpgradeProps> = ({
  baseItem,
  availableMeats,
  onUpgradeSelect,
  onDecline
}) => {
  const [selectedMeat, setSelectedMeat] = useState<MenuItem | null>(null);
  
  // Calculate the upgrade price (typically $4 more)
  const upgradePrice = 4.00;
  const totalPrice = baseItem?.price ? baseItem.price + upgradePrice : upgradePrice;
  
  return (
    <motion.div 
      className="bg-gradient-to-r from-amber-800 to-red-800 rounded-lg p-6 shadow-premium mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Make it a 2-Meat Plate</h3>
        <span className="bg-white text-red-800 font-bold px-3 py-1 rounded-lg">
          +${upgradePrice.toFixed(2)}
        </span>
      </div>
      
      <p className="text-white opacity-90 mb-4">
        Add a second meat to your {baseItem?.name || 'plate'} for just ${upgradePrice.toFixed(2)} more!
      </p>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        {availableMeats.map((meat) => (
          <div 
            key={meat.id}
            className={`
              p-3 rounded-md cursor-pointer transition-all
              ${selectedMeat?.id === meat.id 
                ? 'bg-white text-red-800 border-2 border-white' 
                : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'}
            `}
            onClick={() => setSelectedMeat(meat)}
          >
            <div className="flex items-center">
              <div className="w-6 h-6 mr-2 flex items-center justify-center">
                {selectedMeat?.id === meat.id ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                )}
              </div>
              <span className="font-medium">{meat.name}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <button
          className={`
            py-2 px-4 rounded-md font-bold flex-1 transition-all
            ${selectedMeat 
              ? 'bg-white text-red-800 hover:bg-gray-100' 
              : 'bg-white bg-opacity-50 text-white cursor-not-allowed opacity-70'}
          `}
          onClick={() => selectedMeat && onUpgradeSelect(selectedMeat)}
          disabled={!selectedMeat}
        >
          Add {selectedMeat?.name || 'Second Meat'} - ${totalPrice.toFixed(2)} total
        </button>
        
        <button
          className="py-2 px-4 bg-transparent border border-white text-white rounded-md font-bold hover:bg-white hover:bg-opacity-10 transition-all"
          onClick={onDecline}
        >
          No Thanks
        </button>
      </div>
      
      {/* Limited time badge */}
      <div className="absolute -top-3 -right-3 bg-amber-400 text-red-900 text-xs font-bold px-3 py-1 rounded-full shadow-md transform rotate-3">
        Limited Time Offer!
      </div>
    </motion.div>
  );
};

export default MultiMeatUpgrade;
