import { Listing, ListingFilters, PaginatedResponse } from "@/types";
import { api } from "./api";

export const listingsService = {
  getAll: async (
    filters: ListingFilters = {},
  ): Promise<PaginatedResponse<Listing>> => {
    const { data } = await api.get("/listings", { params: filters });
    return data;
  },

  getBySlug: async (slug: string): Promise<Listing> => {
    const { data } = await api.get(`/listings/${slug}`);
    return data;
  },

  create: async (payload: FormData): Promise<Listing> => {
    const { data } = await api.post("/listings", payload);
    return data;
  },

  update: async (id: string, payload: Partial<Listing>): Promise<Listing> => {
    const { data } = await api.patch(`/listings/${id}`, payload);
    return data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/listings/${id}`);
  },

  getMyListings: async (): Promise<Listing[]> => {
    const { data } = await api.get("/listings/me");
    return data;
  },
};
