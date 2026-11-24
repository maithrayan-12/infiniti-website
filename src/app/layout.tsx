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
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
