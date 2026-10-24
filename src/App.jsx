import React, { useState } from 'react';
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
import { StoreProvider, useStore } from './context/StoreContext';
import { Shield, Sparkles, Store } from 'lucide-react';

function CustomerView({ onSwitchToAdmin }) {
  const { settings } = useStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeModalService, setActiveModalService] = useState(null);

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
      
      {/* 1. Header & Live Navigation */}
      <Navbar 
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        onSelectService={(service) => setActiveModalService(service)}
      />

      {/* Optional Store Closed Notice */}
      {!settings.isOpenToday && (
        <div className="bg-rose-50 border-b border-rose-200 py-2 px-4 text-center text-xs font-bold text-rose-800 flex items-center justify-center gap-2">
          <Store className="w-4 h-4 text-rose-600" />
          <span>आज दुकान का अवकाश है। आप WhatsApp पर अपना काम छोड़ सकते हैं, कल सुबह प्राथमिकता से किया जाएगा।</span>
        </div>
      )}

      {/* Main Page Chapters */}
      <main className="flex-1">
        {/* 2. Hero Slider & Side Banners */}
        <HeroBanners 
          onSelectCategory={handleSelectCategory}
          onOpenGuided={handleOpenGuided}
        />

        {/* 3. 9 Service Categories Quick Grid */}
        <CategoryGrid 
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />

        {/* 4. Popular Services Grid with WhatsApp CTA & Document View */}
        <PopularServices 
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
          onSelectService={(service) => setActiveModalService(service)}
        />

        {/* 5. Guided Service Discovery (PhonePe-Style 3-Tap Flow) */}
        <GuidedDiscovery 
          onSelectService={(service) => setActiveModalService(service)}
        />

        {/* 6. Highlight Promo Cards (Loans, Solar Pump Subsidy, Ayushman Card) */}
        <PromoStrip 
          onSelectCategory={handleSelectCategory}
        />

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

      {/* Mobile-Only Sticky Bottom Bar (1-Hand Navigation) */}
      <MobileBottomBar 
        onSelectCategory={handleSelectCategory}
        onOpenGuided={handleOpenGuided}
      />

      {/* Floating 1-Tap Switcher to Owner Admin Panel */}
      <aside 
        aria-label="Admin Control Switcher"
        className="fixed bottom-18 sm:bottom-6 right-3 sm:right-6 z-40"
      >
        <button
          onClick={onSwitchToAdmin}
          className="px-3.5 py-2 sm:px-4 sm:py-2.5 bg-slate-900/95 hover:bg-black text-white rounded-full text-xs font-bold shadow-2xl border border-slate-700/80 backdrop-blur-md flex items-center gap-2 tap-bounce transition-all hover:scale-105 active:scale-95 group"
          title="मालिक कंट्रोल पैनल (Admin Panel)"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-orange-400 animate-pulse group-hover:bg-emerald-400" />
          <Shield className="w-3.5 h-3.5 text-orange-400 group-hover:text-emerald-400" />
          <span className="hidden sm:inline">📱 Owner Admin Panel</span>
          <span className="sm:hidden">Admin</span>
        </button>
      </aside>

    </div>
  );
}

function MainApp() {
  const [viewMode, setViewMode] = useState('customer'); // 'customer' | 'admin'

  if (viewMode === 'admin') {
    return (
      <AdminLayout onSwitchToCustomer={() => setViewMode('customer')} />
    );
  }

  return (
    <CustomerView onSwitchToAdmin={() => setViewMode('admin')} />
  );
}

export default function App() {
  return (
    <StoreProvider>
      <MainApp />
    </StoreProvider>
  );
}
