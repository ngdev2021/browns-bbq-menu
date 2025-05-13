/**
 * Menu Customization Data for Brown's Bar-B-Cue
 * 
 * This file contains the modifier groups and options for menu items,
 * as well as combo templates for the combo builder.
 */

// Modifier Groups for Menu Items
export const menuItemModifiers = {
  // Meat Selection Modifiers
  meatTemperature: {
    id: 'meat-temp',
    name: 'Meat Temperature',
    required: true,
    min_selections: 1,
    max_selections: 1,
    options: [
      { id: 'regular', name: 'Regular Cut', price: 0, default: true },
      { id: 'lean', name: 'Lean Cut', price: 0 },
      { id: 'extra-moist', name: 'Extra Moist', price: 1.50, description: 'Our juiciest cut with extra bark' }
    ]
  },
  
  // Sauce Options
  sauceOptions: {
    id: 'sauce-options',
    name: 'BBQ Sauce',
    required: false,
    min_selections: 0,
    max_selections: 2,
    options: [
      { id: 'classic', name: 'Classic BBQ', price: 0, default: true },
      { id: 'spicy', name: 'Spicy BBQ', price: 0 },
      { id: 'sweet', name: 'Sweet & Tangy', price: 0 },
      { id: 'carolina', name: 'Carolina Gold', price: 0.75, description: 'Mustard-based sauce' },
      { id: 'alabama', name: 'Alabama White', price: 0.75, description: 'Creamy, tangy sauce' },
      { id: 'no-sauce', name: 'No Sauce', price: 0 }
    ]
  },
  
  // Side Options for Plates
  sidePlateOptions: {
    id: 'side-options-plate',
    name: 'Side Options',
    required: true,
    min_selections: 2,
    max_selections: 2,
    options: [
      { id: 'beans', name: 'Baked Beans', price: 0, default: true },
      { id: 'potato-salad', name: 'Potato Salad', price: 0 },
      { id: 'coleslaw', name: 'Coleslaw', price: 0 },
      { id: 'mac-cheese', name: 'Mac & Cheese', price: 0 },
      { id: 'collard-greens', name: 'Collard Greens', price: 0 },
      { id: 'corn-bread', name: 'Corn Bread', price: 0 },
      { id: 'fries', name: 'French Fries', price: 0 },
      { id: 'loaded-potato', name: 'Loaded Baked Potato', price: 2.50, description: 'With cheese, bacon, and green onions' },
      { id: 'premium-mac', name: 'Premium Mac & Cheese', price: 1.50, description: 'With brisket burnt ends' }
    ]
  },
  
  // Side Options for Sandwiches
  sideSandwichOptions: {
    id: 'side-options-sandwich',
    name: 'Side Options',
    required: true,
    min_selections: 1,
    max_selections: 1,
    options: [
      { id: 'beans', name: 'Baked Beans', price: 0 },
      { id: 'potato-salad', name: 'Potato Salad', price: 0 },
      { id: 'coleslaw', name: 'Coleslaw', price: 0, default: true },
      { id: 'mac-cheese', name: 'Mac & Cheese', price: 0 },
      { id: 'fries', name: 'French Fries', price: 0 },
      { id: 'chips', name: 'Potato Chips', price: 0 },
      { id: 'premium-mac', name: 'Premium Mac & Cheese', price: 1.50, description: 'With brisket burnt ends' }
    ]
  },
  
  // Bread Options for Sandwiches
  breadOptions: {
    id: 'bread-options',
    name: 'Bread Options',
    required: true,
    min_selections: 1,
    max_selections: 1,
    options: [
      { id: 'texas-toast', name: 'Texas Toast', price: 0, default: true },
      { id: 'brioche', name: 'Brioche Bun', price: 0 },
      { id: 'jalapeno', name: 'Jalapeño Cheddar Bun', price: 1.00, description: 'Spicy kick with cheese' },
      { id: 'gluten-free', name: 'Gluten-Free Bun', price: 1.50 }
    ]
  },
  
  // Toppings for Sandwiches
  sandwichToppings: {
    id: 'sandwich-toppings',
    name: 'Sandwich Toppings',
    required: false,
    min_selections: 0,
    max_selections: 5,
    options: [
      { id: 'pickles', name: 'Pickles', price: 0, default: true },
      { id: 'onions', name: 'Red Onions', price: 0 },
      { id: 'jalapenos', name: 'Jalapeños', price: 0 },
      { id: 'tomato', name: 'Tomato', price: 0 },
      { id: 'lettuce', name: 'Lettuce', price: 0 },
      { id: 'cheese', name: 'Cheddar Cheese', price: 0.75 },
      { id: 'bacon', name: 'Bacon', price: 1.50 },
      { id: 'avocado', name: 'Avocado', price: 1.50 }
    ]
  },
  
  // Drink Options
  drinkOptions: {
    id: 'drink-options',
    name: 'Drink Options',
    required: false,
    min_selections: 0,
    max_selections: 1,
    options: [
      { id: 'water', name: 'Bottled Water', price: 1.99 },
      { id: 'soda', name: 'Fountain Soda', price: 2.49 },
      { id: 'sweet-tea', name: 'Sweet Tea', price: 2.49 },
      { id: 'unsweet-tea', name: 'Unsweet Tea', price: 2.49 },
      { id: 'lemonade', name: 'Lemonade', price: 2.99 }
    ]
  },
  
  // Dessert Add-on
  dessertOptions: {
    id: 'dessert-options',
    name: 'Add a Dessert',
    required: false,
    min_selections: 0,
    max_selections: 1,
    options: [
      { id: 'peach-cobbler', name: 'Peach Cobbler', price: 4.99 },
      { id: 'banana-pudding', name: 'Banana Pudding', price: 3.99 },
      { id: 'pecan-pie', name: 'Pecan Pie', price: 4.99 }
    ]
  }
};

