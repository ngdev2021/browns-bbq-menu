import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import { getMenuItemImagePath, getCacheBustedImageUrl } from '../lib/imageUtils';

// Step interface for the checkout process
type CheckoutStep = 'review' | 'details' | 'payment' | 'confirmation';

const Checkout: React.FC = () => {
  const router = useRouter();
  const { items, updateQuantity, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('review');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState<string>('');
  
  // Customer information state
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    orderType: 'pickup', // pickup or delivery
    address: '',
    specialInstructions: '',
  });

  // Payment information state
  const [paymentInfo, setPaymentInfo] = useState({
    method: 'card', // card, cash, or mobile
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    savePaymentInfo: false,
  });

  // Pickup time options
  const [pickupTimes, setPickupTimes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');

  // Calculate order totals
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.0825; // 8.25% tax
  const deliveryFee = customerInfo.orderType === 'delivery' ? 5.99 : 0;
  const total = subtotal + tax + deliveryFee;

  // Generate pickup time options
  useEffect(() => {
    const generatePickupTimes = () => {
      const times = [];
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      
      // Round to nearest 15 minutes and add 30 minutes for preparation
      let startMinute = Math.ceil(currentMinute / 15) * 15 + 30;
      let startHour = currentHour;
      
      if (startMinute >= 60) {
        startMinute -= 60;
        startHour += 1;
      }
      
      // Generate time slots for the next 3 hours
      for (let i = 0; i < 12; i++) {
        const hour = (startHour + Math.floor((startMinute + i * 15) / 60)) % 24;
        const minute = (startMinute + i * 15) % 60;
        
        const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
        const amPm = hour < 12 ? 'AM' : 'PM';
        const formattedTime = `${formattedHour}:${minute.toString().padStart(2, '0')} ${amPm}`;
        
        times.push(formattedTime);
      }
      
      setPickupTimes(times);
      setSelectedTime(times[0]);
    };
    
    generatePickupTimes();
  }, []);

  // Handle form input changes
  const handleCustomerInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    
    setPaymentInfo(prev => ({ 
      ...prev, 
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value 
    }));
  };

  // Navigate between steps
  const goToNextStep = () => {
    switch (currentStep) {
      case 'review':
        setCurrentStep('details');
        break;
      case 'details':
        setCurrentStep('payment');
        break;
      case 'payment':
        processOrder();
        break;
      default:
        break;
    }
  };

  const goToPreviousStep = () => {
    switch (currentStep) {
      case 'details':
        setCurrentStep('review');
        break;
      case 'payment':
        setCurrentStep('details');
        break;
      default:
        break;
    }
  };

  // Process the order
  const processOrder = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate API call to process order
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a random order ID
      const newOrderId = `BBQ-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      setOrderId(newOrderId);
      
      // Clear the cart
      clearCart();
      
      // Move to confirmation step
      setCurrentStep('confirmation');
    } catch (error) {
      console.error('Error processing order:', error);
      alert('There was an error processing your order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 'review':
        return renderReviewStep();
      case 'details':
        return renderDetailsStep();
      case 'payment':
        return renderPaymentStep();
      case 'confirmation':
        return renderConfirmationStep();
      default:
        return null;
    }
  };

  // Review Order Step
  const renderReviewStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-amber-700">Review Your Order</h2>
      
      {items.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <p className="mt-4 text-lg">Your cart is empty</p>
          <button 
            onClick={() => router.push('/')}
            className="mt-4 px-6 py-2 bg-amber-700 hover:bg-amber-600 rounded-md text-white"
          >
            Browse Menu
          </button>
        </div>
      ) : (
        <>
          <div className="bg-gray-100 rounded-lg p-4">
            <ul className="divide-y divide-gray-200">
              {items.map(item => (
                <li key={item.id} className="py-4 flex items-center">
                  <div className="w-16 h-16 rounded-md bg-gray-200 overflow-hidden relative flex-shrink-0">
                    <img 
                      src={getCacheBustedImageUrl(getMenuItemImagePath(item.image_url))} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/placeholder-food.jpg';
                      }}
                    />
                  </div>
                  
                  <div className="ml-4 flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-gray-500">${item.price.toFixed(2)} × {item.quantity}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    
                    <span className="w-6 text-center">{item.quantity}</span>
                    
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
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
          </div>
          
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (8.25%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-300 my-2 pt-2 flex justify-between font-bold">
                <span>Total</span>
                <span>${(subtotal + tax).toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between pt-4">
            <button 
              onClick={() => router.push('/')}
              className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Back to Menu
            </button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={goToNextStep}
              className="px-6 py-2 bg-amber-700 hover:bg-amber-600 rounded-md text-white"
            >
              Continue to Details
            </motion.button>
          </div>
        </>
      )}
    </div>
  );

  // Customer Details Step
  const renderDetailsStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-amber-700">Order Details</h2>
      
      <div className="bg-gray-100 rounded-lg p-4">
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={customerInfo.name}
              onChange={handleCustomerInfoChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={customerInfo.email}
              onChange={handleCustomerInfoChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={customerInfo.phone}
              onChange={handleCustomerInfoChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="orderType" className="block text-sm font-medium text-gray-700">Order Type</label>
            <select
              id="orderType"
              name="orderType"
              value={customerInfo.orderType}
              onChange={handleCustomerInfoChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="pickup">Pickup</option>
              <option value="delivery">Delivery (+$5.99)</option>
            </select>
          </div>
          
          {customerInfo.orderType === 'delivery' && (
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Delivery Address</label>
              <textarea
                id="address"
                name="address"
                value={customerInfo.address}
                onChange={handleCustomerInfoChange}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                required
              />
            </div>
          )}
          
          {customerInfo.orderType === 'pickup' && (
            <div>
              <label htmlFor="pickupTime" className="block text-sm font-medium text-gray-700">Pickup Time</label>
              <select
                id="pickupTime"
                name="pickupTime"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
              >
                {pickupTimes.map((time, index) => (
                  <option key={index} value={time}>{time}</option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">Please allow 30 minutes for preparation.</p>
            </div>
          )}
          
          <div>
            <label htmlFor="specialInstructions" className="block text-sm font-medium text-gray-700">Special Instructions</label>
            <textarea
              id="specialInstructions"
              name="specialInstructions"
              value={customerInfo.specialInstructions}
              onChange={handleCustomerInfoChange}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
              placeholder="Allergies, special requests, etc."
            />
          </div>
        </form>
      </div>
      
      <div className="flex justify-between pt-4">
        <button 
          onClick={goToPreviousStep}
          className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
        >
          Back to Review
        </button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={goToNextStep}
          className="px-6 py-2 bg-amber-700 hover:bg-amber-600 rounded-md text-white"
          disabled={!customerInfo.name || !customerInfo.email || !customerInfo.phone || (customerInfo.orderType === 'delivery' && !customerInfo.address)}
        >
          Continue to Payment
        </motion.button>
      </div>
    </div>
  );

  // Payment Step
  const renderPaymentStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-amber-700">Payment Information</h2>
      
      <div className="bg-gray-100 rounded-lg p-4">
        <form className="space-y-4">
          <div>
            <label htmlFor="method" className="block text-sm font-medium text-gray-700">Payment Method</label>
            <select
              id="method"
              name="method"
              value={paymentInfo.method}
              onChange={handlePaymentInfoChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="card">Credit/Debit Card</option>
              <option value="cash">Cash on Pickup/Delivery</option>
              <option value="mobile">Mobile Payment (CashApp, Venmo)</option>
            </select>
          </div>
          
          {paymentInfo.method === 'card' && (
            <>
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Card Number</label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={paymentInfo.cardNumber}
                  onChange={handlePaymentInfoChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700">Expiration Date</label>
                  <input
                    type="text"
                    id="cardExpiry"
                    name="cardExpiry"
                    value={paymentInfo.cardExpiry}
                    onChange={handlePaymentInfoChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                    placeholder="MM/YY"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="cardCvc" className="block text-sm font-medium text-gray-700">CVC</label>
                  <input
                    type="text"
                    id="cardCvc"
                    name="cardCvc"
                    value={paymentInfo.cardCvc}
                    onChange={handlePaymentInfoChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                    placeholder="123"
                    required
                  />
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="savePaymentInfo"
                  name="savePaymentInfo"
                  checked={paymentInfo.savePaymentInfo}
                  onChange={handlePaymentInfoChange}
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                />
                <label htmlFor="savePaymentInfo" className="ml-2 block text-sm text-gray-700">
                  Save payment information for future orders
                </label>
              </div>
            </>
          )}
          
          {paymentInfo.method === 'mobile' && (
            <div className="p-4 bg-white rounded-md">
              <p className="font-medium">Mobile Payment Instructions:</p>
              <p className="text-sm text-gray-600 mt-2">Send payment to:</p>
              <p className="font-bold mt-1">CashApp: $brownroscoe</p>
              <p className="text-sm text-gray-600 mt-2">Please include your order number in the payment note.</p>
            </div>
          )}
        </form>
      </div>
      
      <div className="bg-gray-100 rounded-lg p-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax (8.25%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          {customerInfo.orderType === 'delivery' && (
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Fee</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
          )}
          <div className="border-t border-gray-300 my-2 pt-2 flex justify-between font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between pt-4">
        <button 
          onClick={goToPreviousStep}
          className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
        >
          Back to Details
        </button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={goToNextStep}
          className="px-6 py-2 bg-amber-700 hover:bg-amber-600 rounded-md text-white"
          disabled={isProcessing || (paymentInfo.method === 'card' && (!paymentInfo.cardNumber || !paymentInfo.cardExpiry || !paymentInfo.cardCvc))}
        >
          {isProcessing ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            'Place Order'
          )}
        </motion.button>
      </div>
    </div>
  );

  // Order Confirmation Step
  const renderConfirmationStep = () => (
    <div className="space-y-6 text-center">
      <div className="bg-green-100 text-green-800 p-4 rounded-lg">
        <svg className="w-16 h-16 mx-auto text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <h2 className="text-2xl font-bold mt-4">Order Confirmed!</h2>
        <p className="mt-2">Your order has been received and is being prepared.</p>
      </div>
      
      <div className="bg-gray-100 rounded-lg p-6">
        <h3 className="text-xl font-bold text-amber-700">Order Details</h3>
        <div className="mt-4 text-left">
          <p><span className="font-medium">Order Number:</span> {orderId}</p>
          <p><span className="font-medium">Name:</span> {customerInfo.name}</p>
          <p><span className="font-medium">Email:</span> {customerInfo.email}</p>
          <p><span className="font-medium">Phone:</span> {customerInfo.phone}</p>
          <p><span className="font-medium">Order Type:</span> {customerInfo.orderType === 'pickup' ? 'Pickup' : 'Delivery'}</p>
          
          {customerInfo.orderType === 'pickup' && (
            <p><span className="font-medium">Pickup Time:</span> {selectedTime}</p>
          )}
          
          {customerInfo.orderType === 'delivery' && (
            <p><span className="font-medium">Delivery Address:</span> {customerInfo.address}</p>
          )}
          
          {customerInfo.specialInstructions && (
            <p><span className="font-medium">Special Instructions:</span> {customerInfo.specialInstructions}</p>
          )}
          
          <p className="mt-2"><span className="font-medium">Payment Method:</span> {
            paymentInfo.method === 'card' ? 'Credit/Debit Card' : 
            paymentInfo.method === 'cash' ? 'Cash on Pickup/Delivery' : 
            'Mobile Payment'
          }</p>
          
          <p className="mt-2"><span className="font-medium">Total Amount:</span> ${total.toFixed(2)}</p>
        </div>
      </div>
      
      <div className="mt-6">
        <p className="text-gray-600">A confirmation email has been sent to {customerInfo.email}</p>
        <p className="text-gray-600 mt-1">You will receive updates about your order status via email and text message.</p>
        
        <div className="mt-6">
          <button 
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-amber-700 hover:bg-amber-600 rounded-md text-white"
          >
            Return to Menu
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <title>Checkout | Brown's Bar-B-Cue</title>
        <meta name="description" content="Complete your order from Brown's Bar-B-Cue" />
      </Head>
      
      <main className="container max-w-3xl mx-auto py-12 px-4">
        {/* Checkout Progress */}
        {currentStep !== 'confirmation' && (
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className={`flex flex-col items-center ${currentStep === 'review' ? 'text-amber-700' : 'text-gray-500'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'review' ? 'bg-amber-700 text-white' : 'bg-gray-200'}`}>
                  1
                </div>
                <span className="text-sm mt-1">Review</span>
              </div>
              
              <div className={`flex-1 h-1 mx-2 ${currentStep === 'review' ? 'bg-gray-200' : 'bg-amber-700'}`}></div>
              
              <div className={`flex flex-col items-center ${currentStep === 'details' ? 'text-amber-700' : 'text-gray-500'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'details' ? 'bg-amber-700 text-white' : currentStep === 'review' ? 'bg-gray-200' : 'bg-amber-700 text-white'}`}>
                  2
                </div>
                <span className="text-sm mt-1">Details</span>
              </div>
              
              <div className={`flex-1 h-1 mx-2 ${currentStep === 'payment' ? 'bg-amber-700' : 'bg-gray-200'}`}></div>
              
              <div className={`flex flex-col items-center ${currentStep === 'payment' ? 'text-amber-700' : 'text-gray-500'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'payment' ? 'bg-amber-700 text-white' : 'bg-gray-200'}`}>
                  3
                </div>
                <span className="text-sm mt-1">Payment</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Current Step Content */}
        {renderStep()}
      </main>
    </>
  );
};

export default Checkout;
