import React from 'react';
import { MessageCircle, ArrowRight, FileText, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { createWhatsAppInquiryLink } from '../data/businessConfig';

export default function PopularServices({ selectedCategory, onSelectCategory, onSelectService }) {
  const { services, settings, recordInquiry } = useStore();

  // Filter only active services (exclude paused)
  const activeServices = services.filter(s => s.availability !== 'paused');

  // If a category is selected (and not 'all'), filter by that category.
  const displayedServices = selectedCategory === 'all'
    ? activeServices
    : activeServices.filter(s => s.categoryId === selectedCategory);

  return (
    <section id="services-section" className="py-6 sm:py-8 bg-slate-50">
      <div className="fluid-container">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                {selectedCategory === 'all' ? 'लोकप्रिय सेवाएं' : 'उपलब्ध सेवाएं'}
              </h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                {displayedServices.length} सेवाएं उपलब्ध
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              किसी भी सेवा पर टैप करके ज़रूरी दस्तावेज़ व सरकारी फीस देखें या सीधे WhatsApp पर पूछें
            </p>
          </div>

          {selectedCategory !== 'all' ? (
            <button
              onClick={() => onSelectCategory('all')}
              className="self-start sm:self-auto text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 hover:underline tap-bounce"
            >
              <span>सभी सेवाएं देखें</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="text-xs text-slate-400 font-medium">
              विश्वसनीय एवं पारदर्शी डिजिटल सेवा केंद्र
            </div>
          )}
        </div>

        {/* Services Responsive Auto-Fit Grid matching reference image cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {displayedServices.map((service) => {
            const firstOption = (service.options && service.options[0]) || (service.popularOptions && service.popularOptions[0]) || 'जानकारी';
            const whatsAppUrl = createWhatsAppInquiryLink({
              serviceName: service.nameHi,
              selectedOption: firstOption,
              whatsappNumber: settings.whatsappPhone,
            });

            return (
              <div
                key={service.id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group tap-bounce"
              >
                {/* Top Clickable Area to open Details Modal */}
                <div 
                  onClick={() => onSelectService(service)} 
                  className="cursor-pointer p-4 sm:p-5 pb-3"
                >
                  {/* Card Visual & Badge */}
                  <div className="relative h-40 sm:h-44 rounded-xl overflow-hidden mb-3.5 bg-slate-100">
                    <img
                      src={service.image}
                      alt={service.nameHi}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
                    
                    {/* Top Right Badge */}
                    <div className="absolute top-2.5 right-2.5">
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/95 text-slate-800 shadow-sm backdrop-blur-sm border border-slate-200/60">
                        {service.badge}
                      </span>
                    </div>

                    {/* Bottom overlay text */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-300 block">
                        {service.nameEn}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold leading-tight drop-shadow truncate">
                        {service.nameHi}
                      </h3>
                    </div>
                  </div>

                  {/* Subtitle / Options Chips */}
                  <div className="mb-2">
                    <p className="text-xs font-semibold text-orange-600 line-clamp-1">
                      {service.taglineHi}
                    </p>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {service.descriptionHi}
                    </p>
                  </div>

                  {/* Quick Preview Chips (First 2 options) */}
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {service.options.slice(0, 3).map((opt, i) => (
                      <span 
                        key={i}
                        className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200/60"
                      >
                        {opt}
                      </span>
                    ))}
                  </div>

                  {/* Documents count hint */}
                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1 text-slate-600">
                      <FileText className="w-3.5 h-3.5 text-blue-500" />
                      <span>{service.requiredDocs.length} ज़रूरी दस्तावेज़</span>
                    </span>
                    <span className="text-blue-600 font-semibold group-hover:underline">
                      विस्तार से देखें →
                    </span>
                  </div>
                </div>

                {/* Bottom WhatsApp Inquiry Button (Direct Action matching reference design) */}
                <div className="p-3 sm:p-4 pt-0">
                  <a
                    href={whatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => recordInquiry({ serviceName: service.nameHi, selectedOption: firstOption })}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl font-bold text-xs sm:text-sm shadow-sm hover:shadow transition-all tap-bounce"
                    title={`WhatsApp inquiry for ${service.nameHi}`}
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>पूछताछ करें (WhatsApp)</span>
                  </a>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
