/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MenuItem, StoreLocation, Voucher } from './types';

// Let's import the specific images we generated so they list correctly
// and reference them in our menu items.
export const IMAGES = {
  hero: '/src/assets/images/coffee_hero_1780680391059.png',
  drink: '/src/assets/images/espresso_drink_1780680410315.png',
  beans: '/src/assets/images/coffee_beans_1780680427052.png',
  pour: '/src/assets/images/coffee_pour_1780680443701.png'
};

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'flat-white',
    name: 'Artisan Flat White',
    description: 'Double shot of our signature house sweet ristretto, blanketed with velvet whole-milk micro-foam containing tiny, uniform bubbles.',
    price: 4.85,
    category: 'espresso',
    image: IMAGES.drink,
    roastLevel: 'Medium-Light',
    notes: ['Sweet Cocoa', 'Toasted Hazelnut', 'Caramelized Sugar'],
    customizationOptions: {
      milk: ['Whole Milk', 'Oat Milk', 'Almond Milk', 'Coconut Milk'],
      temperature: ['Hot', 'Iced'],
      size: ['Standard (8oz)', 'Large (12oz)'],
      extraShots: true,
      sweetness: ['None', 'Light', 'Regular']
    }
  },
  {
    id: 'pour-over',
    name: 'Single Origin V60 Pour Over',
    description: 'Slow-drip filtered coffee prepared by hand. Clean cup emphasizing vibrant terroir notes and sparkling acidity.',
    price: 5.50,
    category: 'filter',
    image: IMAGES.pour,
    origin: 'Ethiopia Yirgacheffe',
    roastLevel: 'Light',
    notes: ['Jasmine Florals', 'Peach Nectar', 'Bergamot Tea'],
    customizationOptions: {
      temperature: ['Hot', 'Iced'],
      size: ['12oz Pour', '16oz Pour'],
      sweetness: ['None']
    }
  },
  {
    id: 'nitro-brew',
    name: 'Craft Nitro Cold Brew',
    description: 'Slow-steeped cold brew infused with food-grade nitrogen gas straight from the tap for a thick, creamy head similar to stout beer.',
    price: 5.25,
    category: 'cold_craft',
    image: IMAGES.pour,
    roastLevel: 'Medium-Dark',
    notes: ['Dark Chocolate', 'Molasses', 'Creamy Mouthfeel'],
    customizationOptions: {
      size: ['Regular (12oz)', 'Tall (16oz)'],
      sweetness: ['None', 'Vanilla Syrup', 'Caramel Syrup']
    }
  },
  {
    id: 'beans-yirgacheffe',
    name: 'Ethiopia Yirgacheffe Beans',
    description: 'Whole roasted specialty beans. Heirloom varieties grown at 2,000 meters above sea level, natural sun-dried process.',
    price: 19.00,
    category: 'beans',
    image: IMAGES.beans,
    origin: 'Kochere District, Yirgacheffe',
    roastLevel: 'Light',
    notes: ['Blueberry Jam', 'Black Tea', 'Lemon Lavender']
  },
  {
    id: 'beans-colombia',
    name: 'Colombia Supremo Huila',
    description: 'Directly sourced estate-grown whole bean coffee. Wet wash-processed, dried on raised African beds under covers.',
    price: 17.50,
    category: 'beans',
    image: IMAGES.beans,
    origin: 'Pitalito, Huila',
    roastLevel: 'Medium',
    notes: ['Red Apple', 'Brown Sugar', 'Almond Praline']
  },
  {
    id: 'cappuccino',
    name: 'Classic Cardamom Cappuccino',
    description: 'Equal thirds of intense espresso, sweet steamed milk, and heavy dry foam, topped with organic cardamom powder.',
    price: 4.95,
    category: 'espresso',
    image: IMAGES.drink,
    roastLevel: 'Medium',
    notes: ['Warm Spice', 'Citrus Peel', 'Rich Cream'],
    customizationOptions: {
      milk: ['Whole Milk', 'Oat Milk', 'Almond Milk'],
      temperature: ['Hot'],
      size: ['Standard (6oz)', 'Large (10oz)'],
      extraShots: true,
      sweetness: ['None', 'Light', 'Regular']
    }
  },
  {
    id: 'iced-latte',
    name: 'Iced Maple Pecan Latte',
    description: 'Espresso combined with fresh cold milk, 100% grade-A maple syrup, organic pecan extract, and cold cubes.',
    price: 5.50,
    category: 'cold_craft',
    image: IMAGES.drink,
    roastLevel: 'Medium-Light',
    notes: ['Maple Butter', 'Pecan Praline', 'Creamy Caramel'],
    customizationOptions: {
      milk: ['Whole Milk', 'Oat Milk', 'Almond Milk'],
      size: ['Regular (12oz)', 'Large (16oz)'],
      extraShots: true,
      sweetness: ['Light', 'Regular', 'Extra']
    }
  }
];

export const STORE_LOCATIONS: StoreLocation[] = [
  {
    id: 'metro-atelier',
    name: 'Boutique Espresso Atelier',
    address: '142 Pine Street, Downtown',
    city: 'San Francisco, CA',
    phone: '+1 (415) 555-0192',
    hours: '07:00 AM - 06:00 PM',
    coordinates: { lat: 37.7915, lng: -122.4018 },
    features: ['Pour Over Slow Bar', 'Custom Roasts', 'Indoor Garden Courtyard', 'Valet Parking']
  },
  {
    id: 'westside-slow',
    name: 'The Slow Lounge & Brew Bar',
    address: '812 River Parkway, Westside',
    city: 'San Francisco, CA',
    phone: '+1 (415) 555-0234',
    hours: '08:00 AM - 07:00 PM',
    coordinates: { lat: 37.7650, lng: -122.4410 },
    features: ['Manual V60 Station', 'Nitro Taps', 'Vinyl Record Sound System', 'Pet Friendly']
  },
  {
    id: 'roastery-hq',
    name: 'Coffee Co. Roastery HQ',
    address: '109 Industrial Boulevard',
    city: 'San Francisco, CA',
    phone: '+1 (415) 555-0841',
    hours: '06:30 AM - 04:30 PM',
    coordinates: { lat: 37.7490, lng: -122.3888 },
    features: ['Live Roasting Demos', 'Cupping Seminars', 'Wholesale Bean Dispensary', 'Outdoor Deck']
  }
];

export const VALID_VOUCHERS: Voucher[] = [
  {
    code: 'COFFEE10',
    type: 'percentage',
    value: 10,
    description: '10% off your entire order'
  },
  {
    code: 'ESPRESSO20',
    type: 'percentage',
    value: 20,
    description: '20% off all espresso craft items'
  },
  {
    code: 'WELCOME5',
    type: 'fixed',
    value: 5.00,
    description: '$5.00 off welcome back reward'
  },
  {
    code: 'BREWLOVE',
    type: 'percentage',
    value: 15,
    description: '15% off any V60 single origin'
  }
];
