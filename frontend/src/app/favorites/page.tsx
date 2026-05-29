"use client";

import { BottomNav } from "@/components/common/botton-nav";
import { EmptyState } from "@/components/common/empty-state";
import { Header } from "@/components/common/header";
import { ListingGrid } from "@/components/listings/listing-grid";
import { useMyFavorites } from "@/features/favorites/hooks/use-favorites";
import { useAuthStore } from "@/store/auth.store";
import { ArrowLeft } from "lucide-react";
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

  const isEmpty = !isLoading && favorites?.length === 0;

  return (
    <div className="min-h-screen bg-background">
      {/* ───── MOBILE ───── */}
      <div className="lg:hidden max-w-lg mx-auto">
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
          {isEmpty ? (
            <EmptyState
              icon="❤️"
              message="Aucun favori pour l'instant"
              actionLabel="Explorer les annonces"
              onAction={() => router.push("/")}
            />
          ) : (
            <ListingGrid listings={favorites} isLoading={isLoading} />
          )}
        </div>
        <BottomNav />
      </div>

      {/* ───── DESKTOP ───── */}
      <div className="hidden lg:block">
        <Header />
        <main className="max-w-7xl mx-auto px-6 py-6 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="font-bold text-2xl">Mes favoris</h1>
            {favorites && favorites.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {favorites.length} annonce{favorites.length > 1 ? "s" : ""}
              </span>
            )}
          </div>
          {isEmpty ? (
            <EmptyState
              icon="❤️"
              message="Aucun favori pour l'instant"
              actionLabel="Explorer les annonces"
              onAction={() => router.push("/")}
            />
          ) : (
            <ListingGrid listings={favorites} isLoading={isLoading} />
          )}
        </main>
      </div>
    </div>
  );
}
