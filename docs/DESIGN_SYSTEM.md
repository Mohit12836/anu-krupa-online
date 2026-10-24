# ANU KRUPA ONLINE — DESIGN SYSTEM SPECIFICATION

## 1. कलर पैलेट (Color Architecture)

| नाम | हेक्स कोड (Hex) | उद्देश्य एवं प्रयोग |
| :--- | :--- | :--- |
| **Dark Navy (Navy Slate)** | `#0A192F` / `#0F172A` | हेडर, टॉप बार, नेविगेशन, और प्राइमरी ब्रांडिंग तत्व। गंभीर और विश्वसनीय। |
| **Deep Royal Blue** | `#1E3A8A` / `#2563EB` | सब-हेडिंग्स, सरकारी सेवा टैग्स और लिंक्स। |
| **Sunset Warm Orange** | `#F97316` / `#EA580C` | मुख्य सर्च बटन, कॉल-टू-एक्शन (CTA) हाईलाइट्स, और विशेष सूचनाएं। |
| **Emerald WhatsApp Green** | `#10B981` / `#059669` | WhatsApp पूछताछ बटन, कन्फर्मेशन और सक्सेस स्टेटस। |
| **Light Canvas Neutral** | `#F8FAFC` / `#F1F5F9` | पूरे पेज का बैकग्राउंड, आंखों को सुखद कंट्रास्ट देने के लिए। |
| **Border & Card Stroke** | `#E2E8F0` / `#CBD5E1` | कार्ड्स और इनपुट बॉक्सेस के लिए सूक्ष्म एवं सुरुचिपूर्ण बॉर्डर। |

---

## 2. टाइपोग्राफी (Typography Tokens)

* **प्राथमिक फ़ॉन्ट (Primary):** `Inter`, `system-ui`, `-apple-system`, `sans-serif` (अंग्रेज़ी व संख्याओं के लिए)।
* **हिंदी फ़ॉन्ट (Devanagari):** `Hind`, `Noto Sans Devanagari` (हिंदी पाठ की स्पष्टता व सुंदरता के लिए)।
* **फ़्लूइड स्केलिंग (Fluid Formula via clamp):**
  * **Hero Title (H1):** `clamp(1.75rem, 4vw + 0.5rem, 3rem)`
  * **Section Title (H2):** `clamp(1.35rem, 2.5vw + 0.3rem, 2rem)`
  * **Card Title (H3):** `clamp(1.05rem, 1.5vw + 0.2rem, 1.35rem)`
  * **Body / Paragraphs:** `clamp(0.9rem, 0.8vw + 0.25rem, 1.05rem)`
  * **Small / Badges:** `clamp(0.75rem, 0.4vw + 0.35rem, 0.85rem)`

---

## 3. माइक्रो-फ़िज़िक्स एवं इंटरैक्शन (Micro-Physics Standards)

1. **Tap-Bounce Feedback:**
   हर बटन और कार्ड पर टैप/क्लिक करने पर सूक्ष्म हैप्टिक इफ़ेक्ट (`active:scale-95` और `transition: transform 0.15s ease`).
2. **Card Elevation:**
   माउस ले जाने (hover) पर कार्ड `translate-y-[-3px]` उठेगा और सटल शैडो (`shadow-md` से `shadow-xl`) उत्पन्न होगी।
3. **Ambient Light Mesh:**
   हीरो सेक्शन में हल्का, धीमा मूविंग ग्लो (CSS `ambientGlow` कीफ्रेम्स) जो प्रीमियम मार्केटप्लेस का अहसास देता है बिना सीपीयू पर भारी पड़े।
4. **Zero Layout Shifts:**
   सभी तस्वीरों और आइकन्स के लिए एस्पेक्ट रेशियो और डाइमेंशन पूर्व-निर्धारित ताकि पेज लोड होते समय कोई जर्क न हो।

---

## 4. रिस्पॉन्सिव ग्रिड नियम (100% Fluid Auto-Fit)

* **कंटेनर:** `max-width: min(100% - 1.5rem, 1320px)`
* **कैटेगरी टैब्स:** डेस्कटॉप पर 9-कॉलम ऑटो-फ़िट ग्रिड; मोबाइल पर हॉरिजॉन्टल स्मूथ स्क्रॉलबार चिप्स।
* **सर्विस कार्ड्स:** `grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr))`
* **मोबाइल बॉटम नेविगेशन:** 768px से नीचे की स्क्रीन पर बॉटम-फ़िक्स्ड 5-टैब नेविगेशन (Home, Services, Guided Help, Location, WhatsApp)।
