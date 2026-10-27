import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Analytics } from '@vercel/analytics/next';
import { AnalyticsBootstrap } from "@/components/analytics-events";
import { NavigationProgress } from "@/components/navigation-progress";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://www.careerspeak.tech"),
  title: {
    default: "CareerSpeak — AI Interview & Career English Practice",
    template: "%s | CareerSpeak",
  },
  description: "Practise interviews, presentations and workplace English with an AI career coach built for Indian professionals. Speak, get actionable feedback and retry.",
  applicationName: "CareerSpeak",
  creator: "CareerSpeak",
  publisher: "CareerSpeak",
  keywords: [
    "AI interview practice",
    "career English coach",
    "English speaking practice India",
    "job interview preparation",
    "workplace communication practice",
    "presentation practice",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "CareerSpeak",
    title: "CareerSpeak — AI Interview & Career English Practice",
    description: "Rehearse real career conversations, get precise AI feedback and walk in ready.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CareerSpeak — AI Interview & Career English Practice",
    description: "Rehearse real career conversations, get precise AI feedback and walk in ready.",
  },
  category: "education",
  formatDetection: { email: false, address: false, telephone: false },
  appleWebApp: { capable: true, title: "CareerSpeak", statusBarStyle: "default" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#101828", colorScheme: "light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body><Suspense fallback={null}><AnalyticsBootstrap/><NavigationProgress /></Suspense>{children}</body>
      {process.env.VERCEL && <Analytics />}
    </html>
  );
}
