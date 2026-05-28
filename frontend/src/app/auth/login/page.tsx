"use client";

import { PasswordInput } from "@/components/common/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/features/auth/hooks/use-auth";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const { mutate: login, isPending } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [identifier, setIdentifier] = useState("");

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!identifier) {
      newErrors.email = "Email ou téléphone requis";
    } else if (!identifier.includes("@")) {
      newErrors.email = "Email invalide";
    }
    if (!password || password.length < 6) {
      newErrors.password = "Minimum 6 caractères";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (!validate()) return;
    login({ identifier, password, rememberMe });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold">Connexion</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Content de te revoir !
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <Label htmlFor="identifier">Email ou téléphone</Label>
          <Input
            id="identifier"
            type="text"
            placeholder="ton@email.com ou +224620000000"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            autoComplete="username"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLogin();
            }}
          />
          {errors.email && (
            <p className="text-destructive text-xs">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <PasswordInput
            id="password"
            placeholder="••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLogin();
            }}
          />
          {errors.password && (
            <p className="text-destructive text-xs">{errors.password}</p>
          )}
        </div>

        {/* Se souvenir de moi */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-border accent-primary"
          />
          <span className="text-sm text-muted-foreground">
            Se souvenir de moi
          </span>
        </label>

        <Button
          type="button"
          onClick={handleLogin}
          className="w-full h-12 font-bold"
          disabled={isPending}
        >
          {isPending ? "Connexion..." : "Se connecter"}
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Pas encore de compte ?{" "}
        <Link href="/auth/register" className="text-primary font-medium">
          Créer un compte
        </Link>
      </p>
    </div>
  );
}
