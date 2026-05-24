import { listingsService } from "@/services/listings.service";
import { uploadsService } from "@/services/uploads.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { listingKeys } from "./use-listings";

interface PublishPayload {
  title: string;
  description: string;
  price: number;
  city: string;
  district?: string;
  condition: "NEW" | "USED";
  categoryId: string;
  images: File[];
}

interface ApiErrorResponse {
  message: string;
}

export function usePublishListing() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ images, ...listingData }: PublishPayload) => {
      // 1. Créer l'annonce
      const listing = await listingsService.create(listingData);

      // 2. Upload les images si présentes
      if (images.length > 0) {
        await uploadsService.uploadListingImages(listing.id, images);
      }

      return listing;
    },
    onSuccess: (listing) => {
      queryClient.invalidateQueries({ queryKey: listingKeys.all });
      toast.success("Annonce publiée ! 🎉");
      router.push(`/listings/${listing.slug}`);
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const message =
        error?.response?.data?.message || "Erreur lors de la publication";
      toast.error(message);
    },
  });
}
