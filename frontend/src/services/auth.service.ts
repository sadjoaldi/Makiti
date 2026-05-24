import { User } from "@/types";
import { api } from "./api";

interface RegisterPayload {
  email: string;
  phone: string;
  password: string;
  firstName: string;
  lastName?: string;
  city?: string;
  otpCode: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;
  accessToken: string;
}

export const authService = {
  sendOtp: async (phone: string): Promise<void> => {
    await api.post("/auth/otp/send", { phone });
  },

  verifyOtp: async (phone: string, code: string): Promise<boolean> => {
    const { data } = await api.post("/auth/otp/verify", { phone, code });
    return data;
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await api.post("/auth/register", payload);
    return data;
  },

  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await api.post("/auth/login", payload);
    return data;
  },

  me: async (): Promise<User> => {
    const { data } = await api.get("/auth/me");
    return data;
  },
};
