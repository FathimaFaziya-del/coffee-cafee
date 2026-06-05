/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MenuItem, StoreLocation, Voucher } from './types';

// Import our generated assets as ES Modules so Vite bundles and hashes them correctly in production
import coffeeHero from './assets/images/coffee_hero_1780680391059.png';
import espressoDrink from './assets/images/espresso_drink_1780680410315.png';
import coffeeBeans from './assets/images/coffee_beans_1780680427052.png';
import coffeePour from './assets/images/coffee_pour_1780680443701.png';

export const IMAGES = {
  hero: coffeeHero,
  drink: espressoDrink,
  beans: coffeeBeans,
  pour: coffeePour
};

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'flat-white',
    name: 'Cardamom Infused Flat White',
    description: 'Double shot of our signature house ristretto with a delicate dusting of premium green organic cardamom, blanketed with velvet camel milk or organic whole-milk micro-foam.',
    price: 26.00,
    category: 'espresso',
    image: IMAGES.drink,
    roastLevel: 'Medium-Light',
    notes: ['Green Cardamom', 'Sweet Cocoa', 'Toasted Hazelnut'],
    customizationOptions: {
      milk: ['Whole Milk', 'Oat Milk', 'Premium Camel Milk', 'Almond Milk'],
      temperature: ['Hot', 'Iced'],
      size: ['Standard (8oz)', 'Large (12oz)'],
      extraShots: true,
      sweetness: ['None', 'Light', 'Regular']
    }
  },
  {
    id: 'pour-over',
    name: 'Yemeni Haraz V60 Pour Over',
    description: 'Bespoke hand-poured slow filter. Sourced from the ancient terraced hills of Haraz, Yemen. Delivers outstanding purity with dynamic floral tones.',
    price: 36.00,
    category: 'filter',
    image: IMAGES.pour,
    origin: 'Haraz Mountains, Yemen',
    roastLevel: 'Light',
    notes: ['Jasmine Florals', 'Wild Honey', 'Red Currant'],
    customizationOptions: {
      temperature: ['Hot', 'Iced'],
      size: ['12oz Pour', '16oz Pour'],
      sweetness: ['None']
    }
  },
  {
    id: 'nitro-brew',
    name: 'Golden Saffron Nitro Draft',
    description: 'Premium slow-steeped cold brew infused with organic saffron threads and nitrogen gas on tap for a velvety, creamy crown and luxurious spice finish.',
    price: 29.00,
    category: 'cold_craft',
    image: IMAGES.pour,
    roastLevel: 'Medium-Dark',
    notes: ['Pure Saffron', 'Dark Chocolate', 'Warm Creamy Finish'],
    customizationOptions: {
      size: ['Regular (12oz)', 'Tall (16oz)'],
      sweetness: ['None', 'Saffron Syrup', 'Vanilla Syrup']
    }
  },
  {
    id: 'beans-yirgacheffe',
    name: 'Yemen Haraz Peaberry Beans',
    description: 'Ultra-rare whole roasted micro-lot beans. Hand-harvested in high elevations, naturally sun-dried on vintage rooftop beds, bringing sublime complex fruit sweetness.',
    price: 135.00,
    category: 'beans',
    image: IMAGES.beans,
    origin: 'Haraz Highlands, Yemen',
    roastLevel: 'Light',
    notes: ['Blackberry Jam', 'Saffron Threads', 'Warm Bergamot']
  },
  {
    id: 'beans-colombia',
    name: 'Panama Geisha Esmeralda Beans',
    description: 'The world\'s most prized floral profile. Sourced directly from Hacienda La Esmeralda. Complex jasmine florality meets sparkling clean processing.',
    price: 185.00,
    category: 'beans',
    image: IMAGES.beans,
    origin: 'Boquete, Panama',
    roastLevel: 'Light',
    notes: ['Jasmine Tea', 'Orange Blossom', 'Sweet Peach']
  },
  {
    id: 'cappuccino',
    name: 'Rose Water & Cardamom Cappuccino',
    description: 'Espresso blanketed with rich, tight micro-foam touched with double-distilled Lebanese rose water and a pinch of hand-ground Emirati cardamom.',
    price: 28.00,
    category: 'espresso',
    image: IMAGES.drink,
    roastLevel: 'Medium',
    notes: ['Damascene Rose', 'Spiced Pods', 'Sweet Buttercream'],
    customizationOptions: {
      milk: ['Whole Milk', 'Premium Camel Milk', 'Oat Milk'],
      temperature: ['Hot'],
      size: ['Standard (6oz)', 'Large (10oz)'],
      extraShots: true,
      sweetness: ['None', 'Light', 'Regular']
    }
  },
  {
    id: 'iced-latte',
    name: 'Gourmet Date Butter Cold Latte',
    description: 'Artisanal ristretto extraction combined with fresh chilled farm milk, integrated organic Khalas date honey syrup, and premium pecan praline dust.',
    price: 32.00,
    category: 'cold_craft',
    image: IMAGES.drink,
    roastLevel: 'Medium-Light',
    notes: ['Khalas Date Nectar', 'Caramelized Pecan', 'Sweet Cream'],
    customizationOptions: {
      milk: ['Whole Milk', 'Premium Camel Milk', 'Oat Milk'],
      size: ['Regular (12oz)', 'Large (16oz)'],
      extraShots: true,
      sweetness: ['Light', 'Regular', 'Extra']
    }
  }
];

