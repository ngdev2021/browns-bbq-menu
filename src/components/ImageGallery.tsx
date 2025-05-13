import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface ImageGalleryProps {
  mainImage: string;
  additionalImages?: string[];
  alt: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ 
  mainImage, 
  additionalImages = [], 
  alt 
}) => {
  const [currentImage, setCurrentImage] = useState(mainImage);
  const [isZoomed, setIsZoomed] = useState(false);
  
  const allImages = [mainImage, ...additionalImages].filter(Boolean);
  
  const handleImageClick = () => {
    setIsZoomed(!isZoomed);
  };
  
  const handleThumbnailClick = (image: string) => {
    setCurrentImage(image);
  };
  
  return (
    <div className="relative">
      {/* Main Image */}
      <div 
        className="relative overflow-hidden rounded-lg bg-charcoal-800 cursor-pointer"
        style={{ height: '280px' }}
        onClick={handleImageClick}
      >
        <Image 
          src={currentImage || '/images/placeholder-food.jpg'} 
          alt={alt}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-500 ease-in-out hover:scale-105"
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            (e.target as HTMLImageElement).src = '/images/placeholder-food.jpg';
          }}
        />
        
        {/* Premium badge */}
        <div className="absolute top-3 right-3 bg-bbq-700 text-white px-2 py-1 rounded-full text-xs font-bold shadow-premium">
          Premium BBQ
        </div>
      </div>
      
      {/* Thumbnail Gallery */}
      {allImages.length > 1 && (
        <div className="flex mt-2 space-x-2 overflow-x-auto pb-2">
          {allImages.map((image, index) => (
            <div 
              key={index}
              className={`relative w-16 h-16 rounded-md overflow-hidden cursor-pointer transition-all ${currentImage === image ? 'ring-2 ring-amber-500' : 'opacity-70 hover:opacity-100'}`}
              onClick={() => handleThumbnailClick(image)}
            >
              <Image 
                src={image || '/images/placeholder-food.jpg'} 
                alt={`${alt} thumbnail ${index + 1}`}
                layout="fill"
                objectFit="cover"
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  (e.target as HTMLImageElement).src = '/images/placeholder-food.jpg';
                }}
              />
            </div>
          ))}
        </div>
      )}
      
      {/* Zoomed Image Modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleImageClick}
          >
            <motion.div
              className="relative max-w-4xl max-h-[80vh] overflow-hidden rounded-lg"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <Image 
                src={currentImage || '/images/placeholder-food.jpg'} 
                alt={alt}
                width={800}
                height={600}
                objectFit="contain"
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  (e.target as HTMLImageElement).src = '/images/placeholder-food.jpg';
                }}
              />
              
              <button
                className="absolute top-4 right-4 bg-charcoal-800/80 text-white rounded-full p-2"
                onClick={handleImageClick}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageGallery;
