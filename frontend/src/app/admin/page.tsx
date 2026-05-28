"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { adminService } from "@/services/admin.service";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Package, Tag, Users } from "lucide-react";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: adminService.getStats,
  });

  const cards = [
    {
      label: "Utilisateurs",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Total annonces",
      value: stats?.totalListings ?? 0,
      icon: Package,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Annonces actives",
      value: stats?.activeListings ?? 0,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Annonces vendues",
      value: stats?.soldListings ?? 0,
      icon: Tag,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="bg-background rounded-2xl p-4 border border-border"
          >
            {isLoading ? (
              <Skeleton className="h-16 w-full" />
            ) : (
              <>
                <div
                  className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}
                >
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <p className="text-2xl font-black">{value}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
