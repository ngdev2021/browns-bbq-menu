import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
  message: string;
  visible: boolean;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ 
  message, 
  visible, 
  onClose, 
  duration = 1500 
}) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-24 right-6 bg-charcoal-800 text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center"
        >
          <span className="mr-2 text-teal-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </span>
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
