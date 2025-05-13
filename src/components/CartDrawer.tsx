import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { getMenuItemImagePath, getCacheBustedImageUrl } from '../lib/imageUtils';
import EditCartItemModal from './EditCartItemModal';

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
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onEditItem: (id: string, updates: Partial<CartItem>) => void;
  onCheckout: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onEditItem,
  onCheckout
}) => {
  // State for the edit modal
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Open edit modal for an item
  const handleEditItem = (item: CartItem) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };
  
  // Close edit modal
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingItem(null);
  };
  // Ref for close button to manage focus
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  
  // Handle keyboard events for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      // Close on ESC key
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    // Focus management
    if (isOpen && closeButtonRef.current) {
      // Save the previously focused element
      const previouslyFocused = document.activeElement;
      
      // Focus the close button when drawer opens
      closeButtonRef.current.focus();
      
      // Return focus when drawer closes
      return () => {
        if (previouslyFocused instanceof HTMLElement) {
          previouslyFocused.focus();
        }
      };
    }
    
    // Add keyboard event listener
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);
  
  // Calculate subtotal
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // Calculate tax (assuming 8.25%)
  const tax = subtotal * 0.0825;
  
  // Calculate total
  const total = subtotal + tax;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Drawer */}
      <motion.aside
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? 0 : '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed top-0 right-0 h-full w-full max-w-md bg-charcoal-900 shadow-xl z-50 flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
      >
        {/* Header */}
        <div className="p-4 border-b border-charcoal-700 flex justify-between items-center">
          <h2 id="cart-title" className="text-xl font-bold">Your Order</h2>
          <button 
            ref={closeButtonRef}
            onClick={onClose}
            className="p-2 rounded-full hover:bg-charcoal-800"
            aria-label="Close cart"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Cart items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-charcoal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="mt-4 text-lg">Your cart is empty</p>
              <button 
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-teal-500 hover:bg-teal-400 rounded-md"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map(item => (
                <li key={item.id} className="flex items-center gap-4 bg-charcoal-800 p-3 rounded-lg">
                  {/* Item image */}
                  <div className="w-16 h-16 rounded-md bg-charcoal-700 overflow-hidden relative flex-shrink-0">
                    <img 
                      src={getCacheBustedImageUrl(getMenuItemImagePath(item.image_url))} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fall back to placeholder if image fails to load
                        (e.target as HTMLImageElement).src = '/images/placeholder-food.jpg';
                      }}
                    />
                  </div>
                  
                  {/* Item details */}
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-teal-400">${item.price.toFixed(2)}</p>
                    
                    {/* Show options if any */}
                    {item.options && item.options.length > 0 && (
                      <div className="mt-1 text-xs text-gray-400">
                        {item.options.map((option) => (
                          <div key={option.option_id}>
                            {option.option_name}
                            {option.price > 0 && ` (+$${option.price.toFixed(2)})`}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Show second meat for multi-meat plates */}
                    {item.isMultiMeatPlate && item.secondMeat && (
                      <div className="mt-1 text-xs text-gray-400">
                        <div className="font-medium text-gray-300 flex items-center">
                          <span className="bg-amber-700 text-white text-xs px-1 rounded mr-1">2-MEAT</span> 
                          With {item.secondMeat.name}
                        </div>
                      </div>
                    )}
                    
                    {/* Show selected sides */}
                    {item.selectedSides && item.selectedSides.length > 0 && (
                      <div className="mt-1 text-xs text-gray-400">
                        <div className="font-medium text-gray-300">Sides:</div>
                        {item.selectedSides.map((side: {id: string; name: string; price: number}, index: number) => (
                          <div key={index} className="flex justify-between">
                            <span>{side.name}</span>
                            <span className="text-amber-500">Included</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Show selected dessert */}
                    {item.selectedDessert && (
                      <div className="mt-1 text-xs text-gray-400">
                        <div className="font-medium text-gray-300">Dessert:</div>
                        <div className="flex justify-between">
                          <span>{item.selectedDessert.name}</span>
                          <span className="text-amber-500">+${item.selectedDessert.price.toFixed(2)}</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Show bundle info */}
                    {item.bundleAccepted && (
                      <div className="mt-1 text-xs text-gray-400">
                        <div className="font-medium text-amber-500 flex items-center">
                          <span className="bg-amber-700 text-white text-xs px-1 rounded mr-1">BUNDLE</span> 
                          Special Bundle Deal
                        </div>
                        {item.bundleItems && (
                          <div className="ml-2 mt-1">
                            {item.bundleItems.side && (
                              <div className="flex justify-between">
                                <span>• {item.bundleItems.side.name} (Side)</span>
                              </div>
                            )}
                            {item.bundleItems.drink && (
                              <div className="flex justify-between">
                                <span>• {item.bundleItems.drink.name} (Drink)</span>
                              </div>
                            )}
                            <div className="text-amber-500 mt-1">
                              Bundle price: ${item.bundleItems.bundlePrice.toFixed(2)}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Show combo items */}
                    {item.isCombo && item.combo_items && (
                      <div className="mt-1 text-xs text-gray-400">
                        <div className="font-medium text-gray-300">Includes:</div>
                        {item.combo_items.map((comboItem, index) => (
                          <div key={index}>
                            {comboItem.item_name}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Show special instructions */}
                    {item.special_instructions && (
                      <div className="mt-1 text-xs italic text-gray-400">
                        Note: {item.special_instructions}
                      </div>
                    )}
                  </div>
                  
                  {/* Quantity controls and edit button */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-charcoal-700 flex items-center justify-center hover:bg-charcoal-600"
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    
                    <span className="w-6 text-center">{item.quantity}</span>
                    
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-charcoal-700 flex items-center justify-center hover:bg-charcoal-600"
                      aria-label="Increase quantity"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                    
                    <button
                      onClick={() => handleEditItem(item)}
                      className="ml-2 w-8 h-8 rounded-full bg-amber-700 flex items-center justify-center hover:bg-amber-600"
                      aria-label="Edit item"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Footer with totals and checkout */}
        {items.length > 0 && (
          <div className="p-4 border-t border-charcoal-700">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-charcoal-300">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-300">Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onCheckout}
              className="w-full py-3 bg-teal-500 hover:bg-teal-400 rounded-lg font-bold text-white"
            >
              Proceed to Order
            </motion.button>
          </div>
        )}
      </motion.aside>
      
      {/* Edit Item Modal */}
      {editingItem && (
        <EditCartItemModal
          item={editingItem}
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSave={onEditItem}
        />
      )}
    </>
  );
};

export default CartDrawer;