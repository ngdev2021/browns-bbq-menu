import { SAMPLE_MENU_ITEMS } from '../data/sampleData';
import axios from 'axios';

// Define types for our menu items
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  tags: string[];
  stock: number;
  featured: boolean;
  ingredients: string[];
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  reviews?: Array<{
    id: string;
    itemId: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
  }>;
  sizes?: Array<{
    size: string;
    price: number;
  }>;
}

// Define types for business settings
export interface BusinessSettings {
  name: string;
  phone: string;
  website: string;
  cashApp: string;
  taxRate: number;
  enableOnlineOrdering: boolean;
  requirePhoneNumber: boolean;
}

// Define types for digital menu settings
export interface DigitalMenuSettings {
  defaultView: 'menu' | 'specials' | 'combos';
  rotationInterval: number;
  autoFullscreen: boolean;
  featuredItemIds: string[];
}

// Default settings
const DEFAULT_BUSINESS_SETTINGS: BusinessSettings = {
  name: "Brown's Bar-B-Cue",
  phone: "(682) 352-8545",
  website: "brownsbarbcue.com",
  cashApp: "$brownroscoe",
  taxRate: 8.25,
  enableOnlineOrdering: true,
  requirePhoneNumber: true
};

const DEFAULT_DIGITAL_MENU_SETTINGS: DigitalMenuSettings = {
  defaultView: 'menu',
  rotationInterval: 8,
  autoFullscreen: false,
  featuredItemIds: SAMPLE_MENU_ITEMS.filter(item => item.featured).map(item => item.id)
};

// Get menu items from server, local storage, or use sample data
export const getMenuItems = async (): Promise<MenuItem[]> => {
  try {
    // Try to get data from server first
    try {
      // Use window.location.origin to ensure we're using the correct port
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const response = await axios.get(`${baseUrl}/api/menu?type=menu`);
      if (response.data.success) {
        // Save to local storage as a backup
        localStorage.setItem('bbq_menu_items', JSON.stringify(response.data.data));
        return response.data.data;
      }
    } catch (serverError) {
      console.log('Could not fetch from server, falling back to local storage');
    }

    // If server fails, try local storage
    const storedItems = localStorage.getItem('bbq_menu_items');
    if (storedItems) {
      return JSON.parse(storedItems);
    }
  } catch (error) {
    console.error('Failed to load menu items:', error);
  }
  return SAMPLE_MENU_ITEMS;
};

// Synchronous version for immediate UI rendering
export const getMenuItemsSync = (): MenuItem[] => {
  try {
    const storedItems = localStorage.getItem('bbq_menu_items');
    if (storedItems) {
      return JSON.parse(storedItems);
    }
  } catch (error) {
    console.error('Failed to load menu items from storage:', error);
  }
  return SAMPLE_MENU_ITEMS;
};

// Save menu items to server and local storage
export const saveMenuItems = async (items: MenuItem[]): Promise<boolean> => {
  try {
    // Save to local storage first as a backup
    localStorage.setItem('bbq_menu_items', JSON.stringify(items));
    
    // Then save to server
    try {
      // Use window.location.origin to ensure we're using the correct port
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const response = await axios.post(`${baseUrl}/api/menu`, {
        type: 'menu',
        data: items
      });
      return response.data.success;
    } catch (serverError) {
      console.error('Failed to save menu items to server:', serverError);
      // Still return true if we saved to local storage
      return true;
    }
  } catch (error) {
    console.error('Failed to save menu items:', error);
    return false;
  }
};

// Get business settings from server, local storage, or use defaults
export const getBusinessSettings = async (): Promise<BusinessSettings> => {
  try {
    // Try to get data from server first
    try {
      // Use window.location.origin to ensure we're using the correct port
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const response = await axios.get(`${baseUrl}/api/menu?type=business`);
      if (response.data.success) {
        // Save to local storage as a backup
        localStorage.setItem('bbq_business_settings', JSON.stringify(response.data.data));
        return response.data.data;
      }
    } catch (serverError) {
      console.log('Could not fetch business settings from server, falling back to local storage');
    }

    // If server fails, try local storage
    const storedSettings = localStorage.getItem('bbq_business_settings');
    if (storedSettings) {
      return JSON.parse(storedSettings);
    }
  } catch (error) {
    console.error('Failed to load business settings:', error);
  }
  return DEFAULT_BUSINESS_SETTINGS;
};

// Synchronous version for immediate UI rendering
export const getBusinessSettingsSync = (): BusinessSettings => {
  try {
    const storedSettings = localStorage.getItem('bbq_business_settings');
    if (storedSettings) {
      return JSON.parse(storedSettings);
    }
  } catch (error) {
    console.error('Failed to load business settings from storage:', error);
  }
  return DEFAULT_BUSINESS_SETTINGS;
};

