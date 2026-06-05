/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Coffee, MapPin, ShoppingBag, Sparkles, Heart, Menu } from 'lucide-react';
import { MenuItem, CartItem } from './types';
import { IMAGES } from './data';
import MenuSection from './components/MenuSection';
import CoffeeSelectorModal from './components/CoffeeSelectorModal';
import CheckoutSection from './components/CheckoutSection';
import StoreLocator from './components/StoreLocator';

export default function App() {
  const [activeTab, setActiveTab] = useState<'menu' | 'locator' | 'checkout'>('menu');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Load cart on start from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('coffee_cart');
      if (stored) {
        setCart(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Could not restore basket state:', e);
    }
  }, []);

  // Save cart changes to localStorage
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    try {
      localStorage.setItem('coffee_cart', JSON.stringify(newCart));
    } catch (e) {
      console.error('Could not preserve basket state:', e);
    }
  };

  // Add customized item to the shopping cart
  const handleAddToCart = (
    item: MenuItem,
    customization: {
      milk?: string;
      temperature?: string;
      size?: string;
      extraShots?: boolean;
      sweetness?: string;
    }
  ) => {
    // Check if duplicate item exists with EXACT same customization triggers
    const duplicateIndex = cart.findIndex((cartItem) => {
      if (cartItem.menuItem.id !== item.id) return false;
      return (
        cartItem.customization.milk === customization.milk &&
        cartItem.customization.temperature === customization.temperature &&
        cartItem.customization.size === customization.size &&
        cartItem.customization.extraShots === customization.extraShots &&
        cartItem.customization.sweetness === customization.sweetness
      );
    });

    if (duplicateIndex > -1) {
      const updated = [...cart];
      updated[duplicateIndex].quantity += 1;
      saveCart(updated);
    } else {
      const generatedId = `cart-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      const newItem: CartItem = {
        cartId: generatedId,
        menuItem: item,
        quantity: 1,
        customization,
      };
      saveCart([...cart, newItem]);
    }
    // Automatically open checkout screen for immediate delight, or keep ordering
    setActiveTab('checkout');
  };

  // Update item quantities
  const handleUpdateQuantity = (cartId: string, delta: number) => {
    const updated = cart
      .map((item) => {
        if (item.cartId === cartId) {
          return { ...item, quantity: Math.max(1, item.quantity + delta) };
        }
        return item;
      });
    saveCart(updated);
  };

  // Remove single item
  const handleRemoveItem = (cartId: string) => {
    const updated = cart.filter((item) => item.cartId !== cartId);
    saveCart(updated);
  };

  // Clear checkout cart
  const handleClearCart = () => {
    saveCart([]);
  };

  // Quick total metrics for navbar indicator
  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div id="app-root-container" className="min-h-screen bg-[#fbfbfa] text-neutral-800 flex flex-col font-sans selection:bg-[#8c6239]/10 selection:text-[#8c6239]">
      
      {/* Decorative Warm Accent Header Strip */}
      <div className="h-1 bg-neutral-900 w-full" />

      {/* Main Luxury Header Navigation Bar */}
      <nav id="top-navbar" className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-neutral-200/60 z-40 px-4 py-3 sm:py-4 transition-all duration-300">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          {/* Logo / Brand signature */}
          <div 
            id="logo-brand"
            onClick={() => setActiveTab('menu')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8.5 h-8.5 rounded-xl bg-neutral-950 flex items-center justify-center text-white font-serif text-base font-bold shadow-sm group-hover:rotate-12 transition-transform duration-300">
              K
            </div>
            <div>
              <span className="font-serif text-lg tracking-tight font-medium text-neutral-900 block leading-tight">
                KÁHWA ATELIER
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#8c6239] block font-bold leading-none">
                Specialty Coffee • UAE
              </span>
            </div>
          </div>

          {/* Desktop Nav Tabs menu */}
          <div className="hidden md:flex items-center gap-1.5 bg-neutral-100 p-1 rounded-xl border border-neutral-200/40">
            <button
              id="tab-btn-menu"
              onClick={() => setActiveTab('menu')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'menu'
                  ? 'bg-white text-neutral-950 shadow-sm font-bold'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
              Káhwa & Brews
            </button>
            <button
              id="tab-btn-locator"
              onClick={() => setActiveTab('locator')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'locator'
                  ? 'bg-white text-neutral-950 shadow-sm font-bold'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              Atelier Blueprint
            </button>
            <button
              id="tab-btn-checkout"
              onClick={() => setActiveTab('checkout')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all relative cursor-pointer ${
                activeTab === 'checkout'
                  ? 'bg-white text-neutral-950 shadow-sm font-bold'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Checkout Bag
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-neutral-950 text-[10px] font-mono font-bold text-white ring-2 ring-white">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>

          {/* Checkout Basket Quick button for mobile layout */}
          <div className="flex items-center gap-2">
            <button
              id="mobile-basket-btn"
              onClick={() => setActiveTab('checkout')}
              className="md:hidden flex items-center justify-center p-2.5 rounded-xl border border-neutral-200 hover:border-neutral-400 bg-white text-neutral-800 relative focus:outline-none"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-950 text-[9px] font-mono font-bold text-white ring-2 ring-white">
                  {cartItemsCount}
                </span>
              )}
            </button>
            
            {/* Quick hamburger Menu for smaller layouts */}
            <button
              id="hamburger-menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex items-center justify-center p-2.5 rounded-xl border border-neutral-200 bg-white text-neutral-800 focus:outline-none"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Panel list */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              id="mobile-dropdown-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white mt-3 overflow-hidden border-t border-neutral-100 flex flex-col px-1"
            >
              <button
                id="mobile-tab-menu"
                onClick={() => {
                  setActiveTab('menu');
                  setMenuOpen(false);
                }}
                className="flex items-center gap-3 py-3 px-4 text-xs font-semibold uppercase tracking-wider text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-xl mt-1 text-left"
              >
                <Coffee className="w-4 h-4 text-[#8c6239]" />
                Slow Brews Catalog
              </button>
              <button
                id="mobile-tab-locator"
                onClick={() => {
                  setActiveTab('locator');
                  setMenuOpen(false);
                }}
                className="flex items-center gap-3 py-3 px-4 text-xs font-semibold uppercase tracking-wider text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-xl text-left"
              >
                <MapPin className="w-4 h-4 text-[#8c6239]" />
                Store Blueprint Locator
              </button>
              <button
                id="mobile-tab-checkout"
                onClick={() => {
                  setActiveTab('checkout');
                  setMenuOpen(false);
                }}
                className="flex items-center gap-3 py-3 px-4 text-xs font-semibold uppercase tracking-wider text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-xl mb-1 text-left"
              >
                <ShoppingBag className="w-4 h-4 text-[#8c6239]" />
                Checkout basket ({cartItemsCount} items)
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Core View Area */}
      <main className="flex-1 w-full px-4 max-w-6xl mx-auto py-8 space-y-12">
        <AnimatePresence mode="wait">
          {activeTab === 'menu' && (
            <motion.div
              id="menu-tab-view"
              key="menu-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-12"
            >
              {/* Immersive Specialty Coffee Shop Hero Banner Card */}
              <div 
                id="hero-banner"
                className="relative bg-neutral-900 rounded-[32px] overflow-hidden min-h-[360px] flex items-center px-6 sm:px-12 py-12 border border-neutral-850 shadow-md group"
              >
                {/* Background high fidelity generated coffee art */}
                <div className="absolute inset-0 z-0">
                  <div className="absolute inset-0 bg-neutral-950/60 z-10 backdrop-brightness-75 transition-all duration-700" />
                  <img
                    src={IMAGES.hero}
                    alt="Coffee Shop Barista Bar"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover select-none scale-100 group-hover:scale-105 transition-transform duration-[4000ms] ease-out"
                  />
                  {/* Subtle vignette gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/30 z-10" />
                </div>

                {/* Hero information content */}
                <div className="relative z-20 max-w-lg space-y-5 text-white">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 animate-pulse fill-amber-400/20" />
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#d8be9a]">
                      UAE SPECIALTY HERITAGE & SLOW BAR
                    </span>
                  </div>

                  <h1 className="text-4xl sm:text-5xl font-serif font-semibold tracking-tight italic leading-tight">
                    Premium Roasts, <br />
                    steeped with presence.
                  </h1>

                  <p className="text-sm sm:text-base text-neutral-300 font-sans leading-relaxed">
                    Sourcing ultra-exceptional Yemeni Haraz and sun-dried Geisha microlots naturally tailored for the Arabian palate. Impeccably crafted for absolute tranquility.
                  </p>

                  <div className="pt-2 flex flex-wrap gap-3">
                    <a
                      id="hero-scroll-btn"
                      href="#categories-scroll"
                      className="px-6 py-3 bg-[#8c6239] hover:bg-[#a97b4f] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                    >
                      Explore Menu
                    </a>
                    <button
                      id="hero-locator-btn"
                      onClick={() => setActiveTab('locator')}
                      className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold uppercase tracking-wider backdrop-blur-md transition-colors cursor-pointer border border-white/15"
                    >
                      Find Boutique
                    </button>
                  </div>
                </div>
              </div>

              {/* Coffee Menu Grid and items section */}
              <MenuSection onSelectItem={(item) => setSelectedItem(item)} />
            </motion.div>
          )}

          {activeTab === 'locator' && (
            <motion.div
              id="locator-tab-view"
              key="locator-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <StoreLocator />
            </motion.div>
          )}

          {activeTab === 'checkout' && (
            <motion.div
              id="checkout-tab-view"
              key="checkout-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <CheckoutSection
                cart={cart}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onClearCart={handleClearCart}
                onNavigateToLocator={() => setActiveTab('locator')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Embedded Beverage Customizer Modal Drawer */}
      <CoffeeSelectorModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Bottom Footer Section */}
      <footer id="app-footer" className="bg-white border-t border-neutral-200/65 py-12 px-4 mt-16 text-neutral-500 text-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-neutral-900 flex items-center justify-center text-white font-serif text-[11px] font-bold">
              K
            </div>
            <span className="font-serif text-sm font-semibold tracking-wide text-neutral-800">
              KÁHWA ATELIER
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono font-semibold uppercase text-[#8c6239]">
            <button onClick={() => setActiveTab('menu')} className="hover:text-neutral-950 transition-colors cursor-pointer">Káhwa & Brews</button>
            <button onClick={() => setActiveTab('locator')} className="hover:text-neutral-950 transition-colors cursor-pointer">Ateliers</button>
            <button onClick={() => setActiveTab('checkout')} className="hover:text-neutral-950 transition-colors cursor-pointer">Checkout Bag</button>
          </div>

          <div className="text-center md:text-right space-y-1">
            <p className="text-xs font-sans">
              Designed with precision • {new Date().getFullYear()} KÁHWA Specialty Atelier, Dubai, UAE.
            </p>
            <p className="text-[10px] text-neutral-400 font-mono">
              Ancient Yemeni Terroirs & Geisha Micro-Lots • 100% Specialty Arabica
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
