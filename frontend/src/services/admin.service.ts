import { Listing, PaginatedResponse, User } from "@/types";
import { api } from "./api";

type AdminUser = Omit<User, "password"> & {
  _count: { listings: number };
};

export const adminService = {
  // Stats
  getStats: async (): Promise<{
    totalUsers: number;
    totalListings: number;
    activeListings: number;
    soldListings: number;
  }> => {
    const { data } = await api.get("/admin/stats");
    return data;
  },

  // Listings
  getAllListings: async (params: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedResponse<Listing>> => {
    const { data } = await api.get("/admin/listings", { params });
    return data;
  },

  updateListingStatus: async (id: string, status: string): Promise<Listing> => {
    const { data } = await api.patch(`/admin/listings/${id}/status`, {
      status,
    });
    return data;
  },

  deleteListing: async (id: string): Promise<void> => {
    await api.delete(`/admin/listings/${id}`);
  },

  // Users
  getAllUsers: async (params: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<AdminUser>> => {
    const { data } = await api.get("/admin/users", { params });
    return data;
  },

  toggleUserVerified: async (id: string): Promise<AdminUser> => {
    const { data } = await api.patch(`/admin/users/${id}/verify`);
    return data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/admin/users/${id}`);
  },
};
