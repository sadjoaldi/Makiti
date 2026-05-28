"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { adminService } from "@/services/admin.service";
import { formatPrice, formatRelativeDate } from "@/utils/format";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const STATUS_FILTERS = [
  { value: "", label: "Toutes" },
  { value: "ACTIVE", label: "Actives" },
  { value: "SOLD", label: "Vendues" },
  { value: "PENDING", label: "En attente" },
  { value: "ARCHIVED", label: "Archivées" },
];

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  SOLD: "bg-blue-100 text-blue-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  ARCHIVED: "bg-gray-100 text-gray-700",
};

export default function AdminListingsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "listings", statusFilter, page],
    queryFn: () =>
      adminService.getAllListings({
        page,
        limit: 20,
        status: statusFilter || undefined,
      }),
  });

  const { mutate: deleteListing } = useMutation({
    mutationFn: adminService.deleteListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      toast.success("Annonce supprimée");
    },
  });

  const { mutate: updateStatus } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminService.updateListingStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      toast.success("Statut mis à jour");
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black">Annonces</h1>
        <span className="text-sm text-muted-foreground">
          {data?.meta.total ?? 0} annonces
        </span>
      </div>

      {/* Filtres */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => {
              setStatusFilter(f.value);
              setPage(1);
            }}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all",
              statusFilter === f.value
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:border-primary/50",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Liste */}
      <div className="space-y-3">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))
          : data?.data.map((listing) => (
              <div
                key={listing.id}
                className="bg-background border border-border rounded-xl p-3 flex items-center gap-3"
              >
                {/* Image */}
                <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-muted shrink-0">
                  {listing.images[0] ? (
                    <Image
                      src={listing.images[0].url}
                      alt={listing.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                      📷
                    </div>
                  )}
                </div>

                {/* Infos */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {listing.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {listing.user.firstName} · {formatPrice(listing.price)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatRelativeDate(listing.createdAt)}
                  </p>
                </div>

                {/* Status + actions */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full font-medium",
                      STATUS_COLORS[listing.status] ??
                        "bg-gray-100 text-gray-700",
                    )}
                  >
                    {listing.status}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => router.push(`/listings/${listing.slug}`)}
                      className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Supprimer cette annonce ?")) {
                          deleteListing(listing.id);
                        }
                      }}
                      className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-destructive" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
      </div>

      {/* Pagination */}
      {data && data.meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Précédent
          </Button>
          <span className="text-sm text-muted-foreground">
            {page} / {data.meta.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setPage((p) => Math.min(data.meta.totalPages, p + 1))
            }
            disabled={page === data.meta.totalPages}
          >
            Suivant
          </Button>
        </div>
      )}
    </div>
  );
}
