import React, { useState } from 'react';
import { 
  Settings, 
  MessageCircle, 
  ShieldAlert, 
  RotateCcw, 
  CheckCircle2, 
  Download, 
  PhoneOff, 
  Store,
  ExternalLink,
  Save,
  AlertTriangle,
  Database,
  FileSpreadsheet,
  Cloud,
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { GOOGLE_APPS_SCRIPT_CODE, SUPABASE_SQL_SETUP } from '../services/dbAdapter';

export default function AdminSettings() {
  const { 
    settings, 
    services, 
    inquiries, 
    updateSettings, 
    resetToFactoryDefault,
    dbConfig,
    updateDbConfig,
    dbAdapter,
    syncAllServicesToSheet
  } = useStore();

  // WhatsApp Config
  const [whatsappPhone, setWhatsappPhone] = useState(settings.whatsappPhone || '916263879076');
  const [whatsappDisplay, setWhatsappDisplay] = useState(settings.whatsappDisplay || '+91 62638 79076');
  const [whatsappChannelUrl, setWhatsappChannelUrl] = useState(settings.whatsappChannelUrl || 'https://whatsapp.com/channel/');
  const [isSavedWa, setIsSavedWa] = useState(false);

  // Database & Google Sheet Config
  const [dbMode, setDbMode] = useState(dbConfig.mode || 'local');
  const [sheetWebhookUrl, setSheetWebhookUrl] = useState(dbConfig.sheetWebhookUrl || '');
  const [supabaseUrl, setSupabaseUrl] = useState(dbConfig.supabaseUrl || '');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(dbConfig.supabaseAnonKey || '');
  
  // Status states
  const [isSavedDb, setIsSavedDb] = useState(false);
  const [sheetTesting, setSheetTesting] = useState(false);
  const [sheetTestResult, setSheetTestResult] = useState(null);
  const [supabaseTesting, setSupabaseTesting] = useState(false);
  const [supabaseTestResult, setSupabaseTestResult] = useState(null);
  const [servicesSyncing, setServicesSyncing] = useState(false);
  const [servicesSyncResult, setServicesSyncResult] = useState(null);

  // Code collapsible boxes
  const [showScriptCode, setShowScriptCode] = useState(false);
  const [scriptCopied, setScriptCopied] = useState(false);
  const [showSqlCode, setShowSqlCode] = useState(false);
  const [sqlCopied, setSqlCopied] = useState(false);

  // Backup & Reset
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleSaveWaSettings = (e) => {
    e.preventDefault();
    updateSettings({
      whatsappPhone,
      whatsappDisplay,
      whatsappChannelUrl,
    });
    setIsSavedWa(true);
    setTimeout(() => setIsSavedWa(false), 2500);
  };

  const handleSaveDbSettings = (e) => {
    e.preventDefault();
    updateDbConfig({
      mode: dbMode,
      sheetWebhookUrl: sheetWebhookUrl.trim(),
      supabaseUrl: supabaseUrl.trim(),
      supabaseAnonKey: supabaseAnonKey.trim(),
    });
    setIsSavedDb(true);
    setTimeout(() => setIsSavedDb(false), 2500);
  };

  const handleTestSheet = async () => {
    setSheetTesting(true);
    setSheetTestResult(null);
    const res = await dbAdapter.testSheetConnection(sheetWebhookUrl.trim());
    setSheetTestResult(res);
    setSheetTesting(false);
  };

  const handleTestSupabase = async () => {
    setSupabaseTesting(true);
    setSupabaseTestResult(null);
    const res = await dbAdapter.testSupabaseConnection(supabaseUrl.trim(), supabaseAnonKey.trim());
    setSupabaseTestResult(res);
    setSupabaseTesting(false);
  };

  const handleSyncServicesToSheet = async () => {
    setServicesSyncing(true);
    setServicesSyncResult(null);
    const res = await syncAllServicesToSheet();
    setServicesSyncResult(res);
    setServicesSyncing(false);
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setScriptCopied(true);
    setTimeout(() => setScriptCopied(false), 2500);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SETUP);
    setSqlCopied(true);
    setTimeout(() => setSqlCopied(false), 2500);
  };

  const handleExportData = () => {
    const backup = {
      exportedAt: new Date().toISOString(),
      settings,
      services,
      inquiries,
      dbConfig,
    };
    const jsonStr = JSON.stringify(backup, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleConfirmReset = () => {
    resetToFactoryDefault();
    setShowResetConfirm(false);
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      
      {/* Header Info */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Settings className="w-4 h-4 text-orange-500" />
          <span>सिस्टम सेटिंग्स एवं क्लाउड डेटाबेस (System & DB Settings)</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          WhatsApp नंबर, Google Sheets ऑटो-सिंक, Supabase PostgreSQL एवं डेटा सुरक्षा।
        </p>
      </div>

      {/* ============================================================== */}
      {/* 1. FLEXIBLE DATABASE & GOOGLE SHEETS SYNC (CORE USER FEATURE) */}
      {/* ============================================================== */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-orange-500" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">
              डेटाबेस एवं गूगल शीट एकीकरण (Database & Google Sheets Sync)
            </h3>
          </div>
          {isSavedDb && (
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 animate-pulse">
              <CheckCircle2 className="w-3.5 h-3.5" /> सेटिंग्स सुरक्षित!
            </span>
          )}
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          आप अपनी सुविधानुसार चुन सकते हैं कि डेटा केवल ब्राउज़र में रहे, सीधे <strong>Google Sheet</strong> में जाए, 
          <strong>Supabase</strong> क्लाउड डेटाबेस में रहे, या <strong>दोनों जगह एक साथ</strong> सिंक हो!
        </p>

        {/* Mode Selector Chips */}
        <div>
          <label className="text-[11px] font-bold text-slate-700 block mb-2">
            डेटाबेस कनेक्शन मोड चुनें (Select Sync Mode):
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            
            {/* 1. Local */}
            <button
              type="button"
              onClick={() => setDbMode('local')}
              className={`p-2.5 rounded-xl border text-left transition-all tap-bounce ${
                dbMode === 'local'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/20'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <Zap className="w-4 h-4 text-amber-400" />
                {dbMode === 'local' && <Check className="w-3.5 h-3.5" />}
              </div>
              <span className="text-xs font-bold block">केवल लोकल</span>
              <span className={`text-[10px] block ${dbMode === 'local' ? 'text-slate-300' : 'text-slate-500'}`}>
                ऑफ़लाइन / डिवाइस पर
              </span>
            </button>

            {/* 2. Google Sheets */}
            <button
              type="button"
              onClick={() => setDbMode('sheet')}
              className={`p-2.5 rounded-xl border text-left transition-all tap-bounce ${
                dbMode === 'sheet'
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-md ring-2 ring-emerald-500/30'
                  : 'bg-emerald-50/50 hover:bg-emerald-50 text-slate-700 border-emerald-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                {dbMode === 'sheet' && <Check className="w-3.5 h-3.5" />}
              </div>
              <span className="text-xs font-bold block">Google Sheets</span>
              <span className={`text-[10px] block ${dbMode === 'sheet' ? 'text-emerald-100' : 'text-emerald-700 font-medium'}`}>
                स्वतः पंक्तियाँ व कॉलम
              </span>
            </button>

            {/* 3. Supabase */}
            <button
              type="button"
              onClick={() => setDbMode('supabase')}
              className={`p-2.5 rounded-xl border text-left transition-all tap-bounce ${
                dbMode === 'supabase'
                  ? 'bg-emerald-950 text-white border-emerald-800 shadow-md ring-2 ring-emerald-500/20'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <Cloud className="w-4 h-4 text-emerald-400" />
                {dbMode === 'supabase' && <Check className="w-3.5 h-3.5" />}
              </div>
              <span className="text-xs font-bold block">Supabase DB</span>
              <span className={`text-[10px] block ${dbMode === 'supabase' ? 'text-emerald-200' : 'text-slate-500'}`}>
                PostgreSQL क्लाउड
              </span>
            </button>

            {/* 4. Dual Hybrid */}
            <button
              type="button"
              onClick={() => setDbMode('dual')}
              className={`p-2.5 rounded-xl border text-left transition-all tap-bounce ${
                dbMode === 'dual'
                  ? 'bg-gradient-to-br from-orange-600 to-amber-600 text-white border-orange-600 shadow-md ring-2 ring-orange-500/30'
                  : 'bg-orange-50/40 hover:bg-orange-50 text-slate-700 border-orange-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <Sparkles className="w-4 h-4 text-amber-200" />
                {dbMode === 'dual' && <Check className="w-3.5 h-3.5" />}
              </div>
              <span className="text-xs font-bold block">दोनों एक साथ</span>
              <span className={`text-[10px] block ${dbMode === 'dual' ? 'text-orange-100' : 'text-orange-700 font-medium'}`}>
                Sheet + Supabase
              </span>
            </button>

          </div>
        </div>

        {/* Sync Mode Description Banner */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          {dbMode === 'local' && (
            <span className="text-slate-600">
              📌 <strong>लोकल मोड सक्रिय:</strong> डेटा आपके ब्राउज़र में सुरक्षित रहता है। किसी एक्सटर्नल क्लाउड सेटअप की जरूरत नहीं।
            </span>
          )}
          {dbMode === 'sheet' && (
            <span className="text-emerald-800">
              📊 <strong>Google Sheet मोड:</strong> जब भी कोई ग्राहक पूछताछ करेगा या आप सेवा बदलेंगे, आपकी Google Sheet में अपने आप नई पंक्ति और कॉलम बन जाएंगे। आप मोबाइल से सीधे शीट देख सकते हैं!
            </span>
          )}
          {dbMode === 'supabase' && (
            <span className="text-blue-800">
              🗄️ <strong>Supabase मोड:</strong> आपका डेटा एंटरप्राइज-ग्रेड PostgreSQL डेटाबेस में सुरक्षित रहेगा। मल्टी-डिवाइस लॉगिन के लिए सर्वोत्तम।
            </span>
          )}
          {dbMode === 'dual' && (
            <span className="text-orange-800">
              🚀 <strong>हाइब्रिड मोड (सिफारिश):</strong> हर नई लीड और सेवा तुरंत Supabase में भी जाएगी और Google Sheet में भी ऑटोमैटिक दर्ज होगी!
            </span>
          )}
        </div>

        <form onSubmit={handleSaveDbSettings} className="space-y-4 pt-1">
          
          {/* GOOGLE SHEETS CONFIG BOX */}
          {(dbMode === 'sheet' || dbMode === 'dual') && (
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-950">
                    Google Sheets Webhook Setup
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Auto-Column Engine
                </span>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Google Apps Script Web App URL *
                </label>
                <input
                  type="url"
                  value={sheetWebhookUrl}
                  onChange={(e) => setSheetWebhookUrl(e.target.value)}
                  placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                  className="w-full p-2.5 text-xs rounded-xl border border-emerald-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  required={dbMode === 'sheet' || dbMode === 'dual'}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleTestSheet}
                  disabled={sheetTesting || !sheetWebhookUrl}
                  className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 tap-bounce"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${sheetTesting ? 'animate-spin' : ''}`} />
                  <span>{sheetTesting ? 'जांच जारी...' : 'शीट पर टेस्ट डेटा भेजें'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSyncServicesToSheet}
                  disabled={servicesSyncing || !sheetWebhookUrl}
                  className="px-3.5 py-1.5 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold flex items-center gap-1.5 tap-bounce"
                >
                  <span>सभी 15 सेवाएं शीट में भेजें</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowScriptCode(!showScriptCode)}
                  className="px-3 py-1.5 text-xs text-emerald-800 hover:underline flex items-center gap-1 ml-auto font-medium"
                >
                  <span>Google Apps Script कोड {showScriptCode ? 'छिपाएं' : 'देखें'}</span>
                  {showScriptCode ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {sheetTestResult && (
                <div className={`p-2.5 rounded-lg text-xs font-medium ${sheetTestResult.success ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                  {sheetTestResult.message}
                </div>
              )}

              {servicesSyncResult && (
                <div className={`p-2.5 rounded-lg text-xs font-medium ${servicesSyncResult.success ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                  {servicesSyncResult.message}
                </div>
              )}

              {/* Collapsible Apps Script Code & Guide */}
              {showScriptCode && (
                <div className="p-3 bg-slate-900 text-slate-100 rounded-xl space-y-2.5 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-orange-400">
                      📋 1-मिनट Google Sheets सेटअप निर्देश:
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyScript}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-[11px] font-bold flex items-center gap-1"
                    >
                      {scriptCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{scriptCopied ? 'कॉपी हो गया!' : 'कोड कॉपी करें'}</span>
                    </button>
                  </div>
                  <ol className="text-[11px] text-slate-300 list-decimal list-inside space-y-1">
                    <li>नई <strong>Google Sheet</strong> बनाएं (उदा. "Anu Krupa Online Leads")।</li>
                    <li>ऊपर मेनू में <strong>Extensions → Apps Script</strong> पर क्लिक करें।</li>
                    <li>वहाँ मौजूद कोड हटाकर नीचे वाला कोड पेस्ट करें और Save (Ctrl+S) करें।</li>
                    <li>ऊपर <strong>Deploy → New deployment</strong> चुनें।</li>
                    <li>Type में <strong>Web app</strong> चुनें, <i>Execute as: Me</i> और <i>Who has access: Anyone</i> सेट करके Deploy करें।</li>
                    <li>प्राप्त URL को ऊपर Webhook URL में पेस्ट करें!</li>
                  </ol>
                  <pre className="p-2 bg-slate-950 rounded-lg text-[10px] font-mono text-emerald-300 overflow-x-auto max-h-40 border border-slate-800">
                    {GOOGLE_APPS_SCRIPT_CODE}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* SUPABASE CONFIG BOX */}
          {(dbMode === 'supabase' || dbMode === 'dual') && (
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-blue-950">
                    Supabase PostgreSQL Cloud Setup
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                  SQL Database
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Supabase Project URL *
                  </label>
                  <input
                    type="url"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    placeholder="https://xyzcompany.supabase.co"
                    className="w-full p-2.5 text-xs rounded-xl border border-blue-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    required={dbMode === 'supabase' || dbMode === 'dual'}
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Supabase Anon Public Key *
                  </label>
                  <input
                    type="password"
                    value={supabaseAnonKey}
                    onChange={(e) => setSupabaseAnonKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                    className="w-full p-2.5 text-xs rounded-xl border border-blue-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    required={dbMode === 'supabase' || dbMode === 'dual'}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={handleTestSupabase}
                  disabled={supabaseTesting || !supabaseUrl || !supabaseAnonKey}
                  className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 tap-bounce"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${supabaseTesting ? 'animate-spin' : ''}`} />
                  <span>{supabaseTesting ? 'जांच जारी...' : 'Supabase कनेक्शन जांचें'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowSqlCode(!showSqlCode)}
                  className="px-3 py-1.5 text-xs text-blue-800 hover:underline flex items-center gap-1 font-medium"
                >
                  <span>Supabase SQL कोड {showSqlCode ? 'छिपाएं' : 'देखें'}</span>
                  {showSqlCode ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {supabaseTestResult && (
                <div className={`p-2.5 rounded-lg text-xs font-medium ${supabaseTestResult.success ? 'bg-blue-100 text-blue-900' : 'bg-rose-100 text-rose-800'}`}>
                  {supabaseTestResult.message}
                </div>
              )}

              {/* Collapsible Supabase SQL */}
              {showSqlCode && (
                <div className="p-3 bg-slate-900 text-slate-100 rounded-xl space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-400">
                      Supabase SQL Editor में यह चलाएं:
                    </span>
                    <button
                      type="button"
                      onClick={handleCopySql}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-[11px] font-bold flex items-center gap-1"
                    >
                      {sqlCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{sqlCopied ? 'कॉपी हो गया!' : 'SQL कॉपी करें'}</span>
                    </button>
                  </div>
                  <pre className="p-2 bg-slate-950 rounded-lg text-[10px] font-mono text-cyan-300 overflow-x-auto max-h-40 border border-slate-800">
                    {SUPABASE_SQL_SETUP}
                  </pre>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-[11px] text-slate-500">
              {dbConfig.lastSyncTime ? `अंतिम सिंक: ${dbConfig.lastSyncTime} (${dbConfig.lastSyncStatus})` : 'कोई सिंक पेंडिंग नहीं'}
            </span>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5 tap-bounce"
            >
              <Save className="w-3.5 h-3.5 text-orange-400" />
              <span>डेटाबेस सेटिंग्स सेव करें</span>
            </button>
          </div>
        </form>
      </div>

      {/* ============================================================== */}
      {/* 2. WHATSAPP CONFIGURATION */}
      {/* ============================================================== */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">
              आधिकारिक WhatsApp नंबर (Primary WhatsApp)
            </h3>
          </div>
          {isSavedWa && (
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 animate-pulse">
              <CheckCircle2 className="w-3.5 h-3.5" /> सुरक्षित हुआ!
            </span>
          )}
        </div>

        <p className="text-xs text-slate-500">
          पूरी वेबसाइट पर सभी ग्राहक पूछताछ, सर्विस ऑर्डर और फ़ॉर्म इसी नंबर पर आएँगे।
        </p>

        <form onSubmit={handleSaveWaSettings} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                WhatsApp API नंबर (बिना स्पेस / + के, देश कोड सहित)
              </label>
              <input
                type="text"
                value={whatsappPhone}
                onChange={(e) => setWhatsappPhone(e.target.value)}
                placeholder="916263879076"
                className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                ग्राहक को दिखने वाला नंबर (Display Number)
              </label>
              <input
                type="text"
                value={whatsappDisplay}
                onChange={(e) => setWhatsappDisplay(e.target.value)}
                placeholder="+91 62638 79076"
                className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              WhatsApp चैनल लिंक (WhatsApp Channel Link)
            </label>
            <input
              type="url"
              value={whatsappChannelUrl}
              onChange={(e) => setWhatsappChannelUrl(e.target.value)}
              placeholder="https://whatsapp.com/channel/..."
              className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs"
            />
          </div>

          <div className="pt-1 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5 tap-bounce"
            >
              <Save className="w-3.5 h-3.5 text-orange-400" />
              <span>WhatsApp सेटिंग्स सुरक्षित करें</span>
            </button>
          </div>
        </form>
      </div>

      {/* ============================================================== */}
      {/* 3. PERMANENT CALLING POLICY NOTICE */}
      {/* ============================================================== */}
      <div className="bg-amber-50 rounded-2xl p-4 sm:p-5 border border-amber-200/90 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-amber-900">
          <PhoneOff className="w-4 h-4 text-amber-700" />
          <h3 className="text-xs sm:text-sm font-bold">
            कॉलिंग नीति (Strict Calling Policy - Active)
          </h3>
        </div>
        <p className="text-xs text-amber-800 leading-relaxed">
          नियम <strong>R-04</strong> के अनुसार, वेबसाइट पर डायरेक्ट कॉलिंग स्थायी रूप से बंद है। 
          सभी ग्राहक केवल <strong>WhatsApp चैट</strong> के माध्यम से संपर्क कर सकते हैं ताकि दस्तावेज़ सुरक्षित रहें और हर काम का लिखित रिकॉर्ड रहे।
        </p>
      </div>

      {/* ============================================================== */}
      {/* 4. DATA BACKUP & EXPORT */}
      {/* ============================================================== */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">
              डेटा बैकअप एवं एक्सपोर्ट (Export / Backup)
            </h3>
          </div>
          {isCopied && (
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 animate-pulse">
              <CheckCircle2 className="w-3.5 h-3.5" /> बैकअप कॉपी हो गया!
            </span>
          )}
        </div>

        <p className="text-xs text-slate-500">
          अपनी सभी सेवाओं, सेटिंग्स, डेटाबेस कॉन्फ़िगरेशन और पूछताछ का पूरा बैकअप 1-क्लिक में कॉपी करें।
        </p>

        <div className="pt-1">
          <button
            type="button"
            onClick={handleExportData}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all tap-bounce flex items-center gap-2 border border-slate-300"
          >
            <Download className="w-3.5 h-3.5" />
            <span>पूरा डेटा क्लिपबोर्ड में कॉपी करें (JSON Backup)</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 5. FACTORY RESET ZONE */}
      {/* ============================================================== */}
      <div className="bg-rose-50/70 rounded-2xl p-4 sm:p-5 border border-rose-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-rose-900">
          <RotateCcw className="w-4 h-4 text-rose-600" />
          <h3 className="text-xs sm:text-sm font-bold">
            डेटा रीसेट (Factory Reset Data)
          </h3>
        </div>
        <p className="text-xs text-rose-700">
          यदि आप अपनी सभी सेवाओं और बदलावों को मूल अनु कृपा ऑनलाइन डेटा में वापस लाना चाहते हैं।
        </p>

        {!showResetConfirm ? (
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all tap-bounce shadow-sm flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>फ़ैक्ट्री डिफ़ॉल्ट पर रीसेट करें</span>
          </button>
        ) : (
          <div className="p-3 bg-white rounded-xl border border-rose-300 space-y-2">
            <div className="flex items-center gap-2 text-rose-700 text-xs font-bold">
              <AlertTriangle className="w-4 h-4" />
              <span>क्या आप वाकई सभी कस्टम बदलाव रीसेट करना चाहते हैं?</span>
            </div>
            <p className="text-[11px] text-slate-600">
              यह प्रक्रिया आपकी कस्टम सेवाओं और एडिट्स को मूल 15 मानक सेवाओं पर वापस ले आएगी।
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-3.5 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-lg tap-bounce"
              >
                हाँ, रीसेट करें
              </button>
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-3.5 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-200"
              >
                रद्द करें
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
