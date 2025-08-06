import { Controller, Post, Get, Param, UseGuards } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('api/connections')
export class ConnectionController {
  constructor(private readonly connectionService: ConnectionService) {}

  @Post('purchase/:biodataId')
  @UseGuards(JwtAuthGuard)
  async purchaseContact(
    @Param('biodataId') biodataId: string,
    @CurrentUser() user: any
  ) {
    return this.connectionService.purchaseContact(user.id, +biodataId);
  }

  @Get('check-access/:biodataId')
  @UseGuards(JwtAuthGuard)
  async checkContactAccess(
    @Param('biodataId') biodataId: string,
    @CurrentUser() user: any
  ) {
    const hasAccess = await this.connectionService.hasContactAccess(user.id, +biodataId);
    return { hasAccess };
  }

  @Get('contact/:biodataId')
  @UseGuards(JwtAuthGuard)
  async getBiodataContact(
    @Param('biodataId') biodataId: string,
    @CurrentUser() user: any
  ) {
    return this.connectionService.getBiodataContact(user.id, +biodataId);
  }

  @Get('my-connections')
  @UseGuards(JwtAuthGuard)
  async getUserConnections(@CurrentUser() user: any) {
    return this.connectionService.getUserConnections(user.id);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  async getConnectionStats(@CurrentUser() user: any) {
    return this.connectionService.getConnectionStats(user.id);
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard)
  async getAllConnections(@CurrentUser() user: any) {
    // Only superadmin can access all connections
    if (user.role !== 'superadmin') {
      throw new Error('Access denied: Only superadmin can view all connections');
    }
    return this.connectionService.getAllConnections();
  }

  @Get('admin/stats')
  @UseGuards(JwtAuthGuard)
  async getGlobalStats(@CurrentUser() user: any) {
    // Only superadmin can access global stats
    if (user.role !== 'superadmin') {
      throw new Error('Access denied: Only superadmin can view global stats');
    }
    return this.connectionService.getConnectionStats();
  }
}