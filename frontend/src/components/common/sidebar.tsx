import { cn } from "@/lib/utils";

interface SidebarProps {
  children: React.ReactNode;
  className?: string;
}

export function Sidebar({ children, className }: SidebarProps) {
  return (
    <>
      {/* Placeholder pour garder l'espace dans le layout */}
      <div className="hidden lg:block w-56 shrink-0" />

      {/* Sidebar fixe */}
      <aside
        className={cn(
          "hidden lg:flex flex-col gap-4 fixed top-16 left-0 w-56 h-[calc(100vh-4rem)] overflow-y-auto pb-8 pr-1",
          className,
        )}
        style={{ left: "calc((100vw - 80rem) / 2 + 1.5rem)" }}
      >
        {children}
      </aside>
    </>
  );
}

export function SidebarSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background border border-border rounded-2xl p-4 space-y-3">
      <h3 className="font-bold text-sm">{title}</h3>
      {children}
    </div>
  );
}
