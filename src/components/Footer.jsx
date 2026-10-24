import React from 'react';
import { 
  MapPin, 
  Clock, 
  MessageCircle, 
  ShieldCheck, 
  ExternalLink,
  Info
} from 'lucide-react';
import { BUSINESS_CONFIG, createWhatsAppInquiryLink } from '../data/businessConfig';
import { CATEGORIES } from '../data/categoriesData';

export default function Footer({ onSelectCategory }) {
  const whatsAppUrl = createWhatsAppInquiryLink({
    serviceName: "सामान्य जानकारी"
  });

  return (
    <footer className="bg-[#0A192F] text-slate-300 pt-10 pb-20 md:pb-12 border-t border-slate-800 text-xs sm:text-sm">
      <div className="fluid-container">
        
        {/* Main 4-Column Responsive Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          
          {/* Col 1: About & Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center font-extrabold text-white text-xl">
                AK
              </div>
              <div>
                <span className="font-bold text-lg text-white">Anu Krupa</span>
                <span className="font-extrabold text-lg text-orange-400 ml-1">Online</span>
                <p className="text-[10px] text-slate-400 font-medium">{BUSINESS_CONFIG.taglineHi}</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              उकेड़िया, जावरा (रतलाम) का अग्रणी एवं विश्वसनीय डिजिटल सेवा केंद्र। किसान सेवा, RTO, GST, पैन कार्ड व 50+ ऑनलाइन सेवाओं के लिए आपका स्थायी साथी।
            </p>

            {/* Calling Disabled Policy Box */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 flex items-start gap-2">
              <Info className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <span>{BUSINESS_CONFIG.callingPolicyNoteHi}</span>
            </div>
          </div>

          {/* Col 2: Categories Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              प्रमुख सेवाएं (Quick Links)
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {CATEGORIES.slice(1, 7).map(cat => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      onSelectCategory(cat.id);
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className="hover:text-orange-400 transition-colors text-left flex items-center gap-1.5"
                  >
                    <span>•</span>
                    <span>{cat.nameHi}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Physical Address & Timings */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              दुकान का पता व समय
            </h4>

            <div className="flex items-start gap-2.5 text-xs text-slate-300">
              <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white">अनु कृपा ऑनलाइन केंद्र</strong>
                <span>{BUSINESS_CONFIG.fullAddressHi}</span>
                <span className="block text-[11px] text-slate-400 mt-0.5">({BUSINESS_CONFIG.landmark})</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-xs text-slate-300">
              <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white">दुकान खुलने का समय</strong>
                <span>{BUSINESS_CONFIG.workingHoursHi}</span>
                <span className="block text-[11px] text-emerald-400">{BUSINESS_CONFIG.workingDaysHi}</span>
              </div>
            </div>
          </div>

          {/* Col 4: Official WhatsApp & Updates */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              आधिकारिक सहायता
            </h4>

            <p className="text-xs text-slate-400">
              किसी भी सरकारी फॉर्म या सेवा की प्रक्रिया समझने के लिए हमारे WhatsApp पर संदेश भेजें:
            </p>

            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white py-2.5 px-4 rounded-xl font-bold text-xs shadow tap-bounce transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>WhatsApp: {BUSINESS_CONFIG.whatsappDisplay}</span>
            </a>

            {/* Optional Channel Invite */}
            <div className="pt-2">
              <span className="text-[11px] text-slate-400 block mb-1">
                सरकारी योजना अलर्ट के लिए:
              </span>
              <a
                href={BUSINESS_CONFIG.whatsappChannelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold inline-flex items-center gap-1 hover:underline"
              >
                <span>WhatsApp चैनल फ़ॉलो करें (स्वैच्छिक)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

        </div>

        {/* Legal Disclaimer & Transparency Note */}
        <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="max-w-3xl">
            <strong>अस्वीकरण (Disclaimer):</strong> Anu Krupa Online एक निजी अधिकृत ग्राहक सुविधा व ई-सर्विस प्रदाता केंद्र है। हम सरकारी व अर्ध-सरकारी पोर्टल्स पर नागरिकों के लिए फॉर्म भरने, आवेदन करने, मार्गदर्शन और दस्तावेज़ प्रक्रिया में सहायता प्रदान करते हैं। हम किसी सरकारी विभाग के सीधे प्रतिनिधि नहीं हैं। सभी सरकारी योजनाओं के नियम संबंधित विभागों के आधीन हैं।
          </p>

          <p className="shrink-0 text-slate-400">
            © {new Date().getFullYear()} Anu Krupa Online. All Rights Reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
