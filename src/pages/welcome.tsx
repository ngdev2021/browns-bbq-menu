import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getBusinessSettingsSync } from '../lib/menuService';

// Get business settings
const businessSettings = getBusinessSettingsSync();

const WelcomePage: React.FC = () => {
  const router = useRouter();
  const [waitTime, setWaitTime] = useState<number>(15); // Default wait time in minutes
  const [userLocation, setUserLocation] = useState<string | null>(null);
  const [isLocationLoading, setIsLocationLoading] = useState<boolean>(false);
  
  // Get current day for specials
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Determine if there's a special today
  const getDailySpecial = () => {
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
  };
  
  const dailySpecial = getDailySpecial();
  
  // Get user location
  useEffect(() => {
    const getUserLocation = () => {
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
    };
    
    getUserLocation();
    
    // Simulate getting a real-time wait time from the server
    const interval = setInterval(() => {
      // In a real app, this would be an API call
      const randomWaitTime = Math.floor(Math.random() * 10) + 10;
      setWaitTime(randomWaitTime);
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);
  
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
  
  return (
    <>
      <Head>
        <title>Welcome to Brown's Bar-B-Cue | Authentic Texas BBQ</title>
        <meta name="description" content="Authentic Texas BBQ since 1985. Order online for pickup or delivery." />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-b from-charcoal-900 to-charcoal-800 text-white">
        {/* Today's Special Banner */}
        <motion.div 
          className="bg-gradient-to-r from-amber-700 to-red-800 py-3 px-4 text-center relative overflow-hidden"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="absolute -left-8 top-0 bottom-0 w-24 bg-white bg-opacity-10 transform rotate-12"></div>
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center mb-2 sm:mb-0">
              <span className="bg-white text-red-800 text-xs font-bold px-2 py-1 rounded mr-3">
                TODAY ONLY
              </span>
              <span className="font-bold text-lg">{dailySpecial.title}: {dailySpecial.description}</span>
            </div>
            <span className="bg-white text-red-800 font-bold px-3 py-1 rounded-lg animate-pulse">
              {dailySpecial.savings}
            </span>
          </div>
        </motion.div>
        
        {/* Hero Section */}
        <div 
          className="relative h-screen max-h-[700px] flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: "url('/images/bbq-hero-dark.jpg')" }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
          
          <motion.div 
            className="relative z-10 text-center px-4 max-w-4xl mx-auto"
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
              className="text-4xl md:text-6xl font-bold mb-4"
              variants={itemVariants}
            >
              Authentic Texas BBQ
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl mb-8 text-gray-200"
              variants={itemVariants}
            >
              Slow-smoked meats and homemade sides since 1985
            </motion.p>
            
            <motion.div variants={itemVariants}>
              <button 
                onClick={() => router.push('/menu')}
                className="px-12 py-5 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 rounded-lg text-2xl font-bold transition-all transform hover:scale-105 shadow-lg w-64 flex items-center justify-center mx-auto"
              >
                <span>Start Your Order</span>
                <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
              
              <div className="flex items-center">
                <svg className="w-6 h-6 mr-2 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span>Open 11am - 9pm</span>
              </div>
              
              <div className="hidden md:flex items-center">
                <svg className="w-6 h-6 mr-2 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" clipRule="evenodd" />
                </svg>
                <span>Current Wait: {waitTime} mins</span>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Daily Special Banner */}
          <motion.div 
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-amber-800 to-red-800 py-4 px-6 flex justify-between items-center"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
          >
            <div className="flex items-center">
              <span className="text-amber-300 text-2xl mr-3">🔥</span>
              <div>
                <span className="font-bold">{dailySpecial.title} — </span>
                <span>{dailySpecial.description}</span>
              </div>
            </div>
            <div className="bg-amber-300 text-red-900 font-bold px-3 py-1 rounded-md text-sm">
              {dailySpecial.savings}
            </div>
          </motion.div>
        </div>
        
        {/* Quick Categories */}
        <div className="py-12 px-4 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">What are you craving today?</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Plates", image: "/images/bbq-plate.jpg", path: "/menu?category=plates" },
              { name: "Sandwiches", image: "/images/bbq-sandwich.jpg", path: "/menu?category=sandwiches" },
              { name: "Combo Specials", image: "/images/bbq-combo.jpg", path: "/menu?category=combos" },
              { name: "Family Packs", image: "/images/bbq-family.jpg", path: "/menu?category=family" }
            ].map((category, index) => (
              <motion.div
                key={category.name}
                className="bg-charcoal-700 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => router.push(category.path)}
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (index * 0.1) }}
              >
                <div className="h-36 overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover transition-transform hover:scale-110"
                  />
                </div>
                <div className="p-4 text-center font-bold">{category.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Fan Favorites */}
        <div className="py-12 px-4 bg-charcoal-700 bg-opacity-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-2 text-center">Fan Favorites</h2>
            <p className="text-center text-gray-400 mb-8">Our most ordered items</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { 
                  name: "Brisket Plate", 
                  description: "1/2 lb of our signature slow-smoked brisket with two sides", 
                  price: 18.99,
                  image: "/images/brisket-plate.jpg" 
                },
                { 
                  name: "Pulled Pork Sandwich", 
                  description: "Tender pulled pork with house slaw on a brioche bun", 
                  price: 12.99,
                  image: "/images/pulled-pork.jpg" 
                },
                { 
                  name: "Three Meat Combo", 
                  description: "Your choice of three meats with two sides", 
                  price: 24.99,
                  image: "/images/three-meat.jpg" 
                }
              ].map((item, index) => (
                <motion.div
                  key={item.name}
                  className="bg-charcoal-800 rounded-lg overflow-hidden shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + (index * 0.1) }}
                >
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xl font-bold">{item.name}</h3>
                      <span className="text-amber-400 font-bold">${item.price.toFixed(2)}</span>
                    </div>
                    <p className="text-gray-400 mb-4">{item.description}</p>
                    <button 
                      onClick={() => router.push('/menu')}
                      className="w-full py-2 bg-red-700 hover:bg-red-600 rounded text-white font-bold transition-colors"
                    >
                      Add to Order
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Testimonials */}
        <div className="py-12 px-4 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">What Our Customers Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { 
                quote: "Best brisket I've ever had. The bark is perfect and the meat just melts in your mouth!", 
                author: "Michael T.",
                stars: 5
              },
              { 
                quote: "Their family pack fed my entire crew and everyone raved about it. Will definitely order again!", 
                author: "Sarah K.",
                stars: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-charcoal-700 p-6 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + (index * 0.1) }}
              >
                <div className="flex mb-4">
                  {Array.from({ length: testimonial.stars }).map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-300 italic mb-4">"{testimonial.quote}"</p>
                <p className="text-amber-400 font-medium">— {testimonial.author}</p>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Footer CTA */}
        <div className="py-12 px-4 bg-gradient-to-r from-red-900 to-amber-900 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to experience authentic Texas BBQ?</h2>
            <p className="text-xl text-gray-200 mb-8">Order now and skip the line!</p>
            <button 
              onClick={() => router.push('/menu')}
              className="px-8 py-4 bg-white text-red-900 hover:bg-gray-200 rounded-lg text-xl font-bold transition-colors"
            >
              Start Your Order
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default WelcomePage;
