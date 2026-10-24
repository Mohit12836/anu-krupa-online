/**
 * ANU KRUPA ONLINE — Autonomous Multi-AI Agent Workforce Engine
 * 
 * Production-Grade Multi-Agent System designed specifically for:
 * 1. WhatsApp Cloud API (WACA) / WACRM Integration
 * 2. Real-time Lead Classification & 0-100 Scoring
 * 3. Autonomous Deal Closing & Quote Generation
 * 4. Partner Referral Routing
 * 5. 24-48h Inactivity Follow-up Engine
 * 6. Store Executive Daily Briefings
 */

import { SERVICES } from '../data/servicesData';
import { CATEGORIES, MACRO_VERTICALS } from '../data/categoriesData';
import { BUSINESS_CONFIG } from '../data/businessConfig';

// 5 Specialized AI Agents Definition
export const AGENT_ROSTER = [
  {
    id: 'agent_sales_closer',
    name: 'विक्रय राज (Sales Closer)',
    role: 'डील्स क्लोजर व कोटेशन विशेषज्ञ',
    avatar: '💼',
    badge: 'सेल्स स्पेशलिस्ट',
    color: 'from-amber-500 to-orange-600',
    description: 'कस्टमर की जरूरत समझकर तुरंत सही फीस, डाक्यूमेंट्स और ऑनलाइन बुकिंग लिंक देकर सेल फाइनल करता है।',
    capabilities: [
      'पारदर्शी फीस व सरकारी शुल्क विवरण',
      'आवश्यक डाक्यूमेंट्स की त्वरित सूची',
      'ऑब्जेक्शन हैंडलिंग (विश्वास, समय, गारंटी)',
      'डायनामिक बुकिंग व टोकन लिंक',
    ],
    defaultModel: 'Groq Llama-3.3-70B / Gemini 2.0 Flash',
  },
  {
    id: 'agent_triage',
    name: 'दिशा (Triage & Classifier)',
    role: 'लीड क्वालिफायर व इंटेंट राउटर',
    avatar: '🎯',
    badge: 'प्रथम रिस्पॉन्डर',
    color: 'from-blue-600 to-cyan-600',
    description: 'आने वाले हर मैसेज को सेकंड्स में समझकर 0-100 लीड स्कोर देती है और सही स्पेशलिस्ट एजेंट को सौंपती है।',
    capabilities: [
      'मैसेज इंटेंट डिटेक्शन (सोलर, लोन, पैन, सामान्य)',
      '0-100 हॉट/वार्म/कोल्ड लीड स्कोरिंग',
      'अत्यावश्यक (Emergency) मामलों की त्वरित पहचान',
      'मल्टी-एजेंट कोऑर्डिनेशन',
    ],
    defaultModel: 'Groq Llama-3.1-8B (Ultra Fast <200ms)',
  },
  {
    id: 'agent_partner_mgr',
    name: 'सहयोगी (WFH Partner Agent)',
    role: 'वर्क-फ्रॉम-होम व रेफरल प्रबंधक',
    avatar: '🤝',
    badge: 'रेफरल पार्टनर हेड',
    color: 'from-emerald-500 to-teal-700',
    description: 'नए पार्टनर्स को ऑनबोर्ड करता है, उनका AKP-XXXX आईडी बनाता है, और कमीशन कमाने का तरीका सिखाता है।',
    capabilities: [
      'पार्टनर आईडी जनरेशन व डिजिटल कार्ड लिंक',
      'कमीशन रेट कार्ड की सटीक जानकारी (20%-50%)',
      'व्हाट्सएप ग्रुप शेयरिंग स्ट्रेटेजी',
      'पेआउट व UPI स्थिति जांच',
    ],
    defaultModel: 'Gemini 2.0 Flash / Groq Llama-3.3',
  },
  {
    id: 'agent_followup',
    name: 'संजीवनी (Smart Follow-up Agent)',
    role: 'फॉलो-अप व रिकवरी विशेषज्ञ',
    avatar: '⏰',
    badge: 'कन्वर्शन रिकवरी',
    color: 'from-purple-600 to-indigo-700',
    description: 'जो ग्राहक पूछताछ करके रुक गए, उन्हें 24 से 48 घंटे में विनम्रता से सब्सिडी अलर्ट व डिस्काउंट ऑफर भेजती है।',
    capabilities: [
      'छूटी हुई लीड्स (Cold Inquiries) की ऑटो-पहचान',
      'बिना स्पैम लगे मददगार और प्राकृतिक रिमाइंडर्स',
      'सीमित समय की सब्सिडी या ऑफर हाईलाइट्स',
      'री-एंगेजमेंट कन्वर्शन बूस्ट',
    ],
    defaultModel: 'Groq Llama-3.3 / Claude 3.5 Sonnet',
  },
  {
    id: 'agent_store_exec',
    name: 'मुनीम जी (Store Executive & Reporter)',
    role: 'दुकान रिपोर्टर व बिजनेस एडवाइजर',
    avatar: '📊',
    badge: 'मालिक का AI साथी',
    color: 'from-slate-800 to-zinc-950',
    description: 'दुकान मालिक को प्रतिदिन सुबह-शाम पूरा हिसाब-किताब, टॉप सर्विसेज, और पेंडिंग काम की समरी रिपोर्ट देता है।',
    capabilities: [
      'दैनिक लीड व कन्वर्शन ऑडिट',
      'पार्टनर कमीशन पेआउट कैलकुलेशन',
      'टॉप ट्रेंडिंग सरकारी योजनाओं का अलर्ट',
      'मालिक के लिए व्हाट्सएप ब्रीफिंग',
    ],
    defaultModel: 'Gemini 2.0 Flash / DeepSeek R1',
  },
];

