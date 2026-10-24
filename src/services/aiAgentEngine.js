/**
 * ANU KRUPA ONLINE — Dify/Coze-Grade Autonomous Multi-Agent Studio Engine
 * 
 * Features:
 * 1. Dynamic Agent Creation (+ Add Custom AI Agents)
 * 2. Role Definition & System Prompts
 * 3. Granular Permission Matrix & Guardrails (Discounts, Payment Links, Phone Access, Auto-Reply)
 * 4. Knowledge Base & Agent Training (एजेंट को नियम व नीतियां सिखाना)
 * 5. Multi-Provider LLM Binding (Groq, Gemini, OpenAI, LiteLLM Gateway, Deterministic)
 * 6. Task Dispatcher & Direct Work Execution (काम करवाना)
 */

import { SERVICES } from '../data/servicesData';
import { CATEGORIES, MACRO_VERTICALS } from '../data/categoriesData';
import { BUSINESS_CONFIG } from '../data/businessConfig';

export const STORAGE_KEYS = {
  AGENTS: 'ak_online_custom_agents_v1',
  PROVIDERS: 'ak_online_agent_providers_v1',
  TASK_HISTORY: 'ak_online_agent_tasks_v1',
};

// 5 Master Foundational AI Agents
export const DEFAULT_AGENTS = [
  {
    id: 'agent_sales_closer',
    name: 'विक्रय राज (Sales Closer)',
    role: 'डील्स क्लोजर व कोटेशन विशेषज्ञ',
    avatar: '💼',
    badge: 'सेल्स स्पेशलिस्ट',
    color: 'from-amber-500 to-orange-600',
    description: 'कस्टमर की जरूरत समझकर तुरंत सही फीस, डाक्यूमेंट्स और ऑनलाइन बुकिंग लिंक देकर सेल फाइनल करता है।',
    provider: 'groq',
    model: 'llama-3.3-70b-versatile',
    temperature: 0.6,
    status: 'ACTIVE',
    isCustom: false,
    systemPrompt: 'आप अनु कृपा ऑनलाइन के सीनियर सेल्स हेड हैं। आपका एकमात्र उद्देश्य ग्राहक को पूरी पारदर्शिता के साथ सही फीस बताकर, विश्वास दिलाकर बुकिंग के लिए प्रेरित करना है।',
    permissions: {
      canGiveDiscounts: true,
      maxDiscountPercent: 10,
      canGeneratePaymentLinks: true,
      canAccessCustomerPhone: true,
      canAutoReplyWhatsApp: true,
      requireOwnerApproval: false,
    },
    capabilities: [
      'पारदर्शी फीस व सरकारी शुल्क विवरण',
      'आवश्यक डाक्यूमेंट्स की त्वरित सूची',
      'ऑब्जेक्शन हैंडलिंग (विश्वास, समय, गारंटी)',
      'डायनामिक बुकिंग व टोकन लिंक',
    ],
    knowledgeBase: [
      'उकेड़िया दुकान बस स्टैंड के पास, तहसील जावरा, जिला रतलाम में स्थित है।',
      'PM सूर्य घर योजना 3 kW पर केंद्र सरकार से ₹78,000 की सीधी सब्सिडी मिलती है।',
      'KCC नवीनीकरण व नया आवेदन 2 से 3 कार्यदिवसों में पूरा होता है।',
      'दुकान पर कॉल नहीं, केवल व्हाट्सएप पर आधिकारिक काम होता है।',
    ],
    assignedTasks: [
      { id: 't1', title: 'सोलर रूफटॉप इंक्वायरी कन्वर्शन', status: 'ACTIVE' },
      { id: 't2', title: 'PVC कार्ड व प्रिंटिंग बल्क आर्डर क्लोज करना', status: 'ACTIVE' },
    ],
  },
  {
    id: 'agent_triage',
    name: 'दिशा (Triage & Classifier)',
    role: 'लीड क्वालिफायर व इंटेंट राउटर',
    avatar: '🎯',
    badge: 'प्रथम रिस्पॉन्डर',
    color: 'from-blue-600 to-cyan-600',
    description: 'आने वाले हर मैसेज को सेकंड्स में समझकर 0-100 लीड स्कोर देती है और सही स्पेशलिस्ट एजेंट को सौंपती है।',
    provider: 'groq',
    model: 'llama-3.1-8b-instant',
    temperature: 0.3,
    status: 'ACTIVE',
    isCustom: false,
    systemPrompt: 'आप आने वाले हर ग्राहक संदेश का उद्देश्य (Intent), गंभीरता (Urgency) और 0-100 लीड स्कोर तुरंत पहचानती हैं।',
    permissions: {
      canGiveDiscounts: false,
      maxDiscountPercent: 0,
      canGeneratePaymentLinks: false,
      canAccessCustomerPhone: true,
      canAutoReplyWhatsApp: true,
      requireOwnerApproval: false,
    },
    capabilities: [
      'मैसेज इंटेंट डिटेक्शन (सोलर, लोन, पैन, सामान्य)',
      '0-100 हॉट/वार्म/कोल्ड लीड स्कोरिंग',
      'अत्यावश्यक (Emergency) मामलों की पहचान',
      'मल्टी-एजेंट कोऑर्डिनेशन',
    ],
    knowledgeBase: [
      'सोलर और लोन इंक्वायरी को 90+ स्कोर देकर तुरंत सेल्स क्लोजर को सौंपना है।',
      'पार्टनर और कमाई संबंधित सवालों को सहयोगी एजेंट को फॉरवर्ड करना है।',
    ],
    assignedTasks: [
      { id: 't3', title: 'सभी नए व्हाट्सएप संदेशों को 0-100 स्कोर देना', status: 'ACTIVE' },
    ],
  },
  {
    id: 'agent_partner_mgr',
    name: 'सहयोगी (WFH Partner Agent)',
    role: 'वर्क-फ्रॉम-होम व रेफरल प्रबंधक',
    avatar: '🤝',
    badge: 'रेफरल पार्टनर हेड',
    color: 'from-emerald-500 to-teal-700',
    description: 'नए पार्टनर्स को ऑनबोर्ड करता है, उनका AKP-XXXX आईडी बनाता है, और कमीशन कमाने का तरीका सिखाता है।',
    provider: 'gemini',
    model: 'gemini-2.0-flash',
    temperature: 0.5,
    status: 'ACTIVE',
    isCustom: false,
    systemPrompt: 'आप वर्क-फ्रॉम-होम पार्टनर्स को प्रेरित करने और उन्हें रोजाना ₹500-₹2,500 कमाने का सिस्टम समझाने वाले एक्सपर्ट हैं।',
    permissions: {
      canGiveDiscounts: false,
      maxDiscountPercent: 0,
      canGeneratePaymentLinks: false,
      canAccessCustomerPhone: true,
      canAutoReplyWhatsApp: true,
      requireOwnerApproval: false,
    },
    capabilities: [
      'पार्टनर आईडी जनरेशन व डिजिटल कार्ड लिंक',
      'कमीशन रेट कार्ड की सटीक जानकारी (20%-50%)',
      'व्हाट्सएप ग्रुप शेयरिंग स्ट्रेटेजी',
      'पेआउट व UPI स्थिति जांच',
    ],
    knowledgeBase: [
      'सोलर लीड पर पार्टनर को ₹1,000 से ₹1,500 कमीशन मिलता है।',
      'वेबसाइट आर्डर पर ₹500 फिक्स कमीशन है।',
      'पार्टनर को अपनी AKP-ID लिंक व्हाट्सएप ग्रुप्स और स्टेटस पर शेयर करनी होती है।',
    ],
    assignedTasks: [
      { id: 't4', title: 'नए पार्टनर्स को डिजिटल आईडी कार्ड जारी करना', status: 'ACTIVE' },
    ],
  },
  {
    id: 'agent_followup',
    name: 'संजीवनी (Smart Follow-up Agent)',
    role: 'फॉलो-अप व रिकवरी विशेषज्ञ',
    avatar: '⏰',
    badge: 'कन्वर्शन रिकवरी',
    color: 'from-purple-600 to-indigo-700',
    description: 'जो ग्राहक पूछताछ करके रुक गए, उन्हें 24 से 48 घंटे में विनम्रता से सब्सिडी अलर्ट व डिस्काउंट ऑफर भेजती है।',
    provider: 'groq',
    model: 'llama-3.3-70b-versatile',
    temperature: 0.6,
    status: 'ACTIVE',
    isCustom: false,
    systemPrompt: 'आप उन ग्राहकों से पुनः संपर्क करती हैं जिन्होंने पूछताछ की थी पर आर्डर फाइनल नहीं किया। आपकी भाषा विनम्र, मददगार और गैर-स्पैमी होनी चाहिए।',
    permissions: {
      canGiveDiscounts: true,
      maxDiscountPercent: 10,
      canGeneratePaymentLinks: true,
      canAccessCustomerPhone: true,
      canAutoReplyWhatsApp: false, // requires review before sending followup
      requireOwnerApproval: true,
    },
    capabilities: [
      'छूटी हुई लीड्स (Cold Inquiries) की ऑटो-पहचान',
      'बिना स्पैम लगे मददगार और प्राकृतिक रिमाइंडर्स',
      'सीमित समय की सब्सिडी या ऑफर हाईलाइट्स',
      'री-एंगेजमेंट कन्वर्शन बूस्ट',
    ],
    knowledgeBase: [
      '24 घंटे बाद पहला विनम्र रिमाइंडर भेजें।',
      '48 घंटे बाद सरकारी योजना की अंतिम तिथि या सीमित स्लॉट का अलर्ट दें।',
    ],
    assignedTasks: [
      { id: 't5', title: 'पेंडिंग इनक्वायरीज के लिए कस्टमाइज्ड फॉलो-अप ड्राफ्ट करना', status: 'ACTIVE' },
    ],
  },
  {
    id: 'agent_store_exec',
    name: 'मुनीम जी (Store Executive & Reporter)',
    role: 'दुकान रिपोर्टर व बिजनेस एडवाइजर',
    avatar: '📊',
    badge: 'मालिक का AI साथी',
    color: 'from-slate-800 to-zinc-950',
    description: 'दुकान मालिक को प्रतिदिन सुबह-शाम पूरा हिसाब-किताब, टॉप सर्विसेज, और पेंडिंग काम की समरी रिपोर्ट देता है।',
    provider: 'gemini',
    model: 'gemini-2.0-flash',
    temperature: 0.4,
    status: 'ACTIVE',
    isCustom: false,
    systemPrompt: 'आप दुकान मालिक के विश्वसनीय सलाहकार और मुनीम हैं। आपका काम दैनिक लीड्स, ऑर्डर्स और पेआउट का विश्लेषण करके मालिक को ब्रीफिंग देना है।',
    permissions: {
      canGiveDiscounts: false,
      maxDiscountPercent: 0,
      canGeneratePaymentLinks: false,
      canAccessCustomerPhone: true,
      canAutoReplyWhatsApp: false,
      requireOwnerApproval: false,
    },
    capabilities: [
      'दैनिक लीड व कन्वर्शन ऑडिट',
      'पार्टनर कमीशन पेआउट कैलकुलेशन',
      'टॉप ट्रेंडिंग सरकारी योजनाओं का अलर्ट',
      'मालिक के लिए व्हाट्सएप ब्रीफिंग',
    ],
    knowledgeBase: [
      'प्रतिदिन सुबह 9 बजे नई लीड्स की समीक्षा करें।',
      'शाम 8 बजे पूरे दिन के पूरे हुए काम और पार्टनर कमीशन का हिसाब तैयार करें।',
    ],
    assignedTasks: [
      { id: 't6', title: 'दैनिक व्यवसाय रिपोर्ट व पार्टनर पेआउट कैलकुलेशन', status: 'ACTIVE' },
    ],
  },
];

