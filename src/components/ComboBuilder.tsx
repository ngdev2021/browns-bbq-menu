import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMenuItemImagePath, getCacheBustedImageUrl } from '../lib/imageUtils';

// Types for combo building
interface ComboItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
}

interface ComboSection {
  id: string;
  name: string;
  description: string;
  required: boolean;
  min_selections: number;
  max_selections: number;
  items: ComboItem[];
}

interface ComboTemplate {
  id: string;
  name: string;
  description: string;
  base_price: number;
  image_url: string;
  sections: ComboSection[];
  savings_message?: string;
}

interface ComboBuilderProps {
  template: ComboTemplate;
  onClose: () => void;
  onAddToCart: (combo: any) => void;
}

const ComboBuilder: React.FC<ComboBuilderProps> = ({
  template,
  onClose,
  onAddToCart
}) => {
  // Track selected items for each section
  const [selectedItems, setSelectedItems] = useState<Record<string, string[]>>({});
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [currentStep, setCurrentStep] = useState(0);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  // Initialize selections
  useEffect(() => {
    const initialSelections: Record<string, string[]> = {};
    
    template.sections.forEach(section => {
      initialSelections[section.id] = [];
    });
    
    setSelectedItems(initialSelections);
  }, [template]);
  
  // Calculate total price
  const calculateTotalPrice = () => {
    let total = template.base_price;
    
    // Add price of selected items if they're not included in the base price
    Object.entries(selectedItems).forEach(([sectionId, itemIds]) => {
      const section = template.sections.find(s => s.id === sectionId);
      if (!section) return;
      
      // If this is an "included" section (like sides included with a plate),
      // don't add the price of the selected items
      if (section.name.toLowerCase().includes('included')) {
        return;
      }
      
      itemIds.forEach(itemId => {
        const item = section.items.find(i => i.id === itemId);
        if (item) {
          total += item.price;
        }
      });
    });
    
    return total * quantity;
  };
  
  // Calculate savings compared to ordering items individually
  const calculateSavings = () => {
    let individualTotal = 0;
    
    Object.entries(selectedItems).forEach(([sectionId, itemIds]) => {
      const section = template.sections.find(s => s.id === sectionId);
      if (!section) return;
      
      itemIds.forEach(itemId => {
        const item = section.items.find(i => i.id === itemId);
        if (item) {
          individualTotal += item.price;
        }
      });
    });
    
    const comboTotal = calculateTotalPrice() / quantity;
    const savings = individualTotal - comboTotal;
    
    return savings > 0 ? savings : 0;
  };
  
  // Handle item selection/deselection
  const handleItemToggle = (sectionId: string, itemId: string) => {
    const section = template.sections.find(s => s.id === sectionId);
    if (!section) return;
    
    setSelectedItems(prev => {
      const currentSelections = [...(prev[sectionId] || [])];
      const itemIndex = currentSelections.indexOf(itemId);
      
      // If item is already selected, remove it (unless it would violate min selections)
      if (itemIndex >= 0) {
        if (currentSelections.length > section.min_selections) {
          currentSelections.splice(itemIndex, 1);
        }
      } 
      // Otherwise add it (unless it would exceed max selections)
      else {
        if (currentSelections.length < section.max_selections) {
          currentSelections.push(itemId);
        } else if (section.max_selections === 1) {
          // For single-selection sections, replace the current selection
          return {
            ...prev,
            [sectionId]: [itemId]
          };
        }
      }
      
      return {
        ...prev,
        [sectionId]: currentSelections
      };
    });
    
    // Clear validation error for this section if it exists
    if (validationErrors[sectionId]) {
      setValidationErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[sectionId];
        return newErrors;
      });
    }
  };
  
  // Validate selections for the current step
  const validateCurrentStep = (): boolean => {
    const currentSection = template.sections[currentStep];
    if (!currentSection) return true;
    
    const currentSelections = selectedItems[currentSection.id] || [];
    
    if (currentSection.required && currentSelections.length < currentSection.min_selections) {
      setValidationErrors(prev => ({
        ...prev,
        [currentSection.id]: `Please select at least ${currentSection.min_selections} ${currentSection.name.toLowerCase()}`
      }));
      return false;
    }
    
    return true;
  };
  
  // Move to next step or complete combo building
  const handleNextStep = () => {
    if (!validateCurrentStep()) return;
    
    if (currentStep < template.sections.length - 1) {
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
  
  // Add combo to cart
  const handleAddToCart = () => {
    // Prepare combo data for cart
    const comboItems = Object.entries(selectedItems).flatMap(([sectionId, itemIds]) => {
      const section = template.sections.find(s => s.id === sectionId);
      if (!section) return [];
      
      return itemIds.map(itemId => {
        const item = section.items.find(i => i.id === itemId);
        if (!item) return null;
        
        return {
          section_id: sectionId,
          section_name: section.name,
          item_id: itemId,
          item_name: item.name,
          item_price: item.price,
          item_image: item.image_url
        };
      }).filter(Boolean);
    });
    
    const combo = {
      id: `combo-${template.id}-${Date.now()}`,
      template_id: template.id,
      name: template.name,
      description: template.description,
      base_price: template.base_price,
      total_price: calculateTotalPrice(),
      image_url: template.image_url,
      items: comboItems,
      special_instructions: specialInstructions,
      quantity: quantity
    };
    
    onAddToCart(combo);
    onClose();
  };
  
  // Get the current section
  const currentSection = template.sections[currentStep];
  
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
          className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
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
            <h2 className="text-xl font-bold text-gray-800">Build Your {template.name}</h2>
            <p className="text-gray-600">{template.description}</p>
          </div>
          
          {/* Combo Preview */}
          <div className="flex items-center p-4 bg-amber-50 border-b border-amber-100">
            <div className="w-24 h-24 rounded-md overflow-hidden mr-4 flex-shrink-0">
              <img 
                src={getCacheBustedImageUrl(getMenuItemImagePath(template.image_url))}
                alt={template.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/placeholder-food.jpg';
                }}
              />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-800">{template.name}</h3>
              
              {/* Show savings message if applicable */}
              {calculateSavings() > 0 && (
                <div className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm inline-block mb-1">
                  Save ${calculateSavings().toFixed(2)} with this combo!
                </div>
              )}
              
              <div className="flex items-center justify-between mt-1">
                <div>
                  <span className="font-bold text-amber-700 text-lg">${calculateTotalPrice().toFixed(2)}</span>
                  <div className="flex items-center mt-1 border border-gray-300 rounded-md inline-flex">
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
                
                {/* Show selected items summary */}
                <div className="text-sm text-gray-600 max-w-xs">
                  {Object.entries(selectedItems).some(([_, items]) => items.length > 0) ? (
                    <div>
                      {Object.entries(selectedItems).map(([sectionId, itemIds]) => {
                        if (itemIds.length === 0) return null;
                        const section = template.sections.find(s => s.id === sectionId);
                        if (!section) return null;
                        
                        return (
                          <div key={sectionId} className="mb-1">
                            <span className="font-medium">{section.name}:</span>{' '}
                            {itemIds.map(itemId => {
                              const item = section.items.find(i => i.id === itemId);
                              return item ? item.name : '';
                            }).join(', ')}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <span>Start building your combo!</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Content Area - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4">
            {currentSection && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-gray-800 text-lg">{currentSection.name}</h3>
                  {currentSection.required ? (
                    <span className="text-sm bg-red-100 text-red-800 px-2 py-0.5 rounded">
                      Required
                    </span>
                  ) : (
                    <span className="text-sm bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                      Optional
                    </span>
                  )}
                </div>
                
                {currentSection.description && (
                  <p className="text-gray-600 mb-3">{currentSection.description}</p>
                )}
                
                {currentSection.min_selections > 0 && (
                  <p className="text-sm text-gray-600 mb-3">
                    {currentSection.min_selections === currentSection.max_selections 
                      ? `Select exactly ${currentSection.min_selections}` 
                      : `Select ${currentSection.min_selections}-${currentSection.max_selections}`}
                  </p>
                )}
                
                {validationErrors[currentSection.id] && (
                  <p className="text-sm text-red-600 mb-3">{validationErrors[currentSection.id]}</p>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentSection.items.map(item => {
                    const isSelected = (selectedItems[currentSection.id] || []).includes(item.id);
                    
                    return (
                      <div 
                        key={item.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          isSelected 
                            ? 'border-amber-700 bg-amber-50' 
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => handleItemToggle(currentSection.id, item.id)}
                      >
                        <div className="flex items-start">
                          {/* Selection indicator */}
                          <div className={`
                            w-5 h-5 rounded-full border flex-shrink-0
                            ${isSelected 
                              ? 'bg-amber-700 border-amber-700' 
                              : 'border-gray-300'
                            } flex items-center justify-center mt-1 mr-3
                          `}>
                            {isSelected && (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          
                          {/* Item image */}
                          <div className="w-16 h-16 rounded-md overflow-hidden mr-3 flex-shrink-0">
                            <img 
                              src={getCacheBustedImageUrl(getMenuItemImagePath(item.image_url))}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/images/placeholder-food.jpg';
                              }}
                            />
                          </div>
                          
                          {/* Item details */}
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <span className="font-medium">{item.name}</span>
                              {item.price > 0 && !currentSection.name.toLowerCase().includes('included') && (
                                <span className="text-amber-700">+${item.price.toFixed(2)}</span>
                              )}
                            </div>
                            {item.description && (
                              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
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
            {currentStep === template.sections.length - 1 && (
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
          </div>
          
          {/* Progress Indicator */}
          <div className="px-4 py-2 border-t border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">
                Step {currentStep + 1} of {template.sections.length}
              </span>
              <span className="text-sm text-gray-600">
                {Math.round(((currentStep + 1) / template.sections.length) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-amber-700 h-1.5 rounded-full" 
                style={{ width: `${((currentStep + 1) / template.sections.length) * 100}%` }}
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
              {currentStep < template.sections.length - 1 ? 'Next' : 'Add to Cart'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ComboBuilder;
