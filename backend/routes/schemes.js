const express = require('express');
const router = express.Router();

// Real-world Indian Government Schemes for Farmers
const schemesData = [
  {
    id: 1,
    title: {
      en: "PM-KISAN Samman Nidhi",
      hi: "पीएम-किसान सम्मान निधि",
      te: "పిఎం-కిసాన్ సమ్మాన్ నిధి",
      pa: "ਪੀਐਮ-ਕਿਸਾਨ ਸਨਮਾਨ ਨਿਧੀ"
    },
    description: {
      en: "Income support of ₹6,000 per year in three equal installments to all landholding farmer families.",
      hi: "सभी भूमिधारक किसान परिवारों को तीन समान किस्तों में प्रति वर्ष ₹6,000 की आय सहायता।",
      te: "భూమి ఉన్న రైతులందరికీ సంవత్సరానికి ₹ 6,000 ఆదాయ మద్దతు మూడు సమాన వాయిదాలలో.",
      pa: "ਸਾਰੇ ਜ਼ਮੀਨ ਵਾਲੇ ਕਿਸਾਨ ਪਰਿਵਾਰਾਂ ਨੂੰ ਹਰ ਸਾਲ ਤਿੰਨ ਬਰਾਬਰ ਕਿਸ਼ਤਾਂ ਵਿੱਚ ₹6,000 ਦੀ ਆਮਦਨ ਸਹਾਇਤਾ।"
    },
    status: { en: "ACTIVE", hi: "सक्रिय", te: "క్రియాశీల", pa: "ਸਰਗਰਮ" },
    benefits: {
      en: "Direct Benefit Transfer (DBT)",
      hi: "प्रत्यक्ष लाभ हस्तांतरण (DBT)",
      te: "డైరెక్ట్ బెనిఫిట్ ట్రాన్స్‌ఫర్ (DBT)",
      pa: "ਸਿੱਧਾ ਲਾਭ ਤਬਾਦਲਾ (DBT)"
    },
    lastUpdate: new Date().toLocaleDateString(),
    link: "https://pmkisan.gov.in/",
    category: { en: "Central", hi: "केंद्रीय", te: "కేంద్ర", pa: "ਕੇਂਦਰੀ" }
  },
  {
    id: 2,
    title: {
      en: "Rythu Bandhu Scheme",
      hi: "रायथू बंधु योजना",
      te: "రైతు బంధు పథకం",
      pa: "ਰਯਥੂ ਬੰਧੂ ਸਕੀਮ"
    },
    description: {
      en: "Telangana government's Investment Support Scheme for Agriculture & Horticulture crops.",
      hi: "कृषि और बागवानी फसलों के लिए तेलंगाना सरकार की निवेश सहायता योजना।",
      te: "వ్యవసాయ మరియు ఉద్యాన పంటల కోసం తెలంగాణ ప్రభుత్వం పెట్టుబడి మద్దతు పథకం.",
      pa: "ਖੇਤੀਬਾੜੀ ਅਤੇ ਬਾਗਬਾਨੀ ਫਸਲਾਂ ਲਈ ਤੇਲੰਗਾਨਾ ਸਰਕਾਰ ਦੀ ਨਿਵੇਸ਼ ਸਹਾਇਤਾ ਸਕੀਮ।"
    },
    status: { en: "DISBURSING", hi: "वितरण जारी", te: "పంపిణీ జరుగుతోంది", pa: "ਵੰਡ ਰਿਹਾ ਹੈ" },
    benefits: {
      en: "₹5,000 per acre per season",
      hi: "₹5,000 प्रति एकड़ प्रति सीजन",
      te: "సీజన్‌కు ఎకరానికి ₹5,000",
      pa: "₹5,000 ਪ੍ਰਤੀ ਏਕੜ ਪ੍ਰਤੀ ਸੀਜ਼ਨ"
    },
    lastUpdate: new Date().toLocaleDateString(),
    link: "https://treasury.telangana.gov.in/",
    category: { en: "State (Telangana)", hi: "राज्य (तेलंगाना)", te: "రాష్ట్రం (తెలంగాణ)", pa: "ਰਾਜ (ਤੇਲੰਗਾਨਾ)" }
  },
  {
    id: 3,
    title: {
      en: "PM Fasal Bima Yojana (PMFBY)",
      hi: "पीएम फसल बीमा योजना (PMFBY)",
      te: "పిఎం ఫసల్ బీమా యోజన (PMFBY)",
      pa: "ਪੀਐਮ ਫਸਲ ਬੀਮਾ ਯੋਜਨਾ (PMFBY)"
    },
    description: {
      en: "Crop insurance scheme to provide financial support to farmers suffering crop loss/damage.",
      hi: "फसल के नुकसान/क्षति से पीड़ित किसानों को वित्तीय सहायता प्रदान करने के लिए फसल बीमा योजना।",
      te: "పంట నష్టం లేదా నష్టపోయిన రైతులకి ఆర్థిక సహాయం అందించడానికి పంట బీమా పథకం.",
      pa: "ਫਸਲ ਦੇ ਨੁਕਸਾਨ ਦਾ ਸਾਹਮਣਾ ਕਰ ਰਹੇ ਕਿਸਾਨਾਂ ਨੂੰ ਵਿੱਤੀ ਸਹਾਇਤਾ ਪ੍ਰਦਾਨ ਕਰਨ ਲਈ ਫਸਲ ਬੀਮਾ ਸਕੀਮ।"
    },
    status: { en: "ENROLLMENT OPEN", hi: "नामांकन खुला है", te: "నమోదు తెరవబడింది", pa: "ਨਾਮਾਂਕਣ ਖੁੱਲ੍ਹਾ ਹੈ" },
    benefits: {
      en: "Low premium, high coverage",
      hi: "कम प्रीमियम, उच्च कवरेज",
      te: "తక్కువ ప్రీమియం, అధిక కవరేజ్",
      pa: "ਘੱਟ ਪ੍ਰੀਮੀਅਮ, ਉੱਚ ਕਵਰੇਜ"
    },
    lastUpdate: new Date().toLocaleDateString(),
    link: "https://pmfby.gov.in/",
    category: { en: "Central", hi: "केंद्रीय", te: "కేంద్ర", pa: "ਕੇਂਦਰੀ" }
  },
  {
    id: 4,
    title: {
      en: "Kisan Credit Card (KCC)",
      hi: "किसान क्रेडिट कार्ड (KCC)",
      te: "కిసాన్ క్రెడిట్ కార్డ్ (KCC)",
      pa: "ਕਿਸਾਨ ਕ੍ਰੈਡਿਟ ਕਾਰਡ (KCC)"
    },
    description: {
      en: "Provides farmers with timely access to credit for their cultivation and other needs.",
      hi: "किसानों को उनकी खेती और अन्य जरूरतों के लिए समय पर ऋण उपलब्ध कराता है।",
      te: "రైతులకు వారి సాగు మరియు ఇతర అవసరాలకు సకాలంలో రుణాలు అందిస్తుంది.",
      pa: "ਕਿਸਾਨਾਂ ਨੂੰ ਉਨ੍ਹਾਂ ਦੀ ਖੇਤੀ ਅਤੇ ਹੋਰ ਲੋੜਾਂ ਲਈ ਸਮੇਂ ਸਿਰ ਕਰਜ਼ੇ ਤੱਕ ਪਹੁੰਚ ਪ੍ਰਦਾਨ ਕਰਦਾ ਹੈ।"
    },
    status: { en: "ONGOING", hi: "जारी है", te: "కొనసాగుతోంది", pa: "ਚੱਲ ਰਿਹਾ ਹੈ" },
    benefits: {
      en: "Low interest loans (4% effective)",
      hi: "कम ब्याज पर ऋण (4% प्रभावी)",
      te: "తక్కువ వడ్డీ రుణాలు (4% ప్రభావవంతమైన)",
      pa: "ਘੱਟ ਵਿਆਜ ਵਾਲੇ ਕਰਜ਼ੇ (4% ਪ੍ਰਭਾਵੀ)"
    },
    lastUpdate: new Date().toLocaleDateString(),
    link: "https://www.myscheme.gov.in/schemes/kcc",
    category: { en: "Banking", hi: "बैंकिंग", te: "బ్యాంకింగ్", pa: "ਬੈਂਕਿੰਗ" }
  },
  {
    id: 5,
    title: {
      en: "PM-Kisan Maandhan Yojana",
      hi: "पीएम-किसान मानधन योजना",
      te: "పిఎం-కిసాన్ మాన్ ధన్ యోజన",
      pa: "ਪੀਐਮ-ਕਿਸਾਨ ਮਾਨਧਾਨ ਯੋਜਨਾ"
    },
    description: {
      en: "Old age pension scheme for all Small and Marginal Farmers (SMF) in the country.",
      hi: "देश के सभी छोटे और सीमांत किसानों (SMF) के लिए वृद्धावस्था पेंशन योजना।",
      te: "దేశంలోని చిన్న మరియు సన్నకారు రైతుల (SMF) కు వృద్ధాప్య పించను పథకం.",
      pa: "ਦੇਸ਼ ਦੇ ਸਾਰੇ ਛੋਟੇ ਅਤੇ ਸੀਮਾਂਤ ਕਿਸਾਨਾਂ (SMF) ਲਈ ਬੁਢਾਪਾ ਪੈਨਸ਼ਨ ਸਕੀਮ।"
    },
    status: { en: "ACTIVE", hi: "सक्रिय", te: "క్రియాశీల", pa: "ਸਰਗਰਮ" },
    benefits: {
      en: "₹3,000 monthly pension after 60",
      hi: "60 वर्ष के बाद ₹3,000 मासिक पेंशन",
      te: "60 ఏళ్ల తర్వాత ₹3,000 నెలవారీ పించను",
      pa: "60 ਸਾਲ ਤੋਂ ਬਾਅਦ ₹3,000 ਮਹੀਨਾਵਾਰ ਪੈਨਸ਼ਨ"
    },
    lastUpdate: new Date().toLocaleDateString(),
    link: "https://maandhan.in/",
    category: { en: "Pension", hi: "पेंशन", te: "పింఛను", pa: "ਪੈਨਸ਼ਨ" }
  }
];

router.get('/schemes', (req, res) => {
  res.json({
    success: true,
    total: schemesData.length,
    data: schemesData
  });
});

module.exports = router;
