import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards, Query } from '@nestjs/common';
import { BiodataService } from './biodata.service';
import { CreateBiodataDto } from './dto/create-biodata.dto';
import { UpdateBiodataDto } from './dto/update-biodata.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('api/biodatas')
// @UseGuards(JwtAuthGuard) // Temporarily disabled for debugging
export class BiodataController {
  constructor(private readonly biodataService: BiodataService) {}

  @Post()
  create(@Body() createBiodataDto: CreateBiodataDto, @CurrentUser() user: any) {
    const userId = user?.id || 1; // Fallback for testing
    return this.biodataService.create({ ...createBiodataDto, userId });
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
    @Query('limit') limit?: string,
  ) {
    const filters = {
      gender,
      maritalStatus,
      location,
      biodataNumber,
      ageMin: ageMin ? parseInt(ageMin) : undefined,
      ageMax: ageMax ? parseInt(ageMax) : undefined,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 6,
    };

    return this.biodataService.searchBiodatas(filters);
  }

  @Get('current')
  findCurrent(@CurrentUser() user: any) {
    console.log('Current user:', user); // Debug log
    const userId = user?.id || 1; // Fallback for testing
    return this.biodataService.findByUserId(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.biodataService.findOne(+id);
  }

  @Put('current')
  async updateCurrent(@Body() updateBiodataDto: UpdateBiodataDto, @CurrentUser() user: any) {
    console.log('=== PUT /api/biodatas/current ===');
    console.log('Update current user:', user);
    console.log('Update data type:', typeof updateBiodataDto);
    console.log('Update data:', JSON.stringify(updateBiodataDto, null, 2));
    console.log('Update data keys:', Object.keys(updateBiodataDto || {}));

    const userId = user?.id || 1; // Fallback for testing
    try {
      const result = await this.biodataService.updateByUserId(userId, updateBiodataDto);
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
  update(@Param('id') id: string, @Body() updateBiodataDto: UpdateBiodataDto) {
    return this.biodataService.update(+id, updateBiodataDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.biodataService.remove(+id);
  }

  // For multi-step form: update step and partial data
  @Put(':id/step/:step')
  updateStep(@Param('id') id: string, @Param('step') step: string, @Body() partialData: UpdateBiodataDto) {
    return this.biodataService.updateStep(+id, +step, partialData);
  }
}
