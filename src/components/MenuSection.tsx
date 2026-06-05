/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MenuItem } from '../types';
import { MENU_ITEMS } from '../data';
import { Coffee, Snowflake, Sparkles, Filter, Leaf, ChevronRight } from 'lucide-react';

interface MenuSectionProps {
  onSelectItem: (item: MenuItem) => void;
}

const CATEGORIES = [
  { id: 'all', label: 'All slow brews', icon: Sparkles },
  { id: 'espresso', label: 'Classic Espresso', icon: Coffee },
  { id: 'cold_craft', label: 'Cold Crafts', icon: Snowflake },
  { id: 'filter', label: 'Slow Filters', icon: Filter },
  { id: 'beans', label: 'Curated Beans', icon: Leaf },
];

export default function MenuSection({ onSelectItem }: MenuSectionProps) {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredItems = activeCategory === 'all'
    ? MENU_ITEMS
    : MENU_ITEMS.filter((item) => item.category === activeCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } },
  };

  return (
    <div id="menu-section-container" className="py-8">
      {/* Search and Category Filters */}
      <div className="flex flex-col gap-6 mb-12">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-mono tracking-widest text-[#8c6239] font-semibold">
              Curated Brews & Roasts
            </span>
            <h2 className="text-3xl font-serif text-neutral-900 mt-1 italic font-medium">
              Sip slowly, stay present.
            </h2>
          </div>
        </div>

        {/* Categories Scroller */}
        <div id="categories-scroll" className="flex items-center gap-2 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const IconComponent = cat.icon;
            const isActive = activeCategory === cat.id;

            return (
              <button
                id={`cat-tab-${cat.id}`}
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-300 whitespace-nowrap text-sm cursor-pointer ${
                  isActive
                    ? 'bg-neutral-900 border-neutral-900 text-white shadow-sm'
                    : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900'
                }`}
              >
                <IconComponent className={`w-4 h-4 ${isActive ? 'text-white' : 'text-neutral-400'}`} />
                <span className="font-sans font-medium">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Coffee Menu Items */}
      <motion.div
        id="menu-items-grid"
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.div
              id={`menu-card-${item.id}`}
              key={item.id}
              layout
              variants={itemVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, scale: 0.95 }}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="group bg-white rounded-2xl border border-neutral-200/90 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col h-full"
            >
              {/* Product Thumbnail Frame */}
              <div id={`image-frame-${item.id}`} className="relative h-56 bg-neutral-50 overflow-hidden border-b border-neutral-100">
                <img
                  src={item.image}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                
                {/* Visual Accent Pills over Image */}
                <div className="absolute top-4 left-4 flex gap-1.5 flex-wrap">
                  <span className="px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase font-mono bg-white/90 backdrop-blur-md text-neutral-800 rounded-full border border-neutral-200/50">
                    {item.category.replace('_', ' ')}
                  </span>
                  {item.origin && (
                    <span className="px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase font-mono bg-[#8c6239]/90 text-white rounded-full">
                      {item.origin.split(',')[0]}
                    </span>
                  )}
                </div>

                <div className="absolute top-4 right-4 animate-fade-in">
                  <span className="px-3 py-1.5 bg-neutral-900/90 backdrop-blur-md text-white font-mono text-xs font-bold rounded-lg border border-neutral-800 shadow-sm">
                    AED {item.price.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Content Panel */}
              <div id={`details-${item.id}`} className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-serif text-neutral-900 group-hover:text-[#8c6239] transition-colors duration-300">
                    {item.name}
                  </h3>
                  
                  {/* Notes & Roast Level indicators */}
                  <div className="flex items-center gap-3 mt-2 text-xs font-mono text-neutral-500">
                    {item.roastLevel && (
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8c6239]" />
                        {item.roastLevel} Roast
                      </span>
                    )}
                    {item.origin && (
                      <span className="text-neutral-400 font-sans italic text-[11px]">
                        Single Origin
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-neutral-500 font-sans mt-3 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Flavor Taste Tags */}
                  {item.notes && item.notes.length > 0 && (
                    <div id={`notes-list-${item.id}`} className="flex flex-wrap gap-1.5 mt-4">
                      {item.notes.map((note, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 rounded text-[11px] font-sans text-neutral-600 bg-neutral-100 border border-neutral-200/50"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <button
                    id={`customize-trigger-${item.id}`}
                    onClick={() => onSelectItem(item)}
                    className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 hover:border-neutral-400 text-sm font-medium text-neutral-800 transition-all duration-300 group/btn"
                  >
                    <span>{item.category === 'beans' ? 'Select Grind' : 'Customize & Add'}</span>
                    <ChevronRight className="w-4 h-4 text-neutral-400 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
