import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useCart } from '../../contexts/CartContext';

// Define pickup/delivery options
const FULFILLMENT_OPTIONS = [
  { id: 'pickup', name: 'Pickup', description: 'Ready in 15-20 minutes', icon: '🚗' },
  { id: 'delivery', name: 'Delivery', description: 'Delivered in 30-45 minutes', icon: '🏠' }
];

// Define time slots
const TIME_SLOTS = [
  { id: 'asap', label: 'As soon as possible' },
  { id: 'slot1', label: '12:00 PM - 12:15 PM' },
  { id: 'slot2', label: '12:15 PM - 12:30 PM' },
  { id: 'slot3', label: '12:30 PM - 12:45 PM' },
  { id: 'slot4', label: '12:45 PM - 1:00 PM' },
  { id: 'slot5', label: '1:00 PM - 1:15 PM' }
];

interface CustomerDetails {
  name: string;
  phone: string;
  email: string;
  fulfillmentType: string;
  timeSlot: string;
  address?: {
    street: string;
    apt: string;
    city: string;
    state: string;
    zip: string;
  };
  specialInstructions: string;
}

const CustomerDetailsPage: React.FC = () => {
  const router = useRouter();
  const { items: cartItems } = useCart();
  
  // Calculate subtotal, tax, and total
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const taxRate = 0.0825; // 8.25% tax rate
  const tax = subtotal * taxRate;
  const total = subtotal + tax;
  
  // State for customer details
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    name: '',
    phone: '',
    email: '',
    fulfillmentType: 'pickup',
    timeSlot: 'asap',
    address: {
      street: '',
      apt: '',
      city: 'Austin',
      state: 'TX',
      zip: ''
    },
    specialInstructions: ''
  });
  
  // State for form validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  // Check if cart is empty and redirect if needed
  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/checkout/review');
    }
    
    // Try to load saved customer details from localStorage
    const savedDetails = localStorage.getItem('customerDetails');
    if (savedDetails) {
      try {
        const parsedDetails = JSON.parse(savedDetails);
        setCustomerDetails(parsedDetails);
      } catch (error) {
        console.error('Error parsing saved customer details:', error);
      }
    }
  }, [cartItems, router]);
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested address fields
      const [parent, child] = name.split('.');
      setCustomerDetails(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof CustomerDetails] as Record<string, string>,
          [child]: value
        }
      }));
    } else {
      // Handle top-level fields
      setCustomerDetails(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Handle fulfillment type change
  const handleFulfillmentChange = (type: string) => {
    setCustomerDetails(prev => ({
      ...prev,
      fulfillmentType: type
    }));
  };
  
  // Handle time slot change
  const handleTimeSlotChange = (slot: string) => {
    setCustomerDetails(prev => ({
      ...prev,
      timeSlot: slot
    }));
  };
  
  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Validate name
    if (!customerDetails.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    // Validate phone
    if (!customerDetails.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(customerDetails.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    // Validate email
    if (!customerDetails.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerDetails.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Validate delivery address if delivery is selected
    if (customerDetails.fulfillmentType === 'delivery') {
      if (!customerDetails.address?.street.trim()) {
        newErrors['address.street'] = 'Street address is required';
      }
      
      if (!customerDetails.address?.city.trim()) {
        newErrors['address.city'] = 'City is required';
      }
      
      if (!customerDetails.address?.state.trim()) {
        newErrors['address.state'] = 'State is required';
      }
      
      if (!customerDetails.address?.zip.trim()) {
        newErrors['address.zip'] = 'ZIP code is required';
      } else if (!/^\d{5}(-\d{4})?$/.test(customerDetails.address.zip)) {
        newErrors['address.zip'] = 'Please enter a valid ZIP code';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    if (validateForm()) {
      // Save customer details to localStorage
      localStorage.setItem('customerDetails', JSON.stringify(customerDetails));
      
      // Navigate to payment page
      router.push('/checkout/payment');
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
  
  return (
    <>
      <Head>
        <title>Customer Details | Brown's Bar-B-Cue</title>
        <meta name="description" content="Enter your details for your Brown's Bar-B-Cue order." />
      </Head>
      
      <div className="min-h-screen bg-charcoal-900 text-white">
        {/* Header */}
        <header className="bg-charcoal-800 shadow-md">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <button 
                onClick={() => router.push('/checkout/review')}
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
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-charcoal-900 flex items-center justify-center font-bold">2</div>
                <span className="ml-2 font-bold">Details</span>
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
            <h2 className="text-2xl font-bold mb-6">Your Details</h2>
            
            <div className="bg-charcoal-800 rounded-lg p-6 shadow-lg">
              <form onSubmit={handleSubmit}>
                {/* Contact Information */}
                <motion.div className="mb-8" variants={itemVariants}>
                  <h3 className="text-xl font-bold mb-4">Contact Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={customerDetails.name}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 bg-charcoal-700 border ${
                          errors.name ? 'border-red-500' : 'border-charcoal-600'
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                        placeholder="Your full name"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={customerDetails.phone}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 bg-charcoal-700 border ${
                          errors.phone ? 'border-red-500' : 'border-charcoal-600'
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                        placeholder="(123) 456-7890"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                      )}
                    </div>
                    
                    <div className="md:col-span-2">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={customerDetails.email}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 bg-charcoal-700 border ${
                          errors.email ? 'border-red-500' : 'border-charcoal-600'
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                        placeholder="your.email@example.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
                
                {/* Fulfillment Options */}
                <motion.div className="mb-8" variants={itemVariants}>
                  <h3 className="text-xl font-bold mb-4">How would you like to get your food?</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {FULFILLMENT_OPTIONS.map(option => (
                      <div
                        key={option.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          customerDetails.fulfillmentType === option.id
                            ? 'border-amber-500 bg-amber-500 bg-opacity-20'
                            : 'border-charcoal-600 hover:border-gray-500'
                        }`}
                        onClick={() => handleFulfillmentChange(option.id)}
                      >
                        <div className="flex items-center">
                          <div className="text-2xl mr-3">{option.icon}</div>
                          <div>
                            <div className="font-bold">{option.name}</div>
                            <div className="text-sm text-gray-400">{option.description}</div>
                          </div>
                          
                          {customerDetails.fulfillmentType === option.id && (
                            <div className="ml-auto text-amber-500">
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Time Slot Selection */}
                  <div className="mb-6">
                    <h4 className="font-bold mb-2">When would you like your order?</h4>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {TIME_SLOTS.map(slot => (
                        <div
                          key={slot.id}
                          className={`border rounded-lg p-3 cursor-pointer transition-colors text-center ${
                            customerDetails.timeSlot === slot.id
                              ? 'border-amber-500 bg-amber-500 bg-opacity-20'
                              : 'border-charcoal-600 hover:border-gray-500'
                          }`}
                          onClick={() => handleTimeSlotChange(slot.id)}
                        >
                          {slot.label}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
                
                {/* Delivery Address (only show if delivery is selected) */}
                {customerDetails.fulfillmentType === 'delivery' && (
                  <motion.div className="mb-8" variants={itemVariants}>
                    <h3 className="text-xl font-bold mb-4">Delivery Address</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label htmlFor="address.street" className="block text-sm font-medium text-gray-300 mb-1">
                          Street Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="address.street"
                          name="address.street"
                          value={customerDetails.address?.street}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 bg-charcoal-700 border ${
                            errors['address.street'] ? 'border-red-500' : 'border-charcoal-600'
                          } rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                          placeholder="123 Main St"
                        />
                        {errors['address.street'] && (
                          <p className="mt-1 text-sm text-red-500">{errors['address.street']}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="address.apt" className="block text-sm font-medium text-gray-300 mb-1">
                          Apt/Suite (optional)
                        </label>
                        <input
                          type="text"
                          id="address.apt"
                          name="address.apt"
                          value={customerDetails.address?.apt}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-charcoal-700 border border-charcoal-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="Apt 123"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="address.city" className="block text-sm font-medium text-gray-300 mb-1">
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="address.city"
                          name="address.city"
                          value={customerDetails.address?.city}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 bg-charcoal-700 border ${
                            errors['address.city'] ? 'border-red-500' : 'border-charcoal-600'
                          } rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                          placeholder="City"
                        />
                        {errors['address.city'] && (
                          <p className="mt-1 text-sm text-red-500">{errors['address.city']}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="address.state" className="block text-sm font-medium text-gray-300 mb-1">
                          State <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="address.state"
                          name="address.state"
                          value={customerDetails.address?.state}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 bg-charcoal-700 border ${
                            errors['address.state'] ? 'border-red-500' : 'border-charcoal-600'
                          } rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                          placeholder="State"
                        />
                        {errors['address.state'] && (
                          <p className="mt-1 text-sm text-red-500">{errors['address.state']}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="address.zip" className="block text-sm font-medium text-gray-300 mb-1">
                          ZIP Code <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="address.zip"
                          name="address.zip"
                          value={customerDetails.address?.zip}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 bg-charcoal-700 border ${
                            errors['address.zip'] ? 'border-red-500' : 'border-charcoal-600'
                          } rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                          placeholder="12345"
                        />
                        {errors['address.zip'] && (
                          <p className="mt-1 text-sm text-red-500">{errors['address.zip']}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {/* Special Instructions */}
                <motion.div className="mb-8" variants={itemVariants}>
                  <h3 className="text-xl font-bold mb-4">Special Instructions (Optional)</h3>
                  
                  <div>
                    <textarea
                      id="specialInstructions"
                      name="specialInstructions"
                      value={customerDetails.specialInstructions}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 bg-charcoal-700 border border-charcoal-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Any special instructions for pickup or delivery? Let us know here."
                    ></textarea>
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
                    onClick={() => router.push('/checkout/review')}
                    className="px-6 py-3 bg-charcoal-700 hover:bg-charcoal-600 rounded-lg transition-colors"
                  >
                    Back to Review
                  </button>
                  
                  <button
                    type="submit"
                    className="px-6 py-3 bg-red-700 hover:bg-red-600 rounded-lg font-bold transition-colors"
                  >
                    Continue to Payment
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

export default CustomerDetailsPage;
