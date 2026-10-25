import React, { useState } from 'react';
import { 
  Search, 
  PlusCircle, 
  Star, 
  Check, 
  X, 
  Edit3, 
  FileText, 
  Eye, 
  EyeOff, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  ShieldCheck,
  CheckSquare,
  Square,
  Power,
  FolderTree,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function AdminServices({ onOpenAddModal }) {
  const { 
    services, 
    categories, 
    macroVerticals,
    settings,
    toggleServiceStatus, 
    toggleServicePopular, 
    updateService, 
    addService,
    bulkHideServices,
    bulkUnhideServices,
    hideAllServices,
    unhideAllServices,
    toggleCategoryDisabled,
    toggleVerticalDisabled,
    hideAllServicesInCategory,
    unhideAllServicesInCategory
  } = useStore();

  const [activeSubTab, setActiveSubTab] = useState('services'); // 'services' | 'categories'
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [visibilityFilter, setVisibilityFilter] = useState('all'); // 'all' | 'visible' | 'hidden'
  const [editingService, setEditingService] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Bulk Selection State
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(null); // { type: 'hideAll' | 'unhideAll' | 'catHide' | 'catUnhide', catId?: string }

  const disabledCategories = settings?.disabledCategories || [];
  const disabledVerticals = settings?.disabledVerticals || [];

  // Helper: Is service visible or hidden
  const isServiceVisible = (s) => !s.isHidden && s.availability !== 'hidden' && s.availability !== 'paused';

  const visibleCount = services.filter(isServiceVisible).length;
  const hiddenCount = services.length - visibleCount;

  // Filtered services
  const filteredServices = services.filter((s) => {
    const isVis = isServiceVisible(s);
    const matchesCat = selectedCat === 'all' || s.categoryId === selectedCat;
    const matchesVisibility = 
      visibilityFilter === 'all' || 
      (visibilityFilter === 'visible' && isVis) || 
      (visibilityFilter === 'hidden' && !isVis);
    const matchesSearch =
      search.trim() === '' ||
      (s.nameHi && s.nameHi.toLowerCase().includes(search.toLowerCase())) ||
      (s.nameEn && s.nameEn.toLowerCase().includes(search.toLowerCase())) ||
      (s.taglineHi && s.taglineHi.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesVisibility && matchesSearch;
  });

  const showToast = (text, type = 'visible') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Single Toggle
  const handleToggleHideUnhide = (service) => {
    const currentlyVisible = isServiceVisible(service);
    toggleServiceStatus(service.id);
    if (currentlyVisible) {
      showToast(`🚫 "${service.nameHi}" अब ग्राहक वेबसाइट से छिपा दी गई है!`, 'hidden');
    } else {
      showToast(`✓ "${service.nameHi}" अब ग्राहक वेबसाइट पर दिखने लगी है!`, 'visible');
    }
  };

  // Multi-Select Checkboxes
  const handleToggleSelectService = (id) => {
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllFiltered = () => {
    const filteredIds = filteredServices.map((s) => s.id);
    const allSelected = filteredIds.every((id) => selectedServiceIds.includes(id));
    if (allSelected) {
      // Deselect filtered
      setSelectedServiceIds((prev) => prev.filter((id) => !filteredIds.includes(id)));
    } else {
      // Select all filtered
      setSelectedServiceIds((prev) => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

  // Bulk Actions
  const handleBulkHide = () => {
    if (selectedServiceIds.length === 0) return;
    bulkHideServices(selectedServiceIds);
    showToast(`🚫 चुनी हुई ${selectedServiceIds.length} सेवाएं एक साथ छिपा दी गईं!`, 'hidden');
    setSelectedServiceIds([]);
  };

  const handleBulkUnhide = () => {
    if (selectedServiceIds.length === 0) return;
    bulkUnhideServices(selectedServiceIds);
    showToast(`✓ चुनी हुई ${selectedServiceIds.length} सेवाएं एक साथ चालू कर दी गईं!`, 'visible');
    setSelectedServiceIds([]);
  };

  // Master Hide All & Unhide All
  const handleExecuteHideAll = () => {
    hideAllServices();
    setShowConfirmModal(null);
    showToast(`🛑 सभी ${services.length} सेवाएं एक साथ बंद/छिपा दी गईं!`, 'hidden');
    setSelectedServiceIds([]);
  };

  const handleExecuteUnhideAll = () => {
    unhideAllServices();
    setShowConfirmModal(null);
    showToast(`✓ सभी ${services.length} सेवाएं एक साथ चालू कर दी गईं!`, 'visible');
    setSelectedServiceIds([]);
  };

  // Category Actions
  const handleCategoryHideServices = (catId) => {
    hideAllServicesInCategory(catId);
    const cat = categories.find((c) => c.id === catId);
    showToast(`🚫 "${cat ? cat.nameHi : catId}" की सभी सेवाएं छिपा दी गईं!`, 'hidden');
  };

  const handleCategoryUnhideServices = (catId) => {
    unhideAllServicesInCategory(catId);
    const cat = categories.find((c) => c.id === catId);
    showToast(`✓ "${cat ? cat.nameHi : catId}" की सभी सेवाएं चालू कर दी गईं!`, 'visible');
  };

  const handleToggleCategory = (catId) => {
    toggleCategoryDisabled(catId);
    const isCurrentlyDisabled = disabledCategories.includes(catId);
    const cat = categories.find((c) => c.id === catId);
    if (!isCurrentlyDisabled) {
      showToast(`🚫 केटेगरी "${cat ? cat.nameHi : catId}" वेबसाइट पर बंद (Hide) कर दी गई!`, 'hidden');
    } else {
      showToast(`✓ केटेगरी "${cat ? cat.nameHi : catId}" वेबसाइट पर चालू (Visible) कर दी गई!`, 'visible');
    }
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (editingService) {
      updateService(editingService.id, editingService);
      setEditingService(null);
      showToast(`✓ "${editingService.nameHi}" के बदलाव सुरक्षित हो गए!`, 'visible');
    }
  };

  const isAllFilteredSelected =
    filteredServices.length > 0 &&
    filteredServices.every((s) => selectedServiceIds.includes(s.id));

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`p-3.5 rounded-2xl shadow-lg border flex items-center justify-between gap-2 text-xs font-bold transition-all animate-in slide-in-from-top-2 ${
          toastMessage.type === 'hidden'
            ? 'bg-rose-900 text-white border-rose-700 shadow-rose-900/30'
            : 'bg-emerald-900 text-white border-emerald-700 shadow-emerald-900/30'
        }`}>
          <span>{toastMessage.text}</span>
          <button onClick={() => setToastMessage(null)} className="text-white/80 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. Header Banner & Sub-Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-orange-500" />
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                सेवा व केटेगरी नियंत्रण (Bulk Control & Category Switches)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              सेवाएं एक साथ बंद करें, पूरी केटेगरी बंद/छिपाएं, या व्यक्तिगत रूप से बदलें।
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAddModal}
              className="px-3.5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 shrink-0 tap-bounce"
            >
              <PlusCircle className="w-4 h-4" />
              <span>नई सेवा बनाएं</span>
            </button>
          </div>
        </div>

        {/* Sub-Tab Navigation: Services vs Categories */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setActiveSubTab('services')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 tap-bounce ${
              activeSubTab === 'services'
                ? 'bg-slate-900 text-white shadow-sm ring-1 ring-slate-900'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>सेवाएं सूची व बल्क एक्शन ({services.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('categories')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 tap-bounce ${
              activeSubTab === 'categories'
                ? 'bg-slate-900 text-white shadow-sm ring-1 ring-slate-900'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <FolderTree className="w-4 h-4 text-orange-400" />
            <span>केटेगरी मास्टर स्विच ({categories.filter(c => c.id !== 'all').length})</span>
            {disabledCategories.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-black">
                {disabledCategories.length} बंद
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SUB-TAB 1: SERVICES LIST & BULK OPERATIONS (USER REQUEST 1)     */}
      {/* ============================================================== */}
      {activeSubTab === 'services' && (
        <div className="space-y-4 animate-in fade-in">
          
          {/* Emergency Master Controls Box */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-3.5 sm:p-4 rounded-2xl border border-slate-700 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Power className="w-4 h-4 text-amber-400" />
                <span className="text-xs sm:text-sm font-black text-white">
                  1-क्लिक मास्टर कंट्रोल (Emergency Master Switches)
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                तकनीकी समस्या या अवकाश पर एक ही क्लिक में सभी सेवाएं छुपाएं या पुनः चालू करें।
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowConfirmModal({ type: 'hideAll' })}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 tap-bounce transition-all"
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span>सभी सेवाएं बंद करें</span>
              </button>

              <button
                type="button"
                onClick={() => setShowConfirmModal({ type: 'unhideAll' })}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 tap-bounce transition-all"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>सभी सेवाएं चालू करें</span>
              </button>
            </div>
          </div>

          {/* Visibility Filter Tabs (All / Active / Hidden) */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-sm grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setVisibilityFilter('all')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center tap-bounce ${
                visibilityFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              सभी ({services.length})
            </button>

            <button
              type="button"
              onClick={() => setVisibilityFilter('visible')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center tap-bounce flex items-center justify-center gap-1.5 ${
                visibilityFilter === 'visible'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>दिखने वाली ({visibleCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setVisibilityFilter('hidden')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center tap-bounce flex items-center justify-center gap-1.5 ${
                visibilityFilter === 'hidden'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>छिपी हुई ({hiddenCount})</span>
            </button>
          </div>

          {/* Search & Category Filter Chips */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-sm space-y-2.5">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="सेवा का नाम खोजें (जैसे KCC, PAN, DL, आयुष्मान)..."
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            {/* Category Tabs Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
              <button
                onClick={() => setSelectedCat('all')}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                  selectedCat === 'all'
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                सभी कैटेगरी
              </button>
              {categories.filter(c => c.id !== 'all').map((cat) => {
                const isCatDisabled = disabledCategories.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCat(cat.id)}
                    className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
                      selectedCat === cat.id
                        ? 'bg-orange-500 text-white shadow-sm'
                        : isCatDisabled
                        ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{cat.nameHi}</span>
                    {isCatDisabled && <span className="text-[10px] text-rose-600 font-bold">(बंद)</span>}
                  </button>
                );
              })}
            </div>

            {/* If a specific category is selected, show category bulk toggle buttons */}
            {selectedCat !== 'all' && (
              <div className="p-2.5 rounded-xl bg-orange-50/70 border border-orange-200 flex flex-wrap items-center justify-between gap-2 text-xs animate-in fade-in">
                <span className="font-bold text-orange-950">
                  चयनित केटेगरी: {categories.find(c => c.id === selectedCat)?.nameHi}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCategoryHideServices(selectedCat)}
                    className="px-2.5 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-[11px] flex items-center gap-1"
                  >
                    <EyeOff className="w-3 h-3" />
                    <span>इस केटेगरी की सभी सेवाएं छिपाएं</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCategoryUnhideServices(selectedCat)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-[11px] flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    <span>सभी चालू करें</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bulk Selection Bar (Sticky when items selected) */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleSelectAllFiltered}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900"
              >
                {isAllFilteredSelected ? (
                  <CheckSquare className="w-4 h-4 text-orange-500" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400" />
                )}
                <span>इस पेज की सभी सेवाएं चुनें ({filteredServices.length})</span>
              </button>

              {selectedServiceIds.length > 0 && (
                <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                  {selectedServiceIds.length} सेवाएं चयनित
                </span>
              )}
            </div>

            {selectedServiceIds.length > 0 && (
              <div className="flex items-center gap-2 animate-in fade-in">
                <button
                  type="button"
                  onClick={handleBulkHide}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow flex items-center gap-1.5 tap-bounce"
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>एक साथ छिपाएं ({selectedServiceIds.length})</span>
                </button>

                <button
                  type="button"
                  onClick={handleBulkUnhide}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow flex items-center gap-1.5 tap-bounce"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>एक साथ चालू करें ({selectedServiceIds.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedServiceIds([])}
                  className="px-2 py-1 text-slate-500 hover:text-slate-700 text-xs"
                >
                  रद्द करें
                </button>
              </div>
            )}
          </div>

          {/* Services List / Cards */}
          <div className="space-y-3">
            {filteredServices.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500 text-xs">
                कोई सेवा नहीं मिली। फ़िल्टर बदलें या नई सेवा जोड़ें।
              </div>
            ) : (
              filteredServices.map((service) => {
                const isVisible = isServiceVisible(service);
                const isSelected = selectedServiceIds.includes(service.id);
                const isCatDisabled = disabledCategories.includes(service.categoryId);

                return (
                  <div
                    key={service.id}
                    className={`p-3.5 sm:p-4 rounded-2xl border transition-all shadow-sm ${
                      isSelected
                        ? 'bg-orange-50/60 border-orange-300 ring-2 ring-orange-400/40'
                        : isVisible && !isCatDisabled
                        ? 'bg-white border-slate-200 hover:border-slate-300'
                        : 'bg-rose-50/40 border-rose-200/90 ring-1 ring-rose-200/50'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      
                      {/* Left: Checkbox + Thumbnail & Details */}
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        {/* Checkbox */}
                        <button
                          type="button"
                          onClick={() => handleToggleSelectService(service.id)}
                          className="pt-1 text-slate-400 hover:text-orange-500 transition-colors"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-5 h-5 text-orange-500" />
                          ) : (
                            <Square className="w-5 h-5" />
                          )}
                        </button>

                        {/* Thumbnail */}
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-200 relative">
                          <img
                            src={service.image}
                            alt={service.nameHi}
                            className="w-full h-full object-cover"
                          />
                          {(!isVisible || isCatDisabled) && (
                            <div className="absolute inset-0 bg-rose-950/75 flex items-center justify-center text-white text-[10px] font-black tracking-wide text-center p-1">
                              {isCatDisabled ? 'केटेगरी बंद' : 'छिपी है'}
                            </div>
                          )}
                        </div>

                        {/* Text info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5 mb-1">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                              {service.nameHi}
                            </h4>
                            
                            {/* Status Badges */}
                            {isVisible && !isCatDisabled ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span>लाइव दिख रही है</span>
                              </span>
                            ) : isCatDisabled ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3 text-amber-600" />
                                <span>केटेगरी बंद होने से अप्रदर्शित</span>
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                                <span>वेबसाइट से छिपी हुई (Hidden)</span>
                              </span>
                            )}

                            {service.isPopular && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                                ★ लोकप्रिय
                              </span>
                            )}
                          </div>

                          <p className="text-[11px] text-slate-500 truncate">
                            {service.taglineHi}
                          </p>

                          <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-600">
                            <span>सरकारी: <strong>{(service.feeStructure && service.feeStructure.govtFee) || service.govtFee || 'निःशुल्क'}</strong></span>
                            <span>दुकान शुल्क: <strong className="text-emerald-700">{(service.feeStructure && service.feeStructure.serviceFee) || service.portalFee || '₹50'}</strong></span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        
                        {/* Popular Star */}
                        <button
                          type="button"
                          onClick={() => toggleServicePopular(service.id)}
                          className={`p-2 rounded-xl border transition-colors tap-bounce ${
                            service.isPopular
                              ? 'bg-amber-50 border-amber-300 text-amber-600'
                              : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'
                          }`}
                          title={service.isPopular ? 'लोकप्रिय सेवा' : 'सामान्य सेवा'}
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </button>

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => setEditingService({ ...service })}
                          className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors tap-bounce"
                          title="एडिट करें"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {/* Single Hide / Unhide Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleHideUnhide(service)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all tap-bounce flex items-center gap-1.5 shadow-sm ${
                            isVisible
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-600'
                          }`}
                        >
                          {isVisible ? (
                            <>
                              <EyeOff className="w-4 h-4 text-rose-600" />
                              <span>सेवा छिपाएं (Hide)</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4 text-white" />
                              <span>सेवा दिखाएं (Unhide)</span>
                            </>
                          )}
                        </button>

                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* SUB-TAB 2: CATEGORY MASTER SWITCHES (USER REQUEST 2)           */}
      {/* ============================================================== */}
      {activeSubTab === 'categories' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-orange-500" />
              <span>वर्ग / केटेगरी मास्टर नियंत्रण (Category ON/OFF Switches)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              यहाँ से आप पूरी केटेगरी (जैसे सोलर, RTO, किसान योजनाएं, PVC कार्ड) को एक साथ बंद या चालू कर सकते हैं। 
              केटेगरी बंद करने पर वह ग्राहक वेबसाइट के मेनू व ग्रिड से तुरंत हट जाएगी।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {categories.filter(c => c.id !== 'all').map((cat) => {
              const isCatDisabled = disabledCategories.includes(cat.id);
              const catServices = services.filter(s => s.categoryId === cat.id);
              const visibleCatServices = catServices.filter(isServiceVisible);

              return (
                <div
                  key={cat.id}
                  className={`p-4 rounded-2xl border transition-all shadow-sm flex flex-col justify-between gap-3 ${
                    isCatDisabled
                      ? 'bg-rose-50/50 border-rose-200 ring-1 ring-rose-200/50'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-extrabold text-slate-900">
                            {cat.nameHi}
                          </h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {cat.nameEn || cat.id}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 block mt-0.5">
                          कुल {catServices.length} सेवाएं ({visibleCatServices.length} लाइव दिखने वाली)
                        </span>
                      </div>

                      {/* Main ON / OFF Category Switch */}
                      <button
                        type="button"
                        onClick={() => handleToggleCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all tap-bounce flex items-center gap-1.5 shrink-0 shadow-sm ${
                          isCatDisabled
                            ? 'bg-rose-600 hover:bg-rose-700 text-white'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        {isCatDisabled ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>केटेगरी बंद है (OFF)</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>केटेगरी चालू है (ON)</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="text-[11px] font-semibold mt-2">
                      {isCatDisabled ? (
                        <span className="text-rose-700 bg-rose-100/80 px-2.5 py-1 rounded-lg inline-block">
                          🚫 यह पूरा विभाग ग्राहक वेबसाइट पर छिपा हुआ है।
                        </span>
                      ) : (
                        <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg inline-block">
                          ✓ यह विभाग ग्राहक वेबसाइट पर लाइव सक्रिय है।
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bulk Services Inside Category Controls */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                    <span className="text-[11px] text-slate-500 font-medium">
                      इस केटेगरी की सेवाएं:
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCategoryHideServices(cat.id)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-rose-50 hover:text-rose-700 text-slate-700 font-bold text-[11px] transition-colors"
                      >
                        सभी छिपाएं
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCategoryUnhideServices(cat.id)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-bold text-[11px] transition-colors"
                      >
                        सभी दिखाएं
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Confirmation Modal for Hide All / Unhide All */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                showConfirmModal.type === 'hideAll' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
              }`}>
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                  {showConfirmModal.type === 'hideAll'
                    ? 'क्या आप सभी सेवाएं एक साथ बंद करना चाहते हैं?'
                    : 'क्या आप सभी सेवाएं एक साथ चालू करना चाहते हैं?'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {showConfirmModal.type === 'hideAll'
                    ? `इस एक्शन से आपकी सभी ${services.length} सेवाएं ग्राहक वेबसाइट से तुरंत छिप जाएंगी।`
                    : `इस एक्शन से आपकी सभी ${services.length} सेवाएं ग्राहक वेबसाइट पर दिखने लगेंगी।`}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowConfirmModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                रद्द करें
              </button>
              <button
                type="button"
                onClick={showConfirmModal.type === 'hideAll' ? handleExecuteHideAll : handleExecuteUnhideAll}
                className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow tap-bounce ${
                  showConfirmModal.type === 'hideAll'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {showConfirmModal.type === 'hideAll' ? 'हाँ, सभी बंद करें' : 'हाँ, सभी चालू करें'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">सेवा विवरण बदलें (Edit Service)</h3>
              <button onClick={() => setEditingService(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-4 sm:p-5 space-y-3 overflow-y-auto">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">सेवा का नाम (हिंदी)</label>
                <input
                  type="text"
                  value={editingService.nameHi}
                  onChange={(e) => setEditingService({ ...editingService, nameHi: e.target.value })}
                  className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">टैगलाइन / उप-शीर्षक</label>
                <input
                  type="text"
                  value={editingService.taglineHi}
                  onChange={(e) => setEditingService({ ...editingService, taglineHi: e.target.value })}
                  className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">वेबसाइट पर दृश्यता (Visibility)</span>
                  <span className="text-[11px] text-slate-500">
                    {isServiceVisible(editingService) ? 'ग्राहक वेबसाइट पर दिख रही है' : 'वेबसाइट से छिपी हुई है'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const nextVal = isServiceVisible(editingService) ? 'hidden' : 'available';
                    setEditingService({
                      ...editingService,
                      availability: nextVal,
                      isHidden: nextVal === 'hidden',
                    });
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                    isServiceVisible(editingService)
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {isServiceVisible(editingService) ? 'छिपाएं' : 'दिखाएं'}
                </button>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 text-xs text-slate-600"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold shadow"
                >
                  बदलाव सेव करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
