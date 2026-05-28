"use client";

import { PasswordInput } from "@/components/common/password-input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { api } from "@/services/api";
import { useAuthStore } from "@/store/auth.store";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function ChangePasswordPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isPending, setIsPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isAuthenticated) {
    router.push("/auth/login");
    return null;
  }

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.currentPassword) newErrors.currentPassword = "Requis";
    if (!form.newPassword || form.newPassword.length < 6)
      newErrors.newPassword = "Minimum 6 caractères";
    if (!/[A-Z]/.test(form.newPassword))
      newErrors.newPassword = "Au moins une majuscule";
    if (!/[0-9]/.test(form.newPassword))
      newErrors.newPassword = "Au moins un chiffre";
    if (form.newPassword !== form.confirmPassword)
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsPending(true);
    try {
      await api.patch("/users/me/password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      toast.success("Mot de passe modifié ✅");
      router.push("/profile");
    } catch {
      toast.error("Mot de passe actuel incorrect");
    } finally {
      setIsPending(false);
    }
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
          <h1 className="font-bold flex-1">Modifier le mot de passe</h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4 pb-32">
        <div className="space-y-2">
          <Label>Mot de passe actuel</Label>
          <PasswordInput
            placeholder="••••••"
            value={form.currentPassword}
            onChange={(e) =>
              setForm((p) => ({ ...p, currentPassword: e.target.value }))
            }
          />
          {errors.currentPassword && (
            <p className="text-destructive text-xs">{errors.currentPassword}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Nouveau mot de passe</Label>
          <PasswordInput
            placeholder="••••••"
            value={form.newPassword}
            onChange={(e) =>
              setForm((p) => ({ ...p, newPassword: e.target.value }))
            }
          />
          {errors.newPassword && (
            <p className="text-destructive text-xs">{errors.newPassword}</p>
          )}
          {/* Password strength */}
          {form.newPassword && (
            <div className="space-y-1">
              <div className="flex gap-1">
                {[
                  form.newPassword.length >= 6,
                  /[A-Z]/.test(form.newPassword),
                  /[0-9]/.test(form.newPassword),
                  form.newPassword.length >= 10,
                ].map((ok, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all ${
                      ok ? "bg-green-500" : "bg-muted"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Majuscule · Chiffre · 6 min · 10+ caractères
              </p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Confirmer le nouveau mot de passe</Label>
          <PasswordInput
            placeholder="••••••"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm((p) => ({ ...p, confirmPassword: e.target.value }))
            }
          />
          {errors.confirmPassword && (
            <p className="text-destructive text-xs">{errors.confirmPassword}</p>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 max-w-lg mx-auto">
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isPending}
          className="w-full h-12 font-bold"
        >
          {isPending ? "Modification..." : "Modifier le mot de passe"}
        </Button>
      </div>
    </div>
  );
}
