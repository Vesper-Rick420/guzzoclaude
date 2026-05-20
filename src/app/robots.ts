import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Zonas privadas: no tiene sentido indexarlas.
      disallow: ["/admin", "/perfil", "/carrito"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