export const STORE_LOCATIONS: StoreLocation[] = [
  {
    id: 'metro-atelier',
    name: 'KÁHWA Specialty Pavilion - Jumeirah',
    address: '742 Jumeirah Beach Road, Jumeirah 2',
    city: 'Dubai, UAE',
    phone: '+971 (4) 388-1920',
    hours: '08:00 AM - 12:00 AM',
    coordinates: { lat: 37.7915, lng: -122.4018 },
    features: ['Yemeni Slow Bar', 'Custom Micro-Batches', 'Private Majlis Pods', 'Complementary Valet Parking']
  },
  {
    id: 'westside-slow',
    name: 'KÁHWA Waterfront Lounge - Al Bateen',
    address: 'Al Bateen Marina, Marina Walk',
    city: 'Abu Dhabi, UAE',
    phone: '+971 (2) 665-0234',
    hours: '08:00 AM - 12:00 AM',
    coordinates: { lat: 37.7650, lng: -122.4410 },
    features: ['Overlooking Premium Yacht Club', 'Nitro Saffron Mocktails', 'Aesthetic Vinyl Sound Room', 'Dates Pairing Salon']
  },
  {
    id: 'roastery-hq',
    name: 'KÁHWA Roastery Headquarters - Aljada',
    address: 'Zaha Hadid Boulevard, Aljada Pavilion',
    city: 'Sharjah, UAE',
    phone: '+971 (6) 555-0841',
    hours: '07:30 AM - 11:30 PM',
    coordinates: { lat: 37.7490, lng: -122.3888 },
    features: ['In-House Eco Roasting Yard', 'Scent Profile Seminars', 'Arabic Qahwa Heritage Lab', 'Outdoor Fountain Gazebo']
  }
];

export const VALID_VOUCHERS: Voucher[] = [
  {
    code: 'MARHABA10',
    type: 'percentage',
    value: 10,
    description: '10% off your entire order'
  },
  {
    code: 'DXB20',
    type: 'percentage',
    value: 20,
    description: '20% off all espresso craft items'
  },
  {
    code: 'KAHWA5',
    type: 'fixed',
    value: 5.00,
    description: 'AED 5.00 off greeting reward'
  },
  {
    code: 'HILAL15',
    type: 'percentage',
    value: 15,
    description: '15% off any single origin'
  }
];
