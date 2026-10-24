// Central Business Configuration for Anu Krupa Online
export const BUSINESS_CONFIG = {
  name: "Anu Krupa Online",
  tagline: "Digital Seva & Multipurpose Services",
  taglineHi: "डिजिटल सेवा एवं मल्टीपर्पस सर्विसेज",
  shortLocation: "Ukediya, Jaora, Ratlam (MP)",
  fullAddressHi: "उकेड़िया, तहसील जावरा, जिला रतलाम (मध्य प्रदेश) - 457226",
  landmark: "मुख्य बस स्टैंड के पास, उकेड़िया",
  workingHoursHi: "सुबह 9:00 बजे - रात 8:00 बजे",
  workingDaysHi: "सोमवार से रविवार (सातों दिन)",
  whatsappNumber: "916263879076",
  whatsappDisplay: "6263879076",
  whatsappChannelUrl: "https://whatsapp.com/channel/placeholder-anukrupa", // Optional follow channel
  servicesCount: "50+",
  establishedYear: "2021",
  callingPolicyNoteHi: "नोट: वेबसाइट पर डायरेक्ट कॉलिंग उपलब्ध नहीं है। सभी पूछताछ व सेवा सहायता सीधे आधिकारिक WhatsApp पर तुरंत उपलब्ध है।",
};

/**
 * Generates an official WhatsApp Click-to-Chat URL with encoded pre-filled text.
 * Strictly adheres to WhatsApp URL encoding without any unauthorized bots.
 */
export function createWhatsAppInquiryLink({ serviceName, selectedOption, customNote, whatsappNumber }) {
  let text = `नमस्ते Anu Krupa Online,\n\n`;

  if (serviceName) {
    text += `मुझे *${serviceName}* सेवा के बारे में जानकारी और सहायता चाहिए।\n`;
  } else {
    text += `मुझे आपकी सेवाओं के संबंध में जानकारी चाहिए।\n`;
  }

  if (selectedOption) {
    text += `• चुना गया विकल्प: *${selectedOption}*\n`;
  }

  if (customNote && customNote.trim() !== '') {
    text += `• ग्राहक टिप्पणी: ${customNote.trim()}\n`;
  }

  text += `\nकृपया आवश्यक दस्तावेज़, प्रक्रिया और फीस की जानकारी प्रदान करें।\nधन्यवाद!`;

  const phone = whatsappNumber || BUSINESS_CONFIG.whatsappNumber;
  const encodedMessage = encodeURIComponent(text);
  return `https://wa.me/${phone}?text=${encodedMessage}`;
}
