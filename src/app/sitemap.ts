import type { MetadataRoute } from "next";
import { appUrl } from "@/lib/env";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-10-19T00:00:00.000Z");
  const pages = [
    { path: "", changeFrequency: "weekly", priority: 1 },
    { path: "/ai-interview-practice", changeFrequency: "monthly", priority: .9 },
    { path: "/workplace-english-practice", changeFrequency: "monthly", priority: .9 },
    { path: "/practice-preview", changeFrequency: "monthly", priority: .8 },
    { path: "/pricing", changeFrequency: "weekly", priority: .9 },
    { path: "/about", changeFrequency: "yearly", priority: .5 },
    { path: "/privacy", changeFrequency: "yearly", priority: .3 },
    { path: "/terms", changeFrequency: "yearly", priority: .3 },
    { path: "/refunds", changeFrequency: "yearly", priority: .3 },
    { path: "/contact", changeFrequency: "yearly", priority: .4 },
  ] as const;
  return pages.map(({ path, changeFrequency, priority }) => ({ url: `${appUrl()}${path}`, lastModified, changeFrequency, priority }));
}
