export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugarNote?: string;
  image: string;
  featured?: boolean;
  nutritionFeatured?: boolean;
  nutritionTabName?: string;
}

// Helper to get product images
const IMG_CHOCOLATE = '/images/product-chocolate.jpg';
const IMG_NUTS = '/images/product-nuts.jpg';
const IMG_PINEAPPLE = '/images/product-pineapple.jpg';

export const products: Product[] = [
  // PUDDINGS (All 1.75 JD)
  {
    id: 'p-brownie',
    name: 'Pudding Brownie',
    category: 'pudding',
    price: 1.75,
    calories: 345,
    protein: 18,
    carbs: 27,
    fat: 3,
    sugarNote: 'No Added Sugar',
    image: IMG_CHOCOLATE,
    featured: true,
    nutritionFeatured: true,
    nutritionTabName: 'Brownie'
  },
  {
    id: 'p-cookies',
    name: 'Pudding Cookies',
    category: 'pudding',
    price: 1.75,
    calories: 345,
    protein: 18,
    carbs: 27,
    fat: 3,
    sugarNote: 'No Added Sugar',
    image: IMG_CHOCOLATE,
    featured: true,
    nutritionFeatured: true,
    nutritionTabName: 'Cookies'
  },
  {
    id: 'p-bounty',
    name: 'Pudding Bounty',
    category: 'pudding',
    price: 1.75,
    calories: 245,
    protein: 18,
    carbs: 27,
    fat: 3,
    sugarNote: 'No Added Sugar',
    image: IMG_NUTS,
    nutritionFeatured: true,
    nutritionTabName: 'Bounty'
  },
  {
    id: 'p-lotus',
    name: 'Pudding Lotus',
    category: 'pudding',
    price: 1.75,
    calories: 245,
    protein: 18,
    carbs: 27,
    fat: 3,
    sugarNote: 'No Added Sugar',
    image: IMG_NUTS
  },
  {
    id: 'p-oreo',
    name: 'Pudding Oreo',
    category: 'pudding',
    price: 1.75,
    calories: 345,
    protein: 18,
    carbs: 27,
    fat: 3,
    sugarNote: 'No Added Sugar',
    image: IMG_CHOCOLATE,
    nutritionFeatured: true,
    nutritionTabName: 'Oreo'
  },
  {
    id: 'p-ferrero',
    name: 'Pudding Ferrero',
    category: 'pudding',
    price: 1.75,
    calories: 245,
    protein: 18,
    carbs: 27,
    fat: 3,
    sugarNote: 'No Added Sugar',
    image: IMG_CHOCOLATE,
    nutritionFeatured: true,
    nutritionTabName: 'Ferrero'
  },
  {
    id: 'p-snickers',
    name: 'Pudding Snickers',
    category: 'pudding',
    price: 1.75,
    calories: 245,
    protein: 18,
    carbs: 27,
    fat: 3,
    sugarNote: 'No Added Sugar',
    image: IMG_CHOCOLATE
  },
  {
    id: 'p-tiramisu',
    name: 'Pudding Tiramisu',
    category: 'pudding',
    price: 1.75,
    calories: 245,
    protein: 18,
    carbs: 27,
    fat: 3,
    sugarNote: 'No Added Sugar',
    image: IMG_NUTS
  },
  {
    id: 'p-pistachio',
    name: 'Pudding Pistachio',
    category: 'pudding',
    price: 1.75,
    calories: 245,
    protein: 18,
    carbs: 27,
    fat: 3,
    sugarNote: 'No Added Sugar',
    image: IMG_NUTS
  },
  {
    id: 'p-kinder',
    name: 'Pudding Kinder',
    category: 'pudding',
    price: 1.75,
    calories: 345,
    protein: 18,
    carbs: 27,
    fat: 3,
    sugarNote: 'No Added Sugar',
    image: IMG_CHOCOLATE
  },
  // GRANOLA (All 2.00 JD)
  {
    id: 'g-nuts',
    name: 'Granola Nuts',
    category: 'granola',
    price: 2.00,
    calories: 205,
    protein: 16,
    carbs: 27,
    fat: 7,
    sugarNote: 'No Added Sugar',
    image: IMG_NUTS,
    featured: true
  },
  {
    id: 'g-pineapple',
    name: 'Granola Pineapple',
    category: 'granola',
    price: 2.00,
    calories: 205,
    protein: 16,
    carbs: 27,
    fat: 7,
    sugarNote: 'No Added Sugar',
    image: IMG_PINEAPPLE
  },
  {
    id: 'g-strawberry',
    name: 'Granola Strawberry',
    category: 'granola',
    price: 2.00,
    calories: 205,
    protein: 16,
    carbs: 27,
    fat: 7,
    sugarNote: 'Natural sugar only from ingredients',
    image: IMG_NUTS,
    featured: true
  }
];
