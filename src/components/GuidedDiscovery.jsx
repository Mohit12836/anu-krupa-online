import React, { useState } from 'react';
import { 
  Sparkles, 
  ChevronRight, 
  RotateCcw, 
  MessageCircle, 
  CheckCircle2, 
  ArrowLeft,
  FileText
} from 'lucide-react';
import { CATEGORIES } from '../data/categoriesData';
import { useStore } from '../context/StoreContext';
import { createWhatsAppInquiryLink } from '../data/businessConfig';

export default function GuidedDiscovery({ onSelectService }) {
  const { services, settings, recordInquiry } = useStore();
  const [step, setStep] = useState(1);
  const [selectedCatId, setSelectedCatId] = useState(null);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  // Available categories (excluding 'all')
  const availableCategories = CATEGORIES.filter(c => c.id !== 'all');

  // Filtered available services for chosen category (exclude hidden)
  const activeServices = services.filter(s => !s.isHidden && s.availability !== 'hidden' && s.availability !== 'paused');
  const categoryServices = selectedCatId 
    ? activeServices.filter(s => s.categoryId === selectedCatId) 
    : [];

  const currentService = selectedServiceId 
    ? activeServices.find(s => s.id === selectedServiceId) 
    : null;

  const handleCategorySelect = (catId) => {
    setSelectedCatId(catId);
    setSelectedServiceId(null);
    setSelectedOption(null);
    setStep(2);
  };

  const handleServiceSelect = (srvId) => {
    setSelectedServiceId(srvId);
    const srv = activeServices.find(s => s.id === srvId);
    if (srv && ((srv.options && srv.options.length > 0) || (srv.popularOptions && srv.popularOptions.length > 0))) {
      setSelectedOption((srv.options && srv.options[0]) || (srv.popularOptions && srv.popularOptions[0]));
    }
    setStep(3);
  };

  const resetFlow = () => {
    setStep(1);
    setSelectedCatId(null);
    setSelectedServiceId(null);
    setSelectedOption(null);
  };

  const finalWhatsAppUrl = currentService
    ? createWhatsAppInquiryLink({
        serviceName: currentService.nameHi,
        selectedOption: selectedOption,
        whatsappNumber: settings.whatsappPhone,
      })
    : '#';

  return (
    <section id="guided-discovery" className="py-8 sm:py-10 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden">
      {/* Decorative ambient elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="fluid-container relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-400/30 text-orange-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PhonePe जैसी आसान सेवा खोज (Tap-First)</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
            2 से 3 Taps में अपना काम चुनें
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            बिना कुछ लिखे, केवल विकल्प चुनते जाएं — सही जानकारी व WhatsApp सहायता तुरंत पाएं
          </p>
        </div>

        {/* Step Progress Pills */}
        <div className="max-w-xl mx-auto mb-6 flex items-center justify-between text-xs font-semibold px-4">
          <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-orange-400 font-bold' : 'text-slate-500'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
              1
            </span>
            <span>काम की श्रेणी</span>
          </div>
          <div className="h-0.5 w-12 bg-slate-800" />
          <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-orange-400 font-bold' : 'text-slate-500'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
              2
            </span>
            <span>विशिष्ट सेवा</span>
          </div>
          <div className="h-0.5 w-12 bg-slate-800" />
          <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-orange-400 font-bold' : 'text-slate-500'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 3 ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
              3
            </span>
            <span>समाधान</span>
          </div>
        </div>

        {/* Interactive Box */}
        <div className="max-w-2xl mx-auto bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-md">
          
          {/* STEP 1: Select Category */}
          {step === 1 && (
            <div className="animate-in fade-in duration-200">
              <h3 className="text-base sm:text-lg font-bold text-white mb-3">
                1. आप किस तरह का काम करवाना चाहते हैं?
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {availableCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className="p-3 bg-slate-700/60 hover:bg-orange-500/20 border border-slate-600/70 hover:border-orange-500/60 rounded-xl text-left transition-all tap-bounce group"
                  >
                    <span className="text-xs sm:text-sm font-bold text-white block group-hover:text-orange-300">
                      {cat.nameHi}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5 truncate">
                      {cat.badge}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Select Specific Service */}
          {step === 2 && (
            <div className="animate-in fade-in duration-200">
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>पिछला चरण</span>
                </button>
                <span className="text-xs text-orange-400 font-semibold">
                  श्रेणी चुनी गई: {CATEGORIES.find(c => c.id === selectedCatId)?.nameHi}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-white mb-3">
                2. इनमें से अपनी सेवा चुनें:
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {categoryServices.map((srv) => (
                  <button
                    key={srv.id}
                    onClick={() => handleServiceSelect(srv.id)}
                    className="p-3 bg-slate-700/60 hover:bg-emerald-500/20 border border-slate-600/70 hover:border-emerald-500/60 rounded-xl text-left transition-all tap-bounce flex items-center justify-between group"
                  >
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-white block group-hover:text-emerald-300">
                        {srv.nameHi}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {srv.taglineHi}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Sub-Option Choice & WhatsApp Action */}
          {step === 3 && currentService && (
            <div className="animate-in fade-in duration-200">
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() => setStep(2)}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>सेवा बदलें</span>
                </button>
                <button
                  onClick={resetFlow}
                  className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>शुरू से चुनें</span>
                </button>
              </div>

              {/* Selected Service Card Box */}
              <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-700 mb-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-400">
                      {currentService.nameEn}
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-white">
                      {currentService.nameHi}
                    </h4>
                    <p className="text-xs text-slate-300 mt-1">
                      {currentService.descriptionHi}
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 shrink-0">
                    {currentService.badge}
                  </span>
                </div>

                {/* Sub-Options Tap Chips */}
                <div className="mt-3.5">
                  <span className="text-xs font-semibold text-slate-300 block mb-2">
                    सहायता का प्रकार चुनें (Tap to Select):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {currentService.options.map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedOption(opt)}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all tap-bounce ${
                          selectedOption === opt
                            ? 'bg-orange-500 text-white border-orange-400 font-bold shadow-md'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        {selectedOption === opt && '✓ '}
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Required Documents Checklist */}
                <div className="mt-3.5 pt-3 border-t border-slate-800">
                  <span className="text-xs font-semibold text-slate-300 block mb-1.5">
                    साथ रखने हेतु आवश्यक दस्तावेज़:
                  </span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-slate-300">
                    {currentService.requiredDocs.map((doc, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="truncate">{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={finalWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 tap-bounce transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>चुने गए विकल्प के साथ WhatsApp पर पूछें</span>
                </a>

                {onSelectService && (
                  <button
                    type="button"
                    onClick={() => onSelectService(currentService)}
                    className="py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 tap-bounce transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>पूर्ण विवरण व शुल्क देखें</span>
                  </button>
                )}
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
}