// Read Agents from LocalStorage with fallback
export function getStoredAgents() {
  if (typeof window === 'undefined') return DEFAULT_AGENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AGENTS);
    if (!raw) return DEFAULT_AGENTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_AGENTS;
  } catch {
    return DEFAULT_AGENTS;
  }
}

// Save Agents to LocalStorage
export function saveStoredAgents(agents) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(agents));
  } catch (err) {
    console.warn('Failed to save agents to localStorage:', err);
  }
}

// Multi-Provider Keys Configuration (with Dify, Flowise, and n8n External Brains)
export function getStoredProviders() {
  const defaults = {
    // 🧠 1. Ready-Made External AI Brains (Dify.ai, Flowise, n8n)
    difyApiKey: '',
    difyBaseUrl: 'https://api.dify.ai/v1',
    flowiseEndpoint: '',
    n8nWebhookUrl: '',
    useExternalBrain: false, // true to route through Dify/Flowise/n8n
    primaryBrain: 'dify',    // 'dify' | 'flowise' | 'n8n' | 'direct'

    // ⚡ 2. Direct LLM Providers
    groqApiKey: '',
    geminiApiKey: '',
    openaiApiKey: '',
    gatewayUrl: 'http://localhost:4000/v1',
    gatewayApiKey: '',
  };
  if (typeof window === 'undefined') return defaults;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROVIDERS);
    return raw ? { ...defaults, ...JSON.parse(raw) } : defaults;
  } catch {
    return defaults;
  }
}

