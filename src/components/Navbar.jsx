import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Search, 
  MessageCircle, 
  Menu, 
  X, 
  ChevronDown, 
  ShieldCheck,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { BUSINESS_CONFIG, createWhatsAppInquiryLink } from '../data/businessConfig';
import { CATEGORIES } from '../data/categoriesData';
import { useStore } from '../context/StoreContext';
import { Sparkles } from 'lucide-react';

export default function Navbar({ selectedCategory, onSelectCategory, onSelectService, onOpenPartnerModal }) {
  const { services, settings, activeRef, recordInquiry } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const searchRef = useRef(null);

  // Live auto-suggest search using dynamic active services
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      const filtered = services.filter(s => 
        !s.isHidden && s.availability !== 'hidden' && s.availability !== 'paused' && (
          (s.nameHi && s.nameHi.toLowerCase().includes(q)) ||
          (s.nameEn && s.nameEn.toLowerCase().includes(q)) ||
          (s.name && s.name.toLowerCase().includes(q)) ||
          (s.taglineHi && s.taglineHi.toLowerCase().includes(q)) ||
          (s.options && s.options.some(opt => opt.toLowerCase().includes(q))) ||
          (s.popularOptions && s.popularOptions.some(opt => opt.toLowerCase().includes(q)))
        )
      );
      setSearchResults(filtered.slice(0, 6));
      setIsSearchOpen(true);
    } else {
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  }, [searchQuery, services]);

  // Click outside to close search suggestions
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchResultClick = (service) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    if (onSelectService) {
      onSelectService(service);
    }
  };

  const directWhatsAppUrl = createWhatsAppInquiryLink({
    serviceName: searchQuery ? `सर्च इन्क्वायरी: ${searchQuery}` : "सामान्य पूछताछ",
    whatsappNumber: settings.whatsappPhone,
  });

  return (
    <header className="sticky top-0 z-40 w-full shadow-md">
      {/* 0. Live Announcement Notice Banner (Controlled by Owner Admin) */}
      {settings.announcementBanner && (
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white text-[11px] sm:text-xs font-bold py-1.5 px-3 text-center shadow-inner flex items-center justify-center gap-2 border-b border-orange-500/30">
          <span className="animate-pulse">📢</span>
          <span className="truncate">{settings.announcementBanner}</span>
        </div>
      )}

      {/* Top Main Navy Header */}
      <div className="bg-[#0A192F] text-white border-b border-slate-800">
        <div className="fluid-container py-2 sm:py-2.5">
          {/* Main Top Bar */}
          <div className="flex items-center justify-between gap-2.5 md:gap-6">
            
            {/* Logo & Brand Identity */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 cursor-pointer" onClick={() => onSelectCategory('all')}>
              <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center font-extrabold text-white text-lg sm:text-xl md:text-2xl shadow-inner border border-orange-400/30">
                AK
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-sm sm:text-base md:text-xl tracking-tight text-white">Anu Krupa</span>
                  <span className="font-extrabold text-sm sm:text-base md:text-xl text-orange-400">Online</span>
                </div>
                <p className="text-[10px] md:text-xs text-slate-300 font-medium tracking-wide hidden sm:block">
                  {BUSINESS_CONFIG.tagline}
                </p>
              </div>
            </div>

            {/* Location Badge (Desktop) */}
            <div className="hidden lg:flex items-center gap-2 text-xs text-slate-300 border-l border-r border-slate-700/60 px-4 py-1">
              <MapPin className="w-4 h-4 text-orange-400 shrink-0 animate-pulse" />
              <div>
                <span className="block text-[10px] text-slate-400 uppercase tracking-wider">Our Location</span>
                <span className="font-semibold text-white whitespace-nowrap">{BUSINESS_CONFIG.shortLocation}</span>
              </div>
            </div>

            {/* Amazon-Style Live Search Bar (Desktop) */}
            <div ref={searchRef} className="relative flex-1 max-w-2xl mx-1 md:mx-2 hidden md:block">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.trim() && setIsSearchOpen(true)}
                  placeholder="आपको कौन सी सेवा चाहिए? जैसे - KCC, PAN, RTO, Bill..."
                  className="w-full h-10 md:h-11 pl-4 pr-11 md:pr-12 rounded-lg bg-white text-slate-900 placeholder:text-slate-400 text-xs md:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
                />
                <button 
                  type="button"
                  className="absolute right-0 top-0 bottom-0 px-3 md:px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-r-lg flex items-center justify-center transition-colors tap-bounce"
                  title="Search Service"
                >
                  <Search className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>

              {/* Auto-suggest dropdown results */}
              {isSearchOpen && searchResults.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-white text-slate-900 rounded-lg shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>मिलती-जुलती सेवाएं ({searchResults.length})</span>
                    <span>Tap to view details</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {searchResults.map((service) => (
                      <div
                        key={service.id}
                        onClick={() => handleSearchResultClick(service)}
                        className="p-3 hover:bg-orange-50 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            {service.nameHi}
                            <span className="text-[10px] bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">
                              {service.badge}
                            </span>
                          </h4>
                          <p className="text-xs text-slate-500">{service.taglineHi}</p>
                        </div>
                        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 shrink-0">
                          जानकारी लें →
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Primary Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              {onOpenPartnerModal && (
                <button
                  onClick={onOpenPartnerModal}
                  className="hidden md:flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 px-3 py-1.5 sm:py-2 rounded-lg font-black text-xs shadow-md transition-all tap-bounce shrink-0"
                  title="Work From Home पार्टनर बनें"
                >
                  <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                  <span>💼 पार्टनर बनें (20%-50%)</span>
                </button>
              )}

              <a
                href={directWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 sm:gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg font-bold text-xs sm:text-sm shadow-md transition-all tap-bounce shrink-0"
                title="Chat on WhatsApp"
              >
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white text-[#25D366]" />
                </div>
                <div className="hidden sm:block text-left">
                  <span className="block text-[9px] text-emerald-100 uppercase tracking-wider font-semibold leading-none">WhatsApp</span>
                  <span className="text-xs font-bold leading-none">{BUSINESS_CONFIG.whatsappDisplay}</span>
                </div>
                <span className="sm:hidden text-[11px] font-bold">WhatsApp</span>
              </a>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-1.5 text-slate-300 hover:text-white rounded-lg focus:outline-none"
                aria-label="Toggle Navigation"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>

          {/* Amazon-Style Live Search Bar (Full Width on Mobile) */}
          <div className="relative mt-2 md:hidden">
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim() && setIsSearchOpen(true)}
                placeholder="आपको कौन सी सेवा चाहिए? जैसे - KCC, PAN..."
                className="w-full h-9 pl-3 pr-10 rounded-lg bg-white text-slate-900 placeholder:text-slate-400 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
              />
              <button 
                type="button"
                className="absolute right-0 top-0 bottom-0 px-3 bg-orange-500 text-white rounded-r-lg flex items-center justify-center tap-bounce"
                title="Search"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mobile Auto-suggest results */}
            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white text-slate-900 rounded-lg shadow-2xl border border-slate-200 overflow-hidden z-50">
                <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
                  {searchResults.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => handleSearchResultClick(service)}
                      className="p-2.5 hover:bg-orange-50 cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{service.nameHi}</h4>
                        <p className="text-[10px] text-slate-500 truncate">{service.taglineHi}</p>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        देखें →
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sub-Navigation Categories Strip */}
      <div className="bg-[#0f1d35] text-slate-200 text-xs md:text-sm font-medium border-b border-slate-800 hidden md:block">
        <div className="fluid-container py-1 flex items-center justify-between overflow-x-auto no-scrollbar">
          
          <div className="flex items-center gap-1 shrink-0">
            {/* All Services Dropdown Trigger */}
            <div className="relative">
              <button
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-colors ${
                  selectedCategory === 'all' 
                    ? 'bg-orange-500 text-white' 
                    : 'text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Menu className="w-4 h-4" />
                <span>सभी सेवाएं</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {isCategoryDropdownOpen && (
                <div className="absolute left-0 top-full mt-1 w-64 bg-white text-slate-900 rounded-lg shadow-xl border border-slate-200 py-2 z-50">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        onSelectCategory(cat.id);
                        setIsCategoryDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-orange-50 flex items-center justify-between text-xs font-medium text-slate-700 hover:text-orange-600 transition-colors"
                    >
                      <span>{cat.nameHi}</span>
                      <span className="text-[10px] text-slate-400">{cat.badge}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Category Jump Tabs */}
            <button
              onClick={() => onSelectCategory('all')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                selectedCategory === 'all' ? 'text-orange-400 font-bold border-b-2 border-orange-400' : 'hover:text-white'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => onSelectCategory('kisan-krishi')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                selectedCategory === 'kisan-krishi' ? 'text-orange-400 font-bold border-b-2 border-orange-400' : 'hover:text-white'
              }`}
            >
              Kisan Seva
            </button>

            <button
              onClick={() => onSelectCategory('loan-banking')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                selectedCategory === 'loan-banking' ? 'text-orange-400 font-bold border-b-2 border-orange-400' : 'hover:text-white'
              }`}
            >
              Loans & Banking
            </button>

            <button
              onClick={() => onSelectCategory('rto-vahan')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                selectedCategory === 'rto-vahan' ? 'text-orange-400 font-bold border-b-2 border-orange-400' : 'hover:text-white'
              }`}
            >
              RTO & Vahan
            </button>

            <button
              onClick={() => onSelectCategory('business-tax')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                selectedCategory === 'business-tax' ? 'text-orange-400 font-bold border-b-2 border-orange-400' : 'hover:text-white'
              }`}
            >
              Business & Tax
            </button>

            <button
              onClick={() => onSelectCategory('govt-documents')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                selectedCategory === 'govt-documents' ? 'text-orange-400 font-bold border-b-2 border-orange-400' : 'hover:text-white'
              }`}
            >
              Govt Documents
            </button>

            <button
              onClick={() => onSelectCategory('pension-welfare')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                selectedCategory === 'pension-welfare' ? 'text-orange-400 font-bold border-b-2 border-orange-400' : 'hover:text-white'
              }`}
            >
              Pension & Welfare
            </button>

            <button
              onClick={() => onSelectCategory('utility-bills')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                selectedCategory === 'utility-bills' ? 'text-orange-400 font-bold border-b-2 border-orange-400' : 'hover:text-white'
              }`}
            >
              Utility & Others
            </button>
          </div>

          {/* Genuine Shop Timings Badge */}
          <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>खुला है: <strong>{BUSINESS_CONFIG.workingHoursHi}</strong></span>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0A192F] border-b border-slate-800 text-white p-4 space-y-3 animate-in slide-in-from-top-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <MapPin className="w-4 h-4 text-orange-400" />
              <span>{BUSINESS_CONFIG.shortLocation}</span>
            </div>
            <span className="text-[10px] bg-emerald-900/60 text-emerald-400 px-2 py-0.5 rounded font-semibold border border-emerald-500/30">
              खुला है: 9am - 8pm
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-2">सेवा श्रेणियां (Categories)</p>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory(cat.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`p-2.5 rounded-lg text-left text-xs font-medium transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-orange-500 text-white font-bold'
                      : 'bg-slate-800/80 text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  {cat.nameHi}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 space-y-2">
            {onOpenPartnerModal && (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenPartnerModal();
                }}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 py-2.5 rounded-lg font-black text-xs shadow tap-bounce"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>💼 Work From Home पार्टनर बनें (20%-50% कमीशन)</span>
              </button>
            )}

            <a
              href={directWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white py-2.5 rounded-lg font-bold text-sm shadow tap-bounce"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>सीधे WhatsApp पर बात करें ({BUSINESS_CONFIG.whatsappDisplay})</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
