import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import HeroBackground from '../components/HeroBackground';
import FeaturedCarousel from '../components/FeaturedCarousel';
import CategoryNav from '../components/CategoryNav';
import SearchFilter from '../components/SearchFilter';
import MenuGrid from '../components/MenuGrid';
import CartDrawer from '../components/CartDrawer';
import ComboBuilder from '../components/ComboBuilder';
import PlateOptions from '../components/PlateOptions';
import Toast from '../components/Toast';
import NetworkStatus from '../components/NetworkStatus';
import Confetti from '../components/Confetti';
import Footer from '../components/Footer';
import { useCart } from '../contexts/CartContext';
import { checkHolidays } from '../lib/timeUtils';
import { getMenuItemsSync, getBusinessSettingsSync, MenuItem } from '../lib/menuService';
import { comboTemplates } from '../data/menuCustomizationData';
import { getUpsellRecommendations } from '../lib/upsellEngine';
import fs from 'fs';
import path from 'path';

export default function Home() {
  const router = useRouter();
  
  // State for menu data - use sync versions for initial render
  const [menuItems, setMenuItems] = useState<MenuItem[]>(getMenuItemsSync());
  const [businessSettings, setBusinessSettings] = useState(getBusinessSettingsSync());
  const [plateOptions, setPlateOptions] = useState<any[]>([]);
  
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
  
  // User location and wait time
  const [waitTime, setWaitTime] = useState<number>(15); // Default wait time in minutes
  const [userLocation, setUserLocation] = useState<string | null>(null);
  const [isLocationLoading, setIsLocationLoading] = useState<boolean>(false);
  
  // State for menu filtering
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  // Cart context
  const { items: cartItems, addItem, updateQuantity, editItem, addCombo, isOpen: isCartOpen, setIsOpen: setIsCartOpen } = useCart();
  
  // Toast notifications
  const [toast, setToast] = useState({ message: '', visible: false });
  
  // Holiday detection
  const [isHoliday, setIsHoliday] = useState(false);
  const [holidayName, setHolidayName] = useState('');
  
  // Combo builder state
  const [isComboBuilderOpen, setIsComboBuilderOpen] = useState(false);
  const [selectedComboTemplate, setSelectedComboTemplate] = useState(comboTemplates[0]);
  
  // Upsell recommendations
  const [upsellRecommendations, setUpsellRecommendations] = useState<any[]>([]);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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

  // Load menu data from server when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch menu items
        const response = await fetch('/api/menu');
        const data = await response.json();
        
        if (data.success) {
          setMenuItems(data.data);
        }
        
        // Load plate options
        try {
          const plateResponse = await fetch('/api/plates');
          const plateData = await plateResponse.json();
          
          if (plateData.success) {
            setPlateOptions(plateData.data);
          }
        } catch (error) {
          console.error('Error loading plate options:', error);
          // Use default plate options if API fails
          setPlateOptions([
            {
              id: 'plate-1',
              name: '1-Meat Plate',
              description: 'Your choice of 1 meat served with two sides.',
              price: 14.99,
              category: 'plates',
              image_url: '/images/menu-items/brisket-plate.jpg',
              tags: ['bbq', 'meat', 'plate'],
              stock: 100,
              featured: false
            },
            {
              id: 'plate-2',
              name: '2-Meat Plate',
              description: 'Your choice of 2 meats served with two sides.',
              price: 18.99,
              category: 'plates',
              image_url: '/images/menu-items/ribs-plate.jpg',
              tags: ['bbq', 'meat', 'plate'],
              stock: 100,
              featured: true
            },
            {
              id: 'plate-3',
              name: '3-Meat Plate',
              description: 'Your choice of 3 meats served with two sides.',
              price: 22.99,
              category: 'plates',
              image_url: '/images/menu-items/combo-plate.jpg',
              tags: ['bbq', 'meat', 'plate'],
              stock: 100,
              featured: false
            },
            {
              id: 'plate-4',
              name: '4-Meat Plate',
              description: 'Your choice of 4 meats served with two sides.',
              price: 26.99,
              category: 'plates',
              image_url: '/images/menu-items/combo-plate.jpg',
              tags: ['bbq', 'meat', 'plate'],
              stock: 100,
              featured: false
            },
            {
              id: 'plate-5',
              name: '5-Meat Plate',
              description: 'Your choice of 5 meats served with two sides. The ultimate BBQ experience!',
              price: 29.99,
              category: 'plates',
              image_url: '/images/menu-items/combo-plate.jpg',
              tags: ['bbq', 'meat', 'plate'],
              stock: 100,
              featured: false
            }
          ]);
        }
        
        // Check for holidays
        const holidayCheck = checkHolidays();
        setIsHoliday(holidayCheck.isHoliday);
        if (holidayCheck.holidayName) {
          setHolidayName(holidayCheck.holidayName);
        }
      } catch (error) {
        console.error('Error loading menu data:', error);
      }
    };
    
    loadData();
    
    // Get user location
    if (navigator.geolocation) {
      setIsLocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, we would reverse geocode the coordinates
          // For now, just set a placeholder
          setUserLocation("Near you");
          setIsLocationLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLocationLoading(false);
        }
      );
    }
    
    // Simulate getting a real-time wait time from the server
    const interval = setInterval(() => {
      // In a real app, this would be an API call
      const randomWaitTime = Math.floor(Math.random() * 10) + 10;
      setWaitTime(randomWaitTime);
    }, 60000); // Update every minute
    
    // Check for holidays
    const holidayCheck = checkHolidays();
    setIsHoliday(holidayCheck.isHoliday);
    if (holidayCheck.holidayName) {
      setHolidayName(holidayCheck.holidayName);
    }
    
    return () => clearInterval(interval);
  }, []);
  
  // Compute filtered items for featured carousel
  const featuredItems = menuItems.filter(item => item.featured);
  
  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };
  
  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  // Handle filter toggle
  const handleFilterToggle = (filter: string) => {
    setActiveFilters(prev => {
      if (prev.includes(filter)) {
        return prev.filter(f => f !== filter);
      } else {
        return [...prev, filter];
      }
    });
  };
  
  // Add item to cart
  const handleAddToCart = (item: any, selectedOptions?: any[], specialInstructions?: string) => {
    addItem(item, selectedOptions, specialInstructions);
    
    setToast({ message: `${item.name} added to cart!`, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
    
    // Update upsell recommendations
    updateUpsellRecommendations();
  };
  
  // Open combo builder with selected template
  const openComboBuilder = (templateIndex: number = 0) => {
    setSelectedComboTemplate(comboTemplates[templateIndex]);
    setIsComboBuilderOpen(true);
  };
  
  // Update upsell recommendations based on cart contents
  const updateUpsellRecommendations = () => {
    const recommendations = getUpsellRecommendations(cartItems, menuItems, 2);
    setUpsellRecommendations(recommendations);
  };
  
  // Handle checkout
  const handleCheckout = () => {
    // Navigate to checkout page
    router.push('/checkout');
  };
  
  // Define category icons for the visual navigation
  const categoryIcons = [
    { name: "Plates", icon: "🍖", path: "/menu?category=plates" },
    { name: "Sandwiches", icon: "🥪", path: "/menu?category=sandwiches" },
    { name: "Combos", icon: "🔥", path: "/menu?category=combos" },
    { name: "Sides", icon: "🥗", path: "/menu?category=sides" },
    { name: "Drinks", icon: "🥤", path: "/menu?category=drinks" },
    { name: "Desserts", icon: "🍰", path: "/menu?category=desserts" },
    { name: "Family Packs", icon: "👨‍👩‍👧‍👦", path: "/menu?category=family" }
  ];

  return (
    <>
      <Head>
        <title>Brown's Bar-B-Cue | Authentic Texas BBQ</title>
        <meta name="description" content="Order authentic Texas BBQ from Brown's Bar-B-Cue. Brisket, ribs, pulled pork, and more!" />
      </Head>
      
      {/* Holiday Confetti */}
      {isHoliday && <Confetti duration={15000} />}
      
      {/* Network Status Indicator */}
      <NetworkStatus />
      
      <main 
        className="min-h-screen bg-black text-white"
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
                TODAY ONLY
              </span>
              <span className="font-bold text-lg">{dailySpecial.title}: {dailySpecial.description}</span>
            </div>
            <span className="bg-red-600 text-white font-bold px-3 py-1 rounded-lg">
              {dailySpecial.savings}
            </span>
          </div>
        </motion.div>
        
        {/* Hero Section */}
        <div className="relative py-20">
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center"></div>
          <div className="relative z-10">
            <motion.div 
              className="text-center px-4 max-w-4xl mx-auto"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <motion.div variants={itemVariants}>
                <img 
                  src="/images/logo.png" 
                  alt="Brown's Bar-B-Cue Logo" 
                  className="h-32 md:h-40 mx-auto mb-6"
                />
              </motion.div>
              
              <motion.h1 
                className="text-4xl md:text-6xl font-bold mb-4 text-amber-500 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
                variants={itemVariants}
              >
                Authentic Texas BBQ
              </motion.h1>
              
              <motion.p 
                className="text-xl md:text-2xl mb-8 text-amber-300"
                variants={itemVariants}
              >
                Slow-smoked meats and homemade sides since 1985
              </motion.p>
              
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                <button 
                  onClick={() => router.push('/menu')}
                  className="px-12 py-5 bg-gradient-to-r from-red-900 to-amber-900 hover:from-red-800 hover:to-amber-800 rounded-lg text-2xl font-bold transition-all transform hover:scale-105 shadow-lg flex items-center justify-center border-2 border-amber-600"
                >
                  <span>Start Your Order</span>
                  <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
                
                <button 
                  onClick={() => openComboBuilder()}
                  className="px-8 py-4 bg-amber-800 hover:bg-amber-700 rounded-lg text-xl font-bold transition-colors border-2 border-amber-600"
                >
                  Build a Combo
                </button>
              </motion.div>
              
              {userLocation && (
                <motion.div 
                  className="mt-4 text-amber-300"
                  variants={itemVariants}
                >
                  <p>
                    <span className="font-bold">{userLocation}</span> • Current Wait Time: <span className="font-bold">{waitTime} mins</span>
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
        
        {/* Category Navigation with Visual Icons */}
        <div className="py-12 px-4 bg-black bg-opacity-80">
          <div className="max-w-6xl mx-auto">
            <motion.h2 
              className="text-3xl font-bold mb-8 text-center text-amber-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Browse Our Menu
            </motion.h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categoryIcons.map((category, index) => (
                <motion.div
                  key={category.name}
                  className="bg-black bg-opacity-50 rounded-lg p-4 text-center cursor-pointer hover:bg-amber-900 transition-colors shadow-md border-2 border-amber-600"
                  onClick={() => router.push(category.path)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + (index * 0.05) }}
                >
                  <div className="text-4xl mb-2">{category.icon}</div>
                  <h3 className="font-bold text-amber-300">{category.name}</h3>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="container py-12 px-4 mx-auto">
          {/* Featured Items */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-amber-500">Today's BBQ Specials</h2>
            <FeaturedCarousel items={featuredItems} />
          </section>
          
          {/* Build Your Combo Banner */}
          <div className="mb-8 bg-gradient-to-r from-red-900 to-amber-900 rounded-lg p-4 shadow-lg border-2 border-amber-600">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-2xl font-bold text-amber-300">Build Your Perfect BBQ Combo</h3>
                <p className="text-amber-200">Customize your meal and save up to 20%</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => openComboBuilder(0)}
                  className="px-4 py-2 bg-amber-800 hover:bg-amber-700 text-white rounded-lg font-bold transition-colors"
                >
                  BBQ Feast
                </button>
                <button 
                  onClick={() => openComboBuilder(1)}
                  className="px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded-lg font-bold transition-colors"
                >
                  Family Pack
                </button>
              </div>
            </div>
          </div>
          
          {/* Search & Filters */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
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
              
              <div className="flex gap-2 flex-wrap">
                {['Spicy', 'Vegetarian', 'Gluten-Free', 'New'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => handleFilterToggle(filter)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      activeFilters.includes(filter)
                        ? 'bg-amber-800 text-white'
                        : 'bg-black bg-opacity-50 text-amber-300 hover:bg-amber-900 border border-amber-600'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {menuItems
              .filter(item => 
                (selectedCategory === 'all' || item.category === selectedCategory) &&
                (searchQuery === '' || 
                  item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
                ) &&
                (activeFilters.length === 0 || 
                  activeFilters.every(filter => 
                    item.tags && item.tags.includes(filter.toLowerCase())
                  )
                )
              )
              .slice(0, 6)
              .map((item) => (
                <motion.div
                  key={item.id}
                  className="bg-black bg-opacity-50 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow border-2 border-amber-600"
                  whileHover={{ y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
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
                      onClick={() => router.push(`/configure-item/${item.id}`)}
                      className="w-full py-2 bg-amber-800 hover:bg-amber-700 rounded text-white font-bold transition-colors"
                    >
                      Select
                    </button>
                  </div>
                </motion.div>
              ))}
          </div>
          
          {/* View All Button */}
          <div className="text-center mb-12">
            <button
              onClick={() => router.push('/menu')}
              className="px-6 py-3 bg-gradient-to-r from-red-900 to-amber-900 hover:from-red-800 hover:to-amber-800 rounded-lg font-bold transition-colors inline-flex items-center border-2 border-amber-600"
            >
              View Full Menu
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
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
        
        {/* Combo Builder */}
        {isComboBuilderOpen && (
          <ComboBuilder
            template={selectedComboTemplate}
            onClose={() => setIsComboBuilderOpen(false)}
            onAddToCart={addCombo}
          />
        )}
        
        {/* Toast Notification */}
        <Toast 
          message={toast.message}
          visible={toast.visible}
          onClose={() => setToast(prev => ({ ...prev, visible: false }))}
        />
        
        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}
