import React, { createContext, useContext, useState, useEffect } from 'react';
import { SERVICES } from '../data/servicesData';
import { CATEGORIES, MACRO_VERTICALS } from '../data/categoriesData';
import { BUSINESS_CONFIG } from '../data/businessConfig';
import { HERO_SLIDES, SIDE_BANNERS, PROMO_CARDS } from '../data/bannersData';
import { dbAdapter } from '../services/dbAdapter';

const StoreContext = createContext(null);

const STORAGE_KEYS = {
  SERVICES: 'ak_online_services_v2', // v2 with merged rich catalog
  SETTINGS: 'ak_online_settings_v1',
  INQUIRIES: 'ak_online_inquiries_v2',
  BANNERS: 'ak_online_banners_v1',
  PARTNERS: 'ak_online_partners_v1',
  CURRENT_PARTNER: 'ak_online_current_partner_v1',
  ACTIVE_REF: 'ak_online_active_ref_v1',
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
    status: 'IN_PROGRESS',
    partnerId: 'AKP-7821',
    partnerName: 'दिलीप पाटीदार',
    createdAt: 'आज, 11:30 AM',
  },
  {
    id: 'inq-102',
    customerName: 'सुनील धाकड़ (जावरा)',
    phone: '94258XXXXX',
    serviceId: 'pm-surya-ghar-solar',
    serviceName: 'PM सूर्य घर मुफ्त बिजली योजना',
    selectedOption: '3 kW ग्रिड कनेक्टेड रूफटॉप',
    note: 'घर की छत पर ₹78,000 सब्सिडी वाला लगवाना है।',
    status: 'NEW',
    partnerId: 'AKP-9042',
    partnerName: 'राकेश धाकड़',
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
    partnerId: null,
    partnerName: null,
    createdAt: 'कल, 04:45 PM',
  },
];

// Initial realistic Work-From-Home partners
const INITIAL_PARTNERS = [
  {
    id: 'AKP-7821',
    name: 'दिलीप पाटीदार',
    phone: '9826123456',
    village: 'उकेड़िया (जावरा)',
    upiId: 'dilip.patidar@oksbi',
    leadsCount: 6,
    commissionEarned: 750,
    commissionPaid: 500,
    status: 'ACTIVE',
    joinedAt: '2026-10-18',
  },
  {
    id: 'AKP-9042',
    name: 'राकेश धाकड़',
    phone: '9425876543',
    village: 'जावरा शहर',
    upiId: 'rakesh9425@paytm',
    leadsCount: 4,
    commissionEarned: 2200,
    commissionPaid: 1000,
    status: 'ACTIVE',
    joinedAt: '2026-10-21',
  },
  {
    id: 'AKP-3419',
    name: 'कमलेश चौधरी',
    phone: '9123456789',
    village: 'पिपलोदा (रतलाम)',
    upiId: 'kamlesh@ibl',
    leadsCount: 2,
    commissionEarned: 200,
    commissionPaid: 0,
    status: 'ACTIVE',
    joinedAt: '2026-10-23',
  },
];

