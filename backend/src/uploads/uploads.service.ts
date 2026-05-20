import { BadRequestException, Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UploadsService {
  constructor(private readonly prisma: PrismaService) {}

  async uploadListingImages(
    files: Express.Multer.File[],
    listingId: string,
    userId: string,
  ) {
    // Vérifier que le listing appartient au user
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
      include: { images: true },
    });

    if (!listing) throw new BadRequestException('Annonce introuvable');
    if (listing.userId !== userId)
      throw new BadRequestException('Non autorisé');

    // Max 10 images par annonce
    const currentCount = listing.images.length;
    if (currentCount + files.length > 10) {
      throw new BadRequestException(
        `Maximum 10 images par annonce. Tu en as déjà ${currentCount}.`,
      );
    }

    // Upload sur Cloudinary
    const uploaded = await Promise.all(
      files.map((file) => this.uploadToCloudinary(file)),
    );

    // Sauvegarder en BDD
    const images = await Promise.all(
      uploaded.map((result) =>
        this.prisma.listingImage.create({
          data: {
            url: result.secure_url,
            publicId: result.public_id,
            listingId,
          },
        }),
      ),
    );

    return images;
  }

  async deleteImage(imageId: string, userId: string) {
    const image = await this.prisma.listingImage.findUnique({
      where: { id: imageId },
      include: { listing: true },
    });

    if (!image) throw new BadRequestException('Image introuvable');
    if (image.listing.userId !== userId)
      throw new BadRequestException('Non autorisé');

    // Supprimer sur Cloudinary
    await cloudinary.uploader.destroy(image.publicId);

    // Supprimer en BDD
    return this.prisma.listingImage.delete({ where: { id: imageId } });
  }

  async uploadAvatar(file: Express.Multer.File, userId: string) {
    const result = await this.uploadToCloudinary(file, 'avatars');

    await this.prisma.user.update({
      where: { id: userId },
      data: { avatar: result.secure_url },
    });

    return { url: result.secure_url };
  }

  private uploadToCloudinary(
    file: Express.Multer.File,
    folder: string = 'listings',
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: `makiti/${folder}`,
            transformation: [
              { width: 1200, height: 900, crop: 'limit' },
              { fetch_format: 'webp', quality: 'auto' },
            ],
          },
          (error, result) => {
            if (error) return reject(new Error(error.message));
            if (!result)
              return reject(
                new Error('Upload échoué, aucun résultat retourné'),
              );
            resolve(result);
          },
        )
        .end(file.buffer);
    });
  }
}
