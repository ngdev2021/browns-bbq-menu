import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sides } from '../data/sides';

interface SideItem {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  category: string;
}

interface SideSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedSides: SideItem[]) => void;
  maxSides: number;
  currentSides: SideItem[];
}

const SideSelectionModal: React.FC<SideSelectionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  maxSides,
  currentSides = []
}) => {
  // Initialize selected sides with current sides if any
  const [selectedSides, setSelectedSides] = useState<SideItem[]>(currentSides);
  
  // Handle side selection
  const handleSideSelection = (side: SideItem) => {
    // Check if side is already selected
    const isSelected = selectedSides.some(s => s.id === side.id);
    
    if (isSelected) {
      // Remove side if already selected
      setSelectedSides(prev => prev.filter(s => s.id !== side.id));
    } else {
      // Add side if not at max capacity
      if (selectedSides.length < maxSides) {
        setSelectedSides(prev => [...prev, side]);
      }
    }
  };
  
  // Handle confirmation
  const handleConfirm = () => {
    if (selectedSides.length === maxSides) {
      onConfirm(selectedSides);
      onClose();
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
                  <h2 className="text-xl font-bold text-white">Select Your Sides</h2>
                  <div className="bg-white text-red-800 font-bold px-3 py-1 rounded-lg">
                    {selectedSides.length} of {maxSides} selected
                  </div>
                </div>
                <p className="text-white opacity-90 mt-1">
                  {maxSides === 1 
                    ? "Select 1 side to accompany your meal" 
                    : `Select ${maxSides} sides to accompany your meal`}
                </p>
              </div>
              
              {/* Content */}
              <div className="p-5">
                {/* Sides selection */}
                <div className="mb-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {sides.map((side) => (
                      <div
                        key={side.id}
                        className={`
                          p-3 rounded-lg cursor-pointer transition-all
                          ${selectedSides.some(s => s.id === side.id) 
                            ? 'bg-amber-700 text-white border-2 border-amber-500' 
                            : 'bg-charcoal-700 hover:bg-charcoal-600'}
                          ${selectedSides.length >= maxSides && !selectedSides.some(s => s.id === side.id)
                            ? 'opacity-50 cursor-not-allowed'
                            : ''}
                        `}
                        onClick={() => handleSideSelection(side)}
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
                            {selectedSides.some(s => s.id === side.id) ? (
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
                    disabled={selectedSides.length !== maxSides}
                    className={`
                      px-4 py-2 rounded-lg font-medium transition-colors
                      ${selectedSides.length === maxSides
                        ? 'bg-amber-600 hover:bg-amber-500 text-white' 
                        : 'bg-gray-600 text-gray-300 cursor-not-allowed'}
                    `}
                  >
                    Confirm Selection
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

export default SideSelectionModal;
