import { CityModal } from "@/components/common/city-modal";
import { QueryProvider } from "@/providers/query-provider";
import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#10b981",
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://makiti.gn";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Makiti — Petites annonces en Guinée",
    template: "%s · Makiti",
  },
  description:
    "Achetez et vendez facilement en Guinée. Véhicules, immobilier, électronique, mode et plus encore sur Makiti, la marketplace des petites annonces.",
  keywords: [
    "petites annonces",
    "Guinée",
    "Conakry",
    "achat",
    "vente",
    "occasion",
    "marketplace",
    "Makiti",
  ],
  authors: [{ name: "Makiti" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName: "Makiti",
    title: "Makiti — Petites annonces en Guinée",
    description:
      "Achetez et vendez facilement en Guinée. La marketplace des petites annonces.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Makiti — Petites annonces en Guinée",
    description:
      "Achetez et vendez facilement en Guinée. La marketplace des petites annonces.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={geist.className}>
        <QueryProvider>
          {children}
          <CityModal />
          <Toaster position="top-center" richColors />
        </QueryProvider>
      </body>
    </html>
  );
}
