import { useState, useEffect } from 'react';

interface NetworkStatus {
  isOnline: boolean;
  wasOffline: boolean; // Tracks if there was a previous offline state
}

/**
 * Custom hook to track network status and handle online/offline transitions
 */
export function useNetworkStatus(): NetworkStatus {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [wasOffline, setWasOffline] = useState<boolean>(false);

  useEffect(() => {
    // Handler for when the network status changes to online
    const handleOnline = () => {
      setWasOffline(true); // Mark that we were previously offline
      setIsOnline(true);
      
      // Reset wasOffline after a delay to allow for reconnection UI to show
      setTimeout(() => {
        setWasOffline(false);
      }, 3000);
    };

    // Handler for when the network status changes to offline
    const handleOffline = () => {
      setIsOnline(false);
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Clean up event listeners on unmount
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, wasOffline };
}
