"use client";

import { useAuthStore } from "@/store/auth.store";
import { Bell, Search } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  showSearch?: boolean;
  title?: string;
  back?: boolean;
}

export function Header({
  showSearch = false,
  title,
  back = false,
}: HeaderProps) {
  const { isAuthenticated } = useAuthStore();

  return (
    <header className="sticky top-0 z-40 bg-background border-b border-border">
      <div className="flex items-center justify-between h-14 px-4 max-w-lg mx-auto">
        {/* Logo ou titre */}
        {title ? (
          <h1 className="font-bold text-lg">{title}</h1>
        ) : (
          <Link
            href="/"
            className="font-black text-2xl text-primary tracking-tight"
          >
            Makiti
          </Link>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          {showSearch && (
            <Link
              href="/search"
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <Search className="w-5 h-5" />
            </Link>
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
