"use client";

import { MainLayout } from "@/components/common/main-layout";
import { ManageListingSheet } from "@/components/listings/manage-listing-sheet";
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

  const { user } = useAuthStore();
  const isOwner = user?.id === listing?.userId;
  const [showManageSheet, setShowManageSheet] = useState(false);

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
        {isOwner ? (
          <Button
            onClick={() => setShowManageSheet(true)}
            variant="outline"
            className="w-full h-14 text-base font-bold rounded-xl"
          >
            ✏️ Gérer mon annonce
          </Button>
        ) : showPhone ? (
          <div className="flex flex-col gap-2">
            <a
              href={`tel:${listing.user.phone}`}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl py-4 font-bold text-lg"
            >
              <Phone className="w-5 h-5" />
              {listing.user.phone}
            </a>

            <a
              href={`https://wa.me/${listing.user.phone.replace(/\D/g, "")}?text=Bonjour, je suis intéressé par votre annonce "${listing.title}" sur Makiti.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-green-500 text-white rounded-xl py-4 font-bold text-lg"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
          </div>
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

      {/* Manage Sheet */}
      {listing && (
        <ManageListingSheet
          listing={listing}
          open={showManageSheet}
          onClose={() => setShowManageSheet(false)}
        />
      )}
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
