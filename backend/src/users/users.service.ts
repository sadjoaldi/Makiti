import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { ChangePasswordDto } from './dto/change-password.dto';
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

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    const isValid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isValid)
      throw new UnauthorizedException('Mot de passe actuel incorrect');

    const hashed = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });

    return { message: 'Mot de passe modifié avec succès' };
  }
}
