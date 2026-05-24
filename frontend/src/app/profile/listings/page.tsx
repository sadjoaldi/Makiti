"use client";

import { ListingGrid } from "@/components/listings/listing-grid";
import { Button } from "@/components/ui/button";
import { useMyListings } from "@/features/listings/hooks/use-listings";
import { useAuthStore } from "@/store/auth.store";
import { ArrowLeft, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MyListingsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { data: listings, isLoading } = useMyListings();

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
        {!isLoading && listings?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <p className="text-4xl">📦</p>
            <p className="font-medium text-muted-foreground">
              Tu nas pas encore dannonces
            </p>
            <Button onClick={() => router.push("/publish")}>
              Publier ma première annonce
            </Button>
          </div>
        ) : (
          <ListingGrid listings={listings} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
}
