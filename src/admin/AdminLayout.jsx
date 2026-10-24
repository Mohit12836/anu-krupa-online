import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Layers, 
  MessageCircle, 
  Image as ImageIcon, 
  Settings, 
  Globe, 
  Store, 
  PlusCircle, 
  ShieldCheck,
  ChevronRight,
  Sparkles,
  X
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import AdminDashboard from './AdminDashboard';
import AdminServices from './AdminServices';
import AdminEnquiries from './AdminEnquiries';
import AdminWebsite from './AdminWebsite';
import AdminSettings from './AdminSettings';

export default function AdminLayout({ onSwitchToCustomer }) {
  const { settings, inquiries, services, addService } = useStore();
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'services' | 'enquiries' | 'website' | 'settings'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Service Form State
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceNameHi, setNewServiceNameHi] = useState('');
  const [newCategory, setNewCategory] = useState('farmer');
  const [newGovFee, setNewGovFee] = useState('निःशुल्क');
  const [newPortalFee, setNewPortalFee] = useState('₹50');
  const [newTimeline, setNewTimeline] = useState('1 से 2 दिन');
  const [newDocs, setNewDocs] = useState('आधार कार्ड, बैंक पासबुक, समग्र आईडी');
  const [newOptions, setNewOptions] = useState('नया आवेदन, सुधार / संशोधन');

  const pendingInquiriesCount = inquiries.filter(i => i.status === 'NEW').length;

  const handleCreateService = (e) => {
    e.preventDefault();
    if (!newServiceName) return;

    const formattedDocs = newDocs.split(',').map(d => d.trim()).filter(Boolean);
    const formattedOpts = newOptions.split(',').map(o => o.trim()).filter(Boolean);

    addService({
      name: newServiceName,
      nameHi: newServiceNameHi || newServiceName,
      categoryId: newCategory,
      badge: 'नई सेवा',
      govtFee: newGovFee,
      portalFee: newPortalFee,
      turnaroundTime: newTimeline,
      requiredDocs: formattedDocs.length ? formattedDocs : ['आधार कार्ड'],
      popularOptions: formattedOpts.length ? formattedOpts : ['नया आवेदन'],
      shortDesc: `${newServiceName} का ऑनलाइन आवेदन एवं स्टेटस`,
    });

    // Reset and close
    setNewServiceName('');
    setNewServiceNameHi('');
    setIsAddModalOpen(false);
    setActiveTab('services');
  };

  const TABS = [
    { id: 'dashboard', label: 'डैशबोर्ड', icon: LayoutDashboard },
    { id: 'services', label: 'सेवाएँ', icon: Layers, count: services.length },
    { id: 'enquiries', label: 'पूछताछ', icon: MessageCircle, count: pendingInquiriesCount, highlight: pendingInquiriesCount > 0 },
    { id: 'website', label: 'दुकान व बैनर', icon: ImageIcon },
    { id: 'settings', label: 'सेटिंग्स', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900 pb-20 sm:pb-8">
      
      {/* 1. Admin Sticky Header */}
      <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-md border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center font-black text-white text-base shadow">
              AK
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-tight">अनु कृपा एडमिन</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  मालिक कंट्रोल (Owner)
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span className={`w-2 h-2 rounded-full ${settings.isOpenToday ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                <span>{settings.isOpenToday ? 'दुकान खुली है' : 'दुकान बंद है'}</span>
                <span>•</span>
                <span>{settings.shortLocation}</span>
              </div>
            </div>
          </div>

          {/* Quick Exit to Customer View Button */}
          <button
            onClick={onSwitchToCustomer}
            className="px-3.5 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 tap-bounce transition-all shrink-0"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ग्राहक वेबसाइट देखें</span>
            <span className="sm:hidden">साइट देखें</span>
          </button>
        </div>

        {/* Desktop Tabs Strip */}
        <div className="hidden sm:block border-t border-slate-800 bg-slate-950/60 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto px-4 flex items-center gap-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
                    isActive 
                      ? 'border-orange-500 text-orange-400 bg-white/5' 
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                      tab.highlight 
                        ? 'bg-amber-500 text-white animate-pulse' 
                        : isActive ? 'bg-orange-500/30 text-orange-300' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* 2. Main Content View Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-3 sm:p-5">
        {activeTab === 'dashboard' && (
          <AdminDashboard 
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenAddService={() => setIsAddModalOpen(true)}
          />
        )}
        {activeTab === 'services' && (
          <AdminServices 
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        )}
        {activeTab === 'enquiries' && (
          <AdminEnquiries />
        )}
        {activeTab === 'website' && (
          <AdminWebsite />
        )}
        {activeTab === 'settings' && (
          <AdminSettings />
        )}
      </main>

      {/* 3. Mobile Bottom Navigation Bar (1-Hand PhonePe Style) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg px-2 py-1.5 flex items-center justify-around">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all relative ${
                isActive ? 'text-orange-600 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                {tab.count !== undefined && tab.highlight && (
                  <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-amber-500 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-bounce">
                    {tab.count}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 whitespace-nowrap">{tab.label}</span>
              {isActive && (
                <span className="w-4 h-0.5 bg-orange-600 rounded-full mt-0.5" />
              )}
            </button>
          );
        })}
      </nav>

      {/* 4. Add New Custom Service Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-orange-400" />
                <h3 className="font-extrabold text-sm sm:text-base">नई सेवा जोड़ें (Add Service)</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleCreateService} className="p-4 sm:p-6 space-y-3.5 overflow-y-auto">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    सेवा का नाम (English) *
                  </label>
                  <input
                    type="text"
                    value={newServiceName}
                    onChange={(e) => setNewServiceName(e.target.value)}
                    placeholder="उदा. Soil Health Card"
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    सेवा का नाम (हिंदी)
                  </label>
                  <input
                    type="text"
                    value={newServiceNameHi}
                    onChange={(e) => setNewServiceNameHi(e.target.value)}
                    placeholder="उदा. मृदा स्वास्थ्य कार्ड"
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  कैटेगरी चुनें (Category) *
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                >
                  <option value="farmer">🌾 किसान एवं कृषि सेवा (Farmer)</option>
                  <option value="banking">🏦 बैंकिंग, आधार पे व CSP (Banking)</option>
                  <option value="loans">💰 लोन एवं क्रेडिट कार्ड (Loans)</option>
                  <option value="rto">🚗 RTO एवं वाहन सेवा (Vehicle/RTO)</option>
                  <option value="certificates">📑 सरकारी दस्तावेज व प्रमाण पत्र (Docs)</option>
                  <option value="tax">📊 टैक्स, GST व व्यापार (Tax/GST)</option>
                  <option value="pension">👵 पेंशन एवं सामाजिक सुरक्षा (Pension)</option>
                  <option value="online_forms">🎓 ऑनलाइन फॉर्म व सरकारी योजना (Forms)</option>
                  <option value="printing">🖨️ प्रिंटिंग, लेमिनेशन व फोटो (Printing)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    सरकारी शुल्क
                  </label>
                  <input
                    type="text"
                    value={newGovFee}
                    onChange={(e) => setNewGovFee(e.target.value)}
                    placeholder="निःशुल्क या ₹50"
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    दुकान सेवा शुल्क
                  </label>
                  <input
                    type="text"
                    value={newPortalFee}
                    onChange={(e) => setNewPortalFee(e.target.value)}
                    placeholder="₹50"
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  आवश्यक दस्तावेज़ (कॉमा से अलग करें)
                </label>
                <input
                  type="text"
                  value={newDocs}
                  onChange={(e) => setNewDocs(e.target.value)}
                  placeholder="आधार कार्ड, बैंक पासबुक, समग्र आईडी"
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  विकल्प / प्रकार (कॉमा से अलग करें)
                </label>
                <input
                  type="text"
                  value={newOptions}
                  onChange={(e) => setNewOptions(e.target.value)}
                  placeholder="नया आवेदन, सुधार / संशोधन, स्थिति जांचें"
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md tap-bounce"
                >
                  सेवा लाइव जोड़ें
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
