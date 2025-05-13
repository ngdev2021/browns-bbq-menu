import { useState, useEffect } from 'react';
import { getMenuItems, saveMenuItems } from '../lib/indexedDB';
import { LOCAL_IMAGES } from '../data/localImages';
// Using inline sample data to avoid dependency issues
const SAMPLE_MENU_ITEMS = [
  {
    id: '1',
    name: 'Buffalo Wings',
    description: 'Crispy chicken wings tossed in our signature buffalo sauce.',
    price: 12.99,
    category: 'appetizers',
    image_url: '/images/placeholder-food.jpg', // Use placeholder for non-BBQ items
    tags: ['spicy', 'gluten-free'],
    stock: 20,
    featured: true
  },
  {
    id: '2',
    name: 'Classic Cheeseburger',
    description: 'Juicy beef patty with melted cheddar and special sauce.',
    price: 14.99,
    category: 'burgers',
    image_url: '/images/placeholder-food.jpg', // Use placeholder for non-BBQ items
    tags: [],
    stock: 15,
    featured: true
  },
  {
    id: '3',
    name: 'Veggie Tacos',
    description: 'Three corn tortillas with grilled vegetables and avocado.',
    price: 11.99,
    category: 'tacos',
    image_url: '/images/placeholder-food.jpg', // Use placeholder for non-BBQ items
    tags: ['vegetarian', 'gluten-free'],
    stock: 8,
    featured: false
  }
];

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  tags: string[];
  stock: number;
  featured: boolean;
}

export function useOfflineCache() {
  // Use sample data directly instead of fetching from Supabase
  const [menuItems, setMenuItems] = useState<MenuItem[]>(SAMPLE_MENU_ITEMS);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [offlineMenuItems, setOfflineMenuItems] = useState<MenuItem[]>([]);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      syncWithServer();
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load data from IndexedDB on mount
  useEffect(() => {
    const loadFromIndexedDB = async () => {
      try {
        const cachedItems = await getMenuItems();
        if (cachedItems && cachedItems.length > 0) {
          setOfflineMenuItems(cachedItems);
        }
      } catch (err) {
        console.error('Error loading from IndexedDB:', err);
      }
    };

    loadFromIndexedDB();
  }, []);

  // Save to IndexedDB when online data changes
  useEffect(() => {
    if (menuItems.length > 0 && !loading && !error) {
      saveMenuItems(menuItems).catch(err => {
        console.error('Error saving to IndexedDB:', err);
      });
    }
  }, [menuItems, loading, error]);

  // Sync with server when coming back online
  const syncWithServer = async () => {
    if (navigator.onLine) {
      setIsSyncing(true);
      try {
        // In a real app, we would fetch from the server
        // For now, just simulate a delay and use sample data
        await new Promise(resolve => setTimeout(resolve, 500));
        setMenuItems(SAMPLE_MENU_ITEMS);
      } catch (err) {
        console.error('Error syncing with server:', err);
      } finally {
        setIsSyncing(false);
      }
    }
  };

  // Return the appropriate data source based on online status
  const activeMenuItems = isOffline ? offlineMenuItems : menuItems;

  return {
    menuItems: activeMenuItems,
    loading: loading || isSyncing,
    error,
    isOffline,
    isSyncing
  };
}