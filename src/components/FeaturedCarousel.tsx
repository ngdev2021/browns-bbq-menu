import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FeaturedItem {
  id: string;
  name: string;
  image_url: string;
  price: number;
  description: string;
}

interface FeaturedCarouselProps {
  items: FeaturedItem[];
}

const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Animation variants
  const variants = {
    enter: { opacity: 0, scale: 0.9 },
    center: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.1 }
  };

  // Auto-rotate carousel
  useEffect(() => {
    if (items.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % items.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [items.length]);

  // Handle manual navigation
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (!items || items.length === 0) {
    return <div className="text-center py-12">No featured items available</div>;
  }

  const currentItem = items[currentIndex];

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-charcoal-800 shadow-xl">
      <div className="aspect-video relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentItem.id}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <div className="relative h-full w-full">
              {/* Image */}
              <div className="relative h-full w-full overflow-hidden">
                <img 
                  src={currentItem.image_url}
                  alt={currentItem.name}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 to-transparent" />
              </div>
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h2 className="text-3xl font-bold mb-2">{currentItem.name}</h2>
                <p className="text-lg mb-4 opacity-90">{currentItem.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">${currentItem.price.toFixed(2)}</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-teal-500 hover:bg-teal-400 rounded-lg font-semibold"
                  >
                    Order Now
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots navigation */}
      {items.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'bg-teal-400 w-4' : 'bg-white/50'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedCarousel;