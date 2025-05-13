import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReviewSection from './ReviewSection';
import { getCacheBustedImageUrl, getMenuItemImagePath } from '../lib/imageUtils';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  tags: string[];
  stock: number;
  featured: boolean;
  ingredients?: string[];
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  reviews?: Array<{
    id: string;
    itemId: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
  }>;
}

interface MenuItemDetailsProps {
  item: MenuItem;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: () => void;
}

const MenuItemDetails: React.FC<MenuItemDetailsProps> = ({
  item,
  isOpen,
  onClose,
  onAddToCart
}) => {
  const [imageSrc, setImageSrc] = useState('/images/placeholder-food.jpg');
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Handle image loading with cache-busting
  useEffect(() => {
    if (typeof window !== 'undefined' && isOpen) {
      try {
        // Get the correct image path and add cache busting
        const mappedImagePath = getMenuItemImagePath(item.image_url);
        const fullImageUrl = getCacheBustedImageUrl(mappedImagePath);
        
        // Preload the image to ensure it's available
        const img = new Image();
        img.onload = () => {
          setImageSrc(fullImageUrl);
          setImageLoaded(true);
        };
        img.onerror = () => {
          console.error(`Failed to preload image in details view: ${fullImageUrl}`);
          // Fall back to placeholder
          setImageSrc('/images/placeholder-food.jpg');
          setImageLoaded(true);
        };
        img.src = fullImageUrl;
      } catch (error) {
        console.error('Error loading image in details view:', error);
        setImageSrc('/images/placeholder-food.jpg');
        setImageLoaded(true);
      }
    }
  }, [item.image_url, isOpen]);
  
  if (!isOpen) return null;

  // Map of dietary tags to display names
  const dietaryTags: Record<string, string> = {
    'vegan': 'Vegan',
    'vegetarian': 'Vegetarian',
    'gluten-free': 'Gluten-Free',
    'spicy': 'Spicy',
    'dairy-free': 'Dairy-Free',
    'nut-free': 'Nut-Free'
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 z-40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', damping: 25 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-charcoal-800 rounded-xl overflow-hidden z-50 shadow-xl"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-charcoal-900/50 rounded-full p-2 text-white hover:bg-charcoal-900"
          aria-label="Close details"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Image */}
        <div className="relative h-64 overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-charcoal-700 z-10">
              <div className="w-10 h-10 border-4 border-t-teal-500 border-charcoal-600 rounded-full animate-spin"></div>
            </div>
          )}
          <img
            src={imageSrc}
            alt={item.name}
            className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            loading="eager"
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              console.error(`Failed to load image in details view: ${imageSrc}`);
              // Fall back to placeholder if image fails to load
              setImageSrc('/images/placeholder-food.jpg');
              setImageLoaded(true);
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 to-transparent" />
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-2xl font-bold">{item.name}</h2>
            <span className="text-xl font-bold text-teal-400">${item.price.toFixed(2)}</span>
          </div>
          
          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {item.tags.map(tag => (
                dietaryTags[tag] ? (
                  <span 
                    key={tag} 
                    className="px-2 py-1 bg-teal-900/30 text-teal-400 text-xs font-medium rounded-full"
                  >
                    {dietaryTags[tag]}
                  </span>
                ) : null
              ))}
            </div>
          )}
          
          {/* Description */}
          <p className="text-charcoal-300 mb-6">{item.description}</p>
          
          {/* Ingredients if available */}
          {item.ingredients && item.ingredients.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
              <ul className="list-disc list-inside text-charcoal-300">
                {item.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Nutritional info if available */}
          {item.nutritionalInfo && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Nutritional Information</h3>
              <div className="grid grid-cols-4 gap-2 text-center">
                {item.nutritionalInfo.calories !== undefined && (
                  <div className="bg-charcoal-700 rounded-lg p-2">
                    <div className="text-lg font-bold">{item.nutritionalInfo.calories}</div>
                    <div className="text-xs text-charcoal-400">Calories</div>
                  </div>
                )}
                {item.nutritionalInfo.protein !== undefined && (
                  <div className="bg-charcoal-700 rounded-lg p-2">
                    <div className="text-lg font-bold">{item.nutritionalInfo.protein}g</div>
                    <div className="text-xs text-charcoal-400">Protein</div>
                  </div>
                )}
                {item.nutritionalInfo.carbs !== undefined && (
                  <div className="bg-charcoal-700 rounded-lg p-2">
                    <div className="text-lg font-bold">{item.nutritionalInfo.carbs}g</div>
                    <div className="text-xs text-charcoal-400">Carbs</div>
                  </div>
                )}
                {item.nutritionalInfo.fat !== undefined && (
                  <div className="bg-charcoal-700 rounded-lg p-2">
                    <div className="text-lg font-bold">{item.nutritionalInfo.fat}g</div>
                    <div className="text-xs text-charcoal-400">Fat</div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Stock status */}
          {item.stock === 0 ? (
            <div className="bg-red-900/20 text-red-400 px-4 py-2 rounded-lg text-center mb-4">
              Currently sold out
            </div>
          ) : item.stock < 5 ? (
            <div className="bg-amber-900/20 text-amber-400 px-4 py-2 rounded-lg text-center mb-4">
              Only {item.stock} left in stock
            </div>
          ) : null}
          
          {/* Add to cart button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onAddToCart}
            disabled={item.stock === 0}
            className={`w-full py-3 rounded-lg font-bold ${
              item.stock === 0 
                ? 'bg-charcoal-700 text-charcoal-500 cursor-not-allowed' 
                : 'bg-teal-500 hover:bg-teal-400 text-white'
            }`}
          >
            {item.stock === 0 ? 'Sold Out' : 'Add to Order'}
          </motion.button>
          
          {/* Reviews Section */}
          <ReviewSection 
            itemId={item.id}
            reviews={item.reviews || []}
            onAddReview={(review) => {
              // In a real app, this would send the review to the backend
              console.log('New review submitted:', review);
              // For now, we'll just show a success message
              alert('Thank you for your review!');
            }}
          />
        </div>
      </motion.div>
    </>
  );
};

export default MenuItemDetails;
