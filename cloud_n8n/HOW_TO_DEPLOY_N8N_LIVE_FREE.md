# ☁️ n8n Live Cloud 24/7 Free Setup Guide (Zero PC Required)

> **PC बंद रहेगा तब भी 24 घंटे सातों दिन AI सेल्स एजेंट क्लाउड पर लाइव काम करेगा!**
> कोई क्रेडिट कार्ड नहीं चाहिए, 100% फ्री चलेगा।

---

## 🚀 विकल्प 1: Hugging Face Spaces (सबसे बेस्ट और 100% फ्री हमेशा के लिए)
Hugging Face आपको **16GB RAM और 2 vCPU क्लाउड सर्वर बिल्कुल फ्री** देता है। इसमें n8n कभी बंद नहीं होता और कोई क्रेडिट कार्ड नहीं मांगता।

### सिर्फ 2 मिनट का प्रोसेस:
1. **[huggingface.co](https://huggingface.co/join)** पर फ्री अकाउंट बनाएं।
2. लॉगिन करने के बाद **[New Space](https://huggingface.co/new-space)** पर जाएं:
   - **Space name**: `anukrupa-agents`
   - **Space SDK**: **Docker** चुनें (Blank)
   - **Space Hardware**: Free (2 vCPU, 16GB RAM)
   - **Visibility**: Public
   - **Create Space** बटन दबाएं।
3. अब Space के **Files** टैब में जाकर `Dockerfile` और `README.md` बनाएं (ये दोनों फाइलें आपके प्रोजेक्ट के `cloud_n8n/` फोल्डर में तैयार रखी हैं):
   - **Dockerfile** में यह पेस्ट करें:
     ```dockerfile
     FROM n8nio/n8n:latest
     USER root
     RUN mkdir -p /home/node/.n8n && chown -R node:node /home/node/.n8n
     USER node
     ENV N8N_PORT=7860
     ENV N8N_HOST=0.0.0.0
     ENV N8N_PROTOCOL=https
     ENV GENERIC_TIMEZONE=Asia/Kolkata
     ENV TZ=Asia/Kolkata
     EXPOSE 7860
     CMD ["n8n", "start"]
     ```
   - **README.md** में यह पेस्ट करें:
     ```yaml
     ---
     title: Anu Krupa n8n Multi-Agent Cloud
     emoji: ⚡
     colorFrom: blue
     colorTo: indigo
     sdk: docker
     app_port: 7860
     pinned: false
     ---
     ```
4. **Commit new file** पर क्लिक करें।
5. 60 सेकंड में आपका n8n क्लाउड पर लाइव हो जाएगा! आपको ऊपर URL मिलेगा:  
   👉 `https://<your-username>-anukrupa-agents.hf.space`

---

## ⚡ विकल्प 2: Render.com 1-Click Cloud (100% Free Docker)
1. **[render.com](https://dashboard.render.com)** पर जाएं और GitHub से लॉगिन करें।
2. **New +** बटन दबाएं ➔ **Web Service** चुनें।
3. **"Existing image"** चुनें और यह इमेज नाम डालें:  
   `docker.io/n8nio/n8n:latest`
4. सेटिंग्स:
   - **Name**: `anukrupa-n8n`
   - **Region**: Singapore
   - **Instance Type**: **Free**
   - **Environment Variables**:
     - `N8N_PORT` = `10000`
     - `GENERIC_TIMEZONE` = `Asia/Kolkata`
5. **Create Web Service** पर क्लिक करें।  
   2 मिनट में आपको लाइव URL मिलेगा: `https://anukrupa-n8n.onrender.com`

---

## 🎯 क्लाउड n8n में वर्कफ़्लो कैसे इम्पोर्ट करें:
1. अपने क्लाउड n8n लिंक को खोलें और पहली बार ईमेल/पासवर्ड सेट करके लॉगिन करें।
2. ऊपर दाएँ कोने में **Workflows** ➔ **Import from File** पर क्लिक करें।
3. अपने कंप्यूटर से यह फ़ाइल सेलेक्ट करें:  
   `n8n_workflows/anu_krupa_multi_agent_workforce.json`
4. वर्कफ़्लो के पहले नोड (**WhatsApp Webhook**) पर क्लिक करके उसका **Production Webhook URL** कॉपी करें।
5. यह URL अपने **Meta WhatsApp Cloud API / WACRM** में डाल दें!

---

## 💡 सबसे ज़रूरी बात: आपकी वेबसाइट का AI एजेंट पहले से क्लाउड पर 24/7 लाइव है!
आपको अलग से सर्वर चलाने की भी ज़रूरत नहीं है अगर आप तुरंत शुरू करना चाहते हैं:
- आपकी लाइव वेबसाइट पर **Vercel Serverless Webhook** पहले से 24/7 चालू है:  
  👉 `https://anu-krupa-online.vercel.app/api/agent-webhook`
- यह बिना किसी PC के, Meta WhatsApp से सीधे कनेक्ट होकर 5 AI एजेंट्स (विक्रय राज, दिशा, सहयोगी, संजीवनी, मुनीम जी) को फ्री Groq AI से रन कर रहा है!
