"use client";

import { Header } from "@/components/common/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCategories } from "@/features/categories/hooks/use-categories";
import { usePublishListing } from "@/features/listings/hooks/use-publish";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import { compressImage, formatFileSize } from "@/utils/image";
import { ArrowLeft, Camera, Check, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

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

const STEPS = [
  { num: 1, label: "Catégorie", desc: "Type d'annonce" },
  { num: 2, label: "Description", desc: "Titre et détails" },
  { num: 3, label: "Prix & lieu", desc: "Tarif et ville" },
  { num: 4, label: "Photos", desc: "Images du produit" },
] as const;

type Step = 1 | 2 | 3 | 4;

interface FormData {
  categoryId: string;
  title: string;
  description: string;
  price: string;
  city: string;
  district: string;
  condition: "NEW" | "USED" | "";
  images: File[];
}

export default function PublishPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { data: categories } = useCategories();
  const { mutate: publish, isPending } = usePublishListing();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>({
    categoryId: "",
    title: "",
    description: "",
    price: "",
    city: "",
    district: "",
    condition: "",
    images: [],
  });

  const [previews, setPreviews] = useState<string[]>([]);

  if (!isAuthenticated) {
    router.push("/auth/login");
    return null;
  }

  const updateForm = (key: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleImages = async (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    const total = form.images.length + newFiles.length;

    if (total > 10) {
      toast.error("Maximum 10 images");
      return;
    }

    const validFiles = newFiles.filter((f) =>
      ["image/jpeg", "image/png", "image/webp"].includes(f.type),
    );

    if (validFiles.length !== newFiles.length) {
      toast.error("Formats acceptés : JPG, PNG, WebP");
    }

    toast.loading("Compression des images...");
    const compressedFiles = await Promise.all(
      validFiles.map((f) => compressImage(f)),
    );
    toast.dismiss();

    const newPreviews = compressedFiles.map((f) => URL.createObjectURL(f));
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ...compressedFiles],
    }));
    setPreviews((prev) => [...prev, ...newPreviews]);

    const totalSize = compressedFiles.reduce((acc, f) => acc + f.size, 0);
    toast.success(
      `${compressedFiles.length} image(s) — ${formatFileSize(totalSize)}`,
    );
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const canGoNext = () => {
    if (step === 1) return !!form.categoryId;
    if (step === 2)
      return !!form.title && !!form.description && !!form.condition;
    if (step === 3) return !!form.price && !!form.city;
    return true;
  };

  const handleNext = () => {
    if (step < 4) setStep((prev) => (prev + 1) as Step);
  };

  const handleSubmit = () => {
    if (
      !form.categoryId ||
      !form.title ||
      !form.price ||
      !form.city ||
      !form.condition
    ) {
      toast.error("Remplis tous les champs obligatoires");
      return;
    }
    publish({
      title: form.title,
      description: form.description,
      price: parseFloat(form.price),
      city: form.city,
      district: form.district || undefined,
      condition: form.condition as "NEW" | "USED",
      categoryId: form.categoryId,
      images: form.images,
    });
  };

  // Contenu des steps — JSX partagé mobile + desktop
  const stepContent = (
    <>
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold">Quelle catégorie ?</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Choisis la catégorie qui correspond le mieux
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {categories?.map((cat) => (
              <button
                key={cat.id}
                onClick={() => updateForm("categoryId", cat.id)}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-xl border text-left transition-all",
                  form.categoryId === cat.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50",
                )}
              >
                {cat.icon && <span className="text-2xl">{cat.icon}</span>}
                <span className="text-sm font-medium">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold">Décris ton article</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Un titre clair attire plus d&apos;acheteurs
            </p>
          </div>
          <div className="space-y-2">
            <Label>Titre *</Label>
            <Input
              placeholder="Ex: iPhone 14 Pro Max 256Go"
              value={form.title}
              onChange={(e) => updateForm("title", e.target.value)}
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground text-right">
              {form.title.length}/100
            </p>
          </div>
          <div className="space-y-2">
            <Label>Description *</Label>
            <textarea
              placeholder="Décris l'état, les caractéristiques, ce qui est inclus..."
              value={form.description}
              onChange={(e) => updateForm("description", e.target.value)}
              rows={5}
              maxLength={2000}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="text-xs text-muted-foreground text-right">
              {form.description.length}/2000
            </p>
          </div>
          <div className="space-y-2">
            <Label>État *</Label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "NEW", label: "✨ Neuf", desc: "Jamais utilisé" },
                { value: "USED", label: "🔄 Occasion", desc: "Déjà utilisé" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => updateForm("condition", opt.value)}
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
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold">Prix et localisation</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Fixe ton prix et indique où tu te trouves
            </p>
          </div>
          <div className="space-y-2">
            <Label>Prix (GNF) *</Label>
            <div className="relative">
              <Input
                type="number"
                placeholder="0"
                value={form.price}
                onChange={(e) => updateForm("price", e.target.value)}
                className="pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                FG
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Ville *</Label>
            <div className="grid grid-cols-2 gap-2">
              {GUINEE_CITIES.map((city) => (
                <button
                  key={city}
                  onClick={() => updateForm("city", city)}
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
          <div className="space-y-2">
            <Label>Quartier (optionnel)</Label>
            <Input
              placeholder="Ex: Kaloum, Ratoma..."
              value={form.district}
              onChange={(e) => updateForm("district", e.target.value)}
            />
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold">Ajoute des photos</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Les annonces avec photos se vendent 3x plus vite
            </p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center gap-2 hover:border-primary/50 transition-colors"
          >
            <Camera className="w-8 h-8 text-muted-foreground" />
            <p className="font-medium text-sm">Ajouter des photos</p>
            <p className="text-xs text-muted-foreground">
              JPG, PNG, WebP — max 5MB — {form.images.length}/10
            </p>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={(e) => void handleImages(e.target.files)}
          />
          {previews.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {previews.map((preview, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-xl overflow-hidden"
                >
                  <Image
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                  {index === 0 && (
                    <div className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-md">
                      Principale
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );

  const footerCta =
    step < 4 ? (
      <Button
        onClick={handleNext}
        disabled={!canGoNext()}
        className="w-full h-12 font-bold"
      >
        Continuer
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    ) : (
      <Button
        onClick={handleSubmit}
        disabled={isPending}
        className="w-full h-12 font-bold"
      >
        {isPending ? "Publication..." : "Publier mon annonce 🚀"}
      </Button>
    );

  return (
    <div className="min-h-screen bg-background">
      {/* ───── MOBILE ───── */}
      <div className="lg:hidden flex flex-col max-w-lg mx-auto min-h-screen">
        <div className="sticky top-0 z-40 bg-background border-b border-border">
          <div className="flex items-center h-14 px-4 gap-3">
            <button
              onClick={() =>
                step === 1
                  ? router.back()
                  : setStep((prev) => (prev - 1) as Step)
              }
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <p className="font-bold">Publier une annonce</p>
              <p className="text-xs text-muted-foreground">
                Étape {step} sur 4
              </p>
            </div>
          </div>
          <div className="flex gap-1 px-4 pb-3">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={cn(
                  "h-1 flex-1 rounded-full transition-all",
                  s <= step ? "bg-primary" : "bg-muted",
                )}
              />
            ))}
          </div>
        </div>
        <div className="flex-1 px-4 py-6">{stepContent}</div>
        <div className="sticky bottom-0 bg-background border-t border-border p-4">
          {footerCta}
        </div>
      </div>

      {/* ───── DESKTOP ───── */}
      <div className="hidden lg:block">
        <Header />
        <main className="max-w-5xl mx-auto px-6 py-8">
          <h1 className="text-2xl font-black mb-6">Publier une annonce</h1>
          <div className="flex gap-8 items-start">
            {/* Sidebar étapes */}
            <aside className="w-64 shrink-0">
              <div className="sticky top-20 space-y-2">
                {STEPS.map((s) => {
                  const isDone = s.num < step;
                  const isCurrent = s.num === step;
                  return (
                    <div
                      key={s.num}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl border transition-all",
                        isCurrent
                          ? "border-primary bg-primary/5"
                          : isDone
                            ? "border-border bg-muted/50"
                            : "border-border opacity-60",
                      )}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                          isDone || isCurrent
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {isDone ? <Check className="w-4 h-4" /> : s.num}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm">{s.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {s.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </aside>

            {/* Formulaire */}
            <div className="flex-1 min-w-0">
              <div className="bg-background border border-border rounded-2xl p-6">
                {stepContent}
                <div className="flex items-center justify-between gap-3 mt-6 pt-6 border-t border-border">
                  {step > 1 ? (
                    <Button
                      variant="outline"
                      onClick={() => setStep((prev) => (prev - 1) as Step)}
                      className="h-12 font-bold"
                    >
                      <ArrowLeft className="w-4 h-4 mr-1" />
                      Retour
                    </Button>
                  ) : (
                    <div />
                  )}
                  <div className="flex-1 max-w-xs">{footerCta}</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