export function StoreProvider({ children }) {
  // 1. Services State with safe merge so new catalog items appear while preserved hidden status stays intact
  const [services, setServices] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SERVICES) || localStorage.getItem('ak_online_services_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        const savedMap = new Map(parsed.map(s => [s.id, s]));
        return SERVICES.map(item => {
          const existing = savedMap.get(item.id);
          if (existing) {
            const isHidden = existing.isHidden ?? (existing.availability === 'hidden' || existing.availability === 'paused');
            return {
              ...item,
              isHidden: isHidden,
              availability: isHidden ? 'hidden' : 'available',
              isPopular: existing.isPopular ?? item.isPopular,
            };
          }
          return item;
        });
      }
      return SERVICES;
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
      const saved = localStorage.getItem(STORAGE_KEYS.INQUIRIES) || localStorage.getItem('ak_online_inquiries_v1');
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

  // 5. Work-From-Home Partners State
  const [partners, setPartners] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PARTNERS);
      return saved ? JSON.parse(saved) : INITIAL_PARTNERS;
    } catch {
      return INITIAL_PARTNERS;
    }
  });

  // 6. Current User's Registered Partner Profile (if they registered on this device)
  const [currentPartner, setCurrentPartner] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_PARTNER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // 7. Active Referral Code detected from URL ?ref=AKP-XXXX
  const [activeRef, setActiveRef] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const refParam = urlParams.get('ref');
        if (refParam) {
          const cleaned = refParam.trim().toUpperCase();
          localStorage.setItem(STORAGE_KEYS.ACTIVE_REF, cleaned);
          return cleaned;
        }
      }
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_REF) || null;
    } catch {
      return null;
    }
  });

  // Listen to URL search param on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const refParam = urlParams.get('ref');
      if (refParam) {
        const cleaned = refParam.trim().toUpperCase();
        setActiveRef(cleaned);
        localStorage.setItem(STORAGE_KEYS.ACTIVE_REF, cleaned);
      }
    }
  }, []);

  // Save states to localStorage
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

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PARTNERS, JSON.stringify(partners));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [partners]);

  useEffect(() => {
    try {
      if (currentPartner) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_PARTNER, JSON.stringify(currentPartner));
      }
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [currentPartner]);

  // Actions for Owner

  // Toggle active / hidden status of a service (Hide / Unhide)
  const toggleServiceStatus = (serviceId) => {
    setServices((prev) =>
      prev.map((s) => {
        if (s.id !== serviceId) return s;
        const isCurrentlyHidden = s.availability === 'paused' || s.availability === 'hidden' || s.isHidden === true;
        return {
          ...s,
          availability: isCurrentlyHidden ? 'available' : 'hidden',
          isHidden: !isCurrentlyHidden,
        };
      })
    );
  };

  const hideService = (serviceId) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === serviceId ? { ...s, availability: 'hidden', isHidden: true } : s
      )
    );
  };

  const unhideService = (serviceId) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === serviceId ? { ...s, availability: 'available', isHidden: false } : s
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
      isHidden: false,
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
    dbAdapter.syncInquiryStatus(inquiryId, newStatus);
  };

  // Record a new inquiry when customer clicks WhatsApp (attaches active referral partner if present)
  const recordInquiry = ({ serviceName, selectedOption, customerNote, partnerRef: explicitRef }) => {
    const refCode = explicitRef || activeRef || null;
    const matchedPartner = refCode ? partners.find(p => p.id === refCode) : null;

    const newInq = {
      id: `inq-${Date.now()}`,
      customerName: 'वेबसाइट आगंतुक (Website Visitor)',
      phone: 'WhatsApp Chat',
      serviceId: serviceName ? serviceName.toLowerCase().replace(/\s+/g, '-') : 'general',
      serviceName: serviceName || 'सामान्य पूछताछ',
      selectedOption: selectedOption || 'जानकारी',
      note: customerNote || '',
      status: 'NEW',
      partnerId: refCode,
      partnerName: matchedPartner ? matchedPartner.name : (refCode ? `पार्टनर ${refCode}` : null),
      createdAt: 'अभी (Just now)',
    };

    setInquiries((prev) => [newInq, ...prev]);
    dbAdapter.syncInquiry(newInq);

    // If referred by a partner, increment partner lead count & estimated commission
    if (refCode) {
      setPartners((prev) =>
        prev.map((p) => {
          if (p.id === refCode) {
            return {
              ...p,
              leadsCount: (p.leadsCount || 0) + 1,
              commissionEarned: (p.commissionEarned || 0) + 50, // default ₹50 commission per lead
            };
          }
          return p;
        })
      );
    }
  };

  // Work-From-Home Partner Registration
  const registerPartner = ({ name, phone, village, upiId }) => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const partnerId = `AKP-${randomSuffix}`;

    const newPartner = {
      id: partnerId,
      name: name.trim(),
      phone: phone.trim(),
      village: village.trim() || 'मध्य प्रदेश',
      upiId: upiId.trim(),
      leadsCount: 0,
      commissionEarned: 0,
      commissionPaid: 0,
      status: 'ACTIVE',
      joinedAt: new Date().toISOString().split('T')[0],
    };

    setPartners((prev) => [newPartner, ...prev]);
    setCurrentPartner(newPartner);
    return newPartner;
  };

  // Mark commission paid by Admin
  const markCommissionPaid = (partnerId, amountPaid = null) => {
    setPartners((prev) =>
      prev.map((p) => {
        if (p.id === partnerId) {
          const totalEarned = p.commissionEarned || 0;
          return {
            ...p,
            commissionPaid: amountPaid ? (p.commissionPaid || 0) + Number(amountPaid) : totalEarned,
          };
        }
        return p;
      })
    );
  };

  // Update partner status (ACTIVE / PAUSED)
  const updatePartnerStatus = (partnerId, newStatus) => {
    setPartners((prev) =>
      prev.map((p) => (p.id === partnerId ? { ...p, status: newStatus } : p))
    );
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
    setPartners(INITIAL_PARTNERS);
    localStorage.removeItem(STORAGE_KEYS.SERVICES);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.INQUIRIES);
    localStorage.removeItem(STORAGE_KEYS.PARTNERS);
  };

  return (
    <StoreContext.Provider
      value={{
        services,
        categories: CATEGORIES,
        macroVerticals: MACRO_VERTICALS,
        settings,
        inquiries,
        heroSlides,
        partners,
        currentPartner,
        activeRef,
        dbConfig,
        updateDbConfig,
        dbAdapter,
        syncAllServicesToSheet,
        toggleServiceStatus,
        hideService,
        unhideService,
        toggleServicePopular,
        updateService,
        addService,
        updateSettings,
        updateInquiryStatus,
        recordInquiry,
        registerPartner,
        markCommissionPaid,
        updatePartnerStatus,
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
