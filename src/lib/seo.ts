import type { Metadata } from "next";

export const SITE_URL = "https://www.careerspeak.tech";
export const SITE_NAME = "CareerSpeak";
export const SUPPORT_EMAIL = "support@careerspeak.tech";

const socialImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "CareerSpeak AI interview and career-English practice",
};

export function publicPageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path, languages: { "en-IN": path, "x-default": path } },
    openGraph: { type: "website", locale: "en_IN", url: path, siteName: SITE_NAME, title, description, images: [socialImage] },
    twitter: { card: "summary_large_image", title, description, images: [socialImage.url] },
  };
}

export function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