// Helper: Match best service from customer text
export function findMatchingService(text) {
  if (!text) return null;
  const q = text.toLowerCase();

  // Keyword rules based on our 22 services
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

  // Fallback: search service name
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

  // 1. Partner Intent
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

  // 2. High-Value Commercial / Sales Intent
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

  // 3. Citizen / Urgent Service
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

  // 4. Products & Printing
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

  // 5. Follow-up / Status Check
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

  // 6. General / Incomplete Inquiry
  return {
    intent: 'GENERAL_INQUIRY',
    confidence: 0.60,
    leadScore: 50,
    targetAgentId: 'agent_sales_closer',
    category: 'general',
    explanation: 'सामान्य सवाल या अभिवादन - सेवाओं की पूरी लिस्ट देकर गाइड करना है।',
  };
}

// Multi-Agent Workflow Runner
export async function executeMultiAgentWorkflow({
  customerMessage,
  customerName = 'ग्राहक',
  customerPhone = '',
  partnerRef = null,
  config = {},
}) {
  const startTime = Date.now();
  const triage = classifyCustomerIntent(customerMessage);
  const matchedService = findMatchingService(customerMessage);

  // Pick assigned agent
  const agent = AGENT_ROSTER.find(a => a.id === triage.targetAgentId) || AGENT_ROSTER[0];

  // Try real LLM if API Key is configured in settings
  let responseText = '';
  let modelUsed = agent.defaultModel;
  let isRealLlm = false;

  const apiKey = config.apiKey || (typeof window !== 'undefined' ? localStorage.getItem('ak_agent_api_key') : null);
  const provider = config.provider || (typeof window !== 'undefined' ? localStorage.getItem('ak_agent_provider') : 'groq') || 'groq';

  if (apiKey && apiKey.trim().length > 8) {
    try {
      const llmResult = await callExternalLLM({
        provider,
        apiKey,
        agent,
        customerMessage,
        customerName,
        matchedService,
        partnerRef,
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

  // Deterministic Expert Fallback (Zero-Error Guarantee even without API Key)
  if (!responseText) {
    responseText = generateExpertAgentResponse({
      agentId: agent.id,
      triage,
      matchedService,
      customerMessage,
      customerName,
      partnerRef,
    });
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
    meta: {
      isRealLlm,
      modelUsed,
      durationMs,
      timestamp: new Date().toISOString(),
    },
  };
}

// Deterministic High-Converting Response Generator
function generateExpertAgentResponse({
  agentId,
  triage,
  matchedService,
  customerMessage,
  customerName,
  partnerRef,
}) {
  const shopAddress = `${BUSINESS_CONFIG.fullAddressHi} (${BUSINESS_CONFIG.landmark})`;
  const phone = BUSINESS_CONFIG.whatsappDisplay;

  // 1. Partner Manager Agent
  if (agentId === 'agent_partner_mgr') {
    return `नमस्ते ${customerName}! 🙏

मैं **अनु कृपा ऑनलाइन** से आपका **पार्टनर कोऑर्डिनेटर (सहयोगी AI)** हूँ। 💼

घर बैठे मोबाइल से ₹500 से ₹2,500/दिन कमाने का पूरा प्लान:
1️⃣ **पार्टनर आईडी (AKP-ID):** हमारी वेबसाइट पर 30 सेकंड में फ्री आईडी बनाएं।
2️⃣ **रेफरल लिंक:** आपको अपना पर्सनल लिंक मिलेगा (जैसे \`?ref=AKP-XXXX\`)।
3️⃣ **कमीशन रेट कार्ड:**
   • सोलर रूफटॉप / पंप: **₹1,000 से ₹1,500 प्रति सफल आर्डर**
   • वेबसाइट व डिजिटल शॉप: **₹500 प्रति आर्डर**
   • KCC / पैन कार्ड / PVC कार्ड: **₹20 से ₹50 प्रति आर्डर**
4️⃣ **सीधा बैंक / UPI पेआउट:** काम पूरा होते ही आपके PhonePe/GPay पर ट्रांसफर!

👉 **अभी तुरंत अपना डिजिटल पार्टनर कार्ड प्राप्त करने के लिए:**
नीचे दिए गए लिंक पर टैप करें या वेबसाइट पर 'पार्टनर बनें' बटन दबाएं।

कोई सवाल हो तो तुरंत पूछें, मैं आपकी पूरी मदद करूँगा! ✨`;
  }

  // 2. Sales Closer with Matched Service
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

📍 **हमारा पता:**
${shopAddress}
(दुकान पर आने की आवश्यकता नहीं है, आप दस्तावेज़ व्हाट्सएप पर भेजकर भी काम करवा सकते हैं!)

✅ **आगे बढ़ने के लिए:**
कृपया अपने दस्तावेज़ों की फोटो इसी व्हाट्सएप नंबर पर भेजें, हम 10 मिनट में आपका आवेदन प्रोसेस कर देंगे!`;
  }

  // 3. High-Value Intent fallback
  if (triage.intent === 'HIGH_VALUE_SALE') {
    return `नमस्ते ${customerName} जी! 🙏

अनु कृपा ऑनलाइन के सीनियर कंसल्टेंट से आपका स्वागत है।

हम निम्नलिखित सेवाओं के लिए अधिकृत केंद्र हैं:
☀️ **PM सूर्य घर मुफ्त बिजली योजना:** ₹78,000 की सीधी केंद्र सरकार सब्सिडी!
🚜 **PM कुसुम सोलर पंप:** 90% तक सरकारी अनुदान!
💻 **व्यापारिक वेबसाइट व डिजिटल दुकान:** मात्र 24 घंटे में लाइव!
💳 **KCC व सभी प्रकार के ऋण (Loans)**

कृपया बताएं आप किस सेवा के बारे में पूरी जानकारी (सब्सिडी, खर्च, डाक्यूमेंट्स) चाहते हैं? मैं तुरंत पूरी PDF व जानकारी भेजता हूँ।`;
  }

  // 4. Default Polite Local Shop Response
  return `नमस्ते ${customerName} जी! 🙏

अनु कृपा ऑनलाइन, उकेड़िया (जावरा, रतलाम) में आपका स्वागत है।
हम एमपी ऑनलाइन, सीएससी, पैन कार्ड, समग्र, आयुष्मान, सोलर योजना व सभी डिजिटल प्रिंटिंग का कार्य पूरी गारंटी के साथ करते हैं।

कृपया बताएं हम आपकी क्या सेवा कर सकते हैं? आप सीधे अपने दस्तावेज़ भी यहाँ भेज सकते हैं। ⚡`;
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
}) {
  const systemPrompt = `You are "${agent.name}", a professional, honest, and high-converting AI employee working for "Anu Krupa Online" (अनु कृपा ऑनलाइन), a verified physical digital service center in Village Ukediya, Tehsil Jaora, District Ratlam, Madhya Pradesh (Pin 457226).
Owner WhatsApp: ${BUSINESS_CONFIG.whatsappDisplay}.
Tone: Polite, friendly, highly trustworthy, local Hindi / Hinglish.
Your Goal: ${agent.description}

Store Knowledge:
- Offers MPOnline, CSC, KCC (Kisan Credit Card), PM Surya Ghar Solar Rooftop (₹78,000 subsidy), PM Kusum Solar Pump, Ayushman Card (₹5 Lakh free treatment), PAN Card, PVC Printing, Business Websites.
- Strict Policy: No calls, only WhatsApp. 100% transparent pricing.
${matchedService ? `Current Customer Inquiring about: ${matchedService.name} (${matchedService.nameHi}). Portal Fee: ${matchedService.portalFee}, Govt Fee: ${matchedService.govtFee}, Docs: ${(matchedService.requiredDocs || []).join(', ')}.` : ''}
${partnerRef ? `Customer referred by Partner: ${partnerRef}.` : ''}

Output Format: A clean, warm, conversion-focused WhatsApp message in Hindi/Hinglish with emojis and bullet points. Keep it under 150 words.`;

  // 1. Groq (Ultra-fast, Llama 3.3 70B)
  if (provider === 'groq') {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: customerMessage }
        ],
        temperature: 0.6,
        max_tokens: 450,
      }),
    });
    const data = await res.json();
    return {
      text: data?.choices?.[0]?.message?.content || '',
      model: 'Groq (llama-3.3-70b-versatile)',
    };
  }

  // 2. Google Gemini Flash (Direct REST)
  if (provider === 'gemini') {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: customerMessage }] }],
        generationConfig: { temperature: 0.6, maxOutputTokens: 450 },
      }),
    });
    const data = await res.json();
    return {
      text: data?.candidates?.[0]?.content?.parts?.[0]?.text || '',
      model: 'Google Gemini 2.0 Flash',
    };
  }

  // 3. Local LiteLLM / Free AI Gateway (port 4000)
  if (provider === 'gateway') {
    const res = await fetch('http://localhost:4000/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey || 'sk-free-gateway'}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen-coder',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: customerMessage }
        ],
        temperature: 0.6,
        max_tokens: 450,
      }),
    });
    const data = await res.json();
    return {
      text: data?.choices?.[0]?.message?.content || '',
      model: 'Local LiteLLM Zero-Limit Gateway',
    };
  }

  // Fallback to generic OpenAI compatible
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: customerMessage }
      ],
      temperature: 0.6,
      max_tokens: 450,
    }),
  });
  const data = await res.json();
  return {
    text: data?.choices?.[0]?.message?.content || '',
    model: 'OpenAI gpt-4o-mini',
  };
}
