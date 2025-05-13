import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getMenuItemsSync } from '../lib/menuService';
import { useCart } from '../contexts/CartContext';
import CartDrawer from '../components/CartDrawer';
import Toast from '../components/Toast';
import NetworkStatus from '../components/NetworkStatus';
import { drinks } from '../data/drinks';
import { desserts } from '../data/desserts';

// Get menu items and combine with drinks and desserts
const baseMenuItems = getMenuItemsSync();

// Convert drinks and desserts to the same format as menu items
const drinkItems = drinks.map(drink => ({
  id: drink.id,
  name: drink.name,
  description: drink.description || '',
  price: drink.price,
  category: 'drinks',
  image_url: drink.image_url,
  tags: ['drinks'],
  stock: 50,
  featured: false,
  ingredients: [],
  nutritionalInfo: {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  }
}));

const dessertItems = desserts.map(dessert => ({
  id: dessert.id,
  name: dessert.name,
  description: dessert.description || '',
  price: dessert.price,
  category: 'desserts',
  image_url: dessert.image_url,
  tags: ['desserts'],
  stock: 20,
  featured: false,
  ingredients: [],
  nutritionalInfo: {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  }
}));

// Combine all menu items
const menuItems = [...baseMenuItems, ...drinkItems, ...dessertItems];

// Define category types with icons
const categories = [
  { id: 'all', name: 'All Items', icon: '🔍' },
  { id: 'plates', name: 'BBQ Plates', icon: '🍖' },
  { id: 'sandwiches', name: 'Sandwiches', icon: '🥪' },
  { id: 'combos', name: 'Combo Specials', icon: '🔥' },
  { id: 'sides', name: 'Side Items', icon: '🥗' },
  { id: 'drinks', name: 'Drinks', icon: '🥤' },
  { id: 'desserts', name: 'Desserts', icon: '🍰' },
  { id: 'family', name: 'Family Packs', icon: '👨‍👩‍👧‍👦' }
];

