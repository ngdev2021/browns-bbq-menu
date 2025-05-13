export interface Side {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
  description?: string;
}

export const sides: Side[] = [
  {
    id: 'side-1',
    name: 'Mac & Cheese',
    price: 3.49,
    image_url: '/images/sides/mac-cheese.jpg',
    category: 'sides',
    description: 'Creamy, cheesy macaroni and cheese'
  },
  {
    id: 'side-2',
    name: 'Potato Salad',
    price: 2.99,
    image_url: '/images/sides/potato-salad.jpg',
    category: 'sides',
    description: 'Homestyle potato salad with a hint of mustard'
  },
  {
    id: 'side-3',
    name: 'Coleslaw',
    price: 2.49,
    image_url: '/images/sides/coleslaw.jpg',
    category: 'sides',
    description: 'Crisp, fresh coleslaw with our signature dressing'
  },
  {
    id: 'side-4',
    name: 'Baked Beans',
    price: 2.99,
    image_url: '/images/sides/baked-beans.jpg',
    category: 'sides',
    description: 'Sweet and savory baked beans with bits of brisket'
  },
  {
    id: 'side-5',
    name: 'Collard Greens',
    price: 3.49,
    image_url: '/images/sides/collard-greens.jpg',
    category: 'sides',
    description: 'Southern-style collard greens cooked with smoked turkey'
  },
  {
    id: 'side-6',
    name: 'Corn Bread',
    price: 1.99,
    image_url: '/images/sides/cornbread.jpg',
    category: 'sides',
    description: 'Sweet, moist cornbread'
  }
];
