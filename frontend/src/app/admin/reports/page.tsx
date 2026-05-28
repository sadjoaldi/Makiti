"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { adminService } from "@/services/admin.service";
import { formatRelativeDate } from "@/utils/format";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, Eye, XCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const STATUS_FILTERS = [
  { value: "", label: "Tous" },
  { value: "PENDING", label: "En attente" },
  { value: "REVIEWED", label: "Traités" },
  { value: "DISMISSED", label: "Ignorés" },
];

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  REVIEWED: "bg-green-100 text-green-700",
  DISMISSED: "bg-gray-100 text-gray-700",
};

export default function AdminReportsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "reports", statusFilter, page],
    queryFn: () =>
      adminService.getReports({
        page,
        limit: 20,
        status: statusFilter || undefined,
      }),
  });

  const { mutate: updateStatus } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminService.updateReportStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      toast.success("Signalement mis à jour");
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black">Signalements</h1>
        <span className="text-sm text-muted-foreground">
          {data?.meta.total ?? 0} signalements
        </span>
      </div>

      {/* Filtres */}
      <div className="flex gap-2">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => {
              setStatusFilter(f.value);
              setPage(1);
            }}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
              statusFilter === f.value
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Liste */}
      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))
        ) : data?.data.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-3xl mb-2">✅</p>
            <p className="font-medium">Aucun signalement</p>
          </div>
        ) : (
          data?.data.map((report) => (
            <div
              key={report.id}
              className="bg-background border border-border rounded-xl p-3 space-y-3"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-sm">{report.reason}</p>
                  <p className="text-xs text-muted-foreground">
                    Par {report.user.firstName} ·{" "}
                    {formatRelativeDate(report.createdAt)}
                  </p>
                </div>
                <span
                  className={cn(
                    "text-xs px-2 py-0.5 rounded-full font-medium shrink-0",
                    STATUS_COLORS[report.status],
                  )}
                >
                  {report.status}
                </span>
              </div>

              {/* Annonce concernée */}
              <div className="flex items-center gap-3 bg-muted rounded-xl p-2">
                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-background shrink-0">
                  {report.listing.images[0] ? (
                    <Image
                      src={report.listing.images[0].url}
                      alt={report.listing.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs">
                      📷
                    </div>
                  )}
                </div>
                <p className="text-sm font-medium flex-1 truncate">
                  {report.listing.title}
                </p>
                <button
                  onClick={() =>
                    router.push(`/listings/${report.listing.slug}`)
                  }
                  className="p-1.5 rounded-lg hover:bg-background transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>

              {/* Actions */}
              {report.status === "PENDING" && (
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      updateStatus({ id: report.id, status: "REVIEWED" })
                    }
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-green-50 text-green-700 text-xs font-medium hover:bg-green-100 transition-colors"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Traiter
                  </button>
                  <button
                    onClick={() =>
                      updateStatus({ id: report.id, status: "DISMISSED" })
                    }
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gray-50 text-gray-700 text-xs font-medium hover:bg-gray-100 transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Ignorer
                  </button>
                </div>
              )}
            </div>
          ))
        )}
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
