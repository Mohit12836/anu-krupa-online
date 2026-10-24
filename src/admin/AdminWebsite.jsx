import React, { useState } from 'react';
import { 
  Image, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Sliders, 
  Eye, 
  EyeOff, 
  Save, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function AdminWebsite() {
  const { settings, heroSlides, updateSettings } = useStore();

  const [address, setAddress] = useState(settings.fullAddressHi || 'उकेड़िया, तहसील जावरा, जिला रतलाम (म.प्र.)');
  const [landmark, setLandmark] = useState(settings.landmark || 'ग्राम पंचायत के पास, मुख्य मार्ग');
  const [workingHours, setWorkingHours] = useState(settings.workingHoursHi || 'सुबह 9:00 से शाम 8:00 बजे');
  const [workingDays, setWorkingDays] = useState(settings.workingDaysHi || 'सोमवार से शनिवार (रविवार आधा दिन)');
  const [isSaved, setIsSaved] = useState(false);

  // Quick timing presets
  const TIMING_PRESETS = [
    { label: 'सामान्य समय', hours: 'सुबह 9:00 से शाम 8:00 बजे', days: 'सोमवार से शनिवार (रविवार आधा दिन)' },
    { label: 'गर्मी का समय', hours: 'सुबह 8:30 से दोपहर 1:00, शाम 4:00 से 9:00 बजे', days: 'सोमवार से शनिवार' },
    { label: 'सातों दिन खुला', hours: 'सुबह 9:00 से रात 8:30 बजे', days: 'सोमवार से रविवार (सातों दिन)' },
  ];

  const handleApplyPreset = (preset) => {
    setWorkingHours(preset.hours);
    setWorkingDays(preset.days);
  };

  const handleSaveShopInfo = (e) => {
    e.preventDefault();
    updateSettings({
      fullAddressHi: address,
      landmark: landmark,
      workingHoursHi: workingHours,
      workingDaysHi: workingDays,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      
      {/* Header Info */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-orange-500" />
          <span>वेबसाइट बैनर एवं दुकान की जानकारी (Shop & Banners)</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          यहाँ से बदले गए समय, पता व बैनर तुरंत ग्राहक वेबसाइट पर दिखने लगेंगे।
        </p>
      </div>

      {/* 1. Shop Physical Details & Timings Form */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">
              दुकान का समय व कार्य दिवस (Working Hours)
            </h3>
          </div>
          {isSaved && (
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 animate-pulse">
              <CheckCircle2 className="w-3.5 h-3.5" /> तुरंत सेव हुआ!
            </span>
          )}
        </div>

        {/* Quick Presets */}
        <div>
          <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
            1-टैप त्वरित समय प्रीसेट (Tap to apply):
          </span>
          <div className="flex flex-wrap gap-2">
            {TIMING_PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 hover:bg-orange-50 hover:border-orange-300 text-slate-700 font-medium transition-all tap-bounce"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSaveShopInfo} className="space-y-3 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                दुकान का समय (Working Hours Display)
              </label>
              <input
                type="text"
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
                className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                कार्य दिवस (Working Days)
              </label>
              <input
                type="text"
                value={workingDays}
                onChange={(e) => setWorkingDays(e.target.value)}
                className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                दुकान का पूरा पता (Full Physical Address)
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                लैंडमार्क / पहचान (Landmark)
              </label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5 tap-bounce"
            >
              <Save className="w-3.5 h-3.5 text-orange-400" />
              <span>जानकारी सुरक्षित करें (Save Details)</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Hero Banners Overview */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">
              होमपेज मुख्य स्लाइडर बैनर (Hero Slider Banners)
            </h3>
          </div>
          <span className="text-[11px] font-bold text-slate-500">
            {heroSlides.length} स्लाइड सक्रिय
          </span>
        </div>

        <p className="text-xs text-slate-500">
          ये स्लाइडर होमपेज पर सबसे ऊपर ग्राहक को दिखाई देते हैं। प्रत्येक स्लाइड में सरकारी योजना और 1-टैप WhatsApp बटन जुड़ा है।
        </p>

        <div className="space-y-3 pt-1">
          {heroSlides.map((slide, idx) => (
            <div 
              key={slide.id || idx}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-orange-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
                    {slide.title}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {slide.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  {slide.subtitle}
                </p>
                <div className="flex items-center gap-3 text-[10px] text-slate-500">
                  <span>बटन: <strong>{slide.ctaText}</strong></span>
                  <span>•</span>
                  <span className="text-emerald-700 font-semibold">{slide.urgencyTag}</span>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>सक्रिय (Active)</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
