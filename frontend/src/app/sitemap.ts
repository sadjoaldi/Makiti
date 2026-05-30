import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://makiti.gn";
const apiUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Pages statiques
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    { url: `${siteUrl}/search`, changeFrequency: "daily", priority: 0.8 },
    {
      url: `${siteUrl}/legal/mentions`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    { url: `${siteUrl}/legal/cgu`, changeFrequency: "yearly", priority: 0.3 },
    {
      url: `${siteUrl}/legal/confidentialite`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Annonces dynamiques
  try {
    const res = await fetch(`${apiUrl}/listings?limit=1000`, {
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const data = await res.json();
      const listingPages: MetadataRoute.Sitemap = (data.data ?? []).map(
        (listing: { slug: string; updatedAt?: string }) => ({
          url: `${siteUrl}/listings/${listing.slug}`,
          lastModified: listing.updatedAt
            ? new Date(listing.updatedAt)
            : new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.7,
        }),
      );
      return [...staticPages, ...listingPages];
    }
  } catch {
    // En cas d'erreur, on retourne au moins les pages statiques
  }

  return staticPages;
}
