import React from 'react';
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
  LayoutGrid
} from 'lucide-react';
import { CATEGORIES } from '../data/categoriesData';

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
  LayoutGrid
};

export default function CategoryGrid({ selectedCategory, onSelectCategory }) {
  // Exclude 'all' from the 9 quick visual icon cards to match reference layout
  const gridCategories = CATEGORIES.filter(c => c.id !== 'all');

  return (
    <section className="py-4 md:py-6 bg-white border-y border-slate-200/80">
      <div className="fluid-container">
        
        {/* Section Heading & All Services Toggle */}
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>सर्विस श्रेणियां</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                1-टैप चुनाव
              </span>
            </h2>
          </div>

          {selectedCategory !== 'all' && (
            <button
              onClick={() => onSelectCategory('all')}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg border border-orange-200 transition-colors tap-bounce"
            >
              सभी सेवाएं देखें ✕
            </button>
          )}
        </div>

        {/* 9 Categories Responsive Auto-Fit Grid matching reference image */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-2.5 sm:gap-3">
          {gridCategories.map((cat) => {
            const IconComponent = iconMap[cat.icon] || LayoutGrid;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(isSelected ? 'all' : cat.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-200 tap-bounce group relative ${
                  isSelected
                    ? 'bg-orange-50 border-orange-500 shadow-md ring-2 ring-orange-500/20'
                    : 'bg-white hover:bg-slate-50 border-slate-200/90 hover:border-slate-300 shadow-sm'
                }`}
              >
                {/* Icon Circle */}
                <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-2 transition-transform duration-200 group-hover:scale-105 ${
                  isSelected 
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30' 
                    : 'bg-slate-100 text-slate-700 group-hover:bg-slate-200/80'
                }`}>
                  <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>

                {/* Category Title */}
                <span className={`text-[11px] sm:text-xs font-bold leading-snug line-clamp-2 transition-colors ${
                  isSelected ? 'text-orange-600 font-extrabold' : 'text-slate-800 group-hover:text-slate-950'
                }`}>
                  {cat.nameHi}
                </span>

                {/* Active indicator dot */}
                {isSelected && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-white ring-1 ring-orange-500" />
                )}
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}
