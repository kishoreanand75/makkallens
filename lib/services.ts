import { moreServices } from "./services-more";
// Service guide data. `lastVerified: null` means the content is a draft that has NOT yet been
// checked against the official portal – the UI shows a "pending verification" badge for it.
// Before launch every entry must be checked by a human and given a real ISO date.

export type L = { ta: string; en: string };

export type CategoryId = "identity" | "certificates" | "driving" | "education" | "land" | "pension" | "business" | "utilities";

export interface Category {
  id: CategoryId;
  name: L;
  blurb: L;
  live: boolean;
}

export interface Step {
  title: L;
  detail: L;
}

export interface Service {
  slug: string;
  category: CategoryId;
  name: L;
  short: L;
  authority: L;
  level: "central" | "state";
  scope: L;
  officialUrl: string;
  officialLabel: string;
  who: L;
  documents: { name: L; note?: L }[];
  steps: Step[];
  fees: L;
  time: L;
  offline: L;
  tips: L[];
  faqs: { q: L; a: L }[];
  keywords: string[];
  lastVerified: string | null;
}

export const categories: Category[] = [
  {
    id: "identity",
    name: { ta: "அடையாள ஆவணங்கள்", en: "Identity documents" },
    blurb: { ta: "ஆதார், பான், வாக்காளர் அட்டை", en: "Aadhaar, PAN, voter ID" },
    live: true,
  },
  {
    id: "certificates",
    name: { ta: "சான்றிதழ்கள்", en: "Certificates" },
    blurb: { ta: "பிறப்பு, சாதி, வருமானம், இருப்பிடம்", en: "Birth, community, income, nativity" },
    live: true,
  },
  {
    id: "driving",
    name: { ta: "வாகனம் & ஓட்டுநர் உரிமம்", en: "Driving & vehicles" },
    blurb: { ta: "லைசென்ஸ், RC, வாகனப் பதிவு", en: "Licence, RC, registration" },
    live: true,
  },
  {
    id: "education",
    name: { ta: "கல்வி", en: "Education" },
    blurb: { ta: "மதிப்பெண் சான்று, உதவித்தொகை", en: "Mark sheets, scholarships" },
    live: false,
  },
  {
    id: "land",
    name: { ta: "நிலம் & சொத்து", en: "Land & property" },
    blurb: { ta: "பட்டா, சிட்டா, வில்லங்கச் சான்று", en: "Patta, chitta, encumbrance" },
    live: true,
  },
  {
    id: "utilities",
    name: { ta: "கட்டணங்கள் & பயன்பாடு", en: "Bills & utilities" },
    blurb: { ta: "மின் கட்டணம்", en: "Electricity bill" },
    live: true,
  },
  {
    id: "pension",
    name: { ta: "ஓய்வூதியம் & நலத்திட்டம்", en: "Pension & welfare" },
    blurb: { ta: "முதியோர் உதவித்தொகை, PF", en: "Old-age pension, PF" },
    live: false,
  },
  {
    id: "business",
    name: { ta: "தொழில் & வரி", en: "Business & tax" },
    blurb: { ta: "GST, MSME, கடை உரிமம்", en: "GST, MSME, shop licence" },
    live: false,
  },
];

