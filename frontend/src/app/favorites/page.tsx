"use client";

import { MainLayout } from "@/components/common/main-layout";
import { ListingGrid } from "@/components/listings/listing-grid";
import { useMyFavorites } from "@/features/favorites/hooks/use-favorites";
import { useAuthStore } from "@/store/auth.store";
import { Heart } from "lucide-react";
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
    <MainLayout title="Mes favoris" showHeader>
      <div className="pt-4 space-y-4">
        {!isLoading && favorites?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
            <Heart className="w-12 h-12 opacity-20" />
            <p className="font-medium">Aucun favori pour linstant</p>
            <p className="text-sm">
              Appuie sur ❤️ sur une annonce pour la sauvegarder
            </p>
          </div>
        ) : (
          <ListingGrid listings={favorites} isLoading={isLoading} />
        )}
      </div>
    </MainLayout>
  );
}
