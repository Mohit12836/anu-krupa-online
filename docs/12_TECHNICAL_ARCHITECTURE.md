# ANU KRUPA ONLINE — 12 TECHNICAL ARCHITECTURE & STACK

**Doc ID:** DOC-12  
**Version:** 1.0.0  
**Status:** APPROVED BASELINE  
**Authority:** Section J (Development Architecture)  

---

## 1. फ्रंटएंड स्टैक (Frontend Stack)
* **Framework:** React 19 + Vite 6
* **Styling:** Tailwind CSS v4 + `@tailwindcss/vite` (Zero config, pure performance)
* **Icons:** `lucide-react` (लाइटवेट, साफ़-सुथरे SVG आइकन्स)
* **Fonts:** `Inter` + `Hind` (Google Web Fonts)
* **Design Principles:** 100% Fluid Auto-Fit, clamp() typography, zero horizontal scroll

---

## 2. सीमाएं एवं पृथक्करण (Architecture Boundaries)
* **ARCH-001 (Isolated Repo):** Anu Krupa Online का संपूर्ण कोडबेस स्वतंत्र व पृथक है।
* **ARCH-002 (Separation of Concerns):** UI कंपोनेंट्स को डेटा लेयर (`src/data/`) से अलग रखा गया है।
* **ARCH-003 (Backend Decoupling):** पब्लिक वेबसाइट स्थानीय JSON/JS ऑब्जेक्ट्स से चलती है; भविष्य में इसे बिना UI तोड़े सीधे Supabase / PostgreSQL API से जोड़ा जा सकेगा।
* **ARCH-004 (Zero Secret Exposure):** कोई भी API कुंजी या संवेदनशील टोकन क्लाइंट कोड में नहीं होगा।
