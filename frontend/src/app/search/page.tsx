"use client";

import { BottomNav } from "@/components/common/botton-nav";
import { ListingGrid } from "@/components/listings/listing-grid";
import { useCategories } from "@/features/categories/hooks/use-categories";
import { useListings } from "@/features/listings/hooks/use-listings";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui.store";
import { ArrowLeft, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchPage() {
  const router = useRouter();
  const { filters, setFilters, resetFilters } = useUIStore();
  const [search, setSearch] = useState(filters.search ?? "");
  const [selectedCategory, setSelectedCategory] = useState(
    filters.categoryId ?? "",
  );

  const { data: categories } = useCategories();
  const { data, isLoading } = useListings(filters);

  // Debounce search
  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilters({ search: search || undefined });
    }, 400);
    return () => clearTimeout(timeout);
  }, [search]);

  const handleCategorySelect = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory("");
      setFilters({ categoryId: undefined });
    } else {
      setSelectedCategory(categoryId);
      setFilters({ categoryId });
    }
  };

  const listings = data?.data ?? [];

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto">
      {/* Header recherche */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="flex items-center gap-3 h-14 px-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-muted transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
              className="w-full bg-muted rounded-xl pl-9 pr-9 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Filtres catégories */}
        <div className="overflow-x-auto scrollbar-hide">
          <div
            className="flex gap-2 px-4 pb-3"
            style={{ width: "max-content" }}
          >
            {categories?.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all",
                  selectedCategory === category.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground",
                )}
              >
                {category.icon && <span>{category.icon}</span>}
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Résultats */}
      <div className="pt-4 pb-24">
        <div className="px-4 mb-3 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {data?.meta?.total ?? 0} résultat
            {(data?.meta?.total ?? 0) > 1 ? "s" : ""}
          </p>
          {(search || selectedCategory) && (
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("");
                resetFilters();
              }}
              className="text-sm text-primary font-medium"
            >
              Effacer
            </button>
          )}
        </div>
        <ListingGrid listings={listings} isLoading={isLoading} />
      </div>

      {/* Bottom Nav */}
      <BottomNav />
    </div>
  );
}
