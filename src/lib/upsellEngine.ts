/**
 * Smart Upselling Engine for Brown's Bar-B-Cue
 * 
 * This system analyzes cart contents and user behavior to make intelligent
 * recommendations for add-ons, upgrades, and combos to increase average order value.
 */

import { MenuItem } from './menuService';

// Types for upselling
export interface UpsellRule {
  id: string;
  name: string;
  description: string;
  type: 'add-on' | 'upgrade' | 'combo' | 'bundle';
  priority: number; // Higher number = higher priority
  condition: (cart: CartItem[], menuItems: MenuItem[]) => boolean;
  recommendation: (cart: CartItem[], menuItems: MenuItem[]) => UpsellRecommendation;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
  category?: string;
  options?: any[];
  isCombo?: boolean;
}

export interface UpsellRecommendation {
  id: string;
  title: string;
  description: string;
  type: 'add-on' | 'upgrade' | 'combo' | 'bundle';
  savings?: number;
  items: MenuItem[];
  action?: 'add' | 'replace' | 'build';
  targetItemId?: string; // For upgrades, which item to upgrade
}

// Predefined upsell rules
const upsellRules: UpsellRule[] = [
  // Rule: Suggest drinks if cart has food but no drinks
  {
    id: 'suggest-drinks',
    name: 'Add a Drink',
    description: 'Suggest drinks when customer has food but no drinks',
    type: 'add-on',
    priority: 80,
    condition: (cart, menuItems) => {
      const hasFood = cart.some(item => 
        !['drinks', 'beverages'].includes(item.category?.toLowerCase() || '')
      );
      const hasDrink = cart.some(item => 
        ['drinks', 'beverages'].includes(item.category?.toLowerCase() || '')
      );
      return hasFood && !hasDrink;
    },
    recommendation: (cart, menuItems) => {
      // Find popular drinks to recommend
      const drinks = menuItems.filter(item => 
        ['drinks', 'beverages'].includes(item.category?.toLowerCase() || '')
      ).slice(0, 3);
      
      return {
        id: 'add-drinks',
        title: 'Add a Refreshing Drink',
        description: 'Complete your meal with a refreshing beverage',
        type: 'add-on',
        items: drinks,
        action: 'add'
      };
    }
  },
  
  // Rule: Suggest sides if cart has main dishes but few or no sides
  {
    id: 'suggest-sides',
    name: 'Add Sides',
    description: 'Suggest sides when customer has main dishes but few sides',
    type: 'add-on',
    priority: 90,
    condition: (cart, menuItems) => {
      const hasMainDish = cart.some(item => 
        ['plates', 'sandwiches', 'mains'].includes(item.category?.toLowerCase() || '')
      );
      const sideCount = cart.filter(item => 
        ['sides'].includes(item.category?.toLowerCase() || '')
      ).reduce((total, item) => total + item.quantity, 0);
      
      return hasMainDish && sideCount < 2;
    },
    recommendation: (cart, menuItems) => {
      // Find popular sides to recommend
      const sides = menuItems.filter(item => 
        ['sides'].includes(item.category?.toLowerCase() || '')
      ).slice(0, 3);
      
      return {
        id: 'add-sides',
        title: 'Complete Your Meal',
        description: 'Add delicious sides to complete your BBQ experience',
        type: 'add-on',
        items: sides,
        action: 'add'
      };
    }
  },
  
  // Rule: Suggest upgrading to a combo if ordering items that would be cheaper as a combo
  {
    id: 'upgrade-to-combo',
    name: 'Upgrade to Combo',
    description: 'Suggest upgrading to a combo when it would save money',
    type: 'upgrade',
    priority: 100,
    condition: (cart, menuItems) => {
      // Check if cart has items that could form a combo
      const hasMainDish = cart.some(item => 
        ['plates', 'sandwiches', 'mains'].includes(item.category?.toLowerCase() || '')
      );
      const hasSide = cart.some(item => 
        ['sides'].includes(item.category?.toLowerCase() || '')
      );
      
      // Don't suggest if they already have a combo
      const hasCombo = cart.some(item => item.isCombo);
      
      return hasMainDish && hasSide && !hasCombo;
    },
    recommendation: (cart, menuItems) => {
      // Find combo items
      const combos = menuItems.filter(item => 
        ['combos'].includes(item.category?.toLowerCase() || '')
      ).slice(0, 2);
      
      // Calculate potential savings
      const currentTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
      const comboPrice = combos[0]?.price || 0;
      const potentialSavings = currentTotal - comboPrice;
      
      return {
        id: 'upgrade-combo',
        title: 'Save with a Combo Meal',
        description: `Save $${potentialSavings > 0 ? potentialSavings.toFixed(2) : '2.00'} by upgrading to a combo`,
        type: 'upgrade',
        savings: potentialSavings > 0 ? potentialSavings : 2.00,
        items: combos,
        action: 'replace'
      };
    }
  },
  
  // Rule: Suggest dessert if cart has main meal but no dessert
  {
    id: 'suggest-dessert',
    name: 'Add Dessert',
    description: 'Suggest dessert to complete the meal',
    type: 'add-on',
    priority: 70,
    condition: (cart, menuItems) => {
      const hasFood = cart.some(item => 
        !['drinks', 'beverages', 'desserts'].includes(item.category?.toLowerCase() || '')
      );
      const hasDessert = cart.some(item => 
        ['desserts'].includes(item.category?.toLowerCase() || '')
      );
      return hasFood && !hasDessert;
    },
    recommendation: (cart, menuItems) => {
      // Find desserts to recommend
      const desserts = menuItems.filter(item => 
        ['desserts'].includes(item.category?.toLowerCase() || '')
      ).slice(0, 2);
      
      return {
        id: 'add-dessert',
        title: 'Finish with Something Sweet',
        description: 'Complete your meal with a delicious dessert',
        type: 'add-on',
        items: desserts,
        action: 'add'
      };
    }
  },
  
  // Rule: Suggest family bundle for large orders
  {
    id: 'suggest-family-bundle',
    name: 'Family Bundle',
    description: 'Suggest family bundle for large orders',
    type: 'bundle',
    priority: 95,
    condition: (cart, menuItems) => {
      // Check if the order is large enough to suggest a family bundle
      const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
      const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      return totalItems >= 3 && totalAmount >= 30;
    },
    recommendation: (cart, menuItems) => {
      // Find family bundles
      const familyBundles = menuItems.filter(item => 
        item.name.toLowerCase().includes('family') || 
        item.name.toLowerCase().includes('bundle') || 
        item.name.toLowerCase().includes('feast')
      );
      
      // If we have family bundles, recommend one
      if (familyBundles.length > 0) {
        return {
          id: 'family-bundle',
          title: 'Family Feast Bundle',
          description: 'Feed the whole family and save with our Family Feast Bundle',
          type: 'bundle' as const,
          savings: 12.99,
          items: familyBundles.slice(0, 1) as MenuItem[],
          action: 'build' as const
        };
      }
      
      // Otherwise, create a custom bundle with popular items
      // Ensure all items are of type MenuItem
      const popularItems = menuItems.filter(item => item.featured).slice(0, 3);
      
      return {
        id: 'custom-family-bundle',
        title: 'Create a Family Bundle',
        description: 'Build your own family feast and save $10',
        type: 'bundle' as const,
        savings: 10.00,
        items: popularItems as MenuItem[],
        action: 'build' as const
      };
    }
  },
  
  // Rule: Suggest premium meat upgrade
  {
    id: 'premium-meat-upgrade',
    name: 'Premium Meat Upgrade',
    description: 'Suggest upgrading to premium meat options',
    type: 'upgrade',
    priority: 85,
    condition: (cart, menuItems) => {
      // Check if cart has standard meat items that could be upgraded
      return cart.some(item => 
        (item.category?.toLowerCase() === 'plates' || item.category?.toLowerCase() === 'sandwiches') &&
        !item.name.toLowerCase().includes('premium') &&
        !item.name.toLowerCase().includes('brisket')
      );
    },
    recommendation: (cart, menuItems) => {
      // Find premium meat options
      const premiumOptions = menuItems.filter(item => 
        (item.category?.toLowerCase() === 'plates' || item.category?.toLowerCase() === 'sandwiches') &&
        (item.name.toLowerCase().includes('premium') || item.name.toLowerCase().includes('brisket'))
      ).slice(0, 2);
      
      // Find the item to potentially upgrade
      const targetItem = cart.find(item => 
        (item.category?.toLowerCase() === 'plates' || item.category?.toLowerCase() === 'sandwiches') &&
        !item.name.toLowerCase().includes('premium') &&
        !item.name.toLowerCase().includes('brisket')
      );
      
      return {
        id: 'premium-upgrade',
        title: 'Upgrade to Premium BBQ',
        description: 'Elevate your meal with our premium slow-smoked meats',
        type: 'upgrade',
        items: premiumOptions,
        action: 'replace',
        targetItemId: targetItem?.id
      };
    }
  }
];

