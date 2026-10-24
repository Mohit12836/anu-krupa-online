/**
 * ANU KRUPA ONLINE — Multi-Agent Vercel Serverless Webhook Endpoint
 * 
 * Compatible with:
 * 1. Meta WhatsApp Cloud API (WACA) Webhooks
 * 2. WACRM Incoming Webhooks
 * 3. n8n / Make / Zapier Workflows
 * 4. Direct HTTP POST from Custom Frontends
 * 
 * URL on Vercel: https://anu-krupa-online.vercel.app/api/agent-webhook
 */

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. WEBHOOK VERIFICATION (GET) — Required by Meta WhatsApp Cloud API
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'anu_krupa_secret_2026';

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WhatsApp Webhook Verified Successfully');
      return res.status(200).send(challenge);
    }

    // Health check endpoint for WACRM
    return res.status(200).json({
      status: 'active',
      engine: 'Anu Krupa Multi-AI Agent Workforce',
      agents: [
        'विक्रय राज (Sales Closer)',
        'दिशा (Triage & Classifier)',
        'सहयोगी (WFH Partner Agent)',
        'संजीवनी (Follow-up Agent)',
        'मुनीम जी (Store Executive)'
      ],
      timestamp: new Date().toISOString(),
    });
  }

  // 2. INCOMING MESSAGE & MULTI-AGENT EXECUTION (POST)
  if (req.method === 'POST') {
    try {
      const body = req.body || {};

      let senderPhone = '';
      let senderName = 'ग्राहक';
      let messageText = '';
      let partnerRef = null;

      // Case A: Meta WhatsApp Cloud API Payload
      if (body.object === 'whatsapp_business_account') {
        const entry = body.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value;
        const message = value?.messages?.[0];
        const contact = value?.contacts?.[0];

        if (message) {
          senderPhone = message.from;
          senderName = contact?.profile?.name || 'ग्राहक';
          messageText = message.text?.body || message.button?.text || '';
        }
      } 
      // Case B: Direct JSON Payload from WACRM, n8n, or Website
      else {
        senderPhone = body.phone || body.from || body.customerPhone || '';
        senderName = body.name || body.customerName || 'ग्राहक';
        messageText = body.message || body.text || body.query || '';
        partnerRef = body.partnerRef || body.ref || null;
      }

      if (!messageText) {
        return res.status(200).json({ 
          success: true, 
          note: 'No message text to process (status update or empty payload)' 
        });
      }

      // Dynamic Classification Logic (Pure Node.js compatible)
      const q = messageText.toLowerCase();
      let assignedAgent = 'विक्रय राज (Sales Closer)';
      let intent = 'GENERAL_INQUIRY';
      let leadScore = 60;
      let replyText = '';

      if (q.includes('partner') || q.includes('पार्टनर') || q.includes('kamai') || q.includes('कमाई') || q.includes('work from home')) {
        assignedAgent = 'सहयोगी (WFH Partner Agent)';
        intent = 'PARTNER_ONBOARDING';
        leadScore = 85;
        replyText = `नमस्ते ${senderName}! 🙏\n\nमैं अनु कृपा ऑनलाइन का पार्टनर मैनेजर हूँ।\nघर बैठे मोबाइल से ₹500 - ₹2,500/दिन कमाने के लिए तुरंत अपना डिजिटल पार्टनर कार्ड प्राप्त करें:\n👉 https://anu-krupa-online.vercel.app/?ref=NEW\n\nकमीशन: सोलर (₹1,500), वेबसाइट (₹500), KCC/पैन (₹50/आर्डर)!`;
      } else if (q.includes('solar') || q.includes('सोलर') || q.includes('78000') || q.includes('सूर्य घर') || q.includes('rooftop')) {
        assignedAgent = 'विक्रय राज (Sales Closer)';
        intent = 'HIGH_VALUE_SOLAR';
        leadScore = 95;
        replyText = `नमस्ते ${senderName} जी! 🙏\n\n☀️ PM सूर्य घर मुफ्त बिजली योजना (₹78,000 सरकारी सब्सिडी):\n• 3 kW ऑन-ग्रिड सिस्टम पर सीधी छूट\n• आवश्यक दस्तावेज़: आधार कार्ड, बिजली बिल, बैंक पासबुक\n• अधिकृत केंद्र: उकेड़िया, जावरा (रतलाम)\n\nआवेदन शुरू करने के लिए अपने बिजली बिल की फोटो भेजें!`;
      } else if (q.includes('kcc') || q.includes('किसान क्रेडिट') || q.includes('कर्ज')) {
        assignedAgent = 'विक्रय राज (Sales Closer)';
        intent = 'CITIZEN_KCC';
        leadScore = 88;
        replyText = `नमस्ते ${senderName} जी! 🙏\n\n🌾 Kisan Credit Card (KCC) सेवा:\n• नया आवेदन व सीमा (Limit) नवीनीकरण\n• आवश्यक दस्तावेज़: खतौनी/पावती, आधार कार्ड, बैंक पासबुक, समग्र आईडी\n• समय: 2 से 3 दिन\n\nदस्तावेज़ की फोटो भेजकर आवेदन करवाएं!`;
      } else {
        assignedAgent = 'दिशा (Triage & Qualifier)';
        intent = 'GENERAL_LOCAL_SERVICE';
        leadScore = 70;
        replyText = `नमस्ते ${senderName} जी! 🙏\n\nअनु कृपा ऑनलाइन (उकेड़िया, जावरा) में आपका स्वागत है।\nहम MPOnline, CSC, पैन कार्ड, आयुष्मान, सोलर योजना व प्रिंटिंग का कार्य करते हैं।\n\nकृपया बताएं हम आपकी क्या मदद कर सकते हैं?`;
      }

      // If Meta credentials are provided in env, dispatch live WhatsApp message
      const WA_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
      const WA_PHONE_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

      let waDispatched = false;
      if (WA_TOKEN && WA_PHONE_ID && senderPhone) {
        try {
          const metaRes = await fetch(`https://graph.facebook.com/v19.0/${WA_PHONE_ID}/messages`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${WA_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messaging_product: 'whatsapp',
              to: senderPhone,
              type: 'text',
              text: { body: replyText },
            }),
          });
          waDispatched = metaRes.ok;
        } catch (e) {
          console.warn('Meta WhatsApp dispatch failed:', e.message);
        }
      }

      return res.status(200).json({
        success: true,
        handledBy: assignedAgent,
        intent,
        leadScore,
        sender: { name: senderName, phone: senderPhone },
        reply: replyText,
        whatsappDispatched: waDispatched,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Multi-Agent Webhook Error:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
