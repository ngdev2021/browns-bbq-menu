import '../styles/globals.css';
import { useEffect, useState } from 'react';
import { CartProvider } from '../contexts/CartContext';
import { setTimeBasedTheme, checkHolidays } from '../lib/timeUtils';
import Confetti from '../components/Confetti';
import dynamic from 'next/dynamic';
import { preloadFreshImages, refreshPageImages, setupImageObserver } from '../lib/clearImageCache';

function App({ Component, pageProps }: any) {
  // Use useState with undefined as initial state to prevent hydration mismatch
  const [showConfetti, setShowConfetti] = useState<boolean | undefined>(undefined);
  const [holidayMessage, setHolidayMessage] = useState<string | undefined>(undefined);
  const [isMounted, setIsMounted] = useState(false);
  // Client-side only code
  useEffect(() => {
    setIsMounted(true);
    
    // Set theme on initial load
    setTimeBasedTheme();
    
    // Force reload of fresh images to clear browser cache
    preloadFreshImages()
      .then(() => {
        console.log('Successfully preloaded all fresh images');
        // After preloading, refresh any existing images on the page
        refreshPageImages();
        // Set up observer to catch dynamically loaded images
        setupImageObserver();
      })
      .catch(error => {
        console.error('Error preloading images:', error);
      });
    
    // Update theme every hour
    const interval = setInterval(setTimeBasedTheme, 3600000); // 1 hour
    
    return () => clearInterval(interval);
  }, []);

  // Check for holidays - only run on client
  useEffect(() => {
    if (isMounted) {
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
      } else {
        setShowConfetti(false);
        setHolidayMessage(undefined);
      }
    }
  }, [isMounted]);

  // Register service worker for offline support - only run on client
  useEffect(() => {
    if (isMounted && typeof window !== 'undefined' && 'serviceWorker' in navigator) {
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
  }, [isMounted]);

  return (
    <CartProvider>
      {/* Only render client-side components after mounting to prevent hydration errors */}
      {isMounted && showConfetti && <Confetti />}
      
      {isMounted && holidayMessage && (
        <div className="fixed top-4 left-0 right-0 mx-auto w-max z-50 bg-teal-500 text-white px-6 py-3 rounded-lg shadow-lg text-lg font-bold">
          {holidayMessage}
        </div>
      )}
      
      <Component {...pageProps} />
    </CartProvider>
  );
}

// Use Next.js dynamic import with SSR disabled to prevent hydration errors
export default dynamic(() => Promise.resolve(App), {
  ssr: false
});
