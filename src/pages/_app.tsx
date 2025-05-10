import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { CartProvider } from '../contexts/CartContext';
import { setTimeBasedTheme, checkHolidays } from '../lib/timeUtils';
import Confetti from '../components/Confetti';

export default function App({ Component, pageProps }: AppProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [holidayMessage, setHolidayMessage] = useState('');
  // Time-of-day theming
  useEffect(() => {
    // Set theme on initial load
    setTimeBasedTheme();
    
    // Update theme every hour
    const interval = setInterval(setTimeBasedTheme, 3600000); // 1 hour
    
    return () => clearInterval(interval);
  }, []);

  // Check for holidays
  useEffect(() => {
    const { isHoliday, holidayName } = checkHolidays();
    
    if (isHoliday && holidayName) {
      setShowConfetti(true);
      setHolidayMessage(`Happy ${holidayName}!`);
      console.log(`Happy ${holidayName}!`);
      
      // Hide holiday message after 10 seconds
      const timer = setTimeout(() => {
        setHolidayMessage('');
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  // Register service worker for offline support
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(
          registration => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          },
          error => {
            console.log('ServiceWorker registration failed: ', error);
          }
        );
      });
    }
  }, []);

  return (
    <CartProvider>
      {showConfetti && <Confetti />}
      
      {holidayMessage && (
        <div className="fixed top-4 left-0 right-0 mx-auto w-max z-50 bg-teal-500 text-white px-6 py-3 rounded-lg shadow-lg text-lg font-bold">
          {holidayMessage}
        </div>
      )}
      
      <Component {...pageProps} />
    </CartProvider>
  );
}
