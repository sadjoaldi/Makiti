import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ApiErrorResponse {
  message: string;
  error: string;
  statusCode: number;
}

export function useSendOtp() {
  return useMutation({
    mutationFn: (phone: string) => authService.sendOtp(phone),
    onSuccess: () => {
      toast.success("Code OTP envoyé par SMS");
    },
    onError: () => {
      toast.error("Erreur lors de l'envoi du SMS");
    },
  });
}

export function useRegister() {
  const router = useRouter();
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      login(data.user, data.accessToken);
      toast.success(`Bienvenue ${data.user.firstName} ! 🎉`);
      router.push("/");
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const message =
        error?.response?.data?.message || "Erreur lors de l'inscription";
      toast.error(message);
    },
  });
}

export function useLogin() {
  const router = useRouter();
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      login(data.user, data.accessToken);
      toast.success(`Bon retour ${data.user.firstName} !`);
      router.push("/");
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const message =
        error?.response?.data?.message || "Identifiants invalides";
      toast.error(message);
    },
  });
}
