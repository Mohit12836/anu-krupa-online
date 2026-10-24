import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { PROMO_CARDS } from '../data/bannersData';

export default function PromoStrip({ onSelectCategory }) {
  return (
    <section className="py-4 md:py-6 bg-white border-y border-slate-200/80">
      <div className="fluid-container">
        
        {/* 3 Highlight Promo Cards matching reference design */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 md:gap-4">
          {PROMO_CARDS.map((promo) => (
            <div
              key={promo.id}
              onClick={() => onSelectCategory(promo.categoryId)}
              className={`relative rounded-2xl p-4 sm:p-5 bg-gradient-to-br ${promo.gradient} border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden flex flex-col justify-between group tap-bounce`}
            >
              {/* Background Thumbnail preview */}
              <div className="absolute right-[-10px] top-[-10px] bottom-[-10px] w-28 sm:w-32 opacity-25 group-hover:opacity-40 transition-opacity pointer-events-none overflow-hidden rounded-r-2xl">
                <img
                  src={promo.image}
                  alt={promo.titleHi}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="relative z-10">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                  {promo.tagHi}
                </span>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug group-hover:text-orange-600 transition-colors">
                  {promo.titleHi}
                </h3>
              </div>

              <div className="relative z-10 mt-4">
                <button
                  type="button"
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-transform group-hover:scale-102 ${promo.accent}`}
                >
                  <span>{promo.ctaHi}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
