import { User } from '.prisma/client';
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminService } from './admin.service';

type RequestWithUser = Request & { user: Omit<User, 'password'> };

@ApiTags('Admin')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  private checkAdmin(req: RequestWithUser) {
    if (!req.user.isAdmin) throw new ForbiddenException('Accès refusé');
  }

  @Get('stats')
  getStats(@Request() req: RequestWithUser) {
    this.checkAdmin(req);
    return this.adminService.getStats();
  }

  @Get('listings')
  getAllListings(
    @Request() req: RequestWithUser,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('status') status?: string,
  ) {
    this.checkAdmin(req);
    return this.adminService.getAllListings({
      page: parseInt(page),
      limit: parseInt(limit),
      status,
    });
  }

  @Patch('listings/:id/status')
  updateListingStatus(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    this.checkAdmin(req);
    return this.adminService.updateListingStatus(id, status);
  }

  @Delete('listings/:id')
  deleteListing(@Request() req: RequestWithUser, @Param('id') id: string) {
    this.checkAdmin(req);
    return this.adminService.deleteListing(id);
  }

  @Get('users')
  getAllUsers(
    @Request() req: RequestWithUser,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('search') search?: string,
  ) {
    this.checkAdmin(req);
    return this.adminService.getAllUsers({
      page: parseInt(page),
      limit: parseInt(limit),
      search,
    });
  }

  @Patch('users/:id/verify')
  toggleUserVerified(@Request() req: RequestWithUser, @Param('id') id: string) {
    this.checkAdmin(req);
    return this.adminService.toggleUserVerified(id);
  }

  @Delete('users/:id')
  deleteUser(@Request() req: RequestWithUser, @Param('id') id: string) {
    this.checkAdmin(req);
    return this.adminService.deleteUser(id);
  }

  @Get('reports')
  getReports(
    @Request() req: RequestWithUser,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('status') status?: string,
  ) {
    this.checkAdmin(req);
    return this.adminService.getReports({
      page: parseInt(page),
      limit: parseInt(limit),
      status,
    });
  }

  @Patch('reports/:id/status')
  updateReportStatus(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    this.checkAdmin(req);
    return this.adminService.updateReportStatus(id, status);
  }
}