export function saveStoredProviders(providers) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.PROVIDERS, JSON.stringify(providers));
  } catch (err) {
    console.warn('Failed to save providers to localStorage:', err);
  }
}

// Helper: Match best service from customer text
export function findMatchingService(text) {
  if (!text) return null;
  const q = text.toLowerCase();

  if (q.includes('solar') || q.includes('सोलर') || q.includes('छत') || q.includes('rooftop') || q.includes('78000') || q.includes('सूर्य घर')) {
    return SERVICES.find(s => s.id === 'pm-surya-ghar-solar') || SERVICES[0];
  }
  if (q.includes('pump') || q.includes('पंप') || q.includes('कुसुम') || q.includes('kusum')) {
    return SERVICES.find(s => s.id === 'pm-kusum-solar-pump') || SERVICES[0];
  }
  if (q.includes('kcc') || q.includes('किसान क्रेडिट') || q.includes('kisan credit') || q.includes('कर्ज')) {
    return SERVICES.find(s => s.id === 'kcc') || SERVICES[0];
  }
  if (q.includes('pan') || q.includes('पैन') || q.includes('uti') || q.includes('nsdl')) {
    return SERVICES.find(s => s.id === 'pan-card') || SERVICES[0];
  }
  if (q.includes('ayushman') || q.includes('आयुष्मान') || q.includes('5 लाख') || q.includes('इलाज')) {
    return SERVICES.find(s => s.id === 'ayushman-card') || SERVICES[0];
  }
  if (q.includes('pvc') || q.includes('card') || q.includes('कार्ड') || q.includes('प्लास्टिक') || q.includes('aadhaar print')) {
    return SERVICES.find(s => s.id === 'pvc-card-printing') || SERVICES[0];
  }
  if (q.includes('website') || q.includes('वेबसाइट') || q.includes('online shop') || q.includes('दुकान की वेबसाइट')) {
    return SERVICES.find(s => s.id === 'business-website-dev') || SERVICES[0];
  }
  if (q.includes('ladli') || q.includes('लाडली') || q.includes('बहना') || q.includes('1250')) {
    return SERVICES.find(s => s.id === 'ladli-behna') || SERVICES[0];
  }
  if (q.includes('photo') || q.includes('फोटो') || q.includes('passport')) {
    return SERVICES.find(s => s.id === 'passport-photo-studio') || SERVICES[0];
  }
  if (q.includes('stamp') || q.includes('सील') || q.includes('स्टाम्प')) {
    return SERVICES.find(s => s.id === 'rubber-stamp-making') || SERVICES[0];
  }

  const found = SERVICES.find(s => 
    q.includes(s.name.toLowerCase()) || 
    (s.nameHi && q.includes(s.nameHi)) ||
    (s.popularOptions && s.popularOptions.some(opt => q.includes(opt.toLowerCase())))
  );
  return found || null;
}

