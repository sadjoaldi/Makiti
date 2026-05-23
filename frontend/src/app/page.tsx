import { MainLayout } from "@/components/common/main-layout";

export default function HomePage() {
  return (
    <MainLayout showHeader showSearch>
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Home page — coming soon</p>
      </div>
    </MainLayout>
  );
}
