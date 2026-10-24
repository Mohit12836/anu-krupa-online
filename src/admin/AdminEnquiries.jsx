import React, { useState } from 'react';
import { 
  MessageCircle, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Filter, 
  Search,
  ExternalLink,
  User,
  Phone
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function AdminEnquiries() {
  const { inquiries, updateInquiryStatus } = useStore();
  const [filterStatus, setFilterStatus] = useState('ALL');

  const filtered = inquiries.filter((inq) => {
    if (filterStatus === 'ALL') return true;
    return inq.status === filterStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'NEW':
        return { label: 'नई पूछताछ', color: 'bg-amber-100 text-amber-800 border-amber-300' };
      case 'IN_PROGRESS':
        return { label: 'प्रक्रिया में', color: 'bg-blue-100 text-blue-800 border-blue-300' };
      case 'COMPLETED':
        return { label: 'काम पूरा हुआ ✓', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      case 'CLOSED':
        return { label: 'बंद / निरस्त', color: 'bg-slate-200 text-slate-700 border-slate-300' };
      default:
        return { label: status, color: 'bg-slate-100 text-slate-600 border-slate-200' };
    }
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      
      {/* Header & Status Filter Pills */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>ग्राहक पूछताछ एवं लीड्स (Inquiries Pipeline)</span>
            </h2>
            <p className="text-[11px] text-slate-500">काम की स्थिति 1-टैप में बदलें</p>
          </div>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {inquiries.length} कुल लीड्स
          </span>
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
              filterStatus === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            सभी ({inquiries.length})
          </button>
          <button
            onClick={() => setFilterStatus('NEW')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
              filterStatus === 'NEW'
                ? 'bg-amber-500 text-white'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            नई ({inquiries.filter(i => i.status === 'NEW').length})
          </button>
          <button
            onClick={() => setFilterStatus('IN_PROGRESS')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
              filterStatus === 'IN_PROGRESS'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
            }`}
          >
            प्रक्रिया में ({inquiries.filter(i => i.status === 'IN_PROGRESS').length})
          </button>
          <button
            onClick={() => setFilterStatus('COMPLETED')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
              filterStatus === 'COMPLETED'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            पूर्ण ({inquiries.filter(i => i.status === 'COMPLETED').length})
          </button>
        </div>
      </div>

      {/* Inquiries List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 text-xs">
            इस श्रेणी में कोई पूछताछ नहीं है।
          </div>
        ) : (
          filtered.map((inq) => {
            const badge = getStatusBadge(inq.status);

            return (
              <div
                key={inq.id}
                className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-3 hover:border-slate-300 transition-all"
              >
                {/* Top Row: Customer info & Status */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                        {inq.customerName}
                      </h4>
                      <span className="text-[10px] text-slate-400 block">
                        प्राप्त: {inq.createdAt}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${badge.color}`}>
                    {badge.label}
                  </span>
                </div>

                {/* Service & Note Box */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span>{inq.serviceName}</span>
                    <span className="text-orange-600 font-semibold">• {inq.selectedOption}</span>
                  </div>
                  {inq.note && (
                    <p className="text-[11px] text-slate-600 mt-1 italic">
                      "{inq.note}"
                    </p>
                  )}
                </div>

                {/* Status Switch Buttons (1-Tap Change) */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-1 text-[11px]">
                    <span className="text-slate-400 mr-1">स्थिति बदलें:</span>
                    <button
                      type="button"
                      onClick={() => updateInquiryStatus(inq.id, 'NEW')}
                      className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold transition-all ${
                        inq.status === 'NEW'
                          ? 'bg-amber-500 text-white border-amber-500'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      नई
                    </button>
                    <button
                      type="button"
                      onClick={() => updateInquiryStatus(inq.id, 'IN_PROGRESS')}
                      className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold transition-all ${
                        inq.status === 'IN_PROGRESS'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      प्रक्रिया में
                    </button>
                    <button
                      type="button"
                      onClick={() => updateInquiryStatus(inq.id, 'COMPLETED')}
                      className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold transition-all ${
                        inq.status === 'COMPLETED'
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      पूर्ण ✓
                    </button>
                  </div>

                  {/* Direct WhatsApp Response link */}
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`नमस्ते, Anu Krupa Online से आपके ${inq.serviceName} के आवेदन की स्थिति के संबंध में संदेश है।`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors tap-bounce"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>जवाब भेजें</span>
                  </a>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