// Intent Classification Engine
export function classifyCustomerIntent(messageText) {
  const text = (messageText || '').toLowerCase().trim();

  if (text.includes('partner') || text.includes('पार्टनर') || text.includes('refer') || text.includes('रेफर') || text.includes('kamai') || text.includes('कमाई') || text.includes('work from home') || text.includes('घर बैठे')) {
    return {
      intent: 'PARTNER_ONBOARDING',
      confidence: 0.95,
      leadScore: 85,
      targetAgentId: 'agent_partner_mgr',
      category: 'work_from_home',
      explanation: 'यूजर वर्क-फ्रॉम-होम पार्टनर बनकर कमीशन कमाने में रुचि रखता है।',
    };
  }

  if (text.includes('solar') || text.includes('सोलर') || text.includes('website') || text.includes('वेबसाइट') || text.includes('loan') || text.includes('लोन') || text.includes('pump') || text.includes('पंप') || text.includes('थोक') || text.includes('bulk')) {
    return {
      intent: 'HIGH_VALUE_SALE',
      confidence: 0.92,
      leadScore: 95,
      targetAgentId: 'agent_sales_closer',
      category: 'commercial_high_ticket',
      explanation: 'हाई-टिकट सर्विस (सोलर, लोन, वेबसाइट, बल्क प्रिंटिंग) - तुरंत कन्वर्शन संभावित।',
    };
  }

  if (text.includes('kcc') || text.includes('pan') || text.includes('पैन') || text.includes('ayushman') || text.includes('आयुष्मान') || text.includes('लाडली') || text.includes('राशन') || text.includes('uparjan') || text.includes('उपार्जन')) {
    return {
      intent: 'CITIZEN_SERVICE',
      confidence: 0.88,
      leadScore: 78,
      targetAgentId: 'agent_sales_closer',
      category: 'citizen_services',
      explanation: 'दैनिक MPOnline / CSC सरकारी सेवा - डाक्यूमेंट्स व पोर्टल फीस तुरंत चाहिए।',
    };
  }

  if (text.includes('pvc') || text.includes('photo') || text.includes('फोटो') || text.includes('print') || text.includes('प्रिंट') || text.includes('stamp') || text.includes('स्टाम्प') || text.includes('nfc') || text.includes('id card')) {
    return {
      intent: 'PRODUCT_PURCHASE',
      confidence: 0.85,
      leadScore: 80,
      targetAgentId: 'agent_sales_closer',
      category: 'printing_products',
      explanation: 'प्रिंटिंग व फिजिकल प्रोडक्ट इंक्वायरी - डिलीवरी टाइम व रेट कार्ड आवश्यक।',
    };
  }

  if (text.includes('status') || text.includes('स्टेटस') || text.includes('kab tak') || text.includes('कब तक') || text.includes('hua ki nahi') || text.includes('हुआ')) {
    return {
      intent: 'STATUS_CHECK',
      confidence: 0.82,
      leadScore: 65,
      targetAgentId: 'agent_followup',
      category: 'customer_support',
      explanation: 'कस्टमर अपने पहले से दिए गए काम की स्थिति जानना चाहता है।',
    };
  }

  return {
    intent: 'GENERAL_INQUIRY',
    confidence: 0.60,
    leadScore: 50,
    targetAgentId: 'agent_sales_closer',
    category: 'general',
    explanation: 'सामान्य सवाल या अभिवादन - सेवाओं की पूरी लिस्ट देकर गाइड करना है।',
  };
}

