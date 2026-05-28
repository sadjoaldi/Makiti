import { Listing } from "@/types";
import { ListingCard } from "./listing-card";
import { ListingCardSkeleton } from "./listing-card-skeleton";

interface ListingGridProps {
  listings?: Listing[];
  isLoading?: boolean;
}

export function ListingGrid({ listings, isLoading }: ListingGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 px-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <ListingCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!listings || listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <p className="text-4xl mb-3">🔍</p>
        <p className="font-medium">Aucune annonce trouvée</p>
        <p className="text-sm mt-1">Essaie dautres filtres</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 px-4 lg:grid-cols-4 lg:px-0">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
