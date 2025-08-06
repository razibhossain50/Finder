import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards, Query, Req, Optional } from '@nestjs/common';
import { BiodataService } from './biodata.service';
import { CreateBiodataDto } from './dto/create-biodata.dto';
import { UpdateBiodataDto } from './dto/update-biodata.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Request } from 'express';

@Controller('api/biodatas')
export class BiodataController {
  constructor(private readonly biodataService: BiodataService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createBiodataDto: CreateBiodataDto, @CurrentUser() user: any) {
    console.log('=== POST /api/biodatas ===');
    console.log('User from JWT:', user);
    console.log('User ID:', user?.id);
    console.log('Create DTO:', createBiodataDto);

    if (!user?.id) {
      console.error('No user ID found in JWT payload');
      throw new Error('User authentication required');
    }

    const dataWithUserId = { ...createBiodataDto, userId: user.id };
    console.log('Data being sent to service:', dataWithUserId);

    return this.biodataService.create(dataWithUserId);
  }

  @Get()
  findAll() {
    return this.biodataService.findAll();
  }

  @Get('search')
  searchBiodatas(
    @Query('gender') gender?: string,
    @Query('maritalStatus') maritalStatus?: string,
    @Query('location') location?: string,
    @Query('biodataNumber') biodataNumber?: string,
    @Query('ageMin') ageMin?: string,
    @Query('ageMax') ageMax?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    const filters = {
      gender,
      maritalStatus,
      location,
      biodataNumber,
      ageMin: ageMin ? parseInt(ageMin) : undefined,
      ageMax: ageMax ? parseInt(ageMax) : undefined,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 6
    };

    return this.biodataService.searchBiodatas(filters);
  }

  @Get('current')
  @UseGuards(JwtAuthGuard)
  findCurrent(@CurrentUser() user: any) {
    if (!user?.id) {
      throw new Error('User authentication required');
    }
    return this.biodataService.findByUserId(user.id);
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard)
  findAllForAdmin(@CurrentUser() user: any) {
    if (!user?.id) {
      throw new Error('User authentication required');
    }

    // Only superadmin can access all biodatas
    if (user.role !== 'superadmin') {
      throw new Error('Access denied: Only superadmin can view all biodatas');
    }

    return this.biodataService.findAllForAdmin();
  }

  @Get('owner/:id')
  @UseGuards(JwtAuthGuard)
  async findOneForOwner(@Param('id') id: string, @CurrentUser() user: any) {
    const biodataId = +id;
    const isOwner = await this.biodataService.validateOwnership(biodataId, user.id);
    if (!isOwner) {
      throw new Error('Access denied: You can only access your own biodata');
    }
    return this.biodataService.findOneForOwner(biodataId);
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateStatus(@Param('id') id: string, @Body() statusData: { status: string }, @CurrentUser() user: any) {
    if (!user?.id) {
      throw new Error('User authentication required');
    }

    // Only superadmin can update biodata status
    if (user.role !== 'superadmin') {
      throw new Error('Access denied: Only superadmin can update biodata status');
    }

    const biodataId = +id;
    return this.biodataService.updateStatus(biodataId, statusData.status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.biodataService.findOne(+id);
  }

  @Put('current')
  @UseGuards(JwtAuthGuard)
  async updateCurrent(@Body() updateBiodataDto: UpdateBiodataDto, @CurrentUser() user: any) {
    console.log('=== PUT /api/biodatas/current ===');
    console.log('Update current user:', user);
    console.log('Update data type:', typeof updateBiodataDto);
    console.log('Update data:', JSON.stringify(updateBiodataDto, null, 2));
    console.log('Update data keys:', Object.keys(updateBiodataDto || {}));

    if (!user?.id) {
      throw new Error('User authentication required');
    }

    try {
      const result = await this.biodataService.updateByUserId(user.id, updateBiodataDto);
      console.log('Controller: Update successful');
      return result;
    } catch (error) {
      console.error('Controller: Error updating biodata:', error);
      console.error('Controller: Error message:', error.message);
      console.error('Controller: Error stack:', error.stack);
      throw error;
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateBiodataDto: UpdateBiodataDto, @CurrentUser() user: any) {
    if (!user?.id) {
      throw new Error('User authentication required');
    }

    // Validate ownership
    const isOwner = await this.biodataService.validateOwnership(+id, user.id);
    if (!isOwner) {
      throw new Error('You can only update your own biodata');
    }

    return this.biodataService.update(+id, updateBiodataDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    if (!user?.id) {
      throw new Error('User authentication required');
    }

    // Allow superadmin to delete any biodata, otherwise validate ownership
    if (user.role !== 'superadmin') {
      const isOwner = await this.biodataService.validateOwnership(+id, user.id);
      if (!isOwner) {
        throw new Error('You can only delete your own biodata');
      }
    }

    return this.biodataService.remove(+id);
  }

  // For multi-step form: update step and partial data
  @Put(':id/step/:step')
  @UseGuards(JwtAuthGuard)
  async updateStep(
    @Param('id') id: string,
    @Param('step') step: string,
    @Body() partialData: UpdateBiodataDto,
    @CurrentUser() user: any
  ) {
    if (!user?.id) {
      throw new Error('User authentication required');
    }

    // Validate ownership
    const isOwner = await this.biodataService.validateOwnership(+id, user.id);
    if (!isOwner) {
      throw new Error('You can only update your own biodata');
    }

    return this.biodataService.updateStep(+id, +step, partialData);
  }

  // Profile view tracking endpoints
  @Post(':id/view')
  async trackProfileView(
    @Param('id') id: string,
    @Req() req: Request
  ) {
    const biodataId = +id;
    const viewerId: number | undefined = undefined; // For now, we'll handle anonymous tracking
    const ipAddress = req.ip || req.connection.remoteAddress || undefined;
    const userAgent = req.get('User-Agent') || undefined;

    return this.biodataService.trackProfileView(biodataId, viewerId, ipAddress, userAgent);
  }

  @Get(':id/view-count')
  async getProfileViewCount(@Param('id') id: string) {
    return { viewCount: await this.biodataService.getProfileViewCount(+id) };
  }

  @Get('current/view-stats')
  @UseGuards(JwtAuthGuard)
  async getUserProfileViewStats(@CurrentUser() user: any) {
    if (!user?.id) {
      throw new Error('User authentication required');
    }
    return this.biodataService.getUserProfileViewStats(user.id);
  }
}
