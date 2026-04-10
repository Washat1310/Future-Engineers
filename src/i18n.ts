import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "nav.home": "Home",
      "nav.track": "Track Crop",
      "nav.market": "Market Prices",
      "nav.dashboard": "Dashboard",
      "nav.login": "Login",
      "nav.welcome": "Welcome, {{name}}",
      "nav.history": "History",
      "nav.recentCrops": "Recent Crops",
      "nav.noRecentCrops": "No recent crops",
      
      "home.title": "Farm-to-Market",
      "home.titleHighlight": "Tracking.",
      "home.subtitle": "Empowering small-scale farmers with real-time crop tracking, transparent market prices, and verifiable delivery.",
      "home.registerBtn": "Register Crop",
      "home.trackBtn": "Track a Shipment",
      "home.feature1.title": "Live Tracking",
      "home.feature1.desc": "Generate unique QR codes for your crops and track them from harvest to delivery.",
      "home.feature2.title": "Market Intelligence",
      "home.feature2.desc": "Compare static dealer data to find the best value for your produce before selling.",
      "home.feature3.title": "Verified Delivery",
      "home.feature3.desc": "Build trust with buyers through transparent, immutable status updates.",

      "track.title": "Track Your Crop",
      "track.subtitle": "Enter the 6-digit Unique ID to see real-time status.",
      "track.placeholder": "e.g. A1B2C3",
      "track.btn": "Track",
      "track.searching": "Searching...",
      "track.notFound": "No crop found with this ID.",
      "track.qty": "Quantity",
      "track.currentStatus": "Current Status",

      "market.title": "Market Intelligence",
      "market.subtitle": "Compare static dealer prices to find the best value for your produce.",
      "market.pricePerQuintal": "Price per Quintal (100kg)",
      "market.dealerName": "Dealer Name",
      "market.location": "Location",
      "market.price": "Price (₹)",
      "market.recommendation": "Recommendation",
      "market.bestValue": "Best Value",

      "dash.title": "Farmer Dashboard",
      "dash.total": "Total Registered",
      "dash.transit": "In-Transit",
      "dash.delivered": "Delivered",
      "dash.registerTitle": "Register Crop",
      "dash.cropName": "Crop Name",
      "dash.qty": "Quantity (kg)",
      "dash.image": "Crop Image",
      "dash.imageHint": "Click or drag image",
      "dash.saveBtn": "Generate ID & Save",
      "dash.saving": "Saving...",
      "dash.analyzing": "AI Analyzing Image...",
      "dash.qualityGrade": "AI Quality Grade",
      "dash.suggestedPrice": "Est. Value",
      "dash.boost": "(+10% Boost)",
      "dash.myCrops": "My Registered Crops",
      "dash.noCrops": "No crops registered yet.",
      "dash.currentStatus": "Current Status:",
      "dash.registeredOn": "Registered:",

      "login.welcome": "Welcome to KrishiTrack",
      "login.subtitle": "Sign in to manage and track your crops.",
      "login.btn": "Sign in with Google",
      "login.signingIn": "Signing in...",

      "bot.title": "Krishi-Bot",
      "bot.greeting": "Hello! I'm Krishi-Bot. Ask me about crop prices or track your crop ID (e.g., 'Where is A1B2C3?').",
      "bot.placeholder": "Ask about prices or track crop...",
      "bot.fallback": "I'm not sure about that. Please contact your nearest Market Dealer: AgriCorp (North Zone) - 555-0102.",
      "bot.wheatPrices": "Wheat prices: AgriCorp ₹2200, FreshMart ₹2150, Local Mandi ₹2300.",
      "bot.tomatoPrices": "Tomato prices: AgriCorp ₹1500, FreshMart ₹1800, Local Mandi ₹1400.",
      "bot.ricePrices": "Rice prices: AgriCorp ₹4500, FreshMart ₹4200, Local Mandi ₹4350.",
      "bot.priceHelp": "I can help with prices for Wheat, Tomatoes, and Rice. Which one do you need?",
      "bot.cropStatus": "Crop {{id}} ({{name}}) is currently: {{status}}.",
      "bot.cropNotFound": "I couldn't find a crop with ID {{id}}.",
      "bot.cropError": "Sorry, I encountered an error looking up that crop.",
      "bot.needId": "Please provide the 6-digit Crop ID to track it.",

      "status.Shipped": "Shipped",
      "status.Transport": "Transport",
      "status.Warehouse": "Warehouse",
      "status.Delivered": "Delivered",
      "track.date": "Date",
      "track.time": "Time",
      "track.address": "Location"
    }
  },
  hi: {
    translation: {
      "nav.home": "होम",
      "nav.track": "फसल ट्रैक करें",
      "nav.market": "बाजार भाव",
      "nav.dashboard": "डैशबोर्ड",
      "nav.login": "लॉगिन",
      "nav.welcome": "स्वागत है, {{name}}",
      "nav.history": "इतिहास",
      "nav.recentCrops": "हाल की फसलें",
      "nav.noRecentCrops": "कोई हाल की फसल नहीं",
      
      "home.title": "खेत से बाजार तक",
      "home.titleHighlight": "ट्रैकिंग।",
      "home.subtitle": "छोटे किसानों को रीयल-टाइम फसल ट्रैकिंग, पारदर्शी बाजार मूल्य और सत्यापित डिलीवरी के साथ सशक्त बनाना।",
      "home.registerBtn": "फसल पंजीकृत करें",
      "home.trackBtn": "शिपमेंट ट्रैक करें",
      "home.feature1.title": "लाइव ट्रैकिंग",
      "home.feature1.desc": "अपनी फसलों के लिए अद्वितीय क्यूआर कोड जनरेट करें और कटाई से डिलीवरी तक उन्हें ट्रैक करें।",
      "home.feature2.title": "बाजार की जानकारी",
      "home.feature2.desc": "बेचने से पहले अपनी उपज का सर्वोत्तम मूल्य खोजने के लिए डीलर डेटा की तुलना करें।",
      "home.feature3.title": "सत्यापित डिलीवरी",
      "home.feature3.desc": "पारदर्शी, अपरिवर्तनीय स्थिति अपडेट के माध्यम से खरीदारों के साथ विश्वास बनाएं।",

      "track.title": "अपनी फसल ट्रैक करें",
      "track.subtitle": "रीयल-टाइम स्थिति देखने के लिए 6-अंकीय विशिष्ट आईडी दर्ज करें।",
      "track.placeholder": "उदा. A1B2C3",
      "track.btn": "ट्रैक करें",
      "track.searching": "खोज रहा है...",
      "track.notFound": "इस आईडी के साथ कोई फसल नहीं मिली।",
      "track.qty": "मात्रा",
      "track.currentStatus": "वर्तमान स्थिति",

      "market.title": "बाजार की जानकारी",
      "market.subtitle": "अपनी उपज का सर्वोत्तम मूल्य खोजने के लिए डीलर की कीमतों की तुलना करें।",
      "market.pricePerQuintal": "मूल्य प्रति क्विंटल (100 किग्रा)",
      "market.dealerName": "डीलर का नाम",
      "market.location": "स्थान",
      "market.price": "मूल्य (₹)",
      "market.recommendation": "सिफारिश",
      "market.bestValue": "सर्वोत्तम मूल्य",

      "dash.title": "किसान डैशबोर्ड",
      "dash.total": "कुल पंजीकृत",
      "dash.transit": "रास्ते में",
      "dash.delivered": "वितरित",
      "dash.registerTitle": "फसल पंजीकृत करें",
      "dash.cropName": "फसल का नाम",
      "dash.qty": "मात्रा (किग्रा)",
      "dash.image": "फसल की छवि",
      "dash.imageHint": "छवि पर क्लिक करें या खींचें",
      "dash.saveBtn": "आईडी जनरेट करें और सहेजें",
      "dash.saving": "सहेज रहा है...",
      "dash.analyzing": "AI छवि का विश्लेषण कर रहा है...",
      "dash.qualityGrade": "AI गुणवत्ता ग्रेड",
      "dash.suggestedPrice": "अनुमानित मूल्य",
      "dash.boost": "(+10% वृद्धि)",
      "dash.myCrops": "मेरी पंजीकृत फसलें",
      "dash.noCrops": "अभी तक कोई फसल पंजीकृत नहीं है।",
      "dash.currentStatus": "वर्तमान स्थिति:",
      "dash.registeredOn": "पंजीकृत:",

      "login.welcome": "कृषि-ट्रैक में आपका स्वागत है",
      "login.subtitle": "अपनी फसलों का प्रबंधन और ट्रैक करने के लिए साइन इन करें।",
      "login.btn": "Google के साथ साइन इन करें",
      "login.signingIn": "साइन इन हो रहा है...",

      "bot.title": "कृषि-बॉट",
      "bot.greeting": "नमस्ते! मैं कृषि-बॉट हूँ। मुझसे फसल की कीमतों के बारे में पूछें या अपनी फसल आईडी ट्रैक करें (उदा. 'A1B2C3 कहाँ है?')।",
      "bot.placeholder": "कीमतों के बारे में पूछें या फसल ट्रैक करें...",
      "bot.fallback": "मुझे इसके बारे में पक्का नहीं पता। कृपया अपने निकटतम बाजार डीलर से संपर्क करें: एग्रीकॉर्प (उत्तरी क्षेत्र) - 555-0102।",
      "bot.wheatPrices": "गेहूं की कीमतें: एग्रीकॉर्प ₹2200, फ्रेशमार्ट ₹2150, स्थानीय मंडी ₹2300।",
      "bot.tomatoPrices": "टमाटर की कीमतें: एग्रीकॉर्प ₹1500, फ्रेशमार्ट ₹1800, स्थानीय मंडी ₹1400।",
      "bot.ricePrices": "चावल की कीमतें: एग्रीकॉर्प ₹4500, फ्रेशमार्ट ₹4200, स्थानीय मंडी ₹4350।",
      "bot.priceHelp": "मैं गेहूं, टमाटर और चावल की कीमतों में मदद कर सकता हूँ। आपको किसकी आवश्यकता है?",
      "bot.cropStatus": "फसल {{id}} ({{name}}) वर्तमान में है: {{status}}।",
      "bot.cropNotFound": "मुझे आईडी {{id}} वाली कोई फसल नहीं मिली।",
      "bot.cropError": "क्षमा करें, उस फसल को खोजने में एक त्रुटि हुई।",
      "bot.needId": "कृपया इसे ट्रैक करने के लिए 6-अंकीय फसल आईडी प्रदान करें।",

      "status.Shipped": "भेजा गया",
      "status.Transport": "परिवहन",
      "status.Warehouse": "गोदाम",
      "status.Delivered": "वितरित",
      "track.date": "दिनांक",
      "track.time": "समय",
      "track.address": "स्थान"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
