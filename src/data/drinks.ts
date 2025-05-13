export interface Drink {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
  description?: string;
}

export const drinks: Drink[] = [
  {
    id: 'drink-1',
    name: 'Coca-Cola',
    price: 2.49,
    image_url: '/images/drinks/placeholder-drink.svg',
    category: 'drinks',
    description: 'Classic Coca-Cola in a 20oz bottle'
  },
  {
    id: 'drink-2',
    name: 'Diet Coke',
    price: 2.49,
    image_url: '/images/drinks/placeholder-drink.svg',
    category: 'drinks',
    description: 'Diet Coca-Cola in a 20oz bottle'
  },
  {
    id: 'drink-3',
    name: 'Coke Zero',
    price: 2.49,
    image_url: '/images/drinks/placeholder-drink.svg',
    category: 'drinks',
    description: 'Zero sugar Coca-Cola with the same great taste'
  },
  {
    id: 'drink-4',
    name: 'Sprite',
    price: 2.49,
    image_url: '/images/drinks/placeholder-drink.svg',
    category: 'drinks',
    description: 'Crisp, refreshing lemon-lime flavor in a 20oz bottle'
  },
  {
    id: 'drink-5',
    name: 'Dr Pepper',
    price: 2.49,
    image_url: '/images/drinks/placeholder-drink.svg',
    category: 'drinks',
    description: 'Dr Pepper in a 20oz bottle'
  },
  {
    id: 'drink-6',
    name: 'Fanta Orange',
    price: 2.49,
    image_url: '/images/drinks/placeholder-drink.svg',
    category: 'drinks',
    description: 'Bright, bubbly orange-flavored soda'
  },
  {
    id: 'drink-7',
    name: 'Sweet Tea',
    price: 2.49,
    image_url: '/images/drinks/placeholder-drink.svg',
    category: 'drinks',
    description: 'Southern-style sweet tea'
  },
  {
    id: 'drink-8',
    name: 'Unsweet Tea',
    price: 2.49,
    image_url: '/images/drinks/placeholder-drink.svg',
    category: 'drinks',
    description: 'Fresh brewed unsweetened tea'
  },
  {
    id: 'drink-9',
    name: 'Half & Half Tea',
    price: 2.49,
    image_url: '/images/drinks/placeholder-drink.svg',
    category: 'drinks',
    description: 'Half sweet tea, half lemonade - a refreshing combination'
  },
  {
    id: 'drink-10',
    name: 'Lemonade',
    price: 2.49,
    image_url: '/images/drinks/placeholder-drink.svg',
    category: 'drinks',
    description: 'Fresh-squeezed style lemonade'
  },
  {
    id: 'drink-11',
    name: 'Strawberry Lemonade',
    price: 2.99,
    image_url: '/images/drinks/placeholder-drink.svg',
    category: 'drinks',
    description: 'Lemonade with a sweet strawberry twist'
  },
  {
    id: 'drink-12',
    name: 'Bottled Water',
    price: 1.99,
    image_url: '/images/drinks/placeholder-drink.svg',
    category: 'drinks',
    description: 'Purified bottled water'
  }
];
