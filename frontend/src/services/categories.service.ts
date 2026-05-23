import { Category } from "@/types";
import { api } from "./api";

export const categoriesService = {
  getAll: async (): Promise<Category[]> => {
    const { data } = await api.get("/categories");
    return data;
  },
};
