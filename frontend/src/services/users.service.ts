import { User } from "@/types";
import { api } from "./api";

interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  city?: string;
  district?: string;
}

export const usersService = {
  getById: async (id: string): Promise<User> => {
    const { data } = await api.get(`/users/${id}`);
    return data;
  },

  updateMe: async (payload: UpdateUserPayload): Promise<User> => {
    const { data } = await api.patch("/users/me", payload);
    return data;
  },
};
