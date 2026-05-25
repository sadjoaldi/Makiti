/* eslint-disable react/no-unescaped-entities */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/features/categories/hooks/use-categories";
import {
  useListing,
  useUpdateListing,
} from "@/features/listings/hooks/use-listings";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

const GUINEE_CITIES = [
  "Conakry",
  "Kindia",
  "Labé",
  "Kankan",
  "Nzérékoré",
  "Siguiri",
  "Mamou",
  "Boké",
  "Faranah",
  "Coyah",
];

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface FormState {
  title: string;
  description: string;
  price: string;
  city: string;
  district: string;
  condition: "NEW" | "USED" | "";
  categoryId: string;
}

export default function EditListingPage({ params }: PageProps) {
  const { slug } = use(params);
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: listing, isLoading } = useListing(slug);
  const { data: categories } = useCategories();
  const { mutate: updateListing, isPending } = useUpdateListing();
  const [initialized, setInitialized] = useState(false);

  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    price: "",
    city: "",
    district: "",
    condition: "",
    categoryId: "",
  });

  // Initialise le form une seule fois quand le listing est chargé
  useEffect(() => {
    if (listing && !initialized) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        title: listing.title,
        description: listing.description,
        price: listing.price.toString(),
        city: listing.city,
        district: listing.district ?? "",
        condition: listing.condition,
        categoryId: listing.categoryId,
      });
      setInitialized(true);
    }
  }, [listing, initialized]);

  if (isLoading)
    return (
      <div className="min-h-screen bg-background max-w-lg mx-auto">
        <div className="sticky top-0 z-40 bg-background border-b border-border">
          <div className="flex items-center h-14 px-4 gap-3">
            <Skeleton className="w-9 h-9 rounded-full" />
            <Skeleton className="h-5 w-40" />
          </div>
        </div>
        <div className="px-4 py-6 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );

  if (!listing) return null;
  if (user && listing.userId !== user.id) {
    router.push("/");
    return null;
  }

  const updateField = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.city || !form.condition) return;

    updateListing(
      {
        id: listing.id,
        data: {
          title: form.title,
          description: form.description,
          price: parseFloat(form.price),
          city: form.city,
          district: form.district || undefined,
          condition: form.condition as "NEW" | "USED",
          categoryId: form.categoryId,
        },
      },
      {
        onSuccess: () => {
          router.push(`/listings/${listing.slug}`);
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="flex items-center h-14 px-4 gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold flex-1">Modifier l'annonce</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-5 pb-32">
        {/* Catégorie */}
        <div className="space-y-2">
          <Label>Catégorie</Label>
          <div className="grid grid-cols-2 gap-2">
            {categories?.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => updateField("categoryId", cat.id)}
                className={cn(
                  "flex items-center gap-2 p-3 rounded-xl border text-left transition-all text-sm",
                  form.categoryId === cat.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50",
                )}
              >
                {cat.icon && <span>{cat.icon}</span>}
                <span className="font-medium truncate">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Titre */}
        <div className="space-y-2">
          <Label>Titre *</Label>
          <Input
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="Titre de l'annonce"
            maxLength={100}
          />
          <p className="text-xs text-muted-foreground text-right">
            {form.title.length}/100
          </p>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label>Description *</Label>
          <textarea
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={5}
            maxLength={2000}
            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <p className="text-xs text-muted-foreground text-right">
            {form.description.length}/2000
          </p>
        </div>

        {/* État */}
        <div className="space-y-2">
          <Label>État *</Label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: "NEW", label: "✨ Neuf", desc: "Jamais utilisé" },
              { value: "USED", label: "🔄 Occasion", desc: "Déjà utilisé" },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => updateField("condition", opt.value)}
                className={cn(
                  "p-4 rounded-xl border text-left transition-all",
                  form.condition === opt.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50",
                )}
              >
                <p className="font-medium text-sm">{opt.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {opt.desc}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Prix */}
        <div className="space-y-2">
          <Label>Prix (GNF) *</Label>
          <div className="relative">
            <Input
              type="number"
              value={form.price}
              onChange={(e) => updateField("price", e.target.value)}
              placeholder="0"
              className="pr-12"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              FG
            </span>
          </div>
        </div>

        {/* Ville */}
        <div className="space-y-2">
          <Label>Ville *</Label>
          <div className="grid grid-cols-2 gap-2">
            {GUINEE_CITIES.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => updateField("city", city)}
                className={cn(
                  "p-3 rounded-xl border text-sm font-medium transition-all",
                  form.city === city
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:border-primary/50",
                )}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Quartier */}
        <div className="space-y-2">
          <Label>Quartier (optionnel)</Label>
          <Input
            value={form.district}
            onChange={(e) => updateField("district", e.target.value)}
            placeholder="Ex: Kaloum, Ratoma..."
          />
        </div>
      </form>

      {/* CTA fixe */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 max-w-lg mx-auto">
        <Button
          onClick={handleSubmit}
          disabled={isPending || !form.title || !form.price || !form.city}
          className="w-full h-12 font-bold"
        >
          {isPending ? "Enregistrement..." : "Enregistrer les modifications"}
        </Button>
      </div>
    </div>
  );
}