/**
 * Generates personalized upsell recommendations based on cart contents
 */
export function getUpsellRecommendations(
  cart: CartItem[],
  menuItems: MenuItem[],
  maxRecommendations: number = 2
): UpsellRecommendation[] {
  // Skip if cart is empty
  if (cart.length === 0) return [];
  
  // Filter rules that match the current cart
  const matchingRules = upsellRules.filter(rule => rule.condition(cart, menuItems));
  
  // Sort by priority (highest first)
  const sortedRules = matchingRules.sort((a, b) => b.priority - a.priority);
  
  // Generate recommendations from the top rules
  const recommendations = sortedRules
    .slice(0, maxRecommendations)
    .map(rule => rule.recommendation(cart, menuItems));
  
  return recommendations;
}

/**
 * Gets related items for a specific menu item (for item detail pages)
 */
export function getRelatedItems(
  item: MenuItem,
  menuItems: MenuItem[],
  maxItems: number = 3
): MenuItem[] {
  // Strategy 1: Items from the same category
  const sameCategory = menuItems.filter(menuItem => 
    menuItem.id !== item.id && 
    menuItem.category === item.category
  );
  
  // Strategy 2: Complementary items (sides for mains, drinks for any food)
  const complementaryCategories = getComplementaryCategories(item.category);
  const complementary = menuItems.filter(menuItem => 
    complementaryCategories.includes(menuItem.category || '')
  );
  
  // Combine and deduplicate
  const combined = [...sameCategory, ...complementary]
    .filter((menuItem, index, self) => 
      self.findIndex(i => i.id === menuItem.id) === index
    )
    .slice(0, maxItems);
  
  return combined;
}