// Save business settings to server and local storage
export const saveBusinessSettings = async (settings: BusinessSettings): Promise<boolean> => {
  try {
    // Save to local storage first as a backup
    localStorage.setItem('bbq_business_settings', JSON.stringify(settings));
    
    // Then save to server
    try {
      // Use window.location.origin to ensure we're using the correct port
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const response = await axios.post(`${baseUrl}/api/menu`, {
        type: 'business',
        data: settings
      });
      return response.data.success;
    } catch (serverError) {
      console.error('Failed to save business settings to server:', serverError);
      // Still return true if we saved to local storage
      return true;
    }
  } catch (error) {
    console.error('Failed to save business settings:', error);
    return false;
  }
};

// Get digital menu settings from server, local storage, or use defaults
export const getDigitalMenuSettings = async (): Promise<DigitalMenuSettings> => {
  try {
    // Try to get data from server first
    try {
      // Use window.location.origin to ensure we're using the correct port
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const response = await axios.get(`${baseUrl}/api/menu?type=digital`);
      if (response.data.success) {
        // Save to local storage as a backup
        localStorage.setItem('bbq_digital_menu_settings', JSON.stringify(response.data.data));
        return response.data.data;
      }
    } catch (serverError) {
      console.log('Could not fetch digital menu settings from server, falling back to local storage');
    }

    // If server fails, try local storage
    const storedSettings = localStorage.getItem('bbq_digital_menu_settings');
    if (storedSettings) {
      return JSON.parse(storedSettings);
    }
  } catch (error) {
    console.error('Failed to load digital menu settings:', error);
  }
  return DEFAULT_DIGITAL_MENU_SETTINGS;
};

// Synchronous version for immediate UI rendering
export const getDigitalMenuSettingsSync = (): DigitalMenuSettings => {
  try {
    const storedSettings = localStorage.getItem('bbq_digital_menu_settings');
    if (storedSettings) {
      return JSON.parse(storedSettings);
    }
  } catch (error) {
    console.error('Failed to load digital menu settings from storage:', error);
  }
  return DEFAULT_DIGITAL_MENU_SETTINGS;
};

// Save digital menu settings to server and local storage
export const saveDigitalMenuSettings = async (settings: DigitalMenuSettings): Promise<boolean> => {
  try {
    // Save to local storage first as a backup
    localStorage.setItem('bbq_digital_menu_settings', JSON.stringify(settings));
    
    // Then save to server
    try {
      // Use window.location.origin to ensure we're using the correct port
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const response = await axios.post(`${baseUrl}/api/menu`, {
        type: 'digital',
        data: settings
      });
      return response.data.success;
    } catch (serverError) {
      console.error('Failed to save digital menu settings to server:', serverError);
      // Still return true if we saved to local storage
      return true;
    }
  } catch (error) {
    console.error('Failed to save digital menu settings:', error);
    return false;
  }
};

// Add a new menu item
export const addMenuItem = async (item: MenuItem): Promise<MenuItem[]> => {
  const items = await getMenuItems();
  const newItems = [...items, item];
  await saveMenuItems(newItems);
  return newItems;
};

// Update an existing menu item
export const updateMenuItem = async (item: MenuItem): Promise<MenuItem[]> => {
  const items = await getMenuItems();
  const newItems = items.map(i => i.id === item.id ? item : i);
  await saveMenuItems(newItems);
  return newItems;
};

// Delete a menu item
export const deleteMenuItem = async (id: string): Promise<MenuItem[]> => {
  const items = await getMenuItems();
  const newItems = items.filter(i => i.id !== id);
  await saveMenuItems(newItems);
  return newItems;
};

// Get menu items by category
export const getMenuItemsByCategory = async (category: string): Promise<MenuItem[]> => {
  const items = await getMenuItems();
  return category === 'all' ? items : items.filter(item => item.category === category);
};

// Synchronous version for immediate UI rendering
export const getMenuItemsByCategorySync = (category: string): MenuItem[] => {
  const items = getMenuItemsSync();
  return category === 'all' ? items : items.filter(item => item.category === category);
};

// Get featured menu items
export const getFeaturedMenuItems = async (): Promise<MenuItem[]> => {
  const items = await getMenuItems();
  return items.filter(item => item.featured);
};

// Synchronous version for immediate UI rendering
export const getFeaturedMenuItemsSync = (): MenuItem[] => {
  const items = getMenuItemsSync();
  return items.filter(item => item.featured);
};

// Search menu items
export const searchMenuItems = async (query: string): Promise<MenuItem[]> => {
  const items = await getMenuItems();
  const lowerQuery = query.toLowerCase();
  return items.filter(item => 
    item.name.toLowerCase().includes(lowerQuery) || 
    item.description.toLowerCase().includes(lowerQuery) ||
    item.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

// Synchronous version for immediate UI rendering
export const searchMenuItemsSync = (query: string): MenuItem[] => {
  const items = getMenuItemsSync();
  const lowerQuery = query.toLowerCase();
  return items.filter(item => 
    item.name.toLowerCase().includes(lowerQuery) || 
    item.description.toLowerCase().includes(lowerQuery) ||
    item.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};
