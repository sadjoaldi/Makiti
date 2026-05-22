import { User } from '.prisma/client';
import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { OtpService } from './otp.service';

type RequestWithUser = Request & { user: Omit<User, 'password'> };

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly otpService: OtpService,
  ) {}

  @ApiOperation({ summary: 'Envoyer un OTP pas SMS' })
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @Post('otp/send')
  sendOtp(@Body() dto: SendOtpDto) {
    return this.otpService.sendOtp(dto.phone);
  }

  @ApiOperation({ summary: 'Vérifier un OTP' })
  @Post('otp/verify')
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.otpService.verifyOtp(dto.phone, dto.code);
  }

  @ApiOperation({ summary: 'Créer un compte' })
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @ApiOperation({ summary: 'Se connecter' })
  @Throttle({ default: { ttl: 60000, limit: 10 } })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @ApiOperation({ summary: 'Récuperer un profil' })
  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  me(@Request() req: RequestWithUser) {
    return this.authService.me(req.user.id);
  }
}
