"use client";

import { useAuthStore } from "@/store/auth.store";
import { Bell, Heart, PlusCircle, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Header({
  showSearch = false,
  title,
  back = false,
}: {
  showSearch?: boolean;
  title?: string;
  back?: boolean;
}) {
  const { isAuthenticated, user, logout } = useAuthStore();
  const router = useRouter();
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) router.push(`/search?q=${encodeURIComponent(search)}`);
    else router.push("/search");
  };

  return (
    <header className="sticky top-0 z-40 bg-background border-b border-border">
      <div className="flex items-center gap-6 h-16 px-4 lg:px-6 max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="font-black text-2xl text-primary tracking-tight shrink-0"
        >
          Makiti
        </Link>

        {/* Barre de recherche — desktop uniquement */}
        <form
          onSubmit={handleSearch}
          className="hidden lg:flex flex-1 max-w-2xl items-center gap-2 bg-muted rounded-xl px-4 py-2.5 border border-border"
        >
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Rechercher une annonce..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm focus:outline-none"
          />
        </form>

        {/* Spacer mobile */}
        <div className="flex-1 lg:hidden" />

        {/* Actions desktop */}
        <nav className="hidden lg:flex items-center gap-2 ml-auto">
          {isAuthenticated ? (
            <>
              <Link
                href="/publish"
                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                Publier
              </Link>
              <Link
                href="/favorites"
                className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                <Heart className="w-5 h-5" />
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-2 p-2 rounded-xl hover:bg-muted transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-black text-primary">
                  {user?.firstName[0].toUpperCase()}
                </div>
                <span className="text-sm font-medium">{user?.firstName}</span>
              </Link>
              {user?.isAdmin && (
                <Link
                  href="/admin"
                  className="px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
                >
                  Admin
                </Link>
              )}
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="px-4 py-2 rounded-xl text-sm font-medium hover:bg-muted transition-colors"
              >
                Connexion
              </Link>
              <Link
                href="/auth/register"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors"
              >
                S&apos;inscrire
              </Link>
            </>
          )}
        </nav>

        {/* Actions mobile */}
        <div className="flex lg:hidden items-center gap-2">
          {showSearch && (
            <button
              onClick={() => router.push("/search")}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
          )}
          {isAuthenticated && (
            <button className="p-2 rounded-full hover:bg-muted transition-colors relative">
              <Bell className="w-5 h-5" />
            </button>
          )}
          {!isAuthenticated && (
            <Link
              href="/auth/login"
              className="text-sm font-medium text-primary"
            >
              Connexion
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
