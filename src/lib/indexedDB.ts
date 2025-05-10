// Mock IndexedDB implementation for development

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

// Use localStorage as a simple alternative to IndexedDB for development
const STORAGE_KEY = 'food-truck-menu-items';

// Mock implementation that uses localStorage instead of IndexedDB
export const saveMenuItems = async (items: MenuItem[]): Promise<void> => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
    return Promise.resolve();
  } catch (error) {
    console.error('Error saving menu items to storage:', error);
    return Promise.resolve(); // Resolve anyway to prevent app from crashing
  }
};

export const getMenuItems = async (): Promise<MenuItem[]> => {
  try {
    if (typeof window !== 'undefined') {
      const storedItems = localStorage.getItem(STORAGE_KEY);
      if (storedItems) {
        return Promise.resolve(JSON.parse(storedItems));
      }
    }
    return Promise.resolve([]);
  } catch (error) {
    console.error('Error getting menu items from storage:', error);
    return Promise.resolve([]); // Return empty array to prevent app from crashing
  }
};