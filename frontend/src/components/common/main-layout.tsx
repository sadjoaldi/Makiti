import { BottomNav } from "./botton-nav";
import { Footer } from "./footer";
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
    <div className="min-h-screen bg-background flex flex-col">
      {showHeader && <Header showSearch={showSearch} title={title} />}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 lg:px-6 pb-20 lg:pb-8">
        {children}
      </main>
      <Footer />
      {!hideBottomNav && <BottomNav />}
    </div>
  );
}
