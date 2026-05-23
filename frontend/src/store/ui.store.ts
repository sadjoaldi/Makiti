import { ListingFilters } from "@/types";
import { create } from "zustand";

interface UIState {
  filters: ListingFilters;
  setFilters: (filters: Partial<ListingFilters>) => void;
  resetFilters: () => void;
}

const defaultFilters: ListingFilters = {
  page: 1,
  limit: 20,
  sortBy: "recent",
};

export const useUIStore = create<UIState>((set) => ({
  filters: defaultFilters,

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters, page: 1 },
    })),

  resetFilters: () => set({ filters: defaultFilters }),
}));
