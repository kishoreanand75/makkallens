import type { Metadata } from "next";
import { Top50List } from "@/components/home/Top50List";
import { PageHero } from "@/components/ui/PageHero";
import { top50Note } from "@/lib/top50";
import { T } from "@/lib/lang";

export const metadata: Metadata = {
  title: "தமிழ்நாட்டில் அதிகம் தேவைப்படும் முதல் 50 சேவைகள் & திட்டங்கள் | MakkalLens",
  description: "சாதிச் சான்று, வருமானச் சான்று, ரேஷன் அட்டை, பட்டா, ஆதார் முதல் மகளிர் உரிமைத் தொகை, பிரதமர் கிசான் வரை – தமிழ்நாட்டு மக்களுக்கு அதிகம் தேவைப்படும் 50.",
  alternates: { canonical: "/popular" },
};

export default function PopularPage() {
  return (
    <div>
      <PageHero
        topic="schemes"
        kicker={{ ta: "தமிழ்நாடு", en: "Tamil Nadu" }}
        title={{ ta: "அதிகம் தேவைப்படும் முதல் 50", en: "The 50 most needed" }}
        intro={{ ta: "சான்றிதழ்கள், அடையாள ஆவணங்கள், நலத்திட்டங்கள் – தமிழ்நாட்டு மக்கள் அதிகம் தேடுபவை முதலில்.", en: "Certificates, IDs and schemes – what Tamil Nadu residents need most come first." }}
      />
      <div className="w-full px-4 pb-14 pt-4 sm:px-8 lg:pl-24">
        <Top50List />
        <p className="mt-6 border-l-4 border-sun bg-sun-tint p-3 text-sm text-ink-soft">
          <T
            v={{
              ta: "இந்த வரிசை எங்கள் தொகுப்பு: இ-சேவை வருவாய்ச் சான்றிதழ் பட்டியல், நில ஆவணங்கள், அடையாள ஆவணங்கள், அதிகப் பயனாளிகள் உள்ள திட்டங்கள் அடிப்படையில். இது Google தேடல் எண்ணிக்கை அல்ல. தளத்தில் உண்மையான வருகைகள் சேர்ந்ததும் வரிசை தானாகச் சரிசெய்யப்படும்.",
              en: "This order is our own curation, based on the e-Sevai revenue-certificate catalogue, land records, ID documents and the schemes with the most beneficiaries. It is not Google search-volume data. It will adjust automatically as real visits build up on this site.",
            }}
          />
        </p>
        <p className="sr-only">{top50Note}</p>
      </div>
    </div>
  );
}
