# ANU KRUPA ONLINE — OWNER ADMIN PANEL SPECIFICATION
### *Mobile App Simplicity: Minimum Typing + Maximum Tapping + One-Hand Control*

---

## 1. एडमिन का मुख्य सिद्धांत (Core Philosophy)
दुकान संचालक (मालिक) को वेबसाइट मैनेज करने के लिए किसी कंप्यूटर, कोडिंग या जटिल डैशबोर्ड की ज़रूरत नहीं होगी।
एडमिन पैनल का अनुभव **PhonePe Merchant** या **Swiggy Partner** ऐप जैसा होगा — जिसे बस में चलते हुए या दुकान पर खड़े-खड़े **एक हाथ (One-Hand)** से संचालित किया जा सके।

### 3 मुख्य नियम:
1. **0% Code & Minimal Typing:** नाम और नंबर बदलने के अलावा 90% काम Toggle Switches, Chips, Dropdowns और Presets से होगा।
2. **Instant Preview & 1-Tap Publish:** कोई भी बदलाव पहले फोन पर दिखेगा, संतुष्ट होने पर 1-टैप में "Publish to Live" होगा।
3. **Safe Undo & Safeguards:** कोई भी महत्वपूर्ण सेवा ग़लती से डिलीट न हो, इसके लिए "Hide / Archive" प्राथमिकता होगी, सुरक्षित पुष्टि के साथ।

---

## 2. पाँच प्रमुख मोबाइल स्क्रीन (The 5 Mobile App Modules)

```
┌────────────────────────────────────────────────────────┐
│  📱 ANU KRUPA ONLINE — ADMIN MOBILE APP VIEW          │
├────────────────────────────────────────────────────────┤
│  [🔔 3 नई पूछताछ]        [🟢 वेबसाइट लाइव]   [⚙️ सेटिंग] │
│                                                        │
│  📊 आज का त्वरित सारांश (Today's Quick Glance)         │
│  ┌──────────────────────┬───────────────────────────┐  │
│  │ 📩 8 WhatsApp इंक्वायरी│ 🌾 4 KCC आवेदन प्रक्रिया में│  │
│  └──────────────────────┴───────────────────────────┘  │
│                                                        │
│  ⚡ क्विक टॉगल्स (1-Tap Quick Actions)                 │
│  [+] नई सेवा जोड़ें      [🖼️ बैनर बदलें]     [📢 सूचना] │
│                                                        │
│  📋 सेवाएं (चालू / बंद स्विच):                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 🌾 Kisan Credit Card (KCC)        [🟢 Active]    │  │
│  │ 🚗 Driving Licence (DL)           [🟢 Active]    │  │
│  │ 💳 PAN Card Correction            [🟢 Active]    │  │
│  │ ☀️ Solar Pump Subsidy             [⚪ Hidden]    │  │
│  └──────────────────────────────────────────────────┘  │
├────────────────────────────────────────────────────────┤
│   [🏠 डैशबोर्ड]  [📋 सेवाएं]  [📩 पूछताछ]  [🎨 बैनर]  [⚙️]  │
└────────────────────────────────────────────────────────┘
```

### मॉड्यूल 1: डैशबोर्ड (Dashboard — आज क्या महत्वपूर्ण है?)
* **लाइव स्टेटस इंडिकेटर:** दुकान खुली है / बंद है का 1-टैप स्विच।
* **क्विक मेट्रिक्स:** आज कितनी बार WhatsApp लिंक खोला गया, कौन सी सेवा सबसे ज्यादा खोजी गई।
* **पेंडिंग काम कार्ड:** कितने ग्राहकों के आवेदन प्रक्रिया में हैं (DBT लिंक, पैन सुधार, आदि)।

