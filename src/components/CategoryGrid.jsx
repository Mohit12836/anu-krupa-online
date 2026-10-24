import React, { useState } from 'react';
import { 
  Sprout, 
  Landmark, 
  Car, 
  Briefcase, 
  FileBadge, 
  Users, 
  Lightbulb, 
  Printer, 
  MoreHorizontal,
  LayoutGrid,
  CreditCard,
  Image,
  Stamp,
  Globe,
  ShoppingBag,
  MapPin,
  Smartphone,
  Zap,
  Droplets,
  Sun,
  BadgeCheck,
  Sparkles,
  Award
} from 'lucide-react';
import { CATEGORIES, MACRO_VERTICALS } from '../data/categoriesData';

const iconMap = {
  Sprout,
  Landmark,
  Car,
  Briefcase,
  FileBadge,
  Users,
  Lightbulb,
  Printer,
  MoreHorizontal,
  LayoutGrid,
  CreditCard,
  Image,
  Stamp,
  Globe,
  ShoppingBag,
  MapPin,
  Smartphone,
  Zap,
  Droplets,
  Sun,
  BadgeCheck,
};

export default function CategoryGrid({ 
  selectedCategory, 
  onSelectCategory, 
  selectedVertical = 'all', 
  onSelectVertical,
  onOpenPartnerModal 
}) {
  const [internalVertical, setInternalVertical] = useState('all');

  const activeVertical = onSelectVertical ? selectedVertical : internalVertical;
  const setActiveVertical = (vertId) => {
    if (onSelectVertical) {
      onSelectVertical(vertId);
    } else {
      setInternalVertical(vertId);
    }
    // When macro vertical changes, reset category filter to 'all' or first subcategory
    onSelectCategory('all');
  };

  // 5 Core Macro Verticals excluding 'all' for quick tabs
  const displayVerticals = MACRO_VERTICALS.filter(v => v.id !== 'all');

  // Subcategories to show based on selected vertical
  const activeSubcategories = activeVertical === 'all'
    ? CATEGORIES.filter(c => c.id !== 'all')
    : CATEGORIES.filter(c => c.verticalId === activeVertical);

  return (
    <section className="py-4 md:py-6 bg-white border-y border-slate-200/80">
      <div className="fluid-container">
        
        {/* Tier 1: Macro Verticals Header & Work From Home Invite */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3.5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg md:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>मुख्य सेवा एवं उत्पाद वर्ग</span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                  5 मुख्य विभाग
                </span>
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              MPOnline, प्रिंटिंग उत्पाद, वेबसाइट व सोलर में से अपना विभाग चुनें
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Work From Home Partner Button */}
            {onOpenPartnerModal && (
              <button
                onClick={onOpenPartnerModal}
                className="text-xs font-extrabold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl border border-indigo-200 flex items-center gap-1.5 shadow-sm tap-bounce transition-colors"
                title="Work From Home पार्टनर बनें और कमीशन कमाएं"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>पार्टनर बनें (20%-50% कमीशन)</span>
              </button>
            )}

            {(activeVertical !== 'all' || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setActiveVertical('all');
                  onSelectCategory('all');
                }}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors tap-bounce"
              >
                सभी देखें ✕
              </button>
            )}
          </div>
        </div>

        {/* Tier 1 Grid: 5 Macro Verticals Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3 mb-4">
          {displayVerticals.map((vert) => {
            const IconComponent = iconMap[vert.icon] || LayoutGrid;
            const isSelected = activeVertical === vert.id;

            return (
              <button
                key={vert.id}
                onClick={() => setActiveVertical(isSelected ? 'all' : vert.id)}
                className={`p-3 rounded-2xl border text-left transition-all duration-200 tap-bounce group relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-br from-orange-50 to-amber-50/60 border-orange-500 shadow-md ring-2 ring-orange-500/20'
                    : 'bg-white hover:bg-slate-50 border-slate-200/90 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105 ${
                    isSelected 
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30' 
                      : 'bg-slate-100 text-slate-700 group-hover:bg-slate-200/80'
                  }`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {vert.badge}
                  </span>
                </div>

                <div>
                  <h3 className={`text-xs sm:text-sm font-extrabold leading-tight ${
                    isSelected ? 'text-orange-950 font-black' : 'text-slate-900 group-hover:text-black'
                  }`}>
                    {vert.nameHi}
                  </h3>
                  <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                    {vert.description}
                  </p>
                </div>

                {isSelected && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-white ring-1 ring-orange-500" />
                )}
              </button>
            );
          })}
        </div>

        {/* Tier 2: Subcategory Pills / Chips under selected vertical */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
            <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap pl-1 pr-2">
              उप-श्रेणी:
            </span>

            <button
              onClick={() => onSelectCategory('all')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all tap-bounce ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              सभी ({activeSubcategories.length})
            </button>

            {activeSubcategories.map((cat) => {
              const SubIcon = iconMap[cat.icon] || LayoutGrid;
              const isCatSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(isCatSelected ? 'all' : cat.id)}
                  className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all tap-bounce ${
                    isCatSelected
                      ? 'bg-orange-500 text-white shadow-sm font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <SubIcon className="w-3.5 h-3.5" />
                  <span>{cat.nameHi}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
