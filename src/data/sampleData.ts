// Sample menu items data for development
import { LOCAL_IMAGES } from './localImages';

// Brown's Bar-B-Cue Menu Items
export const SAMPLE_MENU_ITEMS = [
  {
    id: '1',
    name: 'Brisket Plate',
    description: 'Tender smoked brisket served with your choice of two sides.',
    price: 22.00,
    category: 'plates',
    image_url: LOCAL_IMAGES['brisket-plate'],
    tags: ['bbq', 'meat'],
    stock: 20,
    featured: true,
    ingredients: ['Beef brisket', 'BBQ sauce', 'Spices'],
    nutritionalInfo: {
      calories: 650,
      protein: 45,
      carbs: 25,
      fat: 38
    },
    reviews: [
      {
        id: '101',
        itemId: '1',
        userName: 'BBQLover',
        rating: 5,
        comment: 'Best brisket in town! Perfectly smoked and tender.',
        date: '2025-04-15T14:22:00Z'
      },
      {
        id: '102',
        itemId: '1',
        userName: 'MeatFan',
        rating: 4,
        comment: 'Really good brisket, melts in your mouth. Great sides too!',
        date: '2025-04-28T18:15:00Z'
      }
    ]
  },
  {
    id: '2',
    name: 'Brisket Sandwich',
    description: 'Tender smoked brisket served on a fresh bun with pickles and onions.',
    price: 12.00,
    category: 'sandwiches',
    image_url: LOCAL_IMAGES['brisket-sandwich'],
    tags: ['bbq', 'meat'],
    stock: 25,
    featured: true,
    ingredients: ['Beef brisket', 'BBQ sauce', 'Bun', 'Pickles', 'Onions'],
    nutritionalInfo: {
      calories: 550,
      protein: 35,
      carbs: 45,
      fat: 25
    },
    reviews: []
  },
  {
    id: '3',
    name: 'Ribs Plate',
    description: 'Slow-smoked pork ribs with our signature dry rub, served with two sides.',
    price: 22.00,
    category: 'plates',
    image_url: LOCAL_IMAGES['ribs-plate'],
    tags: ['bbq', 'meat'],
    stock: 15,
    featured: true,
    ingredients: ['Pork ribs', 'Dry rub', 'BBQ sauce'],
    nutritionalInfo: {
      calories: 750,
      protein: 48,
      carbs: 25,
      fat: 45
    },
    reviews: [
      {
        id: '301',
        itemId: '3',
        userName: 'RibLover',
        rating: 5,
        comment: 'Fall-off-the-bone tender! These ribs are amazing with the perfect amount of smoke.',
        date: '2025-04-10T12:30:00Z'
      }
    ]
  },
  {
    id: '4',
    name: 'Ribs Sandwich',
    description: 'Tender rib meat served on a fresh bun with our signature sauce.',
    price: 12.00,
    category: 'sandwiches',
    image_url: LOCAL_IMAGES['ribs-sandwich'],
    tags: ['bbq', 'meat'],
    stock: 18,
    featured: false,
    ingredients: ['Rib meat', 'BBQ sauce', 'Bun'],
    nutritionalInfo: {
      calories: 580,
      protein: 32,
      carbs: 45,
      fat: 28
    },
    reviews: []
  },
  {
    id: '5',
    name: 'Chicken Plate',
    description: 'Smoked chicken with our signature seasoning, served with two sides.',
    price: 20.00,
    category: 'plates',
    image_url: LOCAL_IMAGES['chicken-plate'],
    tags: ['bbq', 'meat'],
    stock: 15,
    featured: true,
    ingredients: ['Chicken', 'BBQ seasoning', 'BBQ sauce'],
    nutritionalInfo: {
      calories: 550,
      protein: 42,
      carbs: 25,
      fat: 30
    },
    reviews: [
      {
        id: '501',
        itemId: '5',
        userName: 'ChickenFan',
        rating: 5,
        comment: 'The chicken is so juicy and flavorful! Great with the sides.',
        date: '2025-04-18T15:30:00Z'
      }
    ]
  },
  {
    id: '6',
    name: 'Chicken Sandwich',
    description: 'Tender smoked chicken served on a fresh bun with our signature sauce.',
    price: 10.00,
    category: 'sandwiches',
    image_url: LOCAL_IMAGES['chicken-sandwich'],
    tags: ['bbq', 'meat'],
    stock: 20,
    featured: false,
    ingredients: ['Chicken', 'BBQ sauce', 'Bun'],
    nutritionalInfo: {
      calories: 480,
      protein: 35,
      carbs: 40,
      fat: 22
    },
    reviews: []
  },
  {
    id: '7',
    name: 'Stuffed Turkey Leg',
    description: 'Giant smoked turkey leg stuffed with your choice of mac & cheese, Alfredo shrimp, or crawfish mac & cheese. A Black culture specialty and rodeo favorite!',
    price: 22.00,
    category: 'plates',
    image_url: LOCAL_IMAGES['turkey-leg'],
    tags: ['bbq', 'meat', 'specialty', 'cultural'],
    stock: 10,
    featured: true,
    ingredients: ['Smoked turkey leg', 'Choice of stuffing: mac & cheese, Alfredo shrimp, or crawfish mac & cheese', 'Special seasonings', 'BBQ sauce'],
    nutritionalInfo: {
      calories: 650,
      protein: 55,
      carbs: 5,
      fat: 40
    },
    reviews: [
      {
        id: '701',
        itemId: '7',
        userName: 'TurkeyFan',
        rating: 5,
        comment: 'This turkey leg is massive and so flavorful! Great for sharing.',
        date: '2025-04-20T14:15:00Z'
      }
    ]
  },
  {
    id: '8',
    name: 'Loaded Baked Potato',
    description: 'Jumbo baked potato loaded with butter, sour cream, cheese, chives, and your choice of brisket, pulled pork, or chicken.',
    price: 20.00,
    category: 'plates',
    image_url: LOCAL_IMAGES['baked-potato'],
    tags: ['entree'],
    stock: 15,
    featured: true,
    ingredients: ['Jumbo potato', 'Butter', 'Sour cream', 'Cheese', 'Chives', 'Choice of meat (brisket, pulled pork, or chicken)'],
    nutritionalInfo: {
      calories: 750,
      protein: 25,
      carbs: 65,
      fat: 45
    },
    reviews: []
  },
  {
    id: '9',
    name: 'Pork Chops Plate',
    description: 'Grilled pork chops with our signature seasoning, served with two sides.',
    price: 20.00,
    category: 'plates',
    image_url: LOCAL_IMAGES['pork-chops'],
    tags: ['bbq', 'meat'],
    stock: 12,
    featured: false,
    ingredients: ['Pork chops', 'BBQ seasoning'],
    nutritionalInfo: {
      calories: 650,
      protein: 45,
      carbs: 25,
      fat: 40
    },
    reviews: []
  },
  {
    id: '11',
    name: 'Links Plate',
    description: 'Smoked sausage links with our signature seasoning, served with two sides.',
    price: 20.00,
    category: 'plates',
    image_url: LOCAL_IMAGES['links-plate'],
    tags: ['bbq', 'meat'],
    stock: 18,
    featured: false,
    ingredients: ['Sausage links', 'BBQ seasoning'],
    nutritionalInfo: {
      calories: 680,
      protein: 35,
      carbs: 25,
      fat: 50
    },
    reviews: []
  },
  {
    id: '13',
    name: '2 Meats + Sides',
    description: 'Your choice of any two meats served with sides (beans, potato salad, dirty rice).',
    price: 24.00,
    category: 'combos',
    image_url: LOCAL_IMAGES['combo-plate'],
    tags: ['bbq', 'meat', 'combo'],
    stock: 25,
    featured: true,
    ingredients: ['Choice of meats', 'Beans', 'Potato salad', 'Dirty rice'],
    nutritionalInfo: {
      calories: 950,
      protein: 65,
      carbs: 70,
      fat: 55
    },
    reviews: []
  },
  {
    id: '14',
    name: '3 Meats + Sides',
    description: 'Your choice of any three meats served with sides (beans, potato salad, dirty rice).',
    price: 28.00,
    category: 'combos',
    image_url: LOCAL_IMAGES['combo-plate'],
    tags: ['bbq', 'meat', 'combo'],
    stock: 20,
    featured: true,
    ingredients: ['Choice of meats', 'Beans', 'Potato salad', 'Dirty rice'],
    nutritionalInfo: {
      calories: 1200,
      protein: 85,
      carbs: 75,
      fat: 70
    },
    reviews: []
  },
  {
    id: '15',
    name: '4 Meats + Sides',
    description: 'Your choice of any four meats served with sides (beans, potato salad, dirty rice).',
    price: 32.00,
    category: 'combos',
    image_url: LOCAL_IMAGES['combo-plate'],
    tags: ['bbq', 'meat', 'combo'],
    stock: 15,
    featured: true,
    ingredients: ['Choice of meats', 'Beans', 'Potato salad', 'Dirty rice'],
    nutritionalInfo: {
      calories: 1450,
      protein: 105,
      carbs: 80,
      fat: 85
    },
    reviews: []
  },
  {
    id: '16',
    name: 'Beans',
    description: 'Slow-cooked beans with special seasonings and smoked meat.',
    price: 4.25,
    category: 'sides',
    image_url: LOCAL_IMAGES['beans'],
    tags: ['side'],
    stock: 30,
    featured: false,
    ingredients: ['Beans', 'Seasonings', 'Smoked meat'],
    nutritionalInfo: {
      calories: 220,
      protein: 12,
      carbs: 35,
      fat: 5
    },
    sizes: [
      { size: '5 oz.', price: 4.25 },
      { size: 'Pint', price: 9.00 },
      { size: 'Quart', price: 17.00 },
      { size: 'Gallon', price: 45.00 }
    ],
    reviews: []
  },
  {
    id: '17',
    name: 'Potato Salad',
    description: 'Homemade potato salad with our special recipe.',
    price: 4.25,
    category: 'sides',
    image_url: LOCAL_IMAGES['potato-salad'],
    tags: ['side', 'vegetarian'],
    stock: 25,
    featured: false,
    ingredients: ['Potatoes', 'Mayonnaise', 'Mustard', 'Eggs', 'Seasonings'],
    nutritionalInfo: {
      calories: 250,
      protein: 5,
      carbs: 30,
      fat: 15
    },
    sizes: [
      { size: '5 oz.', price: 4.25 },
      { size: 'Pint', price: 9.00 },
      { size: 'Quart', price: 17.00 },
      { size: 'Gallon', price: 45.00 }
    ],
    reviews: []
  },
  {
    id: '18',
    name: 'Dirty Rice',
    description: 'Flavorful rice cooked with meat, vegetables, and special seasonings.',
    price: 4.25,
    category: 'sides',
    image_url: LOCAL_IMAGES['dirty-rice'],
    tags: ['side'],
    stock: 25,
    featured: false,
    ingredients: ['Rice', 'Meat', 'Vegetables', 'Seasonings'],
    nutritionalInfo: {
      calories: 280,
      protein: 8,
      carbs: 45,
      fat: 8
    },
    sizes: [
      { size: '5 oz.', price: 4.25 },
      { size: 'Pint', price: 9.00 },
      { size: 'Quart', price: 17.00 },
      { size: 'Gallon', price: 45.00 }
    ],
    reviews: []
  }
];
