import { Listing, PaginatedResponse, User } from "@/types";
import { api } from "./api";

type AdminUser = Omit<User, "password"> & {
  _count: { listings: number };
};

interface AdminStats {
  totalUsers: number;
  newUsersToday: number;
  totalListings: number;
  activeListings: number;
  soldListings: number;
  newListingsToday: number;
  pendingReports: number;
  topCategories: { name: string; icon?: string; count: number }[];
}

interface Report {
  id: string;
  reason: string;
  status: string;
  createdAt: string;
  listing: {
    id: string;
    title: string;
    slug: string;
    status: string;
    images: { url: string }[];
  };
  user: {
    id: string;
    firstName: string;
    lastName?: string;
    email: string;
  };
}

export const adminService = {
  getStats: async (): Promise<AdminStats> => {
    const { data } = await api.get("/admin/stats");
    return data;
  },

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

  getAllUsers: async (params: {
    page?: number;
    limit?: number;
    search?: string;
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

  getReports: async (params: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedResponse<Report>> => {
    const { data } = await api.get("/admin/reports", { params });
    return data;
  },

  updateReportStatus: async (id: string, status: string): Promise<Report> => {
    const { data } = await api.patch(`/admin/reports/${id}/status`, { status });
    return data;
  },
};
