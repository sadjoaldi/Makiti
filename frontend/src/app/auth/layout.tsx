export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full px-4 py-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-black text-4xl text-primary tracking-tight">
            Makiti
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Marketplace Guinée
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
