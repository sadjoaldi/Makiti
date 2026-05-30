import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import AfricasTalking from 'africastalking';
import { PrismaService } from '../prisma/prisma.service';

// Interface minimale pour le service SMS d'Africa's Talking
interface SmsService {
  send(options: {
    to: string[];
    message: string;
    from?: string;
  }): Promise<unknown>;
}

@Injectable()
export class OtpService {
  private readonly sms: SmsService;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    const at = AfricasTalking({
      apiKey: this.config.get<string>('AT_API_KEY')!,
      username: this.config.get<string>('AT_USERNAME')!,
    });
    this.sms = at.SMS as SmsService;
  }

  async sendOtp(phone: string): Promise<void> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    // Invalider les anciens OTP du même numéro
    await this.prisma.otpCode.updateMany({
      where: { phone, used: false },
      data: { used: true },
    });

    // Créer le nouvel OTP
    await this.prisma.otpCode.create({
      data: { phone, code, expiresAt },
    });

    // Envoyer le SMS
    await this.sms.send({
      to: [phone],
      message: `Votre code de vérification Makiti est : ${code}. Valable 10 minutes.`,
      from: 'Makiti',
    });
  }

  async verifyOtp(phone: string, code: string): Promise<boolean> {
    const otp = await this.prisma.otpCode.findFirst({
      where: {
        phone,
        code,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp) throw new BadRequestException('Code invalide ou expiré');

    // Marquer comme utilisé
    await this.prisma.otpCode.update({
      where: { id: otp.id },
      data: { used: true },
    });

    return true;
  }
}
