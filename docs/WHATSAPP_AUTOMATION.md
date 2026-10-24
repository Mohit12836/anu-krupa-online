# ANU KRUPA ONLINE — WHATSAPP COMMERCE & AUTOMATION ARCHITECTURE

## 1. वर्तमान चरण: Click-to-Chat (Zero Spam, Instant Direct Human Touch)

* **तकनीक:** आधिकारिक `https://wa.me/916263879076?text=...` प्रोटोकॉल।
* **सुरक्षा एवं नीति अनुपालन:**
  - ग्राहक स्वयं अपने मोबाइल या वेब WhatsApp में संदेश देखता है और स्वेच्छा से भेजता है।
  - कोई अनधिकृत ऑटो-मैसेजिंग या बॉट स्क्रैपिंग नहीं, जिससे WhatsApp नंबर सुरक्षित रहता है और कभी बैन नहीं हो सकता।
  - ग्राहक से कोई भी गोपनीय डेटा (पासवर्ड, बैंक पिन) वेबसाइट पर नहीं मांगा जाता।

---

## 2. भविष्य का चरण: आधिकारिक WhatsApp Business Cloud API (WACA Architecture)

जब दैनिक संदेशों की संख्या 50+ से अधिक हो जाएगी, तब हम **Meta WhatsApp Business Cloud API (WACA)** का आधिकारिक एकीकरण करेंगे।

### WACA आर्किटेक्चरल पाइपलाइन:

```
[ग्राहक WhatsApp संदेश] 
        │
        ▼ (HTTPS Webhook)
[FastAPI / Next.js Webhook Server]
        │
        ▼ (Token Verification & Secret HMAC-SHA256)
[Intent Engine / LangGraph Router]
        │
        ├─► Node 1: पूछताछ का प्रकार पहचानें (KCC / PAN / DL / Status Check)
        │
        ├─► Node 2: इंटरएक्टिव क्विक रिप्लाई बटन्स भेजें (Interactive Button / List Message)
        │
        ├─► Node 3: दस्तावेज़ चेकलिस्ट भेजें (Document Checklist PDF/Card)
        │
        └─► Node 4: यदि जटिल सवाल हो ➔ तुरंत संचालक (Human Escalation) को सूचित करें
```

### 3. सख्त मेटा नीतियां (Meta Compliance & Policies)
1. **24-Hour Customer Service Window:** ग्राहक द्वारा भेजे गए संदेश के 24 घंटे के भीतर ही बॉट मुक्त रूप से उत्तर दे सकता है।
2. **Approved Notification Templates:** 24 घंटे के बाद केवल मेटा द्वारा पूर्व-स्वीकृत यूटिलिटी टेम्पलेट संदेश (जैसे "आपका पैन कार्ड तैयार हो गया है") भेजे जा सकेंगे।
3. **Explicit Opt-in:** मार्केटिंग या ऑफर्स केवल उन्हीं ग्राहकों को जाएंगे जिन्होंने स्वेच्छा से सहमति दी हो।
4. **WhatsApp Channel:** एकतरफ़ा ब्रॉडकास्ट (जैसे खाद/बीज सब्सिडी या लाड़ली बहना अपडेट) के लिए आधिकारिक WhatsApp Channel का उपयोग होगा, ताकि व्यक्तिगत चैट पर स्पैम न हो।
