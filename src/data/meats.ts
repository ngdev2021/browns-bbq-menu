export interface Meat {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
  description?: string;
}

export const meats: Meat[] = [
  {
    id: 'meat-1',
    name: 'Brisket',
    price: 8.99,
    image_url: '/images/menu-items/brisket-plate.jpg',
    category: 'meats',
    description: 'Tender smoked beef brisket'
  },
  {
    id: 'meat-2',
    name: 'Ribs',
    price: 7.99,
    image_url: '/images/menu-items/ribs-plate.jpg',
    category: 'meats',
    description: 'Fall-off-the-bone pork ribs'
  },
  {
    id: 'meat-3',
    name: 'Chicken',
    price: 6.99,
    image_url: '/images/menu-items/chicken-plate.jpg',
    category: 'meats',
    description: 'Juicy smoked chicken'
  },
  {
    id: 'meat-4',
    name: 'Pork Chops',
    price: 7.99,
    image_url: '/images/menu-items/pork-chops-plate.jpg',
    category: 'meats',
    description: 'Tender smoked pork chops'
  },
  {
    id: 'meat-5',
    name: 'Sausage Links',
    price: 6.99,
    image_url: '/images/menu-items/link-plate.jpg',
    category: 'meats',
    description: 'Savory smoked sausage links'
  },
  {
    id: 'meat-6',
    name: 'Turkey',
    price: 7.99,
    image_url: '/images/menu-items/stuffed-turkey-leg.jpg',
    category: 'meats',
    description: 'Smoked turkey'
  }
];
