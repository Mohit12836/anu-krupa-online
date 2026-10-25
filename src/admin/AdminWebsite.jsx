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
  AlertCircle,
  Megaphone,
  Store,
  AlertTriangle,
  ToggleLeft,
  ToggleRight,
  Layers,
  Users,
  Check
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function AdminWebsite() {
  const { settings, heroSlides, updateSettings } = useStore();

  // Text Lines & Banners State
  const [showAnnouncement, setShowAnnouncement] = useState(settings.showAnnouncementBanner !== false);
  const [announcementText, setAnnouncementText] = useState(settings.announcementBanner || '🌾 किसान भाइयों के लिए समर्थन मूल्य ई-उपार्जन पंजीयन शुरू हो गया है।');
  
  const [isOpenToday, setIsOpenToday] = useState(settings.isOpenToday !== false);
  const [shopClosedReason, setShopClosedReason] = useState(settings.shopClosedReason || 'आज दुकान का अवकाश है। आप WhatsApp पर अपना काम छोड़ सकते हैं, कल सुबह प्राथमिकता से किया जाएगा।');
  
  const [showEmergency, setShowEmergency] = useState(settings.showEmergencyBanner === true);
  const [emergencyText, setEmergencyText] = useState(settings.emergencyBannerText || '⚠️ सर्वर मेंटेनेंस के कारण कुछ ऑनलाइन आवेदन सेवाएं अस्थायी रूप से रुकी हैं।');
  
  const [showPromoStrip, setShowPromoStrip] = useState(settings.showPromoStrip !== false);
  const [showReferralBanner, setShowReferralBanner] = useState(settings.showReferralBanner !== false);

  // Shop Physical Details State
  const [address, setAddress] = useState(settings.fullAddressHi || 'उकेड़िया, तहसील जावरा, जिला रतलाम (म.प्र.)');
  const [landmark, setLandmark] = useState(settings.landmark || 'ग्राम पंचायत के पास, मुख्य मार्ग');
  const [workingHours, setWorkingHours] = useState(settings.workingHoursHi || 'सुबह 9:00 से शाम 8:00 बजे');
  const [workingDays, setWorkingDays] = useState(settings.workingDaysHi || 'सोमवार से शनिवार (रविवार आधा दिन)');
  
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Quick Announcement Presets
  const ANNOUNCEMENT_PRESETS = [
    { label: '🌾 ई-उपार्जन पंजीयन', text: '🌾 किसान भाइयों के लिए समर्थन मूल्य ई-उपार्जन पंजीयन शुरू हो गया है।' },
    { label: '⚡ PM सूर्य घर सोलर', text: '⚡ PM सूर्य घर योजना: ₹78,000 सरकारी सब्सिडी के साथ 300 यूनिट मुफ्त बिजली।' },
    { label: '💳 PVC स्मार्ट कार्ड', text: '💳 आधार, पैन व आयुष्मान स्मार्ट PVC कार्ड मात्र 10 मिनट में प्रिंट करवाएं।' },
    { label: '📢 सर्वर सूचना', text: '📢 सरकारी सर्वर मेंटेनेंस के कारण कुछ सेवाएं आज शाम तक धीमी रह सकती हैं।' },
  ];

  // Quick Closed Reason Presets
  const CLOSED_PRESETS = [
    { label: 'साप्ताहिक अवकाश', text: 'आज दुकान का साप्ताहिक अवकाश है। आप WhatsApp पर काम छोड़ सकते हैं, कल सुबह प्राथमिकता से होगा।' },
    { label: 'त्योहार की छुट्टी', text: 'शुभ त्योहार के अवसर पर दुकान आज बंद है। ऑनलाइन मैसेज स्वीकार किए जा रहे हैं।' },
    { label: 'आधा दिन खुला', text: 'आज दुकान केवल दोपहर 2:00 बजे तक खुली रहेगी। आवश्यक कार्य हेतु तुरंत संपर्क करें।' },
  ];

  // Quick Emergency Presets
  const EMERGENCY_PRESETS = [
    { label: 'सर्वर मेंटेनेंस', text: '⚠️ सरकारी सर्वर डाउन होने से पैन व खसरा सेवाएं अस्थायी रूप से रुकी हैं।' },
    { label: 'बिजली/नेटवर्क रुकावट', text: '⚠️ क्षेत्र में विद्युत आपूर्ति बाधित होने से प्रिंटिंग सेवाएं कुछ समय के लिए स्थगित हैं।' },
  ];

  // Quick timing presets
  const TIMING_PRESETS = [
    { label: 'सामान्य समय', hours: 'सुबह 9:00 से शाम 8:00 बजे', days: 'सोमवार से शनिवार (रविवार आधा दिन)' },
    { label: 'गर्मी का समय', hours: 'सुबह 8:30 से दोपहर 1:00, शाम 4:00 से 9:00 बजे', days: 'सोमवार से शनिवार' },
    { label: 'सातों दिन खुला', hours: 'सुबह 9:00 से रात 8:30 बजे', days: 'सोमवार से रविवार (सातों दिन)' },
  ];

  // Save Banner & Text Lines
  const handleSaveTextLines = (e) => {
    e.preventDefault();
    updateSettings({
      showAnnouncementBanner: showAnnouncement,
      announcementBanner: announcementText.trim(),
      isOpenToday: isOpenToday,
      shopClosedReason: shopClosedReason.trim(),
      showEmergencyBanner: showEmergency,
      emergencyBannerText: emergencyText.trim(),
      showPromoStrip: showPromoStrip,
      showReferralBanner: showReferralBanner,
    });
    showToast('✓ वेबसाइट की सूचना पट्टियां व लाइन्स तुरंत अपडेट हो गईं!');
  };

  // Instant 1-tap toggles
  const handleToggleAnnouncement = () => {
    const next = !showAnnouncement;
    setShowAnnouncement(next);
    updateSettings({ showAnnouncementBanner: next });
    showToast(next ? '✓ शीर्ष सूचना पट्टी चालू कर दी गई है!' : '🚫 शीर्ष सूचना पट्टी बंद (Hide) कर दी गई!');
  };

  const handleToggleOpenToday = () => {
    const next = !isOpenToday;
    setIsOpenToday(next);
    updateSettings({ isOpenToday: next });
    showToast(next ? '✓ दुकान "खुली है" स्टेटस सेट हो गया!' : '🚫 दुकान "बंद है" अवकाश स्टेटस सेट हो गया!');
  };

  const handleToggleEmergency = () => {
    const next = !showEmergency;
    setShowEmergency(next);
    updateSettings({ showEmergencyBanner: next });
    showToast(next ? '⚠️ आपातकालीन अलर्ट पट्टी चालू कर दी गई!' : '✓ आपातकालीन अलर्ट पट्टी बंद कर दी गई!');
  };

  const handleTogglePromoStrip = () => {
    const next = !showPromoStrip;
    setShowPromoStrip(next);
    updateSettings({ showPromoStrip: next });
    showToast(next ? '✓ 3 प्रोमो कार्ड्स पट्टी चालू!' : '🚫 3 प्रोमो कार्ड्स पट्टी बंद (Hide) कर दी गई!');
  };

  const handleToggleReferral = () => {
    const next = !showReferralBanner;
    setShowReferralBanner(next);
    updateSettings({ showReferralBanner: next });
    showToast(next ? '✓ पार्टनर स्वागत पट्टी चालू!' : '🚫 पार्टनर स्वागत पट्टी बंद (Hide) कर दी गई!');
  };

  const handleSaveShopInfo = (e) => {
    e.preventDefault();
    updateSettings({
      fullAddressHi: address,
      landmark: landmark,
      workingHoursHi: workingHours,
      workingDaysHi: workingDays,
    });
    showToast('✓ दुकान का समय व पता सुरक्षित हो गया!');
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`p-3.5 rounded-2xl shadow-lg border flex items-center justify-between gap-2 text-xs font-bold transition-all animate-in slide-in-from-top-2 ${
          toastMessage.type === 'hidden'
            ? 'bg-rose-900 text-white border-rose-700 shadow-rose-900/30'
            : 'bg-emerald-900 text-white border-emerald-700 shadow-emerald-900/30'
        }`}>
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header Info */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-orange-500" />
          <span>वेबसाइट सूचना पट्टियां, लाइन्स एवं दुकान कंट्रोल (Lines & Banners)</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          यहाँ से वेबसाइट पर लिखी जाने वाली शीर्ष लाइन, दुकान बंद/खुली का मैसेज, और प्रोमो बॉक्स 1-क्लिक में चालू या बंद (Hide) करें।
        </p>
      </div>

      {/* ============================================================== */}
      {/* 1. TEXT LINES & NOTICES TOGGLE CONTROL CENTER (USER PRIORITY) */}
      {/* ============================================================== */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-orange-500" />
            <h3 className="text-xs sm:text-sm font-black text-slate-900">
              वेबसाइट की लाइन्स व सूचना पट्टियां (Text Lines & Notice Controls)
            </h3>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
            लाइव कंट्रोल
          </span>
        </div>

        {/* 1.1 Top Announcement Banner Line */}
        <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">1. शीर्ष मुख्य घोषणा पट्टी (Top Announcement Line)</span>
                {showAnnouncement ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">चालू (Visible)</span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">बंद (Hidden)</span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                यह लाइन वेबसाइट के सबसे ऊपर नारंगी रंग की पट्टी में दिखाई देती है।
              </p>
            </div>

            <button
              type="button"
              onClick={handleToggleAnnouncement}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 tap-bounce self-start sm:self-auto ${
                showAnnouncement
                  ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
              }`}
            >
              {showAnnouncement ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>यह लाइन बंद करें (Hide)</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>यह लाइन चालू करें (Show)</span>
                </>
              )}
            </button>
          </div>

          {/* Banner Text Input & Presets */}
          {showAnnouncement && (
            <div className="space-y-2 pt-1 border-t border-slate-200/60 animate-in fade-in">
              <label className="text-[11px] font-semibold text-slate-700 block">
                घोषणा पट्टी पर लिखी जाने वाली लाइन:
              </label>
              <input
                type="text"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                placeholder="जैसे: 🌾 किसान भाइयों के लिए समर्थन मूल्य ई-उपार्जन पंजीयन शुरू हो गया है।"
                className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />

              {/* Quick Presets */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] font-bold text-slate-500">त्वरित सुझाव:</span>
                {ANNOUNCEMENT_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAnnouncementText(p.text)}
                    className="px-2.5 py-1 text-[10px] rounded-lg bg-white border border-slate-200 hover:bg-orange-50 hover:border-orange-300 text-slate-700 font-medium transition-all"
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Live Preview */}
              <div className="mt-2 p-2 rounded-lg bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white text-[11px] font-bold text-center flex items-center justify-center gap-2 shadow-inner">
                <span>📢</span>
                <span className="truncate">{announcementText || 'खाली सूचना'}</span>
              </div>
            </div>
          )}
        </div>

        {/* 1.2 Store Open / Closed Status & Holiday Message */}
        <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">2. दुकान खुली / बंद स्थिति (Shop Open/Closed Toggle)</span>
                {isOpenToday ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">खुली है (Open)</span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">बंद / अवकाश (Closed)</span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                दुकान बंद करने पर वेबसाइट पर अवकाश की लाल सूचना पट्टी दिखने लगती है।
              </p>
            </div>

            <button
              type="button"
              onClick={handleToggleOpenToday}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 tap-bounce self-start sm:self-auto ${
                isOpenToday
                  ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>{isOpenToday ? 'दुकान बंद घोषित करें' : 'दुकान खुली घोषित करें'}</span>
            </button>
          </div>

          {/* If Store is Closed, Editable Closed Reason Line */}
          {!isOpenToday && (
            <div className="space-y-2 pt-1 border-t border-slate-200/60 animate-in fade-in">
              <label className="text-[11px] font-semibold text-rose-800 block">
                अवकाश / दुकान बंद होने पर दिखने वाली लाइन:
              </label>
              <input
                type="text"
                value={shopClosedReason}
                onChange={(e) => setShopClosedReason(e.target.value)}
                placeholder="जैसे: आज दुकान का अवकाश है। आप WhatsApp पर अपना काम छोड़ सकते हैं..."
                className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-rose-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />

              {/* Presets */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] font-bold text-slate-500">त्वरित सुझाव:</span>
                {CLOSED_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setShopClosedReason(p.text)}
                    className="px-2.5 py-1 text-[10px] rounded-lg bg-white border border-slate-200 hover:bg-rose-50 hover:border-rose-300 text-slate-700 font-medium transition-all"
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Live Preview */}
              <div className="mt-2 p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold text-center flex items-center justify-center gap-2">
                <Store className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>{shopClosedReason}</span>
              </div>
            </div>
          )}
        </div>

        {/* 1.3 Emergency Red Alert Banner */}
        <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">3. आपातकालीन / मेंटेनेंस रेड अलर्ट पट्टी</span>
                {showEmergency ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-600 text-white animate-pulse">सक्रिय (Alert ON)</span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">बंद (Off)</span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                सर्वर डाउन होने, बारिश, या तकनीकी खराबी के समय ग्राहकों को चेतावनी देने के लिए।
              </p>
            </div>

            <button
              type="button"
              onClick={handleToggleEmergency}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 tap-bounce self-start sm:self-auto ${
                showEmergency
                  ? 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                  : 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{showEmergency ? 'रेड अलर्ट बंद करें' : 'रेड अलर्ट चालू करें'}</span>
            </button>
          </div>

          {showEmergency && (
            <div className="space-y-2 pt-1 border-t border-slate-200/60 animate-in fade-in">
              <label className="text-[11px] font-semibold text-rose-700 block">
                आपातकालीन चेतावनी लाइन:
              </label>
              <input
                type="text"
                value={emergencyText}
                onChange={(e) => setEmergencyText(e.target.value)}
                placeholder="जैसे: ⚠️ सर्वर मेंटेनेंस के कारण कुछ ऑनलाइन सेवाएं अस्थायी रूप से रुकी हैं।"
                className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-rose-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />

              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] font-bold text-slate-500">त्वरित सुझाव:</span>
                {EMERGENCY_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setEmergencyText(p.text)}
                    className="px-2.5 py-1 text-[10px] rounded-lg bg-white border border-slate-200 hover:bg-rose-50 text-slate-700 font-medium transition-all"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 1.4 Homepage Sections Visibility Toggles (Promo Strip & Referral) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          
          {/* Promo Strip Toggle */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-orange-500" />
                <span className="text-xs font-bold text-slate-900">3 प्रोमो कार्ड्स पट्टी</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">
                होमपेज पर KCC, सोलर व आयुष्मान के 3 कार्ड
              </p>
            </div>

            <button
              type="button"
              onClick={handleTogglePromoStrip}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all tap-bounce ${
                showPromoStrip
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
              }`}
            >
              {showPromoStrip ? 'दिख रही है' : 'छिपी है'}
            </button>
          </div>

          {/* Referral Welcome Banner Toggle */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-xs font-bold text-slate-900">पार्टनर स्वागत पट्टी</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">
                रेफरल लिंक से आने पर नीली स्वागत लाइन
              </p>
            </div>

            <button
              type="button"
              onClick={handleToggleReferral}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all tap-bounce ${
                showReferralBanner
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
              }`}
            >
              {showReferralBanner ? 'दिख रही है' : 'छिपी है'}
            </button>
          </div>

        </div>

        {/* Master Save Button for Text Lines */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={handleSaveTextLines}
            className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 tap-bounce transition-all"
          >
            <Save className="w-4 h-4" />
            <span>सभी लाइन्स व पट्टियां सुरक्षित करें (Save Banners & Lines)</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. SHOP PHYSICAL DETAILS & TIMINGS FORM */}
      {/* ============================================================== */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">
              दुकान का समय व कार्य दिवस (Working Hours & Address)
            </h3>
          </div>
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
                onClick={() => {
                  setWorkingHours(p.hours);
                  setWorkingDays(p.days);
                }}
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
              <span>पता व समय सुरक्षित करें (Save Details)</span>
            </button>
          </div>
        </form>
      </div>

      {/* ============================================================== */}
      {/* 3. HERO BANNERS OVERVIEW */}
      {/* ============================================================== */}
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
                    {slide.titleHi || slide.title}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {slide.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  {slide.subtitleHi || slide.subtitle}
                </p>
                <div className="flex items-center gap-3 text-[10px] text-slate-500">
                  <span>बटन: <strong>{slide.ctaTextHi || slide.ctaText}</strong></span>
                  <span>•</span>
                  <span className="text-emerald-700 font-semibold">{slide.urgencyTag || 'प्राथमिकता सेवा'}</span>
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
