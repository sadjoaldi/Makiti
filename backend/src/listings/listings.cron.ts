import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { v2 as cloudinary } from 'cloudinary';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ListingsCron {
  private readonly logger = new Logger(ListingsCron.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanSoldListings() {
    this.logger.log('🧹 Nettoyage des annonces SOLD > 30 jours...');

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Récupérer les annonces à supprimer avec leurs images
    const listings = await this.prisma.listing.findMany({
      where: {
        status: 'SOLD',
        updatedAt: { lte: thirtyDaysAgo },
      },
      include: { images: true },
    });

    if (listings.length === 0) {
      this.logger.log('Aucune annonce à nettoyer.');
      return;
    }

    // Supprimer les images Cloudinary
    for (const listing of listings) {
      for (const image of listing.images) {
        try {
          await cloudinary.uploader.destroy(image.publicId);
        } catch (err) {
          this.logger.error(
            `Erreur suppression image Cloudinary ${image.publicId}`,
            err,
          );
        }
      }
    }

    // Supprimer les annonces en BDD (cascade sur les images)
    const deleted = await this.prisma.listing.deleteMany({
      where: {
        status: 'SOLD',
        updatedAt: { lte: thirtyDaysAgo },
      },
    });

    this.logger.log(`✅ ${deleted.count} annonce(s) supprimée(s).`);
  }
}
