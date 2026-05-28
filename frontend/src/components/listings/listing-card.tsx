"use client";

import {
  useCheckFavorite,
  useToggleFavorite,
} from "@/features/favorites/hooks/use-favorites";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import { Listing } from "@/types";
import { formatPrice, formatRelativeDate } from "@/utils/format";
import { Heart, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const { data: favoriteData } = useCheckFavorite(listing.id);
  const { mutate: toggleFavorite, isPending } = useToggleFavorite();

  const isFavorited = favoriteData?.favorited ?? false;
  const image = listing.images?.[0];

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    toggleFavorite(listing.id);
  };

  return (
    <Link href={`/listings/${listing.slug}`} className="block">
      <div className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-md lg:hover:shadow-lg lg:hover:-translate-y-0.5 transition-all duration-200">
        {/* Image */}
        <div className="relative aspect-square bg-muted">
          {image ? (
            <Image
              src={image.url}
              alt={listing.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              Pas dimage
            </div>
          )}

          {/* Badge condition */}
          <div className="absolute top-2 left-2">
            <span
              className={cn(
                "text-xs font-medium px-2 py-1 rounded-full",
                listing.condition === "NEW"
                  ? "bg-green-100 text-green-700"
                  : "bg-orange-100 text-orange-700",
              )}
            >
              {listing.condition === "NEW" ? "Neuf" : "Occasion"}
            </span>
          </div>

          {/* Favori */}
          <button
            onClick={handleFavorite}
            disabled={isPending}
            className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm"
          >
            <Heart
              className={cn(
                "w-4 h-4 transition-colors",
                isFavorited ? "fill-red-500 text-red-500" : "text-gray-500",
              )}
            />
          </button>
        </div>

        {/* Infos */}
        <div className="p-2.5">
          <p className="font-bold text-sm text-primary">
            {formatPrice(listing.price)}
          </p>
          <p className="text-sm font-medium text-foreground truncate mt-0.5">
            {listing.title}
          </p>
          <div className="flex items-center gap-1 mt-1 text-muted-foreground">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="text-xs truncate">{listing.city}</span>
            <span className="text-xs ml-auto flex-shrink-0">
              {formatRelativeDate(listing.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
