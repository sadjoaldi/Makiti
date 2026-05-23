import { favoritesService } from "@/services/favorites.service";
import { useAuthStore } from "@/store/auth.store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const favoriteKeys = {
  all: ["favorites"] as const,
  check: (listingId: string) => ["favorites", "check", listingId] as const,
};

export function useMyFavorites() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: favoriteKeys.all,
    queryFn: favoritesService.getMyFavorites,
    enabled: isAuthenticated,
  });
}

export function useCheckFavorite(listingId: string) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: favoriteKeys.check(listingId),
    queryFn: () => favoritesService.check(listingId),
    enabled: isAuthenticated && !!listingId,
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();

  return useMutation({
    mutationFn: (listingId: string) => {
      if (!isAuthenticated) throw new Error("Non authentifié");
      return favoritesService.toggle(listingId);
    },
    onSuccess: (data, listingId) => {
      queryClient.invalidateQueries({ queryKey: favoriteKeys.all });
      queryClient.invalidateQueries({
        queryKey: favoriteKeys.check(listingId),
      });
      toast.success(
        data.favorited ? "Ajouté aux favoris" : "Retiré des favoris",
      );
    },
    onError: (error: Error) => {
      if (error.message === "Non authentifié") {
        toast.error("Connecte-toi pour ajouter des favoris");
      }
    },
  });
}
