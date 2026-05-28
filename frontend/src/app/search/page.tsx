"use client";

import { BottomNav } from "@/components/common/botton-nav";
import { Header } from "@/components/common/header";
import { Sidebar, SidebarSection } from "@/components/common/sidebar";
import { ListingGrid } from "@/components/listings/listing-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCategories } from "@/features/categories/hooks/use-categories";
import { useListings } from "@/features/listings/hooks/use-listings";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui.store";
import { ArrowLeft, Search, SlidersHorizontal, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchPage() {
  const router = useRouter();
  const { filters, setFilters, resetFilters } = useUIStore();
  const [search, setSearch] = useState(filters.search ?? "");
  const [selectedCategory, setSelectedCategory] = useState(
    filters.categoryId ?? "",
  );
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const { data: categories } = useCategories();
  const { data, isLoading } = useListings(filters);

  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const applyPriceFilter = () => {
    setFilters({
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    });
  };

  const handleClear = () => {
    setSearch("");
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
    resetFilters();
  };

  const listings = data?.data ?? [];
  const total = data?.meta?.total ?? 0;

  return (
    <div className="min-h-screen bg-background">
      {/* ───────── MOBILE ───────── */}
      <div className="lg:hidden max-w-lg mx-auto">
        {/* Header recherche */}
        <div className="sticky top-0 z-40 bg-background border-b border-border">
          <div className="flex items-center gap-3 h-14 px-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-muted transition-colors shrink-0"
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
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "p-2 rounded-full transition-colors shrink-0",
                  showFilters
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted",
                )}
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
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

        {/* Filtres prix mobile */}
        {showFilters && (
          <div className="border-b border-border px-4 py-3 bg-background space-y-3">
            <p className="text-sm font-medium">Fourchette de prix (GNF)</p>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="pr-8 h-9 text-sm"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  FG
                </span>
              </div>
              <span className="text-muted-foreground">—</span>
              <div className="relative flex-1">
                <Input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="pr-8 h-9 text-sm"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  FG
                </span>
              </div>
              <Button size="sm" onClick={applyPriceFilter} className="h-9 px-3">
                OK
              </Button>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Trier par</p>
              <div className="flex gap-2">
                {[
                  { value: "recent", label: "Récent" },
                  { value: "priceAsc", label: "Prix ↑" },
                  { value: "priceDesc", label: "Prix ↓" },
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
                      "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                      filters.sortBy === sort.value
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-muted-foreground",
                    )}
                  >
                    {sort.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Résultats mobile */}
        <div className="pt-4 pb-24">
          <div className="px-4 mb-3 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {total} résultat{total > 1 ? "s" : ""}
            </p>
            {(search || selectedCategory) && (
              <button
                onClick={handleClear}
                className="text-sm text-primary font-medium"
              >
                Effacer
              </button>
            )}
          </div>
          <ListingGrid listings={listings} isLoading={isLoading} />
        </div>

        <BottomNav />
      </div>

      {/* ───────── DESKTOP ───────── */}
      <div className="hidden lg:block">
        <Header />
        <main className="max-w-7xl mx-auto px-6 py-6">
          {/* Barre de recherche desktop */}
          <div className="relative max-w-2xl mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher une annonce..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-muted rounded-xl pl-12 pr-10 py-3 text-base focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            )}
          </div>

          <div className="flex gap-6 items-start">
            {/* Sidebar filtres */}
            <Sidebar>
              <SidebarSection title="Catégories">
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setSelectedCategory("");
                      setFilters({ categoryId: undefined });
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
                  {categories?.map((category) => (
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
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full bg-muted rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full bg-muted rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <Button
                    size="sm"
                    onClick={applyPriceFilter}
                    className="w-full h-9"
                  >
                    Appliquer
                  </Button>
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

            {/* Résultats desktop */}
            <div className="flex-1 min-w-0 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-lg">
                  {total} résultat{total > 1 ? "s" : ""}
                </h2>
                {(search || selectedCategory || minPrice || maxPrice) && (
                  <button
                    onClick={handleClear}
                    className="text-sm text-primary font-medium"
                  >
                    Effacer les filtres
                  </button>
                )}
              </div>
              <ListingGrid listings={listings} isLoading={isLoading} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
