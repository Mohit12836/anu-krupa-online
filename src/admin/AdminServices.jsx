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
  AlertCircle
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

export default function AdminServices({ isAddOpen, onCloseAdd }) {
  const { services, categories, toggleServiceStatus, toggleServicePopular, updateService, addService } = useStore();

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [editingService, setEditingService] = useState(null);

  // Filtered services
  const filteredServices = services.filter((s) => {
    const matchesCat = selectedCat === 'all' || s.categoryId === selectedCat;
    const matchesSearch =
      search.trim() === '' ||
      s.nameHi.toLowerCase().includes(search.toLowerCase()) ||
      s.nameEn.toLowerCase().includes(search.toLowerCase()) ||
      s.taglineHi.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (editingService) {
      updateService(editingService.id, editingService);
      setEditingService(null);
    }
  };

  const handleApplyPreset = (preset) => {
    addService({
      ...preset,
      id: `srv-${Date.now()}`,
    });
    if (onCloseAdd) onCloseAdd();
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      
      {/* Top Search & Filter Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="सेवा का नाम खोजें (जैसे KCC, PAN, DL)..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <button
            onClick={() => {
              if (onCloseAdd) onCloseAdd();
              // Trigger modal or state
            }}
            className="px-3.5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 shrink-0 tap-bounce"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">नई सेवा जोड़ें</span>
            <span className="sm:hidden">जोड़ें</span>
          </button>
        </div>

        {/* Category Tabs Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
          <button
            onClick={() => setSelectedCat('all')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
              selectedCat === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            सभी ({services.length})
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

      {/* Services List / Cards */}
      <div className="space-y-3">
        {filteredServices.map((service) => {
          const isAvailable = service.availability !== 'paused';

          return (
            <div
              key={service.id}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all shadow-sm ${
                isAvailable
                  ? 'bg-white border-slate-200/90'
                  : 'bg-slate-100/90 border-slate-300 opacity-75'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                
                {/* Left Thumbnail & Details */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-200 relative">
                    <img
                      src={service.image}
                      alt={service.nameHi}
                      className="w-full h-full object-cover"
                    />
                    {!isAvailable && (
                      <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center text-white text-[9px] font-bold">
                        छिपी है
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {service.nameHi}
                      </h4>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 shrink-0">
                        {service.badge}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {service.taglineHi}
                    </p>

                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-600">
                      <span>सरकारी: <strong>{service.feeStructure.govtFee}</strong></span>
                      <span>सेवा शुल्क: <strong className="text-emerald-700">{service.feeStructure.serviceFee}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Right 1-Tap Toggle Controls */}
                <div className="flex items-center gap-1.5 shrink-0">
                  
                  {/* Star / Popular Toggle */}
                  <button
                    type="button"
                    onClick={() => toggleServicePopular(service.id)}
                    className={`p-2 rounded-xl border transition-colors tap-bounce ${
                      service.isPopular
                        ? 'bg-amber-50 border-amber-300 text-amber-600'
                        : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'
                    }`}
                    title={service.isPopular ? 'लोकप्रिय सेवा (Homepage Top)' : 'सामान्य सेवा'}
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

                  {/* Active / Hidden Switch */}
                  <button
                    type="button"
                    onClick={() => toggleServiceStatus(service.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all tap-bounce flex items-center gap-1 shadow-sm ${
                      isAvailable
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-slate-300 hover:bg-slate-400 text-slate-800'
                    }`}
                  >
                    {isAvailable ? (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>चालू</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>बंद</span>
                      </>
                    )}
                  </button>

                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Service Bottom Sheet / Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 max-h-[85vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-orange-500" />
                <span>सेवा एडिट करें: {editingService.nameHi}</span>
              </h3>
              <button
                onClick={() => setEditingService(null)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">सेवा का नाम (Hindi):</label>
                <input
                  type="text"
                  value={editingService.nameHi}
                  onChange={(e) => setEditingService({ ...editingService, nameHi: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">छोटा उपशीर्षक (Tagline):</label>
                <input
                  type="text"
                  value={editingService.taglineHi}
                  onChange={(e) => setEditingService({ ...editingService, taglineHi: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">सरकारी पोर्टल शुल्क:</label>
                  <input
                    type="text"
                    value={editingService.feeStructure.govtFee}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        feeStructure: { ...editingService.feeStructure, govtFee: e.target.value },
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">दुकान सेवा शुल्क:</label>
                  <input
                    type="text"
                    value={editingService.feeStructure.serviceFee}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        feeStructure: { ...editingService.feeStructure, serviceFee: e.target.value },
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow tap-bounce"
                >
                  बदलाव सेव करें ✓
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Preset Service Templates Modal (Tap to Add Ready Made Services) */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 max-h-[85vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <span>तैयार सरकारी सेवा प्रीसेट्स (1-Tap Add)</span>
                </h3>
                <p className="text-[11px] text-slate-500">बिना टाइपिंग के सीधे जोड़ें और तुरंत लाइव करें</p>
              </div>
              <button
                onClick={onCloseAdd}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {PRESET_TEMPLATES.map((tmpl, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-orange-50/40 hover:border-orange-300 transition-all flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {tmpl.badge}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-1">{tmpl.nameHi}</h4>
                    <p className="text-[11px] text-slate-500">{tmpl.taglineHi}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleApplyPreset(tmpl)}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow shrink-0 tap-bounce"
                  >
                    + वेबसाइट पर जोड़ें
                  </button>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
