import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async toggle(listingId: string, userId: string) {
    // Vérifier que le listing existe
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
    });
    if (!listing) throw new NotFoundException('Annonce introuvable');

    // Vérifier si déjà en favori
    const existing = await this.prisma.favorite.findUnique({
      where: { userId_listingId: { userId, listingId } },
    });

    if (existing) {
      // Supprimer le favori
      await this.prisma.favorite.delete({
        where: { userId_listingId: { userId, listingId } },
      });
      return { favorited: false };
    }

    // Ajouter le favori
    await this.prisma.favorite.create({
      data: { userId, listingId },
    });
    return { favorited: true };
  }

  async findMyFavorites(userId: string) {
    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        listing: {
          include: {
            images: { take: 1 },
            category: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                city: true,
              },
            },
          },
        },
      },
    });

    return favorites.map((f) => f.listing);
  }

  async isFavorited(listingId: string, userId: string) {
    const favorite = await this.prisma.favorite.findUnique({
      where: { userId_listingId: { userId, listingId } },
    });
    return { favorited: !!favorite };
  }
}
