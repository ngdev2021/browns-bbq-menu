import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import HeroBackground from '../components/HeroBackground';
import FeaturedCarousel from '../components/FeaturedCarousel';
import CategoryNav from '../components/CategoryNav';
import SearchFilter from '../components/SearchFilter';
import MenuGrid from '../components/MenuGrid';
import CartDrawer from '../components/CartDrawer';
import Toast from '../components/Toast';
import NetworkStatus from '../components/NetworkStatus';
import Confetti from '../components/Confetti';
import Footer from '../components/Footer';
import { useCart } from '../contexts/CartContext';
import { checkHolidays } from '../lib/timeUtils';
import { SAMPLE_MENU_ITEMS } from '../data/sampleData';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

export default function Home() {
  // State for menu data
  const [menuItems] = useState(SAMPLE_MENU_ITEMS);
  
  // State for menu filtering
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  // Cart context
  const { items: cartItems, addItem, updateQuantity, isOpen: isCartOpen, setIsOpen: setIsCartOpen } = useCart();
  
  // Toast notifications
  const [toast, setToast] = useState({ message: '', visible: false });
  
  // Holiday detection
  const [isHoliday, setIsHoliday] = useState(false);
  const [holidayName, setHolidayName] = useState('');

  // Compute filtered items for featured carousel
  const featuredItems = menuItems.filter(item => item.featured);
  
  // Filter menu items based on category, search query, and active filters
  const filteredMenuItems = menuItems.filter(item => {
    // Filter by category
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !item.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by dietary preferences
    if (activeFilters.length > 0) {
      return activeFilters.some(filter => item.tags.includes(filter));
    }
    
    return true;
  });
  
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
  const handleAddToCart = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image_url: item.image_url
    });
    
    setToast({ message: `${item.name} added to cart!`, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
  };
  
  // Handle checkout
  const handleCheckout = () => {
    alert(`Checkout with ${cartItems.length} items for a total of $${cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}`);
    setIsCartOpen(false);
  };
  
  // Set time-of-day theme and check for holidays
  useEffect(() => {
    const hour = new Date().getHours();
    let timeOfDay = 'day'; // default
    
    if (hour < 11) {
      timeOfDay = 'morning';
    } else if (hour >= 17) {
      timeOfDay = 'evening';
    }
    
    document.documentElement.style.setProperty(
      '--current-accent', 
      `var(--accent-${timeOfDay})`
    );
    
    // Check for holidays using the utility function
    const { isHoliday: holiday, holidayName: name } = checkHolidays();
    setIsHoliday(holiday);
    setHolidayName(name || '');
    
    if (holiday) {
      console.log(`Happy ${name}!`);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Brown's Bar-B-Cue</title>
        <meta name="description" content="Authentic BBQ with plates, sandwiches, and combo meals" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* Holiday Confetti */}
      {isHoliday && <Confetti duration={15000} />}
      
      {/* Network Status Indicator */}
      <NetworkStatus />
      
      <main>
        {/* Hero Section */}
        <HeroBackground videoSrc="/videos/food-background.mp4">
          <div className="container h-full flex flex-col justify-center items-center text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Brown's Bar-B-Cue</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl">Authentic BBQ plates, sandwiches, and combo meals.</p>
            <button 
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
              className="px-8 py-3 bg-amber-700 hover:bg-amber-600 rounded-lg font-bold text-lg transition-colors"
            >
              View Menu
            </button>
          </div>
        </HeroBackground>
        
        {/* Main Content */}
        <div className="container py-12">
          {/* Featured Items */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-amber-700">Today's BBQ Specials</h2>
            <FeaturedCarousel items={featuredItems} />
          </section>
          
          {/* Category Navigation */}
          <CategoryNav 
            menuItems={menuItems} 
            onSelectCategory={handleCategorySelect} 
          />
          
          {/* Search & Filters */}
          <SearchFilter 
            onSearch={handleSearch} 
            onToggleFilter={handleFilterToggle} 
          />
          
          {/* Menu Grid */}
          <MenuGrid 
            items={filteredMenuItems}
            onAddToCart={handleAddToCart}
          />
        </div>
        
        {/* Cart Button */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-red-800 hover:bg-red-700 rounded-full shadow-lg flex items-center justify-center cart-icon"
          aria-label="Open cart"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
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
          onCheckout={handleCheckout}
        />
        
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
