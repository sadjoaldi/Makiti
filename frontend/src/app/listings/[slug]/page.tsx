"use client";

import { MainLayout } from "@/components/common/main-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCheckFavorite,
  useToggleFavorite,
} from "@/features/favorites/hooks/use-favorites";
import { useListing } from "@/features/listings/hooks/use-listings";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import { formatPrice, formatRelativeDate } from "@/utils/format";
import {
  ArrowLeft,
  Calendar,
  Eye,
  Heart,
  MapPin,
  Phone,
  Share2,
  Tag,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { toast } from "sonner";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ListingDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [activeImage, setActiveImage] = useState(0);
  const [showPhone, setShowPhone] = useState(false);

  const { data: listing, isLoading } = useListing(slug);
  const { data: favoriteData } = useCheckFavorite(listing?.id ?? "");
  const { mutate: toggleFavorite, isPending } = useToggleFavorite();

  const isFavorited = favoriteData?.favorited ?? false;

  const handleFavorite = () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    if (listing) toggleFavorite(listing.id);
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: listing?.title,
        url: window.location.href,
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Lien copié !");
    }
  };

  const handleContact = () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    setShowPhone(true);
  };

  if (isLoading) return <ListingDetailSkeleton />;
  if (!listing) return null;

  return (
    <MainLayout hideBottomNav>
      {/* Header fixe */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between h-14 px-4 max-w-lg mx-auto">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={handleFavorite}
              disabled={isPending}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <Heart
                className={cn(
                  "w-5 h-5 transition-colors",
                  isFavorited ? "fill-red-500 text-red-500" : "text-foreground",
                )}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="relative bg-muted">
        <div className="aspect-square relative">
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
              Pas dimage
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {listing.images.length > 1 && (
          <div className="flex gap-2 p-3 overflow-x-auto scrollbar-hide">
            {listing.images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setActiveImage(index)}
                className={cn(
                  "relative shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all",
                  activeImage === index
                    ? "border-primary"
                    : "border-transparent opacity-60",
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

      {/* Contenu */}
      <div className="px-4 py-4 space-y-4 pb-32">
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

        {/* Séparateur */}
        <div className="border-t border-border" />

        {/* Description */}
        <div>
          <h2 className="font-bold mb-2">Description</h2>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {listing.description}
          </p>
        </div>

        {/* Séparateur */}
        <div className="border-t border-border" />

        {/* Vendeur */}
        <div>
          <h2 className="font-bold mb-3">Vendeur</h2>
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full bg-muted flex items-center justify-center text-lg font-bold overflow-hidden shrink-0">
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
            <div>
              <p className="font-medium">
                {listing.user.firstName} {listing.user.lastName ?? ""}
              </p>
              {listing.user.city && (
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {listing.user.city}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CTA fixe en bas */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 max-w-lg mx-auto">
        {showPhone ? (
          <a
            href={`tel:${listing.user.phone}`}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl py-4 font-bold text-lg"
          >
            <Phone className="w-5 h-5" />
            {listing.user.phone}
          </a>
        ) : (
          <Button
            onClick={handleContact}
            className="w-full h-14 text-base font-bold rounded-xl"
          >
            <Phone className="w-5 h-5 mr-2" />
            Contacter le vendeur
          </Button>
        )}
      </div>
    </MainLayout>
  );
}

function ListingDetailSkeleton() {
  return (
    <MainLayout hideBottomNav>
      <Skeleton className="aspect-square w-full" />
      <div className="px-4 py-4 space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-48" />
        <div className="border-t border-border" />
        <Skeleton className="h-24 w-full" />
      </div>
    </MainLayout>
  );
}
