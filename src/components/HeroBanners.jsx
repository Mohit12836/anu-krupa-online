import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Car, 
  FileText, 
  Sparkles,
  MessageCircle
} from 'lucide-react';
import { HERO_SLIDES, SIDE_BANNERS } from '../data/bannersData';
import { createWhatsAppInquiryLink } from '../data/businessConfig';
import { useStore } from '../context/StoreContext';

export default function HeroBanners({ onSelectCategory, onOpenGuided }) {
  const { heroSlides: storeSlides } = useStore();
  const slides = storeSlides && storeSlides.length > 0 ? storeSlides : HERO_SLIDES;
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto advance slide every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide] || slides[0];

  return (
    <section className="relative py-4 md:py-6 overflow-hidden bg-gradient-to-b from-slate-100 to-white">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none animate-ambient" />
      <div className="absolute top-1/2 right-10 w-80 h-80 bg-orange-400/10 rounded-full blur-3xl pointer-events-none animate-ambient" />

      <div className="fluid-container">
        {/* Main 2-Column Responsive Layout matching reference image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5 items-stretch">
          
          {/* Left Main Hero Slide (occupies 8 columns on large screens) */}
          <div className="lg:col-span-8 relative rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 bg-slate-900 min-h-[380px] sm:min-h-[420px] md:min-h-[440px] flex flex-col justify-between transition-all">
            
            {/* Background Image with Dark & Emerald Overlay */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-all duration-700 transform scale-105"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent sm:to-slate-950/40" />
              <div className="absolute inset-0 bg-emerald-950/20 mix-blend-multiply" />
            </div>

            {/* Top Badge */}
            <div className="relative z-10 p-5 md:p-8 pb-0">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                <span>{slide.badge}</span>
              </div>
            </div>

            {/* Center Content Text */}
            <div className="relative z-10 px-5 md:px-8 py-3 max-w-xl">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight tracking-tight drop-shadow-md">
                {slide.titleHi}
              </h1>
              
              <p className="mt-2.5 text-xs sm:text-sm md:text-base font-semibold text-emerald-200/90 leading-relaxed drop-shadow">
                {slide.subtitleHi}
              </p>

              {/* 4 Green Pill Features */}
              <div className="mt-4 sm:mt-5 grid grid-cols-2 gap-2 text-[11px] sm:text-xs">
                {slide.featuresHi.map((feat, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-600/40 px-2.5 py-1.5 rounded-lg text-emerald-100 backdrop-blur-sm shadow-sm"
                  >
                    <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                    </div>
                    <span className="font-medium truncate">{feat}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onSelectCategory(slide.actionCategoryId)}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-orange-500/25 flex items-center gap-2 tap-bounce transition-all"
                >
                  <span>{slide.ctaTextHi}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onOpenGuided}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-xs sm:text-sm rounded-xl backdrop-blur-sm flex items-center gap-2 tap-bounce transition-all"
                >
                  <span>PhonePe जैसा आसान 2-टैप चुनाव</span>
                </button>
              </div>
            </div>

            {/* Bottom Controls (Dots & Arrows) */}
            <div className="relative z-10 p-5 md:p-8 pt-0 flex items-center justify-between">
              {/* Pagination Dots */}
              <div className="flex items-center gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-2 rounded-full transition-all ${
                      currentSlide === i ? 'w-6 bg-orange-400' : 'w-2 bg-white/40 hover:bg-white/60'
                    }`}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>

              {/* Prev / Next Arrows */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                  className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm border border-white/10 transition-colors"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                  className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm border border-white/10 transition-colors"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Right Side Stacked Promo Banners (4 columns on desktop matching reference image) */}
          <div className="lg:col-span-4 flex flex-col gap-4 justify-between">
            {SIDE_BANNERS.map((banner) => (
              <div
                key={banner.id}
                onClick={() => onSelectCategory(banner.categoryId)}
                className={`relative flex-1 rounded-2xl p-4 sm:p-5 border ${banner.borderColor} bg-gradient-to-br ${banner.bgGradient} shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between group tap-bounce`}
              >
                {/* Floating Image / Mockup on the right */}
                <div className="absolute right-[-10px] bottom-[-10px] w-36 h-36 sm:w-40 sm:h-40 rounded-xl overflow-hidden opacity-90 group-hover:scale-105 transition-transform duration-300 pointer-events-none">
                  <img 
                    src={banner.image} 
                    alt={banner.titleHi}
                    className="w-full h-full object-cover rounded-xl shadow"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent" />
                </div>

                <div className="relative z-10 max-w-[65%]">
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-orange-600 transition-colors leading-snug">
                    {banner.titleHi}
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 font-medium leading-relaxed">
                    {banner.descHi}
                  </p>
                </div>

                <div className="relative z-10 mt-4">
                  <button 
                    type="button"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-orange-500 group-hover:bg-orange-600 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
                  >
                    <span>{banner.ctaHi}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
