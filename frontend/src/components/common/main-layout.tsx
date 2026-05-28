import { BottomNav } from "./botton-nav";
import { Header } from "./header";

interface MainLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showSearch?: boolean;
  title?: string;
  hideBottomNav?: boolean;
}

export function MainLayout({
  children,
  showHeader = true,
  showSearch = false,
  title,
  hideBottomNav = false,
}: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {showHeader && <Header showSearch={showSearch} title={title} />}
      <main className="max-w-7xl mx-auto px-4 lg:px-6 pb-20 lg:pb-8">
        {children}
      </main>
      {!hideBottomNav && <BottomNav />}
    </div>
  );
}
