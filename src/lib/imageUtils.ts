/**
 * Utility functions for handling images in the application
 */

/**
 * Generates a cache-busting URL for an image path
 * @param imagePath - The original image path
 * @returns A cache-busting URL with the correct base URL
 */
export const getCacheBustedImageUrl = (imagePath: string): string => {
  // Extract the actual image path without any query parameters
  const cleanPath = imagePath.split('?')[0];
  
  // Get the base URL (only in browser environment)
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  
  // Add cache-busting timestamp
  const timestamp = new Date().getTime();
  
  // Handle image paths that might be absolute URLs already
  if (cleanPath.startsWith('http')) {
    return cleanPath;
  }
  
  // Ensure the path starts with a slash
  const normalizedPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
  
  return `${baseUrl}${normalizedPath}?t=${timestamp}`;
};

/**
 * Preloads an image to ensure it's in the browser cache
 * @param imagePath - The image path to preload
 * @returns A promise that resolves when the image is loaded
 */
export const preloadImage = (imagePath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = getCacheBustedImageUrl(imagePath);
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to preload image: ${imagePath}`));
  });
};

/**
 * Maps menu item image keys to actual file paths
 * This ensures we're using the correct image paths for the new images
 */
export const getMenuItemImagePath = (imageKey: string): string => {
  // Extract the base key from the path if it's a full path
  let baseKey = imageKey;
  
  // Handle full paths like '/images/menu-items/brisket-plate.jpg'
  if (baseKey.includes('/')) {
    const parts = baseKey.split('/');
    const filename = parts[parts.length - 1];
    baseKey = filename.replace(/\.jpg$|\.png$|\.webp$/, '');
  }
  
  // Map old image keys to new image files
  const imageMap: Record<string, string> = {
    // Direct key mappings
    'brisket-plate': '/images/menu-items/brisket.jpg',
    'brisket-sandwich': '/images/menu-items/brisket.jpg',
    'ribs-plate': '/images/menu-items/ribs.jpg',
    'ribs-sandwich': '/images/menu-items/ribs.jpg',
    'chicken-plate': '/images/menu-items/smoked_chicken.jpg',
    'chicken-sandwich': '/images/menu-items/smoked_chicken.jpg',
    'turkey-leg': '/images/menu-items/stuffed_turkey_legs.jpg',
    'baked-potato': '/images/menu-items/loaded_baked_potato.jpg',
    'pork-chops': '/images/menu-items/smoked_ porkchops.jpg',
    'links-plate': '/images/menu-items/sausage_links.jpg',
    'combo-plate': '/images/menu-items/brisket.jpg',
    
    // Full path mappings
    '/images/menu-items/brisket-plate.jpg': '/images/menu-items/brisket.jpg',
    '/images/menu-items/brisket-sandwich.jpg': '/images/menu-items/brisket.jpg',
    '/images/menu-items/ribs-plate.jpg': '/images/menu-items/ribs.jpg',
    '/images/menu-items/ribs-sandwich.jpg': '/images/menu-items/ribs.jpg',
    '/images/menu-items/chicken-plate.jpg': '/images/menu-items/smoked_chicken.jpg',
    '/images/menu-items/chicken-sandwich.jpg': '/images/menu-items/smoked_chicken.jpg',
    '/images/menu-items/turkey-leg.jpg': '/images/menu-items/stuffed_turkey_legs.jpg',
    '/images/menu-items/baked-potato.jpg': '/images/menu-items/loaded_baked_potato.jpg',
    '/images/menu-items/pork-chops.jpg': '/images/menu-items/smoked_ porkchops.jpg',
    '/images/menu-items/links-plate.jpg': '/images/menu-items/sausage_links.jpg',
    '/images/menu-items/combo-plate.jpg': '/images/menu-items/brisket.jpg',
  };
  
  // Try to find a direct match first
  if (imageMap[imageKey]) {
    return imageMap[imageKey];
  }
  
  // Try to find a match for the base key
  if (imageMap[baseKey]) {
    return imageMap[baseKey];
  }
  
  // If no match is found, check if it's one of the new image paths already
  const newImagePaths = Object.values(imageMap);
  if (newImagePaths.includes(imageKey)) {
    return imageKey;
  }
  
  // For any other case, use a default image
  console.warn(`No image mapping found for: ${imageKey}, using default`);
  return '/images/placeholder-food.jpg';
};
