import { categoriesService } from "@/services/categories.service";
import { useQuery } from "@tanstack/react-query";

export const categoryKeys = {
  all: ["categories"] as const,
};

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: categoriesService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes — les catégories changent rarement
  });
}
