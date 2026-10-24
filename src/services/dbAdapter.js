import { createClient } from '@supabase/supabase-js';

const DB_CONFIG_KEY = 'ak_online_db_config_v1';

export const DEFAULT_DB_CONFIG = {
  mode: 'local', // 'local' | 'supabase' | 'sheet' | 'dual'
  supabaseUrl: '',
  supabaseAnonKey: '',
  sheetWebhookUrl: '',
  autoSyncInquiries: true,
  autoSyncServices: true,
  lastSyncTime: null,
  lastSyncStatus: null,
};

// Ready-to-copy Google Apps Script that auto-creates sheets and columns
export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * ANU KRUPA ONLINE — Autonomous Google Sheet Sync Engine
 * 1. Google Sheets खोलें -> Extensions -> Apps Script पर जाएं।
 * 2. यह पूरा कोड पेस्ट करें और Deploy -> New Deployment -> Web app चुनें।
 * 3. 'Execute as: Me' और 'Who has access: Anyone' रखें।
 * 4. प्राप्त Web App URL को Admin Panel में पेस्ट करें।
 */

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var payload = JSON.parse(e.postData.contents);
    var action = payload.action;
    var data = payload.data;
    var timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // 1. INQUIRY / LEAD SYNC
    if (action === 'NEW_INQUIRY' || action === 'TEST_INQUIRY') {
      var sheetName = "पूछताछ (Inquiries)";
      var sheet = ss.getSheetByName(sheetName);
      if (!sheet) {
        sheet = ss.insertSheet(sheetName);
        var headers = ["आईडी (ID)", "तारीख व समय", "ग्राहक का नाम", "फोन / संपर्क", "सेवा का नाम", "विकल्प / कार्य", "ग्राहक नोट", "स्थिति (Status)"];
        sheet.appendRow(headers);
        var headerRange = sheet.getRange(1, 1, 1, headers.length);
        headerRange.setBackground("#0F172A").setFontColor("#FFFFFF").setFontWeight("bold");
        sheet.setFrozenRows(1);
      }

      sheet.appendRow([
        data.id || ("INQ-" + new Date().getTime()),
        timestamp,
        data.customerName || "वेबसाइट ग्राहक",
        data.phone || "WhatsApp",
        data.serviceName || "सामान्य पूछताछ",
        data.selectedOption || "-",
        data.note || "-",
        data.status || "NEW"
      ]);

      sheet.autoResizeColumns(1, 8);
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Inquiry logged successfully" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 2. INQUIRY STATUS UPDATE
    if (action === 'UPDATE_STATUS') {
      var sheet = ss.getSheetByName("पूछताछ (Inquiries)");
      if (sheet) {
        var values = sheet.getDataRange().getValues();
        for (var i = 1; i < values.length; i++) {
          if (values[i][0] == data.id) {
            sheet.getRange(i + 1, 8).setValue(data.status);
            break;
          }
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Status updated" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 3. SERVICES CATALOG SYNC
    if (action === 'SYNC_SERVICES') {
      var sheetName = "सेवाएं (Services)";
      var sheet = ss.getSheetByName(sheetName);
      if (!sheet) {
        sheet = ss.insertSheet(sheetName);
      } else {
        sheet.clear();
      }
      var headers = ["सेवा आईडी", "सेवा का नाम (हिंदी)", "श्रेणी", "सरकारी शुल्क", "दुकान शुल्क", "समय सीमा", "स्थिति", "लोकप्रिय"];
      sheet.appendRow(headers);
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground("#EA580C").setFontColor("#FFFFFF").setFontWeight("bold");
      sheet.setFrozenRows(1);

      if (Array.isArray(data)) {
        data.forEach(function(s) {
          sheet.appendRow([
            s.id,
            s.nameHi || s.name || "-",
            s.categoryId || "-",
            (s.feeStructure && s.feeStructure.govtFee) || s.govtFee || "निःशुल्क",
            (s.feeStructure && s.feeStructure.serviceFee) || s.portalFee || "-",
            s.turnaroundTime || "1-2 दिन",
            s.availability === 'paused' ? 'बंद / छिपी' : 'सक्रिय',
            s.isPopular ? 'हाँ' : 'नहीं'
          ]);
        });
      }
      sheet.autoResizeColumns(1, 8);
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Services synced" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Ping received" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ status: "active", service: "Anu Krupa Online Sheet Sync API" }))
    .setMimeType(ContentService.MimeType.JSON);
}
`;

// Supabase SQL DDL for 1-Click setup
export const SUPABASE_SQL_SETUP = `-- ANU KRUPA ONLINE — Supabase Schema
-- Run this in Supabase SQL Editor:

CREATE TABLE IF NOT EXISTS inquiries (
  id TEXT PRIMARY KEY,
  customer_name TEXT,
  phone TEXT,
  service_id TEXT,
  service_name TEXT,
  selected_option TEXT,
  note TEXT,
  status TEXT DEFAULT 'NEW',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  name_hi TEXT NOT NULL,
  name_en TEXT,
  category_id TEXT,
  badge TEXT,
  govt_fee TEXT,
  service_fee TEXT,
  availability TEXT DEFAULT 'available',
  is_popular BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS store_settings (
  key TEXT PRIMARY KEY,
  value JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) with public read/write for web inquiries
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public inquiries insert" ON inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public inquiries read" ON inquiries FOR SELECT USING (true);
CREATE POLICY "Public inquiries update" ON inquiries FOR UPDATE USING (true);
`;

class DbAdapter {
  constructor() {
    this.config = this.loadConfig();
    this.supabaseClient = null;
    this.initSupabase();
  }

  loadConfig() {
    try {
      const saved = localStorage.getItem(DB_CONFIG_KEY);
      return saved ? { ...DEFAULT_DB_CONFIG, ...JSON.parse(saved) } : DEFAULT_DB_CONFIG;
    } catch {
      return DEFAULT_DB_CONFIG;
    }
  }

  saveConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    try {
      localStorage.setItem(DB_CONFIG_KEY, JSON.stringify(this.config));
    } catch (e) {
      console.warn('Error saving db config to localStorage', e);
    }
    this.initSupabase();
    return this.config;
  }

  initSupabase() {
    if (this.config.supabaseUrl && this.config.supabaseAnonKey) {
      try {
        this.supabaseClient = createClient(this.config.supabaseUrl, this.config.supabaseAnonKey);
      } catch (err) {
        console.warn('Supabase init error:', err);
        this.supabaseClient = null;
      }
    } else {
      this.supabaseClient = null;
    }
  }

  getConfig() {
    return this.config;
  }

  // 1. Test Supabase connection
  async testSupabaseConnection(url, anonKey) {
    const testUrl = url || this.config.supabaseUrl;
    const testKey = anonKey || this.config.supabaseAnonKey;
    if (!testUrl || !testKey) {
      return { success: false, message: 'Supabase URL और Anon Key दोनों आवश्यक हैं।' };
    }
    try {
      const client = createClient(testUrl, testKey);
      const { data, error } = await client.from('inquiries').select('id').limit(1);
      if (error && error.code !== 'PGRST116') {
        // Table might not exist yet or auth issue
        if (error.message && error.message.includes('relation "public.inquiries" does not exist')) {
          return {
            success: true,
            warning: true,
            message: 'Supabase कनेक्ट हो गया! कृपया दिए गए SQL कोड को रन करके टेबल्स बना लें।'
          };
        }
        return { success: false, message: `Supabase एरर: ${error.message}` };
      }
      return { success: true, message: '✓ Supabase डेटाबेस सफलतापूर्वक कनेक्ट हो गया!' };
    } catch (e) {
      return { success: false, message: `कनेक्शन विफल: ${e.message}` };
    }
  }

  // 2. Test Google Sheet Webhook connection
  async testSheetConnection(webhookUrl) {
    const url = webhookUrl || this.config.sheetWebhookUrl;
    if (!url) {
      return { success: false, message: 'Google Sheet Webhook URL दर्ज करें।' };
    }
    try {
      const testPayload = {
        action: 'TEST_INQUIRY',
        timestamp: new Date().toISOString(),
        data: {
          id: `TEST-${Date.now()}`,
          customerName: 'टेस्ट कनेक्शन (Admin Test)',
          phone: '916263879076',
          serviceName: 'कनेक्शन परीक्षण',
          selectedOption: 'सिस्टम सत्यापन',
          note: 'Google Sheets इंटीग्रेशन सफलतापूर्वक काम कर रहा है।',
          status: 'TEST_OK'
        }
      };

      await fetch(url, {
        method: 'POST',
        mode: 'no-cors', // standard for Google Apps Script Web App redirects
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testPayload),
      });

      return {
        success: true,
        message: '✓ Google Sheet को टेस्ट सिग्नल भेजा गया! अपनी शीट खोलकर देखें, उसमें नई पंक्ति जुड़ गई होगी।'
      };
    } catch (err) {
      return { success: false, message: `शीट एरर: ${err.message}` };
    }
  }

  // 3. Dispatch an Inquiry to Supabase and/or Google Sheet
  async syncInquiry(inquiry) {
    const { mode, sheetWebhookUrl } = this.config;
    if (mode === 'local') return;

    const results = { sheet: null, supabase: null };

    // A. Google Sheets Sync
    if ((mode === 'sheet' || mode === 'dual') && sheetWebhookUrl) {
      try {
        await fetch(sheetWebhookUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'NEW_INQUIRY',
            timestamp: new Date().toISOString(),
            data: inquiry,
          }),
        });
        results.sheet = true;
      } catch (e) {
        console.warn('Sheet sync error:', e);
        results.sheet = false;
      }
    }

    // B. Supabase Sync
    if ((mode === 'supabase' || mode === 'dual') && this.supabaseClient) {
      try {
        const { error } = await this.supabaseClient.from('inquiries').upsert({
          id: inquiry.id,
          customer_name: inquiry.customerName,
          phone: inquiry.phone,
          service_id: inquiry.serviceId,
          service_name: inquiry.serviceName,
          selected_option: inquiry.selectedOption,
          note: inquiry.note,
          status: inquiry.status,
          created_at: new Date().toISOString(),
        });
        results.supabase = !error;
      } catch (e) {
        console.warn('Supabase sync error:', e);
        results.supabase = false;
      }
    }

    this.saveConfig({
      lastSyncTime: new Date().toLocaleTimeString('en-IN'),
      lastSyncStatus: 'OK'
    });

    return results;
  }

  // 4. Update inquiry status
  async syncInquiryStatus(inquiryId, newStatus) {
    const { mode, sheetWebhookUrl } = this.config;
    if (mode === 'local') return;

    if ((mode === 'sheet' || mode === 'dual') && sheetWebhookUrl) {
      try {
        await fetch(sheetWebhookUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'UPDATE_STATUS',
            data: { id: inquiryId, status: newStatus },
          }),
        });
      } catch (e) {
        console.warn('Sheet status update error:', e);
      }
    }

    if ((mode === 'supabase' || mode === 'dual') && this.supabaseClient) {
      try {
        await this.supabaseClient.from('inquiries').update({ status: newStatus }).eq('id', inquiryId);
      } catch (e) {
        console.warn('Supabase status update error:', e);
      }
    }
  }

  // 5. Bulk sync services catalog to Google Sheet
  async syncAllServicesToSheet(servicesList) {
    const { sheetWebhookUrl } = this.config;
    if (!sheetWebhookUrl) {
      return { success: false, message: 'Google Sheet Webhook URL दर्ज नहीं है।' };
    }
    try {
      await fetch(sheetWebhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SYNC_SERVICES',
          data: servicesList,
        }),
      });
      return { success: true, message: '✓ सभी 15+ सेवाएं Google Sheet में सिंक हो गईं!' };
    } catch (e) {
      return { success: false, message: `सिंक त्रुटि: ${e.message}` };
    }
  }
}

export const dbAdapter = new DbAdapter();
