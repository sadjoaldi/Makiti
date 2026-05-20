import { Module } from '@nestjs/common';
import { ListingsController } from './listings.controller';
import { ListingsCron } from './listings.cron';
import { ListingsService } from './listings.service';

@Module({
  controllers: [ListingsController],
  providers: [ListingsService, ListingsCron],
  exports: [ListingsService],
})
export class ListingsModule {}
