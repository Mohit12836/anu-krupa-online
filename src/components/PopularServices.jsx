import React, { useState } from 'react';
import { 
  MessageCircle, 
  ArrowRight, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  Clock,
  Coins,
  Package,
  Zap,
  Tag
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { createWhatsAppInquiryLink } from '../data/businessConfig';

export default function PopularServices({ 
  selectedCategory, 
  onSelectCategory, 
  selectedVertical = 'all',
  onSelectService,
  onOpenPartnerModal
}) {
  const { services, settings, activeRef, recordInquiry } = useStore();
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'service' | 'product'

  const disabledCategories = settings?.disabledCategories || [];
  const disabledVerticals = settings?.disabledVerticals || [];

  // Filter only visible active services (exclude hidden, paused, and disabled categories)
  const activeServices = services.filter(s => 
    !s.isHidden && 
    s.availability !== 'hidden' && 
    s.availability !== 'paused' &&
    !disabledCategories.includes(s.categoryId) &&
    !disabledVerticals.includes(s.verticalId)
  );

  // Filter by vertical, category, and type
  const displayedServices = activeServices.filter((service) => {
    // 1. Vertical Match
    const matchesVertical = selectedVertical === 'all' || service.verticalId === selectedVertical;
    // 2. Category Match
    const matchesCategory = selectedCategory === 'all' || service.categoryId === selectedCategory;
    // 3. Type Match (service vs product)
    const matchesType = typeFilter === 'all' || service.type === typeFilter;

    return matchesVertical && matchesCategory && matchesType;
  });

  return (
    <section id="services-section" className="py-6 sm:py-8 bg-slate-50">
      <div className="fluid-container">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                {selectedCategory === 'all' && selectedVertical === 'all' 
                  ? 'लोकप्रिय सेवाएं एवं उत्पाद' 
                  : 'उपलब्ध सेवाएं एवं उत्पाद'}
              </h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                {displayedServices.length} उपलब्ध
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              पारदर्शी सरकारी फीस, दुकान रेट, डिलीवरी समय व आवश्यक दस्तावेज़ देखें
            </p>
          </div>

          {/* Type Filter Buttons (Services vs Products) */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto bg-white p-1 rounded-2xl border border-slate-200 shadow-sm text-xs font-bold">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1.5 rounded-xl transition-all tap-bounce ${
                typeFilter === 'all'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              सभी ({activeServices.length})
            </button>
            <button
              onClick={() => setTypeFilter('service')}
              className={`px-3 py-1.5 rounded-xl transition-all tap-bounce flex items-center gap-1 ${
                typeFilter === 'service'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>सेवाएं</span>
            </button>
            <button
              onClick={() => setTypeFilter('product')}
              className={`px-3 py-1.5 rounded-xl transition-all tap-bounce flex items-center gap-1 ${
                typeFilter === 'product'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>दुकान उत्पाद</span>
            </button>
          </div>
        </div>

        {/* Services Responsive Auto-Fit Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {displayedServices.map((service) => {
            const firstOption = (service.options && service.options[0]) || (service.popularOptions && service.popularOptions[0]) || 'जानकारी';
            const whatsAppUrl = createWhatsAppInquiryLink({
              serviceName: service.nameHi,
              selectedOption: firstOption,
              whatsappNumber: settings.whatsappPhone,
              partnerRef: activeRef,
              itemType: service.type,
            });

            const isProduct = service.type === 'product';

            return (
              <div
                key={service.id}
                className="bg-white rounded-3xl border border-slate-200/90 hover:border-slate-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group tap-bounce"
              >
                {/* Top Clickable Area to open Details Modal */}
                <div 
                  onClick={() => onSelectService(service)} 
                  className="cursor-pointer p-4 sm:p-5 pb-3"
                >
                  {/* Card Visual & Badge */}
                  <div className="relative h-40 sm:h-44 rounded-2xl overflow-hidden mb-3.5 bg-slate-100">
                    <img
                      src={service.image}
                      alt={service.nameHi}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                    
                    {/* Top Right & Left Badges */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm backdrop-blur-sm border ${
                        isProduct
                          ? 'bg-amber-400 text-slate-950 border-amber-300'
                          : 'bg-emerald-500 text-white border-emerald-400'
                      }`}>
                        {isProduct ? '📦 दुकान उत्पाद' : '⚡ ऑनलाइन सेवा'}
                      </span>
                    </div>

                    <div className="absolute top-2.5 left-2.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-sm border border-white/20">
                        {service.badge}
                      </span>
                    </div>

                    {/* Bottom overlay text */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-300 block truncate">
                        {service.nameEn}
                      </span>
                      <h3 className="text-base sm:text-lg font-black leading-tight drop-shadow truncate">
                        {service.nameHi}
                      </h3>
                    </div>
                  </div>

                  {/* Subtitle / Tagline */}
                  <div className="mb-2">
                    <p className="text-xs font-bold text-orange-600 line-clamp-1">
                      {service.taglineHi}
                    </p>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {service.descriptionHi}
                    </p>
                  </div>

                  {/* Delivery Timeline & Partner Commission Badge */}
                  <div className="flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-slate-100 text-[11px]">
                    {service.deliveryTime && (
                      <span className="flex items-center gap-1 font-semibold text-slate-600 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200">
                        <Clock className="w-3 h-3 text-blue-500" />
                        <span>{service.deliveryTime}</span>
                      </span>
                    )}

                    {service.partnerCommission && (
                      <span 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onOpenPartnerModal) onOpenPartnerModal();
                        }}
                        className="flex items-center gap-1 font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded-lg border border-indigo-200 transition-colors"
                        title="Work From Home पार्टनर कमीशन"
                      >
                        <Coins className="w-3 h-3 text-amber-500" />
                        <span>पार्टनर: {service.partnerCommission}</span>
                      </span>
                    )}
                  </div>

                  {/* Fee Preview Breakdown */}
                  {service.feeStructure && (
                    <div className="mt-2.5 p-2 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">शुल्क विवरण:</span>
                      <span className="font-extrabold text-slate-900">
                        {service.feeStructure.serviceFee || service.feeStructure.govtFee}
                      </span>
                    </div>
                  )}

                  {/* Documents count hint */}
                  {service.requiredDocs && service.requiredDocs.length > 0 && (
                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1 text-slate-600">
                        <FileText className="w-3.5 h-3.5 text-blue-500" />
                        <span>{service.requiredDocs.length} दस्तावेज़ आवश्यक</span>
                      </span>
                      <span className="text-blue-600 font-semibold group-hover:underline">
                        विवरण देखें →
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom WhatsApp Direct Inquiry Button */}
                <div className="p-3 sm:p-4 pt-0">
                  <a
                    href={whatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => recordInquiry({ 
                      serviceName: service.nameHi, 
                      selectedOption: firstOption,
                      partnerRef: activeRef 
                    })}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl font-bold text-xs sm:text-sm shadow-sm hover:shadow transition-all tap-bounce"
                    title={`WhatsApp inquiry for ${service.nameHi}`}
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>WhatsApp पर ऑर्डर / पूछताछ</span>
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
