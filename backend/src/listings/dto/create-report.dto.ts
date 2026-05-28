import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateReportDto {
  @ApiProperty({ example: 'Prix suspect' })
  @IsString()
  reason!: string;
}
