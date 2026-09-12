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
const IMG_SANDWICH = '/images/sandwich-default.jpg';

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
    image: IMG_NUTS,
    featured: true
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
    image: IMG_NUTS
  },
  // SANDWICHES (All 3.50 JD)
  {
    id: 's-zinger',
    name: 'Zinger Sandwich',
    category: 'sandwiches',
    price: 3.50,
    calories: 430,
    protein: 44,
    carbs: 30,
    fat: 10,
    sugarNote: 'Crispy healthy chicken, lettuce, spicy zinger sauce, fresh vegetables',
    image: IMG_SANDWICH,
    featured: true
  },
  {
    id: 's-smoky',
    name: 'Smoky Sandwich',
    category: 'sandwiches',
    price: 3.50,
    calories: 430,
    protein: 44,
    carbs: 30,
    fat: 10,
    sugarNote: 'Grilled chicken, lettuce, signature smoky sauce, fresh vegetables',
    image: IMG_SANDWICH
  },
  {
    id: 's-fajita',
    name: 'Fajita Sandwich',
    category: 'sandwiches',
    price: 3.50,
    calories: 430,
    protein: 44,
    carbs: 30,
    fat: 10,
    sugarNote: 'Seasoned chicken fajita strips, grilled peppers & onions, lettuce, Mexican fajita sauce',
    image: IMG_SANDWICH
  },
  {
    id: 's-dynamite',
    name: 'Dynamite Sandwich',
    category: 'sandwiches',
    price: 3.50,
    calories: 430,
    protein: 44,
    carbs: 30,
    fat: 10,
    sugarNote: 'Tender healthy chicken, lettuce, signature spicy dynamite sauce, fresh vegetables',
    image: IMG_SANDWICH
  },
  {
    id: 's-turkey',
    name: 'Turkey Sandwich',
    category: 'sandwiches',
    price: 3.50,
    calories: 430,
    protein: 44,
    carbs: 30,
    fat: 10,
    sugarNote: 'Premium smoked turkey breast slices, lettuce, light mustard mayo sauce, fresh vegetables',
    image: IMG_SANDWICH
  },
  {
    id: 's-roastbeef',
    name: 'Roast Beef Sandwich',
    category: 'sandwiches',
    price: 3.50,
    calories: 430,
    protein: 44,
    carbs: 30,
    fat: 10,
    sugarNote: 'Roasted prime beef slices, lettuce, light pepper sauce, fresh tomatoes & pickles',
    image: IMG_SANDWICH,
    featured: true
  },
  {
    id: 's-halloumi',
    name: 'Halloumi Sandwich',
    category: 'sandwiches',
    price: 3.50,
    calories: 430,
    protein: 44,
    carbs: 30,
    fat: 10,
    sugarNote: 'Grilled low-fat halloumi cheese, lettuce, fresh mint, cucumber & tomato, herb sauce',
    image: IMG_SANDWICH
  }
];
