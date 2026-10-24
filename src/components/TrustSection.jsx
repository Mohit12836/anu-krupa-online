import React from 'react';
import { 
  CheckCircle2, 
  FileCheck, 
  Users, 
  LayoutGrid, 
  MessageCircle, 
  MapPin, 
  Clock, 
  Award,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { TRUST_FEATURES } from '../data/bannersData';
import { BUSINESS_CONFIG, createWhatsAppInquiryLink } from '../data/businessConfig';

const iconMap = {
  CheckCircle2,
  FileCheck,
  Users,
  LayoutGrid,
  MessageCircle,
};

export default function TrustSection() {
  const whatsAppUrl = createWhatsAppInquiryLink({
    serviceName: "सामान्य सहायता व परामर्श"
  });

  return (
    <section className="py-8 sm:py-12 bg-white">
      <div className="fluid-container">
        
        {/* Heading: हमें क्यों चुनें? */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            हमें क्यों चुनें?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            उकेड़िया और आसपास के क्षेत्र का सबसे भरोसेमंद, पारदर्शी और अनुभवी डिजिटल सेवा केंद्र
          </p>
        </div>

        {/* 5 Features Grid matching reference design */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 mb-10">
          {TRUST_FEATURES.map((feat) => {
            const IconComponent = iconMap[feat.icon] || CheckCircle2;
            return (
              <div
                key={feat.id}
                className="p-4 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-white hover:border-slate-200 hover:shadow-md transition-all text-center flex flex-col items-center justify-start group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-105 ${feat.color}`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 mb-1">
                  {feat.titleHi}
                </h3>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  {feat.descHi}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom Verified Shop Status Strip matching reference footer bar */}
        <div className="bg-[#0A192F] text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
            
            {/* Stat 1: 5000+ Completed */}
            <div className="flex items-center gap-3 border-b sm:border-b-0 sm:border-r border-slate-800 pb-3 sm:pb-0 sm:pr-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-extrabold text-white block leading-tight">5000+</span>
                <span className="text-xs text-slate-400 font-medium">संतुष्ट कार्य व सेवाएं</span>
              </div>
            </div>

            {/* Stat 2: 50+ Services */}
            <div className="flex items-center gap-3 border-b sm:border-b-0 lg:border-r border-slate-800 pb-3 sm:pb-0 sm:pr-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <LayoutGrid className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-extrabold text-white block leading-tight">{BUSINESS_CONFIG.servicesCount}</span>
                <span className="text-xs text-slate-400 font-medium">सरकारी एवं निजी सेवाएं</span>
              </div>
            </div>

            {/* Info 3: Location */}
            <div className="flex items-center gap-3 border-b sm:border-b-0 sm:border-r border-slate-800 pb-3 sm:pb-0 sm:pr-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-medium">हमारा भौतिक पता</span>
                <span className="text-xs sm:text-sm font-bold text-white block truncate">{BUSINESS_CONFIG.shortLocation}</span>
              </div>
            </div>

            {/* Info 4: Timing */}
            <div className="flex items-center gap-3 border-b sm:border-b-0 lg:border-r border-slate-800 pb-3 sm:pb-0 sm:pr-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-medium">हमारा सेवा समय</span>
                <span className="text-xs sm:text-sm font-bold text-white block">{BUSINESS_CONFIG.workingHoursHi}</span>
              </div>
            </div>

            {/* CTA 5: Instant WhatsApp */}
            <div className="pt-2 sm:pt-0">
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl font-bold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 tap-bounce transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <div className="text-left leading-tight">
                  <span className="text-[10px] text-emerald-100 block font-normal">अब ही WhatsApp करें</span>
                  <span className="font-extrabold">{BUSINESS_CONFIG.whatsappDisplay}</span>
                </div>
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
