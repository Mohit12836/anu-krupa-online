import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  Copy, 
  Check, 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  Clock, 
  MessageCircle, 
  ExternalLink, 
  Cpu, 
  Sliders, 
  HelpCircle,
  RefreshCw,
  Terminal,
  Activity,
  UserCheck,
  Flame,
  Award,
  Layers,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { AGENT_ROSTER, executeMultiAgentWorkflow, classifyCustomerIntent } from '../services/aiAgentEngine';

export default function AdminAgents() {
  const { inquiries, settings, updateInquiryStatus } = useStore();

  const [activeSubTab, setActiveSubTab] = useState('simulator'); // 'roster' | 'simulator' | 'followup' | 'integration'
  const [selectedAgentId, setSelectedAgentId] = useState('auto'); // 'auto' or agent id

  // Simulator State
  const [testMessage, setTestMessage] = useState('PM सूर्य घर सोलर योजना में ₹78,000 की सब्सिडी कैसे मिलेगी और कितना खर्च आएगा?');
  const [customerName, setCustomerName] = useState('राजेश पाटीदार');
  const [isProcessing, setIsProcessing] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [copiedResponse, setCopiedResponse] = useState(false);

  // Settings State
  const [apiKey, setApiKey] = useState(() => {
    try {
      return localStorage.getItem('ak_agent_api_key') || '';
    } catch {
      return '';
    }
  });
  const [provider, setProvider] = useState(() => {
    try {
      return localStorage.getItem('ak_agent_provider') || 'groq';
    } catch {
      return 'groq';
    }
  });
  const [autoPilotEnabled, setAutoPilotEnabled] = useState(true);
  const [savedSettingsNotice, setSavedSettingsNotice] = useState(false);

  // Quick Preset Scenarios
  const PRESET_SCENARIOS = [
    {
      label: '☀️ सोलर सब्सिडी',
      name: 'राजेश पाटीदार (उकेड़िया)',
      text: 'PM सूर्य घर सोलर योजना में ₹78,000 की सब्सिडी कैसे मिलेगी और कितना खर्च आएगा?',
    },
    {
      label: '🌾 KCC लोन लिमिट',
      name: 'दिनेश धाकड़ (जावरा)',
      text: 'किसान क्रेडिट कार्ड की लिमिट 3 लाख करवानी है, क्या-क्या डाक्यूमेंट्स लेकर आऊँ?',
    },
    {
      label: '🤝 WFH पार्टनर कमाई',
      name: 'अमित शर्मा (रतलाम)',
      text: 'मुझे घर बैठे मोबाइल से पैसे कमाने हैं, आपकी दुकान से कैसे जुडूं और कितना कमीशन मिलेगा?',
    },
    {
      label: '🖨️ 200 PVC कार्ड प्रिंट',
      name: 'विकास स्कूल प्रिंसिपल',
      text: 'हमारे स्कूल के 200 बच्चों के PVC आईकार्ड और बेल्ट प्रिंट करवाने हैं, थोक रेट क्या है?',
    },
    {
      label: '💳 नया पैन कार्ड',
      name: 'सुनीता बाई',
      text: 'नया पैन कार्ड कितने दिन में बन जाता है और कितनी फीस लगेगी?',
    },
  ];

  const handleApplyPreset = (preset) => {
    setCustomerName(preset.name);
    setTestMessage(preset.text);
  };

  const handleRunSimulation = async (e) => {
    if (e) e.preventDefault();
    if (!testMessage.trim()) return;

    setIsProcessing(true);
    setSimulationResult(null);

    try {
      const result = await executeMultiAgentWorkflow({
        customerMessage: testMessage,
        customerName: customerName.trim() || 'ग्राहक',
        config: {
          apiKey: apiKey.trim(),
          provider,
        },
      });
      setSimulationResult(result);
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyText = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedResponse(true);
    setTimeout(() => setCopiedResponse(false), 2000);
  };

  const handleSaveApiSettings = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('ak_agent_api_key', apiKey.trim());
      localStorage.setItem('ak_agent_provider', provider);
      setSavedSettingsNotice(true);
      setTimeout(() => setSavedSettingsNotice(false), 2500);
    } catch (err) {
      console.warn('LocalStorage error:', err);
    }
  };

  // Open direct WhatsApp test
  const handleOpenWhatsAppTest = () => {
    if (!simulationResult?.response) return;
    const phone = settings.whatsappPhone || '916263879076';
    const encoded = encodeURIComponent(simulationResult.response);
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 sm:p-5 rounded-2xl border border-indigo-900/50 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[11px] font-black tracking-wider text-emerald-400 uppercase">
                ऑटोनोमस AI दुकान वर्कफोर्स (5 Specialized Agents)
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black flex items-center gap-2">
              <Bot className="w-5 h-5 text-orange-400" />
              <span>AI कर्मचारी कंट्रोल हब (Multi-Agent CRM)</span>
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              WhatsApp & WACRM पर आने वाले हर ग्राहक को समझकर, सही फीस बताकर, सेल क्लोज करने वाली AI टीम।
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setAutoPilotEnabled(!autoPilotEnabled)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                autoPilotEnabled 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              <Zap className={`w-3.5 h-3.5 ${autoPilotEnabled ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span>ऑटो-पायलट: {autoPilotEnabled ? 'सक्रिय (ON)' : 'बंद (OFF)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Sub-Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveSubTab('simulator')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeSubTab === 'simulator'
              ? 'bg-orange-500 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>लाइव टेस्ट सिमुलेटर (Sandbox)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('roster')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeSubTab === 'roster'
              ? 'bg-orange-500 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          <span>एजेंट रोस्टर (5 AI कर्मचारी)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('followup')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeSubTab === 'followup'
              ? 'bg-orange-500 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>संजीवनी फॉलो-अप इंजन</span>
        </button>

        <button
          onClick={() => setActiveSubTab('integration')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeSubTab === 'integration'
              ? 'bg-orange-500 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>WACRM व API सेटिंग्स</span>
        </button>
      </div>

      {/* 3. SUBTAB: SIMULATOR (Sandbox) */}
      {activeSubTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Left Column: Input Form & Scenarios */}
          <div className="lg:col-span-5 space-y-3">
            
            {/* Quick Preset Chips */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-sm space-y-2">
              <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span>रेडीमेड कस्टमर टेस्ट सवाल:</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_SCENARIOS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="px-2.5 py-1 bg-slate-50 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200 text-slate-700 rounded-lg text-[11px] font-semibold border border-slate-200 transition-all text-left"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Test Input Form */}
            <form onSubmit={handleRunSimulation} className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  ग्राहक का नाम (Customer Name)
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="उदा. राजेश पाटीदार"
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  ग्राहक का संदेश (WhatsApp Message) *
                </label>
                <textarea
                  rows={4}
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  placeholder="यहाँ ग्राहक का सवाल लिखें..."
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium resize-none leading-relaxed"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-black shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 tap-bounce transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>AI एजेंट्स निर्णय ले रहे हैं...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>मल्टी-एजेंट से रिस्पॉन्स जनरेट करें</span>
                  </>
                )}
              </button>
            </form>

          </div>

          {/* Right Column: Reasoning & Live WhatsApp Preview */}
          <div className="lg:col-span-7 space-y-3">
            
            {simulationResult ? (
              <div className="space-y-3 animate-in fade-in">
                
                {/* Agent Reasoning Pipeline Card */}
                <div className="bg-slate-900 text-white p-3.5 sm:p-4 rounded-2xl border border-slate-800 shadow-md space-y-2.5 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold flex items-center gap-1.5 text-orange-400">
                      <Activity className="w-4 h-4 text-orange-400" />
                      <span>मल्टी-एजेंट कोऑर्डिनेशन विश्लेषण (Internal Reasoning):</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                      {simulationResult.meta.durationMs}ms
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    <div className="bg-slate-800/80 p-2 rounded-xl">
                      <span className="text-[10px] text-slate-400 block">पहचाना गया इंटेंट</span>
                      <span className="font-bold text-orange-300 truncate block">
                        {simulationResult.triage.intent}
                      </span>
                    </div>

                    <div className="bg-slate-800/80 p-2 rounded-xl">
                      <span className="text-[10px] text-slate-400 block">लीड स्कोर (0-100)</span>
                      <span className="font-extrabold text-emerald-400 text-sm">
                        {simulationResult.triage.leadScore} / 100
                      </span>
                    </div>

                    <div className="bg-slate-800/80 p-2 rounded-xl">
                      <span className="text-[10px] text-slate-400 block">असाइन किया गया एजेंट</span>
                      <span className="font-bold text-cyan-300 truncate block">
                        {simulationResult.assignedAgent.name}
                      </span>
                    </div>

                    <div className="bg-slate-800/80 p-2 rounded-xl">
                      <span className="text-[10px] text-slate-400 block">मॉडल इंजन</span>
                      <span className="font-mono text-[10px] text-slate-300 truncate block">
                        {simulationResult.meta.modelUsed}
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-300 bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
                    <strong className="text-orange-400">दिशा AI का तर्क:</strong> {simulationResult.triage.explanation}
                  </div>
                </div>

                {/* WhatsApp Chat Simulation Preview */}
                <div className="bg-[#0b141a] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
                  
                  {/* WhatsApp Chat Header */}
                  <div className="bg-[#202c33] p-3 text-white flex items-center justify-between border-b border-slate-700/50">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs text-white">
                        AK
                      </div>
                      <div>
                        <div className="font-bold text-xs flex items-center gap-1.5">
                          <span>अनु कृपा ऑनलाइन</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-normal">
                            Verified Business
                          </span>
                        </div>
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>AI एजेंट लाइव: {simulationResult.assignedAgent.name}</span>
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] text-slate-400">
                      आज, {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Chat Bubbles */}
                  <div className="p-4 space-y-3 min-h-[220px] bg-[#0b141a] bg-opacity-95">
                    
                    {/* Customer Message Bubble (Green right) */}
                    <div className="flex justify-end">
                      <div className="bg-[#005c4b] text-[#e9edef] p-3 rounded-2xl rounded-tr-xs max-w-[85%] text-xs shadow-md space-y-1">
                        <div className="text-[10px] font-bold text-emerald-300">{customerName}</div>
                        <p className="whitespace-pre-wrap">{testMessage}</p>
                        <span className="text-[9px] text-slate-400 block text-right">Read ✓✓</span>
                      </div>
                    </div>

                    {/* AI Agent Reply Bubble (Grey left) */}
                    <div className="flex justify-start">
                      <div className="bg-[#202c33] text-[#e9edef] p-3.5 rounded-2xl rounded-tl-xs max-w-[90%] text-xs shadow-md space-y-2 border border-slate-700/40">
                        <div className="flex items-center justify-between border-b border-slate-700/60 pb-1 text-[10px]">
                          <span className="font-bold text-orange-400 flex items-center gap-1">
                            <span>{simulationResult.assignedAgent.avatar}</span>
                            <span>{simulationResult.assignedAgent.name}</span>
                          </span>
                          <span className="text-slate-400 text-[9px]">Autonomous Response</span>
                        </div>
                        <div className="whitespace-pre-wrap leading-relaxed">
                          {simulationResult.response}
                        </div>
                        <span className="text-[9px] text-slate-400 block text-right">Delivered</span>
                      </div>
                    </div>

                  </div>

                  {/* Actions Footer */}
                  <div className="bg-[#202c33] p-3 flex items-center justify-between gap-2 border-t border-slate-700/50">
                    <button
                      onClick={() => handleCopyText(simulationResult.response)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                    >
                      {copiedResponse ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedResponse ? 'कॉपी हो गया!' : 'टेक्स्ट कॉपी करें'}</span>
                    </button>

                    <button
                      onClick={handleOpenWhatsAppTest}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md tap-bounce transition-all"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp पर टेस्ट भेजें</span>
                    </button>
                  </div>

                </div>

              </div>
            ) : (
              <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-300 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto">
                  <Bot className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">सिमुलेटर अभी खाली है</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    बाईं तरफ से कोई रेडीमेड सवाल चुनें या अपना सवाल लिखकर <strong>'रिस्पॉन्स जनरेट करें'</strong> बटन दबाएं।
                  </p>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* 4. SUBTAB: AGENT ROSTER */}
      {activeSubTab === 'roster' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {AGENT_ROSTER.map((agent) => (
              <div
                key={agent.id}
                className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-xl shadow-xs">
                        {agent.avatar}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
                          {agent.name}
                        </h3>
                        <span className="text-[10px] font-semibold text-slate-500 block">
                          {agent.role}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      लाइव
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                    {agent.description}
                  </p>

                  <div className="mt-3 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      मुख्य क्षमताएं (Capabilities):
                    </span>
                    <ul className="space-y-1">
                      {agent.capabilities.map((cap, i) => (
                        <li key={i} className="text-[11px] text-slate-700 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span>{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-mono text-[10px]">
                    {agent.defaultModel.split('/')[0]}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedAgentId(agent.id);
                      setActiveSubTab('simulator');
                    }}
                    className="text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1"
                  >
                    <span>टेस्ट करें</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. SUBTAB: FOLLOW-UP ENGINE (Sanjeevani AI) */}
      {activeSubTab === 'followup' && (
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-600" />
                <span>संजीवनी ऑटो-फॉलोअप व रिकवरी इंजन</span>
              </h3>
              <p className="text-xs text-slate-500">
                जो ग्राहक पूछताछ करके 24-48 घंटे से रुके हुए हैं, उन्हें 1-क्लिक में पर्सनलाइज्ड फॉलो-अप भेजें।
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-800">
              {inquiries.filter(i => i.status === 'NEW').length} पेंडिंग लीड्स
            </span>
          </div>

          <div className="space-y-2">
            {inquiries.map((inq) => (
              <div
                key={inq.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{inq.customerName}</span>
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-200 text-slate-700 font-medium">
                      {inq.serviceName}
                    </span>
                    <span className="text-[10px] text-slate-400">{inq.createdAt}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    नोट: {inq.note || 'कोई विशेष नोट नहीं'}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => {
                      setCustomerName(inq.customerName);
                      setTestMessage(`मैंने ${inq.serviceName} के लिए पूछा था, आगे क्या करना है?`);
                      setActiveSubTab('simulator');
                    }}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm tap-bounce"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>फॉलो-अप ड्राफ्ट बनाएं</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. SUBTAB: WACRM & API INTEGRATION */}
      {activeSubTab === 'integration' && (
        <div className="space-y-4">
          
          {/* Webhook Endpoint Card for Vercel & WACRM */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-emerald-600" />
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                WACRM / WhatsApp Cloud API Webhook Integration
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              आपके Vercel पर मौजूद <strong>WACRM</strong> या <strong>Meta WhatsApp Cloud API</strong> के साथ इस मल्टी-एजेंट को सीधे जोड़ने के लिए नीचे दिए गए Webhook URL और Verify Token का उपयोग करें:
            </p>

            <div className="space-y-2">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">
                  1. Live Vercel Webhook URL (WACRM Callback URL):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value="https://anu-krupa-online.vercel.app/api/agent-webhook"
                    className="flex-1 p-2.5 text-xs font-mono bg-slate-100 rounded-xl border border-slate-200 text-slate-800"
                  />
                  <button
                    onClick={() => handleCopyText('https://anu-krupa-online.vercel.app/api/agent-webhook')}
                    className="px-3 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>कॉपी</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">
                  2. Webhook Secret Verify Token:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value="anu_krupa_secret_2026"
                    className="flex-1 p-2.5 text-xs font-mono bg-slate-100 rounded-xl border border-slate-200 text-slate-800"
                  />
                  <button
                    onClick={() => handleCopyText('anu_krupa_secret_2026')}
                    className="px-3 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>कॉपी</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Optional External LLM Provider Key Configuration */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-orange-500" />
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                  AI मॉडल प्रोवाइडर कॉन्फ़िगरेशन (Optional)
                </h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
                100% Free Tiers Supported
              </span>
            </div>

            <p className="text-xs text-slate-600">
              डिफ़ॉल्ट रूप से यह सिस्टम आंतरिक <strong>डिटरमिनिस्टिक एक्सपर्ट AI</strong> से चलता है (0 एरर, बिना किसी की)। यदि आप Groq, Google Gemini या OpenAI की लाइव की जोड़ना चाहते हैं तो यहाँ सेट करें:
            </p>

            <form onSubmit={handleSaveApiSettings} className="space-y-3 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    AI प्रोवाइडर चुनें
                  </label>
                  <select
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-semibold"
                  >
                    <option value="groq">Groq (Ultra-Fast Llama-3.3 70B - Free)</option>
                    <option value="gemini">Google Gemini 2.0 Flash (Free AI Studio)</option>
                    <option value="gateway">Local LiteLLM Zero-Limit Gateway (:4000)</option>
                    <option value="openai">OpenAI (gpt-4o-mini)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    API Key (लोकल स्टोरेज में सुरक्षित रहेगी)
                  </label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="gsk_... या AIzaSy..."
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-400">
                  नोट: API Key नहीं होने पर भी सभी 5 एजेंट्स 100% सटीक जवाब देंगे।
                </span>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md tap-bounce flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{savedSettingsNotice ? 'सेव हो गया!' : 'सेव करें'}</span>
                </button>
              </div>
            </form>
          </div>

        </div>
      )}

    </div>
  );
}