// Mapping of which modifier groups apply to which menu items
export const menuItemModifierMapping: Record<string, string[]> = {
  // Plates
  'brisket': ['meat-temp', 'sauce-options', 'side-options-plate', 'drink-options', 'dessert-options'],
  'ribs': ['sauce-options', 'side-options-plate', 'drink-options', 'dessert-options'],
  'pulled-pork': ['sauce-options', 'side-options-plate', 'drink-options', 'dessert-options'],
  'smoked-chicken': ['meat-temp', 'sauce-options', 'side-options-plate', 'drink-options', 'dessert-options'],
  'smoked-turkey': ['sauce-options', 'side-options-plate', 'drink-options', 'dessert-options'],
  'sausage': ['sauce-options', 'side-options-plate', 'drink-options', 'dessert-options'],
  
  // Sandwiches
  'brisket-sandwich': ['meat-temp', 'bread-options', 'sandwich-toppings', 'sauce-options', 'side-options-sandwich', 'drink-options', 'dessert-options'],
  'pulled-pork-sandwich': ['bread-options', 'sandwich-toppings', 'sauce-options', 'side-options-sandwich', 'drink-options', 'dessert-options'],
  'turkey-sandwich': ['bread-options', 'sandwich-toppings', 'sauce-options', 'side-options-sandwich', 'drink-options', 'dessert-options'],
  'sausage-sandwich': ['bread-options', 'sandwich-toppings', 'sauce-options', 'side-options-sandwich', 'drink-options', 'dessert-options'],
  
  // Sides (as main items)
  'mac-cheese': ['dessert-options', 'drink-options'],
  'loaded-potato': ['dessert-options', 'drink-options'],
  'beans': ['dessert-options', 'drink-options'],
  'potato-salad': ['dessert-options', 'drink-options'],
  'coleslaw': ['dessert-options', 'drink-options'],
  'collard-greens': ['dessert-options', 'drink-options'],
  'fries': ['dessert-options', 'drink-options']
};

