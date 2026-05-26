/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { OtpService } from './otp.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, { phone: dto.phone }],
      },
    });

    if (existing) {
      throw new ConflictException('Email ou téléphone déjà utilisé');
    }

    // Vérifier l'OTP
    await this.otpService.verifyOtp(dto.phone, dto.otpCode);

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const { otpCode: _otpCode, ...userData } = dto;

    const user = await this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        isVerified: true,
      },
    });

    const { password: _password, ...result } = user;
    return {
      user: result,
      accessToken: this.generateToken(user.id, user.email),
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new UnauthorizedException('Identifiants invalides');

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Identifiants invalides');

    const { password: _password, ...result } = user;
    return {
      user: result,
      accessToken: this.generateToken(user.id, user.email),
    };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
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
        isAdmin: true,
        createdAt: true,
      },
    });

    return user;
  }

  private generateToken(userId: string, email: string) {
    return this.jwtService.sign({ sub: userId, email });
  }
}
