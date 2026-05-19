import { ListingStatus } from '.prisma/client';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import slugify from 'slugify';
import { PrismaService } from '../prisma/prisma.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { QueryListingDto } from './dto/query-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';

@Injectable()
export class ListingsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryListingDto) {
    const {
      search,
      categoryId,
      city,
      condition,
      minPrice,
      maxPrice,
      page = 1,
      limit = 20,
      sortBy = 'recent',
    } = query;

    const where: any = {
      status: ListingStatus.ACTIVE,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(categoryId && { categoryId }),
      ...(city && { city: { contains: city, mode: 'insensitive' } }),
      ...(condition && { condition }),
      ...((minPrice !== undefined || maxPrice !== undefined) && {
        price: {
          ...(minPrice !== undefined && { gte: minPrice }),
          ...(maxPrice !== undefined && { lte: maxPrice }),
        },
      }),
    };

    const orderBy =
      sortBy === 'priceAsc'
        ? { price: 'asc' as const }
        : sortBy === 'priceDesc'
          ? { price: 'desc' as const }
          : { createdAt: 'desc' as const };

    const [data, total] = await Promise.all([
      this.prisma.listing.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          images: { take: 1 },
          category: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
              city: true,
              phone: true,
            },
          },
        },
      }),
      this.prisma.listing.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findBySlug(slug: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { slug },
      include: {
        images: true,
        category: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            city: true,
            phone: true,
            createdAt: true,
          },
        },
      },
    });

    if (!listing) throw new NotFoundException('Annonce introuvable');

    // Incrémenter les vues
    await this.prisma.listing.update({
      where: { slug },
      data: { views: { increment: 1 } },
    });

    return listing;
  }

  async create(dto: CreateListingDto, userId: string) {
    const slug = await this.generateUniqueSlug(dto.title);

    return this.prisma.listing.create({
      data: {
        ...dto,
        slug,
        userId,
      },
      include: {
        images: true,
        category: true,
      },
    });
  }

  async update(id: string, dto: UpdateListingDto, userId: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id } });

    if (!listing) throw new NotFoundException('Annonce introuvable');
    if (listing.userId !== userId) throw new ForbiddenException();

    return this.prisma.listing.update({
      where: { id },
      data: dto,
      include: { images: true, category: true },
    });
  }

  async remove(id: string, userId: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id } });

    if (!listing) throw new NotFoundException('Annonce introuvable');
    if (listing.userId !== userId) throw new ForbiddenException();

    return this.prisma.listing.delete({ where: { id } });
  }

  async findByUser(userId: string) {
    return this.prisma.listing.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        images: { take: 1 },
        category: true,
      },
    });
  }

  private async generateUniqueSlug(title: string): Promise<string> {
    const base = slugify(title, { lower: true, strict: true });
    let slug = base;
    let count = 0;

    while (true) {
      const existing = await this.prisma.listing.findUnique({
        where: { slug },
      });
      if (!existing) break;
      count++;
      slug = `${base}-${count}`;
    }

    return slug;
  }
}
