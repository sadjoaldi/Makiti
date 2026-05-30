import Link from "next/link";

export function Footer() {
  return (
    <footer className="hidden lg:block border-t border-border bg-background relative z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-center gap-6 text-xs text-muted-foreground">
        <span>© {new Date().getFullYear()} Makiti</span>
        <span className="text-border">·</span>
        <Link
          href="/legal/mentions"
          className="hover:text-foreground transition-colors"
        >
          Mentions légales
        </Link>
        <Link
          href="/legal/cgu"
          className="hover:text-foreground transition-colors"
        >
          CGU
        </Link>
        <Link
          href="/legal/confidentialite"
          className="hover:text-foreground transition-colors"
        >
          Confidentialité
        </Link>
      </div>
    </footer>
  );
}
