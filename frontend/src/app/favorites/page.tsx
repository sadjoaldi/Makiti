"use client";

import { BottomNav } from "@/components/common/botton-nav";
import { ListingGrid } from "@/components/listings/listing-grid";
import { useMyFavorites } from "@/features/favorites/hooks/use-favorites";
import { useAuthStore } from "@/store/auth.store";
import { ArrowLeft, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function FavoritesPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { data: favorites, isLoading } = useMyFavorites();

  useEffect(() => {
    if (!isAuthenticated) router.push("/auth/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="flex items-center h-14 px-4 gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold flex-1">Mes favoris</h1>
        </div>
      </div>

      <div className="pt-4 pb-24">
        {!isLoading && favorites?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
            <Heart className="w-12 h-12 opacity-20" />
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            <p className="font-medium">Aucun favori pour l'instant</p>
            <p className="text-sm">
              Appuie sur ❤️ sur une annonce pour la sauvegarder
            </p>
          </div>
        ) : (
          <ListingGrid listings={favorites} isLoading={isLoading} />
        )}
      </div>

      <BottomNav />
    </div>
  );
}
