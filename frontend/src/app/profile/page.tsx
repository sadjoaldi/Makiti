"use client";

import { MainLayout } from "@/components/common/main-layout";
import { ListingCard } from "@/components/listings/listing-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyListings } from "@/features/listings/hooks/use-listings";
import { useAuthStore } from "@/store/auth.store";
import { ChevronRight, Heart, LogOut, Package, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { data: myListings, isLoading } = useMyListings();

  useEffect(() => {
    if (!isAuthenticated) router.push("/auth/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) return null;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <MainLayout title="Mon profil" showHeader>
      <div className="pt-4 space-y-6 pb-8">
        {/* Avatar + infos */}
        <div className="px-4 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-black text-primary flex-shrink-0">
            {user.firstName[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-lg truncate">
              {user.firstName} {user.lastName ?? ""}
            </p>
            <p className="text-sm text-muted-foreground truncate">
              {user.email}
            </p>
            {user.city && (
              <p className="text-sm text-muted-foreground">{user.city}</p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="px-4 grid grid-cols-2 gap-3">
          <div className="bg-muted rounded-xl p-4 text-center">
            <p className="text-2xl font-black text-primary">
              {myListings?.length ?? 0}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Annonces</p>
          </div>
          <div className="bg-muted rounded-xl p-4 text-center">
            <p className="text-2xl font-black text-primary">
              {user.isVerified ? "✅" : "❌"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Vérifié</p>
          </div>
        </div>

        {/* Menu */}
        <div className="px-4 space-y-2">
          <button
            onClick={() => router.push("/profile/listings")}
            className="w-full flex items-center gap-3 p-4 bg-muted rounded-xl hover:bg-muted/80 transition-colors"
          >
            <Package className="w-5 h-5 text-muted-foreground" />
            <span className="flex-1 text-left font-medium text-sm">
              Mes annonces
            </span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>

          <button
            onClick={() => router.push("/favorites")}
            className="w-full flex items-center gap-3 p-4 bg-muted rounded-xl hover:bg-muted/80 transition-colors"
          >
            <Heart className="w-5 h-5 text-muted-foreground" />
            <span className="flex-1 text-left font-medium text-sm">
              Mes favoris
            </span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>

          <button
            onClick={() => router.push("/profile/edit")}
            className="w-full flex items-center gap-3 p-4 bg-muted rounded-xl hover:bg-muted/80 transition-colors"
          >
            <Settings className="w-5 h-5 text-muted-foreground" />
            <span className="flex-1 text-left font-medium text-sm">
              Modifier mon profil
            </span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Mes annonces preview */}
        {(isLoading || (myListings && myListings.length > 0)) && (
          <div className="space-y-3">
            <div className="px-4 flex items-center justify-between">
              <h2 className="font-bold">Mes annonces récentes</h2>
              {myListings && myListings.length > 2 && (
                <button
                  onClick={() => router.push("/profile/listings")}
                  className="text-sm text-primary font-medium"
                >
                  Voir tout
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 gap-3 px-4">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="aspect-square rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 px-4">
                {myListings?.slice(0, 2).map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Logout */}
        <div className="px-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border border-destructive/30 text-destructive hover:bg-destructive/5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium text-sm">Se déconnecter</span>
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
