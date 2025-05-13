import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BundleSelectionModal from './BundleSelectionModal';
import SideSelectionModal from './SideSelectionModal';
import { drinks } from '../data/drinks';
import { sides } from '../data/sides';

// Define CartItem interface here since it's not exported from CartContext
interface CartItemOption {
  group_id: string;
  group_name: string;
  option_id: string;
  option_name: string;
  price: number;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
  options?: CartItemOption[];
  special_instructions?: string;
  isCombo?: boolean;
  combo_items?: any[];
  isMultiMeatPlate?: boolean;
  secondMeat?: {
    id: string;
    name: string;
    price: number;
  } | null;
  selectedSides?: {
    id: string;
    name: string;
    price: number;
  }[];
  selectedDessert?: {
    id: string;
    name: string;
    price: number;
  } | null;
  bundleAccepted?: boolean;
  bundleItems?: {
    side: {
      id: string;
      name: string;
      price: number;
    } | null;
    drink: {
      id: string;
      name: string;
      price: number;
    } | null;
    bundlePrice: number;
  } | null;
}

interface EditCartItemModalProps {
  item: CartItem;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<CartItem>) => void;
}

const EditCartItemModal: React.FC<EditCartItemModalProps> = ({
  item,
  isOpen,
  onClose,
  onSave
}) => {
  // Local state for the edited values
  const [quantity, setQuantity] = useState(item.quantity);
  const [specialInstructions, setSpecialInstructions] = useState(item.special_instructions || '');
  const [removeDessert, setRemoveDessert] = useState(false);
  const [removeBundle, setRemoveBundle] = useState(false);
  const [showBundleModal, setShowBundleModal] = useState(false);
  const [showSideModal, setShowSideModal] = useState(false);
  const [selectedSides, setSelectedSides] = useState<any[]>(item.selectedSides || []);
  const [maxSides, setMaxSides] = useState<number>(item.isMultiMeatPlate ? 3 : 2);
  
  // Get the total price of the item including all customizations
  const getItemTotalPrice = () => {
    let total = item.price;
    if (item.selectedDessert && !removeDessert) {
      total += item.selectedDessert.price;
    }
    return total;
  };
  
  // Handle side selection
  const handleSideSelection = (newSelectedSides: any[]) => {
    setSelectedSides(newSelectedSides);
    setShowSideModal(false);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create updates object
    const updates: Partial<CartItem> = {
      quantity,
      special_instructions: specialInstructions,
      selectedSides: selectedSides
    };
    
    // Handle dessert removal if requested
    if (removeDessert && item.selectedDessert) {
      updates.selectedDessert = null;
      // Adjust price to remove dessert cost
      updates.price = item.price - item.selectedDessert.price;
    }
    
    // Handle bundle removal if requested
    if (removeBundle && item.bundleAccepted && item.bundleItems) {
      updates.bundleAccepted = false;
      updates.bundleItems = null;
      // Adjust price to remove bundle cost
      updates.price = item.price - item.bundleItems.bundlePrice;
    }
    
    // Save changes
    onSave(item.id, updates);
    onClose();
  };
  
  // Handle bundle selection
  const handleBundleSelection = (selectedSide: any, selectedDrink: any) => {
    setShowBundleModal(false);
    
    // Create updates object
    const updates: Partial<CartItem> = {
      bundleAccepted: true,
      bundleItems: {
        side: selectedSide ? {
          id: selectedSide.id,
          name: selectedSide.name,
          price: selectedSide.price
        } : null,
        drink: selectedDrink ? {
          id: selectedDrink.id,
          name: selectedDrink.name,
          price: selectedDrink.price
        } : null,
        bundlePrice: 5.99 // Default bundle price
      }
    };
    
    // Save changes
    onSave(item.id, updates);
    onClose();
  };
  
  // Handle quantity change
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-charcoal-800 rounded-lg max-w-md w-full shadow-xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-amber-800 to-red-800 p-4">
                <h2 className="text-xl font-bold text-white">Edit Order Item</h2>
              </div>
              
              {/* Content */}
              <form onSubmit={handleSubmit} className="p-5">
                {/* Item details */}
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-md overflow-hidden mr-4 flex-shrink-0">
                    <img
                      src={item.image_url || '/images/placeholder-food.jpg'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/placeholder-food.jpg';
                      }}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <p className="text-amber-500">${getItemTotalPrice().toFixed(2)}</p>
                    
                    {/* Show multi-meat plate info */}
                    {item.isMultiMeatPlate && item.secondMeat && (
                      <div className="mt-1 text-sm text-gray-300 flex items-center">
                        <span className="bg-amber-700 text-white text-xs px-1 rounded mr-1">2-MEAT</span>
                        With {item.secondMeat.name}
                      </div>
                    )}
                    
                    {/* Show options if any */}
                    {item.options && item.options.length > 0 && (
                      <div className="mt-1 text-sm text-gray-300">
                        {item.options.map((option: CartItemOption) => (
                          <div key={option.option_id}>
                            {option.option_name}
                            {option.price > 0 && ` (+$${option.price.toFixed(2)})`}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Show sides with option to edit */}
                <div className="mb-4 bg-charcoal-700 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-sm text-amber-400">Selected Sides</h4>
                    <button 
                      type="button" 
                      onClick={() => setShowSideModal(true)}
                      className="text-xs bg-amber-600 hover:bg-amber-500 text-white px-2 py-1 rounded"
                    >
                      {selectedSides.length > 0 ? 'Change Sides' : 'Add Sides'}
                    </button>
                  </div>
                  
                  {selectedSides.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {selectedSides.map((side: {id: string; name: string; price: number}, index: number) => (
                        <div key={index} className="text-sm bg-charcoal-600 p-2 rounded flex items-center">
                          <span className="w-4 h-4 mr-2 text-amber-500">•</span>
                          {side.name}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">No sides selected. Click "Add Sides" to select sides for your meal.</p>
                  )}
                </div>
                
                {/* Show dessert if any with option to remove */}
                {item.selectedDessert && (
                  <div className="mb-4 bg-charcoal-700 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-sm text-amber-400">Selected Dessert</h4>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="remove-dessert"
                          checked={removeDessert}
                          onChange={() => setRemoveDessert(!removeDessert)}
                          className="mr-2"
                        />
                        <label htmlFor="remove-dessert" className="text-sm text-gray-300">Remove</label>
                      </div>
                    </div>
                    <div className="flex justify-between items-center bg-charcoal-600 p-2 rounded">
                      <span className="text-sm">{item.selectedDessert.name}</span>
                      <span className="text-xs text-amber-500">+${item.selectedDessert.price.toFixed(2)}</span>
                    </div>
                  </div>
                )}
                
                {/* Show bundle items if any with options to edit or remove */}
                {item.bundleAccepted && item.bundleItems && (
                  <div className="mb-4 bg-charcoal-700 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-sm text-amber-400">Bundle Deal</h4>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="remove-bundle"
                          checked={removeBundle}
                          onChange={() => setRemoveBundle(!removeBundle)}
                          className="mr-2"
                        />
                        <label htmlFor="remove-bundle" className="text-sm text-gray-300">Remove</label>
                      </div>
                    </div>
                    
                    {/* Show bundle side */}
                    {item.bundleItems.side && (
                      <div className="flex justify-between items-center bg-charcoal-600 p-2 rounded mb-2">
                        <span className="text-sm">{item.bundleItems.side.name} (Side)</span>
                      </div>
                    )}
                    
                    {/* Show bundle drink */}
                    {item.bundleItems.drink && (
                      <div className="flex justify-between items-center bg-charcoal-600 p-2 rounded mb-2">
                        <span className="text-sm">{item.bundleItems.drink.name} (Drink)</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-amber-500">Bundle price: ${item.bundleItems.bundlePrice.toFixed(2)}</span>
                      {!removeBundle && (
                        <button 
                          type="button" 
                          onClick={() => setShowBundleModal(true)}
                          className="text-xs bg-amber-600 hover:bg-amber-500 text-white px-2 py-1 rounded"
                        >
                          Change Items
                        </button>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Add bundle if not already added */}
                {!item.bundleAccepted && (
                  <div className="mb-4">
                    <button 
                      type="button" 
                      onClick={() => setShowBundleModal(true)}
                      className="w-full bg-amber-600 hover:bg-amber-500 text-white p-2 rounded flex items-center justify-center"
                    >
                      <span className="mr-2">Add Drink & Side Bundle</span>
                      <span className="bg-white text-amber-600 text-xs px-2 py-1 rounded">SAVE $2.99</span>
                    </button>
                  </div>
                )}
                
                {/* Quantity */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Quantity</label>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="w-10 h-10 rounded-l-lg bg-charcoal-700 flex items-center justify-center hover:bg-charcoal-600"
                      disabled={quantity <= 1}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      className="w-16 h-10 text-center bg-charcoal-700 border-x border-charcoal-600 focus:outline-none"
                    />
                    
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="w-10 h-10 rounded-r-lg bg-charcoal-700 flex items-center justify-center hover:bg-charcoal-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Special instructions */}
                <div className="mb-6">
                  <label htmlFor="special-instructions" className="block text-sm font-medium mb-2">
                    Special Instructions
                  </label>
                  <textarea
                    id="special-instructions"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Any special requests?"
                    className="w-full h-24 px-3 py-2 bg-charcoal-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
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
                    type="submit"
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg font-medium transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
          
          {/* Bundle Selection Modal */}
          <BundleSelectionModal
            isOpen={showBundleModal}
            onClose={() => setShowBundleModal(false)}
            onConfirm={handleBundleSelection}
            availableSides={sides}
            availableDrinks={drinks}
            bundlePrice={5.99}
            originalPrice={8.98}
          />
          
          {/* Side Selection Modal */}
          <SideSelectionModal
            isOpen={showSideModal}
            onClose={() => setShowSideModal(false)}
            onConfirm={handleSideSelection}
            maxSides={maxSides}
            currentSides={selectedSides}
          />
        </>
      )}
    </AnimatePresence>
  );
};

export default EditCartItemModal;
