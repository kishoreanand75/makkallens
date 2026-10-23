import type { L } from "./services";

export interface Place {
  id: "meenakshi" | "thanjavur" | "marina" | "kanyakumari" | "nilgiris";
  name: L;
  where: L;
  line: L;
  alt: L;
}

// Images are AI-generated illustrations (ComfyUI / Z-Image-Turbo) inspired by these real places.
export const places: Place[] = [
  {
    id: "meenakshi",
    name: { ta: "மீனாட்சி அம்மன் கோயில்", en: "Meenakshi Amman Temple" },
    where: { ta: "மதுரை", en: "Madurai" },
    line: { ta: "இரண்டாயிரம் ஆண்டுகளாக விழித்திருக்கும் நகரம்.", en: "A city that has stayed awake for two thousand years." },
    alt: { ta: "பொற்றாமரைக் குளத்தில் பிரதிபலிக்கும் மீனாட்சி அம்மன் கோயில் கோபுரங்கள், மாலை பொன்னொளியில்", en: "Meenakshi Amman Temple gopurams reflected in the Golden Lotus Tank at golden hour" },
  },
  {
    id: "thanjavur",
    name: { ta: "பெருவுடையார் கோயில்", en: "Brihadisvara Temple" },
    where: { ta: "தஞ்சாவூர்", en: "Thanjavur" },
    line: { ta: "ஆயிரம் ஆண்டுகள் கடந்தும் உறுதியாக நிற்கும் கற்கோபுரம்.", en: "A granite tower standing firm for a thousand years." },
    alt: { ta: "அதிகாலை ஒளியில் தஞ்சைப் பெரிய கோயிலின் கருங்கல் விமானம்", en: "The granite vimana of the Thanjavur Big Temple in early morning light" },
  },
  {
    id: "marina",
    name: { ta: "மெரினா கடற்கரை", en: "Marina Beach" },
    where: { ta: "சென்னை", en: "Chennai" },
    line: { ta: "ஒவ்வொரு விடியலும் ஒரு புதிய தொடக்கம்.", en: "Every sunrise is a fresh start." },
    alt: { ta: "சூரிய உதயத்தில் மெரினா கடற்கரை மற்றும் மீன்பிடிப் படகுகள்", en: "Marina Beach at sunrise with fishing boats on the sand" },
  },
  {
    id: "kanyakumari",
    name: { ta: "கன்னியாகுமரி விடியல்", en: "Kanyakumari sunrise" },
    where: { ta: "கன்னியாகுமரி", en: "Kanyakumari" },
    line: { ta: "மூன்று கடல்கள் சந்திக்கும் முனையில் ஒரு புதிய நாள் தொடங்குகிறது.", en: "A new day begins where three seas meet." },
    alt: { ta: "சூரிய உதயத்தில் கன்னியாகுமரிக் கடலோரப் பாறையில் ஒரு கற்சிலை", en: "A stone statue on a rocky islet off Kanyakumari at sunrise" },
  },
  {
    id: "nilgiris",
    name: { ta: "நீலகிரி தேயிலைத் தோட்டங்கள்", en: "Nilgiri tea hills" },
    where: { ta: "உதகமண்டலம்", en: "Udhagamandalam" },
    line: { ta: "மூடுபனியின் பின்னே காத்திருக்கும் பசுமை.", en: "Green waiting behind the morning mist." },
    alt: { ta: "மூடுபனி சூழ்ந்த நீலகிரி தேயிலைத் தோட்டங்கள்", en: "Misty tea gardens on the Nilgiri hills" },
  },
];
