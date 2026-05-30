"use client";

import { Header } from "@/components/common/header";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      {/* Header mobile */}
      <div className="lg:hidden sticky top-0 z-40 bg-background border-b border-border">
        <div className="flex items-center h-14 px-4 gap-3 max-w-lg mx-auto">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold flex-1">Informations légales</h1>
        </div>
      </div>

      {/* Header desktop */}
      <div className="hidden lg:block">
        <Header />
      </div>

      <main className="max-w-3xl mx-auto px-4 lg:px-6 py-6 lg:py-10">
        {children}
      </main>
    </div>
  );
}
