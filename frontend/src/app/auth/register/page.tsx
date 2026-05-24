"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegister, useSendOtp } from "@/features/auth/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// ─── Schemas ──────────────────────────────────────────────

const step1Schema = z.object({
  phone: z.string().min(8, "Numéro invalide"),
});

const step2Schema = z.object({
  otpCode: z.string().length(6, "Le code doit contenir 6 chiffres"),
});

const step3Schema = z.object({
  firstName: z.string().min(2, "Prénom requis"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Minimum 6 caractères"),
});

type Step1Form = z.infer<typeof step1Schema>;
type Step2Form = z.infer<typeof step2Schema>;
type Step3Form = z.infer<typeof step3Schema>;

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");

  const { mutate: sendOtp, isPending: isSendingOtp } = useSendOtp();
  const { mutate: register, isPending: isRegistering } = useRegister();

  // Step 1 — Téléphone
  const step1Form = useForm<Step1Form>({
    resolver: zodResolver(step1Schema),
  });

  // Step 2 — OTP
  const step2Form = useForm<Step2Form>({
    resolver: zodResolver(step2Schema),
  });

  // Step 3 — Infos
  const step3Form = useForm<Step3Form>({
    resolver: zodResolver(step3Schema),
  });

  const handleStep1 = (data: Step1Form) => {
    setPhone(data.phone);
    sendOtp(data.phone, {
      onSuccess: () => setStep(2),
    });
  };

  const handleStep2 = (data: Step2Form) => {
    setOtpCode(data.otpCode);
    setStep(3);
  };

  const handleStep3 = (data: Step3Form) => {
    register({
      ...data,
      phone,
      otpCode,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header + progress */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="p-1 rounded-full hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h2 className="text-2xl font-bold">Créer un compte</h2>
            <p className="text-muted-foreground text-sm">Étape {step} sur 3</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1.5">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                s <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step 1 — Téléphone */}
      {step === 1 && (
        <form
          onSubmit={step1Form.handleSubmit(handleStep1)}
          className="flex flex-col gap-4"
        >
          <div>
            <p className="font-medium mb-1">Ton numéro de téléphone</p>
            <p className="text-sm text-muted-foreground">
              On t'envoie un code de vérification par SMS
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+224 620 000 000"
              {...step1Form.register("phone")}
            />
            {step1Form.formState.errors.phone && (
              <p className="text-destructive text-xs">
                {step1Form.formState.errors.phone.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-12 font-bold"
            disabled={isSendingOtp}
          >
            {isSendingOtp ? "Envoi en cours..." : "Recevoir le code SMS"}
          </Button>
        </form>
      )}

      {/* Step 2 — OTP */}
      {step === 2 && (
        <form
          onSubmit={step2Form.handleSubmit(handleStep2)}
          className="flex flex-col gap-4"
        >
          <div>
            <p className="font-medium mb-1">Code de vérification</p>
            <p className="text-sm text-muted-foreground">
              Entre le code à 6 chiffres envoyé au {phone}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="otpCode">Code OTP</Label>
            <Input
              id="otpCode"
              type="number"
              placeholder="123456"
              maxLength={6}
              className="text-center text-2xl tracking-widest h-14"
              {...step2Form.register("otpCode")}
            />
            {step2Form.formState.errors.otpCode && (
              <p className="text-destructive text-xs">
                {step2Form.formState.errors.otpCode.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full h-12 font-bold">
            Vérifier le code
          </Button>

          <button
            type="button"
            onClick={() => sendOtp(phone)}
            className="text-sm text-primary text-center"
          >
            Renvoyer le code
          </button>
        </form>
      )}

      {/* Step 3 — Infos */}
      {step === 3 && (
        <form
          onSubmit={step3Form.handleSubmit(handleStep3)}
          className="flex flex-col gap-4"
        >
          <div>
            <p className="font-medium mb-1">Tes informations</p>
            <p className="text-sm text-muted-foreground">Presque terminé !</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="firstName">Prénom</Label>
            <Input
              id="firstName"
              placeholder="Mamadou"
              {...step3Form.register("firstName")}
            />
            {step3Form.formState.errors.firstName && (
              <p className="text-destructive text-xs">
                {step3Form.formState.errors.firstName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="ton@email.com"
              {...step3Form.register("email")}
            />
            {step3Form.formState.errors.email && (
              <p className="text-destructive text-xs">
                {step3Form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••"
              {...step3Form.register("password")}
            />
            {step3Form.formState.errors.password && (
              <p className="text-destructive text-xs">
                {step3Form.formState.errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-12 font-bold"
            disabled={isRegistering}
          >
            {isRegistering ? "Création..." : "Créer mon compte 🎉"}
          </Button>
        </form>
      )}

      {step === 1 && (
        <p className="text-center text-sm text-muted-foreground">
          Déjà un compte ?{" "}
          <Link href="/auth/login" className="text-primary font-medium">
            Se connecter
          </Link>
        </p>
      )}
    </div>
  );
}
