import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        avatar: true,
        city: true,
        district: true,
        isVerified: true,
        createdAt: true,
        _count: {
          select: { listings: true },
        },
      },
    });

    if (!user) throw new NotFoundException('Utilisateur introuvable');
    return user;
  }

  async updateMe(id: string, dto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        avatar: true,
        city: true,
        district: true,
        isVerified: true,
        updatedAt: true,
      },
    });
  }

  async findUserListings(id: string) {
    await this.findOne(id);

    return this.prisma.listing.findMany({
      where: {
        userId: id,
        status: { not: 'ARCHIVED' },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        images: { take: 1 },
        category: true,
      },
    });
  }
}
