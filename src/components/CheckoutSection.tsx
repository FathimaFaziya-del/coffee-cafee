/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, Voucher } from '../types';
import VoucherInput from './VoucherInput';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  Receipt, 
  ArrowLeft, 
  Sparkles,
  Flame,
  Gauge,
  Clock,
  MapPin,
  Barcode,
  Volume2
} from 'lucide-react';

interface CheckoutSectionProps {
  cart: CartItem[];
  onUpdateQuantity: (cartId: string, delta: number) => void;
  onRemoveItem: (cartId: string) => void;
  onClearCart: () => void;
  onNavigateToLocator: () => void;
}

export default function CheckoutSection({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onNavigateToLocator,
}: CheckoutSectionProps) {
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [orderStage, setOrderStage] = useState<'idle' | 'grinding' | 'brewing' | 'steaming' | 'ready'>('idle');
  const [stageProgress, setStageProgress] = useState(0);

  // Subtotal calculations
  const subtotal = cart.reduce((acc, item) => {
    let itemPrice = item.menuItem.price;
    if (item.customization.extraShots) {
      itemPrice += 4.00; // PREMIUM extra shot in AED
    }
    return acc + itemPrice * item.quantity;
  }, 0);

  // Apply Voucher discounts
  let discount = 0;
  if (appliedVoucher) {
    if (appliedVoucher.type === 'percentage') {
      // If code is DXB20, discount only applies to category espresso
      if (appliedVoucher.code === 'DXB20') {
        const espressoSubtotal = cart.reduce((acc, item) => {
          if (item.menuItem.category === 'espresso') {
            const price = item.menuItem.price + (item.customization.extraShots ? 4.00 : 0);
            return acc + price * item.quantity;
          }
          return acc;
        }, 0);
        discount = espressoSubtotal * (appliedVoucher.value / 100);
      } else if (appliedVoucher.code === 'HILAL15') {
        // filter category
        const filterSubtotal = cart.reduce((acc, item) => {
          if (item.menuItem.category === 'filter') {
            const price = item.menuItem.price;
            return acc + price * item.quantity;
          }
          return acc;
        }, 0);
        discount = filterSubtotal * (appliedVoucher.value / 100);
      } else {
        discount = subtotal * (appliedVoucher.value / 100);
      }
    } else {
      discount = appliedVoucher.value;
    }
  }

  const taxRate = 0.05; // 5% UAE VAT rate
  const discountedSubtotal = Math.max(0, subtotal - discount);
  const tax = discountedSubtotal * taxRate;
  const totalPrice = discountedSubtotal + tax;

  const handleApplyVoucher = (voucher: Voucher | null) => {
    setAppliedVoucher(voucher);
  };

  const startOrderSimulation = () => {
    if (cart.length === 0) return;
    
    // Begin step-by-step animation progress
    setOrderStage('grinding');
    setStageProgress(10);
    
    const interval = setInterval(() => {
      setStageProgress((prev) => {
        if (prev >= 100) {
          // Progress stages
          setOrderStage((currentStage) => {
            if (currentStage === 'grinding') {
              setTimeout(() => setStageProgress(15), 100);
              return 'brewing';
            }
            if (currentStage === 'brewing') {
              setTimeout(() => setStageProgress(15), 100);
              return 'steaming';
            }
            if (currentStage === 'steaming') {
              clearInterval(interval);
              setTimeout(() => {
                onClearCart(); // empty cart to simulate final order state placement
              }, 600);
              return 'ready';
            }
            return currentStage;
          });
          return 0;
        }
        return prev + 15;
      });
    }, 450);
  };

  // Render simulated tracker screen
  if (orderStage !== 'idle') {
    return (
      <div id="tracker-pane" className="max-w-2xl mx-auto bg-[#faf9f6]/40 border border-neutral-200/80 rounded-3xl p-8 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        {orderStage !== 'ready' ? (
          <div id="active-brewing-screens" className="text-center py-12 space-y-10">
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#8c6239] px-3.5 py-1.5 bg-[#f5efe6] rounded-full">
                Order status: Live blend
              </span>
              <h2 className="text-3xl font-serif text-neutral-900 mt-4 italic">
                Brewing your perfect infusion...
              </h2>
            </div>

            {/* Animation Frames */}
            <div className="flex justify-center relative my-10">
              <AnimatePresence mode="wait">
                {orderStage === 'grinding' && (
                  <motion.div
                    id="stage-grinding"
                    key="grinding"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex flex-col items-center space-y-4"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                      className="w-24 h-24 rounded-full border-4 border-dashed border-[#8c6239] flex items-center justify-center bg-white shadow-md"
                    >
                      <Sparkles className="w-10 h-10 text-[#8c6239]/80" />
                    </motion.div>
                    <div className="text-center">
                      <p className="font-mono text-sm uppercase tracking-wider text-neutral-800 font-bold">
                        Coffee Grinder Unit #04
                      </p>
                      <p className="text-xs text-neutral-500 mt-1 font-sans">
                        Slicing single-origin heirloom cherries to 450 microns...
                      </p>
                    </div>
                  </motion.div>
                )}

                {orderStage === 'brewing' && (
                  <motion.div
                    id="stage-brewing"
                    key="brewing"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex flex-col items-center space-y-4"
                  >
                    <div className="w-24 h-24 rounded-full border-4 border-neutral-900/5 flex items-center justify-center bg-white shadow-md relative">
                      <motion.div 
                        animate={{ y: [0, 8, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                        className="text-neutral-800"
                      >
                        <Flame className="w-10 h-10 text-[#8c6239] fill-[#8c6239]/10" />
                      </motion.div>
                      <div className="absolute top-1 right-1 bg-neutral-900 text-[10px] text-white px-1.5 py-0.5 rounded font-mono font-bold">
                        93.5°C
                      </div>
                    </div>
                    <div>
                      <p className="font-mono text-sm uppercase tracking-wider text-neutral-800 font-bold flex items-center justify-center gap-1.5">
                        <Gauge className="w-4 h-4 text-neutral-400" />
                        Espresso Extract Pressure
                      </p>
                      <p className="text-xs text-neutral-500 mt-1 font-sans">
                        Infusing under 9 bars of constant water vapor velocity...
                      </p>
                    </div>
                  </motion.div>
                )}

                {orderStage === 'steaming' && (
                  <motion.div
                    id="stage-steaming"
                    key="steaming"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex flex-col items-center space-y-4"
                  >
                    <div className="w-24 h-24 rounded-full border-4 border-neutral-900/5 flex items-center justify-center bg-white shadow-md relative">
                      <motion.div
                        animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                        className="text-neutral-800"
                      >
                        <Volume2 className="w-10 h-10 text-neutral-800" />
                      </motion.div>
                    </div>
                    <div>
                      <p className="font-mono text-sm uppercase tracking-wider text-neutral-800 font-bold">
                        Velvet Micro-Foaming
                      </p>
                      <p className="text-xs text-neutral-500 mt-1 font-sans">
                        Structuring temperature to 65°C for sweet lactose breakdown...
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Simulated progress slider bar */}
            <div id="progress-meter" className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-neutral-500">
                <span>STAGE: {orderStage.toUpperCase()}</span>
                <span>{stageProgress}%</span>
              </div>
              <div className="w-full h-2 bg-neutral-200/60 rounded-full overflow-hidden border border-neutral-200">
                <motion.div
                  className="h-full bg-neutral-900 rounded-full"
                  animate={{ width: `${stageProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </div>
        ) : (
          <motion.div
            id="stage-ready"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-10 space-y-8"
          >
            {/* Visual Header Success Card */}
            <div className="text-center space-y-3">
              <span className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mx-auto text-xl font-bold">
                ✓
              </span>
              <h3 className="text-3xl font-serif text-neutral-900 font-medium">
                Ready for Pickup!
              </h3>
              <p className="text-sm text-neutral-500 font-sans max-w-sm mx-auto">
                Your bespoke slow coffee blend is waiting on the pour-over counter Barista shelf at the Jumeirah Pavilion.
              </p>
            </div>

            {/* Custom Digital Receipt */}
            <div className="border border-neutral-200 bg-white rounded-2xl p-6 shadow-sm space-y-6 relative overflow-hidden">
              <div className="w-full h-2 bg-neutral-950 absolute top-0 left-0" />
              
              <div className="flex justify-between items-start border-b border-neutral-100 pb-5">
                <div>
                  <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold">
                    ORDER SERIAL
                  </span>
                  <p className="font-mono text-sm font-semibold text-neutral-800 mt-0.5">
                    #KHW-798-COFFEE
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold">
                    PICKUP TIME
                  </span>
                  <p className="text-sm font-sans font-semibold text-neutral-800 mt-0.5 flex items-center gap-1 justify-end">
                    <Clock className="w-3.5 h-3.5 text-neutral-500" />
                    Now (15 mins fresh grace)
                  </p>
                </div>
              </div>

              {/* Locator Directions Helper */}
              <div className="flex items-start gap-3 bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                <MapPin className="w-5 h-5 text-[#8c6239] shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-semibold text-neutral-800 font-sans block">
                    KÁHWA Specialty Pavilion - Jumeirah
                  </span>
                  <p className="text-[11px] text-neutral-500 font-sans mt-0.5">
                    742 Jumeirah Beach Road, Dubai, UAE
                  </p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2">
                    <button
                      id="find-cafe-btn"
                      onClick={onNavigateToLocator}
                      className="text-xs text-[#8c6239] hover:text-neutral-900 font-mono font-bold flex items-center gap-1 focus:outline-none cursor-pointer"
                    >
                      Open Blueprint Map & Directions →
                    </button>
                    <span className="text-neutral-300 text-xs hidden sm:inline">•</span>
                    <a
                      href="https://maps.app.goo.gl/UvZzSR4YbXitj9KVA"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-neutral-500 hover:text-neutral-900 font-mono font-bold flex items-center gap-0.5 focus:outline-none cursor-pointer"
                    >
                      Open in Google Maps ↗
                    </a>
                  </div>
                </div>
              </div>

              {/* Barcode details */}
              <div className="pt-2 flex flex-col items-center justify-center border-t border-neutral-100">
                <Barcode className="w-48 h-12 text-neutral-800 stroke-[1.25]" />
                <span className="text-[10px] font-mono text-neutral-400 mt-2 tracking-widest">
                  *97143881920*
                </span>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <button
                id="reset-checkout-btn"
                onClick={() => setOrderStage('idle')}
                className="px-6 py-2.5 rounded-xl border border-neutral-200 bg-white text-sm font-medium hover:border-neutral-400 text-neutral-700 transition-colors cursor-pointer"
              >
                Back to Slow Brew Menu
              </button>
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  // Render empty cart state
  if (cart.length === 0) {
    return (
      <div id="empty-cart-state" className="text-center py-16 px-4 bg-white border border-neutral-200/80 rounded-3xl max-w-xl mx-auto shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="w-16 h-16 rounded-full bg-neutral-50 flex items-center justify-center mx-auto mb-6 border border-neutral-200/60">
          <ShoppingBag className="w-6 h-6 text-neutral-400" />
        </div>
        <h3 className="text-2xl font-serif text-neutral-900 font-medium italic">
          Empty Coffee Basket
        </h3>
        <p className="text-sm text-neutral-500 font-sans mt-2 max-w-sm mx-auto">
          Explore our artisan slow brews, whole estate beans, and cold nitro drafts to initiate an order.
        </p>
      </div>
    );
  }

  // Render checkout cart summary
  return (
    <div id="checkout-layout-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
      {/* List items section */}
      <div className="lg:col-span-7 space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-200/60 pb-4">
          <h3 className="text-xl font-serif text-neutral-900">
            Selected Beverages ({cart.length})
          </h3>
          <button
            id="clear-basket-btn"
            onClick={onClearCart}
            className="text-xs text-neutral-500 hover:text-[#8c6239] transition-colors flex items-center gap-1 cursor-pointer"
          >
            Clear list
          </button>
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {cart.map((item) => (
              <motion.div
                id={`cart-card-${item.cartId}`}
                key={item.cartId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex gap-4 p-4 border border-neutral-200/80 bg-white rounded-2xl relative shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
              >
                <img
                  src={item.menuItem.image}
                  alt={item.menuItem.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-neutral-100 shrink-0"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-serif text-base sm:text-lg text-neutral-950 font-medium leading-tight">
                        {item.menuItem.name}
                      </h4>
                      <span className="font-mono text-sm font-bold text-neutral-900 shrink-0">
                        AED {((item.menuItem.price + (item.customization.extraShots ? 4.00 : 0)) * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    {/* Options summary block */}
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-neutral-400 font-sans">
                      {item.customization.temperature && (
                        <span>Temp: {item.customization.temperature}</span>
                      )}
                      {item.customization.size && (
                        <span className="text-neutral-500">Vol: {item.customization.size}</span>
                      )}
                      {item.customization.milk && (
                        <span>Dairy: {item.customization.milk}</span>
                      )}
                      {item.customization.sweetness && (
                        <span>Sweetener: {item.customization.sweetness}</span>
                      )}
                      {item.customization.extraShots && (
                        <span className="text-[#8c6239] font-medium font-mono">
                          + Extra Espresso Shot
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity add subtract controls */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1.5 border border-neutral-200 rounded-lg p-0.5 bg-neutral-50">
                      <button
                        id={`qty-minus-${item.cartId}`}
                        onClick={() => onUpdateQuantity(item.cartId, -1)}
                        className="p-1 rounded-md text-neutral-500 hover:text-neutral-900 hover:bg-white transition-colors cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center text-xs font-mono font-bold text-neutral-900">
                        {item.quantity}
                      </span>
                      <button
                        id={`qty-plus-${item.cartId}`}
                        onClick={() => onUpdateQuantity(item.cartId, 1)}
                        className="p-1 rounded-md text-neutral-500 hover:text-neutral-900 hover:bg-white transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      id={`trash-btn-${item.cartId}`}
                      onClick={() => onRemoveItem(item.cartId)}
                      className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-neutral-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Bill summary and voucher card */}
      <div className="lg:col-span-5 space-y-6">
        <h3 className="text-xl font-serif text-neutral-900 border-b border-neutral-200/60 pb-4">
          Order Summary & Loyalty
        </h3>

        {/* Dynamic Coupon Card placeholder identical to the requested image layout */}
        <div id="voucher-card-wrapper" className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold block pl-1">
            Apply Rewards / Gift Card
          </span>
          <VoucherInput
            onApplyVoucher={handleApplyVoucher}
            appliedVoucher={appliedVoucher}
          />
        </div>

        {/* Detailed Bill Slip panel */}
        <div className="border border-neutral-200 bg-white rounded-2xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.015)] space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-500 font-semibold border-b border-neutral-100 pb-3">
            <Receipt className="w-4 h-4" />
            <span>Digital Ledger</span>
          </div>

          <div className="space-y-2.5 text-sm font-sans text-neutral-600">
            <div className="flex justify-between">
              <span>Items Total</span>
              <span className="font-mono text-neutral-900 font-medium">
                AED {subtotal.toFixed(2)}
              </span>
            </div>

            {appliedVoucher && (
              <div className="flex justify-between text-emerald-700">
                <span>Loyalty Reward ({appliedVoucher.code})</span>
                <span className="font-mono font-medium">-AED {discount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-neutral-400 text-xs italic">
              <span>UAE VAT (5%)</span>
              <span className="font-mono font-medium">AED {tax.toFixed(2)}</span>
            </div>

            <div className="border-t border-neutral-150 pt-3 flex justify-between text-base font-serif font-bold text-neutral-950">
              <span>Bill Due Total</span>
              <span className="font-mono text-lg">AED {totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <button
            id="order-payment-trigger"
            onClick={startOrderSimulation}
            className="w-full mt-4 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-center text-sm font-medium tracking-wide transition-all duration-300 shadow-sm cursor-pointer"
          >
            Confirm pickup order • AED {totalPrice.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
}
