import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MenuItemDetails from './MenuItemDetails';
import MenuItemCustomizer from './MenuItemCustomizer';
import { getCacheBustedImageUrl, getMenuItemImagePath } from '../lib/imageUtils';
import { getModifiersForMenuItem } from '../data/menuCustomizationData';
import { getRelatedItems } from '../lib/upsellEngine';
import { MenuItem } from '../lib/menuService';

// Using MenuItem from menuService

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: any, selectedOptions?: any[], specialInstructions?: string) => void;
  menuItems: MenuItem[];
}

// Tag icons mapping
const tagIcons: Record<string, JSX.Element> = {
  'vegan': (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,20c-4.41,0-8-3.59-8-8 c0-4.41,3.59-8,8-8s8,3.59,8,8C20,16.41,16.41,20,12,20z M11,12l-3,3l1.5,1.5L15,11l-1.5-1.5L11,12z" />
    </svg>
  ),
  'vegetarian': (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,20c-4.41,0-8-3.59-8-8 c0-4.41,3.59-8,8-8s8,3.59,8,8C20,16.41,16.41,20,12,20z M11,12l-3,3l1.5,1.5L15,11l-1.5-1.5L11,12z" />
    </svg>
  ),
  'gluten-free': (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,20c-4.41,0-8-3.59-8-8 c0-4.41,3.59-8,8-8s8,3.59,8,8C20,16.41,16.41,20,12,20z M7,11h10v2H7V11z" />
    </svg>
  ),
  'spicy': (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,20c-4.41,0-8-3.59-8-8 c0-4.41,3.59-8,8-8s8,3.59,8,8C20,16.41,16.41,20,12,20z M11,12l-3,3l1.5,1.5L15,11l-1.5-1.5L11,12z" />
    </svg>
  ),
};

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onAddToCart, menuItems }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState('/images/placeholder-food.jpg');
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Get modifiers for this item and filter out null values
  const modifiers = (getModifiersForMenuItem(item.id) || []).filter(Boolean) as any[];
  
  // Get related items for upselling
  const relatedItems = getRelatedItems(item, menuItems, 3);
  
  // Handle image loading with cache-busting
  useEffect(() => {
    if (typeof window !== 'undefined') {
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
          console.error(`Failed to preload image: ${fullImageUrl}`);
          // Fall back to placeholder
          setImageSrc('/images/placeholder-food.jpg');
          setImageLoaded(true);
        };
        img.src = fullImageUrl;
      } catch (error) {
        console.error('Error loading image:', error);
        setImageSrc('/images/placeholder-food.jpg');
        setImageLoaded(true);
      }
    }
  }, [item.image_url]);
  
  // Handle add to cart with animation
  const handleAddToCart = (customizedItem?: any, selectedOptions?: any[], specialInstructions?: string) => {
    if (item.stock === 0) return;
    
    // If we have modifiers and the customizer isn't open, open it instead of adding directly
    if (modifiers.length > 0 && !isCustomizerOpen && !customizedItem) {
      setIsCustomizerOpen(true);
      return;
    }
    
    setIsAdding(true);
    
    // Create and animate a flying element
    const flyingItem = document.createElement('div');
    flyingItem.className = 'fixed z-50 w-8 h-8 rounded-full bg-teal-500 shadow-lg';
    document.body.appendChild(flyingItem);
    
    // Get button position
    const button = document.getElementById(`add-to-cart-${item.id}`);
    const cart = document.querySelector('.cart-icon');
    
    if (button && cart) {
      const buttonRect = button.getBoundingClientRect();
      const cartRect = cart.getBoundingClientRect();
      
      // Set initial position
      flyingItem.style.top = `${buttonRect.top + buttonRect.height / 2}px`;
      flyingItem.style.left = `${buttonRect.left + buttonRect.width / 2}px`;
      
      // Animate to cart
      const startTime = performance.now();
      const duration = 800;
      
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Bezier curve animation for a natural arc
        const easeOutCubic = (progress: number): number => 1 - Math.pow(1 - progress, 3);
        const easeInOutQuad = (progress: number): number => progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        
        const x = buttonRect.left + (cartRect.left - buttonRect.left + cartRect.width / 2 - buttonRect.width / 2) * easeOutCubic(progress);
        const y = buttonRect.top + (cartRect.top - buttonRect.top) * easeInOutQuad(progress) - Math.sin(progress * Math.PI) * 100;
        
        // Apply position
        flyingItem.style.top = `${y}px`;
        flyingItem.style.left = `${x}px`;
        
        // Scale down as it approaches the cart
        const scale = 1 - easeOutCubic(progress) * 0.5;
        flyingItem.style.transform = `scale(${scale})`;
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Animation complete
          document.body.removeChild(flyingItem);
          
          // If we have a customized item, use that
          if (customizedItem) {
            onAddToCart(customizedItem, selectedOptions, specialInstructions);
          } else {
            onAddToCart(item);
          }
          
          setIsAdding(false);
        }
      };
      
      requestAnimationFrame(animate);
    } else {
      // Fallback if elements not found
      setTimeout(() => {
        if (customizedItem) {
          onAddToCart(customizedItem, selectedOptions, specialInstructions);
        } else {
          onAddToCart(item);
        }
        setIsAdding(false);
      }, 500);
    }
  };
  
  return (
    <>
      {/* Details Modal */}
      <MenuItemDetails 
        item={item}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onAddToCart={handleAddToCart}
      />
      
      {/* Customizer Modal */}
      {isCustomizerOpen && modifiers.length > 0 && (
        <MenuItemCustomizer
          item={item}
          modifierGroups={modifiers}
          onClose={() => setIsCustomizerOpen(false)}
          onAddToCart={handleAddToCart}
          recommendedItems={relatedItems}
        />
      )}
      
      <div 
        className="bg-charcoal-800 rounded-lg overflow-hidden shadow-lg relative cursor-pointer"
        onClick={() => setIsDetailsOpen(true)}
        role="button"
        tabIndex={0}
        aria-label={`View details for ${item.name}, $${item.price.toFixed(2)}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsDetailsOpen(true);
            e.preventDefault();
          }
        }}
      >
        {/* Stock indicator overlays */}
        {item.stock === 0 && (
          <div className="absolute inset-0 bg-charcoal-900/75 z-10 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-md font-bold transform -rotate-12">
              SOLD OUT
            </span>
          </div>
        )}
        
        {item.stock > 0 && item.stock < 5 && (
          <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
            Only {item.stock} left!
          </div>
        )}
        
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-charcoal-700">
              <div className="w-8 h-8 border-4 border-t-teal-500 border-charcoal-600 rounded-full animate-spin"></div>
            </div>
          )}
          <img 
            src={imageSrc} 
            alt={item.name}
            className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              console.error(`Failed to load image: ${imageSrc}`);
              // Fall back to placeholder if image fails to load
              setImageSrc('/images/placeholder-food.jpg');
            }}
          />
        </div>
        
        {/* Content */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold">{item.name}</h3>
            <span className="text-lg font-bold text-teal-400">${item.price.toFixed(2)}</span>
          </div>
          
          <p className="text-charcoal-300 text-sm mb-3 line-clamp-2">{item.description}</p>
          
          {/* Tags */}
          <div className="flex gap-1 mb-4" aria-label="Dietary information">
            {item.tags.map(tag => (
              tagIcons[tag] ? (
                <span 
                  key={tag} 
                  className="text-teal-400 bg-teal-900/30 p-1 rounded-full" 
                  title={tag}
                  role="img"
                  aria-label={tag}
                >
                  {tagIcons[tag]}
                </span>
              ) : null
            ))}
          </div>
          
          {/* Add to cart button */}
          <motion.button
            id={`add-to-cart-${item.id}`}
            onClick={(e) => {
              e.stopPropagation(); // Prevent opening details modal
              handleAddToCart();
            }}
            disabled={item.stock === 0 || isAdding}
            whileTap={{ scale: 0.95 }}
            className={`w-full py-2 rounded-md font-medium transition-colors ${item.stock === 0 ? 'bg-charcoal-700 text-charcoal-500 cursor-not-allowed' : 'bg-teal-500 hover:bg-teal-400 text-white'}`}
          >
            {isAdding ? 'Adding...' : item.stock === 0 ? 'Sold Out' : 'Add to Order'}
          </motion.button>
        </div>
      </div>
    </>
  );
};

export default MenuItemCard;