export interface Dessert {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
  description?: string;
}

export const desserts: Dessert[] = [
  {
    id: 'dessert-1',
    name: 'Peach Cobbler',
    price: 5.99,
    image_url: '/images/placeholder.jpg',
    category: 'desserts',
    description: 'Homemade peach cobbler with a flaky crust and sweet peach filling'
  },
  {
    id: 'dessert-2',
    name: 'Banana Pudding',
    price: 4.99,
    image_url: '/images/placeholder.jpg',
    category: 'desserts',
    description: 'Classic southern banana pudding with vanilla wafers and whipped cream'
  },
  {
    id: 'dessert-3',
    name: 'Sweet Potato Pie',
    price: 4.99,
    image_url: '/images/placeholder.jpg',
    category: 'desserts',
    description: 'Traditional sweet potato pie with a buttery crust'
  }
];
