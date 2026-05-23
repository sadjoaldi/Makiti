import { Listing } from "@/types";
import { api } from "./api";

export const favoritesService = {
  getMyFavorites: async (): Promise<Listing[]> => {
    const { data } = await api.get("/favorites");
    return data;
  },

  toggle: async (listingId: string): Promise<{ favorited: boolean }> => {
    const { data } = await api.post(`/favorites/${listingId}`);
    return data;
  },

  check: async (listingId: string): Promise<{ favorited: boolean }> => {
    const { data } = await api.get(`/favorites/${listingId}/check`);
    return data;
  },
};
