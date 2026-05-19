import { ListingCondition } from '.prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateListingDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsString()
  city!: string;

  @IsString()
  @IsOptional()
  district?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsEnum(ListingCondition)
  condition!: ListingCondition;

  @IsString()
  categoryId!: string;
}
