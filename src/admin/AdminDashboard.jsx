import React, { useState } from 'react';
import { 
  Store, 
  CheckCircle2, 
  Clock, 
  MessageCircle, 
  PlusCircle, 
  AlertCircle, 
  Megaphone, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function AdminDashboard({ onNavigateTab, onOpenAddService }) {
  const { services, settings, inquiries, updateSettings, updateInquiryStatus } = useStore();

  const [announcementText, setAnnouncementText] = useState(settings.announcementBanner || '');
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  const isServiceVisible = (s) => !s.isHidden && s.availability !== 'hidden' && s.availability !== 'paused';
  const activeServicesCount = services.filter(isServiceVisible).length;
  const hiddenServicesCount = services.length - activeServicesCount;
  const newInquiriesCount = inquiries.filter(inq => inq.status === 'NEW').length;
  const inProgressCount = inquiries.filter(inq => inq.status === 'IN_PROGRESS').length;

  const handleToggleShopOpen = () => {
    updateSettings({ isOpenToday: !settings.isOpenToday });
  };

  const handlePublishNotice = (e) => {
    e.preventDefault();
    updateSettings({ announcementBanner: announcementText });
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2500);
  };

  const handleClearNotice = () => {
    setAnnouncementText('');
    updateSettings({ announcementBanner: '' });
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      
      {/* 1. Quick Shop Status Card (One-Hand Toggle) */}
      <div className={`p-4 sm:p-5 rounded-2xl border shadow-sm transition-all ${
        settings.isOpenToday 
          ? 'bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border-emerald-500/40 text-white' 
          : 'bg-gradient-to-r from-rose-950 via-slate-900 to-slate-900 border-rose-500/40 text-white'
      }`}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl shadow-inner ${
              settings.isOpenToday ? 'bg-emerald-500 text-white shadow-emerald-500/40' : 'bg-rose-500 text-white shadow-rose-500/40'
            }`}>
              <Store className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${settings.isOpenToday ? 'bg-emerald-400 animate-ping' : 'bg-rose-400'}`} />
                <h2 className="text-base sm:text-lg font-extrabold tracking-tight">
                  {settings.isOpenToday ? 'दुकान अभी खुली है (Store Open)' : 'दुकान आज बंद है (Store Closed)'}
                </h2>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                समय: {settings.workingHoursHi} ({settings.shortLocation})
              </p>
            </div>
          </div>

          {/* Big Tap Toggle Button */}
          <button
            type="button"
            onClick={handleToggleShopOpen}
            className={`px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-all tap-bounce ${
              settings.isOpenToday
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {settings.isOpenToday ? 'दुकान बंद करें' : 'दुकान खोलें'}
          </button>
        </div>
      </div>

      {/* 2. Today's Key Metrics Grid (4 Tappable Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        {/* Total Services */}
        <div 
          onClick={() => onNavigateTab('services')}
          className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-sm cursor-pointer hover:border-orange-400 hover:shadow transition-all tap-bounce"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>कुल सेवाएं</span>
            <span className="w-2 h-2 rounded-full bg-blue-500" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 block">{services.length}</span>
          <span className="text-[11px] text-emerald-600 font-bold mt-0.5 block">
            {activeServicesCount} सक्रिय • {hiddenServicesCount} छिपी
          </span>
        </div>

        {/* New Inquiries */}
        <div 
          onClick={() => onNavigateTab('enquiries')}
          className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-sm cursor-pointer hover:border-orange-400 hover:shadow transition-all tap-bounce relative overflow-hidden"
        >
          {newInquiriesCount > 0 && (
            <span className="absolute top-2 right-2 text-[10px] font-bold bg-amber-500 text-white px-1.5 py-0.5 rounded-full animate-pulse">
              NEW
            </span>
          )}
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>नई पूछताछ</span>
            <MessageCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 block">{newInquiriesCount}</span>
          <span className="text-[11px] text-amber-600 font-bold mt-0.5 block">
            तत्काल WhatsApp जवाब दें →
          </span>
        </div>

        {/* In Progress */}
        <div 
          onClick={() => onNavigateTab('enquiries')}
          className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-sm cursor-pointer hover:border-orange-400 hover:shadow transition-all tap-bounce"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>प्रक्रिया में</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <span className="text-2xl font-extrabold text-blue-600 block">{inProgressCount}</span>
          <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">दस्तावेज़ जमा / प्रगति पर</span>
        </div>

        {/* WhatsApp Official */}
        <div 
          onClick={() => onNavigateTab('settings')}
          className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-sm cursor-pointer hover:border-orange-400 hover:shadow transition-all tap-bounce"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>आधिकारिक WhatsApp</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-base font-extrabold text-slate-900 block truncate">{settings.whatsappDisplay}</span>
          <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">1 जगह से अपडेट</span>
        </div>

      </div>

      {/* 3. Shop Announcement Notice Bar (Instant Live Publishing) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-orange-500" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">
              होमपेज घोषणा / नोटिस बोर्ड (Instant Live Notice)
            </h3>
          </div>
          {settings.announcementBanner && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
              लाइव सक्रिय ✓
            </span>
          )}
        </div>

        <form onSubmit={handlePublishNotice} className="space-y-2.5">
          <input
            type="text"
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
            placeholder="जैसे: किसान भाइयों के लिए ई-उपार्जन पंजीयन शुरू हो गया है..."
            className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] text-slate-500">
              {isSavedNotice ? '✓ होमपेज पर तुरंत अपडेट हो गया!' : 'सेव करते ही होमपेज पर सबसे ऊपर दिखेगा'}
            </span>

            <div className="flex items-center gap-2">
              {settings.announcementBanner && (
                <button
                  type="button"
                  onClick={handleClearNotice}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors"
                >
                  नोटिस हटाएं
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-sm tap-bounce"
              >
                नोटिस लाइव करें
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* 4. Quick Action Chips */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
        <span className="text-xs font-bold text-slate-700 block mb-2.5 uppercase tracking-wider">
          त्वरित कार्य (1-Tap Quick Actions)
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          
          <button
            onClick={onOpenAddService}
            className="p-3 bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-400 rounded-xl text-left transition-all tap-bounce flex items-center gap-2.5 shadow-sm"
          >
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block leading-tight">नई सेवा जोड़ें</span>
              <span className="text-[10px] text-slate-500">सरकारी प्रीसेट्स से</span>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('services')}
            className="p-3 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-400 rounded-xl text-left transition-all tap-bounce flex items-center gap-2.5 shadow-sm"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block leading-tight">सेवा चालू/बंद करें</span>
              <span className="text-[10px] text-slate-500">1-टैप स्विच से</span>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('enquiries')}
            className="p-3 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-400 rounded-xl text-left transition-all tap-bounce flex items-center gap-2.5 shadow-sm col-span-2 sm:col-span-1"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block leading-tight">पूछताछ पाइपलाइन</span>
              <span className="text-[10px] text-slate-500">काम की स्थिति बदलें</span>
            </div>
          </button>

        </div>
      </div>

      {/* 5. Recent Inquiries Mini List */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>ताज़ा ग्राहक पूछताछ (Recent Enquiries)</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {inquiries.length} कुल
            </span>
          </h3>
          <button
            onClick={() => onNavigateTab('enquiries')}
            className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1"
          >
            <span>सभी देखें</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {inquiries.slice(0, 3).map((inq) => (
            <div
              key={inq.id}
              className="p-3 rounded-xl border border-slate-100 bg-slate-50/80 hover:bg-white hover:border-slate-200 transition-all flex items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{inq.customerName}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    inq.status === 'NEW' 
                      ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                      : inq.status === 'IN_PROGRESS' 
                        ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}>
                    {inq.status === 'NEW' ? 'नई' : inq.status === 'IN_PROGRESS' ? 'प्रक्रिया में' : 'पूर्ण'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5 font-medium">
                  {inq.serviceName} • <span className="text-slate-500">{inq.selectedOption}</span>
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-1.5">
                {inq.status === 'NEW' && (
                  <button
                    onClick={() => updateInquiryStatus(inq.id, 'IN_PROGRESS')}
                    className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold tap-bounce"
                  >
                    शुरू करें
                  </button>
                )}
                {inq.status === 'IN_PROGRESS' && (
                  <button
                    onClick={() => updateInquiryStatus(inq.id, 'COMPLETED')}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold tap-bounce"
                  >
                    पूर्ण करें ✓
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
