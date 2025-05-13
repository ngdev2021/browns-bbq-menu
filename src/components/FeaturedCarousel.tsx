import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCacheBustedImageUrl, getMenuItemImagePath } from '../lib/imageUtils';

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
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});
  
  // Animation variants
  const variants = {
    enter: { opacity: 0, scale: 0.9 },
    center: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.1 }
  };

  // Process image URLs with cache-busting and preload images
  useEffect(() => {
    if (items.length === 0) return;
    
    const newImageUrls: Record<string, string> = {};
    const loadImage = (item: FeaturedItem) => {
      try {
        // Get the correct image path and add cache busting
        const mappedImagePath = getMenuItemImagePath(item.image_url);
        const fullImageUrl = getCacheBustedImageUrl(mappedImagePath);
        
        // Preload the image
        const img = new Image();
        img.onload = () => {
          // Update the loaded state for this image
          setImagesLoaded(prev => ({
            ...prev,
            [item.id]: true
          }));
        };
        img.onerror = () => {
          console.error(`Failed to preload image for featured item: ${item.name}`);
          // Fall back to placeholder
          newImageUrls[item.id] = '/images/placeholder-food.jpg';
          setImageUrls({...newImageUrls});
          // Mark as loaded even though it's a fallback
          setImagesLoaded(prev => ({
            ...prev,
            [item.id]: true
          }));
        };
        
        // Set the URL and start loading
        newImageUrls[item.id] = fullImageUrl;
        img.src = fullImageUrl;
      } catch (error) {
        console.error(`Error loading image for featured item: ${item.name}`, error);
        newImageUrls[item.id] = '/images/placeholder-food.jpg';
        setImagesLoaded(prev => ({
          ...prev,
          [item.id]: true
        }));
      }
    };
    
    // Process each item
    items.forEach(loadImage);
    
    // Update the URLs state
    setImageUrls(newImageUrls);
  }, [items]);
  
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
                {!imagesLoaded[currentItem.id] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-charcoal-700 z-10">
                    <div className="w-12 h-12 border-4 border-t-teal-500 border-charcoal-600 rounded-full animate-spin"></div>
                  </div>
                )}
                <img 
                  src={imageUrls[currentItem.id] || '/images/placeholder-food.jpg'}
                  alt={currentItem.name}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${imagesLoaded[currentItem.id] ? 'opacity-100' : 'opacity-0'}`}
                  loading="eager"
                  onLoad={() => {
                    setImagesLoaded(prev => ({
                      ...prev,
                      [currentItem.id]: true
                    }));
                  }}
                  onError={() => {
                    console.error(`Failed to load featured carousel image for: ${currentItem.name}`);
                    // Fall back to placeholder if image fails to load
                    setImageUrls(prev => ({
                      ...prev,
                      [currentItem.id]: '/images/placeholder-food.jpg'
                    }));
                    // Mark as loaded even though it's a fallback
                    setImagesLoaded(prev => ({
                      ...prev,
                      [currentItem.id]: true
                    }));
                  }}
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