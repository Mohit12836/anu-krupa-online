# ANU KRUPA ONLINE — 11 DATA MODELS & CONTRACTS

**Doc ID:** DOC-11  
**Version:** 1.0.0  
**Status:** APPROVED BASELINE  
**Authority:** Section F (Service Data Model)  

---

## 1. डेटा संरचनाएं (Data Schemas)

### DATA-001 — Category Schema (JSON / DB)
```json
{
  "categoryId": "kisan-krishi",
  "nameHi": "किसान एवं कृषि सेवाएं",
  "nameEn": "Kisan & Agriculture",
  "icon": "Sprout",
  "badge": "मुख्य सेवा",
  "color": "from-emerald-600 to-green-700",
  "description": "KCC, PM Kisan, फसल बीमा, खसरा-खतौनी, ई-उपार्जन",
  "displayOrder": 1,
  "isPublished": true
}
```

### DATA-002 — Service Schema (JSON / DB)
```json
{
  "id": "kcc",
  "categoryId": "kisan-krishi",
  "nameHi": "Kisan Credit Card (KCC)",
  "nameEn": "Kisan Credit Card",
  "badge": "सर्वाधिक लोकप्रिय",
  "taglineHi": "नया / नवीनीकरण / लिमिट बढ़वाना",
  "descriptionHi": "किसानों के लिए कम ब्याज पर खेती ऋण...",
  "isPopular": true,
  "isFeatured": true,
  "availability": "available",
  "image": "https://images.unsplash.com/...",
  "icon": "CreditCard",
  "options": ["नया KCC आवेदन", "KCC नवीनीकरण", "लिमिट बढ़वाना"],
  "requiredDocs": ["खसरा-खतौनी / B1 नकल", "आधार कार्ड", "बैंक पासबुक", "फोटो"],
  "feeStructure": {
    "govtFee": "बैंक नियमानुसार",
    "serviceFee": "उचित सेवा शुल्क"
  },
  "displayOrder": 1
}
```

### DATA-003 — Customer Inquiry Schema (Lead Pipeline)
```sql
CREATE TABLE customer_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id VARCHAR(50) NOT NULL,
  service_name VARCHAR(150) NOT NULL,
  selected_option VARCHAR(100),
  customer_note TEXT,
  customer_phone VARCHAR(15),
  status VARCHAR(20) DEFAULT 'NEW', -- NEW, IN_PROGRESS, COMPLETED, CLOSED
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

### DATA-004 — Google Sheets Auto-Sync Schema (Webhook Payload)
```json
{
  "action": "NEW_INQUIRY | UPDATE_STATUS | SYNC_SERVICES",
  "timestamp": "ISO_TIMESTAMP",
  "data": {
    "id": "INQ-101",
    "customerName": "राकेश पाटीदार (उकेड़िया)",
    "phone": "98261XXXXX",
    "serviceName": "Kisan Credit Card (KCC)",
    "selectedOption": "KCC नवीनीकरण",
    "note": "3 लाख की लिमिट बढ़वानी है",
    "status": "NEW"
  }
}
```
* **Auto-creation:** Google Apps Script automatically checks for Sheet `पूछताछ (Inquiries)`, creates it if missing, freezes the header, sets dark navy styling, and appends the lead row.
* **Dual-Engine:** Works independently or alongside Supabase (`dual` mode).
```
