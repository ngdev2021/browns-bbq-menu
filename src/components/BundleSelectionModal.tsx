import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BundleItem {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  category: string;
}

interface BundleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedSide: BundleItem, selectedDrink: BundleItem) => void;
  availableSides: BundleItem[];
  availableDrinks: BundleItem[];
  bundlePrice: number;
  originalPrice: number;
}

const BundleSelectionModal: React.FC<BundleSelectionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  availableSides,
  availableDrinks,
  bundlePrice,
  originalPrice
}) => {
  const [selectedSide, setSelectedSide] = useState<BundleItem | null>(null);
  const [selectedDrink, setSelectedDrink] = useState<BundleItem | null>(null);
  
  // Calculate savings
  const savings = originalPrice - bundlePrice;
  
  // Handle confirmation
  const handleConfirm = () => {
    if (selectedSide && selectedDrink) {
      onConfirm(selectedSide, selectedDrink);
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-charcoal-800 rounded-lg max-w-2xl w-full shadow-xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-amber-800 to-red-800 p-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white">Create Your Bundle</h2>
                  <div className="bg-white text-red-800 font-bold px-3 py-1 rounded-lg">
                    SAVE ${savings.toFixed(2)}
                  </div>
                </div>
                <p className="text-white opacity-90 mt-1">Select one side and one drink to complete your bundle</p>
              </div>
              
              {/* Content */}
              <div className="p-5">
                {/* Sides selection */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-amber-500 mb-3">Choose a Side</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {availableSides.map((side) => (
                      <div
                        key={side.id}
                        className={`
                          p-3 rounded-lg cursor-pointer transition-all
                          ${selectedSide?.id === side.id 
                            ? 'bg-amber-700 text-white border-2 border-amber-500' 
                            : 'bg-charcoal-700 hover:bg-charcoal-600'}
                        `}
                        onClick={() => setSelectedSide(side)}
                      >
                        <div className="h-20 rounded-md overflow-hidden mb-2">
                          <img 
                            src={side.image_url || '/images/placeholder-food.jpg'} 
                            alt={side.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/placeholder-food.jpg';
                            }}
                          />
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 mr-2 flex-shrink-0">
                            {selectedSide?.id === side.id ? (
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            )}
                          </div>
                          <span className="font-medium text-sm">{side.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Drinks selection */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-amber-500 mb-3">Choose a Drink</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {availableDrinks.map((drink) => (
                      <div
                        key={drink.id}
                        className={`
                          p-3 rounded-lg cursor-pointer transition-all
                          ${selectedDrink?.id === drink.id 
                            ? 'bg-amber-700 text-white border-2 border-amber-500' 
                            : 'bg-charcoal-700 hover:bg-charcoal-600'}
                        `}
                        onClick={() => setSelectedDrink(drink)}
                      >
                        <div className="h-20 rounded-md overflow-hidden mb-2">
                          <img 
                            src={drink.image_url || '/images/placeholder-food.jpg'} 
                            alt={drink.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/placeholder-food.jpg';
                            }}
                          />
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 mr-2 flex-shrink-0">
                            {selectedDrink?.id === drink.id ? (
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            )}
                          </div>
                          <span className="font-medium text-sm">{drink.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Bundle price */}
                <div className="flex justify-between items-center bg-charcoal-700 p-3 rounded-lg mb-6">
                  <div>
                    <span className="text-gray-400 line-through mr-2">${originalPrice.toFixed(2)}</span>
                    <span className="text-white font-bold text-lg">${bundlePrice.toFixed(2)}</span>
                  </div>
                  <span className="text-amber-500">You save ${savings.toFixed(2)}</span>
                </div>
                
                {/* Actions */}
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-charcoal-700 hover:bg-charcoal-600 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={!selectedSide || !selectedDrink}
                    className={`
                      px-4 py-2 rounded-lg font-medium transition-colors
                      ${selectedSide && selectedDrink
                        ? 'bg-amber-600 hover:bg-amber-500 text-white' 
                        : 'bg-gray-600 text-gray-300 cursor-not-allowed'}
                    `}
                  >
                    Add Bundle to Order
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BundleSelectionModal;
