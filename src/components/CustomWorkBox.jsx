import React, { useState } from 'react';
import { HelpCircle, MessageCircle, Send, Check } from 'lucide-react';
import { createWhatsAppInquiryLink } from '../data/businessConfig';

const QUICK_TOPICS = [
  "कॉलेज / जॉब ऑनलाइन फॉर्म",
  "राशन कार्ड पात्रता पर्ची",
  "समग्र आईडी e-KYC सुधार",
  "परीक्षा रिजल्ट व एडमिट कार्ड",
  "एफिडेविट / शपथ पत्र टाइपिंग",
  "अन्य कोई विशिष्ट सरकारी कार्य",
];

export default function CustomWorkBox() {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [customText, setCustomText] = useState('');

  const handleWhatsAppSend = (e) => {
    e.preventDefault();
    const queryName = selectedTopic || "कस्टम कार्य पूछताछ";
    const url = createWhatsAppInquiryLink({
      serviceName: queryName,
      customNote: customText,
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="py-8 sm:py-10 bg-slate-100 border-t border-slate-200">
      <div className="fluid-container">
        
        <div className="max-w-3xl mx-auto bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/90">
          
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
              <HelpCircle className="w-6 h-6" />
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                आपका काम सूची में नहीं मिला?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                यदि आपका काम ऊपर दी गई सूची में नहीं दिख रहा है, तो नीचे दिए गए त्वरित विकल्पों पर टैप करें या लिखकर सीधे WhatsApp पर संचालक से पूछें।
              </p>
            </div>
          </div>

          {/* Quick Selection Chips */}
          <div className="mt-5">
            <span className="text-xs font-bold text-slate-700 block mb-2">
              त्वरित विषय चुनें (Tap to Select):
            </span>
            <div className="flex flex-wrap gap-2">
              {QUICK_TOPICS.map((topic, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedTopic(selectedTopic === topic ? '' : topic)}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all tap-bounce ${
                    selectedTopic === topic
                      ? 'bg-orange-500 text-white border-orange-500 font-bold shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {selectedTopic === topic && '✓ '}
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleWhatsAppSend} className="mt-4 space-y-3">
            <div>
              <label htmlFor="custom-task" className="text-xs font-semibold text-slate-700 block mb-1">
                अपने काम के बारे में संक्षेप में लिखें (वैकल्पिक):
              </label>
              <textarea
                id="custom-task"
                rows={2}
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="जैसे: मुझे अपने खेत के पुराने नामांतरण की जानकारी चाहिए..."
                className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-slate-50 text-slate-900"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              <p className="text-[11px] text-slate-500">
                * सभी पूछताछ आधिकारिक WhatsApp पर सीधे संचालक द्वारा जांची जाती हैं।
              </p>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm rounded-xl shadow transition-all flex items-center justify-center gap-2 tap-bounce"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp पर सीधे पूछें</span>
              </button>
            </div>
          </form>

        </div>

      </div>
    </section>
  );
}
