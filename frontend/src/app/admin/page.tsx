"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { adminService } from "@/services/admin.service";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  CheckCircle,
  Package,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: adminService.getStats,
    refetchInterval: 60000,
  });

  const cards = [
    {
      label: "Utilisateurs",
      value: stats?.totalUsers ?? 0,
      sub: `+${stats?.newUsersToday ?? 0} aujourd'hui`,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Total annonces",
      value: stats?.totalListings ?? 0,
      sub: `+${stats?.newListingsToday ?? 0} aujourd'hui`,
      icon: Package,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Annonces actives",
      value: stats?.activeListings ?? 0,
      sub: `${stats?.soldListings ?? 0} vendues`,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Signalements",
      value: stats?.pendingReports ?? 0,
      sub: "En attente",
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-50",
      href: "/admin/reports",
      urgent: (stats?.pendingReports ?? 0) > 0,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black">Dashboard</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map(
          ({ label, value, sub, icon: Icon, color, bg, href, urgent }) => (
            <div
              key={label}
              className={`bg-background rounded-2xl p-4 border transition-all ${
                urgent ? "border-red-300 shadow-sm" : "border-border"
              }`}
            >
              {isLoading ? (
                <Skeleton className="h-20 w-full" />
              ) : (
                <>
                  <div
                    className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}
                  >
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <p className="text-2xl font-black">{value}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{sub}</p>
                  {href && (
                    <Link
                      href={href}
                      className="text-xs text-primary font-medium mt-2 block"
                    >
                      Voir →
                    </Link>
                  )}
                </>
              )}
            </div>
          ),
        )}
      </div>

      {/* Top catégories */}
      <div className="bg-background border border-border rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-muted-foreground" />
          <h2 className="font-bold">Top catégories</h2>
        </div>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {stats?.topCategories.map((cat, index) => (
              <div key={cat.name} className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground w-4">
                  {index + 1}
                </span>
                <span className="text-base">{cat.icon}</span>
                <span className="text-sm font-medium flex-1">{cat.name}</span>
                <span className="text-sm text-muted-foreground">
                  {cat.count} annonces
                </span>
                <div
                  className="h-1.5 bg-primary rounded-full"
                  style={{
                    width: `${Math.max(
                      8,
                      (cat.count / (stats.topCategories[0]?.count || 1)) * 80,
                    )}px`,
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
