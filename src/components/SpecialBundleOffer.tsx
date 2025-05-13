import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import BundleSelectionModal from './BundleSelectionModal';
import { drinks } from '../data/drinks';
import { sides } from '../data/sides';

interface BundleItem {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  category: string;
}

interface SpecialBundleOfferProps {
  title?: string;
  description?: string;
  savings?: string;
  imageUrl?: string;
  originalPrice?: number;
  discountedPrice?: number;
  onAccept?: (selectedSide: BundleItem, selectedDrink: BundleItem) => void;
  onDecline?: () => void;
}

const SpecialBundleOffer: React.FC<SpecialBundleOfferProps> = ({
  title = "Special Bundle Offer",
  description = "Get a drink and a side with your meal at a special discounted price!",
  savings = "SAVE $5",
  imageUrl = "/images/menu-items/combo-special.jpg",
  originalPrice = 14.99,
  discountedPrice = 9.99,
  onAccept,
  onDecline
}) => {
  // Calculate savings amount
  const savingsAmount = originalPrice - discountedPrice;
  
  // State for bundle selection modal
  const [showBundleModal, setShowBundleModal] = useState(false);
  
  // Handle bundle selection
  const handleBundleSelection = (selectedSide: BundleItem, selectedDrink: BundleItem) => {
    setShowBundleModal(false);
    if (onAccept) {
      onAccept(selectedSide, selectedDrink);
    }
  };
  
  // Open bundle selection modal
  const openBundleModal = () => {
    setShowBundleModal(true);
  };
  
  return (
    <>
      <motion.div 
        className="bg-gradient-to-r from-amber-700 to-red-700 rounded-lg overflow-hidden shadow-premium mb-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="relative">
          {/* Banner image */}
          <div className="h-40 relative overflow-hidden">
            <Image 
              src={imageUrl} 
              alt={title}
              layout="fill"
              objectFit="cover"
              className="brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
          </div>
          
          {/* Savings badge */}
          <div className="absolute top-4 right-4 bg-white text-red-800 font-bold px-3 py-2 rounded-full shadow-lg transform rotate-3 flex items-center">
            <span className="text-2xl mr-1">🔥</span>
            <span>{savings}</span>
          </div>
          
          {/* Limited time badge */}
          <div className="absolute top-4 left-4 bg-amber-400 text-red-900 text-xs font-bold px-3 py-1 rounded-full shadow-md">
            TODAY ONLY
          </div>
        </div>
        
        <div className="p-5">
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-white opacity-90 mb-4">{description}</p>
          
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center">
              <span className="text-white opacity-70 line-through mr-2">${originalPrice.toFixed(2)}</span>
              <span className="text-white font-bold text-xl">${discountedPrice.toFixed(2)}</span>
            </div>
            <span className="text-amber-300 font-medium">Save ${savingsAmount.toFixed(2)}</span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              className="py-3 px-4 bg-white text-red-800 rounded-md font-bold hover:bg-gray-100 transition-colors flex-1 flex items-center justify-center"
              onClick={openBundleModal}
            >
              <span>Get This Deal</span>
              <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            <button
              className="py-3 px-4 bg-transparent border border-white text-white rounded-md font-bold hover:bg-white hover:bg-opacity-10 transition-colors"
              onClick={onDecline}
            >
              No Thanks
            </button>
          </div>
        </div>
        
        {/* Timer indicator */}
        <div className="px-5 py-3 bg-black bg-opacity-30 flex items-center justify-between">
          <div className="flex items-center text-white">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm">Offer expires at midnight</span>
          </div>
          <span className="text-amber-300 text-sm font-medium">Limited availability</span>
        </div>
      </motion.div>
      
      {/* Bundle Selection Modal */}
      <BundleSelectionModal
        isOpen={showBundleModal}
        onClose={() => setShowBundleModal(false)}
        onConfirm={handleBundleSelection}
        availableSides={sides}
        availableDrinks={drinks}
        bundlePrice={discountedPrice}
        originalPrice={originalPrice}
      />
    </>
  );
};

export default SpecialBundleOffer;
