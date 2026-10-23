import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Noto_Sans_Tamil, Mukta_Malar } from "next/font/google";
import "./globals.css";
import { Analytics } from "@/components/Analytics";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MobileNav } from "@/components/MobileNav";
import { ChatDock } from "@/components/ChatDock";
import { MyDocs } from "@/components/MyDocs";

const serif = Noto_Sans_Tamil({
  variable: "--font-anek",
  subsets: ["tamil", "latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const fraunces = Plus_Jakarta_Sans({ variable: "--font-fraunces", subsets: ["latin"], weight: ["500", "600", "700", "800"], display: "swap" });

const sans = Mukta_Malar({
  variable: "--font-mukta",
  subsets: ["tamil", "latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const title = "MakkalLens – அரசு சேவைகளுக்கான எளிய தமிழ் வழிகாட்டி";
const description =
  "திட்டங்களுக்கான தகுதி, சான்றிதழ்களுக்குத் தேவையான ஆவணங்கள், படிகள், கட்டணம், அதிகாரப்பூர்வ இணைப்பு – படிப்படியாக, தமிழில், குரலுடன். இது அதிகாரப்பூர்வ அரசு இணையதளம் அல்ல.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: "%s" },
  description,
  applicationName: "MakkalLens",
  openGraph: { type: "website", locale: "ta_IN", siteName: "MakkalLens / MakkalLens", title, description, images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "தமிழ்நாட்டு நெல்வயல் விடியல்" }] },
  twitter: { card: "summary_large_image", title, description, images: ["/og.jpg"] },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#0a6b3d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ta" data-large="0" className={`${serif.variable} ${sans.variable} ${fraunces.variable}`}>
      <body className="flex min-h-dvh flex-col pb-16 lg:pb-0">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded focus:bg-brand focus:px-4 focus:py-2 focus:text-white">
          உள்ளடக்கத்துக்குச் செல்லவும்
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <MobileNav />
        <MyDocs />
        <ChatDock />
        <Analytics />
      </body>
    </html>
  );
}
