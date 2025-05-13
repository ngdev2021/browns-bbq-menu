import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useCart } from '../../contexts/CartContext';
import { getUpsellRecommendations } from '../../lib/upsellEngine';

const OrderReviewPage: React.FC = () => {
  const router = useRouter();
  const { items: cartItems, updateQuantity } = useCart();
  
  // State for upsell recommendations
  const [upsellRecommendations, setUpsellRecommendations] = useState<any[]>([]);
  
  // Toast notification
  const [toast, setToast] = useState({ message: '', visible: false });
  
  // Calculate subtotal, tax, and total
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const taxRate = 0.0825; // 8.25% tax rate
  const tax = subtotal * taxRate;
  const total = subtotal + tax;
  
  // Get upsell recommendations based on cart contents
  useEffect(() => {
    if (cartItems.length > 0) {
      const recommendations = getUpsellRecommendations(cartItems, [], 1);
      setUpsellRecommendations(recommendations);
    }
  }, [cartItems]);
  
  // Handle quantity change
  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity === 0) {
      // Show confirmation before removing
      if (window.confirm('Remove this item from your order?')) {
        updateQuantity(id, 0); // Set quantity to 0 to remove item
      }
    } else {
      updateQuantity(id, quantity);
    }
  };
  
  // Handle continue to next step
  const handleContinue = () => {
    if (cartItems.length === 0) {
      setToast({ message: 'Your cart is empty. Please add items before checkout.', visible: true });
      setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
      return;
    }
    
    router.push('/checkout/details');
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };
  
  return (
    <>
      <Head>
        <title>Review Your Order | Brown's Bar-B-Cue</title>
        <meta name="description" content="Review your order from Brown's Bar-B-Cue." />
      </Head>
      
      <div className="min-h-screen bg-charcoal-900 text-white">
        {/* Header */}
        <header className="bg-charcoal-800 shadow-md">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <button 
                onClick={() => router.push('/menu')}
                className="mr-4 text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-xl font-bold">Checkout</h1>
            </div>
            
            <div className="text-amber-400 font-bold">
              ${total.toFixed(2)}
            </div>
          </div>
        </header>
        
        {/* Checkout Progress */}
        <div className="bg-charcoal-800 border-t border-charcoal-700 py-2">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between text-sm">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-charcoal-900 flex items-center justify-center font-bold">1</div>
                <span className="ml-2 font-bold">Review</span>
              </div>
              <div className="flex items-center opacity-50">
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center font-bold">2</div>
                <span className="ml-2">Details</span>
              </div>
              <div className="flex items-center opacity-50">
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center font-bold">3</div>
                <span className="ml-2">Payment</span>
              </div>
              <div className="flex items-center opacity-50">
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center font-bold">4</div>
                <span className="ml-2">Confirm</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-6">
          <motion.div 
            className="mb-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <h2 className="text-2xl font-bold mb-6">Review Your Order</h2>
            
            {cartItems.length === 0 ? (
              <div className="bg-charcoal-800 rounded-lg p-6 text-center">
                <p className="text-gray-400 mb-4">Your cart is empty</p>
                <button 
                  onClick={() => router.push('/menu')}
                  className="px-6 py-2 bg-red-700 hover:bg-red-600 rounded-lg font-bold transition-colors"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <div className="bg-charcoal-800 rounded-lg p-6 shadow-lg">
                {/* Order Items */}
                <div className="mb-6">
                  {cartItems.map((item, index) => (
                    <motion.div 
                      key={item.id}
                      className={`flex items-start py-4 ${index !== cartItems.length - 1 ? 'border-b border-charcoal-700' : ''}`}
                      variants={itemVariants}
                    >
                      {/* Item Image */}
                      <div className="w-20 h-20 rounded-md overflow-hidden mr-4 flex-shrink-0">
                        <img 
                          src={item.image_url} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/placeholder-food.jpg';
                          }}
                        />
                      </div>
                      
                      {/* Item Details */}
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <h3 className="font-bold">{item.name}</h3>
                          <span className="text-amber-400 font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                        
                        {/* Show customization options */}
                        {item.options && item.options.length > 0 && (
                          <div className="text-sm text-gray-400 mb-2">
                            {item.options.map((option: any, optIndex: number) => (
                              <div key={optIndex}>
                                {option.group_name}: {option.option_name}
                                {option.price > 0 && ` (+$${option.price.toFixed(2)})`}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Show combo items */}
                        {item.isCombo && item.combo_items && (
                          <div className="text-sm text-gray-400 mb-2">
                            <div className="font-medium text-gray-300">Includes:</div>
                            {item.combo_items.map((comboItem: any, comboIndex: number) => (
                              <div key={comboIndex}>
                                {comboItem.item_name}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Special instructions */}
                        {item.special_instructions && (
                          <div className="text-sm italic text-gray-400 mb-2">
                            Note: {item.special_instructions}
                          </div>
                        )}
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center mt-2">
                          <button
                            className="w-8 h-8 bg-charcoal-700 rounded-l-md flex items-center justify-center hover:bg-charcoal-600 transition-colors"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                          <span className="w-10 text-center">{item.quantity}</span>
                          <button
                            className="w-8 h-8 bg-charcoal-700 rounded-r-md flex items-center justify-center hover:bg-charcoal-600 transition-colors"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                          
                          <button
                            className="ml-4 text-sm text-gray-400 hover:text-red-500 transition-colors"
                            onClick={() => updateQuantity(item.id, 0)}
                          >
                            Remove
                          </button>
                          
                          <button
                            className="ml-4 text-sm text-gray-400 hover:text-amber-400 transition-colors"
                            onClick={() => router.push(`/configure-item/${item.id}`)}
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Order Summary */}
                <div className="border-t border-charcoal-700 pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Tax (8.25%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg mt-4">
                    <span>Total</span>
                    <span className="text-amber-400">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Last-Minute Add-Ons */}
            {upsellRecommendations.length > 0 && cartItems.length > 0 && (
              <motion.div 
                className="mt-8 bg-charcoal-800 rounded-lg p-6 shadow-lg"
                variants={containerVariants}
              >
                <h3 className="text-xl font-bold text-amber-500 mb-3">Need anything else?</h3>
                <p className="text-gray-300 mb-4">These items are popular with your order</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {upsellRecommendations[0].items.slice(0, 3).map((item: any) => (
                    <motion.div 
                      key={item.id}
                      className="bg-charcoal-700 rounded-lg p-3 flex items-center hover:bg-charcoal-600 cursor-pointer transition-colors"
                      onClick={() => {
                        const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
                        if (existingItem) {
                          updateQuantity(item.id, existingItem.quantity + 1);
                        } else {
                          // Add item to cart
                          // This would call addItem from the cart context
                        }
                        
                        setToast({ message: `${item.name} added to order!`, visible: true });
                        setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
                      }}
                      variants={itemVariants}
                    >
                      <div className="w-16 h-16 rounded-md overflow-hidden mr-3">
                        <img 
                          src={item.image_url} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/placeholder-food.jpg';
                          }}
                        />
                      </div>
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-400">{item.description?.substring(0, 60)}...</p>
                        <span className="text-amber-500 font-medium">${item.price.toFixed(2)}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-between">
              <button
                onClick={() => router.push('/menu')}
                className="px-6 py-3 bg-charcoal-700 hover:bg-charcoal-600 rounded-lg transition-colors"
              >
                Continue Shopping
              </button>
              
              <button
                onClick={handleContinue}
                className="px-6 py-3 bg-red-700 hover:bg-red-600 rounded-lg font-bold transition-colors"
                disabled={cartItems.length === 0}
              >
                Continue to Details
              </button>
            </div>
          </motion.div>
        </main>
        
        {/* Toast Notification */}
        {toast.visible && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-700 text-white px-4 py-2 rounded-lg shadow-lg">
            {toast.message}
          </div>
        )}
      </div>
    </>
  );
};

export default OrderReviewPage;