// Multi-Agent Workflow Runner with Permissions & Learned Knowledge
export async function executeMultiAgentWorkflow({
  customerMessage,
  customerName = 'ग्राहक',
  customerPhone = '',
  partnerRef = null,
  overrideAgentId = null,
  customAgents = null,
}) {
  const startTime = Date.now();
  const agents = customAgents || getStoredAgents();
  const triage = classifyCustomerIntent(customerMessage);
  const matchedService = findMatchingService(customerMessage);

  // Pick assigned agent
  const targetId = overrideAgentId && overrideAgentId !== 'auto' ? overrideAgentId : triage.targetAgentId;
  const agent = agents.find(a => a.id === targetId) || agents[0];

  // Check agent status
  if (agent.status === 'PAUSED') {
    return {
      success: false,
      reason: `एजेंट "${agent.name}" वर्तमान में निष्क्रिय (Paused) है।`,
      triage,
      assignedAgent: agent,
    };
  }

  const providers = getStoredProviders();
  let apiKey = '';
  const provider = agent.provider || 'deterministic';

  if (provider === 'groq') apiKey = providers.groqApiKey;
  else if (provider === 'gemini') apiKey = providers.geminiApiKey;
  else if (provider === 'openai') apiKey = providers.openaiApiKey;
  else if (provider === 'gateway') apiKey = providers.gatewayApiKey;

  let responseText = '';
  let modelUsed = `${provider.toUpperCase()} (${agent.model || 'auto'})`;
  let isRealLlm = false;
  let retrieverResources = [];

  // 🧠 1. Check for Dify.ai or External Brain First (if configured)
  const shouldTryDify = (providers.useExternalBrain && providers.primaryBrain === 'dify' && providers.difyApiKey) || 
                        (provider === 'dify' && providers.difyApiKey) ||
                        (providers.difyApiKey && providers.difyApiKey.trim().length > 5);

  if (shouldTryDify) {
    try {
      const difyRes = await callDifyBrain({
        apiKey: providers.difyApiKey.trim(),
        baseUrl: providers.difyBaseUrl,
        query: customerMessage,
        customerName,
        inputs: {
          service_name: matchedService ? matchedService.name : 'सामान्य पूछताछ',
          agent_role: agent.role,
        },
      });
      if (difyRes && difyRes.answer) {
        responseText = difyRes.answer;
        modelUsed = 'Dify.ai Headless Multi-Agent Brain (RAG + Tools)';
        retrieverResources = difyRes.retrieverResources || [];
        isRealLlm = true;
      }
    } catch (difyErr) {
      console.warn('Dify.ai Brain call failed, falling back to local multi-agent router:', difyErr);
    }
  }

  // 🧠 2. Check for Flowise AI Brain (if configured)
  if (!responseText && providers.useExternalBrain && providers.primaryBrain === 'flowise' && providers.flowiseEndpoint) {
    try {
      const flowiseRes = await callFlowiseBrain({
        endpoint: providers.flowiseEndpoint,
        query: customerMessage,
      });
      if (flowiseRes && flowiseRes.answer) {
        responseText = flowiseRes.answer;
        modelUsed = 'Flowise AI Multi-Agent Flow';
        isRealLlm = true;
      }
    } catch (flowiseErr) {
      console.warn('Flowise Brain call failed:', flowiseErr);
    }
  }

  // ⚡ 3. Direct LLM Call (Groq, Gemini, OpenAI, LiteLLM) if external brain didn't respond
  if (!responseText && apiKey && apiKey.trim().length > 8 && provider !== 'deterministic') {
    try {
      const llmResult = await callExternalLLM({
        provider,
        apiKey,
        agent,
        customerMessage,
        customerName,
        matchedService,
        partnerRef,
        gatewayUrl: providers.gatewayUrl,
      });
      if (llmResult && llmResult.text) {
        responseText = llmResult.text;
        modelUsed = llmResult.model;
        isRealLlm = true;
      }
    } catch (err) {
      console.warn('External LLM call failed, falling back to Deterministic Expert Agent:', err);
    }
  }

  // Deterministic Fallback if LLM unavailable or provider is deterministic
  if (!responseText) {
    responseText = generateExpertAgentResponse({
      agent,
      triage,
      matchedService,
      customerMessage,
      customerName,
      partnerRef,
    });
    modelUsed = 'Anu Krupa High-Precision Expert Engine (Deterministic)';
  }

  // Permission Guardrail Enforcement
  if (!agent.permissions?.canGiveDiscounts && (responseText.includes('छूट') || responseText.includes('डिस्काउंट'))) {
    // Sanitize unauthorized discounts
    responseText = responseText.replace(/(\d+%\s*की\s*छूट|\d+%\s*डिस्काउंट|विशेष\s*छूट)/gi, 'पारदर्शी व उचित मूल्य');
  }

  const durationMs = Date.now() - startTime;

  return {
    success: true,
    triage,
    assignedAgent: agent,
    matchedService: matchedService ? {
      id: matchedService.id,
      name: matchedService.name,
      nameHi: matchedService.nameHi,
      portalFee: matchedService.portalFee,
      turnaroundTime: matchedService.turnaroundTime,
      partnerCommission: matchedService.partnerCommission,
    } : null,
    response: responseText,
    guardrailsApplied: {
      canGiveDiscounts: agent.permissions?.canGiveDiscounts,
      maxDiscountPercent: agent.permissions?.maxDiscountPercent,
      requireOwnerApproval: agent.permissions?.requireOwnerApproval,
    },
    meta: {
      isRealLlm,
      modelUsed,
      retrieverResources,
      durationMs,
      timestamp: new Date().toISOString(),
    },
  };
}

