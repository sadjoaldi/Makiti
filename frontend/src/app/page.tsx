"use client";

import { MainLayout } from "@/components/common/main-layout";
import { ListingGrid } from "@/components/listings/listing-grid";
import { useCategories } from "@/features/categories/hooks/use-categories";
import { useInfiniteListings } from "@/features/listings/hooks/use-listings";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui.store";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const { filters, setFilters, resetFilters } = useUIStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: categoriesData } = useCategories();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteListings(filters);

  const listings = data?.pages.flatMap((page) => page.data) ?? [];

  const handleCategorySelect = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
      setFilters({ categoryId: undefined });
    } else {
      setSelectedCategory(categoryId);
      setFilters({ categoryId });
    }
  };

  return (
    <MainLayout showHeader>
      <div className="space-y-4 pt-3">
        {/* Barre de recherche */}
        <div className="px-4">
          <button
            onClick={() => router.push("/search")}
            className="w-full flex items-center gap-3 bg-muted rounded-xl px-4 py-3 text-muted-foreground text-sm"
          >
            <Search className="w-4 h-4 flex-shrink-0" />
            <span>Rechercher une annonce...</span>
          </button>
        </div>

        {/* Catégories */}
        <div className="overflow-x-auto scrollbar-hide">
          <div
            className="flex gap-2 px-4 pb-1"
            style={{ width: "max-content" }}
          >
            <button
              onClick={() => {
                setSelectedCategory(null);
                resetFilters();
              }}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-all",
                !selectedCategory
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-primary/50",
              )}
            >
              Tout
            </button>
            {categoriesData?.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-all",
                  selectedCategory === category.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary/50",
                )}
              >
                {category.icon && <span>{category.icon}</span>}
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Titre section */}
        <div className="px-4 flex items-center justify-between">
          <h2 className="font-bold text-lg">
            {selectedCategory ? "Résultats" : "Annonces récentes"}
          </h2>
          {data?.pages[0]?.meta.total !== undefined && (
            <span className="text-sm text-muted-foreground">
              {data.pages[0].meta.total} annonces
            </span>
          )}
        </div>

        {/* Grille annonces */}
        <ListingGrid listings={listings} isLoading={isLoading} />

        {/* Load more */}
        {hasNextPage && (
          <div className="px-4 pb-4">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="w-full py-3 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
            >
              {isFetchingNextPage ? "Chargement..." : "Voir plus"}
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
