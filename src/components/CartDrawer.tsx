import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onCheckout: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onCheckout
}) => {
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
                      src={item.image_url} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Item details */}
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-teal-400">${item.price.toFixed(2)}</p>
                  </div>
                  
                  {/* Quantity controls */}
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
    </>
  );
};

export default CartDrawer;