"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useUpdateAvatar,
  useUpdateProfile,
} from "@/features/profile/hooks/use-profile";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import { ArrowLeft, Camera } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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

export default function EditProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const { mutate: updateAvatar, isPending: isUploadingAvatar } =
    useUpdateAvatar();

  const [form, setForm] = useState({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    city: user?.city ?? "",
    district: user?.district ?? "",
  });

  useEffect(() => {
    if (!isAuthenticated) router.push("/auth/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) return null;

  const updateField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      firstName: form.firstName,
      lastName: form.lastName || undefined,
      city: form.city || undefined,
      district: form.district || undefined,
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    updateAvatar(file);
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
          <h1 className="font-bold flex-1">Modifier mon profil</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-6 pb-32">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-black text-primary overflow-hidden">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt="Avatar"
                  fill
                  className="object-cover"
                />
              ) : (
                user.firstName[0].toUpperCase()
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingAvatar}
              className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 shadow-lg"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground">
            {isUploadingAvatar ? "Upload en cours..." : "Changer la photo"}
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>

        {/* Infos */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Prénom *</Label>
            <Input
              value={form.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
              placeholder="Mamadou"
            />
          </div>

          <div className="space-y-2">
            <Label>Nom (optionnel)</Label>
            <Input
              value={form.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
              placeholder="Diallo"
            />
          </div>

          <div className="space-y-2">
            <Label>Quartier (optionnel)</Label>
            <Input
              value={form.district}
              onChange={(e) => updateField("district", e.target.value)}
              placeholder="Kaloum, Ratoma..."
            />
          </div>
        </div>

        {/* Ville */}
        <div className="space-y-2">
          <Label>Ville</Label>
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

        {/* Infos non modifiables */}
        <div className="space-y-3 bg-muted rounded-xl p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Informations du compte
          </p>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Email</p>
            <p className="text-sm font-medium">{user.email}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Téléphone</p>
            <p className="text-sm font-medium">{user.phone}</p>
          </div>
        </div>
      </form>

      {/* CTA fixe */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 max-w-lg mx-auto">
        <Button
          type="submit"
          onClick={handleSubmit}
          disabled={isPending || !form.firstName}
          className="w-full h-12 font-bold"
        >
          {isPending ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </div>
  );
}
