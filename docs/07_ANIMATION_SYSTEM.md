# ANU KRUPA ONLINE — 07 MOTION & LIGHT ENGINE

**Doc ID:** DOC-07  
**Version:** 1.0.0  
**Status:** APPROVED BASELINE  
**Authority:** Section D (Motion & Light Engine)  

---

## 1. प्रकाश एवं गति विनिर्देश (Motion Specs)

### MOT-001 — हीरो एंबिएंट लाइट मेश (Ambient Mesh)
* हीरो बैकग्राउंड में धीमी, जैविक रूप से चलने वाली एंबिएंट लाइट (`@keyframes ambientGlow`, 8s ease-in-out infinite)।
* टेक्स्ट पठनीयता पर 0% नकारात्मक असर।

### MOT-002 — कार्ड एलिवेशन व होवर ग्लो (Card Elevation)
* डेस्कटॉप होवर: `translate-y-[-3px]` और `shadow-xl`।
* मोबाइल टच: हैप्टिक-स्टाइल `active:scale-95` और `transition: transform 0.15s ease`।

### MOT-003 — स्मूथ स्क्रॉलिंग व सेक्शन रिवील (Scroll Experience)
* मोबाइल पर स्वाभाविक (natural) स्क्रॉलिंग — कोई जबरन 100vh कट नहीं।
* सेक्शन्स का सौम्य फेड-इन प्रवेश।

### MOT-004 — चयन विजुअल फीडबैक (Tap Feedback)
* किसी भी श्रेणी या चिप पर टैप करते ही तत्काल बॉर्डर हाइलाइट और चेक मार्क (✓)।

### MOT-005 — एनिमेशन पाबंदियां (Restrictions)
* कोई चमकीली (flashing) या चक्कर लाने वाली गति नहीं।
* कोई ऑटो-प्लेइंग आवाज़ (sound effects) नहीं।
* `prefers-reduced-motion` का पूर्ण सम्मान।
* कमजोर Android फोन पर भी स्मूथ 60fps परफॉरमेंस।

### MOT-006 — कोर वेब वाइटल्स लक्ष्य (Performance Targets)
* **LCP (Largest Contentful Paint):** < 2.5s
* **INP (Interaction to Next Paint):** < 200ms
* **CLS (Cumulative Layout Shift):** < 0.1
