import React, { useState } from 'react';
import { 
  X, 
  Briefcase, 
  Share2, 
  Copy, 
  Check, 
  Sparkles, 
  TrendingUp, 
  Award, 
  Smartphone, 
  QrCode, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Sun,
  Globe,
  CreditCard,
  Sprout
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function PartnerOnboardingModal({ isOpen, onClose }) {
  const { partners, currentPartner, registerPartner } = useStore();

  const [activeTab, setActiveTab] = useState(currentPartner ? 'card' : 'register');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState('');
  const [upiId, setUpiId] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [existingPartnerInput, setExistingPartnerInput] = useState('');
  const [selectedPartner, setSelectedPartner] = useState(currentPartner || (partners.length > 0 ? partners[0] : null));

  if (!isOpen) return null;

  const handleRegister = (e) => {
    e.preventDefault();
    if (!name || !phone || !upiId) return;

    const newPartner = registerPartner({
      name,
      phone,
      village: village || 'उकेड़िया / जावरा',
      upiId,
    });

    setSelectedPartner(newPartner);
    setActiveTab('card');
  };

  const currentDisplayPartner = selectedPartner || currentPartner || partners[0];
  const shareableUrl = currentDisplayPartner 
    ? `${window.location.origin}/?ref=${currentDisplayPartner.id}`
    : `${window.location.origin}/?ref=AKP-PARTNER`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = `🌾 *नमस्ते!* घर बैठे सरकारी योजनाएं, KCC, MPOnline फॉर्म, स्मार्ट PVC कार्ड, वेबसाइट डिजाइन और सोलर रूफटॉप लगवाने के लिए *Anu Krupa Online* से संपर्क करें।\n\n📌 मेरी पार्टनर लिंक से विशेष प्राथमिकता और सहायता पाएं:\n👉 ${shareableUrl}\n\nतुरंत लिंक खोलें और 1-क्लिक में WhatsApp पर जानकारी पाएं!`;
    const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-sm transition-colors tap-bounce"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[11px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3" />
              Work From Home
            </span>
            <span className="text-xs text-indigo-200 font-semibold">
              0 रुपये निवेश • असीमित कमाई
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
            अनु कृपा डिजिटल पार्टनर बनें
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg leading-relaxed">
            गांव या शहर में रहकर बस अपनी पार्टनर लिंक शेयर करें। ग्राहक आर्डर करेगा और आपको मिलेगा हर काम पर 20% से 50% सीधा कमीशन!
          </p>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/10">
            <button
              onClick={() => setActiveTab('card')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all tap-bounce ${
                activeTab === 'card'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              💳 मेरा पार्टनर कार्ड एवं लिंक
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all tap-bounce ${
                activeTab === 'register'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              ✍️ नया पार्टनर रजिस्ट्रेशन
            </button>
            <button
              onClick={() => setActiveTab('commission')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all tap-bounce ${
                activeTab === 'commission'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              💰 कमीशन रेट कार्ड
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-slate-800 flex-1">

          {/* TAB 1: DIGITAL PARTNER ID CARD & SHARE */}
          {activeTab === 'card' && currentDisplayPartner && (
            <div className="space-y-5 animate-in fade-in duration-200">
              
              {/* Premium Digital Partner Card */}
              <div className="relative rounded-2xl bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white p-5 sm:p-6 shadow-xl border border-indigo-400/30 overflow-hidden">
                <div className="absolute top-0 right-0 -mt-6 -mr-6 w-36 h-36 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-36 h-36 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black text-sm">
                      AK
                    </div>
                    <div>
                      <h4 className="text-xs font-bold tracking-wider uppercase text-slate-200">ANU KRUPA ONLINE</h4>
                      <p className="text-[10px] text-amber-300 font-semibold">Authorized Digital Partner</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      सत्यापित पार्टनर ✓
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Partner Name</span>
                    <h3 className="text-lg sm:text-xl font-extrabold text-white leading-tight mt-0.5">
                      {currentDisplayPartner.name}
                    </h3>
                    <p className="text-xs text-slate-300 font-medium">
                      📍 {currentDisplayPartner.village}
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15 self-start sm:self-auto">
                    <span className="text-[10px] text-amber-300 block font-bold uppercase">यूनिक पार्टनर ID</span>
                    <span className="text-base sm:text-lg font-black tracking-wider text-white">
                      {currentDisplayPartner.id}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 text-[11px]">UPI Payout:</span>
                    <span className="font-mono text-emerald-300 font-bold">{currentDisplayPartner.upiId}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">साझेदारी: 2026</span>
                </div>
              </div>

              {/* Shareable Link Box */}
              <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4">
                <label className="text-xs font-bold text-slate-900 block mb-1.5">
                  🔗 आपकी पर्सनल रेफरल लिंक (इसे शेयर करें):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareableUrl}
                    className="w-full text-xs font-mono p-2.5 bg-white border border-amber-300 rounded-xl text-slate-800 select-all focus:outline-none"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-3.5 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shrink-0 tap-bounce transition-colors"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'कॉपी हो गया!' : 'कॉपी करें'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-600 mt-2">
                  💡 इस लिंक से जो भी ग्राहक WhatsApp पर मैसेज करेगा, आपको उसका कमीशन स्वतः क्रेडिट होगा।
                </p>
              </div>

              {/* 1-Tap Big WhatsApp Share Button */}
              <button
                onClick={handleShareWhatsApp}
                className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-2xl font-black text-sm shadow-md flex items-center justify-center gap-2 tap-bounce transition-all"
              >
                <Share2 className="w-5 h-5 fill-white" />
                <span>WhatsApp ग्रुप्स व दोस्तों में शेयर करें</span>
              </button>

              {/* Live Partner Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-center">
                  <span className="text-[11px] text-slate-500 font-bold block">कुल रेफरल</span>
                  <span className="text-xl font-extrabold text-blue-600 block mt-0.5">
                    {currentDisplayPartner.leadsCount || 0}
                  </span>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-center">
                  <span className="text-[11px] text-slate-500 font-bold block">कुल कमीशन</span>
                  <span className="text-xl font-extrabold text-emerald-600 block mt-0.5">
                    ₹{currentDisplayPartner.commissionEarned || 0}
                  </span>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-center">
                  <span className="text-[11px] text-slate-500 font-bold block">भुगतान हुआ</span>
                  <span className="text-xl font-extrabold text-slate-800 block mt-0.5">
                    ₹{currentDisplayPartner.commissionPaid || 0}
                  </span>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-center">
                  <span className="text-[11px] text-slate-500 font-bold block">बकाया कमीशन</span>
                  <span className="text-xl font-extrabold text-amber-600 block mt-0.5">
                    ₹{Math.max(0, (currentDisplayPartner.commissionEarned || 0) - (currentDisplayPartner.commissionPaid || 0))}
                  </span>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: REGISTER NEW PARTNER */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-900 flex items-start gap-3">
                <Award className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">बिना किसी फीस के आज ही जुड़ें:</span>
                  <span>अपनी जानकारी दर्ज करें। आपको तुरंत डिजिटल पार्टनर ID और शेयर करने योग्य लिंक मिल जाएगी।</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">
                  आपका पूरा नाम (Full Name) *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="जैसे: राकेश पाटीदार"
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">
                    WhatsApp मोबाइल नंबर *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="जैसे: 98261XXXXX"
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">
                    गांव / कस्बा / शहर *
                  </label>
                  <input
                    type="text"
                    required
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder="जैसे: उकेड़िया, जावरा, रतलाम"
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">
                  कमीशन प्राप्त करने हेतु UPI ID (PhonePe / GPay / Paytm) *
                </label>
                <input
                  type="text"
                  required
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="जैसे: 9826123456@ybl या name@oksbi"
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  ग्राहक का काम पूरा होते ही इस UPI ID पर कमीशन सीधा भेजा जाएगा।
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black text-sm shadow-md tap-bounce transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>30 सेकंड में पार्टनर ID बनाएं एवं कार्ड पाएं →</span>
              </button>
            </form>
          )}

          {/* TAB 3: COMMISSION RATE CARD */}
          {activeTab === 'commission' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="text-xs text-slate-600 font-medium">
                हर आर्डर व ग्राहक क्लोजिंग पर मिलने वाला पारदर्शी रेफरल कमीशन:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Sun className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-extrabold text-slate-900">PM सूर्य घर सोलर रूफटॉप</span>
                  </div>
                  <p className="text-[11px] text-slate-600">300 यूनिट मुफ्त बिजली योजना</p>
                  <div className="mt-2 text-sm font-black text-amber-700">
                    💰 ₹1,000 प्रति क्लोजिंग
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Globe className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-extrabold text-slate-900">बिजनेस वेबसाइट डिजाइन</span>
                  </div>
                  <p className="text-[11px] text-slate-600">दुकान व फर्म के लिए मॉडर्न वेबसाइट</p>
                  <div className="mt-2 text-sm font-black text-indigo-700">
                    💰 ₹500 - ₹1,500 प्रति वेबसाइट
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Sprout className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-extrabold text-slate-900">KCC व लोन सहायता</span>
                  </div>
                  <p className="text-[11px] text-slate-600">किसान क्रेडिट कार्ड एवं बैंक लोन</p>
                  <div className="mt-2 text-sm font-black text-emerald-700">
                    💰 ₹100 - ₹500 प्रति फाइल
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200">
                  <div className="flex items-center gap-2 mb-1">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-extrabold text-slate-900">स्मार्ट PVC प्लास्टिक कार्ड्स</span>
                  </div>
                  <p className="text-[11px] text-slate-600">वाटरप्रूफ आधार, पैन व आयुष्मान कार्ड</p>
                  <div className="mt-2 text-sm font-black text-blue-700">
                    💰 ₹20 प्रति कार्ड
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-100 rounded-xl text-center text-xs text-slate-600">
                ⚡ कमीशन हर सप्ताह या ग्राहक का काम पूरा होते ही सीधे आपके UPI ID पर ट्रांसफर किया जाता है।
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 font-medium">
            अनु कृपा ऑनलाइन • उकेड़िया, जावरा (रतलाम)
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-xs transition-colors"
          >
            बंद करें
          </button>
        </div>

      </div>

    </div>
  );
}
