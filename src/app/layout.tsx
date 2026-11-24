import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, DM_Sans, Instrument_Serif } from "next/font/google";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const head = Bricolage_Grotesque({ subsets: ["latin"], variable: "--ff-head", display: "swap" });
const body = DM_Sans({ subsets: ["latin"], variable: "--ff-body", display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--ff-serif", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  // iOS Safari auto-wraps phone numbers, emails, dates and addresses in links BEFORE React hydrates, which makes the
  // DOM differ from the server HTML (a hydration error). Turn that off; real contact links are rendered explicitly.
  formatDetection: { telephone: false, email: false, address: false, date: false, url: false },
  title: "infiniti — Recruitment Process Outsourcing",
  description:
    "infiniti runs your recruitment end to end: sourcing, screening, interviewing and onboarding. Faster hires, lower cost, zero hiring headaches.",
  openGraph: {
    title: "infiniti — Recruitment Process Outsourcing",
    description: "Your hiring engine, always on. Sourcing, screening, interviewing and onboarding, handled.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#dc1a31",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover", // lets the layout use the full iPhone screen; safe-area insets keep content clear of the notch
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${head.variable} ${body.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        {/* marks JS-capable browsers before first paint so animation start-states never flash */}
        {/* The second part is a failsafe: if scripts fail to load/hydrate (slow network, blocked dev origin, an older
            browser), reveal the page after 8s instead of leaving the loader up and content hidden. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "var d=document.documentElement;d.classList.add('js');setTimeout(function(){if(!d.classList.contains('loaded')){d.classList.add('loaded','failsafe')}},8000)",
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