/**
 * Determines which categories complement the given category
 */
function getComplementaryCategories(category?: string): string[] {
  if (!category) return [];
  
  switch(category.toLowerCase()) {
    case 'plates':
    case 'sandwiches':
    case 'mains':
      return ['sides', 'drinks', 'beverages'];
    case 'sides':
      return ['plates', 'sandwiches', 'mains'];
    case 'drinks':
    case 'beverages':
      return ['sides', 'desserts'];
    case 'desserts':
      return ['drinks', 'beverages'];
    default:
      return ['sides', 'drinks'];
  }
}

/**
 * Generates combo suggestions based on cart contents
 */
export function getComboSuggestions(
  cart: CartItem[],
  menuItems: MenuItem[]
): MenuItem[] {
  // Skip if cart is empty or already has combos
  if (cart.length === 0 || cart.some(item => item.isCombo)) return [];
  
  // Find combo items
  const combos = menuItems.filter(item => 
    ['combos'].includes(item.category?.toLowerCase() || '')
  );
  
  // If no specific combos, return empty array
  if (combos.length === 0) return [];
  
  // Calculate current cart value
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // Find combos that would save money
  const savingCombos = combos.filter(combo => combo.price < cartTotal);
  
  return savingCombos.length > 0 ? savingCombos.slice(0, 2) : combos.slice(0, 2);
}

/**
 * Tracks user behavior to improve recommendations
 */
export function trackUserBehavior(
  action: 'view' | 'add' | 'remove' | 'purchase',
  itemId: string,
  category?: string
): void {
  // In a real implementation, this would send data to an analytics service
  // For now, we'll just log to console
  console.log(`User ${action}: ${itemId} (${category || 'unknown category'})`);
}

export default {
  getUpsellRecommendations,
  getRelatedItems,
  getComboSuggestions,
  trackUserBehavior
};
