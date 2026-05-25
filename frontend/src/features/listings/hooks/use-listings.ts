import { listingsService } from "@/services/listings.service";
import { ListingFilters } from "@/types";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

interface CreateListingPayload {
  title: string;
  description: string;
  price: number;
  city: string;
  district?: string;
  condition: "NEW" | "USED";
  categoryId: string;
  status?: string;
}

export const listingKeys = {
  all: ["listings"] as const,
  lists: () => [...listingKeys.all, "list"] as const,
  list: (filters: ListingFilters) => [...listingKeys.lists(), filters] as const,
  details: () => [...listingKeys.all, "detail"] as const,
  detail: (slug: string) => [...listingKeys.details(), slug] as const,
  mine: () => [...listingKeys.all, "mine"] as const,
};

export function useListings(filters: ListingFilters = {}) {
  return useQuery({
    queryKey: listingKeys.list(filters),
    queryFn: () => listingsService.getAll(filters),
  });
}

export function useInfiniteListings(filters: ListingFilters = {}) {
  return useInfiniteQuery({
    queryKey: listingKeys.list(filters),
    queryFn: ({ pageParam = 1 }) =>
      listingsService.getAll({ ...filters, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.meta;
      return page < totalPages ? page + 1 : undefined;
    },
  });
}

export function useListing(slug: string) {
  return useQuery({
    queryKey: listingKeys.detail(slug),
    queryFn: () => listingsService.getBySlug(slug),
    enabled: !!slug,
  });
}

export function useMyListings() {
  return useQuery({
    queryKey: listingKeys.mine(),
    queryFn: listingsService.getMyListings,
  });
}

export function useDeleteListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: listingsService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listingKeys.all });
      toast.success("Annonce supprimée");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression");
    },
  });
}

export function useUpdateListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateListingPayload>;
    }) => listingsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listingKeys.all });
      toast.success("Annonce mise à jour ✅");
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour");
    },
  });
}

export function useMarkAsSold() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (id: string) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      listingsService.update(id, { status: "SOLD" } as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listingKeys.all });
      toast.success("Annonce marquée comme vendue ✅");
      router.push("/profile/listings");
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour");
    },
  });
}
