import { listingKeys } from "@/features/listings/hooks/use-listings";
import { usersService } from "@/services/users.service";
import { useAuthStore } from "@/store/auth.store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface ApiErrorResponse {
  message: string;
}

export const profileKeys = {
  me: ["profile", "me"] as const,
};

export function useUpdateProfile() {
  const { setUser } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersService.updateMe,
    onSuccess: (data) => {
      setUser(data);
      queryClient.invalidateQueries({ queryKey: profileKeys.me });
      toast.success("Profil mis à jour ✅");
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const message =
        error?.response?.data?.message || "Erreur lors de la mise à jour";
      toast.error(message);
    },
  });
}

export function useUpdateAvatar() {
  const { setUser, user } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("avatar", file);
      const { api } = await import("@/services/api");
      const { data } = await api.post("/uploads/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data as { url: string };
    },
    onSuccess: (data) => {
      if (user) setUser({ ...user, avatar: data.url });
      // Invalide le cache listings pour rafraîchir l'avatar du vendeur
      queryClient.invalidateQueries({ queryKey: listingKeys.all });
      queryClient.invalidateQueries({ queryKey: profileKeys.me });
      toast.success("Photo de profil mise à jour ✅");
    },
    onError: () => {
      toast.error("Erreur lors de l'upload");
    },
  });
}