// Helper function to get modifiers for a menu item
export function getModifiersForMenuItem(itemId: string) {
  const modifierIds = menuItemModifierMapping[itemId] || [];
  return modifierIds.map(id => {
    const key = Object.keys(menuItemModifiers).find(key => 
      menuItemModifiers[key as keyof typeof menuItemModifiers].id === id
    );
    return key ? menuItemModifiers[key as keyof typeof menuItemModifiers] : null;
  }).filter(Boolean);
}

// Combo Templates for the Combo Builder
export const comboTemplates = [
  {
    id: 'bbq-feast',
    name: 'BBQ Feast Combo',
    description: 'Create your own BBQ feast with your choice of meats and sides',
    base_price: 24.99,
    image_url: '/images/menu-items/combo-feast.jpg',
    savings_message: 'Save up to $8 compared to ordering separately!',
    sections: [
      {
        id: 'primary-meat',
        name: 'Choose Your Primary Meat',
        description: 'Select your main BBQ meat',
        required: true,
        min_selections: 1,
        max_selections: 1,
        items: [
          {
            id: 'brisket-primary',
            name: 'Brisket (8oz)',
            description: 'Slow-smoked premium beef brisket',
            price: 0,
            image_url: '/images/menu-items/brisket.jpg',
            category: 'plates'
          },
          {
            id: 'ribs-primary',
            name: 'Pork Ribs (1/2 Rack)',
            description: 'Fall-off-the-bone tender pork ribs',
            price: 0,
            image_url: '/images/menu-items/ribs.jpg',
            category: 'plates'
          },
          {
            id: 'chicken-primary',
            name: 'Smoked Chicken (1/2)',
            description: 'Juicy smoked half chicken',
            price: 0,
            image_url: '/images/menu-items/smoked_chicken.jpg',
            category: 'plates'
          },
          {
            id: 'turkey-primary',
            name: 'Smoked Turkey (8oz)',
            description: 'Tender smoked turkey breast',
            price: 0,
            image_url: '/images/menu-items/smoked_turkey.jpg',
            category: 'plates'
          },
          {
            id: 'pork-primary',
            name: 'Pulled Pork (8oz)',
            description: 'Tender pulled pork shoulder',
            price: 0,
            image_url: '/images/menu-items/pulled_pork.jpg',
            category: 'plates'
          }
        ]
      },
      {
        id: 'secondary-meat',
        name: 'Add a Second Meat',
        description: 'Add another meat to your feast (optional)',
        required: false,
        min_selections: 0,
        max_selections: 1,
        items: [
          {
            id: 'brisket-secondary',
            name: 'Brisket (4oz)',
            description: 'Slow-smoked premium beef brisket',
            price: 6.99,
            image_url: '/images/menu-items/brisket.jpg',
            category: 'plates'
          },
          {
            id: 'ribs-secondary',
            name: 'Pork Ribs (1/4 Rack)',
            description: 'Fall-off-the-bone tender pork ribs',
            price: 5.99,
            image_url: '/images/menu-items/ribs.jpg',
            category: 'plates'
          },
          {
            id: 'sausage-secondary',
            name: 'Smoked Sausage Link',
            description: 'Juicy smoked sausage',
            price: 4.99,
            image_url: '/images/menu-items/sausage_links.jpg',
            category: 'plates'
          },
          {
            id: 'turkey-secondary',
            name: 'Smoked Turkey (4oz)',
            description: 'Tender smoked turkey breast',
            price: 5.99,
            image_url: '/images/menu-items/smoked_turkey.jpg',
            category: 'plates'
          },
          {
            id: 'pork-secondary',
            name: 'Pulled Pork (4oz)',
            description: 'Tender pulled pork shoulder',
            price: 4.99,
            image_url: '/images/menu-items/pulled_pork.jpg',
            category: 'plates'
          }
        ]
      },
      {
        id: 'included-sides',
        name: 'Included Sides',
        description: 'Select two sides included with your feast',
        required: true,
        min_selections: 2,
        max_selections: 2,
        items: [
          {
            id: 'beans-side',
            name: 'Baked Beans',
            description: 'Sweet and savory baked beans',
            price: 0,
            image_url: '/images/menu-items/baked_beans.jpg',
            category: 'sides'
          },
          {
            id: 'potato-salad-side',
            name: 'Potato Salad',
            description: 'Creamy homestyle potato salad',
            price: 0,
            image_url: '/images/menu-items/potato_salad.jpg',
            category: 'sides'
          },
          {
            id: 'coleslaw-side',
            name: 'Coleslaw',
            description: 'Crisp and tangy coleslaw',
            price: 0,
            image_url: '/images/menu-items/coleslaw.jpg',
            category: 'sides'
          },
          {
            id: 'mac-cheese-side',
            name: 'Mac & Cheese',
            description: 'Creamy mac and cheese',
            price: 0,
            image_url: '/images/menu-items/mac_cheese.jpg',
            category: 'sides'
          },
          {
            id: 'collard-greens-side',
            name: 'Collard Greens',
            description: 'Southern-style collard greens',
            price: 0,
            image_url: '/images/menu-items/collard_greens.jpg',
            category: 'sides'
          },
          {
            id: 'fries-side',
            name: 'French Fries',
            description: 'Crispy seasoned fries',
            price: 0,
            image_url: '/images/menu-items/fries.jpg',
            category: 'sides'
          }
        ]
      },
      {
        id: 'premium-sides',
        name: 'Premium Sides',
        description: 'Add a premium side for an additional charge',
        required: false,
        min_selections: 0,
        max_selections: 1,
        items: [
          {
            id: 'loaded-potato-premium',
            name: 'Loaded Baked Potato',
            description: 'Baked potato with cheese, bacon, and green onions',
            price: 3.99,
            image_url: '/images/menu-items/loaded_baked_potato.jpg',
            category: 'sides'
          },
          {
            id: 'premium-mac-premium',
            name: 'Premium Mac & Cheese',
            description: 'Mac & cheese with brisket burnt ends',
            price: 4.99,
            image_url: '/images/menu-items/premium_mac.jpg',
            category: 'sides'
          },
          {
            id: 'corn-premium',
            name: 'Elote Street Corn',
            description: 'Grilled corn with chili lime butter',
            price: 3.99,
            image_url: '/images/menu-items/elote_corn.jpg',
            category: 'sides'
          }
        ]
      },
      {
        id: 'drink-selection',
        name: 'Add a Drink',
        description: 'Complete your meal with a refreshing beverage',
        required: false,
        min_selections: 0,
        max_selections: 1,
        items: [
          {
            id: 'water-drink',
            name: 'Bottled Water',
            description: 'Refreshing bottled water',
            price: 1.99,
            image_url: '/images/menu-items/bottled_water.jpg',
            category: 'drinks'
          },
          {
            id: 'soda-drink',
            name: 'Fountain Soda',
            description: 'Your choice of fountain soda',
            price: 2.49,
            image_url: '/images/menu-items/fountain_soda.jpg',
            category: 'drinks'
          },
          {
            id: 'sweet-tea-drink',
            name: 'Sweet Tea',
            description: 'Southern sweet tea',
            price: 2.49,
            image_url: '/images/menu-items/sweet_tea.jpg',
            category: 'drinks'
          },
          {
            id: 'lemonade-drink',
            name: 'Lemonade',
            description: 'Fresh-squeezed lemonade',
            price: 2.99,
            image_url: '/images/menu-items/lemonade.jpg',
            category: 'drinks'
          }
        ]
      },
      {
        id: 'dessert-selection',
        name: 'Add a Dessert',
        description: 'Finish your meal with something sweet',
        required: false,
        min_selections: 0,
        max_selections: 1,
        items: [
          {
            id: 'peach-cobbler-dessert',
            name: 'Peach Cobbler',
            description: 'Warm peach cobbler with a flaky crust',
            price: 4.99,
            image_url: '/images/menu-items/peach_cobbler.jpg',
            category: 'desserts'
          },
          {
            id: 'banana-pudding-dessert',
            name: 'Banana Pudding',
            description: 'Creamy banana pudding with vanilla wafers',
            price: 3.99,
            image_url: '/images/menu-items/banana_pudding.jpg',
            category: 'desserts'
          },
          {
            id: 'pecan-pie-dessert',
            name: 'Pecan Pie',
            description: 'Classic southern pecan pie',
            price: 4.99,
            image_url: '/images/menu-items/pecan_pie.jpg',
            category: 'desserts'
          }
        ]
      }
    ]
  },
  {
    id: 'family-pack',
    name: 'Family Pack',
    description: 'Feed the whole family with this customizable feast',
    base_price: 59.99,
    image_url: '/images/menu-items/family-pack.jpg',
    savings_message: 'Save up to $15 compared to ordering separately!',
    sections: [
      {
        id: 'family-meats',
        name: 'Choose Your Meats',
        description: 'Select up to 3 meats for your family pack',
        required: true,
        min_selections: 1,
        max_selections: 3,
        items: [
          {
            id: 'brisket-family',
            name: 'Brisket (1 lb)',
            description: 'Slow-smoked premium beef brisket',
            price: 0,
            image_url: '/images/menu-items/brisket.jpg',
            category: 'plates'
          },
          {
            id: 'ribs-family',
            name: 'Pork Ribs (Full Rack)',
            description: 'Fall-off-the-bone tender pork ribs',
            price: 0,
            image_url: '/images/menu-items/ribs.jpg',
            category: 'plates'
          },
          {
            id: 'chicken-family',
            name: 'Smoked Chicken (Whole)',
            description: 'Juicy smoked whole chicken',
            price: 0,
            image_url: '/images/menu-items/smoked_chicken.jpg',
            category: 'plates'
          },
          {
            id: 'turkey-family',
            name: 'Smoked Turkey (1 lb)',
            description: 'Tender smoked turkey breast',
            price: 0,
            image_url: '/images/menu-items/smoked_turkey.jpg',
            category: 'plates'
          },
          {
            id: 'pork-family',
            name: 'Pulled Pork (1 lb)',
            description: 'Tender pulled pork shoulder',
            price: 0,
            image_url: '/images/menu-items/pulled_pork.jpg',
            category: 'plates'
          },
          {
            id: 'sausage-family',
            name: 'Smoked Sausage (1 lb)',
            description: 'Juicy smoked sausage links',
            price: 0,
            image_url: '/images/menu-items/sausage_links.jpg',
            category: 'plates'
          }
        ]
      },
      {
        id: 'family-sides',
        name: 'Choose Your Sides',
        description: 'Select 3 family-sized sides',
        required: true,
        min_selections: 3,
        max_selections: 3,
        items: [
          {
            id: 'beans-family',
            name: 'Baked Beans (Family Size)',
            description: 'Sweet and savory baked beans',
            price: 0,
            image_url: '/images/menu-items/baked_beans.jpg',
            category: 'sides'
          },
          {
            id: 'potato-salad-family',
            name: 'Potato Salad (Family Size)',
            description: 'Creamy homestyle potato salad',
            price: 0,
            image_url: '/images/menu-items/potato_salad.jpg',
            category: 'sides'
          },
          {
            id: 'coleslaw-family',
            name: 'Coleslaw (Family Size)',
            description: 'Crisp and tangy coleslaw',
            price: 0,
            image_url: '/images/menu-items/coleslaw.jpg',
            category: 'sides'
          },
          {
            id: 'mac-cheese-family',
            name: 'Mac & Cheese (Family Size)',
            description: 'Creamy mac and cheese',
            price: 0,
            image_url: '/images/menu-items/mac_cheese.jpg',
            category: 'sides'
          },
          {
            id: 'collard-greens-family',
            name: 'Collard Greens (Family Size)',
            description: 'Southern-style collard greens',
            price: 0,
            image_url: '/images/menu-items/collard_greens.jpg',
            category: 'sides'
          },
          {
            id: 'fries-family',
            name: 'French Fries (Family Size)',
            description: 'Crispy seasoned fries',
            price: 0,
            image_url: '/images/menu-items/fries.jpg',
            category: 'sides'
          },
          {
            id: 'corn-bread-family',
            name: 'Corn Bread (8 pieces)',
            description: 'Sweet, moist corn bread',
            price: 0,
            image_url: '/images/menu-items/corn_bread.jpg',
            category: 'sides'
          }
        ]
      },
      {
        id: 'family-premium',
        name: 'Add Premium Sides',
        description: 'Enhance your family pack with premium sides',
        required: false,
        min_selections: 0,
        max_selections: 2,
        items: [
          {
            id: 'loaded-potato-family',
            name: 'Loaded Baked Potatoes (4)',
            description: 'Baked potatoes with cheese, bacon, and green onions',
            price: 12.99,
            image_url: '/images/menu-items/loaded_baked_potato.jpg',
            category: 'sides'
          },
          {
            id: 'premium-mac-family',
            name: 'Premium Mac & Cheese (Family Size)',
            description: 'Mac & cheese with brisket burnt ends',
            price: 14.99,
            image_url: '/images/menu-items/premium_mac.jpg',
            category: 'sides'
          },
          {
            id: 'corn-family',
            name: 'Elote Street Corn (4)',
            description: 'Grilled corn with chili lime butter',
            price: 10.99,
            image_url: '/images/menu-items/elote_corn.jpg',
            category: 'sides'
          }
        ]
      },
      {
        id: 'family-drinks',
        name: 'Add Drinks',
        description: 'Add drinks for the family',
        required: false,
        min_selections: 0,
        max_selections: 1,
        items: [
          {
            id: 'tea-gallon',
            name: 'Sweet Tea (Gallon)',
            description: 'Gallon of southern sweet tea',
            price: 7.99,
            image_url: '/images/menu-items/tea_gallon.jpg',
            category: 'drinks'
          },
          {
            id: 'unsweet-tea-gallon',
            name: 'Unsweet Tea (Gallon)',
            description: 'Gallon of unsweet tea',
            price: 7.99,
            image_url: '/images/menu-items/tea_gallon.jpg',
            category: 'drinks'
          },
          {
            id: 'lemonade-gallon',
            name: 'Lemonade (Gallon)',
            description: 'Gallon of fresh-squeezed lemonade',
            price: 9.99,
            image_url: '/images/menu-items/lemonade_gallon.jpg',
            category: 'drinks'
          },
          {
            id: 'soda-pack',
            name: 'Soda (6-pack)',
            description: 'Six cans of assorted sodas',
            price: 6.99,
            image_url: '/images/menu-items/soda_pack.jpg',
            category: 'drinks'
          }
        ]
      },
      {
        id: 'family-dessert',
        name: 'Add Dessert',
        description: 'Complete your family feast with a dessert',
        required: false,
        min_selections: 0,
        max_selections: 1,
        items: [
          {
            id: 'peach-cobbler-family',
            name: 'Peach Cobbler (Family Size)',
            description: 'Large peach cobbler that serves 6-8',
            price: 14.99,
            image_url: '/images/menu-items/peach_cobbler.jpg',
            category: 'desserts'
          },
          {
            id: 'banana-pudding-family',
            name: 'Banana Pudding (Family Size)',
            description: 'Large banana pudding that serves 6-8',
            price: 12.99,
            image_url: '/images/menu-items/banana_pudding.jpg',
            category: 'desserts'
          },
          {
            id: 'pecan-pie-whole',
            name: 'Whole Pecan Pie',
            description: 'Entire pecan pie that serves 6-8',
            price: 16.99,
            image_url: '/images/menu-items/pecan_pie.jpg',
            category: 'desserts'
          }
        ]
      }
    ]
  }
];

export default {
  menuItemModifiers,
  menuItemModifierMapping,
  getModifiersForMenuItem,
  comboTemplates
};
