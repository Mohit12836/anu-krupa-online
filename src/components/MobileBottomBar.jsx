import React from 'react';
import { Home, LayoutGrid, Sparkles, MessageCircle, MapPin } from 'lucide-react';
import { BUSINESS_CONFIG, createWhatsAppInquiryLink } from '../data/businessConfig';

export default function MobileBottomBar({ onSelectCategory, onOpenGuided }) {
  const whatsAppUrl = createWhatsAppInquiryLink({
    serviceName: "मोबाइल से सामान्य पूछताछ"
  });

  const scrollToServices = () => {
    onSelectCategory('all');
    const el = document.getElementById('services-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTrust = () => {
    const el = document.getElementById('trust-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A192F] border-t border-slate-800 text-slate-300 py-1.5 px-3 shadow-2xl backdrop-blur-lg">
      <div className="flex items-center justify-between">
        
        {/* Home */}
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            onSelectCategory('all');
          }}
          className="flex flex-col items-center justify-center py-1 px-2 text-slate-300 hover:text-orange-400 transition-colors tap-bounce"
        >
          <Home className="w-4 h-4" />
          <span className="text-[10px] font-medium mt-0.5">होम</span>
        </button>

        {/* Services */}
        <button
          onClick={scrollToServices}
          className="flex flex-col items-center justify-center py-1 px-2 text-slate-300 hover:text-orange-400 transition-colors tap-bounce"
        >
          <LayoutGrid className="w-4 h-4" />
          <span className="text-[10px] font-medium mt-0.5">सेवाएं</span>
        </button>

        {/* Big Center WhatsApp Button */}
        <div className="relative -top-3">
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg shadow-emerald-500/40 border-2 border-white tap-bounce"
            title="Chat on WhatsApp"
          >
            <MessageCircle className="w-6 h-6 fill-white" />
          </a>
        </div>

        {/* Guided Help */}
        <button
          onClick={onOpenGuided}
          className="flex flex-col items-center justify-center py-1 px-2 text-slate-300 hover:text-orange-400 transition-colors tap-bounce"
        >
          <Sparkles className="w-4 h-4 text-orange-400" />
          <span className="text-[10px] font-medium mt-0.5">सहायता</span>
        </button>

        {/* Shop Info / Location */}
        <button
          onClick={scrollToTrust}
          className="flex flex-col items-center justify-center py-1 px-2 text-slate-300 hover:text-orange-400 transition-colors tap-bounce"
        >
          <MapPin className="w-4 h-4 text-emerald-400" />
          <span className="text-[10px] font-medium mt-0.5">दुकान</span>
        </button>

      </div>
    </div>
  );
}
