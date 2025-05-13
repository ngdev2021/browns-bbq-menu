import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMenuItemImagePath, getCacheBustedImageUrl } from '../lib/imageUtils';
import { MenuItem } from '../lib/menuService';

// Types for menu item customization
interface MenuItemOption {
  id: string;
  name: string;
  price: number;
  description?: string;
  image_url?: string;
  default?: boolean;
}

interface MenuItemModifierGroup {
  id: string;
  name: string;
  required: boolean;
  min_selections: number;
  max_selections: number;
  options: MenuItemOption[];
}

interface MenuItemCustomizerProps {
  item: {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url: string;
    category: string;
  };
  modifierGroups: MenuItemModifierGroup[];
  onClose: () => void;
  onAddToCart: (item: any, selectedOptions: any[], specialInstructions: string) => void;
  recommendedItems?: any[];
}

const MenuItemCustomizer: React.FC<MenuItemCustomizerProps> = ({
  item,
  modifierGroups,
  onClose,
  onAddToCart,
  recommendedItems = []
}) => {
  // Track selected options for each modifier group
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [currentStep, setCurrentStep] = useState(0);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  // Initialize selected options with defaults
  useEffect(() => {
    const initialSelections: Record<string, string[]> = {};
    
    modifierGroups.forEach(group => {
      const defaultOptions = group.options
        .filter(option => option.default)
        .map(option => option.id);
      
      if (defaultOptions.length > 0) {
        initialSelections[group.id] = defaultOptions;
      } else {
        initialSelections[group.id] = [];
      }
    });
    
    setSelectedOptions(initialSelections);
  }, [modifierGroups]);
  
  // Calculate total price including all selected options
  const calculateTotalPrice = () => {
    let total = item.price;
    
    Object.entries(selectedOptions).forEach(([groupId, optionIds]) => {
      const group = modifierGroups.find(g => g.id === groupId);
      if (!group) return;
      
      optionIds.forEach(optionId => {
        const option = group.options.find(o => o.id === optionId);
        if (option) {
          total += option.price;
        }
      });
    });
    
    return total * quantity;
  };
  
  // Handle option selection/deselection
  const handleOptionToggle = (groupId: string, optionId: string) => {
    const group = modifierGroups.find(g => g.id === groupId);
    if (!group) return;
    
    setSelectedOptions(prev => {
      const currentSelections = [...(prev[groupId] || [])];
      const optionIndex = currentSelections.indexOf(optionId);
      
      // If option is already selected, remove it (unless it would violate min selections)
      if (optionIndex >= 0) {
        if (currentSelections.length > group.min_selections) {
          currentSelections.splice(optionIndex, 1);
        }
      } 
      // Otherwise add it (unless it would exceed max selections)
      else {
        if (currentSelections.length < group.max_selections) {
          currentSelections.push(optionId);
        } else if (group.max_selections === 1) {
          // For single-selection groups, replace the current selection
          return {
            ...prev,
            [groupId]: [optionId]
          };
        }
      }
      
      return {
        ...prev,
        [groupId]: currentSelections
      };
    });
    
    // Clear validation error for this group if it exists
    if (validationErrors[groupId]) {
      setValidationErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[groupId];
        return newErrors;
      });
    }
  };
  
  // Validate selections for the current step
  const validateCurrentStep = (): boolean => {
    const currentGroup = modifierGroups[currentStep];
    if (!currentGroup) return true;
    
    const currentSelections = selectedOptions[currentGroup.id] || [];
    
    if (currentGroup.required && currentSelections.length < currentGroup.min_selections) {
      setValidationErrors(prev => ({
        ...prev,
        [currentGroup.id]: `Please select at least ${currentGroup.min_selections} option${currentGroup.min_selections !== 1 ? 's' : ''}`
      }));
      return false;
    }
    
    return true;
  };
  
  // Move to next step or complete customization
  const handleNextStep = () => {
    if (!validateCurrentStep()) return;
    
    if (currentStep < modifierGroups.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleAddToCart();
    }
  };
  
  // Move to previous step
  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  // Add customized item to cart
  const handleAddToCart = () => {
    // Flatten selected options for easier processing
    const flattenedOptions = Object.entries(selectedOptions).flatMap(([groupId, optionIds]) => {
      const group = modifierGroups.find(g => g.id === groupId);
      if (!group) return [];
      
      return optionIds.map(optionId => {
        const option = group.options.find(o => o.id === optionId);
        if (!option) return null;
        
        return {
          group_id: groupId,
          group_name: group.name,
          option_id: optionId,
          option_name: option.name,
          price: option.price
        };
      }).filter(Boolean);
    });
    
    // Add to cart with all customizations
    onAddToCart(
      {...item, quantity},
      flattenedOptions,
      specialInstructions
    );
    
    onClose();
  };
  
  // Get the current modifier group
  const currentGroup = modifierGroups[currentStep];
  
  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };
  
  const modalVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', damping: 25, stiffness: 500 } }
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={onClose}
      >
        <motion.div 
          className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          variants={modalVariants}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative p-4 border-b border-gray-200">
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-xl font-bold text-gray-800">Customize Your Order</h2>
          </div>
          
          {/* Item Preview */}
          <div className="flex items-center p-4 bg-gray-50">
            <div className="w-20 h-20 rounded-md overflow-hidden mr-4">
              <img 
                src={getCacheBustedImageUrl(getMenuItemImagePath(item.image_url))}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/placeholder-food.jpg';
                }}
              />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
              <p className="text-gray-600 text-sm">{item.description}</p>
              <div className="flex items-center mt-1">
                <span className="font-bold text-amber-700">${calculateTotalPrice().toFixed(2)}</span>
                <div className="flex items-center ml-4 border border-gray-300 rounded-md">
                  <button 
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-2 py-1">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Content Area - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4">
            {currentGroup && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-gray-800">{currentGroup.name}</h3>
                  {currentGroup.required ? (
                    <span className="text-sm bg-red-100 text-red-800 px-2 py-0.5 rounded">
                      Required
                    </span>
                  ) : (
                    <span className="text-sm bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                      Optional
                    </span>
                  )}
                </div>
                
                {currentGroup.min_selections > 0 && (
                  <p className="text-sm text-gray-600 mb-2">
                    {currentGroup.min_selections === currentGroup.max_selections 
                      ? `Select exactly ${currentGroup.min_selections}` 
                      : `Select ${currentGroup.min_selections}-${currentGroup.max_selections}`}
                  </p>
                )}
                
                {validationErrors[currentGroup.id] && (
                  <p className="text-sm text-red-600 mb-2">{validationErrors[currentGroup.id]}</p>
                )}
                
                <div className="space-y-2">
                  {currentGroup.options.map(option => {
                    const isSelected = (selectedOptions[currentGroup.id] || []).includes(option.id);
                    const isRadioStyle = currentGroup.max_selections === 1;
                    
                    return (
                      <div 
                        key={option.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          isSelected 
                            ? 'border-amber-700 bg-amber-50' 
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => handleOptionToggle(currentGroup.id, option.id)}
                      >
                        <div className="flex items-center">
                          {/* Radio or Checkbox indicator */}
                          <div className={`
                            w-5 h-5 rounded-${isRadioStyle ? 'full' : 'md'} border 
                            ${isSelected 
                              ? 'bg-amber-700 border-amber-700' 
                              : 'border-gray-300'
                            } flex items-center justify-center mr-3
                          `}>
                            {isSelected && (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                {isRadioStyle ? (
                                  <circle cx="10" cy="10" r="4" />
                                ) : (
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                )}
                              </svg>
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <span className="font-medium">{option.name}</span>
                              {option.price > 0 && (
                                <span className="text-amber-700">+${option.price.toFixed(2)}</span>
                              )}
                            </div>
                            {option.description && (
                              <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Special Instructions - shown on last step */}
            {currentStep === modifierGroups.length - 1 && (
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
            )}
            
            {/* Recommended Add-ons - shown on last step */}
            {currentStep === modifierGroups.length - 1 && recommendedItems.length > 0 && (
              <div className="mt-6">
                <h3 className="font-bold text-gray-800 mb-2">Recommended Add-ons</h3>
                <div className="grid grid-cols-2 gap-3">
                  {recommendedItems.map(item => (
                    <div 
                      key={item.id}
                      className="p-3 border border-gray-200 rounded-lg hover:border-amber-700 hover:bg-amber-50 cursor-pointer transition-colors"
                      onClick={() => {
                        // This would typically add the item directly to cart
                        // or open a new customizer for this item
                        alert(`Added ${item.name} to cart!`);
                      }}
                    >
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-md overflow-hidden mr-3">
                          <img 
                            src={getCacheBustedImageUrl(getMenuItemImagePath(item.image_url))}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/placeholder-food.jpg';
                            }}
                          />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{item.name}</div>
                          <div className="text-amber-700 text-sm">${item.price.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Progress Indicator */}
          <div className="px-4 py-2 border-t border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">
                Step {currentStep + 1} of {modifierGroups.length}
              </span>
              <span className="text-sm text-gray-600">
                {Math.round(((currentStep + 1) / modifierGroups.length) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-amber-700 h-1.5 rounded-full" 
                style={{ width: `${((currentStep + 1) / modifierGroups.length) * 100}%` }}
              />
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
              {currentStep < modifierGroups.length - 1 ? 'Next' : 'Add to Cart'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MenuItemCustomizer;