// Direct Task Execution on an Agent (काम करवाना)
export async function executeAgentTask({
  agentId,
  taskDescription,
  targetLead = null,
}) {
  const agents = getStoredAgents();
  const agent = agents.find(a => a.id === agentId) || agents[0];

  const startTime = Date.now();
  const syntheticCustomerMsg = targetLead 
    ? `ग्राहक का नाम: ${targetLead.customerName || 'ग्राहक'}, सेवा: ${targetLead.serviceName || 'सेवा'}, नोट: ${targetLead.note || ''}. कार्य: ${taskDescription}`
    : taskDescription;

  const result = await executeMultiAgentWorkflow({
    customerMessage: syntheticCustomerMsg,
    customerName: targetLead?.customerName || 'दुकान मालिक',
    overrideAgentId: agent.id,
    customAgents: agents,
  });

  return {
    taskId: 'TASK-' + Date.now(),
    agentName: agent.name,
    taskDescription,
    completedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    output: result.response,
    durationMs: Date.now() - startTime,
  };
}

// Deterministic High-Converting Response Generator
function generateExpertAgentResponse({
  agent,
  triage,
  matchedService,
  customerMessage,
  customerName,
  partnerRef,
}) {
  const shopAddress = `${BUSINESS_CONFIG.fullAddressHi} (${BUSINESS_CONFIG.landmark})`;
  const agentKnowledgeText = (agent.knowledgeBase || []).length > 0
    ? `\n💡 *विशेष जानकारी:*\n` + agent.knowledgeBase.slice(0, 2).map(k => `• ${k}`).join('\n')
    : '';

  if (agent.id === 'agent_partner_mgr') {
    return `नमस्ते ${customerName}! 🙏

मैं **अनु कृपा ऑनलाइन** से आपका **पार्टनर कोऑर्डिनेटर (${agent.name})** हूँ। 💼

घर बैठे मोबाइल से ₹500 से ₹2,500/दिन कमाने का पूरा प्लान:
1️⃣ **पार्टनर आईडी (AKP-ID):** हमारी वेबसाइट पर 30 सेकंड में फ्री आईडी बनाएं।
2️⃣ **रेफरल लिंक:** आपको अपना पर्सनल लिंक मिलेगा (जैसे \`?ref=AKP-XXXX\`)।
3️⃣ **कमीशन रेट कार्ड:**
   • सोलर रूफटॉप / पंप: **₹1,000 से ₹1,500 प्रति सफल आर्डर**
   • वेबसाइट व डिजिटल शॉप: **₹500 प्रति आर्डर**
   • KCC / पैन कार्ड / PVC कार्ड: **₹20 से ₹50 प्रति आर्डर**
4️⃣ **सीधा बैंक / UPI पेआउट:** काम पूरा होते ही आपके PhonePe/GPay पर ट्रांसफर!
${agentKnowledgeText}

👉 **अभी तुरंत अपना डिजिटल पार्टनर कार्ड प्राप्त करने के लिए:**
वेबसाइट पर 'पार्टनर बनें' बटन दबाएं या मुझे अपना नाम व UPI आईडी भेजें।`;
  }

  if (matchedService) {
    const feeInfo = matchedService.portalFee ? `• सर्विस/पोर्टल शुल्क: *${matchedService.portalFee}*` : '';
    const govtFeeInfo = matchedService.govtFee ? `• सरकारी शुल्क: *${matchedService.govtFee}*` : '';
    const timeInfo = matchedService.turnaroundTime ? `• समय सीमा: *${matchedService.turnaroundTime}*` : '';
    const docs = matchedService.requiredDocs && matchedService.requiredDocs.length 
      ? matchedService.requiredDocs.join(', ') 
      : 'आधार कार्ड व मोबाइल नंबर';

    return `नमस्ते ${customerName} जी! 🙏

अनु कृपा ऑनलाइन (उकेड़िया, जावरा) में आपका स्वागत है।

आपने *${matchedService.nameHi || matchedService.name}* के लिए पूछा है:
${feeInfo}
${govtFeeInfo}
${timeInfo}

📋 **आवश्यक दस्तावेज़:**
${docs}
${agentKnowledgeText}

📍 **हमारा केंद्र:**
${shopAddress}
(दुकान पर आने की आवश्यकता नहीं है, आप दस्तावेज़ व्हाट्सएप पर भेजकर भी काम करवा सकते हैं!)

✅ **आवेदन शुरू करने हेतु:**
कृपया अपने आवश्यक दस्तावेज़ों की फोटो इसी व्हाट्सएप पर भेजें!`;
  }

  return `नमस्ते ${customerName} जी! 🙏

अनु कृपा ऑनलाइन, उकेड़िया (जावरा, रतलाम) में आपका स्वागत है।
मैं आपकी सहायता के लिए **${agent.name}** हूँ।

हम MPOnline, CSC, KCC, पैन कार्ड, आयुष्मान कार्ड, PM सूर्य घर सोलर योजना व डिजिटल प्रिंटिंग का कार्य पूरी जिम्मेदारी से करते हैं।
${agentKnowledgeText}

कृपया बताएं हम आपकी क्या सेवा कर सकते हैं? आप अपने दस्तावेज़ भी सीधे यहाँ भेज सकते हैं। ⚡`;
}

