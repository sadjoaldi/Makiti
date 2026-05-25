"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  useDeleteListing,
  useMarkAsSold,
} from "@/features/listings/hooks/use-listings";
import { Listing } from "@/types";
import { CheckCircle, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ManageListingSheetProps {
  listing: Listing;
  open: boolean;
  onClose: () => void;
}

export function ManageListingSheet({
  listing,
  open,
  onClose,
}: ManageListingSheetProps) {
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSoldConfirm, setShowSoldConfirm] = useState(false);

  const { mutate: deleteListing, isPending: isDeleting } = useDeleteListing();
  const { mutate: markAsSold, isPending: isMarkingSold } = useMarkAsSold();

  const handleDelete = () => {
    deleteListing(listing.id, {
      onSuccess: () => {
        onClose();
        router.push("/profile/listings");
      },
    });
  };

  const handleMarkAsSold = () => {
    markAsSold(listing.id, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent side="bottom" className="rounded-t-2xl pb-8">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-left">Gérer mon annonce</SheetTitle>
            <p className="text-sm text-muted-foreground text-left truncate">
              {listing.title}
            </p>
          </SheetHeader>

          <div className="flex flex-col gap-3">
            {/* Modifier */}
            <button
              onClick={() => {
                onClose();
                router.push(`/listings/${listing.slug}/edit`);
              }}
              className="flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-muted transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Pencil className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-sm">Modifier lannonce</p>
                <p className="text-xs text-muted-foreground">
                  Titre, description, prix, ville
                </p>
              </div>
            </button>

            {/* Marquer comme vendu */}
            {listing.status === "ACTIVE" && (
              <button
                onClick={() => setShowSoldConfirm(true)}
                className="flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-muted transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-sm">Marquer comme vendu</p>
                  <p className="text-xs text-muted-foreground">
                    Lannonce restera visible 30 jours
                  </p>
                </div>
              </button>
            )}

            {/* Supprimer */}
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-4 p-4 rounded-xl border border-destructive/30 hover:bg-destructive/5 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-sm text-destructive">
                  Supprimer lannonce
                </p>
                <p className="text-xs text-muted-foreground">
                  Action irréversible
                </p>
              </div>
            </button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Confirmation suppression */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="max-w-sm mx-4 rounded-2xl">
          <DialogHeader>
            <DialogTitle>Supprimer lannonce ?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Cette action est irréversible. L annonce et toutes ses photos seront
            supprimées définitivement.
          </p>
          <div className="flex flex-col gap-2 mt-2">
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="w-full"
            >
              {isDeleting ? "Suppression..." : "Oui, supprimer"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
              className="w-full"
            >
              Annuler
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation vendu */}
      <Dialog open={showSoldConfirm} onOpenChange={setShowSoldConfirm}>
        <DialogContent className="max-w-sm mx-4 rounded-2xl">
          <DialogHeader>
            <DialogTitle>Marquer comme vendu ?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Lannonce sera marquée comme vendue et restera visible pendant 30
            jours avant dêtre supprimée automatiquement.
          </p>
          <div className="flex flex-col gap-2 mt-2">
            <Button
              onClick={handleMarkAsSold}
              disabled={isMarkingSold}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isMarkingSold ? "Mise à jour..." : "Oui, c'est vendu ! 🎉"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowSoldConfirm(false)}
              className="w-full"
            >
              Annuler
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
