import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'user@makiti.com ou +224620000000' })
  @IsString()
  identifier!: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  password!: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  rememberMe?: boolean;
}
