import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useCart } from '../../contexts/CartContext';

const OrderConfirmationPage: React.FC = () => {
  const router = useRouter();
  const { clearCart } = useCart();
  
  // State for order details
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load order details from localStorage
  useEffect(() => {
    const savedOrderDetails = localStorage.getItem('orderDetails');
    if (savedOrderDetails) {
      try {
        const parsedDetails = JSON.parse(savedOrderDetails);
        setOrderDetails(parsedDetails);
      } catch (error) {
        console.error('Error parsing saved order details:', error);
      }
    }
    
    // Clear the cart after successful order
    clearCart();
    
    setIsLoading(false);
    
    // Simulate order status updates
    const statusInterval = setInterval(() => {
      setOrderDetails((prev: any) => {
        if (!prev) return null;
        
        const currentStatus = prev.status || 'received';
        let newStatus = currentStatus;
        
        // Progress through statuses
        if (currentStatus === 'received') {
          newStatus = 'preparing';
        } else if (currentStatus === 'preparing') {
          newStatus = prev.customerDetails.fulfillmentType === 'delivery' ? 'out_for_delivery' : 'ready_for_pickup';
        }
        
        return {
          ...prev,
          status: newStatus
        };
      });
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(statusInterval);
  }, [clearCart]);
  
  // Handle "Track Order" button click
  const handleTrackOrder = () => {
    router.push('/order-status');
  };
  
  // Handle "Back to Menu" button click
  const handleBackToMenu = () => {
    router.push('/menu');
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
  
  // Get status text and icon
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'received':
        return { text: 'Order Received', icon: '📝' };
      case 'preparing':
        return { text: 'Preparing Your Order', icon: '👨‍🍳' };
      case 'ready_for_pickup':
        return { text: 'Ready for Pickup', icon: '✅' };
      case 'out_for_delivery':
        return { text: 'Out for Delivery', icon: '🚚' };
      default:
        return { text: 'Order Received', icon: '📝' };
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-charcoal-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }
  
  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-charcoal-900 text-white flex items-center justify-center">
        <div className="bg-charcoal-800 rounded-lg p-6 max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">No Order Found</h2>
          <p className="text-gray-400 mb-6">We couldn't find any recent order details.</p>
          <button
            onClick={handleBackToMenu}
            className="px-6 py-3 bg-red-700 hover:bg-red-600 rounded-lg font-bold transition-colors"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }
  
  const statusInfo = getStatusInfo(orderDetails.status || 'received');
  
  return (
    <>
      <Head>
        <title>Order Confirmation | Brown's Bar-B-Cue</title>
        <meta name="description" content="Your order has been confirmed at Brown's Bar-B-Cue." />
      </Head>
      
      <div className="min-h-screen bg-charcoal-900 text-white">
        {/* Header */}
        <header className="bg-charcoal-800 shadow-md">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <img 
                src="/images/logo.png" 
                alt="Brown's Bar-B-Cue Logo" 
                className="h-12 mr-4 cursor-pointer"
                onClick={() => router.push('/welcome')}
              />
              <h1 className="text-xl font-bold hidden sm:block">Brown's Bar-B-Cue</h1>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-6">
          <motion.div 
            className="mb-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* Success Message */}
            <motion.div 
              className="bg-green-800 bg-opacity-30 border border-green-600 rounded-lg p-6 text-center mb-8"
              variants={itemVariants}
            >
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold mb-2">Thank You for Your Order!</h2>
              <p className="text-xl text-gray-300">Your order has been confirmed and is being prepared.</p>
            </motion.div>
            
            {/* Order Status */}
            <motion.div 
              className="bg-charcoal-800 rounded-lg p-6 shadow-lg mb-8"
              variants={itemVariants}
            >
              <h3 className="text-xl font-bold mb-4">Order Status</h3>
              
              <div className="flex items-center justify-center text-center p-4 bg-charcoal-700 rounded-lg">
                <div>
                  <div className="text-4xl mb-2">{statusInfo.icon}</div>
                  <div className="text-xl font-bold">{statusInfo.text}</div>
                  <div className="text-gray-400 mt-2">
                    Estimated {orderDetails.customerDetails.fulfillmentType === 'delivery' ? 'Delivery' : 'Pickup'}: {orderDetails.estimatedTime}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleTrackOrder}
                  className="px-6 py-3 bg-amber-600 hover:bg-amber-500 rounded-lg font-bold transition-colors"
                >
                  Track Your Order
                </button>
              </div>
            </motion.div>
            
            {/* Order Details */}
            <motion.div 
              className="bg-charcoal-800 rounded-lg p-6 shadow-lg mb-8"
              variants={itemVariants}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Order Details</h3>
                <div className="text-amber-400 font-medium">Order #{orderDetails.orderNumber}</div>
              </div>
              
              {/* Order Items */}
              <div className="mb-6">
                {orderDetails.items.map((item: any, index: number) => (
                  <div 
                    key={index}
                    className={`py-3 ${index !== orderDetails.items.length - 1 ? 'border-b border-charcoal-700' : ''}`}
                  >
                    <div className="flex justify-between mb-1">
                      <div className="font-medium">
                        {item.quantity}x {item.name}
                      </div>
                      <div>${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                    
                    {/* Show customization options */}
                    {item.options && item.options.length > 0 && (
                      <div className="text-sm text-gray-400 ml-4">
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
                      <div className="text-sm text-gray-400 ml-4">
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
                      <div className="text-sm italic text-gray-400 ml-4">
                        Note: {item.special_instructions}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Order Summary */}
              <div className="border-t border-charcoal-700 pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Subtotal</span>
                  <span>${orderDetails.paymentDetails.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Tax</span>
                  <span>Included</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Tip</span>
                  <span>${orderDetails.paymentDetails.tipAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-4">
                  <span>Total</span>
                  <span className="text-amber-400">${orderDetails.paymentDetails.total.toFixed(2)}</span>
                </div>
              </div>
            </motion.div>
            
            {/* Customer Information */}
            <motion.div 
              className="bg-charcoal-800 rounded-lg p-6 shadow-lg mb-8"
              variants={itemVariants}
            >
              <h3 className="text-xl font-bold mb-4">Customer Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-amber-400 mb-2">Contact Details</h4>
                  <p className="mb-1">{orderDetails.customerDetails.name}</p>
                  <p className="mb-1">{orderDetails.customerDetails.phone}</p>
                  <p className="mb-1">{orderDetails.customerDetails.email}</p>
                </div>
                
                <div>
                  <h4 className="font-bold text-amber-400 mb-2">
                    {orderDetails.customerDetails.fulfillmentType === 'delivery' ? 'Delivery' : 'Pickup'} Details
                  </h4>
                  
                  {orderDetails.customerDetails.fulfillmentType === 'delivery' ? (
                    <>
                      <p className="mb-1">{orderDetails.customerDetails.address.street}</p>
                      {orderDetails.customerDetails.address.apt && (
                        <p className="mb-1">Apt/Suite: {orderDetails.customerDetails.address.apt}</p>
                      )}
                      <p className="mb-1">
                        {orderDetails.customerDetails.address.city}, {orderDetails.customerDetails.address.state} {orderDetails.customerDetails.address.zip}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="mb-1">Pickup at Brown's Bar-B-Cue</p>
                      <p className="mb-1">123 BBQ Lane, Austin, TX</p>
                      <p className="mb-1">
                        Time: {orderDetails.customerDetails.timeSlot === 'asap' 
                          ? 'As soon as possible' 
                          : orderDetails.customerDetails.timeSlot}
                      </p>
                    </>
                  )}
                </div>
              </div>
              
              {orderDetails.customerDetails.specialInstructions && (
                <div className="mt-4">
                  <h4 className="font-bold text-amber-400 mb-2">Special Instructions</h4>
                  <p className="italic text-gray-300">{orderDetails.customerDetails.specialInstructions}</p>
                </div>
              )}
            </motion.div>
            
            {/* Map and Directions (for pickup orders) */}
            {orderDetails.customerDetails.fulfillmentType === 'pickup' && (
              <motion.div 
                className="bg-charcoal-800 rounded-lg p-6 shadow-lg mb-8"
                variants={itemVariants}
              >
                <h3 className="text-xl font-bold mb-4">Pickup Location</h3>
                
                <div className="bg-gray-700 h-64 rounded-lg mb-4 overflow-hidden">
                  {/* This would be a real map in production */}
                  <div className="w-full h-full flex items-center justify-center bg-charcoal-700">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🗺️</div>
                      <div className="text-gray-400">Map would appear here</div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="mb-4">Brown's Bar-B-Cue - 123 BBQ Lane, Austin, TX</p>
                  <button
                    className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-lg font-medium transition-colors"
                    onClick={() => window.open('https://maps.google.com', '_blank')}
                  >
                    Get Directions
                  </button>
                </div>
              </motion.div>
            )}
            
            {/* Social Share */}
            <motion.div 
              className="bg-charcoal-800 rounded-lg p-6 shadow-lg mb-8 text-center"
              variants={itemVariants}
            >
              <h3 className="text-xl font-bold mb-4">Share Your Order</h3>
              <p className="text-gray-300 mb-4">Tag us for a chance to win a free meal!</p>
              
              <div className="flex justify-center gap-4">
                <button
                  className="p-3 bg-blue-600 hover:bg-blue-500 rounded-full transition-colors"
                  onClick={() => window.open('https://facebook.com', '_blank')}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
                  </svg>
                </button>
                
                <button
                  className="p-3 bg-pink-600 hover:bg-pink-500 rounded-full transition-colors"
                  onClick={() => window.open('https://instagram.com', '_blank')}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </button>
                
                <button
                  className="p-3 bg-blue-400 hover:bg-blue-300 rounded-full transition-colors"
                  onClick={() => window.open('https://twitter.com', '_blank')}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </button>
              </div>
            </motion.div>
            
            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={handleTrackOrder}
                className="px-6 py-3 bg-amber-600 hover:bg-amber-500 rounded-lg font-bold transition-colors"
              >
                Track Your Order
              </button>
              
              <button
                onClick={handleBackToMenu}
                className="px-6 py-3 bg-charcoal-700 hover:bg-charcoal-600 rounded-lg transition-colors"
              >
                Back to Menu
              </button>
            </div>
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default OrderConfirmationPage;
