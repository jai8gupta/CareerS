import type { MetadataRoute } from "next";
import { appUrl } from "@/lib/env";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/pricing", "/privacy", "/terms", "/refunds", "/contact"].map(path => ({ url: `${appUrl()}${path}`, lastModified: new Date(), changeFrequency: path === "" ? "weekly" : "monthly", priority: path === "" ? 1 : .6 }));
}