const MenuPage: React.FC = () => {
  const router = useRouter();
  const { category: urlCategory } = router.query;
  
  // Cart context
  const { items: cartItems, updateQuantity, editItem, isOpen: isCartOpen, setIsOpen: setIsCartOpen } = useCart();
  
  // State for menu filtering
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Daily special state
  const [dailySpecial, setDailySpecial] = useState(() => {
    // Get current day for specials
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Determine the special based on day of week
    switch(dayOfWeek) {
      case 5: // Friday
        return {
          title: "Friday Special",
          description: "4 Meats + 2 Sides for $32",
          savings: "SAVE $8"
        };
      case 6: // Saturday
        return {
          title: "Saturday Family Pack",
          description: "Full Rack of Ribs + 3 Sides for $38",
          savings: "SAVE $6"
        };
      case 0: // Sunday
        return {
          title: "Sunday Feast",
          description: "Buy 1 Pound of Brisket, Get 1/2 Pound Free",
          savings: "SAVE $12"
        };
      default:
        return {
          title: "Weekday Special",
          description: "Any Sandwich + Side + Drink for $14",
          savings: "SAVE $3"
        };
    }
  });
  
  // Toast notifications
  const [toast, setToast] = useState({ message: '', visible: false });
  
  // Filter items by category
  const getItemsByCategory = (category: string) => {
    if (category === 'all') {
      return menuItems;
    }
    return menuItems.filter(item => item.category === category);
  };
  
  // Get fan favorites (most popular items)
  const getFanFavorites = () => {
    return menuItems.filter(item => item.featured).slice(0, 6);
  };
  
  // Set initial category from URL if available
  useEffect(() => {
    if (urlCategory && typeof urlCategory === 'string') {
      setSelectedCategory(urlCategory);
    }
  }, [urlCategory]);
  
  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    
    // Update URL without refreshing the page
    router.push(`/menu?category=${category}`, undefined, { shallow: true });
  };
  
  // Handle item selection
  const handleItemSelect = (item: any) => {
    router.push(`/configure-item/${item.id}`);
  };
  
  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  // Handle checkout
  const handleCheckout = () => {
    // Navigate to checkout page
    router.push('/checkout');
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
  
  // Filter items based on search query
  const filteredItems = getItemsByCategory(selectedCategory).filter(item => 
    searchQuery === '' || 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
    
  // Get day of week for daily special
  const getDayOfWeek = (): string => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  };

  return (
    <>
      <Head>
        <title>Menu | Brown's Bar-B-Cue</title>
        <meta name="description" content="Browse our menu of authentic Texas BBQ. Order online for pickup or delivery." />
      </Head>
      
      <NetworkStatus />
      
      <div 
        className="min-h-screen text-white"
        style={{
          backgroundImage: 'url("/images/menu-items/brisket.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
          backgroundColor: 'rgba(0,0,0,0.85)'
        }}
      >
        {/* Today's Special Banner */}
        <motion.div 
          className="bg-gradient-to-r from-amber-900 to-amber-800 py-3 px-4 text-center relative overflow-hidden"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="absolute -left-8 top-0 bottom-0 w-24 bg-white bg-opacity-10 transform rotate-12"></div>
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center mb-2 sm:mb-0">
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded mr-3 animate-pulse">
                {getDayOfWeek().toUpperCase()} ONLY
              </span>
              <span className="font-bold text-lg">{dailySpecial.title}: {dailySpecial.description}</span>
            </div>
            <span className="bg-red-600 text-white font-bold px-3 py-1 rounded-lg">
              {dailySpecial.savings}
            </span>
          </div>
        </motion.div>
        
        {/* Header with Back Button */}
        <div className="bg-black bg-opacity-70 py-4 px-4 border-b border-amber-600">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <button 
              onClick={() => router.push('/')}
              className="flex items-center text-amber-300 hover:text-amber-200 transition-colors"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </button>
            
            <h1 className="text-2xl font-bold text-amber-500 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
              Menu Categories
            </h1>
            
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="bg-black bg-opacity-70 py-4 px-4 border-b border-amber-600">
          <div className="max-w-6xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full bg-black bg-opacity-50 text-white border border-amber-600 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <svg className="w-5 h-5 text-amber-500 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Category Navigation */}
        <div className="bg-black bg-opacity-70 py-4 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categories.map((category) => (
                <motion.div
                  key={category.id}
                  className={`rounded-lg p-3 text-center cursor-pointer transition-colors shadow-md border-2 ${
                    selectedCategory === category.id 
                      ? 'bg-amber-800 border-amber-500 text-white' 
                      : 'bg-black bg-opacity-50 border-amber-600 hover:bg-amber-900'
                  }`}
                  onClick={() => handleCategorySelect(category.id)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-3xl mb-1">{category.icon}</div>
                  <h3 className={`font-bold ${selectedCategory === category.id ? 'text-white' : 'text-amber-300'}`}>
                    {category.name}
                  </h3>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Menu Items */}
        <div className="py-6 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center text-amber-500 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                <span className="mr-2">{categories.find(c => c.id === selectedCategory)?.icon}</span>
                {categories.find(c => c.id === selectedCategory)?.name}
              </h2>
              <div className="text-amber-300 text-sm">
                {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
              </div>
            </div>
            
            {filteredItems.length > 0 ? (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    className="bg-black bg-opacity-50 rounded-lg overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow border-2 border-amber-600"
                    onClick={() => handleItemSelect(item)}
                    variants={itemVariants}
                    whileHover={{ y: -5 }}
                  >
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src={item.image_url || '/images/placeholder-food.jpg'} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/placeholder-food.jpg';
                        }}
                      />
                      {item.featured && (
                        <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                          POPULAR
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xl font-bold text-amber-500">{item.name}</h3>
                        <span className="text-amber-300 font-bold">${item.price.toFixed(2)}</span>
                      </div>
                      <p className="text-gray-400 mb-4 line-clamp-2">{item.description}</p>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleItemSelect(item);
                        }}
                        className="w-full py-2 bg-gradient-to-r from-red-900 to-amber-900 hover:from-red-800 hover:to-amber-800 rounded text-white font-bold transition-colors border border-amber-600"
                      >
                        Select
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-12 bg-black bg-opacity-50 rounded-lg border-2 border-amber-600">
                <svg className="w-16 h-16 text-amber-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-bold text-amber-500 mb-2">No items found</h3>
                <p className="text-amber-300">Try a different search term or category</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Menu Footer */}
        <div className="max-w-6xl mx-auto px-4 py-6 mt-8 border-t border-amber-600">
          <div className="flex justify-center space-x-4 mb-3 flex-wrap gap-2">
            <div className="bg-amber-800 px-3 py-1 rounded-full text-white font-bold text-sm">🔥 SPICY</div>
            <div className="bg-amber-800 px-3 py-1 rounded-full text-white font-bold text-sm">🥜 CONTAINS NUTS</div>
            <div className="bg-amber-800 px-3 py-1 rounded-full text-white font-bold text-sm">🌱 VEGETARIAN OPTION</div>
          </div>
          <p className="text-amber-300 text-center text-sm">All plates come with your choice of two sides (5 oz. serving)</p>
        </div>
        
        {/* Cart Button */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-amber-800 hover:bg-amber-700 rounded-full shadow-lg flex items-center justify-center cart-icon border-2 border-amber-600"
          aria-label="Open cart"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
              {cartItems.reduce((total, item) => total + item.quantity, 0)}
            </span>
          )}
        </button>
        
        {/* Cart Drawer */}
        <CartDrawer 
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          onUpdateQuantity={updateQuantity}
          onEditItem={editItem}
          onCheckout={handleCheckout}
        />
        
        {/* Toast Notification */}
        <Toast 
          message={toast.message}
          visible={toast.visible}
          onClose={() => setToast(prev => ({ ...prev, visible: false }))}
        />
      </div>
    </>
  );
};

export default MenuPage;
