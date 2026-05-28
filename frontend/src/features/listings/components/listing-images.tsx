"use client";

import { cn } from "@/lib/utils";
import { Listing } from "@/types";
import Image from "next/image";
import { useState } from "react";

interface ListingImagesProps {
  listing: Listing;
}

export function ListingImages({ listing }: ListingImagesProps) {
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div>
      <div className="rounded-2xl overflow-hidden bg-muted aspect-square relative">
        {listing.images.length > 0 ? (
          <Image
            src={listing.images[activeImage].url}
            alt={listing.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Pas d&apos;image
          </div>
        )}
      </div>

      {listing.images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
          {listing.images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setActiveImage(index)}
              className={cn(
                "relative shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all",
                activeImage === index
                  ? "border-primary"
                  : "border-transparent opacity-60 hover:opacity-80",
              )}
            >
              <Image
                src={image.url}
                alt={`Image ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
