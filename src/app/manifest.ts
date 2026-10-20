import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CareerSpeak — AI Career English Coach",
    short_name: "CareerSpeak",
    description: "AI-powered interview and workplace English practice for Indian professionals.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#101828",
    icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