### मॉड्यूल 2: सेवा प्रबंधन (Services — Add, Edit, Toggle, Reorder)
* **चालू / बंद स्विच:** किसी भी सेवा का टॉगल ऑफ करते ही वह होमपेज पर तुरंत छुप जाती है।
* **प्रीसेट कार्ड्स (Preset Templates):** नई सेवा जोड़ने के लिए टाइपिंग नहीं, बल्कि 20 पूर्व-निर्मित सरकारी सेवा टेम्पलेट्स में से सिर्फ सिलेक्ट करना।
* **दस्तावेज़ चयन (Chip Selector):** दस्तावेज़ टाइप करने की जगह [आधार कार्ड], [खसरा], [बैंक पासबुक], [फोटो] चिप्स पर टैप करके ऑन/ऑफ करना।
* **ड्रैग एंड ड्रॉप / अप-डाउन टैप:** होमपेज पर कौन सी सेवा 1, 2, 3 नंबर पर दिखेगी, उसे सीधे ऊपर-नीचे स्वाइप करना।

### मॉड्यूल 3: पूछताछ व ग्राहक ट्रैकिंग (Enquiries Pipeline)
* जब भी ग्राहक WhatsApp बटन दबाएगा, एडमिन में एक 'Lead Card' सुरक्षित होगा।
* 3-टैप स्थिति बदलाव:
  * 🟡 **New (नई पूछताछ)**
  * 🔵 **In Progress (दस्तावेज़ जमा / प्रक्रियाधीन)**
  * 🟢 **Completed (काम पूरा हुआ / रसीद भेजी)**
  * 🔴 **Cancelled (रद्द)**

### मॉड्यूल 4: वेबसाइट रूप-रंग व बैनर (Website Banners & Notices)
* **बैनर स्विच:** किसान सीजन में किसान बैनर टॉप पर, मार्च टैक्स सीजन में GST/ITR बैनर 1-टैप में सक्रिय।
* **दुकान नोटिस बोर्ड:** "आज अवकाश रहेगा" या "ई-उपार्जन पंजीयन शुरू हो गया है" जैसी सूचना 1 मिनट में लाइव करना।

### मॉड्यूल 5: सेटिंग्स (Settings & Timings)
* WhatsApp नंबर संशोधन (एक जगह बदलने पर पूरी वेबसाइट पर तुरंत अपडेट)।
* दुकान खुलने का समय और अवकाश प्रबंधन।
* बैकअप और डेटा एक्सपोर्ट।

---

## 3. भविष्य का डेटाबेस स्कीमा (Planned Database Schema - PostgreSQL / Supabase)

```sql
-- 1. संगठन एवं दुकान प्रोफ़ाइल
CREATE TABLE store_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  whatsapp_number VARCHAR(15) NOT NULL,
  address_hi TEXT NOT NULL,
  working_hours_hi VARCHAR(100) NOT NULL,
  is_open_today BOOLEAN DEFAULT true,
  announcement_banner TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. सेवाएं और उपलब्धता
CREATE TABLE services (
  id VARCHAR(50) PRIMARY KEY,
  category_id VARCHAR(50) NOT NULL,
  name_hi VARCHAR(150) NOT NULL,
  name_en VARCHAR(150),
  badge VARCHAR(50),
  tagline_hi VARCHAR(255),
  description_hi TEXT,
  image_url TEXT,
  is_popular BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  options JSONB DEFAULT '[]'::jsonb,
  required_docs JSONB DEFAULT '[]'::jsonb,
  fee_structure JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ग्राहक पूछताछ रिकॉर्ड (Inquiries Pipeline)
CREATE TABLE customer_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id VARCHAR(50) REFERENCES services(id),
  service_name VARCHAR(150) NOT NULL,
  selected_option VARCHAR(100),
  customer_note TEXT,
  customer_phone VARCHAR(15),
  status VARCHAR(20) DEFAULT 'new', -- new, in_progress, completed, archived
  source VARCHAR(20) DEFAULT 'whatsapp_click',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 4. सुरक्षा एवं ऑथेंटिकेशन (Security & Role-Based Access)
* एडमिन केवल अधिकृत फोन नंबर पर **WhatsApp OTP** या **सुरक्षित पासकी (PIN)** से खुलेगा।
* कोई भी अनधिकृत व्यक्ति या इंटरनेट बॉट एडमिन डेटा में छेड़छाड़ नहीं कर सकेगा।
* सभी संवेदनशील क्रेडेंशियल्स सर्वर एनवायरनमेंट वेरिएबल्स (`.env`) में सुरक्षित रहेंगे।
