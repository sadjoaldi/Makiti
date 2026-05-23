export interface User {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName?: string;
  avatar?: string;
  city?: string;
  district?: string;
  isVerified: boolean;
  isAdmin: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  _count?: { listings: number };
}

export interface ListingImage {
  id: string;
  url: string;
  publicId: string;
}

export interface Listing {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  city: string;
  district?: string;
  condition: "NEW" | "USED";
  status: "ACTIVE" | "SOLD" | "PENDING" | "ARCHIVED";
  views: number;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  categoryId: string;
  images: ListingImage[];
  category: Category;
  user: {
    id: string;
    firstName: string;
    lastName?: string;
    avatar?: string;
    city?: string;
    phone: string;
    createdAt?: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  error: string;
  statusCode: number;
}

export interface ListingFilters {
  search?: string;
  categoryId?: string;
  city?: string;
  condition?: "NEW" | "USED";
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sortBy?: "recent" | "priceAsc" | "priceDesc";
}
