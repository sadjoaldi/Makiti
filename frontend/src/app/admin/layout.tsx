"use client";

import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import {
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Package,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/listings", icon: Package, label: "Annonces" },
  { href: "/admin/users", icon: Users, label: "Utilisateurs" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && (!isAuthenticated || !user?.isAdmin)) {
      router.push("/");
    }
  }, [mounted, isAuthenticated, user, router]);

  if (!mounted) return null;
  if (!isAuthenticated || !user?.isAdmin) return null;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="flex items-center justify-between h-14 px-4 max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="font-black text-xl text-primary">Makiti</span>
            <span className="text-muted-foreground text-sm">/ Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user.firstName}
            </span>
            <button
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-destructive"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
        {/* Sidebar */}
        <aside className="w-48 shrink-0 hidden md:block">
          <nav className="space-y-1">
            {navItems.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  pathname === href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
                {pathname === href && (
                  <ChevronRight className="w-3 h-3 ml-auto" />
                )}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Mobile nav */}
        <div className="flex gap-2 mb-4 md:hidden w-full">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium flex-1 justify-center transition-colors",
                pathname === href
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground",
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </div>

        {/* Content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
