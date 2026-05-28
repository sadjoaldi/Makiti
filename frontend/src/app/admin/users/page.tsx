"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { adminService } from "@/services/admin.service";
import { formatDate } from "@/utils/format";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ShieldCheck, ShieldOff, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "users", page],
    queryFn: () => adminService.getAllUsers({ page, limit: 20 }),
  });

  const { mutate: toggleVerified } = useMutation({
    mutationFn: adminService.toggleUserVerified,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      toast.success("Statut de vérification mis à jour");
    },
  });

  const { mutate: deleteUser } = useMutation({
    mutationFn: adminService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      toast.success("Utilisateur supprimé");
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black">Utilisateurs</h1>
        <span className="text-sm text-muted-foreground">
          {data?.meta.total ?? 0} utilisateurs
        </span>
      </div>

      <div className="space-y-3">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))
          : data?.data.map((user) => (
              <div
                key={user.id}
                className="bg-background border border-border rounded-xl p-3 flex items-center gap-3"
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-black text-primary shrink-0">
                  {user.firstName[0].toUpperCase()}
                </div>

                {/* Infos */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-medium text-sm truncate">
                      {user.firstName} {user.lastName ?? ""}
                    </p>
                    {user.isAdmin && (
                      <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(user._count?.listings ?? 0).toString()} annonces ·{" "}
                    {formatDate(user.createdAt)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full font-medium",
                      user.isVerified
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700",
                    )}
                  >
                    {user.isVerified ? "Vérifié" : "Non vérifié"}
                  </span>
                  {!user.isAdmin && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => toggleVerified(user.id)}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                        title={
                          user.isVerified ? "Retirer vérification" : "Vérifier"
                        }
                      >
                        {user.isVerified ? (
                          <ShieldOff className="w-3.5 h-3.5 text-muted-foreground" />
                        ) : (
                          <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Supprimer cet utilisateur ?")) {
                            deleteUser(user.id);
                          }
                        }}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                      </button>
                    </div>
                  )}
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
