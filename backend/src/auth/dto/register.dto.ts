import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'user@makiti.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '+224620000000' })
  @IsString()
  phone!: string;

  @ApiProperty({ example: '123456', minLength: 6 })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ example: 'Mamadou' })
  @IsString()
  firstName!: string;

  @ApiPropertyOptional({ example: 'Diallo' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({ example: 'Conakry' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  otpCode!: string;
}
