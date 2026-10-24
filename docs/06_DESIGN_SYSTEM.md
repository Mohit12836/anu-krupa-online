# ANU KRUPA ONLINE — 06 UI DESIGN SYSTEM & TOKENS

**Doc ID:** DOC-06  
**Version:** 1.0.0  
**Status:** APPROVED BASELINE  
**Authority:** Section C (UI/UX Design System)  

---

## 1. कलर टोकन्स (Color Tokens)

| टोकन नाम | हेक्स कोड (Hex) | उपयोग व भूमिका |
| :--- | :--- | :--- |
| `--color-navy-dark` | `#091726` | डीप हेडर बैकग्राउंड, फुटर व बॉटम बार |
| `--color-navy-primary` | `#10243A` | नेविगेशन, कार्ड बॉर्डर्स व डार्क कंटेनर्स |
| `--color-orange-accent` | `#FF8A24` | प्राइमरी CTAs, सर्च बटन, हाइलाइट्स |
| `--color-orange-hover` | `#EA580C` | बटन होवर व एक्टिव स्टेट्स |
| `--color-whatsapp-green` | `#16A34A` | WhatsApp बटन, ट्रस्ट चेक मार्क्स |
| `--color-canvas-bg` | `#F7F9FC` | पेज का मुख्य बैकग्राउंड (आंखों के लिए सौम्य) |
| `--color-card-white` | `#FFFFFF` | सर्विस कार्ड्स व मॉडल्स |
| `--color-text-primary` | `#152238` | मुख्य हेडिंग्स व टाइटल टेक्स्ट |

---

## 2. टाइपोग्राफी टोकन्स (Typography via clamp)

* **फ़ॉन्ट परिवार:** `Inter` (अंग्रेज़ी/नंबर्स) + `Hind` / `Noto Sans Devanagari` (शुद्ध हिंदी)
* **Hero Title (H1):** `clamp(1.75rem, 4vw + 0.5rem, 3rem)`
* **Section Title (H2):** `clamp(1.35rem, 2.5vw + 0.3rem, 2rem)`
* **Card Title (H3):** `clamp(1.05rem, 1.5vw + 0.2rem, 1.35rem)`
* **Body / Paragraph:** `clamp(0.9rem, 0.8vw + 0.25rem, 1.05rem)`
* **Small / Badges:** `clamp(0.75rem, 0.4vw + 0.35rem, 0.85rem)`

---

## 3. ग्रिड एवं ऑटो-फ़िट नियम (100% Fluid Auto-Fit)

* **कंटेनर चौड़ाई:** `width: 100%; max-width: min(100% - 1.5rem, 1320px); margin-inline: auto;`
* **सर्विस ग्रिड:** `grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));`
* **टच टारगेट्स:** सभी बटन्स और क्लिकेबल चिप्स न्यूनतम `44px` से `48px` ऊंचाई।
* **हॉरिजॉन्टल स्क्रॉल पाबंदी:** किसी भी स्क्रीन पर हॉरिजॉन्टल ओवरफ़्लो पूरी तरह वर्जित।
