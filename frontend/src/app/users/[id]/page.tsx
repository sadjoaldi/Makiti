"use client";

import { Header } from "@/components/common/header";
import { ListingGrid } from "@/components/listings/listing-grid";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/services/api";
import { Listing, User } from "@/types";
import { formatDate } from "@/utils/format";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, MapPin, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { use } from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

type SellerUser = User & { _count: { listings: number } };

export default function UserProfilePage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["users", id],
    queryFn: async (): Promise<SellerUser> => {
      const { data } = await api.get(`/users/${id}`);
      return data;
    },
  });

  const { data: listings, isLoading: isLoadingListings } = useQuery({
    queryKey: ["users", id, "listings"],
    queryFn: async (): Promise<Listing[]> => {
      const { data } = await api.get(`/users/${id}/listings`);
      return data;
    },
    enabled: !!id,
  });

  return (
    <div className="min-h-screen bg-background">
      {/* ───── MOBILE ───── */}
      <div className="lg:hidden max-w-lg mx-auto pb-8">
        <div className="sticky top-0 z-40 bg-background border-b border-border">
          <div className="flex items-center h-14 px-4 gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-bold flex-1">Profil vendeur</h1>
          </div>
        </div>

        {isLoadingUser ? (
          <div className="px-4 py-6 space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="w-20 h-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
        ) : user ? (
          <div className="space-y-6">
            <div className="px-4 py-6 space-y-4">
              <SellerInfo user={user} />
              <SellerStats user={user} />
            </div>
            <div className="space-y-3">
              <div className="px-4">
                <h2 className="font-bold">
                  Annonces de {user.firstName}
                  {listings && listings.length > 0 && (
                    <span className="text-muted-foreground font-normal text-sm ml-2">
                      ({listings.length})
                    </span>
                  )}
                </h2>
              </div>
              <ListingGrid listings={listings} isLoading={isLoadingListings} />
            </div>
          </div>
        ) : null}
      </div>

      {/* ───── DESKTOP ───── */}
      <div className="hidden lg:block">
        <Header />
        <main className="max-w-7xl mx-auto px-6 py-6">
          {isLoadingUser ? (
            <div className="flex gap-8">
              <Skeleton className="w-80 h-64 rounded-2xl shrink-0" />
              <div className="flex-1 grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="aspect-square rounded-xl" />
                ))}
              </div>
            </div>
          ) : user ? (
            <div className="flex gap-8 items-start">
              {/* Colonne gauche — carte vendeur */}
              <div className="w-80 shrink-0">
                <div className="bg-background border border-border rounded-2xl p-6 space-y-4 sticky top-20">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative w-24 h-24 rounded-full bg-muted flex items-center justify-center text-4xl font-black overflow-hidden shrink-0">
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
                    <div className="mt-3">
                      <div className="flex items-center gap-2 justify-center flex-wrap">
                        <p className="font-bold text-xl">
                          {user.firstName} {user.lastName ?? ""}
                        </p>
                        {user.isVerified && (
                          <div className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span className="text-xs font-medium">Vérifié</span>
                          </div>
                        )}
                      </div>
                      {user.city && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1 justify-center mt-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {user.city}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        Membre depuis {formatDate(user.createdAt)}
                      </p>
                    </div>
                  </div>
                  <SellerStats user={user} />
                </div>
              </div>

              {/* Colonne droite — annonces */}
              <div className="flex-1 min-w-0 space-y-4">
                <h2 className="font-bold text-lg">
                  Annonces de {user.firstName}
                  {listings && listings.length > 0 && (
                    <span className="text-muted-foreground font-normal text-sm ml-2">
                      ({listings.length})
                    </span>
                  )}
                </h2>
                <ListingGrid
                  listings={listings}
                  isLoading={isLoadingListings}
                />
              </div>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}

function SellerInfo({ user }: { user: SellerUser }) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative w-20 h-20 rounded-full bg-muted flex items-center justify-center text-3xl font-black overflow-hidden shrink-0">
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
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-bold text-xl">
            {user.firstName} {user.lastName ?? ""}
          </p>
          {user.isVerified && (
            <div className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Vérifié</span>
            </div>
          )}
        </div>
        {user.city && (
          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
            <MapPin className="w-3.5 h-3.5" />
            {user.city}
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          Membre depuis {formatDate(user.createdAt)}
        </p>
      </div>
    </div>
  );
}

function SellerStats({ user }: { user: SellerUser }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-muted rounded-xl p-4 text-center">
        <p className="text-2xl font-black text-primary">
          {user._count?.listings ?? 0}
        </p>
        <p className="text-sm text-muted-foreground mt-1">Annonces</p>
      </div>
      <div className="bg-muted rounded-xl p-4 text-center">
        <p className="text-2xl font-black text-primary">
          {user.isVerified ? "✅" : "—"}
        </p>
        <p className="text-sm text-muted-foreground mt-1">Vérifié</p>
      </div>
    </div>
  );
}
