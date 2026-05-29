"use client";

import { EmptyState } from "@/components/common/empty-state";
import { Header } from "@/components/common/header";
import { ListingGrid } from "@/components/listings/listing-grid";
import { Button } from "@/components/ui/button";
import { useRequireAuth } from "@/features/auth/hooks/use-require-auth";
import { useMyListings } from "@/features/listings/hooks/use-listings";
import { ArrowLeft, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MyListingsPage() {
  const router = useRouter();
  const { ready } = useRequireAuth();
  const { data: listings, isLoading } = useMyListings();

  if (!ready) return null;

  const isEmpty = !isLoading && listings?.length === 0;

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
            <h1 className="font-bold flex-1">Mes annonces</h1>
            <button
              onClick={() => router.push("/publish")}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="pt-4 pb-8">
          {isEmpty ? (
            <EmptyState
              icon="📦"
              message="Tu n'as pas encore d'annonces"
              actionLabel="Publier ma première annonce"
              onAction={() => router.push("/publish")}
            />
          ) : (
            <ListingGrid listings={listings} isLoading={isLoading} />
          )}
        </div>
      </div>

      {/* ───── DESKTOP ───── */}
      <div className="hidden lg:block">
        <Header />
        <main className="max-w-7xl mx-auto px-6 py-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-full hover:bg-muted transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="font-bold text-2xl">Mes annonces</h1>
              {listings && listings.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  ({listings.length})
                </span>
              )}
            </div>
            <Button onClick={() => router.push("/publish")}>
              <Plus className="w-4 h-4 mr-1" />
              Publier
            </Button>
          </div>
          {isEmpty ? (
            <EmptyState
              icon="📦"
              message="Tu n'as pas encore d'annonces"
              actionLabel="Publier ma première annonce"
              onAction={() => router.push("/publish")}
            />
          ) : (
            <ListingGrid listings={listings} isLoading={isLoading} />
          )}
        </main>
      </div>
    </div>
  );
}
