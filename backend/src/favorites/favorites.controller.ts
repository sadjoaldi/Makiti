import { User } from '.prisma/client';
import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { FavoritesService } from './favorites.service';

@ApiTags('Favorites')
@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  findMyFavorites(@CurrentUser() user: User) {
    return this.favoritesService.findMyFavorites(user.id);
  }

  @Post(':listingId')
  toggle(@Param('listingId') listingId: string, @CurrentUser() user: User) {
    return this.favoritesService.toggle(listingId, user.id);
  }

  @Get(':listingId/check')
  isFavorited(
    @Param('listingId') listingId: string,
    @CurrentUser() user: User,
  ) {
    return this.favoritesService.isFavorited(listingId, user.id);
  }
}
