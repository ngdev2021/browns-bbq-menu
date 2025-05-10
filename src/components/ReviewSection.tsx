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

interface ReviewSectionProps {
  itemId: string;
  reviews: Review[];
  onAddReview: (review: Omit<Review, 'id' | 'date'>) => void;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ itemId, reviews, onAddReview }) => {
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      onAddReview({
        itemId,
        userName,
        rating,
        comment
      });
      
      // Show success message
      setSuccessMessage('Thank you for your review!');
      
      // Reset form
      setUserName('');
      setComment('');
      setRating(5);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
        setShowForm(false);
      }, 3000);
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  return (
    <div className="mt-8 border-t border-charcoal-700 pt-6">
      <h3 className="text-xl font-bold mb-4 flex items-center">
        <span className="mr-2">Customer Reviews</span>
        {reviews.length > 0 && (
          <span className="flex items-center bg-charcoal-800 px-2 py-1 rounded text-sm">
            <span className="text-yellow-400 mr-1">★</span>
            <span>{averageRating}</span>
            <span className="text-charcoal-400 ml-1">({reviews.length})</span>
          </span>
        )}
      </h3>
      
      {/* Success message */}
      <AnimatePresence>
        {successMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-teal-500 text-white p-3 rounded-lg mb-4 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>
      
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <motion.div 
              key={review.id} 
              className="bg-charcoal-800 p-4 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold">{review.userName}</span>
                <div className="flex items-center">
                  <span className="text-yellow-400 flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-charcoal-600'}>★</span>
                    ))}
                  </span>
                  <span className="ml-2 text-sm text-charcoal-400">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <p className="text-charcoal-300">{review.comment}</p>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-charcoal-400 mb-4 italic">No reviews yet. Be the first to leave a review!</p>
      )}
      
      <AnimatePresence>
        {showForm ? (
          <motion.form 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit} 
            className="mt-6 bg-charcoal-800 p-4 rounded-lg overflow-hidden"
          >
            <div className="mb-4">
              <label htmlFor="userName" className="block mb-1 font-medium">Your Name</label>
              <input
                type="text"
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-charcoal-700 rounded p-2 text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-1 font-medium">Rating</label>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    type="button"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setRating(star)}
                    className="text-2xl focus:outline-none mr-1"
                    disabled={isSubmitting}
                  >
                    <span className={star <= rating ? 'text-yellow-400' : 'text-charcoal-600'}>★</span>
                  </motion.button>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="comment" className="block mb-1 font-medium">Your Review</label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-charcoal-700 rounded p-2 text-white h-24 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded bg-charcoal-700 hover:bg-charcoal-600"
                disabled={isSubmitting}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded flex items-center ${isSubmitting ? 'bg-teal-700' : 'bg-teal-500 hover:bg-teal-400'} text-white`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : 'Submit Review'}
              </motion.button>
            </div>
          </motion.form>
        ) : (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="mt-4 px-4 py-2 rounded bg-teal-500 hover:bg-teal-400 text-white flex items-center"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Write a Review
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReviewSection;
