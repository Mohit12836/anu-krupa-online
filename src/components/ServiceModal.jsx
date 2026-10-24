import React, { useState, useEffect } from 'react';
import { 
  X, 
  MessageCircle, 
  CheckCircle2, 
  FileText, 
  Clock, 
  ShieldCheck, 
  Coins, 
  Sparkles,
  ExternalLink,
  Package,
  Zap,
  Tag
} from 'lucide-react';
import { createWhatsAppInquiryLink, BUSINESS_CONFIG } from '../data/businessConfig';
import { useStore } from '../context/StoreContext';

export default function ServiceModal({ service, onClose }) {
  if (!service) return null;

  const { settings, activeRef, recordInquiry } = useStore();

  const [selectedOption, setSelectedOption] = useState(
    service.options && service.options.length > 0 ? service.options[0] : (service.popularOptions && service.popularOptions[0]) || ''
  );
  const [userNote, setUserNote] = useState('');

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const whatsAppUrl = createWhatsAppInquiryLink({
    serviceName: service.nameHi,
    selectedOption: selectedOption,
    customNote: userNote,
    whatsappNumber: settings.whatsappPhone,
    partnerRef: activeRef,
    itemType: service.type,
  });

  const isProduct = service.type === 'product';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal / Bottom Sheet Box */}
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-5 duration-200">
        
        {/* Header with image & close button */}
        <div className="relative h-36 sm:h-44 bg-slate-900 shrink-0">
          <img
            src={service.image}
            alt={service.nameHi}
            className="w-full h-full object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm border border-white/20 transition-colors tap-bounce"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title & Badge */}
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isProduct ? 'bg-amber-400 text-slate-950' : 'bg-emerald-500 text-white'
              }`}>
                {isProduct ? '📦 दुकान उत्पाद' : '⚡ ऑनलाइन सेवा'}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500 text-white">
                {service.badge}
              </span>
              <span className="text-[11px] text-slate-300 font-semibold uppercase tracking-wider truncate">
                {service.nameEn}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black leading-tight">
              {service.nameHi}
            </h3>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-slate-800">
          
          {/* Tagline & Overview */}
          <div>
            <p className="text-xs sm:text-sm font-bold text-orange-600">
              {service.taglineHi}
            </p>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              {service.descriptionHi}
            </p>
          </div>

          {/* Delivery Time & Partner Referral Highlight */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {service.deliveryTime && (
              <div className="flex items-center gap-1.5 p-2 px-3 rounded-xl bg-blue-50 text-blue-900 border border-blue-200/80 font-bold">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>डिलीवरी / तैयार समय: {service.deliveryTime}</span>
              </div>
            )}

            {service.partnerCommission && (
              <div className="flex items-center gap-1.5 p-2 px-3 rounded-xl bg-amber-50 text-amber-950 border border-amber-300 font-bold">
                <Coins className="w-4 h-4 text-amber-600" />
                <span>Work From Home रेफरल कमीशन: {service.partnerCommission}</span>
              </div>
            )}
          </div>

          {/* 1-Tap Sub-Option Selector */}
          {service.options && service.options.length > 0 && (
            <div>
              <label className="text-xs font-bold text-slate-900 block mb-2">
                विकल्प या सहायता का प्रकार चुनें (Tap to Select):
              </label>
              <div className="flex flex-wrap gap-2">
                {service.options.map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedOption(opt)}
                    className={`text-xs px-3 py-1.5 rounded-xl border font-semibold transition-all tap-bounce ${
                      selectedOption === opt
                        ? 'bg-orange-500 text-white border-orange-500 shadow-sm font-bold'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {selectedOption === opt && '✓ '}
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Required Documents Checklist */}
          {service.requiredDocs && service.requiredDocs.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>आवश्यक दस्तावेज़ की सूची (Required Documents):</span>
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                {service.requiredDocs.map((doc, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Fee & Transparency Breakdown */}
          {service.feeStructure && (
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/80">
                <span className="text-[11px] text-blue-700 font-semibold block">सरकारी / पोर्टल शुल्क</span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 block mt-0.5">
                  {service.feeStructure.govtFee || 'लागू नहीं'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80">
                <span className="text-[11px] text-emerald-700 font-semibold block">सेवा / दुकान दर</span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 block mt-0.5">
                  {service.feeStructure.serviceFee}
                </span>
              </div>
            </div>
          )}

          {/* Optional Note for Customer */}
          <div>
            <label htmlFor="modal-note" className="text-xs font-semibold text-slate-700 block mb-1">
              कोई विशेष प्रश्न या टिप्पणी (वैकल्पिक):
            </label>
            <input
              id="modal-note"
              type="text"
              value={userNote}
              onChange={(e) => setUserNote(e.target.value)}
              placeholder="जैसे: मुझे यह आर्डर तुरंत चाहिए, पता..."
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

        </div>

        {/* Modal Footer with Big WhatsApp Button */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 shrink-0 flex items-center gap-3">
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => recordInquiry({ 
              serviceName: service.nameHi, 
              selectedOption: selectedOption, 
              customerNote: userNote,
              partnerRef: activeRef 
            })}
            className="flex-1 py-3 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 tap-bounce transition-all"
          >
            <MessageCircle className="w-5 h-5 fill-white" />
            <span>चुने गए विकल्प के साथ WhatsApp पर भेजें</span>
          </a>

          <button
            onClick={onClose}
            className="px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold text-xs transition-colors"
          >
            बंद करें
          </button>
        </div>

      </div>

    </div>
  );
}
