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
  ShieldCheck
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

// Ready-made government service presets for 1-tap addition without typing
const PRESET_TEMPLATES = [
  {
    nameHi: 'ई-उपार्जन रबी / खरीफ पंजीयन',
    nameEn: 'MP e-Uparjan Registration',
    categoryId: 'kisan-krishi',
    badge: 'समर्थन मूल्य',
    taglineHi: 'गेहूं, चना, सरसों समर्थन मूल्य पंजीयन',
    descriptionHi: 'मध्य प्रदेश शासन द्वारा तय समर्थन मूल्य पर फसल बेचने हेतु किसान स्लॉट बुकिंग व ई-उपार्जन पंजीयन।',
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&auto=format&fit=crop&q=80',
    options: ['नया किसान पंजीयन', 'स्लॉट बुकिंग', 'बैंक खाता सत्यापन', 'पंजीयन पावती प्रिंट'],
    requiredDocs: ['समग्र सदस्य आईडी', 'आधार कार्ड', 'खसरा-खतौनी नकल', 'बैंक पासबुक (DBT सक्रिय)'],
    feeStructure: { govtFee: 'निःशुल्क', serviceFee: 'न्यूनतम ऑनलाइन पंजीयन शुल्क' },
  },
  {
    nameHi: 'संबल 2.0 कार्ड पंजीयन',
    nameEn: 'Sambal 2.0 Card Registration',
    categoryId: 'pension-welfare',
    badge: 'जनकल्याण योजना',
    taglineHi: 'असंगठित श्रमिकों के लिए सरकारी संबल योजना',
    descriptionHi: 'प्रसूति सहायता, शिक्षा प्रोत्साहन एवं दुर्घटना बीमा लाभ हेतु मध्य प्रदेश संबल 2.0 कार्ड ऑनलाइन पंजीयन।',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    options: ['नया संबल कार्ड आवेदन', 'संबल स्थिति जांच', 'संबल कार्ड प्रिंट'],
    requiredDocs: ['समग्र परिवार व सदस्य आईडी', 'आधार कार्ड', 'मोबाइल नंबर', 'घोषणा पत्र'],
    feeStructure: { govtFee: 'निःशुल्क', serviceFee: 'न्यूनतम फॉर्म शुल्क' },
  },
  {
    nameHi: 'जाति, मूल निवास एवं आय प्रमाण पत्र',
    nameEn: 'Caste & Domicile Certificates',
    categoryId: 'govt-documents',
    badge: 'लोक सेवा गारंटी',
    taglineHi: 'डिजिटली हस्ताक्षरित राजस्व प्रमाण पत्र',
    descriptionHi: 'म.प्र. लोक सेवा केंद्र अधिकृत जाति प्रमाण पत्र (SC/ST/OBC), मध्य प्रदेश मूल निवासी एवं वार्षिक आय प्रमाण पत्र।',
    image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80',
    options: ['डिजिटल मूल निवास प्रमाण पत्र', 'जाति प्रमाण पत्र (SC/ST/OBC)', 'आय प्रमाण पत्र', 'प्रमाण पत्र सत्यापन'],
    requiredDocs: ['समग्र आईडी', 'आधार कार्ड', 'पुराना रिकॉर्ड या खसरा नकल', 'पासपोर्ट फोटो'],
    feeStructure: { govtFee: 'सरकारी चालान नियमानुसार', serviceFee: 'पारदर्शी आवेदन शुल्क' },
  },
];

export default function AdminServices({ onOpenAddModal }) {
  const { services, categories, toggleServiceStatus, toggleServicePopular, updateService, addService } = useStore();

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [visibilityFilter, setVisibilityFilter] = useState('all'); // 'all' | 'visible' | 'hidden'
  const [editingService, setEditingService] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

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

  const handleToggleHideUnhide = (service) => {
    const currentlyVisible = isServiceVisible(service);
    toggleServiceStatus(service.id);
    
    // Show instant feedback toast
    if (currentlyVisible) {
      setToastMessage({
        type: 'hidden',
        text: `🚫 "${service.nameHi}" अब ग्राहक वेबसाइट से छिपा दी गई है!`
      });
    } else {
      setToastMessage({
        type: 'visible',
        text: `✓ "${service.nameHi}" अब ग्राहक वेबसाइट पर दिखने लगी है!`
      });
    }

    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (editingService) {
      updateService(editingService.id, editingService);
      setEditingService(null);
      setToastMessage({
        type: 'success',
        text: `✓ "${editingService.nameHi}" के बदलाव सुरक्षित हो गए!`
      });
      setTimeout(() => setToastMessage(null), 2500);
    }
  };

  const handleApplyPreset = (preset) => {
    addService({
      ...preset,
      id: `srv-${Date.now()}`,
    });
    setToastMessage({
      type: 'success',
      text: `✓ नई सेवा "${preset.nameHi}" लाइव जुड़ गई!`
    });
    setTimeout(() => setToastMessage(null), 2500);
  };

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

      {/* 1. Header Banner & Instant Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-orange-500" />
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                सेवा प्रबंधन (Hide / Unhide & Control)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              यहाँ से जो सेवा बंद/छिपाएंगे, वह ग्राहक वेबसाइट पर तुरंत दिखना बंद हो जाएगी।
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

        {/* Visibility Filter Tabs (All / Active / Hidden) */}
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setVisibilityFilter('all')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center tap-bounce ${
              visibilityFilter === 'all'
                ? 'bg-slate-900 text-white shadow-sm ring-1 ring-slate-900'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            सभी सेवाएं ({services.length})
          </button>

          <button
            type="button"
            onClick={() => setVisibilityFilter('visible')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center tap-bounce flex items-center justify-center gap-1.5 ${
              visibilityFilter === 'visible'
                ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-600'
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
                ? 'bg-rose-600 text-white shadow-sm ring-1 ring-rose-600'
                : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>छिपी हुई ({hiddenCount})</span>
          </button>
        </div>
      </div>

      {/* 2. Search & Category Chips */}
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
          {categories.filter(c => c.id !== 'all').map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
                selectedCat === cat.id
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.nameHi}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Services List / Cards with Prominent Hide / Unhide Toggle */}
      <div className="space-y-3">
        {filteredServices.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500 text-xs">
            कोई सेवा नहीं मिली। फ़िल्टर बदलें या नई सेवा जोड़ें।
          </div>
        ) : (
          filteredServices.map((service) => {
            const isVisible = isServiceVisible(service);

            return (
              <div
                key={service.id}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all shadow-sm ${
                  isVisible
                    ? 'bg-white border-slate-200 hover:border-slate-300'
                    : 'bg-rose-50/40 border-rose-200/90 ring-1 ring-rose-200/50'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-200 relative">
                      <img
                        src={service.image}
                        alt={service.nameHi}
                        className="w-full h-full object-cover"
                      />
                      {!isVisible && (
                        <div className="absolute inset-0 bg-rose-950/75 flex items-center justify-center text-white text-[10px] font-black tracking-wide">
                          छिपी है
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {service.nameHi}
                        </h4>
                        
                        {/* Live Status Badge */}
                        {isVisible ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>लाइव दिख रही है</span>
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

                  {/* Right: Explicit HIDE / UNHIDE Button */}
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

                    {/* Prominent Hide / Unhide Button */}
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

      {/* 4. Edit Service Modal */}
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
