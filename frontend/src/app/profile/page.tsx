"use client";

import { MainLayout } from "@/components/common/main-layout";
import { ListingCard } from "@/components/listings/listing-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyListings } from "@/features/listings/hooks/use-listings";
import { useAuthStore } from "@/store/auth.store";
import {
  ChevronRight,
  Heart,
  Key,
  LogOut,
  Package,
  Settings,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { data: myListings, isLoading } = useMyListings();

  useEffect(() => {
    if (!isAuthenticated) router.push("/auth/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) return null;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const menuItems = [
    { icon: Package, label: "Mes annonces", href: "/profile/listings" },
    { icon: Heart, label: "Mes favoris", href: "/favorites" },
    { icon: Settings, label: "Modifier mon profil", href: "/profile/edit" },
    {
      icon: Key,
      label: "Modifier mon mot de passe",
      href: "/profile/password",
    },
  ];

  return (
    <MainLayout title="Mon profil" showHeader>
      <div className="pt-4 lg:pt-6 pb-8">
        {/* ───── MOBILE ───── */}
        <div className="lg:hidden space-y-6">
          {/* Avatar + infos */}
          <div className="px-4 flex items-center gap-4">
            <Avatar user={user} />
            <UserInfo user={user} />
          </div>

          {/* Stats */}
          <div className="px-4 grid grid-cols-2 gap-3">
            <StatCard value={myListings?.length ?? 0} label="Annonces" />
            <StatCard value={user.isVerified ? "✅" : "❌"} label="Vérifié" />
          </div>

          {/* Menu */}
          <div className="px-4 space-y-2">
            {menuItems.map(({ icon: Icon, label, href }) => (
              <button
                key={href}
                onClick={() => router.push(href)}
                className="w-full flex items-center gap-3 p-4 bg-muted rounded-xl hover:bg-muted/80 transition-colors"
              >
                <Icon className="w-5 h-5 text-muted-foreground" />
                <span className="flex-1 text-left font-medium text-sm">
                  {label}
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            ))}
          </div>

          {/* Annonces preview */}
          {(isLoading || (myListings && myListings.length > 0)) && (
            <div className="space-y-3">
              <div className="px-4 flex items-center justify-between">
                <h2 className="font-bold">Mes annonces récentes</h2>
                {myListings && myListings.length > 2 && (
                  <button
                    onClick={() => router.push("/profile/listings")}
                    className="text-sm text-primary font-medium"
                  >
                    Voir tout
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3 px-4">
                {isLoading
                  ? [1, 2].map((i) => (
                      <Skeleton key={i} className="aspect-square rounded-xl" />
                    ))
                  : myListings
                      ?.slice(0, 2)
                      .map((listing) => (
                        <ListingCard key={listing.id} listing={listing} />
                      ))}
              </div>
            </div>
          )}

          {/* Logout */}
          <div className="px-4">
            <LogoutButton onClick={handleLogout} />
          </div>
        </div>

        {/* ───── DESKTOP ───── */}
        <div className="hidden lg:flex gap-8 items-start">
          {/* Colonne gauche — infos + menu */}
          <div className="w-80 shrink-0 space-y-4">
            {/* Carte profil */}
            <div className="bg-background border border-border rounded-2xl p-6 space-y-4">
              <div className="flex flex-col items-center text-center">
                <Avatar user={user} size="lg" />
                <div className="mt-3">
                  <p className="font-bold text-lg">
                    {user.firstName} {user.lastName ?? ""}
                  </p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  {user.city && (
                    <p className="text-sm text-muted-foreground">{user.city}</p>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <StatCard value={myListings?.length ?? 0} label="Annonces" />
                <StatCard
                  value={user.isVerified ? "✅" : "❌"}
                  label="Vérifié"
                />
              </div>
            </div>

            {/* Menu */}
            <div className="bg-background border border-border rounded-2xl p-2 space-y-1">
              {menuItems.map(({ icon: Icon, label, href }) => (
                <button
                  key={href}
                  onClick={() => router.push(href)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors"
                >
                  <Icon className="w-5 h-5 text-muted-foreground" />
                  <span className="flex-1 text-left font-medium text-sm">
                    {label}
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              ))}
            </div>

            <LogoutButton onClick={handleLogout} />
          </div>

          {/* Colonne droite — annonces */}
          <div className="flex-1 min-w-0 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg">Mes annonces</h2>
              {myListings && myListings.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  {myListings.length} annonce{myListings.length > 1 ? "s" : ""}
                </span>
              )}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="aspect-square rounded-xl" />
                ))}
              </div>
            ) : myListings && myListings.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {myListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground border border-dashed border-border rounded-2xl">
                <Package className="w-12 h-12 opacity-20 mb-3" />
                <p className="font-medium">
                  Aucune annonce pour l&apos;instant
                </p>
                <button
                  onClick={() => router.push("/publish")}
                  className="text-sm text-primary font-medium mt-2"
                >
                  Publier une annonce
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

// ───── Composants internes ─────

function Avatar({
  user,
  size = "md",
}: {
  user: { avatar?: string; firstName: string };
  size?: "md" | "lg";
}) {
  const dim = size === "lg" ? "w-20 h-20 text-3xl" : "w-16 h-16 text-2xl";
  return (
    <div
      className={`relative ${dim} rounded-full bg-primary/10 flex items-center justify-center font-black text-primary shrink-0 overflow-hidden`}
    >
      {user.avatar ? (
        <Image
          src={user.avatar}
          alt={user.firstName}
          fill
          className="object-cover"
        />
      ) : (
        user.firstName[0].toUpperCase()
      )}
    </div>
  );
}

function UserInfo({
  user,
}: {
  user: { firstName: string; lastName?: string; email: string; city?: string };
}) {
  return (
    <div className="flex-1 min-w-0">
      <p className="font-bold text-lg truncate">
        {user.firstName} {user.lastName ?? ""}
      </p>
      <p className="text-sm text-muted-foreground truncate">{user.email}</p>
      {user.city && (
        <p className="text-sm text-muted-foreground">{user.city}</p>
      )}
    </div>
  );
}

function StatCard({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="bg-muted rounded-xl p-4 text-center">
      <p className="text-2xl font-black text-primary">{value}</p>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

function LogoutButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border border-destructive/30 text-destructive hover:bg-destructive/5 transition-colors"
    >
      <LogOut className="w-4 h-4" />
      <span className="font-medium text-sm">Se déconnecter</span>
    </button>
  );
}
