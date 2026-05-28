"use client";

import { MainLayout } from "@/components/common/main-layout";
import { Sidebar, SidebarSection } from "@/components/common/sidebar";
import { ListingCard } from "@/components/listings/listing-card";
import { ListingCardSkeleton } from "@/components/listings/listing-card-skeleton";
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
      <div className="pt-3 lg:pt-6">
        {/* Barre de recherche — mobile uniquement */}
        <div className="px-4 lg:hidden mb-4">
          <button
            onClick={() => router.push("/search")}
            className="w-full flex items-center gap-3 bg-muted rounded-xl px-4 py-3 text-muted-foreground text-sm"
          >
            <Search className="w-4 h-4 shrink-0" />
            <span>Rechercher une annonce...</span>
          </button>
        </div>

        {/* Layout desktop — 2 colonnes */}
        <div className="flex gap-6 items-start">
          {/* Sidebar filtres — desktop uniquement */}
          <Sidebar>
            <SidebarSection title="Catégories">
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    resetFilters();
                  }}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors text-left",
                    !selectedCategory
                      ? "bg-primary text-primary-foreground font-medium"
                      : "hover:bg-muted text-muted-foreground",
                  )}
                >
                  Toutes les catégories
                </button>
                {categoriesData?.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors text-left",
                      selectedCategory === category.id
                        ? "bg-primary text-primary-foreground font-medium"
                        : "hover:bg-muted text-muted-foreground",
                    )}
                  >
                    {category.icon && <span>{category.icon}</span>}
                    {category.name}
                  </button>
                ))}
              </div>
            </SidebarSection>

            <SidebarSection title="Prix (GNF)">
              <div className="space-y-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full bg-muted rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  onChange={(e) =>
                    setFilters({
                      minPrice: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full bg-muted rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  onChange={(e) =>
                    setFilters({
                      maxPrice: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                />
              </div>
            </SidebarSection>

            <SidebarSection title="Trier par">
              <div className="space-y-1">
                {[
                  { value: "recent", label: "Plus récent" },
                  { value: "priceAsc", label: "Prix croissant" },
                  { value: "priceDesc", label: "Prix décroissant" },
                ].map((sort) => (
                  <button
                    key={sort.value}
                    onClick={() =>
                      setFilters({
                        sortBy: sort.value as
                          | "recent"
                          | "priceAsc"
                          | "priceDesc",
                      })
                    }
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-xl text-sm transition-colors",
                      filters.sortBy === sort.value
                        ? "bg-primary text-primary-foreground font-medium"
                        : "hover:bg-muted text-muted-foreground",
                    )}
                  >
                    {sort.label}
                  </button>
                ))}
              </div>
            </SidebarSection>
          </Sidebar>

          {/* Contenu principal */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* Catégories scroll horizontal — mobile uniquement */}
            <div className="overflow-x-auto scrollbar-hide lg:hidden">
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
            <div className="px-4 lg:px-0 flex items-center justify-between">
              <h2 className="font-bold text-lg">
                {selectedCategory ? "Résultats" : "Annonces récentes"}
              </h2>
              {data?.pages[0]?.meta.total !== undefined && (
                <span className="text-sm text-muted-foreground">
                  {data.pages[0].meta.total} annonces
                </span>
              )}
            </div>

            {/* Grille */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 px-4 lg:px-0">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <ListingCardSkeleton key={i} />
                ))
              ) : listings.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <p className="text-4xl mb-3">🔍</p>
                  <p className="font-medium">Aucune annonce trouvée</p>
                </div>
              ) : (
                listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))
              )}
            </div>

            {/* Load more */}
            {hasNextPage && (
              <div className="px-4 lg:px-0 pb-4">
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
        </div>
      </div>
    </MainLayout>
  );
}
