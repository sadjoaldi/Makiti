import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      newUsersToday,
      totalListings,
      activeListings,
      soldListings,
      newListingsToday,
      pendingReports,
      topCategories,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { createdAt: { gte: today } } }),
      this.prisma.listing.count(),
      this.prisma.listing.count({ where: { status: 'ACTIVE' } }),
      this.prisma.listing.count({ where: { status: 'SOLD' } }),
      this.prisma.listing.count({ where: { createdAt: { gte: today } } }),
      this.prisma.report.count({ where: { status: 'PENDING' } }),
      this.prisma.category.findMany({
        take: 5,
        include: { _count: { select: { listings: true } } },
        orderBy: { listings: { _count: 'desc' } },
      }),
    ]);

    return {
      totalUsers,
      newUsersToday,
      totalListings,
      activeListings,
      soldListings,
      newListingsToday,
      pendingReports,
      topCategories: topCategories.map((c) => ({
        name: c.name,
        icon: c.icon,
        count: c._count.listings,
      })),
    };
  }

  async getAllListings({
    page = 1,
    limit = 20,
    status,
  }: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    const where = status ? { status: status as any } : {};

    const [data, total] = await Promise.all([
      this.prisma.listing.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
          category: true,
          images: { take: 1 },
        },
      }),
      this.prisma.listing.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async updateListingStatus(id: string, status: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id } });
    if (!listing) throw new NotFoundException('Annonce introuvable');

    return this.prisma.listing.update({
      where: { id },
      data: { status: status as any },
    });
  }

  async deleteListing(id: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id } });
    if (!listing) throw new NotFoundException('Annonce introuvable');
    return this.prisma.listing.delete({ where: { id } });
  }

  async getAllUsers({
    page = 1,
    limit = 20,
    search,
  }: {
    page?: number;
    limit?: number;
    search?: string;
  }) {
    const where = search
      ? {
          OR: [
            { email: { contains: search, mode: 'insensitive' as const } },
            { phone: { contains: search } },
            { firstName: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          email: true,
          phone: true,
          firstName: true,
          lastName: true,
          city: true,
          isVerified: true,
          isAdmin: true,
          createdAt: true,
          _count: { select: { listings: true } },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async toggleUserVerified(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    return this.prisma.user.update({
      where: { id },
      data: { isVerified: !user.isVerified },
      select: {
        id: true,
        email: true,
        firstName: true,
        isVerified: true,
      },
    });
  }

  async deleteUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    return this.prisma.user.delete({ where: { id } });
  }

  async getReports({
    page = 1,
    limit = 20,
    status,
  }: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    const where = status ? { status: status as any } : {};

    const [data, total] = await Promise.all([
      this.prisma.report.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          listing: {
            select: {
              id: true,
              title: true,
              slug: true,
              status: true,
              images: { take: 1 },
            },
          },
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.report.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async updateReportStatus(id: string, status: string) {
    return this.prisma.report.update({
      where: { id },
      data: { status: status as any },
    });
  }
}
