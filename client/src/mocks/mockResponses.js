const RESPONSES = {
  en: {
    default:
      "Bharatpur has a lot to offer — from the riverside ghats to local eateries. What are you most interested in: places to visit, food, or transport?",
    visit:
      "Some popular spots in Bharatpur include Narayani riverside, local temples, and nearby Chitwan National Park for wildlife safaris.",
    food:
      "You should try local Newari and Tharu cuisine — momos, dhido, and ghongi are popular choices around Bharatpur.",
    transport:
      "Bharatpur is well connected by bus from Kathmandu and Pokhara, and local tempos/e-rickshaws are common for getting around the city.",
  },
  ne: {
    default:
      "भरतपुरमा हेर्नुपर्ने धेरै ठाउँहरू छन् — नदी किनारदेखि स्थानीय खाना पसलहरूसम्म। तपाईं कुन कुरामा बढी रुचि राख्नुहुन्छ: घुम्ने ठाउँ, खाना, वा यातायात?",
    visit:
      "भरतपुरका लोकप्रिय ठाउँहरूमा नारायणी नदी किनार, स्थानीय मन्दिरहरू, र नजिकैको चितवन राष्ट्रिय निकुञ्ज पर्दछन्।",
    food:
      "भरतपुर वरपर नेवारी र थारू परिकारहरू जस्तै मःम, ढिडो, र घोंघी लोकप्रिय छन्।",
    transport:
      "भरतपुर काठमाडौं र पोखराबाट बसमार्फत राम्रोसँग जोडिएको छ, र सहरभित्र डुल्नको लागि टेम्पो/ई-रिक्सा प्रचलित छन्।",
  },
  hi: {
    default:
      "भरतपुर में देखने के लिए बहुत कुछ है — नदी किनारे से लेकर स्थानीय खाने की जगहों तक। आप किसमें सबसे ज़्यादा रुचि रखते हैं: घूमने की जगहें, खाना, या परिवहन?",
    visit:
      "भरतपुर के लोकप्रिय स्थानों में नारायणी नदी किनारा, स्थानीय मंदिर, और पास का चितवन राष्ट्रीय उद्यान शामिल हैं।",
    food:
      "आपको नेवारी और थारू व्यंजन जैसे मोमो, ढिडो, और घोंघी ज़रूर आज़माने चाहिए।",
    transport:
      "भरतपुर काठमांडू और पोखरा से बस द्वारा अच्छी तरह जुड़ा हुआ है, और शहर में घूमने के लिए टेम्पो/ई-रिक्शा आम हैं।",
  },
};

export function getMockReply(message, lang = "en") {
  const dict = RESPONSES[lang] || RESPONSES.en;
  const lower = message.toLowerCase();

  if (/visit|place|see|attraction|hera|ghumn/i.test(lower)) return dict.visit;
  if (/food|eat|khana|restaurant|khaddya/i.test(lower)) return dict.food;
  if (/transport|bus|travel|yatayat|reach/i.test(lower)) return dict.transport;
  return dict.default;
}