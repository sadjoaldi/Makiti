import { ListingCondition } from '.prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateListingDto {
  @ApiProperty({ example: 'iPhone 14 Pro Max' })
  @IsString()
  title!: string;

  @ApiProperty({ example: 'Très bon état, vendu avec chargeur original' })
  @IsString()
  description!: string;

  @ApiProperty({ example: 4500000 })
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiProperty({ example: 'Conakry' })
  @IsString()
  city!: string;

  @ApiPropertyOptional({ example: 'Kaloum' })
  @IsString()
  @IsOptional()
  district?: string;

  @ApiPropertyOptional({ example: 'Rue KA-020' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ example: 9.537 })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiPropertyOptional({ example: -13.6773 })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiProperty({ enum: ListingCondition, example: ListingCondition.USED })
  @IsEnum(ListingCondition)
  condition!: ListingCondition;

  @ApiProperty({ example: 'uuid-categorie' })
  @IsString()
  categoryId!: string;
}
