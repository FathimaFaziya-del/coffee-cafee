/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'espresso' | 'cold_craft' | 'filter' | 'beans';
  image: string;
  origin?: string;
  roastLevel?: 'Light' | 'Medium-Light' | 'Medium' | 'Medium-Dark' | 'Dark';
  notes?: string[];
  customizationOptions?: {
    milk?: string[];
    temperature?: string[];
    size?: string[];
    extraShots?: boolean;
    sweetness?: string[];
  };
}

export interface CartItem {
  cartId: string;
  menuItem: MenuItem;
  quantity: number;
  customization: {
    milk?: string;
    temperature?: string;
    size?: string;
    extraShots?: boolean;
    sweetness?: string;
  };
}

export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  hours: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  features: string[];
}

export interface Voucher {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  description: string;
}
