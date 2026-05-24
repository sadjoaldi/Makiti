import { ListingImage } from "@/types";
import { api } from "./api";

export const uploadsService = {
  uploadListingImages: async (
    listingId: string,
    files: File[],
  ): Promise<ListingImage[]> => {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    const { data } = await api.post(
      `/uploads/listings/${listingId}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return data;
  },

  deleteImage: async (imageId: string): Promise<void> => {
    await api.delete(`/uploads/images/${imageId}`);
  },

  uploadAvatar: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append("avatar", file);

    const { data } = await api.post("/uploads/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },
};
