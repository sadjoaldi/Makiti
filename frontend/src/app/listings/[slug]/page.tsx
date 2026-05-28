"use client";

import { MainLayout } from "@/components/common/main-layout";
import { ListingCard } from "@/components/listings/listing-card";
import { ManageListingSheet } from "@/components/listings/manage-listing-sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCheckFavorite,
  useToggleFavorite,
} from "@/features/favorites/hooks/use-favorites";
import { ListingCta } from "@/features/listings/components/listing-cta";
import { ListingImages } from "@/features/listings/components/listing-images";
import { ListingInfo } from "@/features/listings/components/listing-info";
import {
  useListing,
  useListings,
} from "@/features/listings/hooks/use-listings";
import { cn } from "@/lib/utils";
import { api } from "@/services/api";
import { useAuthStore } from "@/store/auth.store";
import { ArrowLeft, Heart, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { toast } from "sonner";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const REPORT_REASONS = [
  "Prix suspect",
  "Contenu inapproprié",
  "Arnaque / Fraude",
  "Annonce dupliquée",
  "Produit interdit",
  "Autre",
];

export default function ListingDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [showPhone, setShowPhone] = useState(false);
  const [showManageSheet, setShowManageSheet] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);

  const { data: listing, isLoading } = useListing(slug);
  const { data: favoriteData } = useCheckFavorite(listing?.id ?? "");
  const { mutate: toggleFavorite, isPending } = useToggleFavorite();

  const { data: similarData } = useListings({
    categoryId: listing?.categoryId,
    limit: 4,
  });

  const similarListings =
    similarData?.data.filter((l) => l.id !== listing?.id).slice(0, 4) ?? [];

  const isFavorited = favoriteData?.favorited ?? false;
  const isOwner = user?.id === listing?.userId;

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

  const handleReport = async (reason: string) => {
    if (!isAuthenticated) {
      toast.error("Connecte-toi pour signaler");
      setShowReportDialog(false);
      router.push("/auth/login");
      return;
    }
    try {
      await api.post(`/listings/${listing?.id}/report`, { reason });
      toast.success("Signalement envoyé, merci !");
    } catch {
      toast.error("Erreur lors du signalement");
    }
    setShowReportDialog(false);
  };

  if (isLoading) return <ListingDetailSkeleton />;
  if (!listing) return null;

  return (
    <MainLayout hideBottomNav>
      {/* Header mobile */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border lg:hidden">
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

      {/* Layout mobile */}
      <div className="lg:hidden">
        <div className="bg-muted">
          <ListingImages listing={listing} />
        </div>
        <div className="px-4 py-4 space-y-4 pb-32">
          <ListingInfo
            listing={listing}
            isOwner={isOwner}
            onReport={() => setShowReportDialog(true)}
            onVendorClick={() => router.push(`/users/${listing.user.id}`)}
          />
          {similarListings.length > 0 && (
            <div>
              <div className="border-t border-border mb-4" />
              <h2 className="font-bold mb-3">Annonces similaires</h2>
              <div className="grid grid-cols-2 gap-3">
                {similarListings.map((similar) => (
                  <ListingCard key={similar.id} listing={similar} />
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 max-w-lg mx-auto">
          <ListingCta
            listing={listing}
            isOwner={isOwner}
            showPhone={showPhone}
            onContact={handleContact}
            onManage={() => setShowManageSheet(true)}
          />
        </div>
      </div>

      {/* Layout desktop */}
      <div className="hidden lg:block py-8">
        <div className="flex gap-8 items-start">
          {/* Colonne gauche — images */}
          <div className="w-[52%] shrink-0">
            <ListingImages listing={listing} />
          </div>

          {/* Colonne droite — infos + CTA */}
          <div className="flex-1 min-w-0 space-y-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour
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
                      isFavorited
                        ? "fill-red-500 text-red-500"
                        : "text-foreground",
                    )}
                  />
                </button>
              </div>
            </div>

            <ListingInfo
              listing={listing}
              isOwner={isOwner}
              onReport={() => setShowReportDialog(true)}
              onVendorClick={() => router.push(`/users/${listing.user.id}`)}
            />

            <div className="pt-2">
              <ListingCta
                listing={listing}
                isOwner={isOwner}
                showPhone={showPhone}
                onContact={handleContact}
                onManage={() => setShowManageSheet(true)}
              />
            </div>
          </div>
        </div>

        {/* Annonces similaires desktop */}
        {similarListings.length > 0 && (
          <div className="mt-8">
            <div className="border-t border-border mb-6" />
            <h2 className="font-bold text-lg mb-4">Annonces similaires</h2>
            <div className="grid grid-cols-4 gap-4">
              {similarListings.map((similar) => (
                <ListingCard key={similar.id} listing={similar} />
              ))}
            </div>
          </div>
        )}
      </div>

      {listing && (
        <ManageListingSheet
          listing={listing}
          open={showManageSheet}
          onClose={() => setShowManageSheet(false)}
        />
      )}

      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="max-w-sm mx-4 rounded-2xl">
          <DialogHeader>
            <DialogTitle>Signaler cette annonce</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Pourquoi tu signales cette annonce ?
            </p>
          </DialogHeader>
          <div className="flex flex-col gap-2 mt-2">
            {REPORT_REASONS.map((reason) => (
              <button
                key={reason}
                onClick={() => handleReport(reason)}
                className="w-full text-left px-4 py-3 rounded-xl border border-border hover:bg-muted transition-colors text-sm font-medium"
              >
                {reason}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}

function ListingDetailSkeleton() {
  return (
    <MainLayout hideBottomNav>
      <div className="lg:hidden">
        <Skeleton className="aspect-square w-full" />
        <div className="px-4 py-4 space-y-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-4 w-48" />
          <div className="border-t border-border" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
      <div className="hidden lg:flex gap-8 py-8">
        <Skeleton className="w-[52%] aspect-square rounded-2xl" />
        <div className="flex-1 space-y-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-14 w-full rounded-xl" />
        </div>
      </div>
    </MainLayout>
  );
}
