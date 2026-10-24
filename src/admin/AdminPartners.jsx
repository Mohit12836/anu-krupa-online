import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Copy, 
  Check, 
  DollarSign, 
  Share2, 
  Award, 
  CheckCircle2, 
  Clock, 
  MessageCircle, 
  ExternalLink,
  Sparkles,
  Phone,
  MapPin,
  TrendingUp,
  X
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function AdminPartners({ onOpenAddPartner }) {
  const { partners, inquiries, markCommissionPaid, updatePartnerStatus } = useStore();

  const [search, setSearch] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(null);
  const [payingPartner, setPayingPartner] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Financial KPIs
  const totalPartners = partners.length;
  const activePartners = partners.filter(p => p.status === 'ACTIVE').length;
  const totalEarned = partners.reduce((sum, p) => sum + (p.commissionEarned || 0), 0);
  const totalPaid = partners.reduce((sum, p) => sum + (p.commissionPaid || 0), 0);
  const pendingPayout = Math.max(0, totalEarned - totalPaid);

  // Filtered Partners
  const filteredPartners = partners.filter(p => {
    const term = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      p.id.toLowerCase().includes(term) ||
      p.phone.includes(term) ||
      (p.village && p.village.toLowerCase().includes(term)) ||
      (p.upiId && p.upiId.toLowerCase().includes(term))
    );
  });

  // Recent Inquiries referred by partners
  const referralInquiries = inquiries.filter(i => i.partnerId);

  const handleCopyUpi = (upiId, partnerId) => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(partnerId);
    setToastMessage(`✓ UPI ID "${upiId}" क्लिपबोर्ड पर कॉपी हो गया! PhonePe या GPay में पेस्ट करें।`);
    setTimeout(() => {
      setCopiedUpi(null);
      setToastMessage(null);
    }, 3000);
  };

  const handleConfirmPayment = (e) => {
    e.preventDefault();
    if (!payingPartner) return;

    const amount = Number(payAmount) || (payingPartner.commissionEarned - (payingPartner.commissionPaid || 0));
    markCommissionPaid(payingPartner.id, amount);
    setToastMessage(`✓ पार्टनर ${payingPartner.name} को ₹${amount} कमीशन भुगतान मार्क कर दिया गया!`);
    setPayingPartner(null);
    setPayAmount('');
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-5">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3.5 bg-emerald-600 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-lg flex items-center justify-between animate-in slide-in-from-top-2 duration-200">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="p-1 hover:bg-emerald-700 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header & Overview */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Users className="w-6 h-6 text-indigo-600" />
              <span>पार्टनर एवं रेफरल कमीशन</span>
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
              Work From Home
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            गांव-गांव में आपके पार्टनर ऑनलाइन सेवाएं शेयर कर रहे हैं। यहाँ उनकी लीड्स व कमीशन ट्रैक करें।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-[11px] text-slate-500 font-bold block">कुल बकाया कमीशन</span>
            <span className="text-lg sm:text-xl font-black text-amber-600">
              ₹{pendingPayout}
            </span>
          </div>
        </div>
      </div>

      {/* 4 Financial & Operational KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs text-slate-500 font-bold block">कुल रजिस्टर्ड पार्टनर</span>
          <span className="text-2xl font-black text-slate-900 block mt-1">{totalPartners}</span>
          <span className="text-[11px] text-emerald-600 font-semibold">{activePartners} एक्टिव</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs text-slate-500 font-bold block">कुल रेफरल ऑर्डर्स</span>
          <span className="text-2xl font-black text-blue-600 block mt-1">{referralInquiries.length}</span>
          <span className="text-[11px] text-slate-500">ग्राहकों द्वारा पूछताछ</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs text-slate-500 font-bold block">कुल कमीशन जनरेटेड</span>
          <span className="text-2xl font-black text-emerald-600 block mt-1">₹{totalEarned}</span>
          <span className="text-[11px] text-slate-500">पार्टनर्स द्वारा कमाया</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs text-slate-500 font-bold block">कुल भुगतान किया गया</span>
          <span className="text-2xl font-black text-slate-700 block mt-1">₹{totalPaid}</span>
          <span className="text-[11px] text-slate-500">UPI द्वारा ट्रांसफर्ड</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="पार्टनर का नाम, ID (AKP-xxxx), मोबाइल या UPI ID खोजें..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
        />
      </div>

      {/* Partners List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
          <span>पार्टनर्स की सूची ({filteredPartners.length})</span>
          <span>कमीशन व भुगतान एक्शन</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {filteredPartners.map((partner) => {
            const pending = Math.max(0, (partner.commissionEarned || 0) - (partner.commissionPaid || 0));
            const isCopied = copiedUpi === partner.id;

            return (
              <div 
                key={partner.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Top line: Partner ID and Status */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 font-mono font-black text-xs border border-indigo-200">
                      {partner.id}
                    </span>
                    <button
                      onClick={() => updatePartnerStatus(partner.id, partner.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE')}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors ${
                        partner.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : 'bg-slate-100 text-slate-600 border-slate-300'
                      }`}
                    >
                      {partner.status === 'ACTIVE' ? 'सक्रिय (Active)' : 'रोका गया (Paused)'}
                    </button>
                  </div>

                  {/* Partner Name & Location */}
                  <h3 className="text-base font-extrabold text-slate-900">
                    {partner.name}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {partner.village}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {partner.phone}
                    </span>
                  </div>

                  {/* UPI ID with 1-Click Copy */}
                  <div className="mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">UPI ID Payout</span>
                      <span className="font-mono text-xs font-bold text-slate-900">{partner.upiId}</span>
                    </div>
                    <button
                      onClick={() => handleCopyUpi(partner.upiId, partner.id)}
                      className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 rounded-lg text-xs font-bold border border-slate-300 flex items-center gap-1 tap-bounce shadow-sm"
                      title="UPI ID कॉपी करें"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'कॉपी हुआ' : 'कॉपी'}</span>
                    </button>
                  </div>

                  {/* Stats Numbers */}
                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">लीड्स</span>
                      <span className="font-extrabold text-blue-600">{partner.leadsCount || 0}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">कुल कमाई</span>
                      <span className="font-extrabold text-emerald-600">₹{partner.commissionEarned || 0}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">बकाया</span>
                      <span className={`font-extrabold ${pending > 0 ? 'text-amber-600' : 'text-slate-500'}`}>
                        ₹{pending}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setPayingPartner(partner);
                      setPayAmount(pending.toString());
                    }}
                    disabled={pending <= 0}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all tap-bounce ${
                      pending > 0
                        ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>{pending > 0 ? `₹${pending} भुगतान मार्क करें` : 'कोई बकाया नहीं'}</span>
                  </button>

                  <a
                    href={`https://wa.me/91${partner.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`नमस्ते ${partner.name} जी, Anu Krupa Online से आपका कमीशन अपडेट:`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl border border-emerald-200 transition-colors"
                    title="पार्टनर को WhatsApp मैसेज करें"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Pay Modal */}
      {payingPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900">
                कमीशन भुगतान पुष्टि (Record Payout)
              </h3>
              <button onClick={() => setPayingPartner(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              पार्टनर: <strong className="text-slate-900">{payingPartner.name}</strong> ({payingPartner.id})<br />
              UPI ID: <strong className="font-mono text-indigo-600">{payingPartner.upiId}</strong>
            </p>

            <form onSubmit={handleConfirmPayment} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">
                  भुगतान की गई राशि (₹ में):
                </label>
                <input
                  type="number"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  placeholder="राशि"
                  className="w-full p-2.5 text-sm font-bold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-800 border border-amber-200">
                💡 अपने PhonePe या GPay से ऊपर दी गई UPI ID पर पैसे भेजने के बाद यहाँ "कन्फर्म" बटन दबाएं।
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md tap-bounce transition-all"
                >
                  ✓ भुगतान कन्फर्म करें
                </button>
                <button
                  type="button"
                  onClick={() => setPayingPartner(null)}
                  className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold text-xs"
                >
                  रद्द करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Referral Inquiries Pipeline */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          <span>पार्टनर्स द्वारा भेजी गई हाल की ग्राहक पूछताछ ({referralInquiries.length})</span>
        </h3>

        {referralInquiries.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            अभी तक कोई रेफरल पूछताछ दर्ज नहीं हुई है।
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {referralInquiries.map((inq) => (
              <div key={inq.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{inq.serviceName}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      रेफरल: {inq.partnerName || inq.partnerId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    विकल्प: {inq.selectedOption} • {inq.note || 'कोई विशेष नोट नहीं'}
                  </p>
                </div>
                <div className="text-xs font-mono text-slate-400">
                  {inq.createdAt}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