const baseServices: Service[] = [
  {
    slug: "birth-certificate",
    category: "certificates",
    name: { ta: "பிறப்புச் சான்றிதழ்", en: "Birth certificate" },
    short: {
      ta: "குழந்தை பிறந்த பதிவு மற்றும் சான்றிதழ் பெறுவது / பதிவிறக்குவது",
      en: "Register a birth and get or download the certificate",
    },
    authority: {
      ta: "உள்ளாட்சி அமைப்பு (மாநகராட்சி / நகராட்சி / ஊராட்சி) – பிறப்பு இறப்பு பதிவாளர்",
      en: "Local body (Corporation / Municipality / Panchayat) – Registrar of Births & Deaths",
    },
    level: "state",
    scope: { ta: "தமிழ்நாடு", en: "Tamil Nadu" },
    officialUrl: "https://crstn.in",
    officialLabel: "crstn.in",
    who: {
      ta: "குழந்தையின் பெற்றோர் அல்லது பாதுகாவலர். பிறந்து 21 நாட்களுக்குள் பதிவு செய்வது இலவசம்.",
      en: "A parent or guardian of the child. Registering within 21 days of birth is free.",
    },
    documents: [
      {
        name: { ta: "மருத்துவமனை பிறப்பு அறிக்கை / டிஸ்சார்ஜ் சுருக்கம்", en: "Hospital birth report / discharge summary" },
        note: { ta: "வீட்டில் பிறந்திருந்தால் கிராம நிர்வாக அலுவலர் சான்று", en: "For a home birth: a letter from the Village Administrative Officer" },
      },
      { name: { ta: "பெற்றோரின் ஆதார் அல்லது அடையாள அட்டை", en: "Parents' Aadhaar or other ID" } },
      { name: { ta: "பெற்றோர் திருமணச் சான்று (கேட்டால்)", en: "Parents' marriage proof (if asked)" } },
      { name: { ta: "21 நாட்களுக்குப் பிறகு எனில்: தாமதப் பதிவு விண்ணப்பம்", en: "After 21 days: a late-registration application" } },
    ],
    steps: [
      {
        title: { ta: "மருத்துவமனையில் பதிவை உறுதி செய்யுங்கள்", en: "Confirm registration at the hospital" },
        detail: {
          ta: "அரசு மற்றும் பெரும்பாலான தனியார் மருத்துவமனைகள் பிறப்பை உள்ளாட்சி பதிவாளருக்கு அனுப்பும். டிஸ்சார்ஜ் ஆகும்போது 'பிறப்பு பதிவு எண்' கேட்டு வாங்குங்கள்.",
          en: "Government and most private hospitals send the birth to the local registrar. At discharge, ask for the birth registration number.",
        },
      },
      {
        title: { ta: "வீட்டில் பிறந்திருந்தால் உள்ளாட்சி அலுவலகம் செல்லுங்கள்", en: "For a home birth, visit the local body office" },
        detail: {
          ta: "உங்கள் பகுதி மாநகராட்சி / நகராட்சி / ஊராட்சி அலுவலகத்தில் பிறப்புப் பதிவு படிவம் பெற்று நிரப்பி, ஆவணங்களுடன் கொடுங்கள்.",
          en: "Collect the birth registration form from your Corporation, Municipality or Panchayat office, fill it in and submit with documents.",
        },
      },
      {
        title: { ta: "இணையத்தில் சான்றிதழைத் தேடுங்கள்", en: "Search for the certificate online" },
        detail: {
          ta: "அதிகாரப்பூர்வ தளத்தில் பிறப்புச் சான்றிதழ் தேடல் பகுதியைத் திறந்து, பதிவு எண் அல்லது குழந்தையின் பிறந்த தேதி, பாலினம், பெயர் விவரங்களை உள்ளிடுங்கள்.",
          en: "On the official site open the birth certificate search and enter the registration number, or the child's date of birth, gender and name.",
        },
      },
      {
        title: { ta: "பதிவிறக்கி அச்சிடுங்கள்", en: "Download and print" },
        detail: {
          ta: "பதிவு கிடைத்தால் சான்றிதழைப் பதிவிறக்கலாம். தேவைப்பட்டால் கட்டணம் செலுத்துங்கள். கிடைக்கவில்லை எனில் உள்ளாட்சி அலுவலகத்தைத் தொடர்பு கொள்ளுங்கள்.",
          en: "If the record is found you can download the certificate, paying a fee if one is asked. If it is not found, contact the local body office.",
        },
      },
      {
        title: { ta: "பெயர் திருத்தம் தேவையா?", en: "Need a name correction?" },
        detail: {
          ta: "பெயர் அல்லது தகவலில் பிழை இருந்தால், அதே உள்ளாட்சி அலுவலகத்தில் திருத்த விண்ணப்பம் கொடுங்கள். குழந்தைக்குப் பெயர் வைத்த பின் பெயரைச் சேர்க்கவும் முடியும்.",
          en: "If a name or detail is wrong, submit a correction request at the same local body office. The child's name can also be added later.",
        },
      },
    ],
    fees: {
      ta: "21 நாட்களுக்குள் பதிவு இலவசம். தாமதமானால் சிறு கட்டணம் மற்றும் அதிகாரியின் அனுமதி தேவைப்படலாம்.",
      en: "Free if registered within 21 days. Later registration may need a small fee and an officer's permission.",
    },
    time: {
      ta: "பதிவான பிறகு சான்றிதழ் பொதுவாக சில நாட்களில் கிடைக்கும்.",
      en: "Once registered, the certificate is usually available within a few days.",
    },
    offline: {
      ta: "உங்கள் மாநகராட்சி / நகராட்சி / ஊராட்சி பிறப்பு இறப்புப் பதிவாளர் அலுவலகம், அல்லது அருகிலுள்ள இ-சேவை மையம்.",
      en: "Your Corporation / Municipality / Panchayat birth & death registrar office, or the nearest e-Sevai centre.",
    },
    tips: [
      {
        ta: "ஆதார், பள்ளிச் சேர்க்கை, பாஸ்போர்ட் எல்லாவற்றுக்கும் இது அடிப்படை ஆவணம். 21 நாட்களுக்குள் பதிவு செய்தால் பிறகு அலைச்சல் குறையும்.",
        en: "It is the base document for Aadhaar, school admission and passport. Registering within 21 days saves a lot of running around later.",
      },
      {
        ta: "பெயர் வைக்கும் முன் குழந்தை பிறந்தால் பெயர் இல்லாமலே பதிவு செய்து, பிறகு பெயரைச் சேர்க்கலாம்.",
        en: "You can register the birth before naming the child and add the name afterwards.",
      },
    ],
    faqs: [
      {
        q: { ta: "பழைய (பல ஆண்டுகள் முன்) பிறப்புக்குச் சான்றிதழ் கிடைக்குமா?", en: "Can I get a certificate for a birth from many years ago?" },
        a: {
          ta: "பதிவு இருந்தால் கிடைக்கும். பதிவே இல்லாத பழைய பிறப்புகளுக்கு உள்ளாட்சி அலுவலகம் மற்றும் வருவாய் கோட்டாட்சியர் வழியாக தாமதப் பதிவு நடைமுறை உண்டு.",
          en: "Yes, if a record exists. For old births never registered, there is a late-registration process through the local body and the Revenue Divisional Officer.",
        },
      },
    ],
    keywords: ["birth", "born", "pirappu", "pirappu sandrithal", "பிறப்பு", "பிறப்புச்", "சான்றிதழ்", "birth certificate", "குழந்தை", "baby"],
    lastVerified: null,
  },
  {
    slug: "aadhaar-card",
    category: "identity",
    name: { ta: "ஆதார் அட்டை", en: "Aadhaar card" },
    short: {
      ta: "ஆதார் பதிவிறக்கம், முகவரி / தகவல் புதுப்பிப்பு, புதிய பதிவு",
      en: "Download e-Aadhaar, update details, new enrolment",
    },
    authority: { ta: "இந்திய தனித்துவ அடையாள ஆணையம் (UIDAI)", en: "Unique Identification Authority of India (UIDAI)" },
    level: "central",
    scope: { ta: "இந்தியா முழுவதும்", en: "All India" },
    officialUrl: "https://myaadhaar.uidai.gov.in",
    officialLabel: "myaadhaar.uidai.gov.in",
    who: {
      ta: "இந்தியாவில் வசிக்கும் எவரும், குழந்தைகள் உட்பட. பதிவிறக்க, ஆதாருடன் இணைந்த மொபைல் எண் வேண்டும்.",
      en: "Any resident of India, including children. To download, you need the mobile number linked to your Aadhaar.",
    },
    documents: [
      { name: { ta: "ஆதார் எண் (12 இலக்கம்) அல்லது VID", en: "Aadhaar number (12 digits) or VID" } },
      { name: { ta: "ஆதாருடன் இணைந்த மொபைல் எண் (OTP பெற)", en: "Mobile number linked to Aadhaar (to receive OTP)" } },
      {
        name: { ta: "முகவரி மாற்ற: முகவரிச் சான்று ஆவணம்", en: "For address update: a proof-of-address document" },
        note: { ta: "UIDAI ஏற்கும் ஆவணப் பட்டியல் அதிகாரப்பூர்வ தளத்தில் உள்ளது", en: "The list of accepted documents is on the UIDAI site" },
      },
      { name: { ta: "புதிய பதிவு: பிறப்பு / அடையாள / முகவரிச் சான்றுகள்", en: "New enrolment: proof of identity, birth and address" } },
    ],
    steps: [
      {
        title: { ta: "அதிகாரப்பூர்வ தளத்தைத் திறக்கவும்", en: "Open the official site" },
        detail: {
          ta: "myaadhaar.uidai.gov.in என்ற முகவரியை நேரடியாக உலாவியில் தட்டச்சு செய்யுங்கள். தேடலில் வரும் பிற தளங்களில் ஆதார் எண்ணைக் கொடுக்காதீர்கள்.",
          en: "Type myaadhaar.uidai.gov.in directly in the browser. Do not enter your Aadhaar number on other sites that appear in search results.",
        },
      },
      {
        title: { ta: "'Download Aadhaar' தேர்ந்தெடுக்கவும்", en: "Choose 'Download Aadhaar'" },
        detail: {
          ta: "ஆதார் எண், VID அல்லது பதிவு எண் மூன்றில் ஒன்றைத் தேர்ந்தெடுத்து, கேப்ச்சாவை நிரப்பி OTP கேளுங்கள்.",
          en: "Pick Aadhaar number, VID or enrolment ID, fill the captcha and request an OTP.",
        },
      },
      {
        title: { ta: "OTP உள்ளிட்டு பதிவிறக்கவும்", en: "Enter the OTP and download" },
        detail: {
          ta: "மொபைலுக்கு வந்த OTP-ஐ உள்ளிடவும். PDF திறக்கும் கடவுச்சொல்: உங்கள் பெயரின் முதல் 4 எழுத்துகள் (ஆங்கிலப் பெரிய எழுத்தில்) + பிறந்த ஆண்டு (YYYY).",
          en: "Enter the OTP sent to your mobile. The PDF password is the first 4 letters of your name in capitals plus your birth year (YYYY).",
        },
      },
      {
        title: { ta: "முகவரி மட்டும் மாற்ற வேண்டுமா?", en: "Only the address needs changing?" },
        detail: {
          ta: "myAadhaar-ல் உள்நுழைந்து 'Update Address' மூலம் ஆவணத்தைப் பதிவேற்றி ஆன்லைனிலேயே மாற்றலாம்.",
          en: "Log in to myAadhaar and use 'Update Address' to upload a document and change it online.",
        },
      },
      {
        title: { ta: "பெயர் / பிறந்த தேதி / கைரேகை / புகைப்படம் மாற்றம்", en: "Name, date of birth, biometrics or photo changes" },
        detail: {
          ta: "இவற்றுக்கு ஆதார் சேவை மையம் அல்லது அஞ்சலகத்தில் நேரில் செல்ல வேண்டும். அதிகாரப்பூர்வ தளத்தில் 'Book an Appointment' மூலம் நேரம் பதிவு செய்யுங்கள்.",
          en: "These need an in-person visit to an Aadhaar Seva Kendra or post office. Book an appointment on the official site.",
        },
      },
    ],
    fees: {
      ta: "e-Aadhaar பதிவிறக்கம் இலவசம். மையத்தில் தகவல் புதுப்பிப்புக்கு UIDAI நிர்ணயித்த கட்டணம் உண்டு – தற்போதைய தொகையை UIDAI தளத்தில் பாருங்கள்.",
      en: "Downloading e-Aadhaar is free. Updates at a centre carry a fee set by UIDAI – check the current amount on the UIDAI site.",
    },
    time: {
      ta: "பதிவிறக்கம் உடனடி. புதுப்பிப்பு பொதுவாக சில நாட்களில் முடியும்; URN எண் மூலம் நிலை பார்க்கலாம்.",
      en: "Download is instant. Updates usually finish in a few days; track with the URN number.",
    },
    offline: {
      ta: "அருகிலுள்ள ஆதார் சேவை மையம், அஞ்சலகம் அல்லது இ-சேவை மையம்.",
      en: "Nearest Aadhaar Seva Kendra, post office or e-Sevai centre.",
    },
    tips: [
      {
        ta: "ஆதார் எண், OTP-ஐ யாரிடமும் பகிராதீர்கள். UIDAI ஒருபோதும் தொலைபேசியில் OTP கேட்காது.",
        en: "Never share your Aadhaar number or OTP. UIDAI never asks for an OTP over the phone.",
      },
      {
        ta: "மொபைல் எண் ஆதாருடன் இணையவில்லை என்றால் முதலில் மையத்தில் அதை இணைக்க வேண்டும்.",
        en: "If your mobile is not linked to Aadhaar, you must first link it at a centre.",
      },
    ],
    faqs: [
      {
        q: { ta: "மொபைல் எண் மாறிவிட்டது, ஆதார் பதிவிறக்க முடியுமா?", en: "My mobile number changed. Can I still download Aadhaar?" },
        a: {
          ta: "OTP பழைய எண்ணுக்குத்தான் செல்லும். புதிய எண்ணைப் புதுப்பிக்க ஆதார் சேவை மையம் செல்ல வேண்டும்.",
          en: "The OTP goes to the old number. You need to visit an Aadhaar centre to update your mobile number.",
        },
      },
    ],
    keywords: ["aadhaar", "aadhar", "adhar", "uidai", "ஆதார்", "ஆதார்கார்டு", "eaadhaar", "e-aadhaar", "aadhaar download"],
    lastVerified: null,
  },
  {
    slug: "pan-card",
    category: "identity",
    name: { ta: "பான் கார்டு", en: "PAN card" },
    short: {
      ta: "புதிய பான், இ-பான் பதிவிறக்கம், திருத்தம்",
      en: "New PAN, instant e-PAN, correction",
    },
    authority: { ta: "வருமான வரித் துறை", en: "Income Tax Department" },
    level: "central",
    scope: { ta: "இந்தியா முழுவதும்", en: "All India" },
    officialUrl: "https://www.incometax.gov.in",
    officialLabel: "incometax.gov.in",
    who: {
      ta: "வரி செலுத்துபவர், வங்கிக் கணக்கு, பெரிய பரிவர்த்தனை செய்பவர் – 18 வயதுக்குக் குறைந்தவர்களுக்கும் பெற்றோர் வழியாக எடுக்கலாம்.",
      en: "Taxpayers and anyone doing larger financial transactions. Minors can have one through a parent.",
    },
    documents: [
      { name: { ta: "ஆதார் எண் (ஆதாருடன் மொபைல் இணைந்திருக்க வேண்டும்)", en: "Aadhaar number (with a linked mobile)" } },
      { name: { ta: "அடையாளச் சான்று, முகவரிச் சான்று, பிறந்த தேதிச் சான்று (ஆதார் இல்லையெனில்)", en: "Proof of identity, address and date of birth (if not using Aadhaar)" } },
      { name: { ta: "புகைப்படம், கையொப்பம் (காகித முறை எனில்)", en: "Photograph and signature (for the paper route)" } },
    ],
    steps: [
      {
        title: { ta: "ஏற்கனவே பான் இல்லையா என்று பாருங்கள்", en: "Check that you do not already have a PAN" },
        detail: {
          ta: "ஒருவருக்கு ஒரு பான் மட்டுமே இருக்கலாம். incometax.gov.in-ல் 'Know your PAN' மூலம் சரிபாருங்கள்.",
          en: "A person can hold only one PAN. Use 'Know your PAN' on incometax.gov.in to check.",
        },
      },
      {
        title: { ta: "இ-பான் (உடனடி) முயலுங்கள்", en: "Try instant e-PAN" },
        detail: {
          ta: "ஆதார் மொபைல் இணைந்திருந்தால், incometax.gov.in-ல் 'Instant e-PAN' தேர்ந்தெடுத்து ஆதார் OTP மூலம் PDF வடிவ இ-பான் இலவசமாகப் பெறலாம்.",
          en: "If your mobile is linked to Aadhaar, choose 'Instant e-PAN' on incometax.gov.in and get a PDF e-PAN with an Aadhaar OTP, free of charge.",
        },
      },
      {
        title: { ta: "அல்லது முழு விண்ணப்பம் (படிவம் 49A)", en: "Or file the full application (Form 49A)" },
        detail: {
          ta: "அங்கீகரிக்கப்பட்ட சேவை வழங்குநர்களான NSDL அல்லது UTIITSL தளத்தில் ஆன்லைன் விண்ணப்பம் செய்து, e-KYC / e-Sign செய்யுங்கள். அட்டை வீட்டுக்கு வர வேண்டுமெனில் கட்டணம் செலுத்துங்கள்.",
          en: "Apply online on the authorised providers NSDL or UTIITSL and complete e-KYC / e-Sign. Pay the fee if you want a physical card posted to you.",
        },
      },
      {
        title: { ta: "ஒப்புகை எண்ணைச் சேமியுங்கள்", en: "Save the acknowledgement number" },
        detail: {
          ta: "விண்ணப்பத்துக்குப் பிறகு கிடைக்கும் ஒப்புகை எண்ணை வைத்து நிலையை இதே தளங்களில் பார்க்கலாம்.",
          en: "Keep the acknowledgement number you get after applying; use it to track status on the same site.",
        },
      },
      {
        title: { ta: "பெயர் / முகவரி திருத்தம்", en: "Name or address correction" },
        detail: {
          ta: "'Changes or correction in PAN data' தேர்ந்தெடுத்து திருத்தப் படிவத்தை ஆதரவு ஆவணங்களுடன் சமர்ப்பிக்கவும்.",
          en: "Choose 'Changes or correction in PAN data' and submit the correction form with supporting documents.",
        },
      },
    ],
    fees: {
      ta: "இ-பான் இலவசம். இ-பான் மட்டும் (PDF) அல்லது பான் அட்டை அச்சிட்டு அஞ்சலில் பெற சேவை வழங்குநர் கட்டணம் உண்டு – தற்போதைய தொகையை அவர்கள் தளத்தில் பார்க்கவும்.",
      en: "Instant e-PAN is free. A physical card by post carries a provider fee – check the current amount on the provider's site.",
    },
    time: {
      ta: "இ-பான் சில நிமிடங்களிலிருந்து சில நாட்கள் வரை. அட்டை அஞ்சலில் வர சில நாட்கள் ஆகலாம்.",
      en: "Instant e-PAN takes minutes to a few days. The physical card can take a few more days by post.",
    },
    offline: {
      ta: "அருகிலுள்ள PAN சேவை மையம் அல்லது அங்கீகரிக்கப்பட்ட இ-சேவை / CSC மையம்.",
      en: "Nearest PAN service centre or an authorised e-Sevai / CSC centre.",
    },
    tips: [
      {
        ta: "'பான் உடனே வேண்டும், ₹500' என்று கூறும் தனி நபர்கள் அல்லது தளங்களை நம்பாதீர்கள் – அதிகாரப்பூர்வ வழி மிகக் குறைந்த செலவு அல்லது இலவசம்.",
        en: "Do not trust agents or sites charging large amounts for a 'quick PAN' – the official route is free or low cost.",
      },
    ],
    faqs: [
      {
        q: { ta: "ஆதார்-பான் இணைப்பு அவசியமா?", en: "Is PAN–Aadhaar linking required?" },
        a: {
          ta: "வருமான வரித் துறை விதிகளின்படி இணைக்க வேண்டும். நிலையை incometax.gov.in-ல் 'Link Aadhaar Status' மூலம் பார்க்கலாம்.",
          en: "Under Income Tax rules it must be linked. Check the status under 'Link Aadhaar Status' on incometax.gov.in.",
        },
      },
    ],
    keywords: ["pan", "pan card", "pancard", "epan", "e-pan", "nsdl", "பான்", "பான்கார்டு", "income tax"],
    lastVerified: null,
  },
  {
    slug: "driving-licence",
    category: "driving",
    name: { ta: "ஓட்டுநர் உரிமம் (லைசென்ஸ்)", en: "Driving licence" },
    short: {
      ta: "லேர்னர்ஸ் உரிமம், நிரந்தர உரிமம், புதுப்பிப்பு",
      en: "Learner's licence, permanent licence, renewal",
    },
    authority: { ta: "சாலைப் போக்குவரத்து & நெடுஞ்சாலை அமைச்சகம் – வட்டாரப் போக்குவரத்து அலுவலகம் (RTO)", en: "Ministry of Road Transport & Highways – Regional Transport Office (RTO)" },
    level: "central",
    scope: { ta: "இந்தியா முழுவதும் (மாநில RTO வழியாக)", en: "All India (via state RTOs)" },
    officialUrl: "https://sarathi.parivahan.gov.in",
    officialLabel: "sarathi.parivahan.gov.in",
    who: {
      ta: "18 வயது நிரம்பியவர் (கியர் இல்லாத 50cc-க்குக் குறைந்த வாகனத்துக்கு 16 வயது). லேர்னர்ஸ் உரிமம் முதலில் தேவை.",
      en: "Age 18 or above (16 for gearless vehicles under 50cc). A learner's licence comes first.",
    },
    documents: [
      { name: { ta: "வயதுச் சான்று (பிறப்புச் சான்றிதழ் / பள்ளிச் சான்றிதழ் / ஆதார்)", en: "Age proof (birth certificate / school certificate / Aadhaar)" } },
      { name: { ta: "முகவரிச் சான்று (ஆதார் / ரேஷன் கார்டு / மின் கட்டண ரசீது)", en: "Address proof (Aadhaar / ration card / electricity bill)" } },
      { name: { ta: "பாஸ்போர்ட் அளவு புகைப்படம்", en: "Passport-size photograph" } },
      {
        name: { ta: "மருத்துவச் சான்று (படிவம் 1A) – வணிக வாகனம் அல்லது 40 வயதுக்கு மேல் எனில்", en: "Medical certificate (Form 1A) – for commercial vehicles or above age 40" },
      },
      { name: { ta: "கையொப்பம்", en: "Signature" } },
    ],
    steps: [
      {
        title: { ta: "Sarathi தளத்தில் உங்கள் மாநிலத்தைத் தேர்ந்தெடுக்கவும்", en: "Select your state on the Sarathi site" },
        detail: {
          ta: "sarathi.parivahan.gov.in திறந்து தமிழ்நாடு (அல்லது உங்கள் மாநிலம்) தேர்ந்தெடுங்கள். 'Apply for Learner Licence' தேர்வு செய்யுங்கள்.",
          en: "Open sarathi.parivahan.gov.in and pick your state. Choose 'Apply for Learner Licence'.",
        },
      },
      {
        title: { ta: "படிவம் நிரப்பி ஆவணங்களை இணைக்கவும்", en: "Fill the form and attach documents" },
        detail: {
          ta: "தனிப்பட்ட விவரங்கள், வாகன வகை, ஆவணங்களின் ஸ்கேன், புகைப்படம், கையொப்பத்தைப் பதிவேற்றுங்கள். பல மாநிலங்களில் ஆதார் அங்கீகாரம் இருந்தால் RTO செல்லாமலே முடியும்.",
          en: "Enter your details and vehicle class, then upload scans, photo and signature. In many states, Aadhaar authentication lets you finish without visiting the RTO.",
        },
      },
      {
        title: { ta: "கட்டணம் செலுத்தி தேர்வுக்கு நேரம் பதிவு செய்யவும்", en: "Pay the fee and book the test slot" },
        detail: {
          ta: "ஆன்லைனில் கட்டணம் செலுத்தி, லேர்னர்ஸ் தேர்வுக்கான நேரத்தைத் தேர்ந்தெடுங்கள். சில மாநிலங்களில் வீட்டிலிருந்தே ஆன்லைன் தேர்வு எழுதலாம்.",
          en: "Pay online and choose a slot for the learner's test. Some states allow taking the test online from home.",
        },
      },
      {
        title: { ta: "நிரந்தர உரிமத்துக்கு விண்ணப்பிக்கவும்", en: "Apply for the permanent licence" },
        detail: {
          ta: "லேர்னர்ஸ் உரிமம் பெற்ற 30 நாட்களுக்குப் பிறகு (செல்லுபடியாகும் காலத்துக்குள்) 'Apply for Driving Licence' மூலம் விண்ணப்பித்து ஓட்டுநர் தேர்வுக்கு நேரம் பதிவு செய்யுங்கள்.",
          en: "After 30 days of the learner's licence (and within its validity), use 'Apply for Driving Licence' and book the driving test slot.",
        },
      },
      {
        title: { ta: "RTO-வில் ஓட்டுநர் தேர்வு", en: "Driving test at the RTO" },
        detail: {
          ta: "குறிப்பிட்ட நாளில் வாகனத்துடன் மற்றும் அசல் ஆவணங்களுடன் RTO செல்லுங்கள். தேர்ச்சி பெற்றால் உரிமம் அஞ்சலில் வரும்; நிலையை Sarathi-ல் பார்க்கலாம்.",
          en: "Go to the RTO on the day with a vehicle and original documents. If you pass, the licence comes by post; track status on Sarathi.",
        },
      },
    ],
    fees: {
      ta: "வாகன வகையைப் பொறுத்து கட்டணம் மாறும் (லேர்னர்ஸ், தேர்வு, உரிமம் தனித்தனி). தற்போதைய தொகை விண்ணப்பத்தின் போது Sarathi-ல் காட்டப்படும்.",
      en: "Fees vary by vehicle class (learner's, test and licence are charged separately). The current amount is shown on Sarathi while applying.",
    },
    time: {
      ta: "லேர்னர்ஸ் உரிமம் சில நாட்களில். நிரந்தர உரிமம்: லேர்னர்ஸுக்குப் பிறகு குறைந்தது 30 நாட்கள் + தேர்வு நேரம்.",
      en: "Learner's licence in a few days. Permanent licence: at least 30 days after the learner's, plus the test date.",
    },
    offline: {
      ta: "உங்கள் பகுதி RTO / வட்டாரப் போக்குவரத்து அலுவலகம். ஓட்டுநர் தேர்வு நேரில்தான் நடக்கும்.",
      en: "Your local RTO. The driving test itself is always in person.",
    },
    tips: [
      {
        ta: "ஏஜெண்ட்டுகளுக்குக் கூடுதல் பணம் கொடுக்க வேண்டியதில்லை – விண்ணப்பம், கட்டணம் இரண்டும் அதிகாரப்பூர்வ தளத்தில் நேரடியாகச் செய்யலாம்.",
        en: "You do not need to pay agents extra – both the application and the fee can be done directly on the official site.",
      },
      {
        ta: "லேர்னர்ஸ் உரிமம் காலாவதியாகும் முன் நிரந்தர உரிமத்துக்கு விண்ணப்பிக்கவும்.",
        en: "Apply for the permanent licence before the learner's licence expires.",
      },
    ],
    faqs: [
      {
        q: { ta: "உரிமத்தைப் புதுப்பிப்பது எப்படி?", en: "How do I renew a licence?" },
        a: {
          ta: "Sarathi-ல் 'DL Services' → 'Renewal of DL' தேர்ந்தெடுத்து, கட்டணம் செலுத்துங்கள். காலாவதிக்குப் பிறகு தாமதமானால் கூடுதல் கட்டணம் இருக்கலாம்.",
          en: "On Sarathi choose 'DL Services' → 'Renewal of DL' and pay. A late fee may apply after expiry.",
        },
      },
    ],
    keywords: ["driving", "licence", "license", "dl", "ll", "learner", "rto", "sarathi", "parivahan", "லைசென்ஸ்", "ஓட்டுநர்", "உரிமம்", "vandi licence"],
    lastVerified: null,
  },
  {
    slug: "community-certificate",
    category: "certificates",
    name: { ta: "சாதிச் சான்றிதழ் (தமிழ்நாடு)", en: "Community certificate (Tamil Nadu)" },
    short: {
      ta: "இ-சேவை மூலம் சாதிச் சான்றிதழ் விண்ணப்பம் மற்றும் பதிவிறக்கம்",
      en: "Apply for and download a community certificate through e-Sevai",
    },
    authority: { ta: "வருவாய்த் துறை – தமிழ்நாடு அரசு (தாசில்தார் அலுவலகம்)", en: "Revenue Department, Government of Tamil Nadu (Tahsildar office)" },
    level: "state",
    scope: { ta: "தமிழ்நாடு", en: "Tamil Nadu" },
    officialUrl: "https://www.tnesevai.tn.gov.in",
    officialLabel: "tnesevai.tn.gov.in",
    who: {
      ta: "தமிழ்நாட்டில் வசிக்கும் எவரும். கல்வி, வேலை இட ஒதுக்கீட்டுக்கும் அரசு திட்டங்களுக்கும் தேவை.",
      en: "Any Tamil Nadu resident. Needed for reservation in education and jobs, and for several schemes.",
    },
    documents: [
      { name: { ta: "குடும்ப அட்டை (ரேஷன் கார்டு)", en: "Family (ration) card" } },
      { name: { ta: "ஆதார் அட்டை", en: "Aadhaar card" } },
      { name: { ta: "தந்தை அல்லது தாயின் சாதிச் சான்றிதழ் அல்லது பள்ளி மாற்றுச் சான்றிதழ் (TC)", en: "Parent's community certificate or school Transfer Certificate (TC)" } },
      { name: { ta: "பாஸ்போர்ட் அளவு புகைப்படம்", en: "Passport-size photograph" } },
      { name: { ta: "முகவரிச் சான்று", en: "Address proof" } },
    ],
    steps: [
      {
        title: { ta: "இ-சேவை தளத்தில் பதிவு செய்யுங்கள் / உள்நுழையுங்கள்", en: "Register or log in on the e-Sevai portal" },
        detail: {
          ta: "tnesevai.tn.gov.in தளத்தில் குடிமக்கள் உள்நுழைவு மூலம் தொடங்குங்கள். இணையத்தில் செய்ய சிரமம் என்றால் அருகிலுள்ள இ-சேவை மையத்தைப் பயன்படுத்துங்கள்.",
          en: "Start at tnesevai.tn.gov.in via citizen login. If doing it online is hard, use your nearest e-Sevai centre.",
        },
      },
      {
        title: { ta: "வருவாய்த் துறை சேவையில் 'சாதிச் சான்றிதழ்' தேர்ந்தெடுக்கவும்", en: "Pick 'Community certificate' under Revenue services" },
        detail: {
          ta: "விண்ணப்பதாரர் விவரங்கள், குடும்ப அட்டை எண், சாதி விவரம் ஆகியவற்றை நிரப்புங்கள்.",
          en: "Fill the applicant details, ration card number and community information.",
        },
      },
      {
        title: { ta: "ஆவணங்களைப் பதிவேற்றி சமர்ப்பிக்கவும்", en: "Upload documents and submit" },
        detail: {
          ta: "தேவையான ஆவணங்களை ஸ்கேன் செய்து பதிவேற்றி, சேவைக் கட்டணம் இருந்தால் செலுத்தி, விண்ணப்ப எண்ணைக் குறித்துக் கொள்ளுங்கள்.",
          en: "Upload scans of the documents, pay any service fee, and note the application number.",
        },
      },
      {
        title: { ta: "அதிகாரிகள் சரிபார்ப்பு", en: "Officer verification" },
        detail: {
          ta: "கிராம நிர்வாக அலுவலர் / வருவாய் ஆய்வாளர் விசாரித்து, வட்டாட்சியர் (தாசில்தார்) ஒப்புதல் அளிப்பார். தேவையெனில் அவர்கள் உங்களை அழைக்கலாம்.",
          en: "The Village Administrative Officer / Revenue Inspector verifies, and the Tahsildar approves. They may call you if needed.",
        },
      },
      {
        title: { ta: "சான்றிதழைப் பதிவிறக்கவும்", en: "Download the certificate" },
        detail: {
          ta: "அனுமதியான பிறகு விண்ணப்ப எண்ணுடன் அதே தளத்தில் டிஜிட்டல் கையொப்பமிட்ட சான்றிதழை பதிவிறக்கலாம். SMS வரும்.",
          en: "Once approved, download the digitally signed certificate with your application number on the same portal. You will receive an SMS.",
        },
      },
    ],
    fees: {
      ta: "அரசுக் கட்டணம் இல்லை அல்லது மிகக் குறைவு. இ-சேவை மையத்தில் சிறு சேவைக் கட்டணம் வாங்கப்படும்.",
      en: "Little or no government fee. An e-Sevai centre charges a small service fee.",
    },
    time: {
      ta: "அதிகாரப்பூர்வ சேவைக் காலம் பொதுவாக சுமார் 15 வேலை நாட்கள் – விண்ணப்பத்தின் போது தளத்தில் உறுதிசெய்யுங்கள்.",
      en: "The official service period is generally around 15 working days – confirm on the portal when you apply.",
    },
    offline: {
      ta: "அருகிலுள்ள இ-சேவை மையம் அல்லது தாலுகா (தாசில்தார்) அலுவலகம்.",
      en: "Nearest e-Sevai centre or the Taluk (Tahsildar) office.",
    },
    tips: [
      {
        ta: "குடும்பத்தில் யாருக்காவது ஏற்கனவே சான்றிதழ் இருந்தால் அதன் நகலை இணைப்பது நடைமுறையை வேகப்படுத்தும்.",
        en: "If a family member already has a certificate, attaching a copy speeds up the process.",
      },
      {
        ta: "'இ-சேவையில் வேலை உடனே முடிக்கிறேன்' என்று கூடுதல் பணம் கேட்பவர்களிடம் கவனமாக இருங்கள்.",
        en: "Be careful with anyone who asks extra money to 'finish it quickly'.",
      },
    ],
    faqs: [
      {
        q: { ta: "விண்ணப்ப நிலையை எப்படிப் பார்ப்பது?", en: "How do I check my application status?" },
        a: {
          ta: "இ-சேவை தளத்தில் 'விண்ணப்ப நிலை' பகுதியில் உங்கள் விண்ணப்ப எண்ணை உள்ளிடுங்கள்.",
          en: "Enter your application number in the 'application status' section of the e-Sevai portal.",
        },
      },
    ],
    keywords: ["community", "caste", "jathi", "sathi", "sadhi", "community certificate", "சாதி", "சாதிச்", "சான்றிதழ்", "esevai", "e-sevai", "இ-சேவை", "bc", "mbc", "sc", "st"],
    lastVerified: null,
  },
];

export const services: Service[] = [...baseServices, ...moreServices];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
export const getCategory = (id: CategoryId) => categories.find((c) => c.id === id)!;
export const servicesIn = (id: CategoryId) => services.filter((s) => s.category === id);
