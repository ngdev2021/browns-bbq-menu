import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMenuItemImagePath, getCacheBustedImageUrl } from '../lib/imageUtils';
import { meats } from '../data/meats';
import { sides } from '../data/sides';

// Types for plate building
interface PlateBuilderProps {
  plateSize: number; // 1-5 meats
  onClose: () => void;
  onAddToCart: (plate: any) => void;
}

const PlateBuilder: React.FC<PlateBuilderProps> = ({
  plateSize,
  onClose,
  onAddToCart
}) => {
  // Track selected meats and sides
  const [selectedMeats, setSelectedMeats] = useState<string[]>([]);
  const [selectedSides, setSelectedSides] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [currentStep, setCurrentStep] = useState(0); // 0 = meats, 1 = sides
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  // Calculate total price
  const calculateTotalPrice = () => {
    let total = 0;
    
    // Add price of selected meats
    selectedMeats.forEach(meatId => {
      const meat = meats.find(m => m.id === meatId);
      if (meat) {
        total += meat.price;
      }
    });
    
    // Apply plate discount based on size
    // The more meats, the better the value
    if (plateSize > 1) {
      // Apply a discount based on plate size
      const discountPercent = (plateSize - 1) * 0.05; // 5% per additional meat
      total = total * (1 - discountPercent);
    }
    
    return total * quantity;
  };
  
  // Handle meat selection/deselection
  const handleMeatToggle = (meatId: string) => {
    setSelectedMeats(prev => {
      const currentSelections = [...prev];
      const meatIndex = currentSelections.indexOf(meatId);
      
      // If meat is already selected, remove it
      if (meatIndex >= 0) {
        if (currentSelections.length > 1 || plateSize === 1) {
          currentSelections.splice(meatIndex, 1);
        }
      } 
      // Otherwise add it if we haven't reached the plate size limit
      else if (currentSelections.length < plateSize) {
        currentSelections.push(meatId);
      }
      
      return currentSelections;
    });
    
    // Clear validation error if it exists
    if (validationErrors['meats']) {
      setValidationErrors(prev => {
        const newErrors = {...prev};
        delete newErrors['meats'];
        return newErrors;
      });
    }
  };
  
  // Handle side selection/deselection
  const handleSideToggle = (sideId: string) => {
    setSelectedSides(prev => {
      const currentSelections = [...prev];
      const sideIndex = currentSelections.indexOf(sideId);
      
      // If side is already selected, remove it
      if (sideIndex >= 0) {
        if (currentSelections.length > 1) {
          currentSelections.splice(sideIndex, 1);
        }
      } 
      // Otherwise add it if we haven't reached the 2 sides limit
      else if (currentSelections.length < 2) {
        currentSelections.push(sideId);
      } else {
        // Replace the first side if we already have 2
        currentSelections.shift();
        currentSelections.push(sideId);
      }
      
      return currentSelections;
    });
    
    // Clear validation error if it exists
    if (validationErrors['sides']) {
      setValidationErrors(prev => {
        const newErrors = {...prev};
        delete newErrors['sides'];
        return newErrors;
      });
    }
  };
  
  // Validate selections for the current step
  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (currentStep === 0) {
      // Validate meat selections
      if (selectedMeats.length === 0) {
        newErrors['meats'] = `Please select at least 1 meat for your plate.`;
      } else if (selectedMeats.length < plateSize) {
        newErrors['meats'] = `Please select ${plateSize} meats for your ${plateSize}-meat plate.`;
      }
    } else if (currentStep === 1) {
      // Validate side selections
      if (selectedSides.length < 2) {
        newErrors['sides'] = 'Please select 2 sides for your plate.';
      }
    }
    
    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Move to next step or complete plate building
  const handleNextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep < 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleAddToCart();
      }
    }
  };
  
  // Move to previous step
  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Add plate to cart
  const handleAddToCart = () => {
    // Create the plate object
    const selectedMeatItems = selectedMeats.map(meatId => {
      const meat = meats.find(m => m.id === meatId);
      return {
        id: meat?.id,
        name: meat?.name,
        price: meat?.price
      };
    });
    
    const selectedSideItems = selectedSides.map(sideId => {
      const side = sides.find(s => s.id === sideId);
      return {
        id: side?.id,
        name: side?.name,
        price: side?.price
      };
    });
    
    const plateObj = {
      id: `plate-${plateSize}-meat`,
      name: `${plateSize}-Meat Plate`,
      price: calculateTotalPrice() / quantity,
      quantity,
      image_url: selectedMeats.length > 0 
        ? meats.find(m => m.id === selectedMeats[0])?.image_url || '/images/placeholder-food.jpg'
        : '/images/placeholder-food.jpg',
      special_instructions: specialInstructions,
      selectedMeats: selectedMeatItems,
      selectedSides: selectedSideItems,
      isPlate: true,
      plateSize
    };
    
    onAddToCart(plateObj);
    onClose();
  };
  
  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">
              Build Your {plateSize}-Meat Plate
            </h2>
            <p className="text-gray-600">
              {currentStep === 0 
                ? `Select ${plateSize} meat${plateSize > 1 ? 's' : ''} for your plate.` 
                : 'Select 2 sides to complete your plate.'}
            </p>
          </div>
          
          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Step 1: Meat Selection */}
            {currentStep === 0 && (
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Select Your Meat{plateSize > 1 ? 's' : ''}</h3>
                
                {validationErrors['meats'] && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                    {validationErrors['meats']}
                  </div>
                )}
                
                <div className="space-y-3">
                  {meats.map(meat => {
                    const isSelected = selectedMeats.includes(meat.id);
                    
                    return (
                      <div 
                        key={meat.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          isSelected 
                            ? 'border-amber-700 bg-amber-50' 
                            : 'border-gray-200 hover:border-amber-700 hover:bg-amber-50'
                        }`}
                        onClick={() => handleMeatToggle(meat.id)}
                      >
                        <div className="flex items-center">
                          {/* Selection indicator */}
                          <div className="mr-3 flex-shrink-0">
                            {isSelected ? (
                              <svg className="w-6 h-6 text-amber-700" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg className="w-6 h-6 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          
                          {/* Meat image */}
                          <div className="w-16 h-16 rounded-md overflow-hidden mr-3 flex-shrink-0">
                            <img 
                              src={getCacheBustedImageUrl(getMenuItemImagePath(meat.image_url))}
                              alt={meat.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/images/placeholder-food.jpg';
                              }}
                            />
                          </div>
                          
                          {/* Meat details */}
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <span className="font-medium">{meat.name}</span>
                              <span className="text-amber-700">${meat.price.toFixed(2)}</span>
                            </div>
                            {meat.description && (
                              <p className="text-sm text-gray-600 mt-1">{meat.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Step 2: Side Selection */}
            {currentStep === 1 && (
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Select 2 Sides</h3>
                
                {validationErrors['sides'] && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                    {validationErrors['sides']}
                  </div>
                )}
                
                <div className="space-y-3">
                  {sides.map(side => {
                    const isSelected = selectedSides.includes(side.id);
                    
                    return (
                      <div 
                        key={side.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          isSelected 
                            ? 'border-amber-700 bg-amber-50' 
                            : 'border-gray-200 hover:border-amber-700 hover:bg-amber-50'
                        }`}
                        onClick={() => handleSideToggle(side.id)}
                      >
                        <div className="flex items-center">
                          {/* Selection indicator */}
                          <div className="mr-3 flex-shrink-0">
                            {isSelected ? (
                              <svg className="w-6 h-6 text-amber-700" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg className="w-6 h-6 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          
                          {/* Side image */}
                          <div className="w-16 h-16 rounded-md overflow-hidden mr-3 flex-shrink-0">
                            <img 
                              src={getCacheBustedImageUrl(getMenuItemImagePath(side.image_url))}
                              alt={side.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/images/placeholder-food.jpg';
                              }}
                            />
                          </div>
                          
                          {/* Side details */}
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <span className="font-medium">{side.name}</span>
                              <span className="text-amber-700">Included</span>
                            </div>
                            {side.description && (
                              <p className="text-sm text-gray-600 mt-1">{side.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Quantity and Special Instructions - shown on last step */}
            {currentStep === 1 && (
              <>
                <div className="mt-6">
                  <h3 className="font-bold text-gray-800 mb-2">Quantity</h3>
                  <div className="flex items-center">
                    <button
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="mx-4 text-xl font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(prev => prev + 1)}
                      className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-bold text-gray-800 mb-2">Special Instructions</h3>
                  <textarea
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Any special requests or allergies? Let us know here."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                    rows={3}
                  />
                </div>
              </>
            )}
          </div>
          
          {/* Price Display */}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total:</span>
              <span className="text-xl font-bold text-amber-700">${calculateTotalPrice().toFixed(2)}</span>
            </div>
          </div>
          
          {/* Footer with Actions */}
          <div className="p-4 border-t border-gray-200 flex justify-between">
            <button
              onClick={currentStep === 0 ? onClose : handlePreviousStep}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {currentStep === 0 ? 'Cancel' : 'Back'}
            </button>
            
            <button
              onClick={handleNextStep}
              className="px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-600"
            >
              {currentStep < 1 ? 'Next' : 'Add to Cart'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PlateBuilder;
