import { SAMPLE_MENU_ITEMS } from '../data/sampleData';

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

// Get menu items from local storage or use sample data
export const getMenuItems = (): MenuItem[] => {
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

// Save menu items to local storage
export const saveMenuItems = (items: MenuItem[]): void => {
  try {
    localStorage.setItem('bbq_menu_items', JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save menu items to storage:', error);
  }
};

// Get business settings from local storage or use defaults
export const getBusinessSettings = (): BusinessSettings => {
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

// Save business settings to local storage
export const saveBusinessSettings = (settings: BusinessSettings): void => {
  try {
    localStorage.setItem('bbq_business_settings', JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save business settings to storage:', error);
  }
};

// Get digital menu settings from local storage or use defaults
export const getDigitalMenuSettings = (): DigitalMenuSettings => {
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

// Save digital menu settings to local storage
export const saveDigitalMenuSettings = (settings: DigitalMenuSettings): void => {
  try {
    localStorage.setItem('bbq_digital_menu_settings', JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save digital menu settings to storage:', error);
  }
};

// Add a new menu item
export const addMenuItem = (item: MenuItem): MenuItem[] => {
  const items = getMenuItems();
  const newItems = [...items, item];
  saveMenuItems(newItems);
  return newItems;
};

// Update an existing menu item
export const updateMenuItem = (item: MenuItem): MenuItem[] => {
  const items = getMenuItems();
  const newItems = items.map(i => i.id === item.id ? item : i);
  saveMenuItems(newItems);
  return newItems;
};

// Delete a menu item
export const deleteMenuItem = (id: string): MenuItem[] => {
  const items = getMenuItems();
  const newItems = items.filter(i => i.id !== id);
  saveMenuItems(newItems);
  return newItems;
};

// Get menu items by category
export const getMenuItemsByCategory = (category: string): MenuItem[] => {
  const items = getMenuItems();
  return category === 'all' ? items : items.filter(item => item.category === category);
};

// Get featured menu items
export const getFeaturedMenuItems = (): MenuItem[] => {
  const items = getMenuItems();
  return items.filter(item => item.featured);
};

// Search menu items
export const searchMenuItems = (query: string): MenuItem[] => {
  const items = getMenuItems();
  const lowerQuery = query.toLowerCase();
  return items.filter(item => 
    item.name.toLowerCase().includes(lowerQuery) || 
    item.description.toLowerCase().includes(lowerQuery) ||
    item.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};