// External LLM Caller (Groq / Gemini / OpenAI / LiteLLM Proxy)
async function callExternalLLM({
  provider,
  apiKey,
  agent,
  customerMessage,
  customerName,
  matchedService,
  partnerRef,
  gatewayUrl,
}) {
  const knowledgeStr = (agent.knowledgeBase || []).length > 0 
    ? `\nYour Learned Knowledge & Rules:\n` + agent.knowledgeBase.map(k => `- ${k}`).join('\n')
    : '';

  const permissionsStr = `
Permissions & Guardrails:
- Can Give Discount: ${agent.permissions?.canGiveDiscounts ? `YES (Max ${agent.permissions?.maxDiscountPercent}%)` : 'NO (Never offer discounts)'}
- Can Generate Payment Link: ${agent.permissions?.canGeneratePaymentLinks ? 'YES' : 'NO'}
- Can Auto Reply: ${agent.permissions?.canAutoReplyWhatsApp ? 'YES' : 'NO'}`;

  const systemPrompt = `You are "${agent.name}", a specialized AI employee working for "Anu Krupa Online" (अनु कृपा ऑनलाइन), a verified physical digital service center in Village Ukediya, Tehsil Jaora, District Ratlam, Madhya Pradesh (Pin 457226).
Owner WhatsApp: ${BUSINESS_CONFIG.whatsappDisplay}.
Tone: Polite, friendly, highly trustworthy, local Hindi / Hinglish.

Your Role Instructions:
${agent.systemPrompt || agent.description}
${knowledgeStr}
${permissionsStr}

Store Knowledge:
- Offers MPOnline, CSC, KCC (Kisan Credit Card), PM Surya Ghar Solar Rooftop (₹78,000 subsidy), PM Kusum Solar Pump, Ayushman Card (₹5 Lakh free treatment), PAN Card, PVC Printing, Business Websites.
- Strict Policy: No calls, only WhatsApp. 100% transparent pricing.
${matchedService ? `Current Customer Inquiring about: ${matchedService.name} (${matchedService.nameHi}). Portal Fee: ${matchedService.portalFee}, Govt Fee: ${matchedService.govtFee}, Docs: ${(matchedService.requiredDocs || []).join(', ')}.` : ''}
${partnerRef ? `Customer referred by Partner: ${partnerRef}.` : ''}

Output Format: A clean, warm, conversion-focused WhatsApp message in Hindi/Hinglish with emojis and bullet points. Keep it under 150 words.`;

  // 1. Groq (Ultra-fast)
  if (provider === 'groq') {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: agent.model || 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: customerMessage }
        ],
        temperature: agent.temperature || 0.6,
        max_tokens: 450,
      }),
    });
    const data = await res.json();
    return {
      text: data?.choices?.[0]?.message?.content || '',
      model: `Groq (${agent.model || 'llama-3.3-70b-versatile'})`,
    };
  }

  // 2. Google Gemini Flash
  if (provider === 'gemini') {
    const model = agent.model || 'gemini-2.0-flash';
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: customerMessage }] }],
        generationConfig: { temperature: agent.temperature || 0.6, maxOutputTokens: 450 },
      }),
    });
    const data = await res.json();
    return {
      text: data?.candidates?.[0]?.content?.parts?.[0]?.text || '',
      model: `Google Gemini (${model})`,
    };
  }

  // 3. Local LiteLLM / Free Gateway
  if (provider === 'gateway') {
    const targetUrl = (gatewayUrl || 'http://localhost:4000/v1').replace(/\/$/, '') + '/chat/completions';
    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey || 'sk-free-gateway'}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: agent.model || 'qwen-coder',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: customerMessage }
        ],
        temperature: agent.temperature || 0.6,
        max_tokens: 450,
      }),
    });
    const data = await res.json();
    return {
      text: data?.choices?.[0]?.message?.content || '',
      model: `LiteLLM Gateway (${agent.model || 'proxy'})`,
    };
  }

  // 4. OpenAI
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: agent.model || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: customerMessage }
      ],
      temperature: agent.temperature || 0.6,
      max_tokens: 450,
    }),
  });
  const data = await res.json();
  return {
    text: data?.choices?.[0]?.message?.content || '',
    model: `OpenAI (${agent.model || 'gpt-4o-mini'})`,
  };
}

