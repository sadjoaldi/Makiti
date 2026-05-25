import { ListingStatus } from '.prisma/client';
import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateListingDto } from './create-listing.dto';

export class UpdateListingDto extends PartialType(CreateListingDto) {
  @IsEnum(ListingStatus)
  @IsOptional()
  status?: ListingStatus;
}
