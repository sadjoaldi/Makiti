import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://makiti.gn";
const apiUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const res = await fetch(`${apiUrl}/listings/${slug}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return { title: "Annonce introuvable" };
    }

    const listing = await res.json();
    const image = listing.images?.[0]?.url;
    const price = new Intl.NumberFormat("fr-FR").format(listing.price);

    return {
      title: listing.title,
      description: `${listing.title} — ${price} GNF à ${listing.city}. ${listing.description?.slice(0, 120) ?? ""}`,
      openGraph: {
        title: `${listing.title} — ${price} GNF`,
        description: `${listing.description?.slice(0, 150) ?? ""} · ${listing.city}`,
        url: `${siteUrl}/listings/${slug}`,
        type: "website",
        images: image
          ? [{ url: image, width: 1200, height: 630, alt: listing.title }]
          : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: `${listing.title} — ${price} GNF`,
        description: listing.city,
        images: image ? [image] : undefined,
      },
    };
  } catch {
    return { title: "Annonce" };
  }
}

export default function ListingLayout({ children }: Props) {
  return <>{children}</>;
}
