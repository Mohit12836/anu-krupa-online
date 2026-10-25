import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroBanners from './components/HeroBanners';
import CategoryGrid from './components/CategoryGrid';
import PopularServices from './components/PopularServices';
import GuidedDiscovery from './components/GuidedDiscovery';
import PromoStrip from './components/PromoStrip';
import CustomWorkBox from './components/CustomWorkBox';
import TrustSection from './components/TrustSection';
import ServiceModal from './components/ServiceModal';
import MobileBottomBar from './components/MobileBottomBar';
import Footer from './components/Footer';
import AdminLayout from './admin/AdminLayout';
import PartnerOnboardingModal from './components/PartnerOnboardingModal';
import { StoreProvider, useStore } from './context/StoreContext';
import { Shield, Sparkles, Store, Award, UserCheck } from 'lucide-react';

function CustomerView({ onSwitchToAdmin }) {
  const { settings, activeRef, partners } = useStore();
  const [selectedVertical, setSelectedVertical] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeModalService, setActiveModalService] = useState(null);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);

  const matchedPartner = activeRef ? partners.find(p => p.id === activeRef) : null;

  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    if (catId !== 'all') {
      const el = document.getElementById('services-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleOpenGuided = () => {
    const el = document.getElementById('guided-discovery');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-orange-500 selection:text-white pb-14 md:pb-0 relative">
      
      {/* 0. Active Referral Welcome Strip (When arriving with ?ref=AKP-XXXX) */}
      {settings.showReferralBanner !== false && activeRef && (
        <div className="bg-gradient-to-r from-indigo-950 via-blue-900 to-indigo-950 text-white text-xs font-bold py-2 px-3 text-center shadow-md flex items-center justify-center gap-2 border-b border-indigo-400/30">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>
            🤝 आप हमारे अधिकृत डिजिटल पार्टनर <strong>{matchedPartner ? matchedPartner.name : activeRef} ({activeRef})</strong> के विशेष रेफरल से जुड़े हैं। आपको मिलेगी प्राथमिकता सेवा!
          </span>
        </div>
      )}

      {/* 1. Header & Live Navigation */}
      <Navbar 
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        onSelectService={(service) => setActiveModalService(service)}
        onOpenPartnerModal={() => setIsPartnerModalOpen(true)}
      />

      {/* Optional Store Closed Notice */}
      {!settings.isOpenToday && (
        <div className="bg-rose-50 border-b border-rose-200 py-2.5 px-4 text-center text-xs font-bold text-rose-800 flex items-center justify-center gap-2">
          <Store className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{settings.shopClosedReason || 'आज दुकान का अवकाश है। आप WhatsApp पर अपना काम छोड़ सकते हैं, कल सुबह प्राथमिकता से किया जाएगा।'}</span>
        </div>
      )}

      {/* Main Page Chapters */}
      <main className="flex-1">
        {/* 2. Hero Slider & Side Banners */}
        <HeroBanners 
          onSelectCategory={handleSelectCategory}
          onOpenGuided={handleOpenGuided}
        />

        {/* 3. Multi-Level Categories & Macro Verticals Quick Grid */}
        <CategoryGrid 
          selectedVertical={selectedVertical}
          onSelectVertical={setSelectedVertical}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
          onOpenPartnerModal={() => setIsPartnerModalOpen(true)}
        />

        {/* 4. Popular Services & Products Grid with WhatsApp CTA & Transparent Fees */}
        <PopularServices 
          selectedVertical={selectedVertical}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
          onSelectService={(service) => setActiveModalService(service)}
          onOpenPartnerModal={() => setIsPartnerModalOpen(true)}
        />

        {/* 5. Guided Service Discovery (PhonePe-Style 3-Tap Flow) */}
        <GuidedDiscovery 
          onSelectService={(service) => setActiveModalService(service)}
        />

        {/* 6. Highlight Promo Cards (Loans, Solar Pump Subsidy, Ayushman Card) */}
        {settings.showPromoStrip !== false && (
          <PromoStrip 
            onSelectCategory={handleSelectCategory}
          />
        )}

        {/* 7. Need Help with Something Else? (Custom Work Inquiry) */}
        <CustomWorkBox />

        {/* 8. Trust Section & Verified Physical Shop Details (Ukediya, Jaora) */}
        <div id="trust-section">
          <TrustSection />
        </div>
      </main>

      {/* 9. Comprehensive Footer */}
      <Footer onSelectCategory={handleSelectCategory} />

      {/* Interactive Detail Modal / Bottom Sheet */}
      {activeModalService && (
        <ServiceModal 
          service={activeModalService}
          onClose={() => setActiveModalService(null)}
        />
      )}

      {/* Work-From-Home Partner Registration & Dashboard Modal */}
      <PartnerOnboardingModal
        isOpen={isPartnerModalOpen}
        onClose={() => setIsPartnerModalOpen(false)}
      />

      {/* Mobile-Only Sticky Bottom Bar (1-Hand Navigation) */}
      <MobileBottomBar 
        onSelectCategory={handleSelectCategory}
        onOpenGuided={handleOpenGuided}
      />

      {/* Floating Action Buttons: Work-From-Home Partner & Owner Admin */}
      <aside 
        aria-label="Admin and Partner Action Switchers"
        className="fixed bottom-18 sm:bottom-6 right-3 sm:right-6 z-40 flex items-center gap-2"
      >
        {/* WFH Partner Button */}
        <button
          onClick={() => setIsPartnerModalOpen(true)}
          className="px-3.5 py-2 sm:px-4 sm:py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 rounded-full text-xs font-black shadow-2xl border border-amber-300 backdrop-blur-md flex items-center gap-1.5 tap-bounce transition-all hover:scale-105 active:scale-95 group"
          title="Work From Home पार्टनर बनें"
        >
          <Sparkles className="w-3.5 h-3.5 text-slate-950 animate-bounce" />
          <span className="hidden sm:inline">💼 Partner (20%-50%)</span>
          <span className="sm:hidden">पार्टनर</span>
        </button>

        {/* Owner Admin Switcher */}
        <button
          onClick={onSwitchToAdmin}
          className="px-3.5 py-2 sm:px-4 sm:py-2.5 bg-slate-900/95 hover:bg-black text-white rounded-full text-xs font-bold shadow-2xl border border-slate-700/80 backdrop-blur-md flex items-center gap-2 tap-bounce transition-all hover:scale-105 active:scale-95 group"
          title="मालिक कंट्रोल पैनल (Admin Panel)"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-orange-400 animate-pulse group-hover:bg-emerald-400" />
          <Shield className="w-3.5 h-3.5 text-orange-400 group-hover:text-emerald-400" />
          <span className="hidden sm:inline">📱 Owner Admin</span>
          <span className="sm:hidden">Admin</span>
        </button>
      </aside>

    </div>
  );
}

function MainApp() {
  const checkIsAdminPath = () => {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname.toLowerCase();
    return path.includes('aaadmin') || path.includes('/admin');
  };

  const [viewMode, setViewMode] = useState(() => (checkIsAdminPath() ? 'admin' : 'customer'));

  // Listen to browser navigation (Back / Forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      setViewMode(checkIsAdminPath() ? 'admin' : 'customer');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSwitchToAdmin = () => {
    window.history.pushState({}, '', '/aaadmin');
    setViewMode('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSwitchToCustomer = () => {
    window.history.pushState({}, '', '/');
    setViewMode('customer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (viewMode === 'admin') {
    return (
      <AdminLayout onSwitchToCustomer={handleSwitchToCustomer} />
    );
  }

  return (
    <CustomerView onSwitchToAdmin={handleSwitchToAdmin} />
  );
}

export default function App() {
  return (
    <StoreProvider>
      <MainApp />
    </StoreProvider>
  );
}
