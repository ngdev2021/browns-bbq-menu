import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Review {
  id: string;
  itemId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

interface CustomerReviewsProps {
  reviews: Review[];
  itemName: string;
}

const CustomerReviews: React.FC<CustomerReviewsProps> = ({
  reviews,
  itemName
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };
  
  // Generate stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg 
          key={i}
          className={`w-4 h-4 ${i <= rating ? 'text-amber-500' : 'text-gray-500'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    return stars;
  };
  
  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 'No ratings';
  
  return (
    <div className="mt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full px-4 py-2 bg-charcoal-700 rounded-lg hover:bg-charcoal-600 transition-colors"
      >
        <div className="flex items-center">
          <span className="font-medium">Customer Reviews</span>
          {reviews.length > 0 && (
            <div className="ml-2 flex items-center">
              <div className="flex mr-1">
                {renderStars(Math.round(parseFloat(averageRating as string)))}
              </div>
              <span className="text-sm text-amber-500">({averageRating})</span>
            </div>
          )}
        </div>
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
              {reviews.length > 0 ? (
                <div className="space-y-3">
                  {reviews.map(review => (
                    <div key={review.id} className="p-3 bg-charcoal-600 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{review.userName}</div>
                          <div className="flex mt-1">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <div className="text-xs text-gray-400">
                          {formatDate(review.date)}
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-300">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-400">No reviews yet for {itemName}</p>
                  <p className="text-sm text-gray-500 mt-1">Be the first to share your experience!</p>
                </div>
              )}
              
              {/* Add review button - in a real app this would open a review form */}
              <button className="w-full mt-3 btn-secondary py-2">
                Write a Review
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomerReviews;
