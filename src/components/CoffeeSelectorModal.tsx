/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MenuItem } from '../types';
import { X, Check, Coffee, Zap } from 'lucide-react';

interface CoffeeSelectorModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (
    item: MenuItem,
    customization: {
      milk?: string;
      temperature?: string;
      size?: string;
      extraShots?: boolean;
      sweetness?: string;
    }
  ) => void;
}

export default function CoffeeSelectorModal({ item, onClose, onAddToCart }: CoffeeSelectorModalProps) {
  const [selectedMilk, setSelectedMilk] = useState('');
  const [selectedTemp, setSelectedTemp] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [extraShots, setExtraShots] = useState(false);
  const [selectedSweetness, setSelectedSweetness] = useState('');

  // Auto-load default values when menu item updates
  useEffect(() => {
    if (item) {
      setSelectedMilk(item.customizationOptions?.milk?.[0] || '');
      setSelectedTemp(item.customizationOptions?.temperature?.[0] || '');
      setSelectedSize(item.customizationOptions?.size?.[0] || '');
      setSelectedSweetness(item.customizationOptions?.sweetness?.[0] || '');
      setExtraShots(false);
    }
  }, [item]);

  if (!item) return null;

  // Extra shot adds a small premium
  const extraCost = extraShots ? 4.00 : 0;
  const currentTotal = item.price + extraCost;

  const handleConfirm = () => {
    onAddToCart(item, {
      milk: selectedMilk || undefined,
      temperature: selectedTemp || undefined,
      size: selectedSize || undefined,
      extraShots: extraShots || undefined,
      sweetness: selectedSweetness || undefined,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div id="modal-wrapper" className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          id="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-neutral-900/40 backdrop-blur-md"
        />

        {/* Modal Sheet body */}
        <motion.div
          id="modal-card"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
          className="relative bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-xl border border-neutral-200/90 z-10 flex flex-col max-h-[90vh]"
        >
          {/* Header row */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <Coffee className="w-5 h-5 text-[#8c6239]" />
              <span className="font-mono text-xs uppercase tracking-wider text-neutral-500 font-semibold">
                Custom Brew Lab
              </span>
            </div>
            <button
              id="close-modal-btn"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto p-6 space-y-6 flex-1">
            {/* Short preview header */}
            <div className="flex gap-4">
              <img
                src={item.image}
                alt={item.name}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-xl object-cover border border-neutral-100"
              />
              <div>
                <h4 className="text-xl font-serif text-neutral-900">{item.name}</h4>
                <p className="text-xs text-[#8c6239] font-mono mt-0.5">
                  Base Price: AED {item.price.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Customization Controls */}
            {item.customizationOptions?.temperature && (
              <div id="opt-temperature" className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-semibold block">
                  Temperature Profile
                </span>
                <div className="flex gap-2">
                  {item.customizationOptions.temperature.map((temp) => (
                    <button
                      id={`temp-btn-${temp}`}
                      key={temp}
                      onClick={() => setSelectedTemp(temp)}
                      className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                        selectedTemp === temp
                          ? 'border-neutral-900 bg-neutral-900 text-white'
                          : 'border-neutral-200 hover:border-neutral-400 text-neutral-700 bg-white'
                      }`}
                    >
                      {temp}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {item.customizationOptions?.size && (
              <div id="opt-size" className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-semibold block">
                  Pour Volume / Size
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {item.customizationOptions.size.map((sz) => (
                    <button
                      id={`size-btn-${sz}`}
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`py-2.5 px-4 rounded-xl border text-xs font-medium transition-all text-left flex items-center justify-between cursor-pointer ${
                        selectedSize === sz
                          ? 'border-neutral-900 bg-neutral-900 text-white'
                          : 'border-neutral-200 hover:border-neutral-400 text-neutral-700 bg-white'
                      }`}
                    >
                      <span>{sz}</span>
                      {selectedSize === sz && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {item.customizationOptions?.milk && (
              <div id="opt-milk" className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-semibold block">
                  Dairy / Alternative Milk
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {item.customizationOptions.milk.map((mlk) => (
                    <button
                      id={`milk-btn-${mlk}`}
                      key={mlk}
                      onClick={() => setSelectedMilk(mlk)}
                      className={`py-2.5 px-4 rounded-xl border text-xs font-medium transition-all text-left flex items-center justify-between cursor-pointer ${
                        selectedMilk === mlk
                          ? 'border-neutral-900 bg-neutral-900/95 text-white'
                          : 'border-neutral-200 hover:border-neutral-400 text-neutral-700 bg-white'
                      }`}
                    >
                      <span>{mlk}</span>
                      {selectedMilk === mlk && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {item.customizationOptions?.sweetness && (
              <div id="opt-sweetness" className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-semibold block">
                  Sweetener Level
                </span>
                <div className="flex gap-1 bg-neutral-50 p-1 rounded-xl border border-neutral-200/60">
                  {item.customizationOptions.sweetness.map((sw) => (
                    <button
                      id={`sweet-btn-${sw}`}
                      key={sw}
                      onClick={() => setSelectedSweetness(sw)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        selectedSweetness === sw
                          ? 'bg-white border-neutral-200 text-neutral-950 font-semibold shadow-sm'
                          : 'text-neutral-500 hover:text-neutral-900'
                      }`}
                    >
                      {sw}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {item.customizationOptions?.extraShots && (
              <div id="opt-shots" className="pt-2">
                <label className="flex items-center justify-between p-4 bg-neutral-50/50 hover:bg-neutral-50 rounded-2xl border border-neutral-200/80 cursor-pointer transition-all">
                  <div className="flex items-center gap-3">
                    <Zap className={`w-4 h-4 ${extraShots ? 'text-[#8c6239] fill-[#8c6239]/20' : 'text-neutral-400'}`} />
                    <div>
                      <span className="text-sm font-sans font-medium text-neutral-800 block">
                        Extra Sweet Ristretto Shot
                      </span>
                      <span className="text-xs text-neutral-400 block font-normal">
                        Drawn tight for rich hazelnut core extraction
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-medium text-neutral-500">+AED 4.00</span>
                    <input
                      id="extra-shots-checkbox"
                      type="checkbox"
                      checked={extraShots}
                      onChange={(e) => setExtraShots(e.target.checked)}
                      className="w-4.5 h-4.5 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 focus:ring-offset-0 accent-neutral-900"
                    />
                  </div>
                </label>
              </div>
            )}
          </div>

          {/* Footer Action row */}
          <div className="p-6 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest block font-semibold">
                Brew Price
              </span>
              <span className="text-2xl font-mono font-bold text-neutral-900">
                AED {currentTotal.toFixed(2)}
              </span>
            </div>
            
            <button
              id="confirm-blend-btn"
              onClick={handleConfirm}
              className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-sm font-medium transition-colors duration-200 shadow-sm cursor-pointer"
            >
              Confirm blend
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
