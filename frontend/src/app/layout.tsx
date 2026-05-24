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

export const metadata: Metadata = {
  title: "Makiti — Marketplace Guinée",
  description: "Achetez et vendez facilement en Guinée",
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