// 🧠 1. Dify.ai Headless Brain Caller (Native Dify REST API)
export async function callDifyBrain({
  apiKey,
  baseUrl = 'https://api.dify.ai/v1',
  query,
  customerName = 'ग्राहक',
  conversationId = '',
  inputs = {},
}) {
  const cleanBase = (baseUrl || 'https://api.dify.ai/v1').replace(/\/$/, '');
  const url = `${cleanBase}/chat-messages`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: {
        customer_name: customerName,
        shop_name: 'अनु कृपा ऑनलाइन',
        location: 'उकेड़िया, जावरा (रतलाम)',
        ...inputs,
      },
      query,
      response_mode: 'blocking',
      conversation_id: conversationId || undefined,
      user: `anu-krupa-${Date.now()}`,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Dify API Error (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  return {
    answer: data.answer || '',
    conversationId: data.conversation_id || '',
    messageId: data.message_id || '',
    retrieverResources: data.metadata?.retriever_resources || [],
    raw: data,
  };
}

// 🧠 2. Flowise AI Prediction Caller
export async function callFlowiseBrain({
  endpoint,
  query,
}) {
  const cleanUrl = endpoint.trim();
  const res = await fetch(cleanUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      question: query,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Flowise API Error (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  return {
    answer: data.text || data.answer || JSON.stringify(data),
    raw: data,
  };
}

// 🧠 3. n8n AI Agent Webhook Caller
export async function callN8nBrain({
  webhookUrl,
  payload,
}) {
  const cleanUrl = webhookUrl.trim();
  const res = await fetch(cleanUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`n8n Webhook Error (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  return {
    answer: data.output || data.reply || data.text || JSON.stringify(data),
    raw: data,
  };
}
