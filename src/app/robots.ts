import type { MetadataRoute } from "next";
import { appUrl } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/dashboard", "/account", "/api/", "/auth/", "/login", "/signup"] },
    sitemap: `${appUrl()}/sitemap.xml`,
    host: appUrl(),
  };
}
