// Script to force reload of images by clearing browser cache and directly replacing image sources
(function() {
  console.log('Force reload script running - direct DOM manipulation version');
  
  // Image mapping from old paths to new paths
  const imageMapping = {
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
  
  // Add timestamp to force cache busting
  const timestamp = new Date().getTime();
  
  // Preload all new images to ensure they're in cache
  Object.values(imageMapping).forEach(newPath => {
    const img = new Image();
    img.onload = () => console.log(`Successfully preloaded: ${newPath}`);
    img.onerror = () => console.error(`Failed to preload: ${newPath}`);
    img.src = `${newPath}?t=${timestamp}`;
  });
  
  // Function to replace image sources in the DOM
  function replaceImageSources() {
    console.log('Replacing image sources in DOM...');
    const images = document.querySelectorAll('img');
    let replacedCount = 0;
    
    images.forEach(img => {
      const src = img.getAttribute('src');
      if (!src) return;
      
      // Check if this is an old image path that needs to be replaced
      for (const [oldPath, newPath] of Object.entries(imageMapping)) {
        if (src.includes(oldPath)) {
          const newSrc = `${newPath}?t=${timestamp}`;
          img.setAttribute('src', newSrc);
          console.log(`Replaced image: ${src} -> ${newSrc}`);
          replacedCount++;
          break;
        }
      }
      
      // Add cache busting for other images
      if (!src.includes('?')) {
        img.setAttribute('src', `${src}?t=${timestamp}`);
      }
    });
    
    console.log(`Replaced ${replacedCount} image sources`);
    
    // If we didn't replace any images yet, try again later
    // (DOM might not be fully loaded)
    if (replacedCount === 0) {
      setTimeout(replaceImageSources, 500);
    }
  }
  
  // Initial call to replace image sources
  setTimeout(replaceImageSources, 500);
  
  // Set up a MutationObserver to catch dynamically added images
  const observer = new MutationObserver(mutations => {
    let hasNewImages = false;
    
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          if (node.nodeName === 'IMG') {
            hasNewImages = true;
          } else if (node.querySelectorAll) {
            const images = node.querySelectorAll('img');
            if (images.length > 0) {
              hasNewImages = true;
            }
          }
        });
      }
    });
    
    if (hasNewImages) {
      replaceImageSources();
    }
  });
  
  // Start observing the document
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();
