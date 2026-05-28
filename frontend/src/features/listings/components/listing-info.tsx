"use client";

import { Badge } from "@/components/ui/badge";
import { Listing } from "@/types";
import { formatPrice, formatRelativeDate } from "@/utils/format";
import { Calendar, ChevronRight, Eye, Flag, MapPin, Tag } from "lucide-react";
import Image from "next/image";

interface ListingInfoProps {
  listing: Listing;
  isOwner: boolean;
  onReport: () => void;
  onVendorClick: () => void;
}

export function ListingInfo({
  listing,
  isOwner,
  onReport,
  onVendorClick,
}: ListingInfoProps) {
  return (
    <div className="space-y-4">
      {/* Prix + titre */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <p className="text-2xl font-black text-primary">
            {formatPrice(listing.price)}
          </p>
          <Badge
            variant={listing.condition === "NEW" ? "default" : "secondary"}
          >
            {listing.condition === "NEW" ? "Neuf" : "Occasion"}
          </Badge>
        </div>
        <h1 className="text-lg font-bold mt-1">{listing.title}</h1>
      </div>

      {/* Méta infos */}
      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          <span>
            {listing.city}
            {listing.district ? `, ${listing.district}` : ""}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>{formatRelativeDate(listing.createdAt)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          <span>{listing.views} vues</span>
        </div>
        <div className="flex items-center gap-1">
          <Tag className="w-4 h-4" />
          <span>{listing.category.name}</span>
        </div>
      </div>

      <div className="border-t border-border" />

      {/* Signaler */}
      {!isOwner && (
        <button
          onClick={onReport}
          className="flex items-center gap-1 text-muted-foreground/80 hover:text-destructive transition-colors"
        >
          <Flag className="w-3.5 h-3.5" />
          <span className="text-xs">Signaler cette annonce</span>
        </button>
      )}

      {/* Description */}
      <div>
        <h2 className="font-bold mb-2">Description</h2>
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
          {listing.description}
        </p>
      </div>

      <div className="border-t border-border" />

      {/* Vendeur */}
      <div>
        <h2 className="font-bold mb-3">Vendeur</h2>
        <div
          className="flex items-center gap-3 p-3 bg-muted rounded-xl cursor-pointer hover:bg-muted/80 transition-colors"
          onClick={onVendorClick}
        >
          <div className="relative w-12 h-12 rounded-full bg-background flex items-center justify-center text-lg font-bold overflow-hidden shrink-0">
            {listing.user.avatar ? (
              <Image
                src={listing.user.avatar}
                alt={listing.user.firstName}
                fill
                className="object-cover"
              />
            ) : (
              listing.user.firstName[0].toUpperCase()
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="font-medium truncate">
                {listing.user.firstName} {listing.user.lastName ?? ""}
              </p>
              {listing.user.isVerified && (
                <span
                  className="text-blue-500 shrink-0"
                  title="Vendeur vérifié"
                >
                  ✅
                </span>
              )}
            </div>
            {listing.user.city && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {listing.user.city}
              </p>
            )}
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
        </div>
      </div>
    </div>
  );
}
