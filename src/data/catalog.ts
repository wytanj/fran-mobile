import type { Bestie, CatalogCategory, GrwmBundle, Product, ProductReview } from '../types';

export const clubTiers = [
  { tier: 1 as const, name: 'Starter', next: 'Insider', ptsNeeded: 75 },
  { tier: 2 as const, name: 'Insider', next: 'Elite', ptsNeeded: 500 },
  { tier: 3 as const, name: 'Elite', next: null, ptsNeeded: 0 },
];

export const catalogFilters: { id: CatalogCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'skincare', label: 'Skincare' },
  { id: 'makeup', label: 'Makeup' },
  { id: 'hair', label: 'Hair' },
  { id: 'bundles', label: 'Bundles' },
];

export const products: Product[] = [
  {
    id: 'p_radiance',
    brand: 'LISE Signature',
    name: 'Radiance Glow Serum',
    category: 'skincare',
    price: 68,
    compareAt: 82,
    rating: 4.9,
    reviewCount: 128,
    image: require('../../assets/catalog/pdp-raw.png'),
    description:
      'Infused with rare botanical extracts and Vitamin C, our Radiance Glow Serum penetrates deep into the dermal layers to provide instant hydration and a lasting luminous finish. Perfect for all skin types.',
    ingredients: ['Hyaluronic Acid', 'Vitamin C (15%)', 'Niacinamide', 'Ferulic Acid'],
    tags: ['Bestseller'],
  },
  {
    id: 'p_velvet',
    brand: 'LISE Signature',
    name: 'Velvet Matte Crimson',
    category: 'makeup',
    price: 32,
    compareAt: 38,
    rating: 4.7,
    reviewCount: 86,
    image: require('../../assets/catalog/product-1.png'),
    description: 'A cushioned matte lipstick that stays put without drying the lip line.',
    ingredients: ['Jojoba', 'Vitamin E', 'Rice wax'],
    tags: ['New'],
  },
  {
    id: 'p_hydra',
    brand: 'Sea Minerals',
    name: 'Hydra-Plump Cream',
    category: 'skincare',
    price: 54,
    rating: 4.8,
    reviewCount: 64,
    image: require('../../assets/catalog/product-3.png'),
    description: 'A sea-mineral moisturizer that plumps without a heavy film.',
    ingredients: ['Sea minerals', 'Squalane', 'Ceramides'],
  },
  {
    id: 'p_curl',
    brand: 'LISE Hair',
    name: 'Curl Revival Set',
    category: 'hair',
    price: 48,
    compareAt: 62,
    rating: 4.6,
    reviewCount: 41,
    image: require('../../assets/catalog/product-6.png'),
    description: 'A wash-and-define duo for the Korean S curl — light hold, no crunch.',
    ingredients: ['Rice water', 'Panthenol', 'Glycerin'],
    tags: ['New'],
  },
];

export const besties: Bestie[] = [
  { id: 'b1', handle: 'rayray1235', image: require('../../assets/catalog/avatar-1.png') },
  { id: 'b2', handle: 'mayaray', image: require('../../assets/catalog/avatar-2.png') },
  { id: 'b3', handle: 'sarah.s', image: require('../../assets/catalog/avatar-1.png') },
  { id: 'b4', handle: 'nadiax', image: require('../../assets/catalog/avatar-2.png') },
  { id: 'b5', handle: 'glowclub', image: require('../../assets/catalog/avatar-1.png') },
];

export const bundles: GrwmBundle[] = [
  {
    id: 'b_summer',
    title: 'Summer Glow Kit',
    creator: 'maya ray',
    creatorImage: require('../../assets/catalog/avatar-1.png'),
    price: 85,
    compareAt: 110,
    image: require('../../assets/catalog/bundle-summer.png'),
    productIds: ['p_radiance', 'p_hydra'],
    featured: true,
  },
  {
    id: 'b_hydration',
    title: 'Hydration Essentials',
    creator: 'Sarah S.',
    creatorImage: require('../../assets/catalog/avatar-2.png'),
    price: 92,
    compareAt: 125,
    image: require('../../assets/catalog/bundle-hero.png'),
    productIds: ['p_hydra', 'p_radiance'],
    featured: true,
  },
  {
    id: 'b_curl',
    title: 'Curl revival set',
    creator: 'nadiaxbeauty',
    creatorImage: require('../../assets/catalog/avatar-2.png'),
    price: 48,
    compareAt: 62,
    image: require('../../assets/catalog/product-6.png'),
    productIds: ['p_curl'],
  },
];

export const reviews: ProductReview[] = [
  {
    id: 'r1',
    productId: 'p_radiance',
    author: 'Alicia T.',
    rating: 5,
    text: 'Glass skin in a week. Light, sinks in, no pilling under makeup.',
  },
  {
    id: 'r2',
    productId: 'p_radiance',
    author: 'Mei L.',
    rating: 5,
    text: 'The only vitamin C that does not sting my combination skin.',
  },
  {
    id: 'r3',
    productId: 'p_velvet',
    author: 'Priya',
    rating: 4,
    text: 'Colour is true. A little drying by hour eight — balm underneath helps.',
  },
];

export function productById(id: string) {
  return products.find((p) => p.id === id);
}

export function reviewsFor(productId: string) {
  return reviews.filter((r) => r.productId === productId);
}

export function productsForCategory(category: CatalogCategory) {
  if (category === 'all') return products;
  if (category === 'bundles') return [];
  return products.filter((p) => p.category === category);
}
