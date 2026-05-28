"use client";

import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import { Heart, Home, PlusCircle, Search, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", icon: Home, label: "Accueil" },
  { href: "/search", icon: Search, label: "Recherche" },
  { href: "/publish", icon: PlusCircle, label: "Publier" },
  { href: "/favorites", icon: Heart, label: "Favoris" },
  { href: "/profile", icon: User, label: "Profil" },
];

export function BottomNav() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border lg:hidden">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          const isPublish = href === "/publish";

          return (
            <Link
              key={href}
              href={isPublish && !isAuthenticated ? "/auth/login" : href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {isPublish ? (
                <div className="bg-primary rounded-full p-2 -mt-6 shadow-lg">
                  <Icon className="w-6 h-6 text-primary-foreground" />
                </div>
              ) : (
                <Icon className="w-5 h-5" />
              )}
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
