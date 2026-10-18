import type { MetadataRoute } from "next";
import { isIndexable, siteUrl } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  // Previews et local : aucune indexation.
  if (!isIndexable) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/api/" }],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
