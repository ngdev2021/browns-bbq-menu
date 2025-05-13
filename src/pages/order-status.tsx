import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';

// Order status types
type OrderStatus = 'received' | 'preparing' | 'ready' | 'completed' | 'cancelled';

interface OrderDetails {
  id: string;
  status: OrderStatus;
  customerName: string;
  orderType: 'pickup' | 'delivery';
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  estimatedTime: string;
  placedAt: string;
  specialInstructions?: string;
}

const OrderStatus: React.FC = () => {
  const router = useRouter();
  const { orderId } = router.query;
  
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Fetch order details
  useEffect(() => {
    if (!orderId) return;
    
    const fetchOrderDetails = async () => {
      setLoading(true);
      
      try {
        // In a real app, this would be an API call
        // For demo purposes, we'll simulate a delay and return mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock order data
        const mockOrder: OrderDetails = {
          id: orderId as string,
          status: 'preparing',
          customerName: 'John Doe',
          orderType: 'pickup',
          items: [
            { name: 'Brisket Plate', quantity: 1, price: 15.99 },
            { name: 'Ribs (Half Rack)', quantity: 1, price: 13.99 },
            { name: 'Sweet Tea', quantity: 2, price: 2.49 }
          ],
          total: 34.96,
          estimatedTime: '12:45 PM',
          placedAt: '12:15 PM',
          specialInstructions: 'Extra sauce on the side, please.'
        };
        
        setOrder(mockOrder);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Unable to fetch order details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [orderId]);
  
  // Function to get status text and color
  const getStatusInfo = (status: OrderStatus) => {
    switch (status) {
      case 'received':
        return { text: 'Order Received', color: 'bg-blue-500', percentage: 25 };
      case 'preparing':
        return { text: 'Preparing Your Order', color: 'bg-amber-500', percentage: 50 };
      case 'ready':
        return { text: 'Ready for Pickup/Delivery', color: 'bg-green-500', percentage: 75 };
      case 'completed':
        return { text: 'Order Completed', color: 'bg-green-700', percentage: 100 };
      case 'cancelled':
        return { text: 'Order Cancelled', color: 'bg-red-500', percentage: 100 };
      default:
        return { text: 'Status Unknown', color: 'bg-gray-500', percentage: 0 };
    }
  };
  
  // Function to render the status bar
  const renderStatusBar = (status: OrderStatus) => {
    const { percentage, color } = getStatusInfo(status);
    
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <motion.div 
          className={`h-2.5 rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1 }}
        />
      </div>
    );
  };
  
  // Function to render the status steps
  const renderStatusSteps = (status: OrderStatus) => {
    // Safety check - should never happen due to our component structure
    if (!order) return null;
    const steps = [
      { key: 'received', label: 'Order Received' },
      { key: 'preparing', label: 'Preparing' },
      { key: 'ready', label: order.orderType === 'delivery' ? 'Out for Delivery' : 'Ready for Pickup' },
      { key: 'completed', label: 'Completed' }
    ];
    
    const currentStepIndex = steps.findIndex(step => step.key === status);
    
    return (
      <div className="flex justify-between items-center mb-8">
        {steps.map((step, index) => (
          <React.Fragment key={step.key}>
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index <= currentStepIndex 
                    ? 'bg-amber-700 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {index + 1}
              </div>
              <span className={`text-xs mt-1 text-center ${
                index <= currentStepIndex ? 'text-amber-700 font-medium' : 'text-gray-500'
              }`}>
                {step.label}
              </span>
            </div>
            
            {/* Connector line (except after the last step) */}
            {index < steps.length - 1 && (
              <div 
                className={`flex-1 h-1 mx-2 ${
                  index < currentStepIndex ? 'bg-amber-700' : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };
  
  // Render loading state
  if (loading) {
    return (
      <div className="container max-w-3xl mx-auto py-12 px-4 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  // Render error state
  if (error || !order) {
    return (
      <div className="container max-w-3xl mx-auto py-12 px-4 text-center">
        <div className="bg-red-100 text-red-800 p-4 rounded-lg">
          <h2 className="text-xl font-bold">Error</h2>
          <p>{error || 'Order not found. Please check your order ID and try again.'}</p>
          <button 
            onClick={() => router.push('/')}
            className="mt-4 px-6 py-2 bg-amber-700 hover:bg-amber-600 rounded-md text-white"
          >
            Return to Menu
          </button>
        </div>
      </div>
    );
  }
  
  // Get status information
  const { text: statusText } = getStatusInfo(order.status);
  
  return (
    <>
      <Head>
        <title>Order Status | Brown's Bar-B-Cue</title>
        <meta name="description" content="Track your Brown's Bar-B-Cue order status" />
      </Head>
      
      <main className="container max-w-3xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-amber-700 text-center mb-2">Order Status</h1>
        <p className="text-center text-gray-600 mb-8">Order #{order.id}</p>
        
        {/* Order Status */}
        <div className="bg-gray-100 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-center mb-4">{statusText}</h2>
          
          {/* Status Progress Bar */}
          {renderStatusBar(order.status)}
          
          {/* Status Steps */}
          {renderStatusSteps(order.status)}
          
          {/* Estimated Time */}
          <div className="text-center mb-6">
            <p className="text-gray-600">
              {order.orderType === 'pickup' 
                ? 'Estimated Pickup Time:' 
                : 'Estimated Delivery Time:'}
            </p>
            <p className="text-2xl font-bold">{order.estimatedTime}</p>
          </div>
          
          {/* Order Placed Time */}
          <div className="text-center text-sm text-gray-500">
            Order placed at {order.placedAt}
          </div>
        </div>
        
        {/* Order Details */}
        <div className="bg-gray-100 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Order Details</h2>
          
          <div className="space-y-2 mb-4">
            <p><span className="font-medium">Customer:</span> {order.customerName}</p>
            <p><span className="font-medium">Order Type:</span> {order.orderType === 'pickup' ? 'Pickup' : 'Delivery'}</p>
            
            {order.specialInstructions && (
              <p><span className="font-medium">Special Instructions:</span> {order.specialInstructions}</p>
            )}
          </div>
          
          {/* Order Items */}
          <div className="mt-6">
            <h3 className="font-medium mb-2">Items:</h3>
            <ul className="divide-y divide-gray-200">
              {order.items.map((item, index) => (
                <li key={index} className="py-2 flex justify-between">
                  <span>{item.quantity}x {item.name}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            
            <div className="mt-4 pt-2 border-t border-gray-300 font-bold flex justify-between">
              <span>Total:</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => router.push('/')}
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Return to Menu
          </button>
          
          <button 
            onClick={() => {
              // In a real app, this would call an API to cancel the order
              alert('This would cancel your order in a real application.');
            }}
            className="px-6 py-2 bg-red-600 hover:bg-red-500 rounded-md text-white"
            disabled={['completed', 'cancelled'].includes(order.status)}
          >
            Cancel Order
          </button>
        </div>
      </main>
    </>
  );
};

export default OrderStatus;
