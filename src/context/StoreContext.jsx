import React, { createContext, useContext, useState, useEffect } from 'react';
import { SERVICES } from '../data/servicesData';
import { CATEGORIES } from '../data/categoriesData';
import { BUSINESS_CONFIG } from '../data/businessConfig';
import { HERO_SLIDES, SIDE_BANNERS, PROMO_CARDS } from '../data/bannersData';
import { dbAdapter } from '../services/dbAdapter';

const StoreContext = createContext(null);

const STORAGE_KEYS = {
  SERVICES: 'ak_online_services_v1',
  SETTINGS: 'ak_online_settings_v1',
  INQUIRIES: 'ak_online_inquiries_v1',
  BANNERS: 'ak_online_banners_v1',
};

// Initial realistic customer inquiries for demonstration
const INITIAL_INQUIRIES = [
  {
    id: 'inq-101',
    customerName: 'राकेश पाटीदार (उकेड़िया)',
    phone: '98261XXXXX',
    serviceId: 'kcc',
    serviceName: 'Kisan Credit Card (KCC)',
    selectedOption: 'KCC नवीनीकरण (Renewal)',
    note: 'पुराने KCC की 3 लाख की लिमिट बढ़वानी है।',
    status: 'IN_PROGRESS', // NEW, IN_PROGRESS, COMPLETED, CLOSED
    createdAt: 'आज, 11:30 AM',
  },
  {
    id: 'inq-102',
    customerName: 'सुनील धाकड़ (जावरा)',
    phone: '94258XXXXX',
    serviceId: 'driving-licence',
    serviceName: 'Driving Licence (DL)',
    selectedOption: 'स्थायी लाइसेंस (Permanent DL)',
    note: 'लर्निंग लाइसेंस 1 महीना पहले बना था।',
    status: 'NEW',
    createdAt: 'आज, 01:15 PM',
  },
  {
    id: 'inq-103',
    customerName: 'ममता बाई (उकेड़िया)',
    phone: '97542XXXXX',
    serviceId: 'ayushman-card',
    serviceName: 'Ayushman Card (PM-JAY)',
    selectedOption: 'परिवार के नए सदस्य का नाम जोड़ना',
    note: 'बच्चे का नाम समग्र आईडी में जुड़ गया है।',
    status: 'COMPLETED',
    createdAt: 'कल, 04:45 PM',
  },
];

export function StoreProvider({ children }) {
  // 1. Services State
  const [services, setServices] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
      return saved ? JSON.parse(saved) : SERVICES;
    } catch {
      return SERVICES;
    }
  });

  // 2. Store Settings State
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : {
        ...BUSINESS_CONFIG,
        isOpenToday: true,
        announcementBanner: '🌾 किसान भाइयों के लिए समर्थन मूल्य ई-उपार्जन पंजीयन शुरू हो गया है।',
      };
    } catch {
      return {
        ...BUSINESS_CONFIG,
        isOpenToday: true,
        announcementBanner: '🌾 किसान भाइयों के लिए समर्थन मूल्य ई-उपार्जन पंजीयन शुरू हो गया है।',
      };
    }
  });

  // 3. Inquiries Pipeline State
  const [inquiries, setInquiries] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
      return saved ? JSON.parse(saved) : INITIAL_INQUIRIES;
    } catch {
      return INITIAL_INQUIRIES;
    }
  });

  // 4. Hero Slides State
  const [heroSlides, setHeroSlides] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BANNERS);
      return saved ? JSON.parse(saved) : HERO_SLIDES;
    } catch {
      return HERO_SLIDES;
    }
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [services]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [inquiries]);

  // Actions for Owner

  // Toggle active / hidden status of a service
  const toggleServiceStatus = (serviceId) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === serviceId
          ? { ...s, availability: s.availability === 'paused' ? 'available' : 'paused' }
          : s
      )
    );
  };

  // Toggle popular flag
  const toggleServicePopular = (serviceId) => {
    setServices((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, isPopular: !s.isPopular } : s))
    );
  };

  // Update existing service
  const updateService = (serviceId, updatedFields) => {
    setServices((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, ...updatedFields } : s))
    );
  };

  // Add new service
  const addService = (newService) => {
    const formatted = {
      ...newService,
      id: newService.id || `srv-${Date.now()}`,
      availability: 'available',
      isPopular: newService.isPopular ?? false,
      isFeatured: newService.isFeatured ?? false,
      displayOrder: services.length + 1,
    };
    setServices((prev) => [formatted, ...prev]);
  };

  // Update store settings (Shop open/close, banner, whatsapp)
  const updateSettings = (updatedFields) => {
    setSettings((prev) => ({ ...prev, ...updatedFields }));
  };

  // 5. Cloud Database & Google Sheet Sync Config
  const [dbConfig, setDbConfig] = useState(() => dbAdapter.getConfig());

  const updateDbConfig = (newCfg) => {
    const updated = dbAdapter.saveConfig(newCfg);
    setDbConfig({ ...updated });
    return updated;
  };

  // Inquiry Status Change (NEW -> IN_PROGRESS -> COMPLETED -> CLOSED)
  const updateInquiryStatus = (inquiryId, newStatus) => {
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === inquiryId ? { ...inq, status: newStatus } : inq))
    );
    // Background async sync to Supabase / Google Sheet
    dbAdapter.syncInquiryStatus(inquiryId, newStatus);
  };

  // Record a new inquiry when customer clicks WhatsApp
  const recordInquiry = ({ serviceName, selectedOption, customerNote }) => {
    const newInq = {
      id: `inq-${Date.now()}`,
      customerName: 'वेबसाइट आगंतुक (Website Visitor)',
      phone: 'WhatsApp Chat',
      serviceId: serviceName ? serviceName.toLowerCase().replace(/\s+/g, '-') : 'general',
      serviceName: serviceName || 'सामान्य पूछताछ',
      selectedOption: selectedOption || 'जानकारी',
      note: customerNote || '',
      status: 'NEW',
      createdAt: 'अभी (Just now)',
    };
    setInquiries((prev) => [newInq, ...prev]);
    // Background async sync to Supabase / Google Sheet
    dbAdapter.syncInquiry(newInq);
  };

  // Bulk sync all current services to Google Sheet
  const syncAllServicesToSheet = async () => {
    return await dbAdapter.syncAllServicesToSheet(services);
  };

  // Reset to original factory catalog
  const resetToFactoryDefault = () => {
    setServices(SERVICES);
    setSettings({
      ...BUSINESS_CONFIG,
      isOpenToday: true,
      announcementBanner: '🌾 किसान भाइयों के लिए समर्थन मूल्य ई-उपार्जन पंजीयन शुरू हो गया है।',
    });
    setInquiries(INITIAL_INQUIRIES);
    localStorage.removeItem(STORAGE_KEYS.SERVICES);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.INQUIRIES);
  };

  return (
    <StoreContext.Provider
      value={{
        services,
        categories: CATEGORIES,
        settings,
        inquiries,
        heroSlides,
        dbConfig,
        updateDbConfig,
        dbAdapter,
        syncAllServicesToSheet,
        toggleServiceStatus,
        toggleServicePopular,
        updateService,
        addService,
        updateSettings,
        updateInquiryStatus,
        recordInquiry,
        resetToFactoryDefault,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
