import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NutritionalInfoProps {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const NutritionalInfo: React.FC<NutritionalInfoProps> = ({
  calories,
  protein,
  carbs,
  fat
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="mt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full px-4 py-2 bg-charcoal-700 rounded-lg hover:bg-charcoal-600 transition-colors"
      >
        <span className="font-medium">Nutritional Information</span>
        <svg 
          className={`w-5 h-5 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 mt-2 bg-charcoal-700 rounded-lg">
              <div className="grid grid-cols-4 gap-2">
                <div className="flex flex-col items-center p-2 bg-charcoal-600 rounded-lg">
                  <span className="text-amber-500 font-bold text-lg">{calories}</span>
                  <span className="text-xs text-gray-300">Calories</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-charcoal-600 rounded-lg">
                  <span className="text-amber-500 font-bold text-lg">{protein}g</span>
                  <span className="text-xs text-gray-300">Protein</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-charcoal-600 rounded-lg">
                  <span className="text-amber-500 font-bold text-lg">{carbs}g</span>
                  <span className="text-xs text-gray-300">Carbs</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-charcoal-600 rounded-lg">
                  <span className="text-amber-500 font-bold text-lg">{fat}g</span>
                  <span className="text-xs text-gray-300">Fat</span>
                </div>
              </div>
              
              <div className="mt-3 text-xs text-gray-400">
                <p>* Nutritional values are approximate and may vary based on preparation method and portion size.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NutritionalInfo;
