import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useCart } from '../../contexts/CartContext';

// Define payment methods
const PAYMENT_METHODS = [
  { id: 'credit-card', name: 'Credit Card', icon: '💳' },
  { id: 'apple-pay', name: 'Apple Pay', icon: '🍎' },
  { id: 'google-pay', name: 'Google Pay', icon: '🔍' },
  { id: 'cash', name: 'Cash on Pickup', icon: '💵' }
];

// Define tip options
const TIP_OPTIONS = [
  { id: 'tip-0', percentage: 0, label: 'No Tip' },
  { id: 'tip-15', percentage: 15, label: '15%' },
  { id: 'tip-18', percentage: 18, label: '18%' },
  { id: 'tip-20', percentage: 20, label: '20%' },
  { id: 'tip-25', percentage: 25, label: '25%' },
  { id: 'tip-custom', percentage: -1, label: 'Custom' }
];

interface PaymentDetails {
  paymentMethod: string;
  tipPercentage: number;
  customTipAmount: number;
  cardDetails?: {
    number: string;
    name: string;
    expiry: string;
    cvc: string;
  };
  savePaymentInfo: boolean;
}

const PaymentPage: React.FC = () => {
  const router = useRouter();
  const { items: cartItems } = useCart();
  
  // Get customer details from localStorage
  const [customerDetails, setCustomerDetails] = useState<any>(null);
  
  // Calculate subtotal, tax, and total
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const taxRate = 0.0825; // 8.25% tax rate
  const tax = subtotal * taxRate;
  
  // State for payment details
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    paymentMethod: 'credit-card',
    tipPercentage: 18, // Default to 18%
    customTipAmount: 0,
    cardDetails: {
      number: '',
      name: '',
      expiry: '',
      cvc: ''
    },
    savePaymentInfo: true
  });
  
  // Calculate tip and total
  const tipAmount = paymentDetails.tipPercentage === -1 
    ? paymentDetails.customTipAmount 
    : (subtotal * (paymentDetails.tipPercentage / 100));
  const total = subtotal + tax + tipAmount;
  
  // State for form validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  // Check if cart is empty and redirect if needed
  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/checkout/review');
      return;
    }
    
    // Load customer details
    const savedDetails = localStorage.getItem('customerDetails');
    if (savedDetails) {
      try {
        const parsedDetails = JSON.parse(savedDetails);
        setCustomerDetails(parsedDetails);
      } catch (error) {
        console.error('Error parsing saved customer details:', error);
        router.push('/checkout/details');
      }
    } else {
      // Redirect to details page if no customer details
      router.push('/checkout/details');
    }
    
    // Try to load saved payment details from localStorage
    const savedPayment = localStorage.getItem('paymentDetails');
    if (savedPayment) {
      try {
        const parsedPayment = JSON.parse(savedPayment);
        setPaymentDetails(parsedPayment);
      } catch (error) {
        console.error('Error parsing saved payment details:', error);
      }
    }
  }, [cartItems, router]);
  
  // Handle payment method change
  const handlePaymentMethodChange = (method: string) => {
    setPaymentDetails(prev => ({
      ...prev,
      paymentMethod: method
    }));
    
    // Clear card errors when switching payment methods
    if (method !== 'credit-card') {
      setErrors({});
    }
  };
  
  // Handle tip option change
  const handleTipChange = (percentage: number) => {
    setPaymentDetails(prev => ({
      ...prev,
      tipPercentage: percentage
    }));
  };
  
  // Handle custom tip amount change
  const handleCustomTipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(e.target.value) || 0;
    setPaymentDetails(prev => ({
      ...prev,
      customTipAmount: amount
    }));
  };
  
  // Handle card detail changes
  const handleCardDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setPaymentDetails(prev => ({
      ...prev,
      cardDetails: {
        ...prev.cardDetails as any,
        [name]: value
      }
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Handle save payment info toggle
  const handleSavePaymentToggle = () => {
    setPaymentDetails(prev => ({
      ...prev,
      savePaymentInfo: !prev.savePaymentInfo
    }));
  };
  
  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };
  
  // Format expiry date (MM/YY)
  const formatExpiry = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .substring(0, 5);
  };
  
  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Only validate card details if credit card is selected
    if (paymentDetails.paymentMethod === 'credit-card') {
      // Validate card number
      if (!paymentDetails.cardDetails?.number.trim()) {
        newErrors.number = 'Card number is required';
      } else if (!/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/.test(paymentDetails.cardDetails.number)) {
        newErrors.number = 'Please enter a valid card number';
      }
      
      // Validate card name
      if (!paymentDetails.cardDetails?.name.trim()) {
        newErrors.name = 'Name on card is required';
      }
      
      // Validate expiry
      if (!paymentDetails.cardDetails?.expiry.trim()) {
        newErrors.expiry = 'Expiry date is required';
      } else if (!/^\d{2}\/\d{2}$/.test(paymentDetails.cardDetails.expiry)) {
        newErrors.expiry = 'Please enter a valid expiry date (MM/YY)';
      }
      
      // Validate CVC
      if (!paymentDetails.cardDetails?.cvc.trim()) {
        newErrors.cvc = 'CVC is required';
      } else if (!/^\d{3,4}$/.test(paymentDetails.cardDetails.cvc)) {
        newErrors.cvc = 'Please enter a valid CVC';
      }
    }
    
    // Validate custom tip if selected
    if (paymentDetails.tipPercentage === -1 && paymentDetails.customTipAmount < 0) {
      newErrors.customTip = 'Custom tip amount cannot be negative';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    if (validateForm()) {
      // Save payment details to localStorage (excluding sensitive card info)
      const paymentToSave = {
        ...paymentDetails,
        cardDetails: paymentDetails.paymentMethod === 'credit-card' && paymentDetails.savePaymentInfo
          ? { 
              // Only save last 4 digits of card number
              number: `**** **** **** ${paymentDetails.cardDetails?.number.slice(-4)}`,
              name: paymentDetails.cardDetails?.name,
              expiry: paymentDetails.cardDetails?.expiry,
              // Don't save CVC
              cvc: ''
            }
          : undefined
      };
      
      localStorage.setItem('paymentDetails', JSON.stringify(paymentToSave));
      
      // Save order details for confirmation
      const orderDetails = {
        items: cartItems,
        customerDetails,
        paymentDetails: {
          method: paymentDetails.paymentMethod,
          tipAmount,
          total
        },
        orderNumber: `BBQ-${Date.now().toString().slice(-6)}`,
        estimatedTime: customerDetails?.fulfillmentType === 'delivery' ? '30-45 minutes' : '15-20 minutes'
      };
      
      localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
      
      // Navigate to confirmation page
      router.push('/checkout/confirmation');
    }
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
  
  if (!customerDetails) {
    return (
      <div className="min-h-screen bg-charcoal-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }
  
  return (
    <>
      <Head>
        <title>Payment | Brown's Bar-B-Cue</title>
        <meta name="description" content="Complete your payment for your Brown's Bar-B-Cue order." />
      </Head>
      
      <div className="min-h-screen bg-charcoal-900 text-white">
        {/* Header */}
        <header className="bg-charcoal-800 shadow-md">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <button 
                onClick={() => router.push('/checkout/details')}
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
              <div className="flex items-center opacity-50">
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center font-bold">1</div>
                <span className="ml-2">Review</span>
              </div>
              <div className="flex items-center opacity-50">
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center font-bold">2</div>
                <span className="ml-2">Details</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-charcoal-900 flex items-center justify-center font-bold">3</div>
                <span className="ml-2 font-bold">Payment</span>
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
            <h2 className="text-2xl font-bold mb-6">Payment</h2>
            
            <div className="bg-charcoal-800 rounded-lg p-6 shadow-lg">
              <form onSubmit={handleSubmit}>
                {/* Payment Methods */}
                <motion.div className="mb-8" variants={itemVariants}>
                  <h3 className="text-xl font-bold mb-4">Payment Method</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {PAYMENT_METHODS.map(method => (
                      <div
                        key={method.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          paymentDetails.paymentMethod === method.id
                            ? 'border-amber-500 bg-amber-500 bg-opacity-20'
                            : 'border-charcoal-600 hover:border-gray-500'
                        }`}
                        onClick={() => handlePaymentMethodChange(method.id)}
                      >
                        <div className="flex flex-col items-center text-center">
                          <div className="text-2xl mb-2">{method.icon}</div>
                          <div className="font-medium">{method.name}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Credit Card Details (only show if credit card is selected) */}
                  {paymentDetails.paymentMethod === 'credit-card' && (
                    <div className="bg-charcoal-700 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label htmlFor="number" className="block text-sm font-medium text-gray-300 mb-1">
                            Card Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="number"
                            name="number"
                            value={paymentDetails.cardDetails?.number || ''}
                            onChange={(e) => {
                              const formattedValue = formatCardNumber(e.target.value);
                              e.target.value = formattedValue;
                              handleCardDetailChange(e);
                            }}
                            maxLength={19}
                            className={`w-full px-3 py-2 bg-charcoal-600 border ${
                              errors.number ? 'border-red-500' : 'border-charcoal-500'
                            } rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                            placeholder="1234 5678 9012 3456"
                          />
                          {errors.number && (
                            <p className="mt-1 text-sm text-red-500">{errors.number}</p>
                          )}
                        </div>
                        
                        <div className="md:col-span-2">
                          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                            Name on Card <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={paymentDetails.cardDetails?.name || ''}
                            onChange={handleCardDetailChange}
                            className={`w-full px-3 py-2 bg-charcoal-600 border ${
                              errors.name ? 'border-red-500' : 'border-charcoal-500'
                            } rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                            placeholder="John Doe"
                          />
                          {errors.name && (
                            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                          )}
                        </div>
                        
                        <div>
                          <label htmlFor="expiry" className="block text-sm font-medium text-gray-300 mb-1">
                            Expiry Date <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="expiry"
                            name="expiry"
                            value={paymentDetails.cardDetails?.expiry || ''}
                            onChange={(e) => {
                              const formattedValue = formatExpiry(e.target.value);
                              e.target.value = formattedValue;
                              handleCardDetailChange(e);
                            }}
                            maxLength={5}
                            className={`w-full px-3 py-2 bg-charcoal-600 border ${
                              errors.expiry ? 'border-red-500' : 'border-charcoal-500'
                            } rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                            placeholder="MM/YY"
                          />
                          {errors.expiry && (
                            <p className="mt-1 text-sm text-red-500">{errors.expiry}</p>
                          )}
                        </div>
                        
                        <div>
                          <label htmlFor="cvc" className="block text-sm font-medium text-gray-300 mb-1">
                            CVC <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="cvc"
                            name="cvc"
                            value={paymentDetails.cardDetails?.cvc || ''}
                            onChange={handleCardDetailChange}
                            maxLength={4}
                            className={`w-full px-3 py-2 bg-charcoal-600 border ${
                              errors.cvc ? 'border-red-500' : 'border-charcoal-500'
                            } rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                            placeholder="123"
                          />
                          {errors.cvc && (
                            <p className="mt-1 text-sm text-red-500">{errors.cvc}</p>
                          )}
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={paymentDetails.savePaymentInfo}
                              onChange={handleSavePaymentToggle}
                              className="h-4 w-4 text-amber-500 focus:ring-amber-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-300">Save payment information for future orders</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
                
                {/* Tip Options */}
                <motion.div className="mb-8" variants={itemVariants}>
                  <h3 className="text-xl font-bold mb-4">Add a Tip</h3>
                  
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
                    {TIP_OPTIONS.map(option => (
                      <div
                        key={option.id}
                        className={`border rounded-lg p-3 cursor-pointer transition-colors text-center ${
                          paymentDetails.tipPercentage === option.percentage
                            ? 'border-amber-500 bg-amber-500 bg-opacity-20'
                            : 'border-charcoal-600 hover:border-gray-500'
                        }`}
                        onClick={() => handleTipChange(option.percentage)}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                  
                  {/* Custom Tip Input */}
                  {paymentDetails.tipPercentage === -1 && (
                    <div className="mb-4">
                      <label htmlFor="customTip" className="block text-sm font-medium text-gray-300 mb-1">
                        Custom Tip Amount
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-400">$</span>
                        </div>
                        <input
                          type="number"
                          id="customTip"
                          value={paymentDetails.customTipAmount}
                          onChange={handleCustomTipChange}
                          min="0"
                          step="0.01"
                          className={`w-full pl-8 pr-3 py-2 bg-charcoal-700 border ${
                            errors.customTip ? 'border-red-500' : 'border-charcoal-600'
                          } rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                          placeholder="0.00"
                        />
                      </div>
                      {errors.customTip && (
                        <p className="mt-1 text-sm text-red-500">{errors.customTip}</p>
                      )}
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-400">
                    100% of your tip goes to our staff. Thank you for your generosity!
                  </div>
                </motion.div>
                
                {/* Order Summary */}
                <motion.div className="mb-8" variants={itemVariants}>
                  <h3 className="text-xl font-bold mb-4">Order Summary</h3>
                  
                  <div className="bg-charcoal-700 rounded-lg p-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Tax (8.25%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Tip</span>
                      <span>${tipAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg mt-4">
                      <span>Total</span>
                      <span className="text-amber-400">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </motion.div>
                
                {/* Navigation Buttons */}
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => router.push('/checkout/details')}
                    className="px-6 py-3 bg-charcoal-700 hover:bg-charcoal-600 rounded-lg transition-colors"
                  >
                    Back to Details
                  </button>
                  
                  <button
                    type="submit"
                    className="px-6 py-3 bg-red-700 hover:bg-red-600 rounded-lg font-bold transition-colors"
                  >
                    Place Order
                  </button>
                </div>
                
                {/* Form Validation Message */}
                {formSubmitted && Object.keys(errors).length > 0 && (
                  <div className="mt-4 p-3 bg-red-900 bg-opacity-50 border border-red-500 rounded-lg text-sm">
                    Please correct the errors above before continuing.
                  </div>
                )}
              </form>
            </div>
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default PaymentPage;
