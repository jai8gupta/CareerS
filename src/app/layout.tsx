import type { Metadata } from "next";
import { Analytics } from '@vercel/analytics/next';

import "./globals.css";

export const metadata: Metadata = {
  title: { default: "CareerSpeak", template: "%s · CareerSpeak" },
  description: "Five-minute AI career rehearsal for interviews and workplace conversations.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
      <Analytics />
    </html>
  );
}
