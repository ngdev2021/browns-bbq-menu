/**
 * Utility to clear image cache and force reload of images
 */

// Mapping from old image paths to new image paths
const imageMapping: Record<string, string> = {
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
  '/images/menu-items/combo-plate.jpg': '/images/menu-items/brisket.jpg'
};

// List of all new image paths that need to be refreshed
const imagesToRefresh = Object.values(imageMapping);

/**
 * Preloads images with cache busting to ensure fresh versions are loaded
 */
export const preloadFreshImages = (): Promise<void[]> => {
  // Only run in browser
  if (typeof window === 'undefined') {
    return Promise.resolve([]);
  }

  console.log('Preloading fresh images...');
  
  // Add timestamp to force cache busting
  const timestamp = Date.now();
  
  // Create promises for each image load
  const imagePromises = imagesToRefresh.map(imagePath => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      
      // Add event listeners
      img.onload = () => {
        console.log(`Successfully loaded: ${imagePath}`);
        resolve();
      };
      
      img.onerror = () => {
        console.error(`Failed to load: ${imagePath}`);
        reject(new Error(`Failed to load image: ${imagePath}`));
      };
      
      // Set source with cache busting
      const baseUrl = window.location.origin;
      img.src = `${baseUrl}${imagePath}?t=${timestamp}`;
    });
  });
  
  return Promise.all(imagePromises);
};

/**
 * Directly updates image elements on the page to use fresh versions
 */
export const refreshPageImages = (): void => {
  // Only run in browser
  if (typeof window === 'undefined') {
    return;
  }
  
  console.log('Refreshing page images...');
  
  // Find all image elements
  const imageElements = document.querySelectorAll('img');
  const timestamp = Date.now();
  let replacedCount = 0;
  
  // Update each image source with a cache-busting parameter
  imageElements.forEach(img => {
    const currentSrc = img.getAttribute('src');
    if (!currentSrc) return;
    
    // Check if this is an old image path that needs to be replaced
    for (const [oldPath, newPath] of Object.entries(imageMapping)) {
      if (currentSrc.includes(oldPath)) {
        const newSrc = `${newPath}?t=${timestamp}`;
        img.setAttribute('src', newSrc);
        console.log(`Replaced image: ${currentSrc} -> ${newSrc}`);
        replacedCount++;
        return; // Skip the rest of the loop for this image
      }
    }
    
    // If not replaced but doesn't have cache busting, add it
    if (!currentSrc.includes('?t=')) {
      img.setAttribute('src', `${currentSrc}?t=${timestamp}`);
      console.log(`Added cache busting: ${currentSrc} -> ${img.getAttribute('src')}`);
    }
  });
  
  console.log(`Replaced ${replacedCount} image sources`);
};

/**
 * Set up a MutationObserver to catch dynamically added images
 */
export const setupImageObserver = (): void => {
  // Only run in browser
  if (typeof window === 'undefined') {
    return;
  }
  
  console.log('Setting up image observer...');
  
  const observer = new MutationObserver(mutations => {
    let hasNewImages = false;
    
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          if (node instanceof HTMLImageElement) {
            hasNewImages = true;
          } else if (node instanceof Element && node.querySelectorAll) {
            const images = node.querySelectorAll('img');
            if (images.length > 0) {
              hasNewImages = true;
            }
          }
        });
      }
    });
    
    if (hasNewImages) {
      refreshPageImages();
    }
  });
  
  // Start observing the document body when it's available
  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  } else {
    window.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  }
};
